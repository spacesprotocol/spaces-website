+++
title = "Wallet API"
description = "JSON-RPC wallet API reference"
weight = 30
template = "docs/page.html"
+++

The wallet API uses JSON-RPC 2.0 over the same endpoint as the server API. CLI commands accept an optional `--wallet` / `-w` parameter (defaults to `default`).

## Wallet Management

### listwallets

List all loaded wallet names.

*No parameters.*

```json
{
  "jsonrpc": "2.0",
  "method": "listwallets",
  "params": [],
  "id": 1
}
```

**Returns:** `string[]`

---

### walletcreate

Create a new wallet, returns mnemonic phrase.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Name for the new wallet |

```json
{
  "jsonrpc": "2.0",
  "method": "walletcreate",
  "params": ["mywallet"],
  "id": 1
}
```

**Returns:** `string`

---

### walletrecover

Recover wallet from mnemonic phrase.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Name for the recovered wallet |
| `mnemonic` | string | Yes | BIP-39 mnemonic phrase |

```json
{
  "jsonrpc": "2.0",
  "method": "walletrecover",
  "params": ["mywallet", "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"],
  "id": 1
}
```

**Returns:** `()`

---

### walletload

Load a wallet by name.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Name of the wallet to load |

```json
{
  "jsonrpc": "2.0",
  "method": "walletload",
  "params": ["mywallet"],
  "id": 1
}
```

**Returns:** `()`

---

### walletexport

Export a wallet.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Name of the wallet to export |

```json
{
  "jsonrpc": "2.0",
  "method": "walletexport",
  "params": ["mywallet"],
  "id": 1
}
```

**Returns:** `WalletExport`

---

### walletimport

Import a wallet from export object.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | WalletExport | Yes | Export object containing blockheight, descriptor, and label |

```json
{
  "jsonrpc": "2.0",
  "method": "walletimport",
  "params": [{ "blockheight": 800000, "descriptor": "wpkh(...)", "label": "mywallet" }],
  "id": 1
}
```

**Returns:** `()`

---

### walletgetinfo

Get wallet info including sync status.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Name of the wallet |

```json
{
  "jsonrpc": "2.0",
  "method": "walletgetinfo",
  "params": ["mywallet"],
  "id": 1
}
```

**Returns:** `WalletInfoWithProgress`

---

### walletgetbalance

Get wallet balance.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |

```json
{
  "jsonrpc": "2.0",
  "method": "walletgetbalance",
  "params": ["mywallet"],
  "id": 1
}
```

**Returns:** `Balance`

---

### walletgetnewaddress

Get new address.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |
| `kind` | string | Yes | Address kind: `"Coin"` or `"Space"` |

```json
{
  "jsonrpc": "2.0",
  "method": "walletgetnewaddress",
  "params": ["mywallet", "Coin"],
  "id": 1
}
```

**Returns:** `string`

---

### walletincrementaddress

Increment and return next address.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |
| `kind` | string | Yes | Address kind: `"Coin"` or `"Space"` |

```json
{
  "jsonrpc": "2.0",
  "method": "walletincrementaddress",
  "params": ["mywallet", "Coin"],
  "id": 1
}
```

**Returns:** `string`

---

## Transactions

### walletsendrequest

Send a batch of wallet requests.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |
| `request` | RpcWalletTxBuilder | Yes | Transaction builder object |

The `RpcWalletTxBuilder` object has the following fields:

| Field | Type | Description |
|---|---|---|
| `confirmed_only` | bool | Only use confirmed UTXOs |
| `fee_rate` | number | Fee rate in sat/vB |
| `force` | bool | Force the transaction |
| `requests` | array | Array of request objects |
| `skip_tx_check` | bool | Skip transaction checks |

```json
{
  "jsonrpc": "2.0",
  "method": "walletsendrequest",
  "params": ["mywallet", {
    "confirmed_only": false,
    "fee_rate": 1,
    "force": false,
    "requests": [],
    "skip_tx_check": false
  }],
  "id": 1
}
```

**Returns:** `WalletResponse`

#### Request types

**open** -- Open a space:

```json
{"request": "open", "name": "@example", "amount": 1000}
```

**bid** -- Bid on space:

```json
{"request": "bid", "name": "@example", "amount": 2000}
```

**register** -- Register space:

```json
{"request": "register", "name": "@example"}
```

**transfer** -- Transfer spaces:

```json
{"request": "transfer", "spaces": ["@example"], "to": "bc1q..."}
```

**createnum** -- Create a num:

