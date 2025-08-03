'use client'

import Head from 'next/head';
import { generateStructuredData, SEO_CONFIG } from '../../utils/seo';

export default function SEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  article = {},
  noIndex = false,
  canonical,
  structuredData = [],
  breadcrumb,
  children
}) {
  // Generate full metadata
  const fullTitle = title 
    ? (title.includes("QuranKu") ? title : `${title} | QuranKu - Al-Qur'an Digital`)
    : SEO_CONFIG.defaultTitle;
  
  const fullDescription = description || SEO_CONFIG.defaultDescription;
  const fullImage = image || SEO_CONFIG.defaultImage;
  const fullUrl = url ? `${SEO_CONFIG.siteUrl}${url}` : SEO_CONFIG.siteUrl;
  const fullImageUrl = fullImage.startsWith('http') ? fullImage : `${SEO_CONFIG.siteUrl}${fullImage}`;
  const allKeywords = [...SEO_CONFIG.keywords, ...keywords].join(", ");
  const canonicalUrl = canonical || fullUrl;

  // Generate structured data
  const allStructuredData = [
    // Base organization schema
    generateStructuredData("Organization", {
      name: "QuranKu",
      url: SEO_CONFIG.siteUrl,
      logo: `${SEO_CONFIG.siteUrl}/icons/icon-512x512.png`,
      description: SEO_CONFIG.defaultDescription
    }),
    
    // Base web application schema
    generateStructuredData("WebApplication", {}),
    
    // Breadcrumb if provided
    ...(breadcrumb ? [breadcrumb] : []),
    
    // Additional structured data
    ...structuredData
  ];

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={SEO_CONFIG.author} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="id" />
      <meta name="language" content="Indonesian" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="QuranKu" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Article specific Open Graph */}
      {type === "article" && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.authors && article.authors.map((author, index) => (
            <meta key={index} property="article:author" content={author} />
          ))}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SEO_CONFIG.twitterHandle} />
      
      {/* Mobile and App Meta Tags */}
      <meta name="application-name" content="QuranKu" />
      <meta name="apple-mobile-web-app-title" content="QuranKu" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content={SEO_CONFIG.themeColor} />
      <meta name="msapplication-TileColor" content={SEO_CONFIG.themeColor} />
      
      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="coverage" content="worldwide" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
      <link rel="mask-icon" href="/icons/icon-512x512.png" color={SEO_CONFIG.themeColor} />
      
      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* DNS Prefetch for External Resources */}
      <link rel="dns-prefetch" href="//equran.id" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="//equran.id" crossOrigin="anonymous" />
      
      {/* Structured Data */}
      {allStructuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
      
      {/* Additional custom elements */}
      {children}
    </Head>
  );
}

// Specific SEO components for different page types
export function SurahSEO({ surah, ayat = [] }) {
  const title = `Surah ${surah.namaLatin} (${surah.nama}) - ${surah.arti}`;
  const description = `Baca Surah ${surah.namaLatin} lengkap dengan terjemahan Indonesia. Surah ke-${surah.nomor} dengan ${surah.jumlahAyat} ayat, diturunkan di ${surah.tempatTurun}. Dilengkapi dengan audio murotal dan tajwid.`;
  
  const structuredData = [
    generateStructuredData("Article", {
      headline: title,
      description: description,
      url: `${SEO_CONFIG.siteUrl}/surah/${surah.nomor}`,
      datePublished: "2024-01-01T00:00:00Z",
      dateModified: new Date().toISOString(),
      image: `${SEO_CONFIG.siteUrl}/og-image.png`
    }),
    
    generateStructuredData("Book", {
      name: `Surah ${surah.namaLatin}`,
      description: description,
      url: `${SEO_CONFIG.siteUrl}/surah/${surah.nomor}`,
      chapters: ayat.length > 0 ? ayat.slice(0, 10).map(ayah => ({
        name: `Ayat ${ayah.nomorAyat}`,
        url: `${SEO_CONFIG.siteUrl}/surah/${surah.nomor}#ayat-${ayah.nomorAyat}`,
        number: ayah.nomorAyat
      })) : []
    })
  ];

  const breadcrumb = generateStructuredData("BreadcrumbList", {
    items: [
      { name: "Beranda", url: SEO_CONFIG.siteUrl },
      { name: "Al-Qur'an", url: `${SEO_CONFIG.siteUrl}/surah` },
      { name: `Surah ${surah.namaLatin}`, url: `${SEO_CONFIG.siteUrl}/surah/${surah.nomor}` }
    ]
  });

  return (
    <SEO
      title={title}
      description={description}
      keywords={[
        `surah ${surah.namaLatin.toLowerCase()}`,
        `al ${surah.namaLatin.toLowerCase()}`,
        surah.nama,
        surah.arti.toLowerCase(),
        `surah ${surah.nomor}`,
        "terjemahan",
        "tafsir",
        "audio quran",
        surah.tempatTurun
      ]}
      url={`/surah/${surah.nomor}`}
      type="article"
      article={{
        section: "Al-Qur'an",
        tags: ["surah", "quran", surah.namaLatin.toLowerCase(), surah.tempatTurun],
        publishedTime: "2024-01-01T00:00:00Z",
        modifiedTime: new Date().toISOString()
      }}
      structuredData={structuredData}
      breadcrumb={breadcrumb}
    />
  );
}

