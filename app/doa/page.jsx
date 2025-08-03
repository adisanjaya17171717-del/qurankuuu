// app/doa/page.jsx

'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowRight, FaBookOpen, FaFilter } from 'react-icons/fa';
import { IoMdInformationCircle } from 'react-icons/io';

const DoaPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [doaData, setDoaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('title') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(searchParams.get('per_page')) || 10);
  const [totalDoa, setTotalDoa] = useState(0);

  const fetchDoa = async () => {
    try {
      setLoading(true);
      
      // Bangun parameter query
      const params = new URLSearchParams();
      if (searchQuery) params.set('title', searchQuery);
      if (currentPage > 1) params.set('page', currentPage);
      if (itemsPerPage !== 10) params.set('per_page', itemsPerPage);
      
      const res = await fetch(`/api/doa?${params.toString()}`);
      const response = await res.json();
      
      if (response.status === 'success') {
        // Perbaikan di sini: gunakan response.data dan response.total
        setDoaData(response.data);
        setTotalDoa(response.total);
      } else {
        throw new Error(response.message || 'Gagal memuat data doa');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoa();
    
    // Update URL tanpa reload
    const params = new URLSearchParams();
    if (searchQuery) params.set('title', searchQuery);
    if (currentPage > 1) params.set('page', currentPage);
    if (itemsPerPage !== 10) params.set('per_page', itemsPerPage);
    
    router.replace(`/doa?${params.toString()}`, { scroll: false });
  }, [searchQuery, currentPage, itemsPerPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman pertama saat pencarian baru
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading && doaData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          <p className="mt-4 text-blue-800 font-medium">Memuat koleksi doa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <IoMdInformationCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchDoa}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12 px-4 md:px-8 text-white shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <FaBookOpen className="text-yellow-300" />
                Koleksi Doa-doa Pilihan
              </h1>
              <p className="mt-2 text-blue-100 max-w-2xl">
                Temukan doa-doa dari Al-Qur'an dan untuk berbagai kebutuhan
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Daftar Doa
              <span className="text-blue-600 ml-2">({totalDoa})</span>
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Cari doa (contoh: perlindungan)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 rounded-xl bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <div className="absolute left-4 top-3.5 text-gray-400">
                  <FaSearch />
                </div>
                <button 
                  type="submit"
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-600"
                >
                  <FaFilter />
                </button>
              </div>
              
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="py-3 px-4 rounded-xl bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="5">5 per halaman</option>
                <option value="10">10 per halaman</option>
                <option value="20">20 per halaman</option>
              </select>
            </div>
          </form>
          
          <p className="text-gray-600 max-w-3xl">
            Kumpulan doa-doa pilihan dari Al-Qur'an untuk berbagai kebutuhan hidup.
          </p>
        </div>

        {/* Doa List */}
        {doaData.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-blue-100">
            <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FaBookOpen className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Doa tidak ditemukan</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `Tidak ada doa yang sesuai dengan pencarian "${searchQuery}"`
                : 'Tidak ada doa yang tersedia'}
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              Tampilkan Semua Doa
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doaData.map((doa) => (
                <motion.div
                  key={doa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-blue-100 hover:shadow-lg transition-all"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{doa.title}</h3>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="font-arabic text-xl md:text-2xl text-right leading-loose text-gray-800">
                        {doa.ayat}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm">{doa.arti}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalDoa > itemsPerPage && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-1">
                  {Array.from({ length: Math.ceil(totalDoa / itemsPerPage) }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentPage === i + 1 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-blue-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DoaPage;