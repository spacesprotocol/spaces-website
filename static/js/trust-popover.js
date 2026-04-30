// Trust ID Popover - self-contained module
// Usage: import '/js/trust-popover.js'
// Requires: qr.js loaded globally (for QR rendering), iconify-icon web component
// Any element with [data-trust-popover] toggles the popover anchored to #navTrustBtn

(function () {
    // ── Constants ──
    const CACHE_KEY = 'trustIdCache';
    const CACHE_TTL = 5 * 60 * 1000;
    const RELAY_URLS = [
        'https://relay-cosmos.spacesprotocol.org/anchors',
        'https://relay-pulsar.spacesprotocol.org/anchors',
    ];

    // ── Popover SVG ──
    const POPOVER_HTML = `
<div id="trustPopover" class="fixed z-[200] hidden" style="filter:drop-shadow(0 20px 60px rgba(0,0,0,.6))">
    <svg width="390" height="524" viewBox="0 0 390 524" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="trust-popover">
            <path id="popover-container" d="M193.332 1.26074C194.603 0.246965 196.498 0.246946 197.769 1.26074L204.174 6.37109C205.515 7.44075 206.928 8.47849 207.669 9.28125L207.817 9.44141H370C380.769 9.44141 389.5 18.172 389.5 28.9414V503.999C389.5 514.769 380.77 523.499 370 523.499H20C9.23045 523.499 0.5 514.769 0.5 503.999V28.9414L0.506836 28.4385C0.773782 17.9015 9.39872 9.44141 20 9.44141H182.911L183.053 9.31641C183.508 8.91438 184.136 8.44727 184.83 7.93945C185.516 7.4376 186.263 6.89983 186.926 6.37109L193.332 1.26074Z" fill="#151519" stroke="#2a2a31"/>
            <text fill="#8a8a94" style="white-space:pre" xml:space="preserve" font-family="DM Sans" font-size="12" font-weight="600" letter-spacing="0em"><tspan x="151" y="55.092">source of truth</tspan></text>
            <g>
                <rect x="34" y="68" width="320" height="333" rx="25" fill="#1c1c22"/>
                <rect opacity="0.4" x="47" y="86" width="294" height="297" rx="25" fill="#ffffff1c"/>
            </g>
            <rect x="35" y="420" width="320" height="59" rx="10" fill="#1c1c22"/>
            <rect id="tp-qrcode" x="71" y="109" width="248" height="251" fill="white"/>
            <g id="tp-status" filter="url(#tp-glow)" style="cursor:default">
                <circle cx="60" cy="450" r="8" fill="transparent"/>
                <circle cx="60" cy="450" r="2.8" fill="#3fbc8b">
                    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                </circle>
            </g>
            <text id="tp-height" fill="#3fbc8b" style="white-space:pre;opacity:0;transition:opacity .15s" xml:space="preserve" font-family="JetBrains Mono" font-size="10" font-weight="600"><tspan x="22" y="422"></tspan></text>
            <text class="select-none" fill="#585862" style="white-space:pre" xml:space="preserve" font-family="JetBrains Mono" font-size="12" font-weight="500" letter-spacing="0.09em">
                <tspan x="90" y="445.32" id="tp-row1" class="cursor-default select-none">0000 0000 0000 0000</tspan>
                <tspan x="90" y="461.32" id="tp-row2" class="cursor-default select-none">0000 0000 0000 0000 </tspan>
            </text>
            <text id="tp-copy" class="cursor-pointer select-none hover:fill-[#dcdce0]" fill="#8a8a94" style="white-space:pre" xml:space="preserve" font-family="JetBrains Mono" font-size="12" font-weight="500" letter-spacing="0.09em"><tspan x="290" y="452.32">Copy</tspan></text>
        </g>
        <defs>
            <filter id="tp-glow" x="46" y="437.4" width="25" height="25" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="4.3"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.247059 0 0 0 0 0.737255 0 0 0 0 0.545098 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </filter>
        </defs>
    </svg>
</div>`;

    // ── Inject popover into DOM ──
    document.body.insertAdjacentHTML('afterbegin', POPOVER_HTML);
    const popover = document.getElementById('trustPopover');

    // ── Trust ID fetch with caching ──
    function readCache() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed?.value || typeof parsed.cached_at !== 'number') return null;
            if (Date.now() - parsed.cached_at > CACHE_TTL) return null;
            return parsed.value;
        } catch { return null; }
    }

    function writeCache(value) {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ value, cached_at: Date.now() })); } catch {}
    }

    window.trustId = null;
    window.trustIdPromise = (async () => {
        const cached = readCache();
        if (cached) { window.trustId = cached; return cached; }

        let lastError = null;
        for (const url of RELAY_URLS) {
            try {
                const res = await fetch(url, { method: 'HEAD' });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const trust_id = res.headers.get('x-anchor-root');
                const heightRaw = res.headers.get('x-anchor-height');
                if (!trust_id) throw new Error('missing x-anchor-root');
                if (!heightRaw) throw new Error('missing x-anchor-height');
                const height = Number(heightRaw);
                if (!Number.isFinite(height)) throw new Error('invalid height');
                const value = { trust_id, height };
                window.trustId = value;
                writeCache(value);
                return value;
            } catch (err) { lastError = err; }
        }
        throw lastError ?? new Error('all anchor requests failed');
    })();

    // ── Populate popover when trust ID loads ──
    function formatRows(tid) {
        const clean = tid.replace(/^0x/, '').toLowerCase();
        const groups = clean.match(/.{1,4}/g) ?? [clean];
        const mid = Math.ceil(groups.length / 2);
        return [groups.slice(0, mid).join(' '), groups.slice(mid).join(' ')];
    }

    function renderQr(data) {
        const placeholder = document.getElementById('tp-qrcode');
        if (!placeholder || typeof qrcode === 'undefined') return;
        const x = +placeholder.getAttribute('x'), y = +placeholder.getAttribute('y');
        const w = +placeholder.getAttribute('width'), h = +placeholder.getAttribute('height');
        const inset = 16;
        const qr = qrcode(0, 'M');
        qr.addData(data);
        qr.make();
        const parser = new DOMParser();
        const qrSvg = parser.parseFromString(qr.createSvgTag(8, 0), 'image/svg+xml').documentElement;
        qrSvg.setAttribute('x', x + inset);
        qrSvg.setAttribute('y', y + inset);
        qrSvg.setAttribute('width', w - inset * 2);
        qrSvg.setAttribute('height', h - inset * 2);
        qrSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        placeholder.parentNode.appendChild(qrSvg);
    }

    window.trustIdPromise.then(function (value) {
        const [r1, r2] = formatRows(value.trust_id);
        const row1 = document.getElementById('tp-row1');
        const row2 = document.getElementById('tp-row2');
        if (row1) row1.textContent = r1.slice(0, 20);
        if (row2) row2.textContent = r2.slice(20);

        renderQr(JSON.stringify(value));

        const heightEl = document.getElementById('tp-height');
        if (heightEl && value.height) {
            heightEl.querySelector('tspan').textContent = 'block ' + value.height.toLocaleString();
        }
        const statusG = document.getElementById('tp-status');
        if (statusG && heightEl) {
            statusG.addEventListener('mouseenter', function () { heightEl.style.opacity = '1'; });
            statusG.addEventListener('mouseleave', function () { heightEl.style.opacity = '0'; });
        }

        // Inline trust cards
        document.querySelectorAll('[data-trust-inline]').forEach(function (el) {
            const src = popover.querySelector('svg');
            if (!src) return;
            const clone = src.cloneNode(true);
            const copyBtn = clone.querySelector('#tp-copy');
            const ht = clone.querySelector('#tp-height');
            const st = clone.querySelector('#tp-status');
            clone.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
            if (copyBtn) {
                copyBtn.style.cursor = 'pointer';
                copyBtn.addEventListener('click', async function () {
                    if (!window.trustId?.trust_id) return;
                    const tspan = copyBtn.querySelector('tspan');
                    const orig = tspan.textContent;
                    try { await navigator.clipboard.writeText(window.trustId.trust_id); tspan.textContent = 'Copied'; }
                    catch { tspan.textContent = 'Failed'; }
                    setTimeout(function () { tspan.textContent = orig; }, 200);
                });
            }
            if (st && ht) {
                st.addEventListener('mouseenter', function () { ht.style.opacity = '1'; });
                st.addEventListener('mouseleave', function () { ht.style.opacity = '0'; });
            }
            el.appendChild(clone);
        });
    }).catch(console.error);

    // ── Copy handler for main popover ──
    const copyEl = document.getElementById('tp-copy');
    if (copyEl) {
        copyEl.style.cursor = 'pointer';
        copyEl.addEventListener('click', async function () {
            if (!window.trustId?.trust_id) return;
            const tspan = copyEl.querySelector('tspan');
            const orig = tspan.textContent;
            try { await navigator.clipboard.writeText(window.trustId.trust_id); tspan.textContent = 'Copied'; }
            catch { tspan.textContent = 'Failed'; }
            setTimeout(function () { tspan.textContent = orig; }, 200);
        });
    }

    // ── Toggle popover ──
    let open = false;
    function positionPopover() {
        const anchor = document.getElementById('navTrustBtn') || document.querySelector('[data-trust-popover]');
        if (!anchor) return;
        const r = anchor.getBoundingClientRect();
        const pw = 390, ph = 524;
        let left = r.left + r.width / 2 - pw / 2;
        let top = r.bottom + 8;
        left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
        if (top + ph > window.innerHeight - 8) top = r.top - ph - 8;
        popover.style.left = left + 'px';
        popover.style.top = top + 'px';
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('[data-trust-popover]')) {
            e.stopPropagation();
            open = !open;
            popover.classList.toggle('hidden', !open);
            if (open) positionPopover();
            return;
        }
        if (open && !popover.contains(e.target)) {
            open = false;
            popover.classList.add('hidden');
        }
    });

    window.addEventListener('resize', function () {
        if (open) positionPopover();
    });
})();
