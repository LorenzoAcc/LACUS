self.addEventListener('install', function (e) {
  console.log('ServiceWorker Install');
  e.waitUntil(
    caches.open('v2').then(function (cache) {
      return cache.addAll([
        '/public/offline.html',
        '/css/main.css',
        '/fonts/poppins/Poppins-Regular.ttf',
        'fonts/poppins/Poppins-Bold.ttf',
        'fonts/poppins/Poppins-Medium.ttf',
        'fonts/montserrat/Montserrat-Bold.ttf',
        'https://fonts.googleapis.com/css2?family=Poppins&display=swap',
        '/img/A4.PNG',
        '/img/icons/icon512x512.PNG'
      ])})
      )
});
self.addEventListener('activate', function (e) {
  console.log('ServiceWorker Activate');
});
self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    if (response) {
      return response;
    }
    return fetch(event.request)
  }).catch(function (error) {
    return caches.match('/public/offline.html');
  }));
});
