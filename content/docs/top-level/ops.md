+++
title = "Operation"
description = "Operating a top-level Spaces name — issuing handles in batches, on-chain commitments, and the choice between self-operating and delegating to an operator."
weight = 20
template = "docs/page.html"
+++

# Operation

Top-level names can issue handles (subspaces), by submitting batches of commitments on-chain. You may operate a space yourself or delegate to an operator.

## Initiating

```
space-cli operate @bitcoin
```

This creates a delegate UTXO that can be used to submit commitments on behalf of the space.


## Delegating operation

```
space-cli delegate @bitcoin --to <operator-address>
```
