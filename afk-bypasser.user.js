// ==UserScript==
// @name         AFK Bypasser Helper
// @namespace    https://afk-bypasser.vercel.app
// @version      2.0
// @description  Automatically redirects supported shorteners to AFK Bypasser
// @author       AFK Bypasser
// @icon         https://raw.githubusercontent.com/john2032-design/Bypass-/refs/heads/main/B57FBD3E-489E-4F0D-A5C0-08017DA44C4E.png
// @match        *://mobile.codex.lol/*
// @match        *://*trigon/*
// @match        *://*rekonise.com/*
// @match        *://*linkvertise.com/*
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
// @match        *://krnl.cat/*
// @match        *://keyrblx.com/*
// @match        *://pandadevelopment.net/*
// @updateURL    https://afk-bypasser.vercel.app/meta.js
// @downloadURL  https://raw.githubusercontent.com/john2032-design/Bypass-/refs/heads/main/afk-bypasser.user.js
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    if (window.afkBypasserLoaded) {
        return;
    }
    window.afkBypasserLoaded = true;
    
    const redirectWaitTime = 5;
    const bypasserSite = "https://afk-bypasser.vercel.app";
    const currentVersion = "2.0";
    
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
                } catch (e) {
                }
            },
            onerror: function() {
            }
        });
    }
    
    if (window.location.href.includes('afk-bypasser.vercel.app')) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlParam = urlParams.get('url');
        if (urlParam) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initBypasser);
            } else {
                initBypasser();
            }
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
                    if (checkCount >= maxChecks) {
                        clearInterval(checkResult);
                    }
                }, 500);
            }
        }
    } else {
        checkForUpdate();
        
        if (document.getElementById('afk-bypasser-overlay')) {
            return;
        }
        
        const overlay = document.createElement('div');
        overlay.id = 'afk-bypasser-overlay';
        overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,14,23,0.95);backdrop-filter:blur(10px);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:'Segoe UI',sans-serif;`;
        
        const content = document.createElement('div');
        content.style.cssText = `text-align:center;max-width:500px;padding:30px;background:rgba(255,255,255,0.08);border-radius:20px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 8px 32px rgba(0,0,0,0.3);margin:20px;`;
        
        const title = document.createElement('h2');
        title.textContent = 'AFK Bypasser';
        title.style.cssText = `font-size:2.5rem;margin-bottom:15px;background:linear-gradient(to right,#3b82f6,#8b5cf6);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:800;`;
        
        const message = document.createElement('p');
        message.textContent = 'Redirecting to bypass this link...';
        message.style.cssText = `font-size:1.2rem;margin-bottom:20px;color:#cbd5e1;`;
        
        const countdown = document.createElement('div');
        countdown.id = 'afk-countdown';
        countdown.style.cssText = `font-size:3rem;font-weight:bold;margin:20px 0;color:#3b82f6;`;
        countdown.textContent = redirectWaitTime.toString();
        
        const info = document.createElement('p');
        info.textContent = 'You will be automatically redirected to AFK Bypasser';
        info.style.cssText = `font-size:1rem;color:#94a3b8;margin-top:20px;`;
        
        content.appendChild(title);
        content.appendChild(message);
        content.appendChild(countdown);
        content.appendChild(info);
        overlay.appendChild(content);
        document.documentElement.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        let count = redirectWaitTime;
        const countdownElement = document.getElementById('afk-countdown');
        let redirectTriggered = false;
        
        const countdownInterval = setInterval(() => {
            if (redirectTriggered) {
                clearInterval(countdownInterval);
                return;
            }
            
            count--;
            countdownElement.textContent = count.toString();
            
            if (count <= 0) {
                redirectTriggered = true;
                clearInterval(countdownInterval);
                const currentUrl = encodeURIComponent(window.location.href);
                window.location.href = `${bypasserSite}/?url=${currentUrl}`;
            }
        }, 1000);
        
        setTimeout(() => {
            if (!redirectTriggered) {
                redirectTriggered = true;
                clearInterval(countdownInterval);
                const currentUrl = encodeURIComponent(window.location.href);
                window.location.href = `${bypasserSite}/?url=${currentUrl}`;
            }
        }, (redirectWaitTime + 5) * 1000);
    }
})();
