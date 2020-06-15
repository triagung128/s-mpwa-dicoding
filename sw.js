const CACHE_NAME = "bundesliga-pwa-v1";
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

self.addEventListener("fetch", event => {
   event.respondWith(
      caches.match(event.request).then(response => {
         console.log("ServiceWorker: Menarik data: ", event.request.url);

         if (response) {
            console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
            return response;
         }

         console.log("ServiceWorker: Memuat aset dari server: ", event.request.url);
         return fetch(event.request);
      })
   );
});