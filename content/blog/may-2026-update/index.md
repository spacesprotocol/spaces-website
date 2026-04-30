+++
title = "Spaces Protocol: May 2026 Update"
description = "100 million handles, Orbee, Fabric SDK in 7 languages, Certrelay, Veritas, Subs v0.1, and NIP-SPACES."
date = 2026-05-01

[extra]
hero = "orbee-at-claimed.gif"
og_image = "og-image-blog-post.png"
+++

## 100,000,000 handles, anchored in 32 bytes on Bitcoin

The Spaces handle faucet is live. Anyone can claim a free handle in about 10 seconds at [spacesprotocol.org/faucet](https://spacesprotocol.org/faucet) and start building on it right away.

Every one of those 100 million handles is committed to a single 32-byte tree root on Bitcoin. One tiny on-chain footprint, millions of sovereign handles, each as verifiable as Bitcoin itself. Once issued, a handle can't be revoked or expire. It's yours forever.

Note: faucet handles are intended for experimentation. Normally, when you register a sovereign handle through an operator, you hand over only your public key and they include it in the batch. The faucet pre-generates the key pairs itself and bundles them into a batch, so you can claim a handle that's already issued.  The secret key is deleted from the faucet when you claim, but you can also rotate your key after.


<iframe data-src="picker-flow.html" class="post-iframe" inert tabindex="-1" scrolling="no" style="height:720px" title="Pick a handle"></iframe>

[spacesprotocol.org/faucet](https://spacesprotocol.org/faucet)

---

## NIP-SPACES: a sovereign alternative to NIP-05

NIP-05 ties Nostr identities to DNS, which means trust ultimately flows through ICANN, registrars, and certificate authorities. NIP-SPACES swaps that out. Identities are anchored to Bitcoin and verified locally with Merkle proofs. No registrar can revoke you, no DNS hijack can impersonate you, and verification works without trusting anyone's server.

If you've used `name@domain.com` for Nostr verification, NIP-SPACES gives you `name@space` with cryptographic guarantees instead of administrative ones.

[https://github.com/buffrr/nips/blob/spaces/NIP-SPACES.md](https://github.com/buffrr/nips/blob/spaces/NIP-SPACES.md)

---

## Orbee: NIP-29 group chat (beta)

Orbee is what the social layer looks like when handles are sovereign. It's a NIP-29 client running entirely on Nostr relays, so every message is a signed event you can verify yourself. Fabric resolves and verifies handles directly in your browser, so there's no platform in the middle, and no lock-in.

You get groups, reactions, markdown, code blocks, image sharing, and replies. Open data, your keys, your handle.

<iframe data-src="chat-preview.html" class="post-iframe" inert tabindex="-1" scrolling="no" style="height:640px" title="Orbee chat preview"></iframe>

[orbee.chat](https://orbee.chat)

---

## Fabric SDK: now in 7 languages

Fabric is the resolver for the certrelay network, and as of this release it ships for JavaScript, React Native, Rust, Python, Go, Swift, and Kotlin. Whatever stack you're already on, resolving and verifying a Spaces handle is a handful of lines.

{{ snippet(language="js", name="resolve-intro") }}

[spacesprotocol.org/docs/developers/sdk](https://spacesprotocol.org/docs/developers/sdk/)

---

## Certrelay network

Certrelays are the layer that makes handles easy to use without giving up the security of Bitcoin anchoring. They serve certificates with Merkle inclusion proofs that verify against a trust ID, the verifiable, computable replacement for DNS's centralized signing keys.

In practice, this is the infrastructure that lets apps like Orbee confirm handle ownership permissionless-ly.

<iframe data-src="certrelay-anim.html" class="post-iframe" inert tabindex="-1" scrolling="no" style="height:540px" title="Certrelay network"></iframe>

[github.com/spacesprotocol/certrelay](https://github.com/spacesprotocol/certrelay)

---

## Veritas: your local trust anchor

Veritas is a menu bar app that runs a Bitcoin light node and a Spaces client right on your machine. It computes trust IDs locally, so verifying a handle never trusts a third-party server.

Set a trust ID once, and it stays valid for up to 14 days. As long as your contacts haven't rotated their keys, and any new contacts trace back to that root, you're verified end to end.

<div data-trust-inline class="trust-inline-wrap"></div>

[github.com/imperviousinc/veritas](https://github.com/imperviousinc/veritas)

---

## Subs v0.1: a ground-up rewrite

Subs is how Space owners issue handles under their namespace, handles like `alice@bitcoin` or `bob@dev`. The previous version was a command-line prototype. The new one is a real product.

Subs now runs as a long-running daemon with a full web dashboard. Operators can stage handles, build on-chain commitments, generate ZK proofs, broadcast transactions, and publish certificates from a single interface.

The architecture has been split into focused components. The ZK prover runs as its own process, so GPU work can be offloaded to a separate machine. State persists in SQLite alongside per-space tree databases. The daemon drives a `spaced` wallet over RPC, with no manual CLI work required.

The new web UI exposes the full handle lifecycle as a pipeline: stage, commit, prove, broadcast, publish. It also includes bulk handle import, a delegation onboarding flow, an RPC console, transaction management with fee bumping, and health warnings for any untracked on-chain commitments.

For developers, `--features test-rig` spins up a full regtest environment (bitcoind, spaced, and certrelay) automatically, so you can hack on subs without any external infrastructure.

![Subs dashboard screenshot](https://github.com/spacesprotocol/subs/raw/main/screenshot.png)

[github.com/spacesprotocol/subs](https://github.com/spacesprotocol/subs)

---

## New website and docs

The website and documentation have been rebuilt from scratch. New developer SDK pages, design guidelines, a faucet with Orbee integration, a record editor, a trust ID popover, and an interactive playground.

[spacesprotocol.org](https://spacesprotocol.org)

---

## What's next

We're battle testing the protocol changes that bring handle issuance and commitments to Bitcoin mainnet in the [Subspaces branch](https://github.com/spacesprotocol/spaces/tree/subspaces). Auctions for top level spaces continue to work as they do today, and we expect top level spaces to begin production operation in June.

---

Everything above is live right now. Grab a handle at [spacesprotocol.org/faucet](https://spacesprotocol.org/faucet), say hi on [orbee.chat](https://orbee.chat), and if you're building, the SDKs are ready when you are.