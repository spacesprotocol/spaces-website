+++
title = "White Paper"
description = "Spaces Protocol: Scalable & Permissionless Bitcoin Identities"
template = "paper.html"
+++

<div class="rfc-header">
<div>
<div>Spaces Protocol</div>
<div>Category: White Paper</div>
<div>Status: Living Document</div>
<div style="color: var(--bp-accent);">Updated: March 2026</div>
</div>
<div class="rfc-header-right">
<div>M. Carson</div>
<div>Buffrr</div>
<div>Impervious</div>
<div>February 2024</div>
</div>
</div>

<h1 id="white-paper">White Paper</h1>

Spaces is a naming protocol that leverages the existing infrastructure and security of Bitcoin<sup><a href="#ref-1">1</a></sup> without requiring a new blockchain or any modifications to Bitcoin itself. "Spaces" serve as community identifiers that are distributed through an auction process built using existing Bitcoin scripting capabilities. Proceeds generated through auctions are irrevocably burned. Within each Space, users can create "Subspaces," which are sovereign, non-revocable identities bound to public keys. Subspaces operate primarily off-chain through compact certificates, but can be bound to UTXOs on-chain when interactive functionality is required. Spaces is designed to be verifiable by end-users in a trustless manner without requiring a full node. This is achieved through a stateless zero-knowledge light client, which produces a universal root of trust from Bitcoin's header chain. The protocol essentially acts as a scalable & trustless Bitcoin certificate authority.

<figure class="rfc-fig">
<svg viewBox="0 0 660 280" xmlns="http://www.w3.org/2000/svg" style="max-width:660px; width:100%; height:auto; border:none; background:none; filter:none; padding:0;">
<defs>
<marker id="arrow1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
<path d="M0,0 L8,3 L0,6" fill="none" stroke="#4da8da" stroke-width="1.2"/>
</marker>
<marker id="arrow1dim" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
<path d="M0,0 L8,3 L0,6" fill="none" stroke="#3d6494" stroke-width="1.2"/>
</marker>
</defs>
<rect x="8" y="40" width="160" height="150" rx="4" fill="rgba(13,31,60,0.7)" stroke="#1e4a7a" stroke-width="1"/>
<text x="88" y="28" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500" letter-spacing="0.06em">BITCOIN BLOCK HEADER</text>
<text x="24" y="68" fill="#c8ddf5" font-family="'IBM Plex Mono',monospace" font-size="10.5">prev_block_hash</text>
<text x="24" y="88" fill="#c8ddf5" font-family="'IBM Plex Mono',monospace" font-size="10.5">merkle_root</text>
<text x="24" y="108" fill="#c8ddf5" font-family="'IBM Plex Mono',monospace" font-size="10.5">version</text>
<text x="24" y="128" fill="#c8ddf5" font-family="'IBM Plex Mono',monospace" font-size="10.5">timestamp</text>
<text x="24" y="148" fill="#c8ddf5" font-family="'IBM Plex Mono',monospace" font-size="10.5">difficulty</text>
<circle cx="140" cy="160" r="14" fill="none" stroke="#4da8da" stroke-width="1.5" opacity="0.5"/>
<text x="140" y="165" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="14" font-weight="700" opacity="0.6">&#8383;</text>
<line x1="168" y1="88" x2="220" y2="88" stroke="#4da8da" stroke-width="1" marker-end="url(#arrow1)"/>
<text x="330" y="28" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500" letter-spacing="0.06em">TRANSACTIONS</text>
<rect x="228" y="42" width="204" height="24" rx="2" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<rect x="228" y="74" width="204" height="24" rx="2" fill="rgba(77,168,218,0.12)" stroke="#4da8da" stroke-width="1"/>
<text x="330" y="90" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9.5" font-weight="500">space tx</text>
<rect x="228" y="106" width="204" height="24" rx="2" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<rect x="228" y="138" width="204" height="24" rx="2" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<rect x="228" y="170" width="204" height="24" rx="2" fill="rgba(77,168,218,0.12)" stroke="#4da8da" stroke-width="1"/>
<text x="330" y="186" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9.5" font-weight="500">space tx</text>
<rect x="228" y="202" width="204" height="24" rx="2" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="450" y="126" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" font-style="italic">state</text>
<text x="450" y="138" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" font-style="italic">transitions</text>
<line x1="432" y1="86" x2="500" y2="118" stroke="#3d6494" stroke-width="0.8" marker-end="url(#arrow1dim)" stroke-dasharray="3,2"/>
<line x1="432" y1="182" x2="500" y2="150" stroke="#3d6494" stroke-width="0.8" marker-end="url(#arrow1dim)" stroke-dasharray="3,2"/>
<rect x="505" y="88" width="148" height="92" rx="4" fill="rgba(13,31,60,0.7)" stroke="#4da8da" stroke-width="1"/>
<text x="579" y="78" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500" letter-spacing="0.06em">STATE ACCUMULATOR</text>
<text x="579" y="127" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="12" font-weight="600">state_root</text>
<text x="579" y="148" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9">32 bytes</text>
<text x="579" y="167" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="8">0x a3 f7 1b ... c9 02</text>
<text x="330" y="264" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" letter-spacing="0.06em">FIG. 1 — BITCOIN BLOCK HEADER TO SPACES STATE</text>
</svg>
</figure>

---

<h1 id="background">Background</h1>

Public Key Infrastructure (PKI) is a critical component of internet security, enabling secure communication and authentication between parties. However, traditional PKI systems often rely on centralized authorities, which can be vulnerable to attacks, censorship, and single points of failure. This has led to a growing interest in decentralized PKI solutions, particularly those built on blockchain technology. Over the past decade, various decentralized naming protocols have emerged to address this need. Namecoin<sup><a href="#ref-3">3</a></sup> pioneered this field in 2011 but fell short due to usability issues and a significant number of inactive or "squatted" domains<sup><a href="#ref-4">4</a></sup>. The Ethereum Name Service (ENS)<sup><a href="#ref-5">5</a></sup> has become the most widely adopted naming system, primarily because most ENS users rely on trusted third parties for resolving .eth identities. However, this reliance on intermediaries undermines the decentralized nature of these names, and ENS lacks meaningful light client support.

The Handshake<sup><a href="#ref-6">6</a></sup> blockchain attempted to improve upon Namecoin's design by introducing an auction process for acquiring names. However, this approach has proven ineffective, as bots can open numerous auctions during a short time period and acquire valuable names unnoticed. Being a niche blockchain with limited utility, focusing on an alternate root to the existing DNS, Handshake faces substantial challenges. First, it fails to match the security found in well-established blockchains such as Bitcoin. In addition, name collisions further undermine its practicality, violating a crucial principle of URLs: uniqueness. This unique identification permits the unambiguous sharing of links and access to web resources. Inconsistent user configurations or name resolution preferences will affect even more subtle issues such as the loading of subresources on the web.

