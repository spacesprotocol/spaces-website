+++
title = "Trust anchor"
description = "Install a trust anchor to verify spaces protocol queries with the Veritas app on macOS, or space-cli trust on any platform"
weight = 10
template = "docs/page.html"
aliases = ["/docs/use/veritas/"]
+++

# Trust anchor

A trust anchor is what lets your apps verify handles against Bitcoin itself instead of trusting a server. It's a single id, the **Trust ID**, that you scan or paste once.

The easiest way to get one is the **Veritas** desktop app on macOS. If you're on another platform, or already run a Bitcoin node, `space-cli trust` computes the same id.

## Veritas app (macOS)

Veritas acts as a local certificate authority anchored in Bitcoin. It is the easiest way to obtain a permissionless Trust ID without running a Bitcoin full node.

<a href="https://github.com/imperviousinc/veritas/releases/latest" class="btn btn-primary mb-6">
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z"/></svg>
Download Veritas
</a>

The Veritas desktop menu bar app displays a popover like the one shown below:

<div style="min-height: 400px;" data-trust-inline></div> 

Veritas syncs quickly from a checkpoint, verifies the Bitcoin header chain, and computes the Trust ID locally. For stronger security guarantees, you can also connect Veritas to your own Bitcoin node.

Veritas currently ships for macOS only. On Windows and Linux, use the spaces client below.

## Spaces client (any platform)

`spaced` computes the same Trust ID from your own Bitcoin Core node. Follow [Spaces client](/docs/use/spaces/) to install Bitcoin Core and `spaced`, then once the node has caught up:

```sh
space-cli trust
```

It prints a scannable QR code for the latest Trust ID, followed by the id itself and the block it commits to:

```
[ QR code for veritas://scan?id=… ]
<trust id>  height <block>
```

Scan the QR code from any app that supports Spaces, or copy the hex id. A few flags are available:

- `--all` - list every trust id, newest first
- `--json` - print the raw JSON list
- `--no-qr` - print only the hex id(s)

## How does it work?

Spaces performs client-side validation by reading Bitcoin blocks locally and building a verified view of the protocol state. The hash of the resulting anchor set is called the Trust ID.

Scan the Trust ID once in any app that supports Spaces to sync instantly. It stays valid for up to 14 days, so you usually do not need to rescan unless you add newly created contacts or an existing contact rotates their key.