'use client'

import { useState, useEffect } from 'react';
import { 
  FaDownload, 
  FaTimes, 
  FaMobile, 
  FaDesktop,
  FaWifi,
  FaHeart,
  FaRocket,
  FaCheckCircle
} from 'react-icons/fa';
import { installPWA, canInstallPWA, isRunningAsPWA } from '../utils/serviceWorker';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    setIsPWA(isRunningAsPWA());
    
    // Check if app is installable
    const checkInstallable = () => {
      setIsInstallable(canInstallPWA());
    };

    // Listen for install prompt events
    const handleInstallable = () => {
      setIsInstallable(true);
      
      // Don't show immediately, wait a bit for user engagement
      setTimeout(() => {
        if (!localStorage.getItem('pwaPromptDismissed') && !isRunningAsPWA()) {
          setShowPrompt(true);
        }
      }, 10000); // Show after 10 seconds
    };

    const handleInstalled = () => {
      setShowPrompt(false);
      setIsInstallable(false);
      setIsPWA(true);
      
      // Show success message
      if (window.toast) {
        window.toast.success('Aplikasi berhasil diinstall!');
      }
    };

    checkInstallable();
    
    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    try {
      setInstalling(true);
      const installed = await installPWA();
      
      if (installed) {
        setShowPrompt(false);
        setIsInstallable(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptDismissed', 'true');
    
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwaPromptDismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  const benefits = [
    {
      icon: <FaWifi className="text-emerald-500" />,
      title: "Akses Offline",
      description: "Baca Al-Qur'an tanpa internet"
    },
    {
      icon: <FaRocket className="text-blue-500" />,
      title: "Lebih Cepat",
      description: "Loading instant seperti aplikasi native"
    },
    {
      icon: <FaMobile className="text-purple-500" />,
      title: "Home Screen",
      description: "Akses langsung dari layar utama"
    },
    {
      icon: <FaHeart className="text-pink-500" />,
      title: "Hemat Data",
      description: "Konsumsi data lebih efisien"
    }
  ];

  // Don't show if already PWA or not installable
  if (isPWA || !isInstallable || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white relative">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              <FaDownload className="text-2xl" />
            </div>
            <h2 className="text-xl font-bold mb-2">Install QuranKu</h2>
            <p className="text-emerald-100">
              Dapatkan pengalaman terbaik dengan menginstall aplikasi
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showBenefits ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-8 mb-4">
                  <div className="text-center">
                    <FaMobile className="text-3xl text-emerald-500 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Mobile</span>
                  </div>
                  <div className="text-center">
                    <FaDesktop className="text-3xl text-emerald-500 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Desktop</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Install di perangkat apapun untuk akses yang lebih mudah
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={handleInstall}
                  disabled={installing}
                  className={`w-full bg-emerald-500 text-white py-3 px-6 rounded-xl font-semibold transition-all ${
                    installing 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-emerald-600 transform hover:scale-105'
                  }`}
                >
                  {installing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Installing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaDownload className="mr-2" />
                      Install Sekarang
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setShowBenefits(true)}
                  className="w-full text-emerald-600 py-2 px-6 rounded-xl font-medium hover:bg-emerald-50 transition-colors"
                >
                  Lihat Keuntungan
                </button>
              </div>

              <div className="flex items-center justify-center text-xs text-gray-500">
                <FaCheckCircle className="mr-1" />
                Gratis • Aman • Tanpa Iklan
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Keuntungan Install Aplikasi
              </h3>

              <div className="space-y-4 mb-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBenefits(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={handleInstall}
                  disabled={installing}
                  className={`flex-1 bg-emerald-500 text-white py-3 px-6 rounded-xl font-semibold transition-all ${
                    installing 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-emerald-600'
                  }`}
                >
                  {installing ? 'Installing...' : 'Install'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3">
          <p className="text-xs text-gray-500 text-center">
            Tidak akan ada pop-up lagi selama 7 hari jika ditolak
          </p>
        </div>
      </div>
    </div>
  );
}