export function DoaSEO({ kategori, totalDoa }) {
  const title = kategori 
    ? `Doa ${kategori} - Kumpulan Doa Islam Lengkap`
    : "Kumpulan Doa Islam Lengkap dengan Arab, Latin & Terjemahan";
  
  const description = kategori
    ? `Kumpulan doa ${kategori.toLowerCase()} lengkap dengan tulisan Arab, bacaan Latin, dan terjemahan Indonesia. Doa-doa shahih dari Al-Qur'an dan Hadits.`
    : `Kumpulan ${totalDoa || 'berbagai'} doa Islam lengkap untuk kehidupan sehari-hari. Dilengkapi dengan tulisan Arab, bacaan Latin, dan terjemahan Indonesia dari Al-Qur'an dan Hadits shahih.`;

  const structuredData = [
    generateStructuredData("Article", {
      headline: title,
      description: description,
      url: kategori 
        ? `${SEO_CONFIG.siteUrl}/doa?kategori=${encodeURIComponent(kategori)}`
        : `${SEO_CONFIG.siteUrl}/doa`,
      datePublished: "2024-01-01T00:00:00Z",
      dateModified: new Date().toISOString(),
      image: `${SEO_CONFIG.siteUrl}/og-image.png`
    })
  ];

  const breadcrumbItems = [
    { name: "Beranda", url: SEO_CONFIG.siteUrl },
    { name: "Doa Islam", url: `${SEO_CONFIG.siteUrl}/doa` }
  ];
  
  if (kategori) {
    breadcrumbItems.push({ 
      name: `Doa ${kategori}`, 
      url: `${SEO_CONFIG.siteUrl}/doa?kategori=${encodeURIComponent(kategori)}` 
    });
  }

  const breadcrumb = generateStructuredData("BreadcrumbList", {
    items: breadcrumbItems
  });

  return (
    <SEO
      title={title}
      description={description}
      keywords={[
        "doa islam",
        "doa harian",
        "doa arab latin",
        "doa terjemahan",
        kategori?.toLowerCase(),
        "doa shahih",
        "doa quran hadits",
        "amalan harian"
      ]}
      url={kategori ? `/doa?kategori=${encodeURIComponent(kategori)}` : "/doa"}
      structuredData={structuredData}
      breadcrumb={breadcrumb}
    />
  );
}

export function TajwidSEO() {
  const title = "Ilmu Tajwid Lengkap - Belajar Cara Membaca Al-Qur'an dengan Benar";
  const description = "Pelajari ilmu tajwid lengkap untuk membaca Al-Qur'an dengan benar. Materi tajwid meliputi nun mati, tanwin, mad, qalqalah, dan hukum bacaan lainnya dengan contoh dan audio.";

  const structuredData = [
    generateStructuredData("Article", {
      headline: title,
      description: description,
      url: `${SEO_CONFIG.siteUrl}/tajwid`,
      datePublished: "2024-01-01T00:00:00Z",
      dateModified: new Date().toISOString(),
      image: `${SEO_CONFIG.siteUrl}/og-image.png`
    })
  ];

  const breadcrumb = generateStructuredData("BreadcrumbList", {
    items: [
      { name: "Beranda", url: SEO_CONFIG.siteUrl },
      { name: "Ilmu Tajwid", url: `${SEO_CONFIG.siteUrl}/tajwid` }
    ]
  });

  return (
    <SEO
      title={title}
      description={description}
      keywords={[
        "ilmu tajwid",
        "belajar tajwid",
        "cara baca quran",
        "nun mati tanwin",
        "mad tajwid", 
        "qalqalah",
        "makhorijul huruf",
        "sifatul huruf",
        "hukum bacaan",
        "tartil"
      ]}
      url="/tajwid"
      structuredData={structuredData}
      breadcrumb={breadcrumb}
    />
  );
}