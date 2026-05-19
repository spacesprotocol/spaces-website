+++
title = "Veritas app"
description = "Install the root of trust to verify spaces protocol queries"
weight = 10
template = "docs/page.html"
+++

# Veritas app

Veritas acts as a local certificate authority anchored in Bitcoin. It is the easiest way to obtain a permissionless Trust ID without running a Bitcoin full node.

<a href="https://github.com/imperviousinc/veritas/releases/latest" class="btn btn-primary mb-6">
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z"/></svg>
Download Veritas
</a>

The Veritas desktop menu bar app displays a popover like the one shown below:

<div style="min-height: 400px;" data-trust-inline></div> 

Veritas syncs quickly from a checkpoint, verifies the Bitcoin header chain, and computes the Trust ID locally. For stronger security guarantees, you can also connect Veritas to your own Bitcoin node.


## How does it work?

Spaces performs client-side validation by reading Bitcoin blocks locally and building a verified view of the protocol state. The hash of the resulting anchor set is called the Trust ID.

Scan the Trust ID once in any app that supports Spaces to sync instantly. It stays valid for up to 14 days, so you usually do not need to rescan unless you add newly created contacts or an existing contact rotates their key.