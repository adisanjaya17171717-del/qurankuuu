// components/PWAInstallPrompt.js
'use client';
import { useState, useEffect } from 'react';
import { FaDownload, FaTimes, FaInfoCircle, FaApple, FaAndroid } from 'react-icons/fa';
import { isIOS, isAndroid, isSafari, isRunningAsPWA } from '@/utils/permissions';

const PWAInstallPrompt = ({ deferredPrompt, onInstallClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState('default');
  const [dismissed, setDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Efek untuk menentukan platform dan visibilitas prompt
  useEffect(() => {
    // Jika aplikasi sudah diinstall sebagai PWA, jangan tampilkan prompt
    if (isRunningAsPWA()) {
      setIsVisible(false);
      return;
    }
    
    // Cek apakah pengguna sudah menutup prompt sebelumnya
    const isDismissed = localStorage.getItem('pwaInstallDismissed') === 'true';
    setDismissed(isDismissed);
    
    // Deteksi platform
    if (isIOS()) {
      setPlatform('ios');
      // Tampilkan instruksi khusus iOS jika belum di-dismiss
      setIsVisible(!isDismissed);
    } else if (isAndroid()) {
      setPlatform('android');
      // Untuk Android, tampilkan jika ada deferredPrompt dan belum di-dismiss
      setIsVisible(!isDismissed && !!deferredPrompt);
    } else {
      setPlatform('default');
      // Untuk browser desktop/other, tampilkan jika ada deferredPrompt dan belum di-dismiss
      setIsVisible(!isDismissed && !!deferredPrompt);
    }
  }, [deferredPrompt]);

  // Handle penutupan prompt
  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('pwaInstallDismissed', 'true');
  };

  // Handle tampilan instruksi detail
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Jika tidak terlihat, jangan render apa-apa
  if (!isVisible) return null;

  // Render berdasarkan platform
  if (platform === 'ios') {
    return (
      <div className="fixed bottom-4 right-4 bg-white border border-emerald-300 shadow-xl rounded-lg p-4 max-w-sm z-[1000] animate-fadeIn">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start">
            <div className="p-2 bg-emerald-100 rounded-full mr-3">
              <FaApple className="text-emerald-600 text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-700">Instal Quran App Pro</h3>
              <p className="text-sm text-gray-600 mt-1">
                Nikmati pengalaman seperti aplikasi di perangkat iOS Anda
              </p>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-700 ml-2"
          >
            <FaTimes />
          </button>
        </div>
        
        {showInstructions ? (
          <div className="mt-3 bg-emerald-50 rounded-lg p-3">
            <ol className="list-decimal pl-5 space-y-2">
              <li className="text-sm">Ketuk ikon <span className="font-bold">Share</span> di bagian bawah browser</li>
              <li className="text-sm">Pilih opsi <span className="font-bold">"Add to Home Screen"</span></li>
              <li className="text-sm">Konfirmasi dengan mengetuk <span className="font-bold">"Add"</span></li>
              <li className="text-sm">Aplikasi akan muncul di layar utama Anda</li>
            </ol>
          </div>
        ) : (
          <button
            onClick={toggleInstructions}
            className="mt-3 w-full py-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center justify-center"
          >
            Tampilkan Petunjuk Instalasi <FaInfoCircle className="ml-2" />
          </button>
        )}
        
        <button
          onClick={handleDismiss}
          className="mt-3 w-full py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium"
        >
          Mengerti, Terima Kasih
        </button>
      </div>
    );
  }

  // Untuk Android dan platform lainnya
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-emerald-300 shadow-xl rounded-lg p-4 max-w-sm z-[1000] animate-fadeIn">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start">
          <div className="p-2 bg-emerald-100 rounded-full mr-3">
            {platform === 'android' ? (
              <FaAndroid className="text-emerald-600 text-lg" />
            ) : (
              <FaInfoCircle className="text-emerald-600 text-lg" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-emerald-700">Instal Quran App Pro</h3>
            <p className="text-sm text-gray-600 mt-1">
              Tambahkan ke layar utama untuk pengalaman seperti aplikasi
            </p>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-700 ml-2"
        >
          <FaTimes />
        </button>
      </div>
      
      {platform === 'android' && (
        <div className="mt-3 bg-emerald-50 rounded-lg p-3 flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-3" />
          <p className="text-sm text-gray-600">
            Di perangkat Android, cari opsi "Instal aplikasi" atau "Add to Home screen" di menu browser
          </p>
        </div>
      )}
      
      <div className="mt-4 flex gap-2">
        <button
          onClick={onInstallClick}
          className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg flex items-center justify-center font-medium"
        >
          <FaDownload className="mr-2" /> Instal Sekarang
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
        >
          Nanti
        </button>
      </div>
      
      {platform === 'default' && (
        <div className="mt-3 text-xs text-gray-500">
          <p>Di desktop, cari opsi "Instal" di bilah alamat browser Anda</p>
        </div>
      )}
    </div>
  );
};

// Helper function untuk deteksi Android
// export const isAndroid = () => {
//   return /android/i.test(navigator.userAgent);
// };

export default PWAInstallPrompt;