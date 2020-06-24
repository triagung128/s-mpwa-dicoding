importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');


if (workbox){
   console.log("Workbox berhasil dimuat");

   // Precaching App Shell di Workbox
   workbox.precaching.precacheAndRoute([
      { url: "/", revision: "1" },
      { url: "/index.html", revision: "1" },
      { url: "/nav.html", revision: "1" },
      { url: "/manifest.json", revision: "1" },
      { url: "/img/icon-192x192.png", revision: "1" },
      { url: "/img/icon-512x512.png", revision: "1" },
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
   ], {
      ignoreUrlParametersMatching: [/.*/]
   });

   // Routing workbox untuk menyimpan cache dari data api.football-data.org
   workbox.routing.registerRoute(
      new RegExp("https://api.football-data.org/v2/"),
      workbox.strategies.staleWhileRevalidate({
         plugins: [
            new workbox.cacheableResponse.Plugin({
               statuses: [200]
            }),
            new workbox.expiration.Plugin({
               maxAgeSeconds: 60 * 60 * 24 * 365,
               maxEntries: 30
            })
         ]
      })
   );
   
   // Routing workbox untuk menyimpan cache dari data google fonts
   workbox.routing.registerRoute(
      /.*(?:googleapis|gstatic)\.com/,
      workbox.strategies.staleWhileRevalidate({
         cacheName: "google-fonts-stylesheets"
      })
   );

   // Routing di workbox untuk menyimpan cache folder pages
   workbox.routing.registerRoute(
      new RegExp("/pages/"),
      workbox.strategies.staleWhileRevalidate()
   );

} else {
   console.log("Workbox gagal dimuat");
}

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