/* Mind Explorer v4 offline support. Cache only this app's own static assets. */
const CACHE="mind-explorer-v4-2026-11-02";
const PREFIX="mind-explorer-";
const FILES=["./","./index.html","./wisdom-details.js","./learning-data.js","./learning-lab.js","./studio-content.js","./studio-core.js","./studio-learn.js","./studio-explore.js","./studio-reflect.js","./studio-settings.js","./studio.css","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 if(req.mode==="navigate"){
  event.respondWith(fetch(req).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put("./index.html",copy)).catch(()=>{}))}return response}).catch(()=>caches.match("./index.html").then(cached=>cached||Response.error())));
  return;
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{if(response.ok&&url.pathname.startsWith(new URL(self.registration.scope).pathname)){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{}))}return response})));
});