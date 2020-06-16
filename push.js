const webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BANz4MhJBP68vgCbHKZ9DbkEmIxTwokMyLWQtQ6iZemSnyM4HCWgYVVq5AE5dm1flC1cuBxGU2ZLEkJJPaDYwYI",
   "privateKey": "JR7pKtlJkqBnly4jS6cIs8nJnqnEG4y1Fl-_NOywBTA"
};

webPush.setVapidDetails(
   'mailto:triagung128@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
);

const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/e56Mv_UHjUk:APA91bEy1qzLyHUdyUU4uyrC0woKDGnirImFt1ID1KVjVmWuBwisW_UbtJ8C8SuyWzz-vhjh0mK1gvtX7Kf9wx-xD4YsqL29r1NnRpqLhJntY8qRBRfpFrJX5OA33-5DNv9ViAZVfZu7",
   "keys": {
      "p256dh": "BAthttncrlXBDAeETxoJw58XGpDRe99Ft72NklgQum4QYy8oQJNoYjeAd75jaU3lShW5l5yolDNmRmLpFormSpg=",
      "auth": "0M7QulVdrRIh85mykv9icA=="
   }
};

const payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

const options = {
   gcmAPIKey: "396460728797",
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);