These innovations fall short of delivering the security attributes inherent to a robust Proof-of-Work blockchain such as Bitcoin. This paper seeks to address these shortcomings, proposing a highly secure, scalable and decentralized PKI anchored in Bitcoin.

<h2 id="table-of-contents">Table of Contents</h2>

<ul class="rfc-toc">
<li><a href="#name-syntax">1. Name Syntax</a></li>
<li><a href="#acquiring-a-space">2. Acquiring a Space</a></li>
<li><a href="#auction-design">3. Auction Design</a></li>
<li><a href="#finalizing-an-auction">4. Finalizing an Auction</a></li>
<li><a href="#space-utxos">5. Space UTXOs</a></li>
<li><a href="#subspaces">6. Subspaces</a></li>
<li>&emsp;<a href="#state-commitments">6.1 State Commitments</a></li>
<li>&emsp;<a href="#certificates">6.2 Certificates</a></li>
<li>&emsp;<a href="#utxo-binding">6.3 UTXO Binding</a></li>
<li>&emsp;<a href="#loss-of-liveness">6.4 Loss of Liveness</a></li>
<li>&emsp;<a href="#operators">6.5 Operators</a></li>
<li><a href="#accumulators">7. Accumulators</a></li>
<li>&emsp;<a href="#binary-trie">7.1 Binary Trie</a></li>
<li>&emsp;<a href="#sub-trees">7.2 Sub Trees</a></li>
<li><a href="#light-clients">8. Light Clients</a></li>
<li><a href="#record-storage">9. Record Storage</a></li>
<li><a href="#references">10. References</a></li>
</ul>

---

<h1 id="name-syntax">Name Syntax</h1>

<figure class="rfc-fig">
<svg viewBox="0 0 530 130" xmlns="http://www.w3.org/2000/svg" style="max-width:530px; width:100%; height:auto; border:none; background:none; filter:none; padding:0;">
<text x="80" y="52" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="40" font-weight="700">bob</text>
<text x="168" y="52" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="40" font-weight="700" opacity="0.6">@</text>
<text x="208" y="52" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="40" font-weight="700">bitcoin</text>
<line x1="80" y1="68" x2="152" y2="68" stroke="#7ec8f0" stroke-width="1" opacity="0.5"/>
<line x1="80" y1="64" x2="80" y2="68" stroke="#7ec8f0" stroke-width="1" opacity="0.5"/>
<line x1="152" y1="64" x2="152" y2="68" stroke="#7ec8f0" stroke-width="1" opacity="0.5"/>
<text x="116" y="84" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">subspace</text>
<text x="116" y="97" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="8.5" font-style="italic">individual identity</text>
<line x1="180" y1="64" x2="180" y2="74" stroke="#1e4a7a" stroke-width="0.8" stroke-dasharray="2,2"/>
<text x="180" y="84" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="8.5">separator</text>
<line x1="208" y1="68" x2="376" y2="68" stroke="#4da8da" stroke-width="1" opacity="0.5"/>
<line x1="208" y1="64" x2="208" y2="68" stroke="#4da8da" stroke-width="1" opacity="0.5"/>
<line x1="376" y1="64" x2="376" y2="68" stroke="#4da8da" stroke-width="1" opacity="0.5"/>
<text x="292" y="84" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">space</text>
<text x="292" y="97" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="8.5" font-style="italic">community identifier</text>
<text x="228" y="122" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" letter-spacing="0.06em">FIG. 2 — NAME SYNTAX</text>
</svg>
</figure>

A "Space" acts as a community identifier in the Spaces protocol, similar to a top level domain like .com or .org on the traditional web. For instance, in the identity "bob@bitcoin", 'bob' represents a subspace or a member of the 'bitcoin' community.

---

<h1 id="acquiring-a-space">Acquiring a Space</h1>

<figure class="rfc-fig">
<svg viewBox="0 0 660 160" xmlns="http://www.w3.org/2000/svg" style="max-width:660px; width:100%; height:auto; border:none; background:none; filter:none; padding:0;">
<defs>
<marker id="arrow3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
<path d="M0,0 L8,3 L0,6" fill="none" stroke="#4da8da" stroke-width="1.2"/>
</marker>
</defs>
<rect x="8" y="30" width="160" height="80" rx="4" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="1"/>
<text x="88" y="68" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="14" font-weight="600">Pre-auctions</text>
<text x="88" y="88" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" font-style="italic">priority queue</text>
<line x1="168" y1="70" x2="232" y2="70" stroke="#4da8da" stroke-width="1" marker-end="url(#arrow3)"/>
<text x="200" y="58" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="8.5">rollout</text>
<text x="200" y="92" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="8">top 10 / day</text>
<rect x="240" y="30" width="160" height="80" rx="4" fill="rgba(77,168,218,0.08)" stroke="#4da8da" stroke-width="1"/>
<text x="320" y="68" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="14" font-weight="600">Auctions</text>
<text x="320" y="88" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" font-style="italic">~10 day window</text>
<line x1="400" y1="70" x2="464" y2="70" stroke="#4da8da" stroke-width="1" marker-end="url(#arrow3)"/>
<text x="432" y="58" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="8.5">winning</text>
<text x="432" y="92" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="8">after SCP</text>
<rect x="472" y="30" width="178" height="80" rx="4" fill="rgba(77,168,218,0.05)" stroke="#7ec8f0" stroke-width="1"/>
<text x="561" y="68" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="14" font-weight="600">Registration</text>
<text x="561" y="88" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" font-style="italic">Space UTXO created</text>
<text x="330" y="145" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" letter-spacing="0.06em">FIG. 3 — AUCTION PROCESS</text>
</svg>
</figure>

The protocol uses an auction-based method for distributing names, rather than a first-come first-serve approach, aiming to prevent any single entity from accumulating a disproportionate number of valuable names. Since auctions alone cannot entirely eliminate the possibility of name squatting, and to further ensure fairness, the protocol introduces a dynamic name rollout process to control the release of names through a pre-auctions phase ensuring that each name gets adequate attention and the opportunity for fair & open public bidding.

<h2 id="pre-auctions-phase">Pre-auctions Phase</h2>

During the pre-auction phase, users propose names they're interested in. Names that receive enough interest, determined by their highest bid values, advance to the auction phase. The protocol caps the number of spaces released to 10 per day, or a total of 3600 community spaces per year.

<h2 id="auctions-phase">Auctions Phase</h2>

When a pre-auctions Space advances to the top 10 on a given day, it enters the auctions phase. Auctions last for 10 days. To discourage last-minute bidding, new bids extends the auction duration by one day.

---

<h1 id="auction-design">Auction Design</h1>

