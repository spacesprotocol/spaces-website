+++
title = "Spaces client"
description = "The spaces verification client"
weight = 40
template = "docs/page.html"
+++

# Spaces client

## GUI

The easiest way to get started is to use the [Akron wallet](https://akron.io) - a desktop wallet that handles everything for you including syncing and verification. No Bitcoin full node required.

## CLI

### Install Bitcoin Core

Install Bitcoin Core from [bitcoin.org/en/download](https://bitcoin.org/en/download) and let it sync.

### Install Spaces

`spaced` is a tiny layer that connects to Bitcoin Core and scans transactions relevant to the protocol.

```sh
curl --proto '=https' --tlsv1.2 -sSf https://install.spacesprotocol.org | sh
```

Verify installation:

```
spaced --version
space-cli --version
```

### Run Spaces

Once Bitcoin Core is fully synced, start the Spaces daemon:

```sh
spaced
```

It will automatically read Bitcoin Core's cookie file for authentication.

### Create a wallet

```sh
space-cli createwallet
space-cli getnewaddress
```

Send some BTC to the address you get and check your balance:

```
space-cli balance
```

### Auction process

Top level spaces are community identifiers limited to ~3600 spaces a year. Every day, the top 10 highest-bid spaces advance from pre-auctions to auctions.

### Opening an auction

You can check the [explorer](https://explorer.spacesprotocol.org) for currently open auctions. For example to open an auction for the space `@bitcoin`

```bash
space-cli open bitcoin
```

### Placing a bid

Find one of the spaces [currently in auction](https://explorer.spacesprotocol.org/) and place a bid (amount is in sats)

```bash
space-cli bid nostr 1500
```

### Check status of your Spaces

```
space-cli listspaces
```

This will list all spaces you own and spaces currently in auction.

### Claiming a space

If you're currently winning and the space entered the claim period, you can register it!

```sh
space-cli register bitcoin
```

You may also watch the status of auctions on the [explorer](https://explorer.spacesprotocol.org).

### Publish records

Once you register a space, you can publish records over the certrelay network without adding any on-chain bloat!