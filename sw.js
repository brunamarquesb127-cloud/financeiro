// Service worker do Painel Financeiro: guarda o app para abrir offline.
// Ao mudar o index.html, aumente a versão abaixo para o iPhone pegar a novidade.
const VERSAO = 'painel-v17';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// Rede primeiro (pega atualização quando online), cache como reserva offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(VERSAO).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
