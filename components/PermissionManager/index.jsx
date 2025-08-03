// components/PermissionManager.jsx
'use client';
import { 
  FaBell, 
  FaMicrophone, 
  FaCamera, 
  FaMapMarkerAlt,
  FaSync,
  FaFile,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaDatabase,
  FaTrash
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { 
  requestPermission,
  checkPermission,
  requestFileSystemAccess,
  getStorageInfo,
  isFeatureSupported
} from '@/utils/permissions';
import { registerBackgroundSync } from '@/utils/serviceWorker';
import ProgressBar from '@/components/ProgressBar';

const PermissionManager = ({ onPermissionsGranted }) => {
  const [permissions, setPermissions] = useState({
    notifications: false,
    geolocation: false,
    camera: false,
    microphone: false,
    backgroundSync: false,
    fileSystem: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [fileAccessGranted, setFileAccessGranted] = useState(false);
  const [fileHandle, setFileHandle] = useState(null);

  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      setIsLoading(true);
      try {
        const results = {
          notifications: await checkPermission('notifications'),
          geolocation: await checkPermission('geolocation'),
          camera: await checkPermission('camera'),
          microphone: await checkPermission('microphone'),
          backgroundSync: await checkPermission('background-sync'),
          fileSystem: false // File system requires special handling
        };
        setPermissions(results);
      } catch (error) {
        console.error('Error checking permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStorageInfo = async () => {
      try {
        const info = await getStorageInfo();
        setStorageInfo(info);
      } catch (error) {
        console.error('Failed to get storage info:', error);
      }
    };

    checkPermissions();
    fetchStorageInfo();
  }, []);

  // Handle requesting all permissions
  const handleRequestPermissions = async () => {
    setIsLoading(true);
    try {
      const results = {
        notifications: await requestPermission('notifications'),
        geolocation: await requestPermission('geolocation'),
        camera: await requestPermission('camera'),
        microphone: await requestPermission('microphone'),
        backgroundSync: false,
        fileSystem: false
      };
      
      // Handle background sync separately
      if (isFeatureSupported('background-sync')) {
        try {
          await registerBackgroundSync('quran-sync');
          results.backgroundSync = true;
        } catch (error) {
          console.error('Background sync registration failed:', error);
        }
      }
      
      setPermissions(results);
      
      if (onPermissionsGranted) {
        onPermissionsGranted();
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file system access request
  const handleRequestFileAccess = async () => {
    setIsLoading(true);
    try {
      const handle = await requestFileSystemAccess();
      if (handle) {
        setFileHandle(handle);
        setFileAccessGranted(true);
        setPermissions(prev => ({
          ...prev,
          fileSystem: true
        }));
      }
    } catch (error) {
      console.error('File access error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clearing cache
  const handleClearCache = async () => {
    setIsClearingCache(true);
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      alert('Cache berhasil dibersihkan!');
      
      // Refresh storage info
      const info = await getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('Gagal membersihkan cache');
    } finally {
      setIsClearingCache(false);
    }
  };

  // Handle clearing local data
  const handleClearLocalData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data lokal? Ini akan menghapus semua pengaturan dan data aplikasi.')) {
      try {
        // Clear IndexedDB databases
        indexedDB.databases().then(databases => {
          databases.forEach(db => {
            indexedDB.deleteDatabase(db.name);
          });
        });
        
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        alert('Data lokal berhasil dihapus! Aplikasi akan dimuat ulang.');
        window.location.reload();
      } catch (error) {
        console.error('Failed to clear local data:', error);
        alert('Gagal menghapus data lokal');
      }
    }
  };

  // Permission item component
  const PermissionItem = ({ name, icon, label, description, supported }) => {
    const Icon = icon;
    const granted = permissions[name];
    const isFileSystem = name === 'fileSystem';
    
    return (
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-full mr-3 ${
              granted ? 'bg-emerald-100 text-emerald-600' : 
              !supported ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}>
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-medium">{label}</h3>
              <p className="text-sm text-gray-500">{description}</p>
              {!supported && (
                <p className="text-xs text-red-500 mt-1">Tidak didukung di browser ini</p>
              )}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs ${
            granted ? 'bg-emerald-100 text-emerald-800' : 
            !supported ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-800'
          }`}>
            {granted ? <FaCheck /> : <FaTimes />}
          </div>
        </div>
        
        {!granted && supported && !isFileSystem && (
          <button
            onClick={() => handleRequestPermission(name)}
            disabled={isLoading}
            className="mt-3 w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100"
          >
            Minta Izin
          </button>
        )}
        
        {isFileSystem && !granted && supported && (
          <button
            onClick={handleRequestFileAccess}
            disabled={isLoading}
            className="mt-3 w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100"
          >
            Izinkan Akses File
          </button>
        )}
        
        {isFileSystem && granted && fileHandle && (
          <div className="mt-3 bg-emerald-50 p-3 rounded-lg">
            <p className="text-sm text-emerald-700 flex items-center">
              <FaFile className="mr-2" />
              Akses diberikan ke: <span className="font-medium ml-1">{fileHandle.name}</span>
            </p>
          </div>
        )}
      </div>
    );
  };

  // Request individual permission
  const handleRequestPermission = async (permissionName) => {
    setIsLoading(true);
    try {
      let result = false;
      
      switch (permissionName) {
        case 'notifications':
          result = await requestPermission('notifications');
          break;
        case 'geolocation':
          result = await requestPermission('geolocation');
          break;
        case 'camera':
          result = await requestPermission('camera');
          break;
        case 'microphone':
          result = await requestPermission('microphone');
          break;
        case 'backgroundSync':
          if (isFeatureSupported('background-sync')) {
            await registerBackgroundSync('quran-sync');
            result = true;
          }
          break;
        default:
          break;
      }
      
      setPermissions(prev => ({
        ...prev,
        [permissionName]: result
      }));
    } catch (error) {
      console.error(`Error requesting ${permissionName} permission:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if all permissions are granted
  const allPermissionsGranted = Object.values(permissions).every(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-4 text-white">
        <h2 className="text-xl font-bold">Izin Aplikasi</h2>
        <p className="text-sm opacity-90">Kelola izin untuk fitur lengkap</p>
      </div>

      <div className="divide-y divide-gray-100">
        <PermissionItem 
          name="notifications"
          icon={FaBell}
          label="Notifikasi"
          description="Pengingat baca harian dan update konten"
          supported={isFeatureSupported('notifications')}
        />
        <PermissionItem 
          name="microphone"
          icon={FaMicrophone}
          label="Mikrofon"
          description="Untuk fitur sambung ayat dengan suara"
          supported={isFeatureSupported('microphone')}
        />
        <PermissionItem 
          name="camera"
          icon={FaCamera}
          label="Kamera"
          description="Scan kode QR untuk berbagi ayat"
          supported={isFeatureSupported('camera')}
        />
        <PermissionItem 
          name="geolocation"
          icon={FaMapMarkerAlt}
          label="Lokasi"
          description="Menemukan kajian terdekat"
          supported={isFeatureSupported('geolocation')}
        />
        <PermissionItem 
          name="backgroundSync"
          icon={FaSync}
          label="Sinkronisasi Latar"
          description="Update konten saat aplikasi ditutup"
          supported={isFeatureSupported('background-sync')}
        />
        <PermissionItem 
          name="fileSystem"
          icon={FaFile}
          label="Akses File"
          description="Simpan bacaan offline"
          supported={isFeatureSupported('file-system')}
        />
      </div>

      <div className="p-4 bg-gray-50">
        <button
          onClick={handleRequestPermissions}
          disabled={isLoading || allPermissionsGranted}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            isLoading || allPermissionsGranted
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:opacity-90'
          }`}
        >
          {isLoading 
            ? 'Memproses...' 
            : allPermissionsGranted 
              ? 'Semua Izin Diberikan' 
              : 'Izinkan Semua'}
        </button>
        
        <div className="mt-6">
          <h3 className="font-bold text-lg text-emerald-700 mb-3 flex items-center">
            <FaDatabase className="mr-2" /> Manajemen Penyimpanan
          </h3>
          
          {storageInfo ? (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Penyimpanan digunakan</span>
                <span>{storageInfo.usageMB.toFixed(2)}MB / {storageInfo.quotaMB.toFixed(2)}MB</span>
              </div>
              <ProgressBar 
                percentage={storageInfo.usagePercentage} 
                color="bg-emerald-600"
              />
              <p className="text-xs text-gray-500 mt-2 text-right">
                {storageInfo.usagePercentage.toFixed(1)}% digunakan
              </p>
            </div>
          ) : (
            <div className="mb-4 bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleClearCache}
              disabled={isClearingCache}
              className={`py-2 flex items-center justify-center ${
                isClearingCache
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              } rounded-lg`}
            >
              {isClearingCache ? (
                <>
                  <span className="animate-spin mr-2">↻</span> Membersihkan...
                </>
              ) : (
                <>
                  <FaTrash className="mr-2" /> Bersihkan Cache
                </>
              )}
            </button>
            <button
              onClick={handleClearLocalData}
              className="py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center"
            >
              <FaTrash className="mr-2" /> Hapus Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;