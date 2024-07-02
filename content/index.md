+++
title = 'Spaces Protocol | Scalable & Permissionless Bitcoin Identities'
date = 2024-07-01T12:54:32-07:00
draft = false
+++

<div style="text-align: center;margin-bottom:4em;margin-top:4em;">
  <h1 style="font-size:4em;margin-bottom:-0.1em;margin-left:0;margin-right:0;margin-top:0;">Spaces Protocol</h1>
  <p style="font-size: 1.4em">Scalable & Permissionless Bitcoin Identities</h1>
</div>


Spaces is a naming protocol that leverages the existing infrastructure and security of Bitcoin without requiring a new blockchain or any modifications to Bitcoin itself. Spaces is a permissionless protocol and can be used as decentralized social handles for [Nostr](https://nostr.com/), receiving payments and other digital interactions. On-chain Spaces are represented as Bitcoin UTXOs, they take full advantage of Bitcoin's security, and have minimal on-chain footprint.



# Bitcoin Testnet

You can now try the base functionality of the Spaces protocol on [Bitcoin testnet3](https://mempool.space/testnet)! First, download Bitcoin Core and set it up using these steps:

<img src="/images/bcs.png" alt="Spaces Protocol" style="width:100%;margin-top:2em;margin-bottom:2em;">


## Prerequisites

- [Bitcoin Core](https://bitcoincore.org/en/download/)
- [Rust](https://www.rust-lang.org/tools/install)



## Testnet sync

```bash
# Create a directory for Bitcoin testnet data
mkdir $HOME/bitcoin-testnet

# Create a configuration file with RPC credentials
echo "rpcuser=test" > $HOME/bitcoin-testnet/bitcoin.conf
echo "rpcpassword=test" >> $HOME/bitcoin-testnet/bitcoin.conf

# Start Bitcoin Core in testnet mode
bitcoind -testnet -datadir=$HOME/bitcoin-testnet
```

Spaces protocol is activated on Bitcoin testnet block `2865460` - wait for `bitcoind` to sync up to that block before proceeding.

## Install `spaced` 

`spaced` is a tiny layer on top of Bitcoin Core allowing you to interact with Spaces. To compile `spaced`, you need to install Rust and then

```bash  
# Clone the repository
git clone https://github.com/spacesprotocol/spaced && cd spaced

# Build the release version
cargo build --release

# Install the binaries
cargo install --path .

# Ensure Cargo's bin directory is in your PATH
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Verify you have `spaced` and `space-cli` installed:

```bash
spaced --version
space-cli --version
```

## Connect to Bitcoin Core

```bash
spaced --chain testnet --bitcoin-rpc-user test --bitcoin-rpc-password test
```


## Creating a wallet

`space-cli` is a command-line tool that makes it easy to interact with Spaces. It also functions as a Bitcoin wallet. To create a new wallet, run:


```bash
space-cli createwallet <optional-wallet-name>
```


## Getting testnet coins

You can get testnet coins from a [testnet faucet](https://bitcoinfaucet.uo1.net/) but these faucets give very small amounts. If you need more, you can ask in the [Spaces Telegram](https://t.me/spacesprotocol) group.

```bash
space-cli getnewaddress
```

The `getnewaddress` command will return an address you can use to receive testnet coins compatible with most Bitcoin wallets. You
can also use `getnewspaceaddress` to return a special Bitcoin address for receiving Spaces. 

Check your balance:

```bash

space-cli balance
```


## Opening an auction

To open an auction for a Space, run:

```bash
space-cli open bitcoin
```

You will get a similar output to this

```json
[
  {
    "txid": "fa55b7e5e5b54e170a99f26dcb43baf207d922efb8d69304993c255f61c6ca43",
    "tags": ["auction-outputs", "commitment"]
  },
  {
    "txid": "aeba215372b5095640416c7bac31feecdb8cc0589803172939c0fb0b233d6785",
    "tags": ["open"]
  }
]
```

The tags field indicate the reason(s) for this transaction. In this case, the first is creating a P2TR script commitment and initial outputs to auction off. 
Second one opens the auction by revealing the Space.


## Placing a bid

To place a bid on an open auction:

```bash
space-cli bid bitcoin 1500
```  

Bid amounts are in satoshis.


## Space details

```bash
space-cli getspace bitcoin
```


```json
{
  "outpoint": "45b06887c6f560af607f833fe78edd40327b177a60c9c22b21894510cd094b7c:1",
  "value": 662,
  "script_pubkey": "5120dcb42260e175ed4c27709ca0b9246a2a0506471bbac000c7caf5503c5f5ff176",
  "name": "@bitcoin",
  "covenant": {
    "type": "bid",
    "burn_increment": 1000,
    "signature": "........",
    "total_burned": 1000,
    "claim_height": null
  }
}
```



You can use `listspaces` command to see all outputs representing spaces you own
including outputs that are actively in an auction.


The `bid` covenant indicates spending this output requires either another bid spend or a registration spend if the claim height is reached. There are three types of covenants: `bid`, `transfer`, and `reserved`.

Spends that don't satisfy a covenant condition will be revoked by the protocol causing the winner bidder to lose any coins they have burned or ownership of their name.


The `claim_height` field is not populated in the above output indicating the name is still in the pre-auctions phase. Every 144 blocks, the top 10 names with highest bids are rolled out to the auctions.

Once a Space is in the auctions phase, the `claim_height` indicates the block height at which the winning bidder may register the Space.

Auctions continue indefinitely until a winning bidder claims their Space.


## Registering a Space

To register a Space:

```bash
space-cli register bitcoin
```

If you are the winning bidder and registering after the `claim_height`, you will get something like this:


```json
{
  "outpoint": "45b06887c6f560af607f833fe78edd40327b177a60c9c22b21894510cd094b7c:1",
  "value": 662,
  "script_pubkey": "5120dcb42260e175ed4c27709ca0b9246a2a0506471bbac000c7caf5503c5f5ff176",
  "name": "@bitcoin",
  "covenant": {
    "type": "transfer",
    "expire_height": 2918106,
    "data": null,
  }
}
```


## Receiving payments

As a Space owner you can receive payments by sharing your Space handle.

```bash
space-cli send 1000 --to @bitcoin
```
Amount is in satoshis.


## More information

Use `space-cli help` to see all other available commands and options. Ask in the [Spaces Telegram](https://t.me/spacesprotocol) group if you have any questions or need help.