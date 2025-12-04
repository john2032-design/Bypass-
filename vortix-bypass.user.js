// ==UserScript==
// @name         Vortix Bypass Helper
// @namespace    https://vortix-bypass.vercel.app
// @version      2.3
// @description  Automatically redirects supported shorteners to Vortix Bypass
// @author       Vortix Bypass
// @icon         https://i.ibb.co/FqLb0CxF/F8-F01-A21-CD9-C-4573-9-CB9-8-B2917-ED039-F.png
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
// @match        *://auth.platoboost/*
// @updateURL    https://vortix-bypass.vercel.app/meta.js
// @downloadURL  https://raw.githubusercontent.com/john2032-design/Bypass-/refs/heads/main/vortix-bypass.user.js
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    if (window.vortixBypassLoaded) return;
    window.vortixBypassLoaded = true;

    const redirectWaitTime = 5;
    const bypasserSite = "https://vortix-bypass.vercel.app";
    const currentVersion = "2.3";

    function checkForUpdate() {
        if (window.location.href.includes('vortix-bypass.vercel.app')) return;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://vortix-bypass.vercel.app/meta.js",
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

    if (window.location.href.includes('vortix-bypass.vercel.app')) {
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

        if (document.getElementById('vortix-bypass-overlay')) return;

        const detectedDomain = (function() {
            try { return (window.location && window.location.hostname) ? window.location.hostname : ''; } catch (e) { return ''; }
        })();

        const duration = Math.max(0.5, Number(redirectWaitTime));

        const style = document.createElement('style');
        style.setAttribute('data-vortix-style', '1');
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

        #vortix-bypass-overlay {
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

        .vortix-card {
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

        .vortix-header { display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center; }

        .vortix-logo { width:64px;height:64px;border-radius:12px;box-shadow:0 0 22px rgba(45,110,255,0.12);object-fit:cover; }

        .vortix-title {
            font-family:'Space Grotesk', sans-serif;
            font-size:1.6rem;
            font-weight:700;
            background: linear-gradient(90deg, var(--primary), #6c57ff);
            -webkit-background-clip:text;
            background-clip:text;
            color:transparent;
        }

        .vortix-message { color: var(--text-muted); font-size:0.95rem; max-width:520px; }

        .vortix-domain { color: var(--primary); font-weight:700; margin-left:6px; display:inline-flex; align-items:center; gap:8px; }
        .vortix-domain img { width:16px; height:16px; border-radius:3px; display:inline-block; vertical-align:middle; }

        .vortix-countdown { margin: 10px 0; display:flex; flex-direction:column; align-items:center; gap:8px; }

        .count-ring { width:56px; height:56px; display:block; }
        .ring-bg { stroke: rgba(255,255,255,0.04); stroke-width:6; fill:none; }
        .ring-fg { stroke: var(--primary); stroke-width:6; stroke-linecap:round; fill:none; filter: drop-shadow(0 6px 12px rgba(45,110,255,0.08)); }

        .vortix-count-number {
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

        .vortix-info { color: var(--text-muted); font-size:0.92rem; text-align:center; max-width:560px; }

        .vortix-actions { display:flex; gap:10px; margin-top:8px; flex-wrap:wrap; justify-content:center; }

        .vortix-btn {
            padding:9px 18px;
            border-radius:12px;
            border:none;
            cursor:pointer;
            font-weight:600;
            font-size:0.95rem;
            transition: all 0.22s ease;
            box-shadow: 0 6px 14px rgba(0,0,0,0.35);
        }

        .vortix-btn.primary { background: linear-gradient(90deg,var(--primary), #6c57ff); color:white; box-shadow:0 8px 24px rgba(45,110,255,0.18); }
        .vortix-btn.ghost { background:transparent; border:1px solid rgba(255,255,255,0.06); color:var(--text-muted); }

        @media (max-width:520px) {
            .vortix-card { padding:16px; width:92%; }
            .count-ring { width:48px; height:48px; }
            .vortix-count-number { font-size:1.2rem; min-width:36px; }
            .vortix-title { font-size:1.25rem; }
        }
        `;
        document.documentElement.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'vortix-bypass-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        const faviconUrl = detectedDomain ? `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(detectedDomain)}` : '';

        overlay.innerHTML = `
            <div class="vortix-card" role="document" aria-labelledby="vortix-title">
                <div class="vortix-header">
                    <img class="vortix-logo" src="https://i.ibb.co/FqLb0CxF/F8-F01-A21-CD9-C-4573-9-CB9-8-B2917-ED039-F.png" alt="Vortix Bypass">
                    <div id="vortix-title" class="vortix-title">Vortix Bypass</div>
                    <div class="vortix-message">
                        Detected a shortener on
                        <span class="vortix-domain">
                            ${faviconUrl ? `<img src="${faviconUrl}" alt="favicon">` : ''}
                            <span id="vortix-domain-text">${detectedDomain || 'this site'}</span>
                        </span>
                        — we'll redirect you to Vortix Bypass to resolve the link.
                    </div>
                </div>

                <div class="vortix-countdown" aria-hidden="false">
                    <div class="vortix-count-number" id="vortix-count">${Math.ceil(duration)}</div>
                    <svg class="count-ring" viewBox="0 0 100 100" aria-hidden="true" role="img">
                        <circle class="ring-bg" cx="50" cy="50" r="28"></circle>
                        <circle class="ring-fg" id="vortix-ring" cx="50" cy="50" r="28" transform="rotate(-90 50 50)"></circle>
                    </svg>
                </div>

                <div class="vortix-info" id="vortix-info">You will be automatically redirected. If nothing happens, use the button below.</div>

                <div class="vortix-actions">
                    <button class="vortix-btn primary" id="vortix-go">Go now</button>
                    <button class="vortix-btn ghost" id="vortix-cancel">Cancel</button>
                </div>
            </div>
        `;

        document.documentElement.appendChild(overlay);

        try {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } catch (e) {}

        const countEl = document.getElementById('vortix-count');
        const ringEl = document.getElementById('vortix-ring');
        const goBtn = document.getElementById('vortix-go');
        const cancelBtn = document.getElementById('vortix-cancel');

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

        let countdownInterval = null;
        let redirectTimeout = null;
        const durationMs = duration * 1000;
        let remainingTime = durationMs;
        let startTime = Date.now();
        
        let redirectTriggered = false;

        function updateCountdown() {
            if (redirectTriggered) return;
            
            const elapsed = Date.now() - startTime;
            remainingTime = Math.max(0, durationMs - elapsed);
            const remainingSeconds = Math.ceil(remainingTime / 1000);
            
            if (countEl) countEl.textContent = String(remainingSeconds);
            
            if (ringEl && circumference) {
                const fraction = elapsed / durationMs;
                const offset = circumference * (1 - Math.min(fraction, 1));
                ringEl.style.strokeDashoffset = String(offset);
            }
            
            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                redirectTriggered = true;
                triggerRedirect();
            }
        }

        // Start countdown
        countdownInterval = setInterval(updateCountdown, 100);
        updateCountdown(); // Initial update

        // Fallback timeout (in case something goes wrong with the interval)
        const fallbackTimeout = setTimeout(() => {
            if (redirectTriggered) return;
            redirectTriggered = true;
            if (countdownInterval) clearInterval(countdownInterval);
            triggerRedirect();
        }, durationMs + 2000);

        goBtn.addEventListener('click', () => {
            if (redirectTriggered) return;
            redirectTriggered = true;
            if (countdownInterval) clearInterval(countdownInterval);
            clearTimeout(fallbackTimeout);
            triggerRedirect();
        });

        cancelBtn.addEventListener('click', () => {
            if (redirectTriggered) return;
            redirectTriggered = true;
            if (countdownInterval) clearInterval(countdownInterval);
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
                if (countdownInterval) clearInterval(countdownInterval);
                if (redirectTimeout) clearTimeout(redirectTimeout);
                clearTimeout(fallbackTimeout);
                const el = document.getElementById('vortix-bypass-overlay');
                if (el) el.remove();
                const s = document.querySelector('style[data-vortix-style="1"]');
                if (s) s.remove();
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
            } catch (e) {}
        }
    }
})();
