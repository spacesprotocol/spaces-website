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
<div id="trustPopover" class="tp-popover" style="position:fixed;z-index:500;display:none">
    <svg width="303" height="380" viewBox="0 0 303 380" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="trust-popover">
            <!-- Figma-derived card path: 303×380 with centered top notch -->
            <path class="tp-card" d="M149.964 0.760341C151.134 -0.253438 152.88 -0.253457 154.05 0.760341L159.949 5.87071C161.184 6.94037 162.485 7.97812 163.168 8.78088L163.304 8.94104H285.041C294.959 8.94104 303 17.6717 303 28.4411V360.5C303 371.27 294.96 380 285.041 380H17.959C8.04051 380 0 371.27 0 360.5V28.4411L0.00629577 27.9382C0.252146 17.4012 8.19548 8.94104 17.959 8.94104H140.366L140.497 8.81604C140.916 8.41401 141.495 7.9469 142.134 7.43908C142.765 6.93722 143.453 6.39945 144.064 5.87071L149.964 0.760341Z"/>
            <text class="tp-label" style="white-space:pre" xml:space="preserve" font-family="IBM Plex Sans" font-size="12" font-weight="600" letter-spacing="0em"><tspan x="112" y="48">source of truth</tspan></text>
            <g class="tp-qr-wrap">
                <rect id="tp-qrcode" x="28" y="52" width="248" height="248" fill="white"/>
            </g>
            <g id="tp-status" filter="url(#tp-glow)" style="cursor:default">
                <circle cx="42" cy="325" r="8" fill="transparent"/>
                <circle cx="42" cy="325" r="2.8" fill="#3fbc8b">
                    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                </circle>
            </g>
            <text id="tp-height" fill="#3fbc8b" style="white-space:pre;opacity:0;transition:opacity .15s" xml:space="preserve" font-family="Lilex" font-size="10" font-weight="600"><tspan x="22" y="307"></tspan></text>
            <text class="tp-muted select-none" style="white-space:pre" xml:space="preserve" font-family="Lilex" font-size="12" font-weight="500" letter-spacing="0.09em">
                <tspan x="72" y="321" id="tp-row1" class="cursor-default select-none" textLength="136" lengthAdjust="spacingAndGlyphs">0000 0000 0000 0000</tspan>
                <tspan x="72" y="337" id="tp-row2" class="cursor-default select-none" textLength="136" lengthAdjust="spacingAndGlyphs">0000 0000 0000 0000</tspan>
            </text>
            <text id="tp-copy" class="tp-copy select-none" style="white-space:pre" xml:space="preserve" font-family="Lilex" font-size="12" font-weight="500" letter-spacing="0.09em"><tspan x="232" y="329">Copy</tspan></text>
        </g>
        <defs>
            <filter id="tp-glow" x="30.6" y="313.6" width="22.8" height="22.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
        const pr = popover.getBoundingClientRect();
        const pw = pr.width || 390;
        const ph = pr.height || 524;
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
            popover.style.display = open ? '' : 'none';
            if (open) positionPopover();
            return;
        }
        if (open && !popover.contains(e.target)) {
            open = false;
            popover.style.display = 'none';
        }
    });

    window.addEventListener('resize', function () {
        if (open) positionPopover();
    });
})();