The basic principle behind the auction mechanism is selecting some UTXO to represent the Space (known as the "Space UTXO"). This UTXO is "passed" around by bidders until the auction concludes. An open transaction is first submitted to initiate the auction and place the initial bid.

A bid is made by burning the amount in an OP_RETURN output. In addition, the bidder also leaves a partially signed Bitcoin transaction (PSBT) that says, "If I'm outbid, the next person may consume my Space UTXO, as long as they give me my money back."

For instance, consider Bob as the initial bidder who commits 1 BTC. Alice comes along and decides to bid 1.5 BTC, she completes Bob's PSBT, which gives Bob his 1 BTC back, and she then burns an additional 0.5 BTC, increasing the total burned amount for the auction to 1.5 BTC. Alice shares her own UTXO and PSBT, representing the new leading bid for the Space UTXO. This pattern continues until the auction concludes.

To facilitate this process, some transaction with at least two UTXOs is necessary. One is used as the Space UTXO while the other is spent in the bid transaction. This makes it possible to "compress" the entire PSBT into a 65-byte format to fit within the OP_RETURN output, which is already being used to burn the bid amount.

<figure class="rfc-fig">
<svg viewBox="0 0 660 360" xmlns="http://www.w3.org/2000/svg" style="max-width:660px; width:100%; height:auto; border:none; background:none; filter:none; padding:0;">
<defs>
<marker id="arrow4" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
<path d="M0,0 L7,2.5 L0,5" fill="none" stroke="#4da8da" stroke-width="1"/>
</marker>
<marker id="arrow4d" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
<path d="M0,0 L7,2.5 L0,5" fill="none" stroke="#3d6494" stroke-width="1"/>
</marker>
</defs>
<text x="110" y="18" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500" letter-spacing="0.06em">INPUTS</text>
<text x="440" y="18" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500" letter-spacing="0.06em">OUTPUTS</text>
<rect x="8" y="28" width="644" height="130" rx="4" fill="rgba(77,168,218,0.05)" stroke="#1e4a7a" stroke-width="1" stroke-dasharray="4,3"/>
<rect x="28" y="52" width="160" height="40" rx="3" fill="rgba(13,31,60,0.7)" stroke="#4da8da" stroke-width="1"/>
<text x="108" y="77" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="12" font-weight="500">#f9395e:2</text>
<line x1="108" y1="92" x2="108" y2="108" stroke="#3d6494" stroke-width="0.8" marker-end="url(#arrow4d)"/>
<text x="108" y="124" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="8">Spend output from tx</text>
<text x="108" y="134" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="8">containing a Space UTXO</text>
<text x="290" y="50" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9">OP_RETURN</text>
<rect x="268" y="56" width="140" height="36" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="338" y="78" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10">&lt;bid amount&gt;</text>
<rect x="418" y="56" width="110" height="36" rx="3" fill="rgba(126,200,240,0.08)" stroke="#7ec8f0" stroke-width="0.8"/>
<text x="473" y="78" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10">&lt;cPSBT&gt;</text>
<text x="473" y="108" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9">65-byte Compressed PSBT</text>
<line x1="473" y1="114" x2="473" y2="185" stroke="#4da8da" stroke-width="1" marker-end="url(#arrow4)"/>
<rect x="140" y="194" width="440" height="110" rx="4" fill="rgba(126,200,240,0.04)" stroke="#7ec8f0" stroke-width="1" stroke-dasharray="4,3"/>
<rect x="168" y="218" width="72" height="48" rx="3" fill="rgba(13,31,60,0.7)" stroke="#4da8da" stroke-width="1"/>
<text x="204" y="247" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="18" font-weight="600">6</text>
<text x="204" y="284" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9">1-byte locator</text>
<rect x="256" y="218" width="296" height="48" rx="3" fill="rgba(13,31,60,0.7)" stroke="#1e4a7a" stroke-width="1"/>
<text x="404" y="240" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="7" letter-spacing="2px">.. .. .. .. .. .. .. .. .. .. .. .. .. .. .. ..</text>
<text x="404" y="254" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="7" letter-spacing="2px">.. .. .. .. .. .. .. .. .. .. .. .. .. .. .. ..</text>
<text x="404" y="284" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9">64-byte signature</text>
<text x="330" y="342" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" letter-spacing="0.06em">FIG. 4 — BID PSBT STRUCTURE</text>
</svg>
</figure>

To reconstruct a PSBT from its compressed form, the first step is to recover the Space UTXO outpoint, which includes a 32-byte transaction ID and an output index. The transaction ID can be obtained by identifying the input index that corresponds to the OP_RETURN output, as both should align index-wise. Since this input originates from the transaction that includes the Space UTXO, its transaction ID is used. Within the OP_RETURN data, the initial byte indicates the Space UTXO's output index. For instance, the Space UTXO in the referenced figure would be identified as outpoint `#f9395e:6`. The Space UTXO's locking script is used as the refund address and its value is added to the refunded bid amount. This PSBT is then used to construct the next bid transaction, continuing with this pattern until the auction concludes.

In scenarios where multiple bids are placed simultaneously on the same Space UTXO, only one bid will succeed in burning the coins. This is because other bids will attempt to spend a UTXO that has already been spent and their transaction will be rejected by Bitcoin full nodes. Similar techniques have been used in the past to implement Dutch auctions<sup><a href="#ref-7">7</a></sup>, although they do not allow for arbitrary bids and may require a larger on-chain footprint to implement for this purpose.

Protocol-specific rules are enforced through a client-side consensus node. For example, spending the auctioned UTXO without following the auction pattern or attempting to register the Space before the safe closing period is technically possible, but it violates a protocol rule, which causes the auction to be invalidated. As a result, the offending bidder will lose their coins. Additionally, it's important to open auctions with zero or low initial bids. If two auctions for the same name open simultaneously, only the first auction will be recognized.

---

<h1 id="finalizing-an-auction">Finalizing an Auction</h1>

Auctions continue indefinitely until a winning bidder chooses to conclude the process once the Safe Closing Period (SCP) begins. The SCP begins following a predetermined timeframe, approximately 10 days, once a Space transitions from the pre-auctions pool to the active auctions phase.

Spaces start in a pre-auctions pool, awaiting interest from potential bidders. This pool functions as a priority queue; Spaces ascend within this queue as their bids increase. Every 144 blocks, roughly equivalent to one day, the top 10 Spaces in this queue are moved into the auctions phase.

Assuming a Space enters the auctions phase at block N, the auction then spans 1440 blocks from this point, with the SCP set to start at N+1440. This creates a window during which bids can be placed and extended. If a bid is placed towards the end of the auction, specifically on the 10th day or later, it extends the SCP by an additional 144 blocks from the bid's block.

