from flask import Flask, render_template, jsonify, request, send_from_directory
from urllib.parse import urlparse
import os
import json
import traceback

app = Flask(__name__, static_folder="static", template_folder="templates")

SUPPORTED_LIST = [
    "https://work.ink/*",
    "https://loot-link.com/*",
    "https://boost.ink/*",
    "https://rekonise.com/*",
    "https://mboost.me/*",
    "https://shorten.world/*",
    "https://boosthub.gg/*",
    "https://link-hub.net/*",
    "https://sub2unlock.net/*",
    "https://linkvertise.com/*",
    "https://lootlabs.gg/*",
    "https://adfoc.us/*",
    "https://link-center.net/*",
    "https://rekonise.com/*",
    "https://boosty.to/*",
    "https://auth.platoboost.com/*",
    "https://keyrblx.com/*",
    "https://krnl.cat/*",
    "https://workink.net/*",
    "https://sub2unlock.io/*",
    "https://lootlinks.co/*"
]

def is_supported_url(url):
    try:
        for pattern in SUPPORTED_LIST:
            p = pattern.replace("*", "")
            if p and p in url:
                return True
        return False
    except Exception:
        return False

@app.route("/")
def index():
    try:
        return render_template("index.html", match_list=SUPPORTED_LIST)
    except Exception:
        print(traceback.format_exc())
        return "Internal Server Error", 500

@app.route("/supported")
def supported():
    try:
        return render_template("index.html", match_list=SUPPORTED_LIST)
    except Exception:
        print(traceback.format_exc())
        return "Internal Server Error", 500

@app.route("/api/bypass")
def api_bypass():
    try:
        url = request.args.get("url")
        if not url:
            return jsonify({"status":"error","message":"No URL provided."}), 400
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.scheme.startswith("http"):
            return jsonify({"status":"error","message":"Invalid URL."}), 400
        if not is_supported_url(url):
            return jsonify({"status":"error","message":"Unsupported link."}), 400
        return jsonify({"status":"success","result":url + "?bypassed=true"})
    except Exception:
        print(traceback.format_exc())
        return jsonify({"status":"error","message":"Server error."}), 500

@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory("static", path)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
