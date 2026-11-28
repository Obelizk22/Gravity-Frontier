const CACHE='gravity-frontier-v57';
const ASSETS=['./','./index.html?v=57','./manifest.webmanifest','./icon-192.png','./icon-512.png','./multiplayer-bridge.js','./ai-training-lab.js'];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('gravity-frontier-')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const isPage=request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/');
    try{
      const freshRequest=new Request(request,{cache:'no-store'});
      const response=await fetch(freshRequest);
      if(response&&response.ok){
        const copy=response.clone();
        const key=isPage?'./index.html':request;
        await cache.put(key,copy);
      }
      return response;
    }catch(error){
      const cached=await cache.match(request)||await cache.match(isPage?'./index.html':'./');
      if(cached)return cached;
      throw error;
    }
  })());
});
