importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
   console.log("Workbox berhasil dimuat");

   // Precaching App Shell di Workbox
   const urlsToCache = [
      { url: "/", revision: "1" },
      { url: "/index.html", revision: "1" },
      { url: "/nav.html", revision: "1" },
      { url: "/pages/teams.html", revision: "1" },
      { url: "/pages/standings.html", revision: "1" },
      { url: "/pages/favorite_teams.html", revision: "1" },
      { url: "/css/materialize.min.css", revision: "1" },
      { url: "/js/materialize.min.js", revision: "1" },
      { url: "/js/main.js", revision: "1" },
      { url: "/js/nav.js", revision: "1" },
      { url: "/js/api.js", revision: "1" },
      { url: "/js/idb.js", revision: "1" },
      { url: "/js/db.js", revision: "1" }
   ];
   workbox.precaching.precacheAndRoute(urlsToCache);

} else {
   console.log("Workbox gagal dimuat");
}

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