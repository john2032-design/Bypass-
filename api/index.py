from flask import Flask, render_template, jsonify, request
from urllib.parse import urlparse
import os

app = Flask(**name**)

SUPPORTED_LIST = [
“https://mboost.me/*”,
“https://deltaios-executor.com/*”,
“https://krnl-ios.com/*”,
“https://auth.platoboost.app/*”,
“https://auth.platoboost.net/*”,
“https://loot-link.com/*”,
“https://lootlink.org/*”,
“https://lootlinks.co/*”,
“https://lootdest.info/*”,
“https://lootdest.org/*”,
“https://lootdest.com/*”,
“https://links-loot.com/*”,
“https://loot-links.com/*”,
“https://best-links.org/*”,
“https://lootlinks.com/*”,
“https://loot-labs.com/*”,
“https://lootlabs.com/*”,
“https://pandadevelopment.net/*”,
“https://krnl.cat/*”,
“https://lockr.so/*”,
“https://link-unlock.com/*”,
“https://direct-link.net/*”,
“https://link-target.net/*”,
“https://link-to.net/*”,
“https://link-center.net/*”,
“https://link-hub.net/*”,
“https://up-to-down.net/*”,
“https://linkvertise.com/*”,
“https://sub2get.com/*”,
“https://sub4unlock.com/*”,
“https://sub2unlock.net/*”,
“https://sub2unlock.com/*”,
“https://rekonise.com/*”,
“https://rkns.link/*”,
“https://rekonise.org/*”,
“https://overdrivehub.xyz/*”
]

def is_supported_url(url):
try:
for pattern in SUPPORTED_LIST:
p = pattern.replace(”*”, “”)
if p and p in url:
return True
return False
except Exception:
return False

@app.route(”/”)
def index():
return render_template(“index.html”, match_list=SUPPORTED_LIST)

@app.route(”/supported”)
def supported():
return render_template(“supported.html”, match_list=SUPPORTED_LIST)

@app.route(”/api/bypass”)
def api_bypass():
url = request.args.get(“url”)
if not url:
return jsonify({“status”:“error”,“message”:“No URL provided.”}), 400
parsed = urlparse(url)
if not parsed.scheme or not parsed.scheme.startswith(“http”):
return jsonify({“status”:“error”,“message”:“Invalid URL.”}), 400
if not is_supported_url(url):
return jsonify({“status”:“error”,“message”:“Unsupported link.”}), 400
return jsonify({“status”:“success”,“result”:url + “?bypassed=true”})
