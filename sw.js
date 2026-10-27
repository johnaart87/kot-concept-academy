// Service worker Kot Concept Academy: приложение и уроки работают без интернета.
// 0.2.0-20261027093631 и ["./","./config.json","./index.html","./manifest.webmanifest","./content/audio/01-01-chto-takoe-smm-audio.md","./content/audio/01-02-voronka-i-lidy-audio.md","./content/audio/01-03-instagram-i-threads-audio.md","./content/audio/01-04-formaty-kontenta-audio.md","./content/audio/01-05-bazovye-terminy-audio.md","./content/audio/01-06-rol-smm-menedzhera-audio.md","./content/audio/01-07-pravila-audio.md","./content/audio/01-08-audit-akkaunta-audio.md","./content/brand/kot-concept-academy-logo-dark.png","./content/brand/kot-concept-academy-logo-dark.svg","./content/brand/kot-concept-academy-logo.png","./content/brand/kot-concept-academy-logo.svg","./content/brand/kot-concept-academy-mark.png","./content/brand/kot-concept-academy-mark.svg","./content/lessons/01-01-chto-takoe-smm.md","./content/lessons/01-02-voronka-i-lidy.md","./content/lessons/01-03-instagram-i-threads.md","./content/lessons/01-04-formaty-kontenta.md","./content/lessons/01-05-bazovye-terminy.md","./content/lessons/01-06-rol-smm-menedzhera.md","./content/lessons/01-07-pravila.md","./content/lessons/01-08-audit-akkaunta.md","./content/templates/account-audit-checklist.md","./content/templates/audio-template.md","./content/templates/glossary.md","./content/templates/graphics-brief-template.md","./content/templates/lesson-template.md","./content/templates/pre-publish-rules-checklist.md","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./vendor/marked.min.js"] подставляет build.ps1.
const VERSION = "0.2.0-20261027093631";
const CACHE = "kca-" + VERSION;
const PRECACHE = ["./","./config.json","./index.html","./manifest.webmanifest","./content/audio/01-01-chto-takoe-smm-audio.md","./content/audio/01-02-voronka-i-lidy-audio.md","./content/audio/01-03-instagram-i-threads-audio.md","./content/audio/01-04-formaty-kontenta-audio.md","./content/audio/01-05-bazovye-terminy-audio.md","./content/audio/01-06-rol-smm-menedzhera-audio.md","./content/audio/01-07-pravila-audio.md","./content/audio/01-08-audit-akkaunta-audio.md","./content/brand/kot-concept-academy-logo-dark.png","./content/brand/kot-concept-academy-logo-dark.svg","./content/brand/kot-concept-academy-logo.png","./content/brand/kot-concept-academy-logo.svg","./content/brand/kot-concept-academy-mark.png","./content/brand/kot-concept-academy-mark.svg","./content/lessons/01-01-chto-takoe-smm.md","./content/lessons/01-02-voronka-i-lidy.md","./content/lessons/01-03-instagram-i-threads.md","./content/lessons/01-04-formaty-kontenta.md","./content/lessons/01-05-bazovye-terminy.md","./content/lessons/01-06-rol-smm-menedzhera.md","./content/lessons/01-07-pravila.md","./content/lessons/01-08-audit-akkaunta.md","./content/templates/account-audit-checklist.md","./content/templates/audio-template.md","./content/templates/glossary.md","./content/templates/graphics-brief-template.md","./content/templates/lesson-template.md","./content/templates/pre-publish-rules-checklist.md","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./vendor/marked.min.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("kca-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Шрифты Google: из кэша, если уже скачаны
  if (url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    e.respondWith(
      caches.open(CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { c.put(req, res.clone()); return res; })))
    );
    return;
  }

  if (url.origin !== location.origin) return;

  // Свои файлы: сначала сеть (свежие уроки), при отсутствии сети — кэш
  e.respondWith(
    fetch(req)
      .then(res => { if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone())); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match("./index.html")))
  );
});
