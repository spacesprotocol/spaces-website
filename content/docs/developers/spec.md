+++
title = "Specification"
description = "Technical specification of the Spaces Protocol"
weight = 10
template = "docs/page.html"
+++

# Specification

For a high-level overview of the protocol design, read the [white paper](/paper).

> **Note:** This documents the Spaces protocol implementation details but is not a complete formal specification.

## 1. Overview

Spaces is a naming protocol on Bitcoin that uses UTXO-based auctions to allocate human-readable names. Each space is a Bitcoin UTXO carrying a name and a covenant that governs its lifecycle: auction, ownership, and renewal. The protocol operates entirely on-chain by interpreting transaction structure and specific signaling patterns, requiring no soft fork.

Spaces also supports **nums** (numeric identifiers), which provide infrastructure for off-chain commitments, delegation, and subspace handles.

### 1.1 Activation Heights

| Network  | Spaces Height | Nums Height |
|----------|--------------|-------------|
| Mainnet  | 871,222      | 922,777     |
| Testnet4 | 50,000       | 100,008     |
| Regtest  | 0            | 0           |

## 2. Names

Space names are single DNS labels prefixed with `@` (e.g., `@bitcoin`). Internally they are stored in a length-prefixed format: `[len][label_bytes...]`, where `len` is a single byte.

