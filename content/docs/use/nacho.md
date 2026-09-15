+++
title = "Nacho app"
description = "Nacho is a mobile app for buying, holding and publishing Spaces handles on iOS and Android"
weight = 30
template = "docs/page.html"
+++

# Nacho app

> The fastest way to own a handle - no Bitcoin node, no wallet to set up, no account.

Nacho buys, holds and publishes handles from your phone. The keys are generated on the device and ownership is anchored on-chain, so the handle stays yours even if the app or the people behind it disappear. Available for iOS and Android.

## Download

Get it from [nacho.io](https://nacho.io).

## What it does

**Buy a handle.** Pick a name and pay once - there is no subscription, renewal or expiry to miss.

**Publish records.** A handle is a pointer, and Nacho edits what sits behind it:

- payment addresses - Bitcoin, Lightning, Liquid, Ark, silent payments
- social accounts - Nostr, X, Bluesky, Mastodon, Instagram, GitHub, Telegram
- public keys - PGP, SSH, age, DID
- where to find you - website, note, Tor address

Change any of them whenever you like; the name never changes.

**Look anyone up.** Type a handle to see everything its owner published, and pay them straight from the result.

**Verify on the device.** Lookups are verified on your phone rather than by a server, so no company sits between you and the answer - see [Trust anchor](/docs/use/trust-anchor/) for how that verification works.

## Handles vs. top level names

Nacho deals in handles like `alice@bitcoin` - names issued under a top level space. Acquiring a top level space itself (`@bitcoin`) goes through the Bitcoin auction process instead, covered in [Spaces client](/docs/use/spaces/).