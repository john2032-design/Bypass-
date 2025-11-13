(() => {
const matchList = window.CANONICAL_MATCH_LIST || [];
const form = document.getElementById(‘bypass-form’);
const urlInput = document.getElementById(‘url-input’);
const validationEl = document.getElementById(‘validation’);
const resultArea = document.getElementById(‘result-area’);
const resultContent = document.getElementById(‘result-content’);
const redirectControls = document.getElementById(‘redirect-controls’);
const countdownEl = document.getElementById(‘countdown’);
const cancelBtn = document.getElementById(‘cancel-redirect’);
const BYPASS_API = ‘/api/bypass’;

function patternToRegex(p) {
const esc = p.replace(/[.+^${}()|[]\]/g, ‘\$&’).replace(/\*/g, ‘.*’);
return new RegExp(’^’ + esc + ‘$’, ‘i’);
}

const matchRegexes = matchList.map(patternToRegex);

function isAllowed(url) {
try {
const u = new URL(url);
const canonical = u.protocol + ‘//’ + u.hostname + (u.pathname || ‘/’);
return matchRegexes.some(rx => rx.test(canonical));
} catch (e) {
return false;
}
}

function setValidation(msg, isError) {
validationEl.textContent = msg || ‘’;
validationEl.style.color = isError ? ‘var(–accent-red)’ : ‘’;
}

function escapeHtml(s) {
return String(s)
.replace(/&/g, ‘&’)
.replace(/</g, ‘<’)
.replace(/>/g, ‘>’)
.replace(/”/g, ‘"’)
.replace(/’/g, ‘'’);
}

resultContent.addEventListener(‘click’, () => {
const text = resultContent.dataset.raw || ‘’;
if (!text) return;
navigator.clipboard?.writeText(text).then(() => {
const prev = resultContent.innerHTML;
resultContent.innerHTML = ‘<span style="color:var(--accent);font-weight:700">Copied!</span>’;
setTimeout(() => resultContent.innerHTML = prev, 900);
}).catch(() => {});
});

form.addEventListener(‘submit’, (ev) => {
ev.preventDefault();
submitUrl(urlInput.value.trim());
});

urlInput.addEventListener(‘click’, () => {
try {
const v = urlInput.value || ‘’;
if (!v) return;
navigator.clipboard.writeText(v).then(() => {
const old = urlInput.value;
urlInput.value = ‘Copied!’;
setTimeout(() => urlInput.value = old, 900);
}).catch(() => {});
} catch (e) {}
});

document.addEventListener(‘keydown’, (e) => {
if (e.key === ‘Escape’) cancelRedirect();
});

let redirectTimer = null;

function showResult(payload) {
resultArea.classList.remove(‘card-hidden’);
resultContent.innerHTML = ‘’;
resultContent.dataset.raw = ‘’;

```
if (!payload) {
  resultContent.innerHTML = '<div style="color:var(--muted)">No data.</div>';
  return;
}

if (payload.status === 'error') {
  resultContent.innerHTML = `<div style="color:var(--accent-red);font-weight:700">${escapeHtml(payload.message || 'Error')}</div>`;
  redirectControls.classList.add('card-hidden');
  return;
}

if (payload.result && typeof payload.result === 'string' && /^https?:\/\//i.test(payload.result)) {
  const safe = escapeHtml(payload.result);
  resultContent.innerHTML = `<div style="padding:8px;border-radius:10px;background:transparent">${safe}</div>`;
  resultContent.dataset.raw = payload.result;
  
  let c = 15;
  countdownEl.textContent = c;
  redirectControls.classList.remove('card-hidden');
  
  if (redirectTimer) clearInterval(redirectTimer);
  redirectTimer = setInterval(() => {
    c -= 1;
    countdownEl.textContent = c;
    if (c <= 0) {
      clearInterval(redirectTimer);
      window.location.href = payload.result;
    }
  }, 1000);
} else {
  const txt = payload.message || (payload.result ? String(payload.result) : 'No result text.');
  resultContent.innerHTML = `<pre style="white-space:pre-wrap;margin:0">${escapeHtml(txt)}</pre>`;
  redirectControls.classList.add('card-hidden');
}
```

}

function cancelRedirect() {
if (redirectTimer) {
clearInterval(redirectTimer);
redirectTimer = null;
redirectControls.classList.add(‘card-hidden’);
setValidation(‘Redirect cancelled.’, false);
}
}

cancelBtn.addEventListener(‘click’, (e) => {
e.preventDefault();
cancelRedirect();
});

async function submitUrl(urlVal) {
if (!urlVal) {
setValidation(‘Please enter a URL.’, true);
return;
}

```
if (!isAllowed(urlVal)) {
  setValidation('This URL is not supported by the userscript / site.', true);
  return;
}

setValidation('Calling bypass API...', false);
resultArea.classList.add('card-hidden');

try {
  const endpoint = BYPASS_API + '?url=' + encodeURIComponent(urlVal);
  const resp = await fetch(endpoint, { method: 'GET' });
  const json = await resp.json();
  showResult(json);
  setValidation('', false);
} catch (err) {
  setValidation('Network error while calling server.', true);
}
```

}

function getQueryParam(name) {
try {
const u = new URL(window.location.href);
return u.searchParams.get(name);
} catch (e) {
return null;
}
}

document.addEventListener(‘DOMContentLoaded’, () => {
const pref = getQueryParam(‘url’) || getQueryParam(‘URL’) || getQueryParam(‘link’);
if (pref) {
try {
urlInput.value = pref;
} catch (e) {}
setTimeout(() => {
if (isAllowed(pref)) submitUrl(pref);
}, 220);
}
});
})();