**Rules:**
- Maximum label length: 62 bytes
- Allowed characters: `a-z`, `0-9`, `-`
- Hyphens may not appear at the start or end, and consecutive hyphens (`--`) are not allowed (except within the `xn--` punycode prefix)
- Punycode labels must have the `xn--` prefix followed by at least one character
- Names beginning with `#` are **numeric labels** (see [Section 9](#9-nums)) and cannot be opened via auction
- Reserved names that cannot be opened: `example`, `test`, `local`

## 3. Tracking Signals

The protocol identifies relevant transactions without scanning all UTXOs by using specific signaling patterns.

### 3.1 Spaces Transactions

A transaction is relevant to the Spaces protocol if any of:
- It spends an existing tracked output, OR
- Its locktime (interpreted as seconds) satisfies `seconds % 1000 == 222` AND at least one output has a magic amount

**Output value signal:**

An output is trackable by the protocol when `value % 10 == 2`. These are the outputs that can carry space covenants.

### 3.2 Nums Transactions

A transaction is relevant to the nums subsystem if any of:
- It spends an existing num output, OR
- Its locktime (interpreted as seconds) satisfies `seconds % 1000 == 777` AND at least one output has a num value

**Output value signals:**
| Signal | Condition | Purpose |
|--------|-----------|---------|
| Num output | `value % 10 == 7` | Trackable num output (required for minting new nums) |
| Delegate opt-in | `value % 10 == 8` | Signals delegation when a num is rebound to this output |

New nums are minted only when `% 10 == 7`. When an existing num is rebound (spent to a new output), the output value can change freely. If the rebound output has `value % 10 == 8`, the num opts into delegation at that output's address.

## 4. Opening an Auction

To open an auction for a space name, a taproot leaf script is revealed with the following structure:

```
PUSH [magic_bytes || dns_encoded_name] OP_DROP
```

**Magic bytes:** `0xDE 0xDE 0xDE 0xDE 0x01` (5 bytes)

The payload after the magic is the name in length-prefixed format (e.g., `\x07example` for `@example`).

**Validation rules:**
- The name must be a valid SLabel (see Section 2)
- Numeric names (`#...`) are rejected
- Reserved names (`example`, `test`, `local`) are rejected
- If the name already exists and is **not expired**, the open is rejected with `AlreadyExists`
- If the name exists but **is expired**, the previous space is revoked and the name re-enters auction
- A valid bid PSBT must be present (see Section 6)
- The taproot leaf must use `TapScript` version

## 5. Data

Data can be attached to spaces and nums using an `OP_RETURN` output:

```
OP_RETURN OP_PUSHNUM_1 <data>
```

This replaces the previous `OP_SETFALLBACK` witness script. Data is extracted from the first matching output in the transaction. When a space is transferred, its existing data is preserved unless a new data output is present in the same transaction.

For nums, data is only updated if:
1. A data `OP_RETURN` is present in the transaction
2. The num's previous output is P2TR
3. The spending input uses `SIGHASH_ALL` (64-byte signature for `SIGHASH_DEFAULT`, or 65-byte signature with `0x01` suffix)

## 6. Auction Mechanics

### 6.1 Rollout

New spaces enter the auction system through a rollout process:

- Every **144 blocks** (~1 day), up to **10 spaces** are rolled out
- Rolled-out spaces receive a `claim_height` of `current_height + 1440`
- Spaces are selected from a priority queue ordered by their initial bid amount
- Rollout entries are associated with the coinbase transaction of the rollout block

### 6.2 Pre-Auction Phase

Before rollout, spaces exist in a pre-auction phase:
- `claim_height` is `None`
- Bids can be placed to increase priority in the rollout queue
- Non-bid spends during this phase result in revocation (`PrematureClaim`)

### 6.3 Auction Phase

After rollout, the auction runs for **1440 blocks** (~10 days):

- Any bid placed during the auction extends the deadline: `new_claim_height = max(current_height + 144, existing_claim_height)`
- Each bid must burn more BTC (`burn_increment > 0`)
- `total_burned` accumulates across all bids
- The space UTXO moves to the new bidder's output

### 6.4 Bid PSBT Format

Bids use a compressed PSBT carried in the first output of the transaction:

```
OP_RETURN [65 bytes: 1-byte vout || 64-byte schnorr signature]
```

The compressed PSBT encodes:
- **vout** (1 byte): Output index of the auctioned UTXO in the referenced transaction
- **signature** (64 bytes): Schnorr signature over the bid PSBT

The bid PSBT is reconstructed for signature verification:
- `tx.version = 2`
- `tx.lock_time = 0` (blocks)
- Input sequence: `ENABLE_RBF_NO_LOCKTIME` (`0xFFFFFFFD`)
- Input: the auctioned UTXO (`tx.input[0].previous_output.txid` + `vout`)
- Output: refund to the auctioned UTXO's address for `value + total_burned`
- Sighash type: `SIGHASH_SINGLE|SIGHASH_ANYONECANPAY`

The signature is verified against the x-only public key extracted from the P2TR `script_pubkey` of the auctioned output.

### 6.5 Bid Spend Detection

An input is a bid spend (as opposed to a registration) when all of:
- `tx.version == 2`
- `input.sequence == 0xFFFFFFFD`
- Witness has exactly 1 element of exactly 65 bytes
- Last witness byte is `0x83` (`SIGHASH_SINGLE|SIGHASH_ANYONECANPAY`)
- The first 64 bytes match the current covenant's signature

### 6.6 Registration (Claim)

After `claim_height` is reached, the winning bidder registers the space:
- The spend must NOT be a bid spend (see above)
- The space transitions from `Bid` to `Transfer` covenant
- `expire_height` is set to `current_height + 52560`
- The space UTXO moves to output at index `input_index + 1`

## 7. Covenant Types

### 7.1 Bid

```
Bid {
    burn_increment: Amount,    // Current bid's burn amount
    signature: Signature,      // 64-byte schnorr signature
    total_burned: Amount,      // Cumulative BTC burned
    claim_height: Option<u32>, // None = pre-auction; Some = block when claimable
}
```

### 7.2 Transfer

```
Transfer {
    expire_height: u32,        // Block height at which ownership expires
    data: Option<Bytes>,       // Associated data (set via OP_RETURN OP_PUSHNUM_1)
}
```

The `Transfer` covenant represents ownership. The owner may transfer the space by spending the UTXO and placing the new output at `input_index + 1`. Each transfer resets `expire_height` to `current_height + 52560`.

## 8. Space UTXO Movement

Spaces follow an **N to N+1 rule**: when a space UTXO is spent at input index N, the space must appear at output index N+1 in the same transaction. If no output exists at N+1, the space is revoked (`BadSpend`).

If output N+1 is already occupied by another space output, the spend is also revoked.

## 9. Expiration and Renewal

- **Renewal interval:** 52,560 blocks (~1 year, based on 144 blocks/day * 365)
- A space expires when `expire_height < current_block_height`
- Any transfer (spend following the N+1 rule) resets the expiration
- Expired spaces are revoked with reason `Expired`
- Once expired and revoked, a space's name can be re-opened for auction via OP_OPEN

## 10. Nums

Nums are numeric identifiers created on-chain. Unlike spaces, they do not go through an auction and are created by signaling in a transaction.

### 10.1 Creation

A num is created when:
1. The transaction locktime satisfies `seconds % 1000 == 777`
2. An output has `value % 10 == 7`
3. No existing num has the same `NumId` derived from that output's `script_pubkey`
4. The output is not already claimed by a space output

### 10.2 NumId

A `NumId` is a 32-byte identifier derived from the output's `script_pubkey`:

```
NumId = ns_hash(KeyKind::NumId, hash(script_pubkey))
```

Where `ns_hash(kind, data) = hash([kind_byte] || data)`.

NumIds are encoded as bech32m strings with the HRP `"num"` (e.g., `num1...`).

### 10.3 SNumeric

Each num also has a human-readable identifier based on its creation position:

```
#<block_height>-<tx_position>-<vout>
```

For example, `#800000-3-1` refers to the num created at block 800,000, transaction position 3, output 1.

### 10.4 Num UTXO Rebinding

Nums follow a similar N/N+1 rebinding rule:
1. If the output at the same index N as the input has the same value, the num rebinds there
2. Otherwise, the num rebinds to output N+1
3. If neither exists, the num is not rebound (effectively destroyed)
4. If the candidate output is already occupied by a space, the num cannot rebind there

### 10.5 Num Data

Nums carry optional data, updated via `OP_RETURN OP_PUSHNUM_1 <data>` (same format as spaces). Data is only updated when the spending input satisfies the `SIGHASH_ALL` check on a P2TR output.

## 11. Commitments

Commitments allow operators to publish state roots on-chain, enabling merkle proof verification for off-chain state.

### 11.1 Format

Commitments use an `OP_RETURN` output:

**Commit:**
```
OP_RETURN OP_PUSHNUM_2 <data>
```

Where `<data>` is one or more 32-byte roots concatenated. The total payload must be a multiple of 32 bytes.

**Rollback:**
```
OP_RETURN OP_PUSHNUM_2 OP_PUSHBYTES_0
```

An empty payload signals a rollback of the most recent pending commitment.

### 11.2 Commitment Structure

```
Commitment {
    state_root: [u8; 32],      // Current state root
    prev_root: Option<[u8; 32]>, // Previous finalized root (None for genesis)
    rolling_hash: [u8; 32],    // hash(prev_rolling_hash || state_root)
    block_height: u32,         // Block at which commitment was made
}
```

For the first commitment (no prior finalized state), `rolling_hash = state_root`.

For subsequent commitments:
```
rolling_hash = hash(previous_finalized.rolling_hash || state_root)
```

### 11.3 Finality

- **Finality interval:** 144 blocks
- A commitment is finalized when `current_height > block_height + 144`
- Only pending (non-finalized) commitments can be rolled back
- A new commitment replaces any existing pending commitment (the old pending one is revoked)
- Multiple commitment roots can be packed into a single `OP_RETURN` output, each consumed by a different delegated input

## 12. Operator Delegation

Delegation allows a num to act as an operator for a space or another num, enabling the operator to make commitments on behalf of the subject.

### 12.1 Space Delegation

Delegation for spaces happens automatically:
- When a space enters the `Transfer` covenant (registration or transfer), a delegation is created
- The delegation maps `NumId::from_spk(space_script_pubkey)` to the space's name
- When the space UTXO is spent, the delegation at the old address is revoked
- A new delegation is created at the new output address
- Spaces still in auction (`Bid` covenant) are not delegatable

### 12.2 Num-to-Num Delegation (Operate)

A num can delegate to an operator num:
1. The source num creates an output with `value % 10 == 8` (delegate dust)
2. The output's `script_pubkey` determines the operator via `NumId::from_spk(script_pubkey)`
3. A delegation is created mapping the operator's `NumId` to the source num's `SNumeric` label
4. Num-to-num delegation is skipped when the transaction involves space UTXOs (to prevent overwriting space delegations at the same `NumId`)

### 12.3 Revocation

Num-to-num delegations are revoked when:
- The source num is spent AND the operator `NumId` (from `script_pubkey`) differs from the num's own `id`
- This allows re-delegation by spending the num to a new operator address

Revoked delegations are cleared before new delegations are processed, allowing re-delegation within the same transaction.

### 12.4 Commitment Flow

When an operator transaction includes a commitment `OP_RETURN`:
1. Each input num with an active delegation can consume one commitment root
2. Commitment roots are consumed in input order
3. Rollback applies to ALL delegates with pending commitments in the transaction
4. A new commitment replaces (revokes) any existing pending commitment for that subject

## 13. Chain Proofs

Chain proofs provide cryptographic verification of on-chain state using two merkle tries:

1. **Spaces tree**: Contains space outpoints keyed by the space name hash
2. **Nums tree**: Contains num data keyed by various key kinds:
    - `NumId` keys for num identity
    - `NumOutpoint` keys for num UTXO locations
    - `SNumeric` keys for numeric name lookups
    - `Commitment` keys for state root entries
    - `CommitmentTip` keys for latest commitment pointers
    - `Delegator` keys for delegation mappings

### 13.1 Proof Requests

A `ChainProofRequest` specifies:
- `spaces`: List of space names to prove (resolved to outpoint keys)
- `nums`: List of typed num keys to prove (`Id`, `Num`, `Commitment`, `CommitmentTip`)

### 13.2 Root Anchor

The proof response includes a `RootAnchor`:
```
RootAnchor {
    spaces_root: [u8; 32],         // Merkle root of spaces tree
    nums_root: Option<[u8; 32]>,   // Merkle root of nums tree
    block: ChainAnchor,            // Block hash and height
}
```

## 14. Subspaces

Subspaces provide off-chain identity handles under a parent space, using the commitment and delegation infrastructure.

### 14.1 Handle Format

Subspace handles follow an email-like format:

```
alice@bitcoin
```

Where `bitcoin` is the parent space and `alice` is the subspace handle.

### 14.2 Certificates

A certificate proves a handle's inclusion in a parent space's committed state:

- The parent space operator commits state roots on-chain via the commitment mechanism
- Each state root corresponds to a merkle trie of handle-to-record mappings
- A certificate contains:
    - The handle and its associated records
    - A merkle inclusion proof against a committed state root
    - The chain proof linking the state root to the Bitcoin chain

### 14.3 State Transitions

State transitions for subspaces are append-only:
- New handles can be added
- Existing handle records can be updated
- Handles cannot be deleted (preserving liveness guarantees)

### 14.4 Verification

To verify a subspace handle:
1. Verify the merkle proof against the committed `state_root`
2. Verify the commitment exists on-chain via chain proof
3. Verify the commitment is finalized (144+ blocks deep)
4. Verify the `rolling_hash` chain for commitment continuity

## Appendix: Protocol Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `ROLLOUT_BLOCK_INTERVAL` | 144 | Blocks between rollouts |
| `ROLLOUT_BATCH_SIZE` | 10 | Spaces per rollout |
| `AUCTION_DURATION` | 1,440 | Auction length in blocks |
| `AUCTION_EXTENSION_ON_BID` | 144 | Extension on late bid |
| `RENEWAL_INTERVAL` | 52,560 | Blocks between renewals |
| `COMMITMENT_FINALITY_INTERVAL` | 144 | Blocks until commitment is final |
| `BID_PSBT_TX_VERSION` | 2 | Bid PSBT transaction version |
| `BID_PSBT_INPUT_SEQUENCE` | 0xFFFFFFFD | RBF-enabled, no locktime |
| `COMPRESSED_PSBT_SIZE` | 65 | 1 byte vout + 64 byte signature |
| `MAX_LABEL_LEN` | 62 | Maximum space name length |
| `OPEN_MAGIC` | `0xDEDEDEDE01` | OP_OPEN magic prefix |
| `NUM_HRP` | `"num"` | Bech32m HRP for NumId encoding |
