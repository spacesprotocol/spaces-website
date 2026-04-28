+++
title = "Resolution"
description = "How name resolution works in Spaces"
weight = 40
template = "docs/page.html"
+++

# Resolution

How handles are resolved through the certrelay network.

## Name Types

```
@bitcoin              ← Top-level named space (auction, ~3500/year)
#800-12-0             ← Numeric space (single UTXO binding, format: #<block>-<tx>-<vout>)
alice@bitcoin         ← Sub-handle issued by @bitcoin
bob#800-12-0          ← Sub-handle issued by #800-12-0
```

**Named spaces** (`@bitcoin`) and **numeric spaces** (`#800-12-0`) are both first-class top-level identities. They can both issue sub-handles, hold records, and delegate authority.

Numerics are created by making a UTXO binding on-chain. They don't need to be tied to a named space.

## Canonical Names

Every name has a **canonical form** - the authoritative identifier that never changes:

```
Expanded (human-readable)           Canonical (flattened)
─────────────────────────           ─────────────────────
@bitcoin                        →   @bitcoin
#800-12-0                       →   #800-12-0
alice@bitcoin                   →   alice@bitcoin
bob#800-12-0                    →   bob#800-12-0
charlie.alice@bitcoin           →   charlie#1000-12-1
hello.charlie.alice@bitcoin     →   hello#1200-2-0
```

Names with one or two labels are already canonical. Dotted names (3+ labels) flatten by replacing the parent chain with the innermost alias's numeric ID.

## Aliases and Dotted Names

A sub-handle can create a UTXO binding on-chain and receive its own numeric identity (alias). This lets it issue its own sub-handles.

```
alice@bitcoin creates a UTXO binding → gets alias #1000-12-1

Now alice can issue subs under her numeric:
  charlie#1000-12-1     ← canonical name
  charlie.alice@bitcoin ← expanded (human-readable) name
```

The expanded name `charlie.alice@bitcoin` is a convenience - the canonical name is `charlie#1000-12-1`. Resolution expands dotted names back to their canonical form.

This can nest arbitrarily:

```
charlie#1000-12-1 creates a UTXO binding → gets alias #1200-2-0

hello#1200-2-0                    ← canonical
hello.charlie.alice@bitcoin       ← expanded
hello.charlie#1000-12-1           ← partially expanded
```

## Resolution Flow

### Simple: `alice@bitcoin`

No expansion needed - `alice@bitcoin` is already canonical.

```
Client                           Relay
  │                                │
  │  GET /query?q=alice@bitcoin    │
  │───────────────────────────────>│
  │                                │  Load @bitcoin cert + zone
  │                                │  Load alice@bitcoin cert + zone
  │                                │  Fetch chain proof
  │                                │  Build Message
  │  binary Message                │
  │<───────────────────────────────│
  │                                │
  │  verify(message) → zones       │
  │    @bitcoin                    │
  │    alice@bitcoin               │
```

### Dotted: `charlie.alice@bitcoin`

Dotted names require multi-step resolution. The Fabric client handles this with the `Lookup` helper:

```
Step 1: Resolve alice@bitcoin to learn her alias
─────────────────────────────────────────────────
  Lookup.start() → ["@bitcoin", "alice@bitcoin"]

  Client → Relay: GET /query?q=alice@bitcoin,@bitcoin
  Relay  → Client: zones for @bitcoin + alice@bitcoin

  From alice@bitcoin's zone, the client learns:
    alice has num_id #1000-12-1

Step 2: Resolve charlie under alice's numeric
─────────────────────────────────────────────
  Lookup.advance(zones) → ["#1000-12-1", "charlie#1000-12-1"]

  Client → Relay: GET /query?q=charlie%231000-12-1,%231000-12-1
  Relay  → Client: zones for #1000-12-1 + charlie#1000-12-1

Step 3: Done
────────────
  Lookup.advance(zones) → []

  Lookup.expand_zones(all_zones):
    charlie#1000-12-1 → charlie.alice@bitcoin  (human-readable restored)
```

Each step is a single relay query. The Lookup drives the process:

```rust
let lookup = Lookup::new(["charlie.alice@bitcoin"]);
let mut batch = lookup.start();           // ["@bitcoin", "alice@bitcoin"]

while !batch.is_empty() {
    let verified = fabric.resolve_flat(&batch).await?;
    batch = lookup.advance(&verified.zones); // ["#1000-12-1", "charlie#1000-12-1"]
}

let zones = lookup.expand_zones(all_zones); // human-readable names restored
```

### Deeper nesting: `hello.charlie.alice@bitcoin`

