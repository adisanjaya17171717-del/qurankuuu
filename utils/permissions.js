// utils/permissions.js

/**
 * Memeriksa status izin
 * @param {string} permissionName - Nama izin: 'notifications', 'geolocation', 'camera', 'microphone', 'background-sync', 'periodic-sync', 'file-system'
 * @returns {Promise<boolean>} - Apakah izin diberikan
 */
export const checkPermission = async (permissionName) => {
  try {
    switch (permissionName) {
      case 'notifications':
        return Notification.permission === 'granted';
      
      case 'geolocation':
        if (!navigator.geolocation) return false;
        return new Promise(resolve => {
          navigator.permissions.query({ name: 'geolocation' })
            .then(status => resolve(status.state === 'granted'))
            .catch(() => resolve(false));
        });
      
      case 'camera':
      case 'microphone':
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          return false;
        }
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          return devices.some(device => 
            (permissionName === 'camera' && device.kind === 'videoinput' && device.label) ||
            (permissionName === 'microphone' && device.kind === 'audioinput' && device.label)
          );
        } catch {
          return false;
        }
      
      case 'background-sync':
        return ('serviceWorker' in navigator && 'SyncManager' in window);
      
      case 'periodic-sync':
        return ('serviceWorker' in navigator && 'PeriodicSyncManager' in window);
      
      case 'file-system':
        return ('showOpenFilePicker' in window);
      
      default:
        return false;
    }
  } catch (error) {
    console.error(`Error checking ${permissionName} permission:`, error);
    return false;
  }
};

/**
 * Meminta izin tertentu
 * @param {string} permissionName - Nama izin: 'notifications', 'geolocation', 'camera', 'microphone'
 * @returns {Promise<boolean>} - Apakah izin diberikan
 */
export const requestPermission = async (permissionName) => {
  try {
    switch (permissionName) {
      case 'notifications':
        if (!('Notification' in window)) return false;
        const status = await Notification.requestPermission();
        return status === 'granted';
      
      case 'geolocation':
        if (!('geolocation' in navigator)) return false;
        return new Promise(resolve => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            (error) => {
              console.log('Geolocation permission denied:', error);
              resolve(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        });
      
      case 'camera':
        if (!('mediaDevices' in navigator)) return false;
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          return true;
        } catch (error) {
          console.log('Camera permission denied:', error);
          return false;
        }
      
      case 'microphone':
        if (!('mediaDevices' in navigator)) return false;
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          return true;
        } catch (error) {
          console.log('Microphone permission denied:', error);
          return false;
        }
      
      default:
        return false;
    }
  } catch (error) {
    console.error(`Error requesting ${permissionName} permission:`, error);
    return false;
  }
};

/**
 * Meminta beberapa izin sekaligus
 * @returns {Promise<Object>} - Objek dengan status setiap izin
 */
export const requestPermissions = async () => {
  const permissions = {
    notifications: false,
    geolocation: false,
    camera: false,
    microphone: false,
    backgroundSync: false,
    periodicSync: false,
    fileSystem: true
  };

  try {
    // Meminta izin satu per satu dengan urutan strategis
    permissions.notifications = await requestPermission('notifications');
    permissions.geolocation = await requestPermission('geolocation');
    permissions.camera = await requestPermission('camera');
    permissions.microphone = await requestPermission('microphone');
    
    // Background Sync tidak memerlukan izin khusus, hanya dukungan
    permissions.backgroundSync = await checkPermission('background-sync');
    
    // Periodic Sync tidak memerlukan izin khusus
    permissions.periodicSync = await checkPermission('periodic-sync');
    
    // File System Access memerlukan interaksi pengguna khusus
    permissions.fileSystem = await checkPermission('file-system');
    
    return permissions;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return permissions;
  }
};

/**
 * Meminta akses ke file system (membuka file)
 * @returns {Promise<FileSystemFileHandle|null>} - File handle atau null jika gagal
 */
export const requestFileSystemAccess = async () => {
  if (!('showOpenFilePicker' in window)) return null;
  
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: 'Quran Files',
        accept: { 
          'application/json': ['.json'],
          'text/plain': ['.txt']
        }
      }],
      multiple: false,
      excludeAcceptAllOption: false
    });
    
    return fileHandle;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('File access error', error);
    }
    return null;
  }
};

/**
 * Memeriksa status beberapa izin sekaligus
 * @returns {Promise<Object>} - Objek dengan status setiap izin
 */
export const checkAllPermissions = async () => {
  const permissions = {
    notifications: await checkPermission('notifications'),
    geolocation: await checkPermission('geolocation'),
    camera: await checkPermission('camera'),
    microphone: await checkPermission('microphone'),
    backgroundSync: await checkPermission('background-sync'),
    periodicSync: await checkPermission('periodic-sync'),
    fileSystem: await checkPermission('file-system')
  };
  
  return permissions;
};

/**
 * Memeriksa apakah perangkat mendukung semua fitur PWA
 * @returns {Promise<Object>} - Objek dengan status dukungan fitur
 */
