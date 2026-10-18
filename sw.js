const V='cap-v1',CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','hero.jpg'];
const EXT=['https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js','https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{
 const c=await caches.open(V);await c.addAll(CORE);
 await Promise.all(EXT.map(u=>c.add(new Request(u,{mode:'no-cors'})).catch(()=>{})));
 self.skipWaiting();
})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
 for(const k of await caches.keys())if(k!==V)await caches.delete(k);
 await self.clients.claim();
})())});
// نسخة الكاش أولاً (بيشتغل بدون نت) وبيتحدّث في الخلفية
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 e.respondWith((async()=>{
  const c=await caches.open(V),hit=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>null);
  if(hit)return hit;
  return (await net)||(r.mode==='navigate'?c.match('index.html'):Response.error());
 })());
});