Same process, one more step:

```
Step 1: ["@bitcoin", "alice@bitcoin"]
        → learn alice has alias #1000-12-1

Step 2: ["#1000-12-1", "charlie#1000-12-1"]
        → learn charlie has alias #1200-2-0

Step 3: ["#1200-2-0", "hello#1200-2-0"]
        → resolve hello under charlie's numeric

Step 4: [] (done)
        expand: hello#1200-2-0 → hello.charlie.alice@bitcoin
```

## Records (SIP-7)

Handles can attach signed off-chain records:

```
RecordSet [
  Seq(3)                                          ← version (higher = newer)
  Addr { key: "btc", value: ["bc1q..."] }
  Addr { key: "nostr", value: ["npub1...", "wss://relay..."] }
  Txt  { key: "website", value: ["https://..."] }
  Sig  { canonical: "alice@bitcoin",              ← who signed
         handle: "alice@bitcoin",                 ← human-readable name
         flags: 0x01,                             ← SIG_PRIMARY_ZONE
         sig: <64 bytes> }                        ← BIP-340 Schnorr
]
```

The **Sig** record is embedded in the RecordSet. The `flags` field controls reverse resolution:
- `SIG_PRIMARY_ZONE (0x01)` - this handle claims its `num_id` should resolve back to this human-readable name

## Relay Selection

Fabric checks multiple relays for freshness before querying:

```
Client                    Relay A       Relay B       Relay C
  │                         │             │             │
  │  GET /hints?q=...      ─┼─────────────┼─────────────┤  (parallel)
  │                         │             │             │
  │  ← HintsResponse ──────┼─────────────┼─────────────┤
  │                         │             │             │
  │  Rank by freshness:     │             │             │
  │    epoch_tip            │             │             │
  │    seq, delegate_seq    │             │             │
  │    handle seqs          │             │             │
  │    anchor_tip (tiebreak)│             │             │
  │                         │             │             │
  │  GET /query (freshest) ─>             │             │
  │  ← binary Message ─────<             │             │
  │                         │             │             │
  │  verify(message) ── all verification is local       │
```

## Trust Tiers

Verification uses **trust anchors** - snapshots of Bitcoin's chain state. Three tiers:

```
┌──────────────┬──────────────────────────────────────┬──────────────┐
│ Tier         │ Source                               │ Badge        │
├──────────────┼──────────────────────────────────────┼──────────────┤
│ Trusted      │ QR scan from Veritas desktop app     │ Orange ✓     │
│ Semi-trusted │ QR scan from explorer over HTTPS     │ (no badge)   │
│ Observed     │ Fetched from relay peers             │ "Unverified" │
└──────────────┴──────────────────────────────────────┴──────────────┘
```

All anchor pools are merged into a single Veritas instance. The badge checks which pool the verification roots came from. The QR format is `veritas://scan?id=<trust_id_hex>`. The app decides the trust level - the QR just carries the ID.

## Reverse Resolution

### By Numeric ID

If a handle sets `SIG_PRIMARY_ZONE`, relays index `num_id → handle`:

```
fabric.resolve_by_id("num1qx8dt...")
  → query /reverse?ids=num1... → "alice@bitcoin"
  → resolve("alice@bitcoin") → verify zone.num_id matches
  → return verified zone
```

### By Address

Relays index addresses from Addr records:

```
fabric.search_addr("nostr", "npub1abc...")
  → query /addrs?name=nostr&addr=npub1... → ["alice@bitcoin", "bob@bitcoin"]
  → resolve_all(names) → filter zones containing matching addr record
  → return verified zones
```

Both paths verify forward - the relay's index is untrusted. The client always resolves the human-readable name and checks.

## Epoch Hints

Clients can cache epoch roots to skip redundant proofs:

```
GET /query?q=alice@bitcoin&hints=@bitcoin:abcdef:870000
```

If the relay's epoch matches the hint, it omits the ZK receipt - the client verifies using its cached root instead.

## Publishing

```
1. Pack records       RecordSet::pack([Seq(1), Addr("btc", ["bc1q..."]), ...])
2. Export cert        fabric.export("alice@bitcoin")
3. Sign + broadcast   fabric.publish(cert, records, secret_key, primary=true)
```

Setting `primary=true` enables reverse resolution for this handle's numeric ID.

Internally, `publish` builds a message, fetches a chain proof from a relay, signs each unsigned record set, and broadcasts to multiple relays for gossip propagation.

## Caching

`GET /query` returns `Cache-Control: public, max-age=300`. Cloudflare and browsers cache responses for 5 minutes. Same query from different clients hits the cache.
