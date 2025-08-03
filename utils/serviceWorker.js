// utils/serviceWorker.js

// Fungsi utama untuk mendaftarkan Service Worker
export const registerServiceWorker = () => {
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
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (callback && typeof callback === 'function') {
        callback(event.data);
      }
    });
  }
};

// Fungsi untuk memeriksa apakah fitur service worker didukung
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

// Fungsi untuk memeriksa apakah aplikasi dijalankan sebagai PWA
export const isRunningAsPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.matchMedia('(display-mode: fullscreen)').matches ||
         window.matchMedia('(display-mode: minimal-ui)').matches;
};