To finalize an auction, the winning bidder must actively end it, once the SCP begins. This closure is done by creating a transaction that spends the last Space UTXO, signaling the end of the auction and establishing the bidder as the new owner of the Space. If the winning bidder does not conclude the auction, the Space remains unregistered and open to new bids. Ending the auction before the SCP starts will invalidate it, resulting in the bidder losing their coins.

---

<h1 id="space-utxos">Space UTXOs</h1>

After an auction is finalized, the Space is represented as a Bitcoin UTXO. Space UTXOs can hold any value, just like regular Bitcoin UTXOs. Moreover, any coin a user might already possess can be converted or "marked" as the Space's UTXO. They're similar in principle to Colored Coins<sup><a href="#ref-8">8</a></sup> except they're indistinguishable from standard UTXOs. They can be used for payment in Bitcoin transactions, and returned as change. Space UTXOs do not necessarily expand Bitcoin's UTXO set size more than a normal UTXO used to hold value would. The protocol encourages their use in transactions, serving a dual purpose: it facilitates regular Bitcoin transactions and simultaneously renews the Space's registration, thereby preventing its expiration.

There's one rule when it comes to transacting with Space UTXOs. If a Space UTXO is used as an input at a certain index within a transaction, the corresponding output or change, i.e. — the new Space UTXO must be placed at the next sequential index. For instance, if the Space UTXO is at input index 2, then the new UTXO must be at output index 3. This facilitates trustless and non-interactive resale of Spaces in secondary marketplaces by creating a PSBT with signature type `SINGLE|ANYONECANPAY` using the Space as the input and the required payment is set as the output.

<figure class="rfc-fig">
<svg viewBox="0 0 700 370" xmlns="http://www.w3.org/2000/svg" style="max-width:700px; width:100%; height:auto; border:none; background:none; filter:none; padding:0;">
<defs>
<marker id="arrow5" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
<path d="M0,0 L8,3 L0,6" fill="none" stroke="#4da8da" stroke-width="1.2"/>
</marker>
<marker id="arrow5w" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
<path d="M0,0 L8,3 L0,6" fill="none" stroke="#e8f0fb" stroke-width="1.2"/>
</marker>
</defs>
<rect x="168" y="18" width="364" height="310" rx="5" fill="rgba(13,31,60,0.4)" stroke="#1e4a7a" stroke-width="1"/>
<text x="350" y="42" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="13" font-weight="600">Transaction</text>
<text x="254" y="62" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500" letter-spacing="0.06em">INPUTS</text>
<text x="446" y="62" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500" letter-spacing="0.06em">OUTPUTS</text>
<rect x="192" y="74" width="116" height="52" rx="4" fill="rgba(77,168,218,0.12)" stroke="#4da8da" stroke-width="1"/>
<text x="250" y="100" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">idx 0</text>
<rect x="392" y="74" width="116" height="52" rx="4" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="450" y="104" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="10">...</text>
<rect x="192" y="136" width="116" height="52" rx="4" fill="rgba(126,200,240,0.08)" stroke="#7ec8f0" stroke-width="0.8"/>
<text x="250" y="162" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">idx 1</text>
<rect x="392" y="136" width="116" height="52" rx="4" fill="rgba(77,168,218,0.12)" stroke="#4da8da" stroke-width="1"/>
<text x="450" y="162" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">idx 1</text>
<rect x="192" y="198" width="116" height="52" rx="4" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="250" y="228" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="10">...</text>
<rect x="392" y="198" width="116" height="52" rx="4" fill="rgba(126,200,240,0.08)" stroke="#7ec8f0" stroke-width="0.8"/>
<text x="450" y="224" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">idx 2</text>
<rect x="192" y="260" width="116" height="52" rx="4" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="250" y="290" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="10">...</text>
<rect x="392" y="260" width="116" height="52" rx="4" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="450" y="290" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="10">...</text>
<text x="28" y="96" text-anchor="start" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">Space UTXO 1</text>
<line x1="140" y1="100" x2="184" y2="100" stroke="#e8f0fb" stroke-width="1" marker-end="url(#arrow5w)"/>
<text x="28" y="158" text-anchor="start" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">Space UTXO 2</text>
<line x1="140" y1="162" x2="184" y2="162" stroke="#e8f0fb" stroke-width="1" marker-end="url(#arrow5w)"/>
<line x1="508" y1="162" x2="546" y2="162" stroke="#e8f0fb" stroke-width="1" marker-end="url(#arrow5w)"/>
<text x="554" y="158" text-anchor="start" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">Space UTXO 1</text>
<line x1="508" y1="224" x2="546" y2="224" stroke="#e8f0fb" stroke-width="1" marker-end="url(#arrow5w)"/>
<text x="554" y="220" text-anchor="start" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">Space UTXO 2</text>
<path d="M316,100 C334,100 334,162 316,162" fill="none" stroke="#4da8da" stroke-width="0.8" stroke-dasharray="3,2"/>
<text x="342" y="135" text-anchor="start" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="8" font-weight="500">idx+1</text>
<path d="M316,162 C334,162 334,224 316,224" fill="none" stroke="#7ec8f0" stroke-width="0.8" stroke-dasharray="3,2"/>
<text x="342" y="197" text-anchor="start" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="8" font-weight="500">idx+1</text>
<text x="350" y="358" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" letter-spacing="0.06em">FIG. 5 — SPACE UTXO TRANSACTION MOVEMENT</text>
</svg>
</figure>

To ensure active utilization of Spaces and prevent valuable names from getting lost, the protocol requires renewals to ensure that a Space's owner is still in control of their UTXO.

---

<h1 id="subspaces">Subspaces</h1>

Subspaces are human-readable names bound to unique script pubkeys (standard Bitcoin locking scripts), issued by Space operators off-chain. Once issued, a subspace binding is sovereign and non-revocable — it functions indefinitely without requiring any on-chain operation or renewal. Subspaces are organized into a Binary Merkle Trie, and the root of this tree is committed on-chain by the Space's operator as a compact 32-byte hash. The core client accepts these commitments without examining their internal structure; cryptographic validity is verified off-chain by certificate verifiers. When interactive functionality is needed — such as key rotation or atomic swaps — subspaces can be bound to UTXOs on-chain with minimal footprint.

