// utils/serviceWorker.js

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Fungsi utama untuk mendaftarkan Service Worker
export const registerServiceWorker = () => {
  // Return early if not in browser
  if (!isBrowser) {
    return Promise.resolve({
      fake: true,
      unregister: () => Promise.resolve(true)
    });
  }

  // Nonaktifkan service worker di development
  if (process.env.NODE_ENV === 'development') {
    console.log('Service worker disabled in development mode');
    return Promise.resolve({
      fake: true,
      unregister: () => Promise.resolve(true)
    });
  }

  // Di production, daftarkan service worker
  if ('serviceWorker' in navigator) {
    return new Promise((resolve, reject) => {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: '/' })
        .then(registration => {
          console.log('ServiceWorker registered: ', registration.scope);
          
          // Handle controller change event
          let refreshing = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            console.log('Controller changed, reloading page');
            window.location.reload();
          });
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content available, please refresh');
                  
                  // Kirim event ke komponen untuk menampilkan notifikasi update
                  sendMessageToSW({
                    type: 'UPDATE_AVAILABLE',
                    message: 'Versi baru tersedia!'
                  });
                } else {
                  console.log('Service worker installed for the first time');
                  // Save first install time
                  localStorage.setItem('lastSyncTime', new Date().toISOString());
                }
              }
            });
          });
          
          // Periksa update secara berkala (setiap 1 jam)
          setInterval(() => {
            registration.update().catch(err => 
              console.log('Update check failed:', err)
            );
          }, 60 * 60 * 1000);
          
          // Initialize sync time tracking
          if (!localStorage.getItem('lastSyncTime')) {
            localStorage.setItem('lastSyncTime', new Date().toISOString());
          }
          
          resolve(registration);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed: ', error);
          reject(error);
        });
    });
  }
  return Promise.reject('Service workers not supported');
};

// Fungsi untuk mengirim pesan ke service worker
export const sendMessageToSW = async (message) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
    return true;
  }
  return false;
};

// Fungsi untuk memeriksa update
export const checkForUpdate = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      
      if (registration.waiting) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to check for update:', error);
      return false;
    }
  }
  return false;
};

// Fungsi untuk unregister service worker
export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        return Promise.all(registrations.map(reg => reg.unregister()));
      });
  }
  return Promise.resolve();
};

// Fungsi untuk background sync
export const registerBackgroundSync = async (tag) => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      return registration.sync.register(tag);
    } catch (error) {
      console.error('Background sync failed:', error);
      throw error;
    }
  }
  return Promise.reject('Background sync not supported');
};

// Fungsi untuk periodic sync
export const registerPeriodicSync = async (tag, options) => {
  if ('serviceWorker' in navigator && 'PeriodicSyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      return registration.periodicSync.register(tag, options);
    } catch (error) {
      console.error('Periodic sync failed:', error);
      throw error;
    }
  }
  return Promise.reject('Periodic sync not supported');
};

// Fungsi untuk memaksa update service worker
export const forceSWUpdate = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      
      // Skip waiting dan aktifkan worker baru
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        return true;
      }
    } catch (error) {
      console.error('Force update failed:', error);
    }
  }
  return false;
};

// Fungsi untuk mendapatkan status service worker
export const getSWState = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      return {
        active: registration.active,
        waiting: registration.waiting,
        installing: registration.installing,
        controller: navigator.serviceWorker.controller
      };
    } catch (error) {
      console.error('Failed to get SW state:', error);
    }
  }
  return null;
};

// Fungsi untuk memeriksa apakah service worker mengontrol halaman
export const isSWControlling = () => {
  return ('serviceWorker' in navigator) && !!navigator.serviceWorker.controller;
};

// Fungsi untuk menginisialisasi event listener untuk pesan dari service worker
export const initSWMessageListener = (callback) => {
  if (!isBrowser || !('serviceWorker' in navigator)) {
    return;
  }
  
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (callback && typeof callback === 'function') {
      callback(event.data);
    }
  });
};

// Fungsi untuk memeriksa apakah fitur service worker didukung
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

// Fungsi untuk memeriksa apakah aplikasi dijalankan sebagai PWA
export const isRunningAsPWA = () => {
  if (!isBrowser) return false;
  
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.matchMedia('(display-mode: fullscreen)').matches ||
         window.matchMedia('(display-mode: minimal-ui)').matches;
};

