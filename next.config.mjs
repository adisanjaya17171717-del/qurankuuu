// next.config.mjs
import { join } from 'path';
import { writeFile } from 'fs/promises';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  // swcMinify: true,
  
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'qurankuuu.vercel.app',
    },
    {
      protocol: 'https',
      hostname: 'pomf2.lain.la',
    },
    {
      protocol: 'https',
      hostname: 'cloudkuimages.guru',
    },
    {
      protocol: 'https',
      hostname: 'ko-fi.com',
    },
    {
      protocol: 'https',
      hostname: 'storage.ko-fi.com',
    },
    {
      protocol: 'https',
      hostname: '*.myfilebase.com',
    },
    {
      protocol: 'https',
      hostname: 'ipfs.filebase.io',
    },
    {
      protocol: 'http',
      hostname: 'localhost',
    }
  ]
},
  
  // Generate service worker dan manifest
  webpack: (config, { dev, isServer, buildId }) => {
    // Generate service worker hanya di production
    if (!dev && !isServer) {
      const generateServiceWorker = async () => {
        const swContent = `
          const CACHE_NAME = 'quran-app-v1';
          const OFFLINE_URL = '/offline';

          self.addEventListener('install', event => {
            event.waitUntil(
              caches.open(CACHE_NAME).then(cache => {
                return cache.addAll([
                  '/',
                  '/offline',
                  '/surah',
                  '/sambung-ayat',
                  '/manifest.json'
                ]);
              })
            );
          });

          self.addEventListener('activate', event => {
            event.waitUntil(
              caches.keys().then(cacheNames => {
                return Promise.all(
                  cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                      return caches.delete(cacheName);
                    }
                  })
                );
              })
            );
          });

          self.addEventListener('fetch', event => {
            if (event.request.method !== 'GET') return;
            
            event.respondWith(
              fetch(event.request)
                .then(response => {
                  return response;
                })
                .catch(() => {
                  if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                  }
                  return Response.error();
                })
            );
          });
        `;

        const swPath = join(process.cwd(), 'public', 'service-worker.js');
        await writeFile(swPath, swContent);
      };

      // Generate manifest.json
      const generateManifest = async () => {
        const manifest = {
          name: "Quran App",
          short_name: "Quran",
          description: "Aplikasi Al-Qur'an Digital",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#059669",
          icons: [
            {
              src: "/icons/icon-72x72.png",
              sizes: "72x72",
              type: "image/png"
            },
            {
              src: "/icons/icon-96x96.png",
              sizes: "96x96",
              type: "image/png"
            },
            {
              src: "/icons/icon-128x128.png",
              sizes: "128x128",
              type: "image/png"
            },
            {
              src: "/icons/icon-144x144.png",
              sizes: "144x144",
              type: "image/png"
            },
            {
              src: "/icons/icon-152x152.png",
              sizes: "152x152",
              type: "image/png"
            },
            {
              src: "/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "/icons/icon-384x384.png",
              sizes: "384x384",
              type: "image/png"
            },
            {
              src: "/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png"
            }
          ]
        };

        const manifestPath = join(process.cwd(), 'public', 'manifest.json');
        await writeFile(manifestPath, JSON.stringify(manifest));
      };

      // Eksekusi fungsi generate
      generateServiceWorker();
      generateManifest();
    }

    return config;
  },

  // Header untuk service worker
  async headers() {
    return [
      {
        source: '/service-worker.js',
        headers: [
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }
        ]
      }
    ];
  }
};

export default nextConfig;