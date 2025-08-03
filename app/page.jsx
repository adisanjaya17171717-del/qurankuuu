// app/page.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaQuran, FaBookOpen, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import SEO from '../components/SEO';
import { SEO_CONFIG, generateStructuredData } from '../utils/seo';

export default function Home() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://equran.id/api/v2/surat');
        if (!res.ok) throw new Error('Gagal mengambil data');
        const data = await res.json();
        setSurahs(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter surahs based on search term
  const filteredSurahs = surahs.filter(surah => 
    surah.namaLatin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.arti.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-pulse inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-200 mb-4"></div>
          <div className="h-12 bg-emerald-200 rounded-xl max-w-md mx-auto mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-start">
                  <div className="animate-pulse flex-shrink-0 w-14 h-14 rounded-2xl bg-emerald-200 mr-4"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-emerald-200 rounded w-3/4"></div>
                    <div className="h-4 bg-emerald-200 rounded w-full"></div>
                    <div className="h-4 bg-emerald-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Generate structured data for homepage
  const homepageStructuredData = [
    generateStructuredData("WebApplication", {}),
    generateStructuredData("Book", {
      name: "Al-Qur'an Digital",
      description: "114 Surah Al-Qur'an lengkap dengan terjemahan Indonesia dan audio murotal",
      url: SEO_CONFIG.siteUrl,
      chapters: surahs.slice(0, 10).map(surah => ({
        name: `Surah ${surah.namaLatin}`,
        url: `${SEO_CONFIG.siteUrl}/surah/${surah.nomor}`,
        number: surah.nomor
      }))
    })
  ];

  return (
    <>
      <SEO
        title={SEO_CONFIG.defaultTitle}
        description={SEO_CONFIG.defaultDescription}
        keywords={[
          "al quran lengkap",
          "114 surah quran",
          "bacaan quran online",
          "terjemahan quran indonesia",
          "murotal quran",
          "aplikasi quran terbaik",
          "belajar mengaji",
          "al quran digital gratis"
        ]}
        url="/"
        type="website"
        structuredData={homepageStructuredData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
        {/* Header with Icon and Gradient */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-4 shadow-lg">
            <FaQuran className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
            Daftar Surah Al-Qur'an
          </h1>
          <p className="text-gray-600 mt-3 max-w-md mx-auto">
            Temukan dan jelajahi 114 surah suci Al-Qur'an
          </p>
          
          {/* Search Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari surah..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-3.5 text-emerald-500">
                <FaSearch className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Surah Count Info */}
        <div className="mb-5 text-sm text-emerald-700 bg-emerald-100 py-2 px-4 rounded-lg inline-block">
          Menampilkan {filteredSurahs.length} dari 114 surah
        </div>

        {/* Surah List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSurahs.map((surah) => (
            <Link href={`/surah/${surah.nomor}`} key={surah.nomor}>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 group cursor-pointer">
                <div className="p-5 flex items-start">
                  {/* Number Badge with Gradient */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-4 shadow">
                    <span className="font-bold text-white text-lg">{surah.nomor}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="pr-2">
                        <h2 className="font-bold text-lg text-gray-800 group-hover:text-emerald-700 transition-colors truncate">
                          {surah.namaLatin}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">{surah.arti}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-arabic text-2xl text-emerald-600 leading-10">
                          {surah.nama}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap items-center text-sm text-gray-600 gap-3">
                      <div className="flex items-center bg-gray-100 py-1 px-2 rounded-full">
                        <FaMapMarkerAlt className="mr-1.5 text-emerald-500 text-xs" />
                        <span className="text-xs">{surah.tempatTurun}</span>
                      </div>
                      <div className="flex items-center bg-gray-100 py-1 px-2 rounded-full">
                        <FaBookOpen className="mr-1.5 text-emerald-500 text-xs" />
                        <span className="text-xs">{surah.jumlahAyat} ayat</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Empty state for search */}
        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center text-gray-500 mb-4">
              <FaSearch className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Surah tidak ditemukan</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Tidak ada surah yang cocok dengan pencarian "{searchTerm}". Coba kata kunci lain.
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 rounded-full font-medium transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        )}
        </div>
      </div>
    </>
  );
}