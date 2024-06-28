const staticTravelExpensesManager = "travel-expenses-manager-site-v1"

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticTravelExpensesManager).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})
