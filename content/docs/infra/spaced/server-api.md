+++
title = "Server API"
description = "JSON-RPC server API reference"
weight = 20
template = "docs/page.html"
+++

The spaces daemon implements JSON-RPC 2.0. Send POST requests to `http://127.0.0.1:7225` (mainnet default).

### getserverinfo

Get server status including network, sync progress, and chain tip.

| Parameter | Type | Required | Description |
|---|---|---|---|
| _(none)_ | | | This method takes no parameters. |

```json
{
  "jsonrpc": "2.0",
  "method": "getserverinfo",
  "params": [],
  "id": 1
}
```

### getspace

Get full space output by space name or hash. Returns `Option<FullSpaceOut>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `space_or_hash` | string | Yes | A space name (e.g. `"@example"`) or hex hash. |

```json
{
  "jsonrpc": "2.0",
  "method": "getspace",
  "params": ["@example"],
  "id": 1
}
```

### getspaceowner

Get the outpoint that owns a space. Returns `Option<OutPoint>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `space_or_hash` | string | Yes | A space name (e.g. `"@example"`) or hex hash. |

```json
{
  "jsonrpc": "2.0",
  "method": "getspaceowner",
  "params": ["@example"],
  "id": 1
}
```

### getspaceout

Get a space output by outpoint. Returns `Option<SpaceOut>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `outpoint` | string | Yes | An outpoint in `txid:vout` format. |

```json
{
  "jsonrpc": "2.0",
  "method": "getspaceout",
  "params": ["a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2:0"],
  "id": 1
}
```

### getnum

Get full num output by numeric id or num id. Returns `Option<FullNumOut>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `subject` | string | Yes | A numeric id (e.g. `"#1-2-3"`). |

```json
{
  "jsonrpc": "2.0",
  "method": "getnum",
  "params": ["#1-2-3"],
  "id": 1
}
```

### getnumowner

Get the outpoint that owns a num. Returns `Option<OutPoint>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `subject` | string | Yes | A numeric id (e.g. `"#1-2-3"`). |

```json
{
  "jsonrpc": "2.0",
  "method": "getnumowner",
  "params": ["#1-2-3"],
  "id": 1
}
```

### getnumout

Get a num output by outpoint. Returns `Option<NumOut>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `outpoint` | string | Yes | An outpoint in `txid:vout` format. |

```json
{
  "jsonrpc": "2.0",
  "method": "getnumout",
  "params": ["a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2:0"],
  "id": 1
}
```

### getcommitment

Get commitment for a subject, optionally at a specific root. Returns `Option<Commitment>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `subject` | string | Yes | The subject to look up (e.g. `"@example"` or `"#1-2-3"`). |
| `root` | string | No | An optional root hash to query at a specific state. |

```json
{
  "jsonrpc": "2.0",
  "method": "getcommitment",
  "params": ["@example"],
  "id": 1
}
```

### getdelegation

Get the operator num id delegated for a subject. Returns `Option<NumId>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `subject` | string | Yes | The subject to look up (e.g. `"@example"`). |

```json
{
  "jsonrpc": "2.0",
  "method": "getdelegation",
  "params": ["@example"],
  "id": 1
}
```

### getdelegator

Get the subject that a num is operating for. Returns `Option<SLabel>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `subject` | string | Yes | The operator num (e.g. `"#1-2-3"`). |

```json
{
  "jsonrpc": "2.0",
  "method": "getdelegator",
  "params": ["#1-2-3"],
  "id": 1
}
```

### estimatebid

Estimate minimum bid to enter a rollout at target. Returns `u64`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `target` | integer | Yes | The target rollout position. |

```json
{
  "jsonrpc": "2.0",
  "method": "estimatebid",
  "params": [10],
  "id": 1
}
```

### getrollout

Get rollout entries for target. Returns `Vec<RolloutEntry>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `target` | integer | Yes | The target rollout position. |

```json
{
  "jsonrpc": "2.0",
  "method": "getrollout",
  "params": [10],
  "id": 1
}
```

### getblockmeta

Get spaces block metadata by height or hash. Returns `BlockMetaWithHash`. Requires the `--block-index` flag.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `height_or_hash` | integer or string | Yes | A block height (integer) or block hash (hex string). |

```json
{
  "jsonrpc": "2.0",
  "method": "getblockmeta",
  "params": [850000],
  "id": 1
}
```

### getnumblockmeta

Get nums block metadata by height or hash. Returns `NumBlockMetaWithHash`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `height_or_hash` | integer or string | Yes | A block height (integer) or block hash (hex string). |

```json
{
  "jsonrpc": "2.0",
  "method": "getnumblockmeta",
  "params": [850000],
  "id": 1
}
```

### gettxmeta

Get transaction metadata by txid. Returns `Option<TxEntry>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `txid` | string | Yes | The transaction id (hex string). |

```json
{
  "jsonrpc": "2.0",
  "method": "gettxmeta",
  "params": ["a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"],
  "id": 1
}
```

### checkpackage

Simulate transactions and return changesets. Returns `Vec<Option<TxChangeSet>>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `txs` | string[] | Yes | An array of raw transaction hex strings. |

```json
{
  "jsonrpc": "2.0",
  "method": "checkpackage",
  "params": [["0200000001..."]],
  "id": 1
}
```

### getfallback

Get fallback data and parsed SIP-7 records. Returns `Option<FallbackResponse>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `subject` | string | Yes | A subject identifier (`@space`, `#numeric`, `num1...`). |

```json
{
  "jsonrpc": "2.0",
  "method": "getfallback",
  "params": ["@example"],
  "id": 1
}
```

### verifylisting

Verify a sale listing is valid. Returns `()`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `listing` | object | Yes | An object with `space` (string), `price` (integer, sats), and `seller_psbt` (string, base64). |

```json
{
  "jsonrpc": "2.0",
  "method": "verifylisting",
  "params": [{"space": "@example", "price": 100000, "seller_psbt": "cHNidP8B..."}],
  "id": 1
}
```

### verifyschnorr

Verify a schnorr signature. Returns `bool`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `subject` | string | Yes | The subject whose key is used for verification. |
| `message` | string | Yes | The message as a hex string. |
| `signature` | string | Yes | The schnorr signature as a hex string. |

```json
{
  "jsonrpc": "2.0",
  "method": "verifyschnorr",
  "params": ["@example", "deadbeef...", "a1b2c3d4..."],
  "id": 1
}
```

### buildchainproof

Build chain proof for verifying state. Returns `ChainProofResult`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request` | object | Yes | An object with a `keys` array of subjects to prove. |
| `prefer_recent` | bool | No | If `true`, prefer the most recent proof. |

```json
{
  "jsonrpc": "2.0",
  "method": "buildchainproof",
  "params": [{"keys": ["@example"]}, true],
  "id": 1
}
```

### getrootanchors

Get all root anchors for chain proof verification. Returns `Vec<RootAnchor>`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| _(none)_ | | | This method takes no parameters. |

```json
{
  "jsonrpc": "2.0",
  "method": "getrootanchors",
  "params": [],
  "id": 1
}
```