// ==UserScript==
// @name         AFK Bypasser Helper
// @namespace    https://github.com/afk-bypasser
// @version      1.2
// @description  Automatically redirects supported shorteners to AFK Bypasser
// @author       AFK Bypasser
// @match        *://mobile.codex.lol/*
// @match        *://*trigon/*
// @match        *://*rekonise.com/*
// @match        *://*linkvertise.com/*
// @match        *://*paster.so/*
// @match        *://*cuttlinks.com/*
// @match        *://*boost.ink/*
// @match        *://*bst.gg/*
// @match        *://*keyguardian.net/*
// @match        *://*bstshrt.com/*
// @match        *://*nicuse.com/*
// @match        *://*getkey.xyz/*
// @match        *://bit.do/*
// @match        *://bit.ly/*
// @match        *://*blox-script.com/*
// @match        *://cl.gy/*
// @match        *://*cuty.io/*
// @match        *://*cuttlinks.com/*
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
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // AFK Bypasser site URL - UPDATE THIS AFTER DEPLOYMENT
    const bypasserSite = "https://afk-bypasser.vercel.app";
    
    // Check if we're already on the bypasser site
    if (window.location.href.includes(bypasserSite.replace('https://', ''))) {
        handleBypasserSite();
    } else {
        handleSupportedSite();
    }
    
    function handleBypasserSite() {
        // Auto-fill and submit if URL parameter exists
        const urlParams = new URLSearchParams(window.location.search);
        const urlParam = urlParams.get('url');
        
        if (urlParam) {
            // Wait for page to load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initBypasser);
            } else {
                initBypasser();
            }
        }
        
        function initBypasser() {
            // Find the URL input
            const urlInput = document.querySelector('input[type="url"]');
            const bypassBtn = document.querySelector('#bypassBtn');
            
            if (urlInput && bypassBtn) {
                // Fill the input
                urlInput.value = decodeURIComponent(urlParam);
                
                // Click the bypass button after a short delay
                setTimeout(() => {
                    bypassBtn.click();
                    
                    // Check for result and auto-redirect if it's a URL
                    let checkCount = 0;
                    const maxChecks = 40; // 20 seconds maximum
                    const checkResult = setInterval(() => {
                        checkCount++;
                        const resultUrl = document.querySelector('#resultUrl');
                        if (resultUrl && resultUrl.style.display !== 'none' && resultUrl.href) {
                            // It's a URL result, auto-redirect after 1 second
                            setTimeout(() => {
                                window.location.href = resultUrl.href;
                            }, 1000);
                            clearInterval(checkResult);
                        }
                        
                        // Stop checking after max attempts
                        if (checkCount >= maxChecks) {
                            clearInterval(checkResult);
                        }
                    }, 500);
                }, 1000);
            }
        }
    }
    
    function handleSupportedSite() {
        // We're on a supported site, show overlay and countdown
        showOverlay();
    }
    
    function showOverlay() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'afk-bypasser-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 14, 23, 0.95);
            backdrop-filter: blur(10px);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        // Create content
        const content = document.createElement('div');
        content.style.cssText = `
            text-align: center;
            max-width: 500px;
            padding: 30px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            margin: 20px;
        `;
        
        const title = document.createElement('h2');
        title.textContent = 'AFK Bypasser';
        title.style.cssText = `
            font-size: 2.5rem;
            margin-bottom: 15px;
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: 800;
        `;
        
        const message = document.createElement('p');
        message.textContent = 'Redirecting to bypass this link...';
        message.style.cssText = `
            font-size: 1.2rem;
            margin-bottom: 20px;
            color: #cbd5e1;
        `;
        
        const countdown = document.createElement('div');
        countdown.id = 'afk-countdown';
        countdown.style.cssText = `
            font-size: 3rem;
            font-weight: bold;
            margin: 20px 0;
            color: #3b82f6;
        `;
        countdown.textContent = '10';
        
        const info = document.createElement('p');
        info.textContent = 'You will be automatically redirected to AFK Bypasser';
        info.style.cssText = `
            font-size: 1rem;
            color: #94a3b8;
            margin-top: 20px;
        `;
        
        // Assemble overlay
        content.appendChild(title);
        content.appendChild(message);
        content.appendChild(countdown);
        content.appendChild(info);
        overlay.appendChild(content);
        
        // Add to page
        document.documentElement.appendChild(overlay);
        
        // Start countdown
        let count = 10;
        const countdownElement = document.getElementById('afk-countdown');
        const countdownInterval = setInterval(() => {
            count--;
            countdownElement.textContent = count.toString();
            
            if (count <= 0) {
                clearInterval(countdownInterval);
                // Redirect to AFK Bypasser with current URL
                const currentUrl = encodeURIComponent(window.location.href);
                window.location.href = `${bypasserSite}/?url=${currentUrl}`;
            }
        }, 1000);
        
        // Prevent any page interaction
        document.body.style.overflow = 'hidden';
    }
})();
