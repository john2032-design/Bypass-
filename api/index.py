from flask import Flask, render_template, jsonify, request, send_from_directory
import re
import time
from urllib.parse import unquote, urlparse

app = Flask(__name__, static_folder="static", template_folder="templates")

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

def pattern_to_regex(p):
    esc = re.escape(p)
    esc = esc.replace(r"\*", ".*")
    return re.compile(r"^" + esc + r"$", re.IGNORECASE)

MATCH_REGEXES = [pattern_to_regex(p) for p in MATCH_LIST]

RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX = 60
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

@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response

@app.route("/")
def index():
    return render_template("index.html", match_list=MATCH_LIST)

@app.route("/supported")
def supported():
    return render_template("supported.html", match_list=MATCH_LIST)

@app.route("/api/bypass")
def api_bypass():
    client_ip = request.remote_addr or "unknown"
    if is_rate_limited(client_ip):
        return jsonify({"status":"error","message":"Rate limit exceeded."}), 429
    target = request.args.get("url", "")
    if not target:
        return jsonify({"status":"error","message":"Missing url parameter."}), 400
    if not url_allowed(target):
        return jsonify({"status":"error","message":"URL is not allowed."}), 400
    return jsonify({"status":"success","result":target}), 200

@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory("static", path)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
