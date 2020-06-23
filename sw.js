importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

const CACHE_NAME = "bundesliga-pwa-v1";
const urlsToCache = [
   "/",
   "/index.html",
   "/nav.html",
   "/pages/teams.html",
   "/pages/standings.html",
   "/pages/favorite_teams.html",
   "/css/materialize.min.css",
   "/js/materialize.min.js",
   "/js/main.js",
   "/js/nav.js",
   "/js/api.js",
   "/js/idb.js",
   "/js/db.js"
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

self.addEventListener("activate", event => {
   event.waitUntil(
      caches.keys().then(cacheNames => {
         return Promise.all(
            cacheNames.map(cacheName => {
               if (cacheName != CACHE_NAME) {
                  console.log("ServiceWorker: cache " + cacheName + " dihapus");
                  return caches.delete(cacheName);
               }
            })
         )
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
         caches.match(event.request, {'ignoreSearch': true}).then(response => {
            return response || fetch(event.request);
         })
      )
   }
});

self.addEventListener("push", event => {
   let body;

   if (event.data){
      body = event.data.text();
   } else {
      body = "Push message no payload";
   }

   const options = {
      body: body,
      icon: "img/icon.png",
      vibrate: [100, 50, 100],
      data: {
         dateOfArrival: Date.now(),
         primaryKey: 1
      }
   };

   event.waitUntil(
      self.registration.showNotification("Push Notification", options)
   );
});