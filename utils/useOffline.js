// utils/useOffline.js
'use client'

import { useState, useEffect, useCallback } from 'react';
import {
  isOnline as checkOnlineStatus,
  onNetworkChange,
  queueOfflineAction,
  getOfflineActions,
  clearOfflineActions
} from './serviceWorker';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [cachedData, setCachedData] = useState(new Map());
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Initialize online status and sync time
  useEffect(() => {
    setIsOnline(checkOnlineStatus());
    
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }

    // Set up network change monitoring
    const cleanup = onNetworkChange((online) => {
      setIsOnline(online);
      
      if (online) {
        // Update sync time when coming back online
        const now = new Date();
        localStorage.setItem('lastSyncTime', now.toISOString());
        setLastSyncTime(now);
        
        // Process offline queue
        processOfflineQueue();
      }
    });

    // Load offline queue
    loadOfflineQueue();

    return cleanup;
  }, []);

  // Load offline queue from storage
  const loadOfflineQueue = useCallback(() => {
    const queue = getOfflineActions();
    setOfflineQueue(queue);
  }, []);

  // Process offline queue when back online
  const processOfflineQueue = useCallback(async () => {
    const queue = getOfflineActions();
    
    if (queue.length === 0) return;

    console.log('Processing offline queue:', queue.length, 'items');
    
    const processedActions = [];
    
    for (const action of queue) {
      try {
        // Process each offline action
        await processAction(action);
        processedActions.push(action.id);
      } catch (error) {
        console.error('Failed to process offline action:', action, error);
        // Keep failed actions in queue for retry
      }
    }
    
    // Remove successfully processed actions
    if (processedActions.length > 0) {
      const remainingQueue = queue.filter(action => 
        !processedActions.includes(action.id)
      );
      
      localStorage.setItem('offlineActions', JSON.stringify(remainingQueue));
      setOfflineQueue(remainingQueue);
    }
  }, []);

  // Process individual action
  const processAction = async (action) => {
    switch (action.type) {
      case 'bookmark':
        // Sync bookmark to server
        return fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        
      case 'progress':
        // Sync reading progress
        return fetch('/api/progress', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        
      case 'preference':
        // Sync user preferences
        return fetch('/api/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        
      default:
        console.warn('Unknown action type:', action.type);
    }
  };

  // Fetch data with offline fallback
  const fetchWithFallback = useCallback(async (url, options = {}) => {
    // Check cache first
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    if (cachedData.has(cacheKey)) {
      return cachedData.get(cacheKey);
    }

    try {
      if (isOnline) {
        // Try online fetch
        const response = await fetch(url, options);
        const data = await response.json();
        
        // Cache the response
        setCachedData(prev => new Map(prev.set(cacheKey, data)));
        
        return data;
      } else {
        // Use offline API
        return await fetchOfflineData(url);
      }
    } catch (error) {
      console.error('Fetch failed, trying offline:', error);
      return await fetchOfflineData(url);
    }
  }, [isOnline, cachedData]);

  // Fetch offline data
  const fetchOfflineData = async (originalUrl) => {
    try {
      // Parse original URL to determine data type
      const urlObj = new URL(originalUrl, window.location.origin);
      let offlineUrl = '/api/offline';
      
      // Map original API calls to offline API
      if (originalUrl.includes('equran.id/api/v2/surat')) {
        const pathParts = urlObj.pathname.split('/');
        const surahId = pathParts[pathParts.length - 1];
        offlineUrl += `?type=surat&id=${surahId}`;
      } else if (originalUrl.includes('/api/tajwid')) {
        offlineUrl += '?type=tajwid';
      } else if (originalUrl.includes('/api/doa')) {
        const params = urlObj.searchParams;
        offlineUrl += `?type=doa&kategori=${params.get('kategori') || 'all'}`;
      } else if (originalUrl.includes('/api/tuntunan-sholat')) {
        const pathParts = urlObj.pathname.split('/');
        const subType = pathParts[pathParts.length - 1];
        offlineUrl += `?type=tuntunan-sholat&sub=${subType}`;
      } else if (originalUrl.includes('/api/fikih-nikah')) {
        offlineUrl += '?type=fikih-nikah';
      }
      
      const response = await fetch(offlineUrl);
      return await response.json();
    } catch (error) {
      console.error('Offline fetch failed:', error);
      throw new Error('Data not available offline');
    }
  };

  // Add action to offline queue
  const addToOfflineQueue = useCallback(async (actionType, data) => {
    const action = {
      id: Date.now(),
      type: actionType,
      data: data,
      timestamp: new Date().toISOString()
    };

    await queueOfflineAction(action);
    loadOfflineQueue();
    
    return action;
  }, [loadOfflineQueue]);

  // Clear cache
  const clearCache = useCallback(() => {
    setCachedData(new Map());
    
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      });
    }
  }, []);

  // Get cache info
  const getCacheInfo = useCallback(async () => {
    const info = {
      memoryCache: cachedData.size,
      offlineQueue: offlineQueue.length,
      lastSync: lastSyncTime,
      storageUsage: null
    };

    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        info.storageUsage = {
          used: estimate.usage,
          quota: estimate.quota,
          percentage: Math.round((estimate.usage / estimate.quota) * 100)
        };
      } catch (error) {
        console.error('Failed to get storage info:', error);
      }
    }

    return info;
  }, [cachedData.size, offlineQueue.length, lastSyncTime]);

  // Check if specific data is available offline
  const isDataAvailableOffline = useCallback((dataType) => {
    const offlineAvailable = [
      'surat', 'al-fatihah', 'tajwid', 'doa', 
      'tuntunan-sholat', 'adzan', 'iqomah'
    ];
    
    return offlineAvailable.includes(dataType.toLowerCase());
  }, []);

  // Sync specific data for offline use
  const preloadForOffline = useCallback(async (urls) => {
    if (!isOnline) {
      console.warn('Cannot preload while offline');
      return;
    }

    const results = [];
    
    for (const url of urls) {
      try {
        const data = await fetchWithFallback(url);
        results.push({ url, success: true, data });
      } catch (error) {
        results.push({ url, success: false, error: error.message });
      }
    }
    
    return results;
  }, [isOnline, fetchWithFallback]);

  return {
    // State
    isOnline,
    offlineQueue,
    lastSyncTime,
    
    // Data fetching
    fetchWithFallback,
    
    // Offline queue management
    addToOfflineQueue,
    processOfflineQueue,
    
    // Cache management
    clearCache,
    getCacheInfo,
    
    // Utilities
    isDataAvailableOffline,
    preloadForOffline
  };
};