```json
{"request": "createnum"}
```

**operate** -- Set up operator:

```json
{"request": "operate", "subject": "@example"}
```

**commit** -- Commit root hash:

```json
{"request": "commit", "subject": "@example", "root": "abcdef..."}
```

**delegate** -- Delegate operator:

```json
{"request": "delegate", "subject": "@example", "to": "bc1q..."}
```

**setfallback** -- Set fallback data:

```json
{"request": "setfallback", "subject": "@example", "data": [0, 1, 2]}
```

**send** -- Send coins:

```json
{"request": "send", "amount": 50000, "to": "bc1q..."}
```

---

### walletbumpfee

Bump fee on an existing transaction.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |
| `txid` | string | Yes | Transaction ID to bump |
| `fee_rate` | number | Yes | New fee rate in sat/vB |
| `skip_tx_check` | bool | Yes | Skip transaction checks |

```json
{
  "jsonrpc": "2.0",
  "method": "walletbumpfee",
  "params": ["mywallet", "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", 2, false],
  "id": 1
}
```

**Returns:** `Vec<TxResponse>`

---

### walletforcespend

Force spend outpoint.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |
| `outpoint` | string | Yes | Outpoint to spend (txid:vout) |
| `fee_rate` | number | Yes | Fee rate in sat/vB |

```json
{
  "jsonrpc": "2.0",
  "method": "walletforcespend",
  "params": ["mywallet", "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890:0", 1],
  "id": 1
}
```

**Returns:** `TxResponse`

---

### walletlisttransactions

List transactions with pagination.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |
| `count` | integer | Yes | Number of transactions to return |
| `skip` | integer | Yes | Number of transactions to skip |

```json
{
  "jsonrpc": "2.0",
  "method": "walletlisttransactions",
  "params": ["mywallet", 10, 0],
  "id": 1
}
```

**Returns:** `Vec<TxInfo>`

---

## Space & Num Queries

### walletlistspaces

List all spaces grouped by status.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |

```json
{
  "jsonrpc": "2.0",
  "method": "walletlistspaces",
  "params": ["mywallet"],
  "id": 1
}
```

**Returns:** `ListSpacesResponse`

---

### walletlistnums

List all nums.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |

```json
{
  "jsonrpc": "2.0",
  "method": "walletlistnums",
  "params": ["mywallet"],
  "id": 1
}
```

**Returns:** `ListNumsResponse`

---

### walletlistunspent

List unspent outputs.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |

```json
{
  "jsonrpc": "2.0",
  "method": "walletlistunspent",
  "params": ["mywallet"],
  "id": 1
}
```

**Returns:** `Vec<WalletOutput>`

---

### walletlistbidouts

List bid outputs.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |

```json
{
  "jsonrpc": "2.0",
  "method": "walletlistbidouts",
  "params": ["mywallet"],
  "id": 1
}
```

**Returns:** `Vec<DoubleUtxo>`

---

### walletcanoperate

Check if wallet controls operator num for a given subject.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |
| `subject` | string | Yes | Space name to check |

```json
{
  "jsonrpc": "2.0",
  "method": "walletcanoperate",
  "params": ["mywallet", "@example"],
  "id": 1
}
```

**Returns:** `bool`

---

## Signing

### walletsignschnorr

Sign message with subject's schnorr key.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |
| `subject` | string | Yes | Space name whose key to sign with |
| `message` | string | Yes | Hex-encoded message to sign |

```json
{
  "jsonrpc": "2.0",
  "method": "walletsignschnorr",
  "params": ["mywallet", "@example", "48656c6c6f"],
  "id": 1
}
```

**Returns:** `string`

---

## Marketplace

### walletsell

Create listing to sell space.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |
| `space` | string | Yes | Space name to sell |
| `amount` | integer | Yes | Sale price in satoshis |

```json
{
  "jsonrpc": "2.0",
  "method": "walletsell",
  "params": ["mywallet", "@example", 100000],
  "id": 1
}
```

**Returns:** `Listing`

---

### walletbuy

Buy space from listing.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `wallet` | string | Yes | Name of the wallet |
| `listing` | Listing | Yes | Listing object from walletsell |
| `fee_rate` | number | No | Fee rate in sat/vB |
| `skip_tx_check` | bool | Yes | Skip transaction checks |

```json
{
  "jsonrpc": "2.0",
  "method": "walletbuy",
  "params": ["mywallet", { "space": "@example", "price": 100000, "seller": "bc1q..." }, 1, false],
  "id": 1
}
```

**Returns:** `TxResponse`