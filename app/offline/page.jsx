// src/app/offline/page.jsx

'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaWifi, 
  FaQuran, 
  FaBookOpen, 
  FaHeart, 
  FaHome, 
  FaSync,
  FaDownload,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

export default function OfflinePage() {
  const [cachedContent, setCachedContent] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [showRetryAnimation, setShowRetryAnimation] = useState(false);

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Get cached content information
    getCachedContent();

    // Get last sync time from localStorage
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const getCachedContent = async () => {
    try {
      if ('serviceWorker' in navigator && 'caches' in window) {
        const cacheNames = await caches.keys();
        const content = [];
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          
          for (const request of requests) {
            const url = request.url;
            if (url.includes('/surah') || url.includes('/tajwid') || url.includes('/doa')) {
              content.push({
                title: getPageTitle(url),
                url: url,
                type: getContentType(url),
                cached: true
              });
            }
          }
        }
        
        setCachedContent(content);
      }
    } catch (error) {
      console.error('Error getting cached content:', error);
    }
  };

  const getPageTitle = (url) => {
    if (url.includes('/surah')) return 'Daftar Surah';
    if (url.includes('/tajwid')) return 'Ilmu Tajwid';
    if (url.includes('/doa')) return 'Kumpulan Doa';
    if (url.includes('/sambung-ayat')) return 'Sambung Ayat';
    return 'Halaman';
  };

  const getContentType = (url) => {
    if (url.includes('/surah')) return 'quran';
    if (url.includes('/tajwid')) return 'tajwid';
    if (url.includes('/doa')) return 'doa';
    return 'other';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'quran': return <FaQuran className="text-emerald-500" />;
      case 'tajwid': return <FaBookOpen className="text-blue-500" />;
      case 'doa': return <FaHeart className="text-pink-500" />;
      default: return <FaHome className="text-gray-500" />;
    }
  };

  const handleRetry = async () => {
    setShowRetryAnimation(true);
    
    try {
      // Try to fetch a simple resource to test connectivity
      await fetch('/', { method: 'HEAD', cache: 'no-store' });
      
      // If successful, reload the page
      window.location.reload();
    } catch (error) {
      // Still offline, just stop the animation
      setTimeout(() => {
        setShowRetryAnimation(false);
      }, 2000);
    }
  };

  const formatLastSync = (date) => {
    if (!date) return 'Tidak diketahui';
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    return date.toLocaleDateString('id-ID');
  };

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      setCachedContent([]);
      localStorage.removeItem('lastSyncTime');
      setLastSyncTime(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className={`p-3 rounded-full ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
              <FaWifi className={`text-xl ${isOnline ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {isOnline ? 'Kembali Online!' : 'Mode Offline'}
              </h1>
              <p className="text-gray-600">
                {isOnline 
                  ? 'Koneksi internet tersedia' 
                  : 'Tidak ada koneksi internet'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Offline Message */}
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <FaWifi className="text-2xl text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-amber-800 mb-2">
                Anda Sedang Offline
              </h2>
              <p className="text-amber-700 mb-6">
                Tidak ada koneksi internet, tetapi Anda masih bisa mengakses konten yang sudah disimpan.
              </p>
              
              <button
                onClick={handleRetry}
                disabled={showRetryAnimation}
                className={`inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors ${
                  showRetryAnimation ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaSync className={`mr-2 ${showRetryAnimation ? 'animate-spin' : ''}`} />
                {showRetryAnimation ? 'Mencoba...' : 'Coba Lagi'}
              </button>
            </div>
          </div>
        )}

        {/* Cache Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaDownload className="mr-2 text-blue-500" />
              Konten Tersimpan
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <FaClock className="mr-1" />
              Sinkronisasi terakhir: {formatLastSync(lastSyncTime)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <FaQuran className="text-2xl text-emerald-500 mx-auto mb-2" />
              <div className="text-lg font-semibold text-emerald-800">
                {cachedContent.filter(c => c.type === 'quran').length}
              </div>
              <div className="text-sm text-emerald-600">Halaman Quran</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <FaBookOpen className="text-2xl text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-semibold text-blue-800">
                {cachedContent.filter(c => c.type === 'tajwid').length}
              </div>
              <div className="text-sm text-blue-600">Halaman Tajwid</div>
            </div>
            
            <div className="bg-pink-50 rounded-lg p-4 text-center">
              <FaHeart className="text-2xl text-pink-500 mx-auto mb-2" />
              <div className="text-lg font-semibold text-pink-800">
                {cachedContent.filter(c => c.type === 'doa').length}
              </div>
              <div className="text-sm text-pink-600">Halaman Doa</div>
            </div>
          </div>

          {cachedContent.length > 0 && (
            <button
              onClick={handleClearCache}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Hapus Semua Cache
            </button>
          )}
        </div>

        {/* Available Offline Content */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaCheckCircle className="mr-2 text-green-500" />
            Tersedia Offline
          </h3>

          <div className="space-y-3">
            {/* Always available pages */}
            <Link href="/" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <FaHome className="text-emerald-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Beranda</div>
                  <div className="text-sm text-gray-600">Halaman utama aplikasi</div>
                </div>
              </div>
            </Link>

            <Link href="/surah" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <FaQuran className="text-emerald-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Daftar Surah</div>
                  <div className="text-sm text-gray-600">114 surah Al-Qur'an</div>
                </div>
              </div>
            </Link>

            <Link href="/tajwid" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <FaBookOpen className="text-blue-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Ilmu Tajwid</div>
                  <div className="text-sm text-gray-600">Pelajari cara membaca Al-Qur'an</div>
                </div>
              </div>
            </Link>

            <Link href="/doa" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <FaHeart className="text-pink-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Kumpulan Doa</div>
                  <div className="text-sm text-gray-600">Doa-doa dalam Islam</div>
                </div>
              </div>
            </Link>

            <Link href="/sambung-ayat" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <FaQuran className="text-purple-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Sambung Ayat</div>
                  <div className="text-sm text-gray-600">Latihan menghafal Al-Qur'an</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Tips for Offline Usage */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Tips Penggunaan Offline
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Kunjungi halaman saat online untuk menyimpannya secara otomatis
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Aplikasi akan otomatis menyinkronkan saat koneksi tersedia
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Konten yang disimpan dapat diakses kapan saja tanpa internet
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}