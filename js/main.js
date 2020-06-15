if (!("serviceWorker" in navigator)) {
   console.log("ServiceWorker: Browser tidak mendukung.");
} else {
   navigator.serviceWorker
      .register("/sw.js")
      .then(registration => {
         console.log("ServiceWorker: Pendaftaran berhasil. Scope:", registration.scope);
      })
      .catch(error => {
         console.log("ServiceWorker: Pendaftaran gagal. Error:", error);
      });
}