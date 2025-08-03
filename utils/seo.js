// utils/seo.js

// Base configuration untuk SEO
export const SEO_CONFIG = {
  defaultTitle: "QuranKu - Al-Qur'an Digital Lengkap dengan Tajwid, Doa & Fikih",
  titleTemplate: "%s | QuranKu - Al-Qur'an Digital",
  defaultDescription: "Aplikasi Al-Qur'an digital terlengkap dengan 114 surah, ilmu tajwid, kumpulan doa, dan fikih nikah. Bisa digunakan offline untuk ibadah yang lebih khusyuk.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://qurankuuu.vercel.app",
  defaultImage: "/og-image.png",
  twitterHandle: "@quranku_app",
  language: "id",
  locale: "id_ID",
  themeColor: "#059669",
  backgroundColor: "#ffffff",
  author: "QuranKu Team",
  keywords: [
    "al quran digital",
    "quran online",
    "bacaan quran",
    "tajwid",
    "doa islam",
    "fikih nikah",
    "surah quran",
    "aplikasi quran",
    "quran offline",
    "islam"
  ]
};

// Generate metadata untuk halaman
export const generateMetadata = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  article = {},
  noIndex = false,
  canonical
}) => {
  const fullTitle = title 
    ? (title.includes("QuranKu") ? title : `${title} | QuranKu - Al-Qur'an Digital`)
    : SEO_CONFIG.defaultTitle;
  
  const fullDescription = description || SEO_CONFIG.defaultDescription;
  const fullImage = image || SEO_CONFIG.defaultImage;
  const fullUrl = url ? `${SEO_CONFIG.siteUrl}${url}` : SEO_CONFIG.siteUrl;
  const allKeywords = [...SEO_CONFIG.keywords, ...keywords].join(", ");

  const metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    author: SEO_CONFIG.author,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    canonical: canonical || fullUrl,
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: "QuranKu",
      images: [
        {
          url: fullImage.startsWith('http') ? fullImage : `${SEO_CONFIG.siteUrl}${fullImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
          type: "image/png"
        }
      ],
      locale: SEO_CONFIG.locale,
      type: type,
      ...(type === "article" && {
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: article.authors || [SEO_CONFIG.author],
        section: article.section,
        tags: article.tags
      })
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      site: SEO_CONFIG.twitterHandle,
      creator: SEO_CONFIG.twitterHandle,
      images: [fullImage.startsWith('http') ? fullImage : `${SEO_CONFIG.siteUrl}${fullImage}`]
    },

    // Additional metadata
    other: {
      "application-name": "QuranKu",
      "apple-mobile-web-app-title": "QuranKu",
      "theme-color": SEO_CONFIG.themeColor,
      "msapplication-TileColor": SEO_CONFIG.themeColor,
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "mobile-web-app-capable": "yes"
    }
  };

  return metadata;
};

// Generate JSON-LD structured data
export const generateStructuredData = (type, data) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };

  switch (type) {
    case "WebApplication":
      return {
        ...baseSchema,
        name: "QuranKu",
        url: SEO_CONFIG.siteUrl,
        description: SEO_CONFIG.defaultDescription,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        author: {
          "@type": "Organization",
          name: "QuranKu Team"
        },
        screenshot: `${SEO_CONFIG.siteUrl}/screenshots/home-desktop.png`,
        featureList: [
          "114 Surah Al-Qur'an Lengkap",
          "Ilmu Tajwid Interaktif", 
          "Kumpulan Doa Harian",
          "Fikih Nikah",
          "Mode Offline",
          "Audio Murotal"
        ]
      };

    case "Book":
      return {
        ...baseSchema,
        name: data.name || "Al-Qur'an",
        author: {
          "@type": "Person",
          name: "Allah SWT"
        },
        inLanguage: ["ar", "id"],
        genre: "Religious Text",
        publisher: {
          "@type": "Organization", 
          name: "QuranKu"
        },
        url: data.url,
        description: data.description,
        hasPart: data.chapters?.map(chapter => ({
          "@type": "Chapter",
          name: chapter.name,
          url: chapter.url,
          position: chapter.number
        }))
      };

    case "Article":
      return {
        ...baseSchema,
        headline: data.headline,
        description: data.description,
        author: {
          "@type": "Organization",
          name: "QuranKu Team"
        },
        publisher: {
          "@type": "Organization",
          name: "QuranKu",
          logo: {
            "@type": "ImageObject",
            url: `${SEO_CONFIG.siteUrl}/icons/icon-512x512.png`
          }
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        mainEntityOfPage: data.url,
        image: data.image
      };

    case "FAQPage":
      return {
        ...baseSchema,
        mainEntity: data.questions?.map(q => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer
          }
        }))
      };

    case "BreadcrumbList":
      return {
        ...baseSchema,
        itemListElement: data.items?.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };

    case "Organization":
      return {
        ...baseSchema,
        name: "QuranKu",
        url: SEO_CONFIG.siteUrl,
        logo: `${SEO_CONFIG.siteUrl}/icons/icon-512x512.png`,
        description: SEO_CONFIG.defaultDescription,
        sameAs: [
          // Tambahkan social media links jika ada
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["Indonesian", "Arabic"]
        }
      };

    default:
      return baseSchema;
  }
};

// Generate metadata untuk halaman Surah
export const generateSurahMetadata = (surah) => {
  const title = `Surah ${surah.namaLatin} (${surah.nama}) - ${surah.arti}`;
  const description = `Baca Surah ${surah.namaLatin} lengkap dengan terjemahan Indonesia. Surah ke-${surah.nomor} dengan ${surah.jumlahAyat} ayat, diturunkan di ${surah.tempatTurun}. Dilengkapi dengan audio murotal dan tajwid.`;
  
  return generateMetadata({
    title,
    description,
    keywords: [
      `surah ${surah.namaLatin.toLowerCase()}`,
      `al ${surah.namaLatin.toLowerCase()}`,
      surah.nama,
      surah.arti.toLowerCase(),
      `surah ${surah.nomor}`,
      "terjemahan",
      "tafsir",
      "audio quran"
    ],
    url: `/surah/${surah.nomor}`,
    type: "article",
    article: {
      section: "Al-Qur'an",
      tags: ["surah", "quran", surah.namaLatin.toLowerCase(), surah.tempatTurun]
    }
  });
};

// Generate structured data untuk Surah
export const generateSurahStructuredData = (surah) => {
  return generateStructuredData("Article", {
    headline: `Surah ${surah.namaLatin} - ${surah.arti}`,
    description: `Surah ${surah.namaLatin} adalah surah ke-${surah.nomor} dalam Al-Qur'an dengan ${surah.jumlahAyat} ayat`,
    url: `${SEO_CONFIG.siteUrl}/surah/${surah.nomor}`,
    datePublished: "2024-01-01T00:00:00Z",
    dateModified: new Date().toISOString(),
    image: `${SEO_CONFIG.siteUrl}/og-image.png`
  });
};

