+++
title = "Handles on Mainnet!"
description = "Spaces v0.4.2 ships the off-chain issuance layer to mainnet. The first production operator is @bitcoin, issuing handles through the Nacho app."
date = 2026-09-15

[extra]
og_image = "og-image.png"
+++

<div class="theme-media">
<img src="launch-banner-light-v2.gif" alt="Handles are live on Bitcoin" class="light-only">
<img src="launch-banner-dark-v2.gif" alt="Handles are live on Bitcoin" class="dark-only">
</div>

Spaces v0.4.2 ships the off-chain issuance layer to mainnet. Operators can now issue handles under a top level space without an on-chain transaction per name, and clients can verify those handles against the Bitcoin anchored root. Handles are sovereign, irrevocable and permanent.

The first production operator is `@bitcoin`. Handles under it are issued through [atbitcoin.com](https://atbitcoin.com) on the web, or the Nacho app on [iOS](https://apps.apple.com/app/id6755894049) and [Android](https://play.google.com/store/apps/details?id=com.impervious.nacho).

## What a Handle Is

A handle looks like `alice@bitcoin`. It binds a human-readable name to a script pubkey, and that binding lives in a Binary Merkle Trie maintained by the operator of the space. The operator periodically commits the root of that tree to Bitcoin as a single 32-byte hash.

What the holder receives is an off-chain certificate containing two proofs: an inclusion proof showing the handle exists in a committed tree, and a non-existence proof showing it was absent from every prior commitment. Together they establish that the name belongs to its holder and never belonged to anyone else.

Certificates do not expire, and the handle remains yours, forever. There is no renewal and no on-chain transaction required to keep a handle.

## Verifying on a Phone

<img src="aliceatbitcoindemo.svg" alt="alice@bitcoin resolved in Nacho, marked sovereign and verified on-device against the trust anchor, with its records listed below" style="max-width:320px;border:0;background:none">

Most decentralized naming requires a full node to verify anything, which is workable on a server and not on the device where names are actually resolved.

The entire protocol state compresses to a single 32-byte [trust anchor](/docs/use/trust-anchor/). Once a client has that hash, verification is stateless, and a certificate either checks out or it does not.

There are two ways to [derive it yourself](/docs/use/trust-anchor/). The spaces client reads blocks from your own Bitcoin Core node, builds the protocol state locally, and prints the result with `space-cli trust`. Veritas does the same work without a full node, syncing from a checkpoint, verifying Bitcoin's header chain, and scanning only the relevant transactions.

Once you have the anchor, you scan it into a mobile client, where it remains usable for up to two weeks.

Planned for early 2027 is a ~250 KB recursive STARK proof of the same computation, which provides functionally equivalent security to the Veritas desktop app directly on mobile, without needing to scan a trust anchor.

## What an Operator Can and Cannot Do

An operator cannot revoke a handle, redirect it, or recover it. Certificates verify independently of whoever issued them. An operator who goes offline, sells the space, or disappears has no effect on existing holders.

The one thing an operator can break is their own ability to issue. An invalid commitment ends a space's issuance permanently, because every subsequent commitment would need to prove non-existence against a broken predecessor. Handles already issued continue to work.

Anyone can become an operator by bidding on and owning a top level space.

## Nacho

Nacho is a mobile client for handles, available on iOS and Android. It is a resolver, a verifier, and a keystore. It's NOT a wallet. It holds no bitcoin.

Nacho generates a key pair on your device and submits the name and public key to the operator, much like a certificate signing request but cooler. The operator adds the binding to its tree, commits the root on Bitcoin and returns a certificate. The private key never leaves the device, and the operator never sees it.

Nacho resolves handles, verifies certificates on-device against a trust anchor you supply, and lets you update records. Handles are purchased in-app under @bitcoin and the other spaces Nacho operates in its registry. It also accepts creating incusion requests for other top level spaces not operated by Nacho.

Records such as payment addresses, Nostr pubkeys, and websites are published through Certrelay and touch no on-chain bytes.

Nacho is one operator's implementation. The protocol does not depend on it, and any operator can build their own.
## Getting a Handle

Handles under `@bitcoin` are $25, one time, and are issued first come first served. There are two ways to register one:

<div style="display:flex;flex-wrap:wrap;gap:12px;margin:1.5em 0">
<a href="https://atbitcoin.com" class="btn btn-primary">Register on the web</a>
<a href="https://apps.apple.com/app/id6755894049" class="btn btn-secondary"><iconify-icon icon="ph:apple-logo-fill" style="font-size:16px"></iconify-icon> iOS</a>
<a href="https://play.google.com/store/apps/details?id=com.impervious.nacho" class="btn btn-secondary"><iconify-icon icon="ph:google-play-logo-fill" style="font-size:16px"></iconify-icon> Android</a>
</div>

Other spaces set their own terms. `@bitcoin` is the first production operator, not the only possible one.

## Release

v0.4.2 is at [github.com/spacesprotocol](https://github.com/spacesprotocol).

Developers can get a free random test handle from the [faucet](/faucet) to test against, and the [paper](https://spacesprotocol.org/paper) covers the protocol in full.