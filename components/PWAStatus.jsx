'use client'

import { useState, useEffect } from 'react';
import { 
  FaWifi, 
  FaDownload, 
  FaClock, 
  FaHardDrive,
  FaSync,
  FaBell,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
  FaChartPie
} from 'react-icons/fa';
import { 
  isRunningAsPWA,
  getStorageUsage,
  requestNotificationPermission,
  canInstallPWA,
  installPWA,
  getCacheInfo,
  clearCache
} from '../utils/serviceWorker';
import { useOffline } from '../utils/useOffline';

export default function PWAStatus({ isOpen, onClose }) {
  const {
    isOnline,
    offlineQueue,
    lastSyncTime,
    getCacheInfo: getOfflineCacheInfo,
    clearCache: clearOfflineCache
  } = useOffline();

  const [isPWA, setIsPWA] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);
  const [cacheInfo, setCacheInfo] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [canInstall, setCanInstall] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadPWAStatus();
    }
  }, [isOpen]);

  const loadPWAStatus = async () => {
    setLoading(true);
    
    try {
      // Check PWA status
      setIsPWA(isRunningAsPWA());
      setCanInstall(canInstallPWA());
      
      // Get storage information
      const storage = await getStorageUsage();
      setStorageInfo(storage);
      
      // Get cache information
      const cache = await getOfflineCacheInfo();
      setCacheInfo(cache);
      
      // Check notification permission
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    } catch (error) {
      console.error('Failed to load PWA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallPWA = async () => {
    try {
      const installed = await installPWA();
      if (installed) {
        setCanInstall(false);
        setIsPWA(true);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleRequestNotifications = async () => {
    try {
      const granted = await requestNotificationPermission();
      setNotificationPermission(granted ? 'granted' : 'denied');
    } catch (error) {
      console.error('Notification permission failed:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      await clearOfflineCache();
      await loadPWAStatus();
    } catch (error) {
      console.error('Clear cache failed:', error);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return 'Tidak diketahui';
    return new Date(date).toLocaleString('id-ID');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
          
          <h2 className="text-xl font-bold mb-2">Status PWA</h2>
          <p className="text-emerald-100">
            Informasi aplikasi dan fitur offline
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat informasi...</p>
            </div>
          ) : (
            <>
              {/* Connection Status */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Status Koneksi</h3>
                  <div className={`flex items-center ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    <FaWifi className="mr-1" />
                    <span className="text-sm font-medium">
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                
                {lastSyncTime && (
                  <p className="text-sm text-gray-600">
                    Sinkronisasi terakhir: {formatDate(lastSyncTime)}
                  </p>
                )}
                
                {offlineQueue.length > 0 && (
                  <div className="mt-2 flex items-center text-amber-600">
                    <FaClock className="mr-1" />
                    <span className="text-sm">
                      {offlineQueue.length} aksi menunggu sinkronisasi
                    </span>
                  </div>
                )}
              </div>

              {/* PWA Installation Status */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Status Instalasi</h3>
                  <div className={`flex items-center ${isPWA ? 'text-green-600' : 'text-gray-600'}`}>
                    <FaCheckCircle className="mr-1" />
                    <span className="text-sm font-medium">
                      {isPWA ? 'Terinstall' : 'Belum Install'}
                    </span>
                  </div>
                </div>
                
                {!isPWA && canInstall && (
                  <button
                    onClick={handleInstallPWA}
                    className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                  >
                    <FaDownload className="mr-2 inline" />
                    Install Aplikasi
                  </button>
                )}
                
                {isPWA && (
                  <div className="flex items-center text-green-600">
                    <FaCheckCircle className="mr-2" />
                    <span className="text-sm">Aplikasi sudah terinstall sebagai PWA</span>
                  </div>
                )}
              </div>

              {/* Storage Information */}
              {storageInfo && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Storage</h3>
                    <FaHardDrive className="text-gray-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Digunakan:</span>
                      <span className="font-medium">{formatBytes(storageInfo.used)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kuota:</span>
                      <span className="font-medium">{formatBytes(storageInfo.quota)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Persentase:</span>
                      <span className="font-medium">{storageInfo.percentage}%</span>
                    </div>
                    
                    {/* Storage Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          storageInfo.percentage > 80 ? 'bg-red-500' :
                          storageInfo.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${storageInfo.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cache Information */}
              {cacheInfo && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Cache</h3>
                    <FaChartPie className="text-gray-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Memory Cache:</span>
                      <span className="font-medium">{cacheInfo.memoryCache} item</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Offline Queue:</span>
                      <span className="font-medium">{cacheInfo.offlineQueue} aksi</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleClearCache}
                    className="w-full mt-3 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm"
                  >
                    <FaTrash className="mr-2 inline" />
                    Hapus Cache
                  </button>
                </div>
              )}

              {/* Notification Permission */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                  <div className={`flex items-center ${
                    notificationPermission === 'granted' ? 'text-green-600' :
                    notificationPermission === 'denied' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <FaBell className="mr-1" />
                    <span className="text-sm font-medium">
                      {notificationPermission === 'granted' ? 'Diizinkan' :
                       notificationPermission === 'denied' ? 'Ditolak' : 'Default'}
                    </span>
                  </div>
                </div>
                
                {notificationPermission === 'default' && (
                  <button
                    onClick={handleRequestNotifications}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    <FaBell className="mr-2 inline" />
                    Izinkan Notifikasi
                  </button>
                )}
                
                {notificationPermission === 'granted' && (
                  <div className="flex items-center text-green-600">
                    <FaCheckCircle className="mr-2" />
                    <span className="text-sm">Notifikasi sudah diizinkan</span>
                  </div>
                )}
                
                {notificationPermission === 'denied' && (
                  <div className="flex items-center text-red-600">
                    <FaExclamationTriangle className="mr-2" />
                    <span className="text-sm">Notifikasi ditolak. Ubah di pengaturan browser.</span>
                  </div>
                )}
              </div>

              {/* Features Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center">
                  <FaInfoCircle className="mr-2" />
                  Fitur yang Tersedia
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-emerald-700">
                    <FaCheckCircle className="mr-2" />
                    <span>Akses offline untuk konten dasar</span>
                  </div>
                  <div className="flex items-center text-emerald-700">
                    <FaCheckCircle className="mr-2" />
                    <span>Cache otomatis untuk performa</span>
                  </div>
                  <div className="flex items-center text-emerald-700">
                    <FaCheckCircle className="mr-2" />
                    <span>Sinkronisasi data saat online</span>
                  </div>
                  <div className="flex items-center text-emerald-700">
                    <FaCheckCircle className="mr-2" />
                    <span>Background sync untuk aksi offline</span>
                  </div>
                  {isPWA && (
                    <div className="flex items-center text-emerald-700">
                      <FaCheckCircle className="mr-2" />
                      <span>Shortcut keyboard dan app-like experience</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}