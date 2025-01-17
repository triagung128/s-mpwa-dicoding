if (!("serviceWorker" in navigator)) {
   console.log("ServiceWorker: Browser tidak mendukung.");
} else {
   registerServiceWorker();
   requestPermission();
}

function registerServiceWorker(){
   window.addEventListener("load", () => {
      navigator.serviceWorker
         .register("/sw.js")
         .then(registration => {
            console.log("ServiceWorker: Pendaftaran berhasil. Scope:", registration.scope);
         })
         .catch(error => {
            console.log("ServiceWorker: Pendaftaran gagal. Error:", error);
         });

      navigator.serviceWorker.ready.then(() => {
         console.log("ServiceWorker: Sudah siap bekerja. ");
      });
   });
}

function requestPermission(){
   if ("Notification" in window){
      Notification.requestPermission().then(result => {
         if (result === "denied"){
            console.log("Fitur notifikasi tidak diijinkan.");
            return;
         } else if (result === "default"){
            console.error("Pengguna menutup kotak dialog permintaan ijin.");
            return;
         }

         if ("PushManager" in window) {
            navigator.serviceWorker.getRegistration().then(registration => {
               registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array("BANz4MhJBP68vgCbHKZ9DbkEmIxTwokMyLWQtQ6iZemSnyM4HCWgYVVq5AE5dm1flC1cuBxGU2ZLEkJJPaDYwYI")
               }).then(subscribe => {
                  console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                  console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                     null, new Uint8Array(subscribe.getKey('p256dh')))));
                  console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                     null, new Uint8Array(subscribe.getKey('auth')))));
               }).catch(error => {
                  console.error("Tidak dapat melakukan subscribe", error.message);
               });
            });
         }
      });
   }
}

function urlBase64ToUint8Array(base64String) {
   const padding = '='.repeat((4 - base64String.length % 4) % 4);
   const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   const rawData = window.atob(base64);
   const outputArray = new Uint8Array(rawData.length);
   for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
   }
   return outputArray;
}