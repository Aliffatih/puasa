self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open("ramadhan-cache").then(function(cache) {
      return cache.addAll([
        "index.html",
        "jadwal.html",
        "style.css",
        "script.js",
        "data.js",
        "foto.jpg"
      ]);
    })
  );
});