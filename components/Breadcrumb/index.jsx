'use client'

import Link from 'next/link';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import { generateStructuredData } from '../../utils/seo';

export default function Breadcrumb({ items = [], className = "" }) {
  // Generate structured data for breadcrumbs
  const breadcrumbStructuredData = generateStructuredData("BreadcrumbList", {
    items: [
      { name: "Beranda", url: "/" },
      ...items
    ]
  });

  if (items.length === 0) return null;

  return (
    <>
      {/* Add structured data to head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      
      {/* Visual breadcrumb */}
      <nav 
        className={`flex items-center space-x-2 text-sm text-gray-600 mb-6 ${className}`}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-2">
          {/* Home link */}
          <li>
            <Link 
              href="/" 
              className="flex items-center hover:text-emerald-600 transition-colors"
              aria-label="Kembali ke beranda"
            >
              <FaHome className="mr-1" />
              <span className="hidden sm:inline">Beranda</span>
            </Link>
          </li>
          
          {/* Breadcrumb items */}
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400 text-xs" />
              
              {index === items.length - 1 ? (
                // Last item - current page (no link)
                <span 
                  className="text-gray-800 font-medium truncate max-w-xs"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                // Intermediate items with links
                <Link 
                  href={item.url || '#'}
                  className="hover:text-emerald-600 transition-colors truncate max-w-xs"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Predefined breadcrumb configurations for common pages
export const BreadcrumbTemplates = {
  surah: (surahName, surahNumber) => [
    { name: "Al-Qur'an", url: "/surah" },
    { name: `Surah ${surahName}`, url: `/surah/${surahNumber}` }
  ],
  
  surahList: () => [
    { name: "Al-Qur'an", url: "/surah" }
  ],
  
  tajwid: () => [
    { name: "Ilmu Tajwid", url: "/tajwid" }
  ],
  
  doa: (kategori) => {
    const items = [
      { name: "Doa Islam", url: "/doa" }
    ];
    
    if (kategori) {
      items.push({ 
        name: `Doa ${kategori}`, 
        url: `/doa?kategori=${encodeURIComponent(kategori)}` 
      });
    }
    
    return items;
  },
  
  sambungAyat: () => [
    { name: "Sambung Ayat", url: "/sambung-ayat" }
  ],
  
  fikihNikah: (bagian) => {
    const items = [
      { name: "Fikih Nikah", url: "/fikih-nikah" }
    ];
    
    if (bagian) {
      items.push({ 
        name: bagian, 
        url: `/fikih-nikah?bagian=${encodeURIComponent(bagian)}` 
      });
    }
    
    return items;
  },
  
  more: (page) => {
    const items = [
      { name: "Lainnya", url: "/more" }
    ];
    
    if (page) {
      const pageNames = {
        'adzan': 'Tuntunan Adzan',
        'doa-adzan': 'Doa Setelah Adzan', 
        'iqomah': 'Tuntunan Iqomah'
      };
      
      items.push({ 
        name: pageNames[page] || page, 
        url: `/more/${page}` 
      });
    }
    
    return items;
  },
  
  infoKajian: () => [
    { name: "Info Kajian", url: "/info-kajian" }
  ],
  
  publicGaleri: () => [
    { name: "Galeri Publik", url: "/public-galeri" }
  ]
};

// Hook untuk menggunakan breadcrumb dengan mudah
export function useBreadcrumb(type, ...params) {
  const template = BreadcrumbTemplates[type];
  
  if (!template) {
    console.warn(`Breadcrumb template '${type}' not found`);
    return [];
  }
  
  return template(...params);
}