// Advanced PWA Features

// Cache management functions
export const getCacheInfo = async () => {
  if ('caches' in window) {
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };
      
      sendMessageToSW({
        type: 'GET_CACHE_INFO'
      }, [messageChannel.port2]);
    });
  }
  return null;
};

export const clearCache = async (cacheName = null) => {
  return sendMessageToSW({
    type: 'CLEAR_CACHE',
    payload: { cacheName }
  });
};

export const preloadContent = async (urls) => {
  return sendMessageToSW({
    type: 'CACHE_URLS',
    payload: { urls }
  });
};

// Push notification functions
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const subscribeToPushNotifications = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        return existingSubscription;
      }
      
      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
      });
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }
  return null;
};

export const unsubscribeFromPushNotifications = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        return true;
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    }
  }
  return false;
};

// Offline handling functions
export const queueOfflineAction = async (action) => {
  if ('localStorage' in window) {
    const offlineActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
    offlineActions.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...action
    });
    localStorage.setItem('offlineActions', JSON.stringify(offlineActions));
    
    // Try to register background sync
    try {
      await registerBackgroundSync('background-sync');
    } catch (error) {
      console.log('Background sync not available');
    }
  }
};

export const getOfflineActions = () => {
  if ('localStorage' in window) {
    return JSON.parse(localStorage.getItem('offlineActions') || '[]');
  }
  return [];
};

export const clearOfflineActions = () => {
  if ('localStorage' in window) {
    localStorage.removeItem('offlineActions');
  }
};

// Network status functions
export const isOnline = () => {
  return navigator.onLine;
};

export const onNetworkChange = (callback) => {
  if (!isBrowser) {
    return () => {}; // Return empty cleanup function
  }

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Storage functions
export const getStorageUsage = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage,
        quota: estimate.quota,
        percentage: Math.round((estimate.usage / estimate.quota) * 100)
      };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
    }
  }
  return null;
};

export const requestPersistentStorage = async () => {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    try {
      const granted = await navigator.storage.persist();
      return granted;
    } catch (error) {
      console.error('Failed to request persistent storage:', error);
    }
  }
  return false;
};

// Install prompt functions
export const canInstallPWA = () => {
  return window.deferredPrompt !== undefined;
};

export const installPWA = async () => {
  if (window.deferredPrompt) {
    const prompt = window.deferredPrompt;
    window.deferredPrompt = null;
    
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    
    return outcome === 'accepted';
  }
  return false;
};

// Helper functions
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = isBrowser ? window.atob(base64) : '';
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
};

// PWA Lifecycle Management
export const initPWAFeatures = async () => {
  if (!isBrowser) {
    return;
  }

  try {
    // Register service worker
    const registration = await registerServiceWorker();
    
    // Initialize message listener
    initSWMessageListener((message) => {
      console.log('SW Message:', message);
      
      if (message.type === 'UPDATE_AVAILABLE' && isBrowser) {
        // Show update notification to user
        window.dispatchEvent(new CustomEvent('sw-update-available'));
      }
    });
    
    // Request persistent storage
    await requestPersistentStorage();
    
    // Set up network status monitoring
    onNetworkChange((online) => {
      if (online) {
        localStorage.setItem('lastSyncTime', new Date().toISOString());
        // Process any offline actions
        const offlineActions = getOfflineActions();
        if (offlineActions.length > 0) {
          console.log('Processing offline actions:', offlineActions.length);
          // These will be processed by the service worker
        }
      }
    });
    
    return registration;
  } catch (error) {
    console.error('Failed to initialize PWA features:', error);
    throw error;
  }
};

// Install prompt handling
let deferredPrompt = null;

if (isBrowser) {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA install prompt triggered');
    e.preventDefault();
    deferredPrompt = e;
    window.deferredPrompt = e;
    
    // Dispatch custom event for components to listen
    window.dispatchEvent(new CustomEvent('pwa-installable'));
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
    window.deferredPrompt = null;
    
    // Track installation
    localStorage.setItem('pwaInstalled', 'true');
    localStorage.setItem('pwaInstallDate', new Date().toISOString());
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  });
}