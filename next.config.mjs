// next.config.mjs
import { join } from 'path';
import { writeFile } from 'fs/promises';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  
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
  
  // Enhanced PWA and service worker configuration
  webpack: (config, { dev, isServer, buildId }) => {
    // Generate service worker dan manifest hanya di production
    if (!dev && !isServer) {
      const generateAdvancedServiceWorker = async () => {
        // This is handled by our custom service worker file
        console.log('Using custom advanced service worker');
      };

      const generateEnhancedManifest = async () => {
        const manifest = {
          name: "QuranKu - Al-Qur'an Digital",
          short_name: "QuranKu",
          description: "Aplikasi Al-Qur'an digital lengkap dengan tajwid, doa, dan fikih. Bisa digunakan offline untuk ibadah yang lebih khusyuk.",
          start_url: "/",
          scope: "/",
          display: "standalone",
          orientation: "any",
          background_color: "#ffffff",
          theme_color: "#059669",
          lang: "id",
          dir: "ltr",
          categories: ["lifestyle", "education", "books"],
          prefer_related_applications: false,
          icons: [
            {
              src: "/icons/icon-72x72.png",
              sizes: "72x72",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icons/icon-96x96.png",
              sizes: "96x96",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icons/icon-128x128.png",
              sizes: "128x128",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icons/icon-144x144.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icons/icon-152x152.png",
              sizes: "152x152",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable"
            },
            {
              src: "/icons/icon-384x384.png",
              sizes: "384x384",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ],
          shortcuts: [
            {
              name: "Baca Al-Qur'an",
              short_name: "Surah",
              description: "Langsung ke daftar surah Al-Qur'an",
              url: "/surah",
              icons: [
                {
                  src: "/icons/icon-192x192.png",
                  sizes: "192x192",
                  type: "image/png"
                }
              ]
            },
            {
              name: "Sambung Ayat",
              short_name: "Sambung",
              description: "Latihan sambung ayat Al-Qur'an",
              url: "/sambung-ayat",
              icons: [
                {
                  src: "/icons/icon-192x192.png",
                  sizes: "192x192",
                  type: "image/png"
                }
              ]
            },
            {
              name: "Pelajari Tajwid",
              short_name: "Tajwid",
              description: "Belajar ilmu tajwid Al-Qur'an",
              url: "/tajwid",
              icons: [
                {
                  src: "/icons/icon-192x192.png",
                  sizes: "192x192",
                  type: "image/png"
                }
              ]
            },
            {
              name: "Kumpulan Doa",
              short_name: "Doa",
              description: "Doa-doa dalam Islam",
              url: "/doa",
              icons: [
                {
                  src: "/icons/icon-192x192.png",
                  sizes: "192x192",
                  type: "image/png"
                }
              ]
            }
          ],
          screenshots: [
            {
              src: "/screenshots/home-mobile.png",
              sizes: "360x640",
              type: "image/png",
              form_factor: "narrow"
            },
            {
              src: "/screenshots/surah-mobile.png",
              sizes: "360x640",
              type: "image/png",
              form_factor: "narrow"
            },
            {
              src: "/screenshots/home-desktop.png",
              sizes: "1280x720",
              type: "image/png",
              form_factor: "wide"
            }
          ],
          related_applications: [],
          edge_side_panel: {
            preferred_width: 480
          },
          launch_handler: {
            client_mode: "focus-existing"
          },
          handle_links: "preferred",
          protocol_handlers: [
            {
              protocol: "web+quran",
              url: "/surah/%s"
            }
          ]
        };

        const manifestPath = join(process.cwd(), 'public', 'manifest.json');
        await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
        console.log('Enhanced manifest.json generated');
      };

      // Execute generation functions
      generateAdvancedServiceWorker();
      generateEnhancedManifest();
    }

    return config;
  },

  // Enhanced headers for PWA
  async headers() {
    return [
      {
        source: '/service-worker.js',
        headers: [
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }
        ]
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
          { key: 'Cache-Control', value: 'public, max-age=86400' }
        ]
      },
      {
        source: '/icons/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' }
        ]
      }
    ];
  },

  // Enable experimental features for better PWA support
  experimental: {
    optimizeCss: true
  },

  // Enable compression for better performance
  compress: true,

  // Configure trailing slash for consistent URLs
  trailingSlash: false,

  // Enable powered by header for debugging
  poweredByHeader: false
};

export default nextConfig;