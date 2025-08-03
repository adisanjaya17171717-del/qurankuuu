'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Analytics } from "@vercel/analytics/next";
import { registerServiceWorker } from '@/utils/serviceWorker';
import { SiOpenapiinitiative } from 'react-icons/si';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { GiRing } from 'react-icons/gi';
import { 
  FaCog, FaQuran, FaInfoCircle, FaSync, FaHome, 
  FaBook, FaHistory, FaBookmark, FaPlus, 
  FaVideo, FaImages, FaBookOpen, FaHadith, FaEllipsisH,
  FaRocket, FaTimes, FaCoffee, FaStar, FaChartLine
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PermissionManager from '@/components/PermissionManager';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import "./globals.css";

const RootLayout = ({ children }) => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showPopupMenu, setShowPopupMenu] = useState(false);
  const registrationRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    // Check if PWA is already installed
    const isPWAInstalled = localStorage.getItem('pwaInstalled') === 'true';
    if (!isPWAInstalled) {
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const initApp = async () => {
      try {
        const reg = await registerServiceWorker();
        registrationRef.current = reg;

        if (!isMounted) return;
        
        if (reg.active || reg.installing || reg.waiting) {
          setAppReady(true);
        } else {
          navigator.serviceWorker.ready.then(() => {
            setAppReady(true);
          });
        }

        const handleControllerChange = () => {
          if (isMounted) {
            setAppReady(true);
            window.location.reload();
          }
        };

        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

        const handleUpdateFound = () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        };

        if (reg && typeof reg.addEventListener === 'function') {
          reg.addEventListener('updatefound', handleUpdateFound);
        }

        if (reg.waiting) {
          setUpdateAvailable(true);
        }

        return () => {
          if (reg && typeof reg.removeEventListener === 'function') {
            reg.removeEventListener('updatefound', handleUpdateFound);
          }
          navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        };
      } catch (error) {
        console.error('Service worker registration failed:', error);
        setAppReady(true);
      }
    };

    const cleanup = initApp();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      localStorage.setItem('pwaInstalled', 'true');
      setShowInstallBanner(false);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (typeof cleanup === 'function') cleanup();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopupMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleForceUpdate = () => {
    if (registrationRef.current && registrationRef.current.waiting) {
      registrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
    }
  };

  const handlePermissionsGranted = () => {
    setPermissionsGranted(true);
    setShowSettings(false);
  };

  const navigateTo = (path) => {
    setActiveTab(path);
    router.push(path);
    setShowPopupMenu(false);
  };

  const renderTabIcon = (tabName, Icon, path) => (
    <button 
      onClick={() => navigateTo(path)}
      className={`flex flex-col items-center justify-center w-full py-3 rounded-lg transition-all duration-300 ${
        activeTab === path 
          ? 'text-emerald-600 bg-gradient-to-b from-emerald-50 to-white shadow-inner' 
          : 'text-gray-500 hover:text-emerald-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="text-xl mb-1" />
      <span className="text-xs font-medium">{tabName}</span>
    </button>
  );

  const showLoading = !appReady && process.env.NODE_ENV === 'production';

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
        <meta name="theme-color" content="#059669" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="google-site-verification" content="xUHpUZyEBw_hocCHh0q92tUfg5O_7YjfSyfahn-lfhk" />
        
        <title>Quran App Pro - Baca Al-Quran Online & Terjemahan Lengkap</title>
        <meta name="title" content="Quran App Pro - Baca Al-Quran Online & Terjemahan Lengkap" />
        <meta name="description" content="Aplikasi Al-Qur'an digital terlengkap dengan fitur modern: terjemahan bahasa Indonesia, audio murattal, pencarian ayat. Gratis tanpa iklan." />
        <meta name="keywords" content="alquran online, baca quran, aplikasi quran, terjemahan quran, al-quran digital, belajar tajwid, murattal, doa islami, kajian islam, qurankuuu" />
        
        <meta property="og:site_name" content="Quran App Pro" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://qurankuuu.vercel.app/" />
        <meta property="og:title" content="Quran App Pro - Baca Al-Quran Online & Terjemahan Lengkap" />
        <meta property="og:description" content="Aplikasi Al-Qur'an digital terlengkap dengan fitur modern. Gratis tanpa iklan." />
        <meta property="og:image" content="https://qurankuuu.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Quran App Pro - Tampilan Aplikasi Al-Quran Digital" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://qurankuuu.vercel.app/" />
        <meta property="twitter:title" content="Quran App Pro - Baca Al-Quran Online & Terjemahan Lengkap" />
        <meta property="twitter:description" content="Aplikasi Al-Qur'an digital terlengkap dengan fitur modern. Gratis tanpa iklan." />
        <meta property="twitter:image" content="https://qurankuuu.vercel.app/og-image.png" />
        
        <link rel="canonical" href="https://qurankuuu.vercel.app/" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Quran App Pro",
              "description": "Aplikasi Al-Qur'an digital terlengkap dengan terjemahan bahasa Indonesia, audio murattal",
              "operatingSystem": "Android, iOS, Web",
              "applicationCategory": "ReligiousApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "IDR"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1250"
              },
              "image": "https://qurankuuu.vercel.app/og-image.png",
              "url": "https://qurankuuu.vercel.app/"
            })
          }}
        />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        <link 
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet"
        />
        
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="DevNova-ID" />
        <meta name="copyright" content="Quran App Pro" />
        <meta name="language" content="Indonesian" />
        <meta name="revisit-after" content="7 days" />
      </head>
      <body className="font-poppins bg-gradient-to-br from-emerald-50 to-cyan-50 min-h-screen">
        {showLoading ? (
          <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-emerald-500"
                ></motion.div>
                <div className="absolute inset-2 rounded-full bg-emerald-100 flex items-center justify-center">
                  <FaQuran className="text-emerald-600 text-4xl" />
                </div>
              </div>
              <motion.h1 
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ 
                  y: { repeat: Infinity, repeatType: "reverse", duration: 1.5 }
                }}
                className="text-2xl font-bold text-emerald-700 mb-2"
              >
                Quran App Pro
              </motion.h1>
              <p className="text-gray-600 max-w-xs mx-auto">
                Mempersiapkan pengalaman terbaik untuk Anda
              </p>
              <div className="mt-6 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto">
                <motion.div 
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "80%" }}
                  transition={{ duration: 3, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {!isOnline && (
                <motion.div
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  exit={{ y: -50 }}
                  className="bg-yellow-500 text-white text-center py-3 px-4 flex items-center justify-center fixed top-0 left-0 right-0 z-50 shadow-md"
                >
                  <FaInfoCircle className="mr-2 flex-shrink-0" />
                  <span className="truncate">Anda sedang offline. Beberapa fitur mungkin terbatas.</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {updateAvailable && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleForceUpdate}
                className="fixed bottom-24 right-4 z-20 bg-emerald-600 text-white p-3 rounded-full shadow-lg flex items-center shadow-emerald-300"
                title="Perbarui Aplikasi"
              >
                <FaSync className="animate-spin-slow" />
              </motion.button>
            )}
            
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="sticky top-0 z-40 bg-gradient-to-r from-emerald-600 to-teal-500 shadow-lg"
            >
              <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center text-white">
                  <FaQuran className="mr-3 text-xl" />
                  <h1 className="font-bold text-xl tracking-tight">Quran App Pro</h1>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <FaCog className="text-white text-xl" />
                  </button>
                </div>
              </div>
            </motion.header>
            
            <AnimatePresence mode="wait">
              <motion.main
                key={showSettings ? 'settings' : 'content'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="container mx-auto px-4 py-6 min-h-[calc(100vh-200px)] pb-24"
              >
                {showSettings ? (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-emerald-700">Pengaturan</h2>
                      <button 
                        onClick={() => setShowSettings(false)}
                        className="text-gray-500 hover:text-gray-700 text-lg p-1 rounded-full hover:bg-gray-100"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    
                    <PermissionManager onPermissionsGranted={handlePermissionsGranted} />
                    
                    <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                      <h3 className="font-bold text-lg text-emerald-700 mb-4 flex items-center">
                        <FaCog className="mr-2 text-emerald-600" /> Manajemen Penyimpanan
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={() => {
                            if (confirm('Bersihkan semua data cache?')) {
                              caches.keys().then(names => {
                                names.forEach(name => caches.delete(name));
                                alert('Cache berhasil dibersihkan!');
                              });
                            }
                          }}
                          className="py-3 px-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors border border-red-100"
                        >
                          <span>Bersihkan Cache</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            if (confirm('Hapus semua data aplikasi? Ini akan menghapus riwayat dan bookmark.')) {
                              indexedDB.databases().then(dbs => {
                                dbs.forEach(db => indexedDB.deleteDatabase(db.name));
                              });
                              localStorage.clear();
                              alert('Data lokal berhasil dihapus!');
                            }
                          }}
                          className="py-3 px-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors border border-red-100"
                        >
                          <span>Hapus Data Lokal</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                      <h3 className="font-bold text-lg text-emerald-700 mb-4 flex items-center">
                        <FaInfoCircle className="mr-2 text-emerald-600" /> Tentang Aplikasi
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Quran App Pro adalah aplikasi Al-Qur'an digital dengan fitur lengkap dan antarmuka modern.
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-gray-500">Versi</span>
                        <span className="font-medium text-emerald-600">1.2.0</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  children
                )}
              </motion.main>
            </AnimatePresence>
            
            {/* Bottom Navigation */}
            <motion.nav
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-30"
            >
              <div className="grid grid-cols-5 gap-1 px-2 pt-1 pb-2">
                {renderTabIcon('Al-Quran', FaQuran, '/')}
                {renderTabIcon('Kajian', FaInfoCircle, '/info-kajian')}
                
                <div className="relative flex justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPopupMenu(!showPopupMenu)}
                    className={`absolute -top-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                      showPopupMenu 
                        ? 'bg-emerald-700 text-white shadow-emerald-400' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-300'
                    }`}
                  >
                    <FaRocket className="text-xl" />
                  </motion.button>
                </div>
                
                {renderTabIcon('Tajwid', FaBook, '/tajwid')}
                {renderTabIcon('Doa', FaBookOpen, '/doa')}
              </div>
            </motion.nav>
            
            {/* Popup Menu */}
            <AnimatePresence>
              {showPopupMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg p-2 border border-gray-100"
                >
                  <div className="flex">
                    {/* Menu Utama - Sisi Kiri */}
                    <div className="flex flex-col border-r border-gray-100 pr-2 mr-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo('/fikih-nikah')}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 group-hover:bg-emerald-100 mr-2 transition-colors">
                          <GiRing className="text-emerald-600 text-sm" />
                        </div>
                        <span className="text-[12px] font-medium text-gray-700">Fikih Nikah</span>
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo('/public-galeri')}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 group-hover:bg-emerald-100 mr-2 transition-colors">
                          <FaImages className="text-emerald-600 text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Galeri</span>
                      </motion.button>
            
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo('/more')}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 group-hover:bg-emerald-100 mr-2 transition-colors">
                          <FaEllipsisH className="text-emerald-600 text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Lainnya</span>
                      </motion.button>
                    </div>
            
                    {/* Menu Sekunder - Sisi Kanan */}
                    <div className="flex">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo('/support')}
                        className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors w-12"
                        title="Support"
                      >
                        <FaCoffee className="text-gray-500 mb-0.5" />
                        <span className="text-[9px] text-gray-500">Support Me</span>
                      </motion.button>
            
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo('/open-api')}
                        className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors w-12"
                        title="Open API"
                      >
                        <SiOpenapiinitiative className="text-gray-500 mb-0.5" />
                        <span className="text-[9px] text-gray-500">Open API</span>
                      </motion.button>
            
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo('/ask-to-me')}
                        className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors w-12"
                        title="Ask To Me"
                      >
                        <BiMessageRoundedDetail className="text-gray-500 mb-0.5" />
                        <span className="text-[9px] text-gray-500">Ask To Me</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Install Banner */}
            {showInstallBanner && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl shadow-xl p-4 z-40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-lg mr-3">
                      <FaQuran className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Pasang Quran App Pro</h3>
                      <p className="text-white text-sm opacity-90 mt-1">Akses lebih cepat tanpa browser</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowInstallBanner(false)}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium"
                    >
                      Nanti
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={handleInstallClick}
                      className="px-4 py-2 bg-white text-emerald-600 font-medium rounded-lg shadow"
                    >
                      Pasang
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
            
            <PWAInstallPrompt deferredPrompt={deferredPrompt} onInstallClick={handleInstallClick} />
          </>
        )}
        <Analytics/>
      </body>
    </html>
  );
};

export default RootLayout;