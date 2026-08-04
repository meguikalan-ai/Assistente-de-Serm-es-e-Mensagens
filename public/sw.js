// Service Worker do Assistente de Sermões e Mensagens
// Permite a instalação do app (PWA) e oferece funcionamento básico offline.

const CACHE_NAME = "sermoes-app-shell-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/ícone-192.png",
  "/icons/ícone-512.png",
  "/icons/ícone-mascarável-192.png",
  "/icons/ícone-mascarável-512.png",
];

// Instala o Service Worker e guarda em cache o esqueleto do app
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Remove caches antigos quando uma nova versão assume
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Requisições
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Não interfere em chamadas para outros domínios.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });

        return response;
      })
      .catch(() =>
        caches
          .match(request)
          .then((cached) => cached || caches.match("/index.html"))
      )
  );
});
