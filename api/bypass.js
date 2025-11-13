// api/bypass.js
// Vercel Serverless Function (CommonJS)
const allowedHosts = new Set([
  "mboost.me","deltaios-executor.com","krnl-ios.com","auth.platoboost.app","auth.platoboost.net",
  "loot-link.com","lootlink.org","lootlinks.co","lootdest.info","lootdest.org","lootdest.com",
  "links-loot.com","loot-links.com","best-links.org","loot-labs.com","lootlabs.com",
  "pandadevelopment.net","krnl.cat","lockr.so","link-unlock.com","direct-link.net",
  "link-target.net","link-to.net","link-center.net","link-hub.net","up-to-down.net",
  "linkvertise.com","sub2get.com","sub4unlock.com","sub2unlock.net","sub2unlock.com",
  "rekonise.com","rkns.link","rekonise.org","overdrivehub.xyz","bstlar.com","key.volcano.wtf","work.ink"
]);

function hostnameAllowed(rawUrl){
  try {
    const u = new URL(rawUrl);
    let h = (u.hostname||'').toLowerCase();
    if (h.startsWith('www.')) h = h.slice(4);
    return allowedHosts.has(h);
  } catch(e) {
    return false;
  }
}

module.exports = async (req, res) => {
  const url = (req.query && req.query.url) || (req.url && new URL(req.url, `http://${req.headers.host}`).searchParams.get('url')) || '';
  if (!url) {
    res.status(400).json({ status:'error', message:'Missing url parameter' });
    return;
  }
  if (!hostnameAllowed(url)) {
    res.status(403).json({ status:'error', message:"This host is not allowed." });
    return;
  }

  try {
    const apiUrl = new URL('https://vortex-bypass-two.vercel.app/bypass');
    apiUrl.searchParams.set('url', url);
    // use native fetch (Vercel Node supports fetch); fallback to node-fetch if needed
    const upstream = await fetch(apiUrl.toString(), { method:'GET' , headers:{ 'Accept':'application/json,text/plain,*/*' } , cache: 'no-store' });
    const contentType = upstream.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await upstream.json();
      res.status(upstream.status || 200).json(data);
      return;
    }
    const text = await upstream.text();
    res.status(upstream.status || 200).json({ status:'success', result: text });
  } catch (err) {
    res.status(502).json({ status:'error', message: 'Upstream API failure: ' + String(err) });
  }
};