<figure class="rfc-fig">
<svg viewBox="0 0 500 310" xmlns="http://www.w3.org/2000/svg" style="max-width:500px; width:100%; height:auto; border:none; background:none; filter:none; padding:0;">
<defs>
<marker id="arrow6" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
<path d="M0,0 L7,2.5 L0,5" fill="none" stroke="#1e4a7a" stroke-width="1"/>
</marker>
</defs>
<circle cx="250" cy="44" r="30" fill="rgba(13,31,60,0.6)" stroke="#4da8da" stroke-width="1.2"/>
<text x="250" y="48" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="14" font-weight="600">r1</text>
<circle cx="340" cy="140" r="22" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="1"/>
<line x1="224" y1="66" x2="128" y2="158" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow6)"/>
<line x1="272" y1="68" x2="324" y2="122" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow6)"/>
<line x1="322" y1="156" x2="228" y2="236" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow6)"/>
<line x1="358" y1="156" x2="408" y2="236" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow6)"/>
<rect x="42" y="162" width="160" height="52" rx="4" fill="rgba(77,168,218,0.08)" stroke="#4da8da" stroke-width="1"/>
<text x="122" y="183" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="500">alice@bitcoin</text>
<text x="122" y="200" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="8">&lt;script_pubkey&gt;</text>
<rect x="130" y="240" width="180" height="52" rx="4" fill="rgba(77,168,218,0.08)" stroke="#4da8da" stroke-width="1"/>
<text x="220" y="261" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="500">charlie@bitcoin</text>
<text x="220" y="278" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="8">&lt;script_pubkey&gt;</text>
<rect x="324" y="240" width="170" height="52" rx="4" fill="rgba(77,168,218,0.08)" stroke="#4da8da" stroke-width="1"/>
<text x="409" y="261" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="500">dennis@bitcoin</text>
<text x="409" y="278" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="8">&lt;script_pubkey&gt;</text>
<text x="250" y="306" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" letter-spacing="0.06em">FIG. 6 — SUBSPACES MERKLE TRIE</text>
</svg>
</figure>

<h2 id="state-commitments">State Commitments</h2>

A commitment is a 32-byte Merkle tree root representing the state of all subspaces for a given Space at a given block height. The operator constructs a Binary Merkle Trie containing all subspace mappings (name -> script_pubkey) and submits the tree root on-chain.

State transitions are append-only. New subspaces are added to the tree, producing a new root. Existing bindings are never modified or removed. Consider a sequence of commitments R = (r1, r2, ..., rN). Each successive commitment extends the previous state with new additions. The protocol requires that new additions did not previously exist in any prior commitment — this is what prevents double-issuance.

Example structure of a commitment entry in the tree:

<pre><code>struct Commitment {
  state_root: [u8; 32],
  prev_root: Option&lt;[u8; 32]&gt;,
  rolling_hash: [u8; 32],
  block_height: u32
}</code></pre>

Each commitment maintains a constant 32-byte on-chain footprint regardless of the number of subspaces being issued. The core client accepts commitments into the chain of roots without examining their internal structure or cryptographic validity. It is the responsibility of certificate verifiers to check the validity of commitments off-chain. Submitting an invalid commitment breaks the cryptographic chain of proofs, permanently disabling the Space's ability to issue new subspaces — the chain cannot be repaired since subsequent commitments cannot provide valid non-existence proofs.

An entity responsible for administering a Space is known as the 'Operator'. Operators manage subspace issuance and submit commitment roots on-chain.

<h2 id="certificates">Certificates</h2>

Subspace owners hold a Certificate — a cryptographic proof of ownership that functions entirely off-chain. Once issued, a certificate is valid indefinitely without requiring renewal or any on-chain interaction. A certificate must include:

- An inclusion proof demonstrating the handle exists in the committed Merkle tree.
- A non-existence proof showing the handle was not present in any previous commitment, preventing double-issuance.

Non-existence can be proved via explicit exclusion proofs against each prior commitment. While correct, these proofs grow in size with each new commitment, becoming increasingly verbose over time. To keep certificates compact, recursive zk-SNARK or STARK proofs can compress the full chain of non-existence checks into a single succinct proof — essentially validating a rolling hash across all commitments without double-spends. Both approaches are valid; certificate verifiers can be implemented to support either proof type independently of the core client.

<h2 id="utxo-binding">UTXO Binding</h2>

The majority of subspace users should rely entirely on off-chain certificates without ever needing any on-chain interaction. UTXO binding is reserved for cases requiring interactive functionality such as key rotation or atomic swaps.

A UTXO binding is created by constructing a transaction that spends to the subspace's unique script_pubkey. Because each subspace is bound to a distinct script_pubkey, no additional metadata or explicit handle name is needed on-chain — the UTXO itself is the binding. Multiple subspaces can be bound in a single transaction to reduce on-chain costs.

<figure class="rfc-fig">
<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" style="max-width:560px; width:100%; height:auto; border:none; background:none; filter:none; padding:0;">
<defs>
<marker id="arrowB" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
<path d="M0,0 L7,2.5 L0,5" fill="none" stroke="#1e4a7a" stroke-width="1"/>
</marker>
</defs>
<rect x="8" y="18" width="544" height="142" rx="4" fill="rgba(77,168,218,0.05)" stroke="#1e4a7a" stroke-width="1"/>
<text x="280" y="14" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">UTXO BINDING TRANSACTION</text>
<text x="90" y="42" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500" letter-spacing="0.06em">INPUTS</text>
<rect x="28" y="52" width="124" height="92" rx="3" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="90" y="88" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9">Funding</text>
<text x="90" y="102" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9">inputs ...</text>
<line x1="160" y1="98" x2="190" y2="98" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrowB)"/>
<text x="370" y="42" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500" letter-spacing="0.06em">OUTPUTS</text>
<rect x="200" y="52" width="168" height="26" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="216" y="69" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7">vout 0</text>
<text x="310" y="69" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="8">script_pubkey_1</text>
<text x="392" y="69" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7" font-style="italic">alice</text>
<rect x="200" y="84" width="168" height="26" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="216" y="101" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7">vout 1</text>
<text x="310" y="101" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="8">script_pubkey_3</text>
<text x="392" y="101" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7" font-style="italic">dennis</text>
<rect x="200" y="116" width="168" height="26" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="216" y="133" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7">vout 2</text>
<text x="310" y="133" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="8">script_pubkey_5</text>
<text x="392" y="133" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7" font-style="italic">satoshi</text>
<text x="460" y="76" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7">No additional</text>
<text x="460" y="88" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7">metadata needed</text>
<text x="460" y="100" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7">— identified by</text>
<text x="460" y="112" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7">script_pubkey</text>
<text x="280" y="186" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" letter-spacing="0.06em">FIG. — UTXO BINDING TRANSACTION</text>
</svg>
</figure>

Creating a UTXO binding nullifies the off-chain certificate and initiates an on-chain lifecycle for the subspace. The original certificate remains necessary as the genesis proof and must be referenced off-chain to establish the link between the handle name and the on-chain UTXO.

<h2 id="loss-of-liveness">Loss of Liveness</h2>

When a Space operator becomes unavailable and stops submitting commitments, existing subspace holders remain unaffected — their certificates provide complete ownership proof independent of the operator. Certificates continue to function indefinitely regardless of operator status.

If the parent Space expires and is reacquired by a new owner, the new operator must prove that any proposed names did not previously exist, which requires access to the complete subspace tree. If the tree is unavailable, the Space permanently loses the ability to issue new subspaces. Existing subspaces continue to function regardless of operator changes or tree availability.

