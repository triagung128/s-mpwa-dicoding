if ("serviceWorker" in navigator) {
   window.addEventListener("load", function () {
      navigator.serviceWorker
         .register("/../service-worker.js")
         .then(function () {
            console.log("Pendaftaran ServiceWorker Berhasil");
         })
         .catch(function () {
            console.log("Pendaftaran ServiceWorker Gagal");
         });
   });
} else {
   console.log("ServiceWorker belum didukung browser ini.");
}