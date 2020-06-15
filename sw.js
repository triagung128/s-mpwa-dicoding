const CACHE_NAME = "bundesliga-app-v1";
const urlsToCache = [
   "/",
   "/index.html",
   "/nav.html",
   "/pages/clubs.html",
   "/pages/standings.html",
   "/css/materialize.min.css",
   "/js/materialize.min.js",
   "/js/main.js",
   "/js/nav.js"
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