<h2 id="operators">Operators</h2>

Operators are the owners of top-level Spaces who manage subspace issuance. Their primary responsibility is maintaining the subspace tree and submitting commitment roots on-chain. Each commitment is a compact 32-byte hash regardless of the number of subspaces issued.

Operators are not trusted with the security of existing subspaces — once a certificate is issued, it functions independently. However, operators bear permanent responsibility for the integrity of their commitment chain: submitting an invalid commitment irreversibly breaks the ability to issue new subspaces.

---

<h1 id="accumulators">Accumulators</h1>

Spaces implements dynamic hash-based accumulators, similar in function to Utreexo<sup><a href="#ref-9">9</a></sup>, to summarize the protocol's entire state using two roots: `spaces_root` and `nums_root`.

- **spaces_root** represents the root hash of the spaces tree, keeping track of top-level spaces, their auction state, bid ordering, and ownership in a binary trie structure.
- **nums_root** stores UTXO bindings for subspaces and commitment roots for various spaces in a binary trie structure.

<figure class="rfc-fig">
<svg viewBox="0 0 680 480" xmlns="http://www.w3.org/2000/svg" style="max-width:680px; width:100%; height:auto; border:none; background:none; filter:none; padding:0;">
<defs>
<marker id="arrow7" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
<path d="M0,0 L7,2.5 L0,5" fill="none" stroke="#1e4a7a" stroke-width="1"/>
</marker>
<marker id="arrow7c" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
<path d="M0,0 L7,2.5 L0,5" fill="none" stroke="#4da8da" stroke-width="1"/>
</marker>
<marker id="arrow7d" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
<path d="M0,0 L7,2.5 L0,5" fill="none" stroke="#3d6494" stroke-width="1"/>
</marker>
</defs>
<rect x="252" y="8" width="156" height="36" rx="4" fill="rgba(13,31,60,0.7)" stroke="#4da8da" stroke-width="1.2"/>
<text x="330" y="31" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="12" font-weight="600">state_root</text>
<text x="330" y="62" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="8">Binary Tries</text>
<line x1="290" y1="44" x2="170" y2="80" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow7)"/>
<line x1="370" y1="44" x2="490" y2="80" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow7)"/>
<rect x="100" y="82" width="140" height="28" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="1"/>
<text x="170" y="100" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">spaces_root</text>
<circle cx="110" cy="148" r="12" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="110" y="152" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="7">...</text>
<circle cx="230" cy="148" r="12" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="230" y="152" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="7">...</text>
<line x1="140" y1="110" x2="114" y2="134" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<line x1="200" y1="110" x2="226" y2="134" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<rect x="22" y="182" width="120" height="44" rx="3" fill="rgba(77,168,218,0.06)" stroke="#4da8da" stroke-width="0.8"/>
<text x="82" y="200" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">@bitcoin</text>
<text x="82" y="214" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7.5">owner: &lt;pubkey&gt;</text>
<text x="82" y="236" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="7" font-style="italic">Space</text>
<line x1="104" y1="160" x2="88" y2="178" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<rect x="148" y="182" width="120" height="44" rx="3" fill="rgba(77,168,218,0.06)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="208" y="200" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">@nostr</text>
<text x="208" y="214" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7.5">bid: 0.5 BTC</text>
<text x="208" y="236" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="7" font-style="italic">Pre-auction (sorted by bid)</text>
<line x1="236" y1="160" x2="214" y2="178" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<rect x="430" y="82" width="160" height="28" rx="3" fill="rgba(126,200,240,0.08)" stroke="#7ec8f0" stroke-width="1"/>
<text x="510" y="100" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">nums_root</text>
<circle cx="460" cy="148" r="12" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="460" y="152" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="7">...</text>
<circle cx="560" cy="148" r="12" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="560" y="152" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="7">...</text>
<line x1="470" y1="110" x2="462" y2="134" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<line x1="550" y1="110" x2="558" y2="134" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<rect x="370" y="182" width="136" height="36" rx="3" fill="rgba(126,200,240,0.06)" stroke="#7ec8f0" stroke-width="0.8"/>
<text x="438" y="198" text-anchor="middle" fill="#c8ddf5" font-family="'IBM Plex Mono',monospace" font-size="8">@bitcoin &#x2016; root-1</text>
<text x="438" y="210" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7">commitment</text>
<rect x="516" y="182" width="136" height="36" rx="3" fill="rgba(126,200,240,0.06)" stroke="#7ec8f0" stroke-width="0.8"/>
<text x="584" y="195" text-anchor="middle" fill="#c8ddf5" font-family="'IBM Plex Mono',monospace" font-size="8">alice@bitcoin</text>
<text x="584" y="207" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="7">UTXO binding</text>
<line x1="454" y1="160" x2="442" y2="178" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<line x1="566" y1="160" x2="578" y2="178" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<line x1="340" y1="270" x2="540" y2="270" stroke="#4da8da" stroke-width="1.2" stroke-dasharray="6,4" opacity="0.5"/>
<text x="440" y="286" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500" opacity="0.7">OFF-CHAIN TREES</text>
<line x1="438" y1="218" x2="438" y2="304" stroke="#3d6494" stroke-width="0.8" stroke-dasharray="3,2" marker-end="url(#arrow7d)"/>
<circle cx="438" cy="320" r="16" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="1"/>
<text x="438" y="324" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">r1</text>
<circle cx="400" cy="370" r="10" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="400" y="374" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="6">...</text>
<circle cx="476" cy="370" r="10" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="0.8"/>
<text x="476" y="374" text-anchor="middle" fill="#1e4a7a" font-family="'IBM Plex Mono',monospace" font-size="6">...</text>
<line x1="426" y1="332" x2="406" y2="358" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<line x1="450" y1="332" x2="470" y2="358" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<rect x="346" y="394" width="108" height="28" rx="3" fill="rgba(77,168,218,0.08)" stroke="#4da8da" stroke-width="0.8"/>
<text x="400" y="408" text-anchor="middle" fill="#c8ddf5" font-family="'IBM Plex Mono',monospace" font-size="8">alice@bitcoin</text>
<text x="400" y="418" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="6.5">&lt;script_pubkey&gt;</text>
<rect x="462" y="394" width="118" height="28" rx="3" fill="rgba(77,168,218,0.08)" stroke="#4da8da" stroke-width="0.8"/>
<text x="521" y="408" text-anchor="middle" fill="#c8ddf5" font-family="'IBM Plex Mono',monospace" font-size="8">charlie@bitcoin</text>
<text x="521" y="418" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="6.5">&lt;script_pubkey&gt;</text>
<line x1="394" y1="380" x2="394" y2="390" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<line x1="482" y1="380" x2="515" y2="390" stroke="#1e4a7a" stroke-width="0.8" marker-end="url(#arrow7)"/>
<text x="330" y="468" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" letter-spacing="0.06em">FIG. 7 — PROTOCOL STATE OVERVIEW</text>
</svg>
</figure>

