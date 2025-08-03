import { SEO_CONFIG } from '../utils/seo';

// Daftar semua surah untuk sitemap
const surahList = Array.from({ length: 114 }, (_, i) => i + 1);

// Daftar kategori doa umum
const doaCategories = [
  'Doa Harian',
  'Doa Makan',
  'Doa Perjalanan',
  'Doa Sholat',
  'Doa Pagi Sore',
  'Doa Rumah',
  'Doa Belajar',
  'Doa Kesehatan'
];

export default function sitemap() {
  const baseUrl = SEO_CONFIG.siteUrl;
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/surah`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tajwid`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/doa`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sambung-ayat`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/fikih-nikah`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/more`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/more/adzan`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/more/doa-adzan`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/more/iqomah`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/info-kajian`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/public-galeri`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/ask-to-me`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/open-api`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    }
  ];

  // Surah pages
  const surahPages = surahList.map(surahNumber => ({
    url: `${baseUrl}/surah/${surahNumber}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Doa category pages
  const doaPages = doaCategories.map(category => ({
    url: `${baseUrl}/doa?kategori=${encodeURIComponent(category)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Additional specific pages
  const additionalPages = [
    // Popular surah dengan prioritas tinggi
    {
      url: `${baseUrl}/surah/1`, // Al-Fatihah
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/surah/2`, // Al-Baqarah
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/surah/18`, // Al-Kahf
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/surah/36`, // Ya-Sin
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/surah/67`, // Al-Mulk
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/surah/78`, // An-Naba
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/surah/112`, // Al-Ikhlas
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/surah/113`, // Al-Falaq
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/surah/114`, // An-Nas
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }
  ];

  // Combine all pages
  return [
    ...staticPages,
    ...surahPages,
    ...doaPages,
    ...additionalPages
  ];
}