// Generate breadcrumb
export const generateBreadcrumb = (items) => {
  const breadcrumbItems = [
    { name: "Beranda", url: SEO_CONFIG.siteUrl },
    ...items.map(item => ({
      name: item.name,
      url: item.url ? `${SEO_CONFIG.siteUrl}${item.url}` : undefined
    }))
  ];

  return generateStructuredData("BreadcrumbList", {
    items: breadcrumbItems
  });
};

// Generate metadata untuk halaman Doa
export const generateDoaMetadata = (kategori) => {
  const title = kategori 
    ? `Doa ${kategori} - Kumpulan Doa Islam Lengkap`
    : "Kumpulan Doa Islam Lengkap dengan Arab, Latin & Terjemahan";
  
  const description = kategori
    ? `Kumpulan doa ${kategori.toLowerCase()} lengkap dengan tulisan Arab, bacaan Latin, dan terjemahan Indonesia. Doa-doa shahih dari Al-Qur'an dan Hadits.`
    : "Kumpulan doa Islam lengkap untuk kehidupan sehari-hari. Dilengkapi dengan tulisan Arab, bacaan Latin, dan terjemahan Indonesia dari Al-Qur'an dan Hadits shahih.";

  return generateMetadata({
    title,
    description,
    keywords: [
      "doa islam",
      "doa harian",
      "doa arab latin",
      "doa terjemahan",
      kategori?.toLowerCase(),
      "doa shahih",
      "doa quran hadits"
    ],
    url: kategori ? `/doa?kategori=${encodeURIComponent(kategori)}` : "/doa"
  });
};

// Generate metadata untuk halaman Tajwid
export const generateTajwidMetadata = () => {
  return generateMetadata({
    title: "Ilmu Tajwid Lengkap - Belajar Cara Membaca Al-Qur'an dengan Benar",
    description: "Pelajari ilmu tajwid lengkap untuk membaca Al-Qur'an dengan benar. Materi tajwid meliputi nun mati, tanwin, mad, qalqalah, dan hukum bacaan lainnya dengan contoh dan audio.",
    keywords: [
      "ilmu tajwid",
      "belajar tajwid",
      "cara baca quran",
      "nun mati tanwin",
      "mad tajwid", 
      "qalqalah",
      "makhorijul huruf",
      "sifatul huruf",
      "hukum bacaan"
    ],
    url: "/tajwid"
  });
};

// Generate robots meta tag
export const generateRobotsMeta = (options = {}) => {
  const {
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false,
    noimageindex = false,
    maxSnippet,
    maxImagePreview = "large",
    maxVideoPreview
  } = options;

  const directives = [];
  
  directives.push(index ? "index" : "noindex");
  directives.push(follow ? "follow" : "nofollow");
  
  if (noarchive) directives.push("noarchive");
  if (nosnippet) directives.push("nosnippet");
  if (noimageindex) directives.push("noimageindex");
  if (maxSnippet) directives.push(`max-snippet:${maxSnippet}`);
  if (maxImagePreview) directives.push(`max-image-preview:${maxImagePreview}`);
  if (maxVideoPreview) directives.push(`max-video-preview:${maxVideoPreview}`);

  return directives.join(", ");
};

// Generate canonical URL
export const generateCanonicalUrl = (path) => {
  // Remove trailing slash and normalize
  const cleanPath = path.replace(/\/$/, "") || "";
  return `${SEO_CONFIG.siteUrl}${cleanPath}`;
};

// Generate hreflang
export const generateHreflang = (path) => {
  return [
    {
      hrefLang: "id",
      href: `${SEO_CONFIG.siteUrl}${path}`
    },
    {
      hrefLang: "x-default", 
      href: `${SEO_CONFIG.siteUrl}${path}`
    }
  ];
};

// SEO utilities untuk Next.js
export const createSEOConfig = (pageData) => {
  const metadata = generateMetadata(pageData);
  
  return {
    ...metadata,
    alternates: {
      canonical: metadata.canonical,
      languages: {
        'id': metadata.canonical,
        'x-default': metadata.canonical
      }
    }
  };
};