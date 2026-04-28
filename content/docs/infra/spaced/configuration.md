+++
title = "Configuration"
description = "Configure the Spaces daemon"
weight = 10
template = "docs/page.html"
+++

# Configuration

The Spaces daemon listens on the following ports by default:

| Network | Port |
|---|---|
| Mainnet | 7225 |
| Testnet4 | 7224 |
| Regtest | 7218 |

## Options

All arguments can be specified as environment variables with `SPACED_` prefix and `UPPER_SNAKE_CASE`.

| Option | Description | Default |
|---|---|---|
| `--chain` | Network to use: mainnet, testnet4, regtest | mainnet |
| `--data-dir` | Custom data directory to store spaced state | Platform default |
| `--bitcoin-rpc-url` | Bitcoin RPC URL | Based on `--chain` e.g. `http://127.0.0.1:8332` for mainnet |
| `--bitcoin-rpc-cookie` | Bitcoin RPC cookie file path | None |
| `--bitcoin-rpc-user` | Bitcoin RPC user | None |
| `--bitcoin-rpc-password` | Bitcoin RPC password | None |
| `--bitcoin-rpc-light` | Bitcoin RPC is a light client | `false` |
| `--rpc-bind` | Bind address for JSON-RPC connections | `127.0.0.1, ::1` |
| `--rpc-port` | Port for JSON-RPC connections | Based on `--chain` |
| `--rpc-user` | Spaced RPC username (requires `--rpc-password`) | None |
| `--rpc-password` | Spaced RPC password | None |
| `--block-index` | Enable block indexing | `false` |
| `--block-index-full` | Index full transaction data | `false` |
| `--jobs` | Number of concurrent workers during sync | `8` |
| `--num-anchors` | Number of root anchors to calculate | `600` |
| `--skip-anchors` | Skip maintaining historical root anchors | `false` |
| `--config` | Path to a configuration file | None |

## Default Bitcoin RPC URLs

| Network | URL |
|---|---|
| Mainnet | `http://127.0.0.1:8332` |
| Testnet4 | `http://127.0.0.1:48332` |
| Regtest | `http://127.0.0.1:18443` |

## Authentication

The daemon supports cookie-based and username/password authentication for both Bitcoin Core RPC and its own RPC interface.

**Bitcoin Core auth** - use either `--bitcoin-rpc-cookie` or the `--bitcoin-rpc-user` / `--bitcoin-rpc-password` pair.

**Spaced RPC auth** - use `--rpc-user` / `--rpc-password` to require authentication for clients connecting to the spaced client. When set, a cookie file is written to `{data-dir}/.cookie`.

## Data Directory

By default, data is stored in the platform-specific application data directory:

- **macOS**: `~/Library/Application Support/spaced/{chain}/`
- **Linux**: `~/.local/share/spaced/{chain}/`