<h2 id="binary-trie">Binary Trie</h2>

The protocol is designed to work with zero-knowledge light clients and as a result it necessitates a universal accumulator to support membership and non-membership proofs for batches of elements. To achieve this, we implement a binary trie known as a Merklix<sup><a href="#ref-10">10</a></sup> tree. Various Trie structures have been used in blockchains in the past. For instance, Ethereum<sup><a href="#ref-11">11</a></sup> currently uses a base-16 trie and have been exploring the transition to a binary trie<sup><a href="#ref-12">12</a></sup>. Handshake<sup><a href="#ref-6">6</a></sup> uses some variation of a binary trie with its tree root included in the block header. Spaces does not require modifications to Bitcoin's block header itself but it can accumulate name data into a state root in a verifiable way using zero-knowledge proofs.

The individual bits of the keys are used to route the leaf nodes to their appropriate paths. A trie offers simplicity over a Sparse Merkle Tree, as the latter necessitates dealing with empty leaves. The tree has only two types of nodes: An internal node, potentially containing a prefix for path compression, and a leaf node. Considering keys are hashed prior to insertion, they consistently have a fixed length. The overall depth of the tree is therefore determined by the number of bits produced by the hash function.

<figure class="rfc-fig">
<svg viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg" style="max-width:720px; width:100%; height:auto; border:none; background:none; filter:none; padding:0;">
<defs>
<marker id="arrow8" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
<path d="M0,0 L7,2.5 L0,5" fill="none" stroke="#1e4a7a" stroke-width="1"/>
</marker>
<marker id="arrow8d" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
<path d="M0,0 L7,2.5 L0,5" fill="none" stroke="#3d6494" stroke-width="1"/>
</marker>
</defs>
<circle cx="260" cy="36" r="24" fill="rgba(13,31,60,0.6)" stroke="#4da8da" stroke-width="1.2"/>
<text x="260" y="40" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="500">root</text>
<line x1="242" y1="54" x2="146" y2="108" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="184" y="72" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">0</text>
<line x1="280" y1="54" x2="474" y2="108" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="388" y="72" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">1</text>
<circle cx="140" cy="120" r="18" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="1"/>
<circle cx="480" cy="120" r="18" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="1"/>
<line x1="126" y1="134" x2="80" y2="188" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="90" y="156" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">00</text>
<line x1="154" y1="134" x2="204" y2="188" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="192" y="156" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">01</text>
<line x1="466" y1="134" x2="390" y2="188" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="416" y="156" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">10</text>
<line x1="494" y1="134" x2="590" y2="188" stroke="#3d6494" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#arrow8d)"/>
<text x="556" y="156" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">11</text>
<text x="628" y="168" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="8" font-style="italic">Compressed</text>
<text x="628" y="178" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="8" font-style="italic">path</text>
<circle cx="72" cy="200" r="18" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="1"/>
<rect x="178" y="192" width="90" height="30" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="223" y="211" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">010100</text>
<circle cx="384" cy="200" r="18" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="1"/>
<circle cx="596" cy="200" r="18" fill="rgba(77,168,218,0.08)" stroke="#7ec8f0" stroke-width="1"/>
<text x="596" y="204" text-anchor="middle" fill="#e0722e" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="600">0</text>
<line x1="58" y1="214" x2="48" y2="278" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="40" y="244" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">000</text>
<line x1="86" y1="214" x2="146" y2="278" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="130" y="244" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">001</text>
<line x1="370" y1="214" x2="330" y2="278" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="338" y="244" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">100</text>
<line x1="398" y1="214" x2="438" y2="278" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="432" y="244" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">101</text>
<line x1="582" y1="214" x2="548" y2="278" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="552" y="244" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">11<tspan fill="#e0722e">0</tspan>0</text>
<line x1="610" y1="214" x2="654" y2="278" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow8)"/>
<text x="648" y="244" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">11<tspan fill="#e0722e">0</tspan>1</text>
<rect x="8" y="284" width="90" height="30" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="53" y="303" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500"><tspan fill="#4da8da">000</tspan>110</text>
<rect x="108" y="284" width="90" height="30" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="153" y="303" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500"><tspan fill="#4da8da">001</tspan>101</text>
<rect x="288" y="284" width="90" height="30" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="333" y="303" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500"><tspan fill="#4da8da">100</tspan>010</text>
<rect x="396" y="284" width="90" height="30" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="441" y="303" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500"><tspan fill="#4da8da">101</tspan>111</text>
<rect x="506" y="284" width="90" height="30" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="551" y="303" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500"><tspan fill="#4da8da">11<tspan fill="#e0722e">0</tspan></tspan>011</text>
<rect x="614" y="284" width="90" height="30" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="0.8"/>
<text x="659" y="303" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500"><tspan fill="#4da8da">11<tspan fill="#e0722e">0</tspan></tspan>110</text>
<text x="360" y="380" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" letter-spacing="0.06em">FIG. 8 — BINARY TRIE WITH 7 LEAF NODES</text>
</svg>
</figure>

<h2 id="sub-trees">Sub Trees</h2>

It is possible to prove both the existence and non-existence of single or multiple keys by extracting a portion of the larger tree whilst concealing the branches of irrelevant nodes. For instance, consider the figure above demonstrating the larger tree. If we want to prove the existence of keys `000110` and `010100` and additionally prove the non-existence of keys `0111001` and `000111`, we can selectively carve out a specific subtree. Importantly, this subtree still hashes to the same tree root as the larger tree.

