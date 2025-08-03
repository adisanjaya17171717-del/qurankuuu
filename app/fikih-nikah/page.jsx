// app/fikih-nikah/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FikihNikahPage = () => {
  const [activeBagian, setActiveBagian] = useState('bagian1');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bagianList, setBagianList] = useState([]);
  
  // Mendapatkan daftar bagian yang tersedia
  useEffect(() => {
    const fetchBagianList = async () => {
      try {
        // Kita akan coba ambil bagian1, bagian2, bagian3, dst sampai tidak ditemukan
        const list = [];
        let i = 1;
        
        while (i <= 10) { // Batasi maksimal 10 bagian untuk efisiensi
          const bagianId = `bagian${i}`;
          const response = await fetch(`/api/fikih-nikah?bagian=${bagianId}`);
          
          if (response.ok) {
            const data = await response.json();
            if (!data.error) {
              list.push({
                id: bagianId,
                title: data.title,
                shortTitle: `Bag. ${i}`
              });
            }
          } else {
            // Hentikan loop jika ada error atau bagian tidak ditemukan
            break;
          }
          i++;
        }
        
        setBagianList(list);
        if (list.length > 0) {
          setActiveBagian(list[0].id);
        }
      } catch (err) {
        setError("Gagal mengambil daftar bagian");
      }
    };

    fetchBagianList();
  }, []);
  
  // Fetch data berdasarkan bagian aktif
  useEffect(() => {
    if (!activeBagian) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/fikih-nikah?bagian=${activeBagian}`);
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data');
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeBagian]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Fikih Nikah
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Panduan lengkap tata cara pernikahan dalam Islam
          </p>
        </header>

        {/* Navigasi Bagian - Horizontal Scrolling */}
        {bagianList.length > 0 && (
          <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex space-x-2 min-w-max">
              {bagianList.map((bagian) => (
                <button
                  key={bagian.id}
                  onClick={() => setActiveBagian(bagian.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeBagian === bagian.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {bagian.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center py-16">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-indigo-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500">Memuat konten...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 max-w-2xl mx-auto text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Konten Utama */}
        <AnimatePresence mode="wait">
          {data && !loading && !error && (
            <motion.div
              key={activeBagian}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      {data.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Penulis: <span className="font-medium">{data.author}</span>
                    </p>
                  </div>
                  <a 
                    href={data.source} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <span>Baca di sumber asli</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M3 8a2 2 0 012-2h7a1 1 0 110 2H5v7h7a1 1 0 110 2H5a2 2 0 01-2-2V8z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>

                <div className="space-y-8">
                  {data.content.map((section, index) => (
                    <motion.section 
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-start">
                        <span className="flex-shrink-0 mr-3 mt-1 w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span>{section.sectionTitle}</span>
                      </h3>
                      <div className="space-y-4 text-gray-700 pl-9">
                        {section.paragraphs.map((paragraph, idx) => (
                          <p 
                            key={idx} 
                            className={`leading-relaxed ${
                              paragraph.startsWith('http') ? 'text-sm text-gray-500 italic' : ''
                            }`}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </motion.section>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigasi Bagian - Mobile */}
        {bagianList.length > 0 && (
          <div className="fixed bottom-4 left-0 right-0 flex justify-center md:hidden">
            <div className="bg-white rounded-full shadow-md px-3 py-2 flex gap-1 border border-gray-200">
              {bagianList.slice(0, 3).map((bagian) => (
                <button
                  key={bagian.id}
                  onClick={() => setActiveBagian(bagian.id)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    activeBagian === bagian.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {bagian.shortTitle}
                </button>
              ))}
              {bagianList.length > 3 && (
                <div className="relative group">
                  <button className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    ⋯
                  </button>
                  <div className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-lg shadow-lg p-2 hidden group-hover:block z-10">
                    {bagianList.slice(3).map((bagian) => (
                      <button
                        key={bagian.id}
                        onClick={() => setActiveBagian(bagian.id)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          activeBagian === bagian.id
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {bagian.shortTitle}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FikihNikahPage;