export const checkPWASupport = async () => {
  const support = {
    serviceWorker: 'serviceWorker' in navigator,
    pushNotifications: 'PushManager' in window,
    backgroundSync: 'SyncManager' in window,
    periodicSync: 'PeriodicSyncManager' in window,
    fileSystem: 'showOpenFilePicker' in window,
    installPrompt: 'onbeforeinstallprompt' in window,
    storage: 'storage' in navigator && 'estimate' in navigator.storage,
    indexedDB: 'indexedDB' in window,
    webShare: 'share' in navigator
  };
  
  // Tambahkan estimasi storage jika didukung
  if (support.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      support.storageEstimate = estimate;
    } catch (error) {
      console.error('Storage estimate failed:', error);
    }
  }
  
  return support;
};

/**
 * Memeriksa apakah aplikasi diinstal sebagai PWA
 * @returns {boolean} - Apakah aplikasi berjalan sebagai PWA
 */
export const isRunningAsPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.matchMedia('(display-mode: fullscreen)').matches ||
         window.matchMedia('(display-mode: minimal-ui)').matches ||
         (window.navigator.standalone === true);
};

/**
 * Memeriksa apakah perangkat adalah iOS
 * @returns {boolean} - Apakah perangkat iOS
 */
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

/**
 * Memeriksa apakah browser adalah Safari
 * @returns {boolean} - Apakah browser Safari
 */
export const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

/**
 * Memeriksa apakah perangkat adalah Android
 * @returns {boolean} - Apakah perangkat Android
 */
export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

/**
 * Meminta izin notifikasi dengan pendekatan yang lebih user-friendly
 * @returns {Promise<boolean>} - Apakah izin diberikan
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  
  // Jika izin sudah diberikan
  if (Notification.permission === 'granted') return true;
  
  // Jika izin ditolak, coba minta lagi dengan dialog custom
  if (Notification.permission === 'denied') {
    const shouldRetry = window.confirm(
      'Izin notifikasi ditolak. Buka pengaturan browser untuk mengizinkan?'
    );
    
    if (shouldRetry) {
      // Tidak ada cara programatis, kembalikan false
      return false;
    }
  }
  
  // Minta izin
  const status = await Notification.requestPermission();
  return status === 'granted';
};

/**
 * Memeriksa apakah background sync didukung dan terdaftar
 * @param {string} tag - Tag untuk sync
 * @returns {Promise<boolean>} - Apakah sync terdaftar
 */
export const checkBackgroundSync = async (tag = 'sync-data') => {
  if (!('serviceWorker' in navigator)) return false;
  if (!('SyncManager' in window)) return false;
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const tags = await registration.sync.getTags();
    return tags.includes(tag);
  } catch (error) {
    console.error('Background sync check failed:', error);
    return false;
  }
};

/**
 * Mendapatkan informasi penyimpanan
 * @returns {Promise<Object|null>} - Informasi penyimpanan
 */
export const getStorageInfo = async () => {
  if (!('storage' in navigator)) return null;
  if (!('estimate' in navigator.storage)) return null;
  
  try {
    const estimate = await navigator.storage.estimate();
    const usage = (estimate.usage / (1024 * 1024)).toFixed(2);
    const quota = (estimate.quota / (1024 * 1024)).toFixed(2);
    const percentage = ((estimate.usage / estimate.quota) * 100).toFixed(1);
    
    return {
      usageMB: parseFloat(usage),
      quotaMB: parseFloat(quota),
      usagePercentage: parseFloat(percentage),
      details: estimate
    };
  } catch (error) {
    console.error('Storage info failed:', error);
    return null;
  }
};

/**
 * Memeriksa apakah file system access didukung
 * @returns {boolean} - Apakah file system access didukung
 */
export const isFileSystemSupported = () => {
  return 'showOpenFilePicker' in window;
};

/**
 * Memeriksa apakah fitur tertentu didukung
 * @param {string} feature - Nama fitur
 * @returns {boolean} - Apakah fitur didukung
 */
export const isFeatureSupported = (feature) => {
  const featureMap = {
    'geolocation': 'geolocation' in navigator,
    'camera': 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    'microphone': 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    'notifications': 'Notification' in window,
    'background-sync': 'SyncManager' in window,
    'periodic-sync': 'PeriodicSyncManager' in window,
    'file-system': 'showOpenFilePicker' in window,
    'push': 'PushManager' in window
  };
  
  return featureMap[feature] || false;
};

/**
 * Meminta izin dengan strategi progresif
 * @param {string} permission - Jenis izin
 * @param {string} reason - Alasan untuk izin
 * @returns {Promise<boolean>} - Apakah izin diberikan
 */
export const requestPermissionWithReason = async (permission, reason) => {
  // Jika izin sudah diberikan, kembalikan true
  if (await checkPermission(permission)) return true;
  
  // Tampilkan dialog dengan alasan
  const granted = window.confirm(`${reason}\n\nIzinkan akses ${permission}?`);
  if (!granted) return false;
  
  // Minta izin
  return requestPermission(permission);
};