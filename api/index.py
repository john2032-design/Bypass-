from flask import Flask, request, render_template, jsonify
import re
import requests
import time
from urllib.parse import urlparse, unquote

app = Flask(__name__, static_folder="../static", template_folder="../templates")

MATCH_LIST = [
    "https://mboost.me/*",
    "https://deltaios-executor.com/*",
    "https://krnl-ios.com/*",
    "https://auth.platoboost.app/*",
    "https://auth.platoboost.net/*",
    "https://loot-link.com/*",
    "https://lootlink.org/*",
    "https://lootlinks.co/*",
    "https://lootdest.info/*",
    "https://lootdest.org/*",
    "https://lootdest.com/*",
    "https://links-loot.com/*",
    "https://loot-links.com/*",
    "https://best-links.org/*",
    "https://lootlinks.com/*",
    "https://loot-labs.com/*",
    "https://lootlabs.com/*",
    "https://pandadevelopment.net/*",
    "https://krnl.cat/*",
    "https://lockr.so/*",
    "https://link-unlock.com/*",
    "https://direct-link.net/*",
    "https://link-target.net/*",
    "https://link-to.net/*",
    "https://link-center.net/*",
    "https://link-hub.net/*",
    "https://up-to-down.net/*",
    "https://linkvertise.com/*",
    "https://sub2get.com/*",
    "https://sub4unlock.com/*",
    "https://sub2unlock.net/*",
    "https://sub2unlock.com/*",
    "https://rekonise.com/*",
    "https://rkns.link/*",
    "https://rekonise.org/*",
    "https://overdrivehub.xyz/*"
]

def match_to_regex(pattern):
    p = re.escape(pattern)
    p = p.replace(r"\*", ".*")
    return re.compile(r"^" + p + r"$", re.IGNORECASE)

MATCH_REGEXES = [match_to_regex(p) for p in MATCH_LIST]

RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX = 30
_rate_store = {}

def is_rate_limited(ip):
    now = time.time()
    arr = _rate_store.get(ip, [])
    arr = [t for t in arr if t > now - RATE_LIMIT_WINDOW]
    arr.append(now)
    _rate_store[ip] = arr
    return len(arr) > RATE_LIMIT_MAX

def url_allowed(url):
    try:
        u = unquote(url.strip())
        if not (u.startswith("http://") or u.startswith("https://")):
            return False
        parsed = urlparse(u)
        canonical = f"{parsed.scheme}://{parsed.netloc}{parsed.path or '/'}"
        for rx in MATCH_REGEXES:
            if rx.match(canonical):
                return True
        return False
    except Exception:
        return False

EXTERNAL_BYPASS_BASE = "https://vortex-bypass-two.vercel.app/bypass"

@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response

@app.route("/")
def index():
    return render_template("index.html", match_list=MATCH_LIST)

@app.route("/api/bypass", methods=["GET"])
def api_bypass():
    client_ip = request.remote_addr or "unknown"
    if is_rate_limited(client_ip):
        return jsonify({"status": "error", "message": "Rate limit exceeded. Try again later."}), 429
    target = request.args.get("url", "")
    if not target:
        return jsonify({"status": "error", "message": "Missing url parameter."}), 400
    if not url_allowed(target):
        return jsonify({"status": "error", "message": "URL is not allowed by policy."}), 400
    try:
        r = requests.get(EXTERNAL_BYPASS_BASE, params={"url": target}, timeout=18)
    except requests.RequestException:
        return jsonify({"status": "error", "message": "Network error contacting bypass API."}), 502
    content_type = r.headers.get("Content-Type", "")
    try:
        if "application/json" in content_type:
            data = r.json()
            status = data.get("status", "error")
            result = data.get("result")
            message = data.get("message", "")
            return jsonify({"status": status, "result": result, "message": message}), r.status_code
        else:
            text = r.text or ""
            url_match = re.search(r"https?://[^\s'\"<>]+", text)
            if url_match:
                return jsonify({"status": "success", "result": url_match.group(0), "message": ""}), 200
            else:
                return jsonify({"status": "success", "result": None, "message": text[:2000]}), 200
    except Exception:
        return jsonify({"status": "error", "message": "Invalid response from bypass API."}), 502
