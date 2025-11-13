from flask import Flask, render_template, jsonify, request, send_from_directory
from urllib.parse import urlparse
import os
import json

app = Flask(__name__)

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

@app.route('/')
def index():
    return render_template('index.html', match_list=json.dumps(SUPPORTED_LIST))

@app.route('/supported')
def supported():
    return render_template('index.html', match_list=json.dumps(SUPPORTED_LIST))

@app.route('/api/bypass')
def api_bypass():
    url = request.args.get('url')
    if not url:
        return jsonify({'status': 'error', 'message': 'No URL provided.'})
    parsed = urlparse(url)
    if not parsed.scheme.startswith('http'):
        return jsonify({'status': 'error', 'message': 'Invalid URL.'})
    if not any(pattern.replace('*', '') in url for pattern in SUPPORTED_LIST):
        return jsonify({'status': 'error', 'message': 'Unsupported link.'})
    return jsonify({'status': 'success', 'result': url + "?bypassed=true"})

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