<figure class="rfc-fig">
<svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg" style="max-width:480px; width:100%; height:auto; border:none; background:none; filter:none; padding:0;">
<defs>
<marker id="arrow9" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
<path d="M0,0 L7,2.5 L0,5" fill="none" stroke="#1e4a7a" stroke-width="1"/>
</marker>
</defs>
<circle cx="210" cy="36" r="24" fill="rgba(13,31,60,0.6)" stroke="#4da8da" stroke-width="1.2"/>
<text x="210" y="40" text-anchor="middle" fill="#e8f0fb" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="500">root</text>
<line x1="192" y1="54" x2="148" y2="108" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow9)"/>
<text x="160" y="74" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">0</text>
<line x1="230" y1="54" x2="330" y2="90" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow9)"/>
<text x="288" y="66" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="10" font-weight="500">1</text>
<ellipse cx="350" cy="108" rx="44" ry="28" fill="rgba(13,31,60,0.85)" stroke="#3d6494" stroke-width="1.2"/>
<text x="350" y="104" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">hash</text>
<text x="350" y="118" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">node</text>
<circle cx="140" cy="122" r="20" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="1"/>
<line x1="124" y1="138" x2="96" y2="196" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow9)"/>
<text x="98" y="166" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">00</text>
<line x1="156" y1="138" x2="256" y2="196" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow9)"/>
<text x="220" y="166" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">01</text>
<circle cx="88" cy="210" r="18" fill="rgba(13,31,60,0.5)" stroke="#1e4a7a" stroke-width="1"/>
<rect x="222" y="200" width="100" height="32" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="1"/>
<text x="272" y="220" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="500">010100</text>
<line x1="74" y1="224" x2="62" y2="290" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow9)"/>
<text x="54" y="258" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">000</text>
<line x1="102" y1="224" x2="196" y2="290" stroke="#1e4a7a" stroke-width="1" marker-end="url(#arrow9)"/>
<text x="162" y="258" text-anchor="middle" fill="#4da8da" font-family="'IBM Plex Mono',monospace" font-size="9">001</text>
<rect x="14" y="296" width="100" height="32" rx="3" fill="rgba(77,168,218,0.1)" stroke="#4da8da" stroke-width="1"/>
<text x="64" y="316" text-anchor="middle" fill="#7ec8f0" font-family="'IBM Plex Mono',monospace" font-size="11" font-weight="500"><tspan fill="#4da8da">000</tspan>110</text>
<ellipse cx="214" cy="312" rx="44" ry="24" fill="rgba(13,31,60,0.85)" stroke="#3d6494" stroke-width="1.2"/>
<text x="214" y="308" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">hash</text>
<text x="214" y="322" text-anchor="middle" fill="#6b8bb5" font-family="'IBM Plex Mono',monospace" font-size="9" font-weight="500">node</text>
<text x="240" y="380" text-anchor="middle" fill="#3d6494" font-family="'IBM Plex Mono',monospace" font-size="9" letter-spacing="0.06em">FIG. 9 — SUBTREE EXTRACTION</text>
</svg>
</figure>

The above subtree includes the leaves we're interested in and also proves the non-existence of `0111001` and `000111` (or any keys with prefixes that traverse exposed paths). It's important to note that we lack the necessary information to make conclusive statements about keys starting with `1` or `001` as these paths need to be revealed.

Similarly, we can execute operations on the subtree just as we do the larger tree. For insertions, we can only insert into the revealed paths and we can also update the values of existing keys.

A significant advantage of this structure is its capacity to function as an accumulator. We can make modifications by working primarily with small subtrees, while only keeping track of a single tree root to represent the accumulator state, not an entire database.

---

<h1 id="light-clients">Light Clients</h1>

A zero-knowledge light client needs to perform two main tasks: verify Bitcoin's header chain, similar to the header chain proof by ZeroSync<sup><a href="#ref-13">13</a></sup>, and enforce protocol-specific rules to produce a compact state header in its public outputs. This state header encapsulates the entire state of the protocol and serves as a universal root of trust — a root certificate from which all Space and subspace certificates can be verified without requiring access to a Bitcoin full node.

For instance, verifying a Space requires checking an inclusion proof against the `spaces_root` in the state header. For subspaces, a client checks an inclusion proof against the `nums_root` to verify that the subspace's commitment chain is anchored in the protocol state. Certificate-level proofs (inclusion and non-existence) are verified off-chain by certificate verifiers, not by the light client itself. The light client produces the trust anchor; certificate verifiers use it.

---

<h1 id="record-storage">Record Storage</h1>

The core functionality of the Spaces protocol is centered around its role as a certificate authority, as it does not inherently provide a mechanism for storing records on-chain. This design choice keeps the protocol streamlined and focused on its primary task of securely managing and verifying digital spaces and identities within the Bitcoin network.

The trustless nature of the protocol makes it an ideal foundation for developing a Peer-to-Peer (P2P) protocol that uses Spaces as a trust anchor to support record storage and other use cases entirely off-chain. Additionally, integrating Spaces with various other protocols such as Nostr<sup><a href="#ref-14">14</a></sup> is relatively straightforward.

---

<h1 id="references">References</h1>

<ol class="rfc-refs">
<li id="ref-1">Bitcoin: A Peer-to-Peer Electronic Cash System — <a href="https://bitcoin.org/bitcoin.pdf">bitcoin.org/bitcoin.pdf</a></li>
<li id="ref-2"><em>(Reserved)</em></li>
<li id="ref-3">Namecoin — <a href="https://www.namecoin.org/resources/whitepaper/">namecoin.org/resources/whitepaper</a></li>
<li id="ref-4">An Empirical Study of Namecoin — <a href="https://www.cs.princeton.edu/~arvindn/publications/namespaces.pdf">cs.princeton.edu/~arvindn/publications/namespaces.pdf</a></li>
<li id="ref-5">Ethereum Name Service (EIP-137) — <a href="https://eips.ethereum.org/EIPS/eip-137">eips.ethereum.org/EIPS/eip-137</a></li>
<li id="ref-6">Handshake — <a href="https://handshake.org/files/handshake.txt">handshake.org/files/handshake.txt</a></li>
<li id="ref-7">Summa Auction — <a href="https://medium.com/summa-technology/summa-auction-bitcoin-technical-7344096498f2">medium.com/summa-technology/summa-auction-bitcoin-technical</a></li>
<li id="ref-8">Colored Coins — <a href="https://en.wikipedia.org/wiki/Colored_Coins">en.wikipedia.org/wiki/Colored_Coins</a></li>
<li id="ref-9">Utreexo — <a href="https://eprint.iacr.org/2019/611.pdf">eprint.iacr.org/2019/611.pdf</a></li>
<li id="ref-10">Merklix Tree — <a href="https://blog.vermorel.com/pdf/merklix-tree-for-bitcoin-2018-07.pdf">blog.vermorel.com/pdf/merklix-tree-for-bitcoin-2018-07.pdf</a></li>
<li id="ref-11">Ethereum Patricia Merkle Trie — <a href="https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/">ethereum.org/.../patricia-merkle-trie</a></li>
<li id="ref-12">Binary Trie (EIP-3102) — <a href="https://eips.ethereum.org/EIPS/eip-3102">eips.ethereum.org/EIPS/eip-3102</a></li>
<li id="ref-13">ZeroSync — <a href="https://zerosync.org/demo/">zerosync.org/demo</a></li>
<li id="ref-14">Nostr — <a href="https://en.wikipedia.org/wiki/Nostr">en.wikipedia.org/wiki/Nostr</a></li>
</ol>

<div class="dwg-stamp">
<div><div class="label">Document</div>Spaces Protocol</div>
<div><div class="label">Author</div>M. Carson / Buffrr</div>
<div><div class="label">Revision</div>Feb 2024 · Updated Mar 2026</div>
</div>