// Hook for specific offline features
export const useOfflineFeatures = () => {
  const {
    isOnline,
    addToOfflineQueue,
    isDataAvailableOffline
  } = useOffline();

  // Bookmark management
  const addBookmark = useCallback(async (item) => {
    const bookmarkData = {
      id: Date.now(),
      ...item,
      createdAt: new Date().toISOString()
    };

    if (isOnline) {
      try {
        await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookmarkData)
        });
      } catch (error) {
        // Queue for offline sync
        await addToOfflineQueue('bookmark', bookmarkData);
      }
    } else {
      // Store locally and queue for sync
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      bookmarks.push(bookmarkData);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      
      await addToOfflineQueue('bookmark', bookmarkData);
    }

    return bookmarkData;
  }, [isOnline, addToOfflineQueue]);

  // Progress tracking
  const saveProgress = useCallback(async (progressData) => {
    const progress = {
      ...progressData,
      timestamp: new Date().toISOString()
    };

    // Always store locally
    localStorage.setItem(`progress_${progressData.type}_${progressData.id}`, 
      JSON.stringify(progress));

    if (isOnline) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress)
        });
      } catch (error) {
        await addToOfflineQueue('progress', progress);
      }
    } else {
      await addToOfflineQueue('progress', progress);
    }

    return progress;
  }, [isOnline, addToOfflineQueue]);

  // Get offline bookmarks
  const getOfflineBookmarks = useCallback(() => {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]');
  }, []);

  // Get offline progress
  const getOfflineProgress = useCallback((type, id) => {
    const key = `progress_${type}_${id}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }, []);

  return {
    isOnline,
    addBookmark,
    saveProgress,
    getOfflineBookmarks,
    getOfflineProgress,
    isDataAvailableOffline
  };
};