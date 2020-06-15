const CACHE_NAME = "bundesliga-pwa-v1";
const urlsToCache = [
   "/",
   "/index.html",
   "/nav.html",
   "/pages/teams.html",
   "/pages/standings.html",
   "/css/materialize.min.css",
   "/js/materialize.min.js",
   "/js/main.js",
   "/js/nav.js",
   "js/api.js"
];

self.addEventListener("install", event => {
   console.log("ServiceWorker: Menginstall...");

   event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
         console.log("ServiceWorker: Membuka cache...");
         return cache.addAll(urlsToCache);
      })
   );
});

self.addEventListener("fetch", event => {
   const base_url = "https://api.football-data.org/v2/";
   if (event.request.url.indexOf(base_url) > -1) {
      event.respondWith(
         caches.open(CACHE_NAME).then(cache => {
            return fetch(event.request).then(response => {
               cache.put(event.request.url, response.clone());
               return response;
            })
         })
      );
   } else {
      event.respondWith(
         caches.match(event.request).then(response => {
            return response || fetch(event.request);
         })
      )
   }
});