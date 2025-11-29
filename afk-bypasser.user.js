// ==UserScript==
// @name         AFK Bypasser Helper
// @namespace    https://afk-bypasser.vercel.app
// @version      2.2
// @description  Automatically redirects supported shorteners to AFK Bypasser
// @author       AFK Bypasser
// @icon         https://raw.githubusercontent.com/john2032-design/Bypass-/refs/heads/main/B57FBD3E-489E-4F0D-A5C0-08017DA44C4E.png
// @match        *://mobile.codex.lol/*
// @match        *://*trigon/*
// @match        *://*rekonise.com/*
// @match        *://*linkvertise.com/*
// @match        *://*link-target.net/*
// @match        *://*link-center.net/*
// @match        *://*link-to.net/*
// @match        *://*paster.so/*
// @match        *://*cuttlinks.com/*
// @match        *://*boost.ink/*
// @match        *://*bst.gg/*
// @match        *://*keyguardian.net/*
// @match        *://*keyguardian.org/*
// @match        *://*bstshrt.com/*
// @match        *://*nicuse.com/*
// @match        *://*getkey.xyz/*
// @match        *://bit.do/*
// @match        *://bit.ly/*
// @match        *://*blox-script.com/*
// @match        *://cl.gy/*
// @match        *://*cuty.io/*
// @match        *://*getpolsec.com/*
// @match        *://goo.gl/*
// @match        *://is.gd/*
// @match        *://*ldnesfs.com/*
// @match        *://*link-hub.net/*
// @match        *://*link-unlock.com/*
// @match        *://*link4m.com/*
// @match        *://*link4sub.com/*
// @match        *://*linkunlocker.com/*
// @match        *://*lockr.xyz/*
// @match        *://*mboost.me/*
// @match        *://mediafire.com/*
// @match        *://*overdrivehub.com/*
// @match        *://*paste.drop/*
// @match        *://pastebin.com/*
// @match        *://*pastes.io/*
// @match        *://*quartyz.com/*
// @match        *://rebrand.ly/*
// @match        *://*rentry.org/*
// @match        *://*rinku.pro/*
// @match        *://*rkns.link/*
// @match        *://*shorteners-and-direct.com/*
// @match        *://*shorter.me/*
// @match        *://*socialwolvez.com/*
// @match        *://*sub2get.com/*
// @match        *://*sub4unlock.com/*
// @match        *://*subfinal.com/*
// @match        *://t.co/*
// @match        *://t.ly/*
// @match        *://tiny.cc/*
// @match        *://*tinylink.onl/*
// @match        *://tinyurl.com/*
// @match        *://*tpi.li/*
// @match        *://v.gd/*
// @match        *://*work.ink/*
// @match        *://*ytsubme.com/*
// @match        *://krnl.cat/*
// @match        *://keyrblx.com/*
// @match        *://pandadevelopment.net/*
// @match        *://rentry.org/*
// @match        *://paster.so/*
// @match        *://loot-link.com/*
// @match        *://loot-links.com/*
// @match        *://lootlink.org/*
// @match        *://lootlinks.co/*
// @match        *://lootdest.info/*
// @match        *://lootdest.org/*
// @match        *://lootdest.com/*
// @match        *://links-loot.com/*
// @match        *://linksloot.net/*
// @updateURL    https://afk-bypasser.vercel.app/meta.js
// @downloadURL  https://raw.githubusercontent.com/john2032-design/Bypass-/refs/heads/main/afk-bypasser.user.js
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    if (window.afkBypasserLoaded) return;
    window.afkBypasserLoaded = true;

    const redirectWaitTime = 5;
    const bypasserSite = "https://afk-bypasser.vercel.app";
    const currentVersion = "2.2";

    function checkForUpdate() {
        if (window.location.href.includes('afk-bypasser.vercel.app')) return;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://afk-bypasser.vercel.app/meta.js",
            onload: function(response) {
                try {
                    const scriptContent = response.responseText;
                    const versionMatch = scriptContent.match(/@version\s+(\d+\.\d+)/);
                    if (versionMatch && versionMatch[1]) {
                        const latestVersion = versionMatch[1];
                        if (latestVersion !== currentVersion) {
                            window.location.href = `${bypasserSite}/update?version=${latestVersion}`;
                        }
                    }
                } catch (e) {}
            },
            onerror: function() {}
        });
    }

    if (window.location.href.includes('afk-bypasser.vercel.app')) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlParam = urlParams.get('url');
        if (urlParam) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initBypasser);
            } else initBypasser();
        }
        function initBypasser() {
            const urlInput = document.querySelector('input[type="url"]');
            const bypassBtn = document.querySelector('#bypassBtn');
            if (urlInput && bypassBtn) {
                urlInput.value = decodeURIComponent(urlParam);
                bypassBtn.click();
                let checkCount = 0;
                const maxChecks = 40;
                const checkResult = setInterval(() => {
                    checkCount++;
                    const resultUrl = document.querySelector('#resultUrl');
                    if (resultUrl && resultUrl.style.display !== 'none' && resultUrl.href) {
                        window.location.href = resultUrl.href;
                        clearInterval(checkResult);
                    }
                    if (checkCount >= maxChecks) clearInterval(checkResult);
                }, 500);
            }
        }
        return;
    } else {
        checkForUpdate();

        if (document.getElementById('afk-bypasser-overlay')) return;

        const detectedDomain = (function() {
            try { return (window.location && window.location.hostname) ? window.location.hostname : ''; } catch (e) { return ''; }
        })();

        const duration = Math.max(0.5, Number(redirectWaitTime));

        const style = document.createElement('style');
        style.setAttribute('data-afk-style', '1');
        style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Space+Grotesk:wght@500;700&display=swap');

        :root {
            --primary: #2d6eff;
            --primary-glow: rgba(45,110,255,0.45);
            --text-muted: #94a3b8;
            --border: rgba(255,255,255,0.08);
            --radius: 20px;
        }

        html, body { height: 100%; min-height: 100%; }

        #afk-bypasser-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            z-index: 2147483647 !important;
            display:flex;
            align-items:center;
            justify-content:center;
            background: rgba(5,6,8,0.75);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
            -webkit-overflow-scrolling: touch;
        }

        .afk-card {
            width: min(92%, 560px);
            background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
            border-radius: var(--radius);
            border: 1px solid var(--border);
            padding: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 6px 30px var(--primary-glow);
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:10px;
        }

        .afk-header { display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center; }

        .afk-logo { width:64px;height:64px;border-radius:12px;box-shadow:0 0 22px rgba(45,110,255,0.12);object-fit:cover; }

        .afk-title {
            font-family:'Space Grotesk', sans-serif;
            font-size:1.6rem;
            font-weight:700;
            background: linear-gradient(90deg, var(--primary), #6c57ff);
            -webkit-background-clip:text;
            background-clip:text;
            color:transparent;
        }

        .afk-message { color: var(--text-muted); font-size:0.95rem; max-width:520px; }

        .afk-domain { color: var(--primary); font-weight:700; margin-left:6px; display:inline-flex; align-items:center; gap:8px; }
        .afk-domain img { width:16px; height:16px; border-radius:3px; display:inline-block; vertical-align:middle; }

        .afk-countdown { margin: 10px 0; display:flex; flex-direction:column; align-items:center; gap:8px; }

        .count-ring { width:56px; height:56px; display:block; }
        .ring-bg { stroke: rgba(255,255,255,0.04); stroke-width:6; fill:none; }
        .ring-fg { stroke: var(--primary); stroke-width:6; stroke-linecap:round; fill:none; filter: drop-shadow(0 6px 12px rgba(45,110,255,0.08)); }

        .afk-count-number {
            font-size:1.45rem;
            font-weight:800;
            color:var(--primary);
            padding:6px 8px;
            border-radius:10px;
            background: linear-gradient(180deg, rgba(45,110,255,0.08), rgba(255,255,255,0.01));
            border:1px solid rgba(45,110,255,0.08);
            min-width:40px;
            text-align:center;
            transition: transform 140ms ease;
        }

        .afk-info { color: var(--text-muted); font-size:0.92rem; text-align:center; max-width:560px; }

        .afk-actions { display:flex; gap:10px; margin-top:8px; flex-wrap:wrap; justify-content:center; }

        .afk-btn {
            padding:9px 18px;
            border-radius:12px;
            border:none;
            cursor:pointer;
            font-weight:600;
            font-size:0.95rem;
            transition: all 0.22s ease;
            box-shadow: 0 6px 14px rgba(0,0,0,0.35);
        }

        .afk-btn.primary { background: linear-gradient(90deg,var(--primary), #6c57ff); color:white; box-shadow:0 8px 24px rgba(45,110,255,0.18); }
        .afk-btn.ghost { background:transparent; border:1px solid rgba(255,255,255,0.06); color:var(--text-muted); }

        @media (max-width:520px) {
            .afk-card { padding:16px; width:92%; }
            .count-ring { width:48px; height:48px; }
            .afk-count-number { font-size:1.2rem; min-width:36px; }
            .afk-title { font-size:1.25rem; }
        }
        `;
        document.documentElement.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'afk-bypasser-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        const faviconUrl = detectedDomain ? `https://www.google.com

/s2/favicons?sz=64&domain=${encodeURIComponent(detectedDomain)}` : '';

        overlay.innerHTML = `
            <div class="afk-card" role="document" aria-labelledby="afk-title">
                <div class="afk-header">
                    <img class="afk-logo" src="https://raw.githubusercontent.com/john2032-design/Bypass-/refs/heads/main/B57FBD3E-489E-4F0D-A5C0-08017DA44C4E.png" alt="AFK Bypasser">
                    <div id="afk-title" class="afk-title">AFK Bypasser</div>
                    <div class="afk-message">
                        Detected a shortener on
                        <span class="afk-domain">
                            ${faviconUrl ? `<img src="${faviconUrl}" alt="favicon">` : ''}
                            <span id="afk-domain-text">${detectedDomain || 'this site'}</span>
                        </span>
                        — we'll redirect you to AFK Bypasser to resolve the link.
                    </div>
                </div>

                <div class="afk-countdown" aria-hidden="false">
                    <div class="afk-count-number" id="afk-count">${Math.ceil(duration)}</div>
                    <svg class="count-ring" viewBox="0 0 100 100" aria-hidden="true" role="img">
                        <circle class="ring-bg" cx="50" cy="50" r="28"></circle>
                        <circle class="ring-fg" id="afk-ring" cx="50" cy="50" r="28" transform="rotate(-90 50 50)"></circle>
                    </svg>
                </div>

                <div class="afk-info" id="afk-info">You will be automatically redirected. If nothing happens, use the button below.</div>

                <div class="afk-actions">
                    <button class="afk-btn primary" id="afk-go">Go now</button>
                    <button class="afk-btn ghost" id="afk-cancel">Cancel</button>
                </div>
            </div>
        `;

        document.documentElement.appendChild(overlay);

        try {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } catch (e) {}

        const countEl = document.getElementById('afk-count');
        const ringEl = document.getElementById('afk-ring');
        const goBtn = document.getElementById('afk-go');
        const cancelBtn = document.getElementById('afk-cancel');

        let circumference = 0;
        (function configureRing() {
            try {
                if (!ringEl) return;
                const rAttr = ringEl.getAttribute('r');
                const r = rAttr ? Number(rAttr) : 28;
                circumference = 2 * Math.PI * r;
                ringEl.style.strokeDasharray = String(circumference);
                ringEl.style.strokeDashoffset = String(circumference);
                ringEl.style.transition = 'none';
            } catch (e) {}
        })();

        let rafId = null;
        let startTime = null;
        const durationMs = duration * 1000;
        const endTimeEstimate = () => (startTime === null ? performance.now() + durationMs : startTime + durationMs);

        let redirectTriggered = false;

        function animate(time) {
            if (redirectTriggered) return;
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const clamped = Math.max(0, Math.min(elapsed, durationMs));
            const fraction = clamped / durationMs;
            if (ringEl && circumference) {
                const offset = circumference * (1 - fraction);
                ringEl.style.strokeDashoffset = String(offset);
            }
            const remainingMs = Math.max(0, Math.ceil((durationMs - elapsed)));
            const remainingSeconds = Math.ceil(remainingMs / 1000);
            if (countEl) countEl.textContent = String(remainingSeconds);

            if (elapsed < durationMs) {
                rafId = requestAnimationFrame(animate);
            } else {
                redirectTriggered = true;
                setTimeout(() => {
                    triggerRedirect();
                }, 30);
            }
        }

        rafId = requestAnimationFrame(animate);

        const fallbackTimeout = setTimeout(() => {
            if (redirectTriggered) return;
            redirectTriggered = true;
            if (rafId) cancelAnimationFrame(rafId);
            triggerRedirect();
        }, durationMs + 7000);

        goBtn.addEventListener('click', () => {
            if (redirectTriggered) return;
            redirectTriggered = true;
            if (rafId) cancelAnimationFrame(rafId);
            clearTimeout(fallbackTimeout);
            triggerRedirect();
        });

        cancelBtn.addEventListener('click', () => {
            if (redirectTriggered) return;
            redirectTriggered = true;
            if (rafId) cancelAnimationFrame(rafId);
            clearTimeout(fallbackTimeout);
            removeOverlay();
        });

        function triggerRedirect() {
            try {
                removeOverlay();
                const currentUrl = encodeURIComponent(window.location.href);
                window.location.href = `${bypasserSite}/?url=${currentUrl}`;
            } catch (e) {
                try { window.open(`${bypasserSite}/?url=${encodeURIComponent(window.location.href)}`, '_blank'); } catch (e) {}
            }
        }

        function removeOverlay() {
            try {
                if (rafId) cancelAnimationFrame(rafId);
                const el = document.getElementById('afk-bypasser-overlay');
                if (el) el.remove();
                const s = document.querySelector('style[data-afk-style="1"]');
                if (s) s.remove();
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
            } catch (e) {}
        }
    }
})();
