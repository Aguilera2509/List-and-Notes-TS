const cacheName = "v1";

self.addEventListener("install", e => {
    e.waitUntil(
    caches
        .open(cacheName)
        .then(cache => {
        cache.addAll([]);
        })
        .then(() => self.skipWaiting()
        )
    );
});

/*self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheNameSave => {
          return cacheNameSave !== cacheName;
        }).map(cacheData => {
          return caches.delete(cacheData);
        })
      );
    })
  );
});*/

self.addEventListener("message", e => {
    Object.values(e.data).map(el => {
        if(el.importance === "importanceMain"){
            setInterval(() => {
                self.registration.showNotification(el.title, {
                    body: el.content,
                    icon: "favicon.ico",
                    requireInteraction: true,
                });
            }, 2700000); //45 minutes
            return
        }else if(el.importance === "importanceSecondary"){
            setInterval(() => {
                self.registration.showNotification(el.title, {
                    body: el.content,                   
                    icon: "favicon.ico",
                    requireInteraction: true,
                });
            }, 5400000); //over 1 hour
            return
        }else{
            setInterval(() => {
                self.registration.showNotification(el.title, {
                    body: el.content,
                    icon: "favicon.ico",
                    requireInteraction: true,
                });
            }, 9600000); //over 1:30 hour
            return 
        };
    });
});

/*self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request))
      .then(response => {
        if (response) {
          return response; // Return the cached response if available
        }

        // Otherwise, fetch the resource and cache its response
        return fetch(event.request)
          .then(response => {
            // Clone the response because it can only be read once
            const clonedResponse = response.clone();

            // Cache the response for future use
            caches.open(cacheName)
              .then(cache => cache.put(event.request, clonedResponse));

            return response;
          });
      })
  );
});*/
