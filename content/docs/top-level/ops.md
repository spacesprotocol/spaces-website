+++
title = "Operation"
description = "How the auction mechanism works"
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
