+++
title = "Handles"
description = "Sovereign individual identities within a community Space"
weight = 10
template = "docs/page.html"
+++

# Handles

A Handle (aka "subspace", "subname" or "sub") is an individual identity within a Space. In the handle `alice@bitcoin`, **alice** is the subspace and **@bitcoin** is the top-level Space. Other examples: `bob@nostr`, `mike@x`.

## How they work

Top-level Spaces are acquired through on-chain auctions. Subspaces are issued **off-chain** by the Space's operator and organized into a Merkle tree. The operator commits the root of this tree on-chain as a compact 32-byte hash. This means millions of subspaces can exist under a single Space with minimal on-chain footprint. Operators can continue to issue new batches of commitments by proving off-chain that those names didn't exist in a prior batch.

## Sovereignty

Once issued, a handle is **sovereign and non-revocable**. It functions entirely off-chain, indefinitely, without renewal or any on-chain interaction. The owner holds a certificate - a cryptographic proof of ownership - that remains valid even if the operator disappears.

## Certificates

A certificate proves two things:

- **Inclusion**: the handle exists in the committed Merkle tree.
- **Non-existence in prior roots**: the handle was not present in any previous commitment, preventing double-issuance.

To keep certificates compact, recursive zk-SNARK or STARK proofs can compress the full chain of non-existence checks into a single succinct proof.

## Operators

Operators are the owners of top-level Spaces. Their responsibilities:

- Maintain the subspace tree and issue new subspaces.
- Submit commitment roots on-chain.
- Each commitment is a 32-byte hash regardless of how many subspaces are issued.

Operators are **not trusted** with the security of existing subspaces. Once a certificate is issued, it functions independently. However, submitting an invalid commitment permanently breaks the ability to issue new subspaces for that Space, and still will not affect existing subspaces.

## UTXO binding

Most subspace owners rely entirely on off-chain certificates. For things like key rotation or trading, a subspace can be bound to an on-chain UTXO. Because each subspace maps to a unique script pubkey, the UTXO itself is the binding with no extra metadata needed on-chain.

## Loss of liveness

If an operator stops submitting commitments, existing subspace holders are unaffected. Certificates provide complete ownership proof independent of the operator.

If the parent Space expires and is reacquired, the new operator must prove that proposed names did not previously exist, requiring the complete subspace tree. If the tree is unavailable, the Space permanently loses the ability to issue new subspaces. Existing subspaces continue to function regardless.

For a more technical explanation, see the [white paper](/paper).