const CACHE_NAME = "kodingman-v2";
var urlsToCache = [
   "/",
   "/nav.html",
   "/index.html",
   "/pages/beranda.html",
   "/pages/tutorial.html",
   "/pages/artikel.html",
   "/pages/tentang.html",
   "/pages/kontak.html",
   "/assets/artikel-1.jpg",
   "/assets/artikel-2.jpg",
   "/assets/artikel-3.jpg",
   "/assets/java.jpg",
   "/assets/jumbotron.jpg",
   "/assets/kotlin.png",
   "/assets/logo-css.png",
   "/assets/logo-html.png",
   "/assets/logo-java.png",
   "/assets/logo-javascript.png",
   "/assets/logo-kotlin.png",
   "/assets/logo-mysql.png",
   "/assets/logo-php.png",
   "/assets/logo-phyton.png",
   "/assets/logo.png",
   "/assets/php.png",
   "/css/materialize.min.css",
   "/css/styles.css",
   "/js/materialize.min.js",
   "/js/nav.js",
   "/js/script.js",
   "/assets/logo-kodingman-512x512.png",
   "/assets/logo-kodingman-192x192.png",
   "/manifest.json"
];

self.addEventListener("install", function(event) {
   event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
         return cache.addAll(urlsToCache);
      })
   );
});

self.addEventListener("fetch", function(event) {
   event.respondWith(
      caches
         .match(event.request, {cacheName: CACHE_NAME})
         .then(function(response) {
            if (response) {
               console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
               return response;
            }

            console.log("ServiceWorker: Memuat aset dari server: ", event.request.url);
            return fetch(event.request);
         })
   );
});

self.addEventListener("activate", function(event) {
   event.waitUntil(
      caches.keys().then(function(cacheNames) {
         return Promise.all(
            cacheNames.map(function(cacheName) {
               if (cacheName != CACHE_NAME) {
                  console.log("ServiceWorker: cache " + cacheName + " dihapus");
                  return caches.delete(cacheName);
               }
            })
         );
      })
   );
});