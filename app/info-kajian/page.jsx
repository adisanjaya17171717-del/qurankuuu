'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabaseClient';
import UploadKajian from '@/components/UploadKajian';
import { 
  FaSearch, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
  FaUser, FaFilter, FaBookmark, FaShareAlt, FaStar,
  FaPlus, FaTimes, FaGlobe, FaList, FaRegBell,
  FaStore, FaLaptop, FaUsers, FaCalendarCheck
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const InfoKajianPage = () => {
  const [kajians, setKajians] = useState([]);
  const [filteredKajians, setFilteredKajians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [filters, setFilters] = useState({
    provinsi: '',
    kota: '',
    hari: '',
    pemateri: '',
    sort: 'terbaru'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'bookmarks'
  const [userLocation, setUserLocation] = useState(null);
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // Ambil data bookmark dan preferensi notifikasi dari localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('kajianBookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    const savedNotificationPref = localStorage.getItem('notificationEnabled');
    if (savedNotificationPref) {
      setNotificationEnabled(savedNotificationPref === 'true');
    }
  }, []);

  // Simpan bookmark ke localStorage
  useEffect(() => {
    localStorage.setItem('kajianBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Fungsi untuk memeriksa apakah tanggal kajian sudah lewat
  const isEventPast = (kajian) => {
    const today = new Date();
    const eventDate = new Date(kajian.tahun, kajian.bulan - 1, kajian.tanggal);
    // Set jam menjadi 00:00:00 untuk hari ini
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  // Fungsi untuk menghapus duplikat kajian
  const removeDuplicates = (kajiansArray) => {
    const uniqueMap = new Map();
    kajiansArray.forEach(kajian => {
      const key = `${kajian.nama_kajian}-${kajian.tanggal}-${kajian.bulan}-${kajian.tahun}-${kajian.alamat_lengkap}-${kajian.pemateri}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, kajian);
      }
    });
    return Array.from(uniqueMap.values());
  };

  // Fungsi untuk mengambil data kajian dengan paginasi
  const fetchKajians = async (pageNum = 1, reset = false) => {
    setLoading(true);
    
    try {
      const itemsPerPage = 12;
      const from = (pageNum - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      let query = supabase
        .from('kajians')
        .select('*', { count: 'exact' })
        .range(from, to);
      
      // Terapkan filter
      if (filters.provinsi) {
        query = query.eq('provinsi', filters.provinsi);
      }
      if (filters.kota) {
        query = query.eq('kota', filters.kota);
      }
      if (filters.hari) {
        query = query.eq('hari', filters.hari);
      }
      if (filters.pemateri) {
        query = query.ilike('pemateri', `%${filters.pemateri}%`);
      }
      
      // Terapkan sorting
      if (filters.sort === 'terbaru') {
        query = query.order('tahun', { ascending: false })
          .order('bulan', { ascending: false })
          .order('tanggal', { ascending: false });
      } else if (filters.sort === 'terlama') {
        query = query.order('tahun', { ascending: true })
          .order('bulan', { ascending: true })
          .order('tanggal', { ascending: true });
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;

      // Hapus duplikat dan kajian yang sudah lewat
      const filteredData = (data || [])
        .filter(kajian => !isEventPast(kajian));
      
      const uniqueData = removeDuplicates(filteredData);
      
      if (reset) {
        setKajians(uniqueData);
      } else {
        setKajians(prev => [...prev, ...uniqueData]);
      }
      
      setHasMore((count || 0) > (pageNum * itemsPerPage));
      setPage(pageNum);
    } catch (error) {
      toast.error('Gagal memuat kajian: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Mengambil data awal
  useEffect(() => {
    fetchKajians(1, true);
  }, [filters]);

  // Setup real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('realtime-kajians')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'kajians'
      }, (payload) => {
        // Kirim notifikasi menggunakan Service Worker
        if ('Notification' in window && Notification.permission === 'granted') {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification('Kajian Baru Tersedia!', {
                body: `${payload.new.nama_kajian} oleh ${payload.new.pemateri}`,
                icon: payload.new.thumbnail || '/icons/icon-192x192.png'
              });
            });
          }
        }
  
        // Refresh data
        fetchKajians(1, true);
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter kajian berdasarkan pencarian dan tab aktif
  useEffect(() => {
    let filtered = kajians;
    
    // Filter berdasarkan pencarian
    if (searchQuery) {
      filtered = filtered.filter(kajian => 
        kajian.nama_kajian.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kajian.alamat_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kajian.pemateri.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kajian.kota.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter berdasarkan tab aktif
    if (activeTab === 'upcoming') {
      const today = new Date();
      filtered = filtered.filter(kajian => {
        const kajianDate = new Date(kajian.tahun, kajian.bulan - 1, kajian.tanggal);
        return kajianDate >= today;
      });
    } else if (activeTab === 'bookmarks') {
      filtered = filtered.filter(kajian => bookmarks.includes(kajian.id));
    }
    
    setFilteredKajians(filtered);
  }, [searchQuery, kajians, activeTab, bookmarks]);

  // Request permission untuk notifikasi
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifikasi diaktifkan! Anda akan mendapat pemberitahuan kajian baru.');
        setNotificationEnabled(true);
        // Simpan preferensi di localStorage
        localStorage.setItem('notificationEnabled', 'true');
      }
    }
  };

  // Format tanggal
  const formatDate = (tanggal, bulan, tahun) => {
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${tanggal} ${monthNames[bulan - 1]} ${tahun}`;
  };

  // Bookmark kajian
  const toggleBookmark = (kajianId) => {
    if (bookmarks.includes(kajianId)) {
      setBookmarks(bookmarks.filter(id => id !== kajianId));
      toast.success('Kajian dihapus dari bookmark');
    } else {
      setBookmarks([...bookmarks, kajianId]);
      toast.success('Kajian disimpan di bookmark');
    }
  };

  // Share kajian
  const shareKajian = (kajian) => {
    if (navigator.share) {
      navigator.share({
        title: kajian.nama_kajian,
        text: `Hadiri kajian ${kajian.nama_kajian} oleh ${kajian.pemateri} pada ${kajian.hari}, ${formatDate(kajian.tanggal, kajian.bulan, kajian.tahun)}`,
        url: window.location.href
      }).catch(error => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(`${kajian.nama_kajian} - ${kajian.pemateri}\n${window.location.href}`);
      toast.success('Link kajian disalin ke clipboard');
    }
  };

  // Dapatkan lokasi pengguna
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsNearbyActive(true);
          toast.success('Lokasi Anda berhasil didapatkan');
        },
        error => {
          toast.error(`Gagal mendapatkan lokasi: ${error.message}`);
        }
      );
    } else {
      toast.error('Browser tidak mendukung geolocation');
    }
  };

  // Hitung jarak
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius bumi dalam km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Jarak dalam km
  };

  // Filter kajian terdekat
  const filterNearby = () => {
    if (!userLocation) {
      getUserLocation();
      return;
    }
    
    setIsNearbyActive(!isNearbyActive);
    
    if (!isNearbyActive) {
      const kajiansWithDistance = kajians.map(kajian => {
        if (kajian.poin_map) {
          const [lng, lat] = kajian.poin_map.replace('POINT(', '').replace(')', '').split(' ').map(Number);
          const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
          return { ...kajian, distance };
        }
        return { ...kajian, distance: null };
      }).filter(kajian => kajian.distance !== null && kajian.distance < 50); // Dalam radius 50km
      
      setFilteredKajians(kajiansWithDistance.sort((a, b) => a.distance - b.distance));
    } else {
      setFilteredKajians(kajians);
    }
  };

  // Inisialisasi Intersection Observer untuk infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchKajians(page + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore, page]);

  // Daftar provinsi Indonesia
  const provinces = [
    "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", 
    "Sumatera Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung", 
    "Kepulauan Riau", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", 
    "DI Yogyakarta", "Jawa Timur", "Banten", "Bali", 
    "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", 
    "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", 
    "Kalimantan Utara", "Sulawesi Utara", "Sulawesi Tengah", 
    "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", 
    "Sulawesi Barat", "Maluku", "Maluku Utara", "Papua Barat", "Papua"
  ];

  // Daftar kota unik
  const cities = [...new Set(kajians.map(k => k.kota))].filter(Boolean);
  const days = [...new Set(kajians.map(k => k.hari))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Jadwal Kajian Terkini
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan kajian Islami terbaru di daerah Anda. Daftar lengkap kajian ustadz dan ustadzah terkenal dengan lokasi dan waktu yang jelas.
          </p>
        </motion.div>

        {/* Control Bar */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 border border-emerald-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Cari kajian, tempat, atau pemateri..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-4 text-gray-400 text-lg" />
          </div>
          
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center shadow-md whitespace-nowrap"
            >
              <FaPlus className="mr-2" />
              {showUploadForm ? 'Tutup Form' : 'Tambah Kajian'}
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 bg-white border border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 flex items-center whitespace-nowrap shadow-sm"
            >
              <FaFilter className="mr-2" /> Filter
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            className={`px-5 py-2.5 rounded-xl font-medium flex items-center ${
              activeTab === 'all' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md' 
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
            onClick={() => setActiveTab('all')}
          >
            <FaList className="mr-2" /> Semua Kajian
          </button>
          
          <button
            className={`px-5 py-2.5 rounded-xl font-medium flex items-center ${
              activeTab === 'upcoming' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md' 
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            <FaCalendarAlt className="mr-2" /> Mendatang
          </button>
          
          <button
            className={`px-5 py-2.5 rounded-xl font-medium flex items-center ${
              activeTab === 'bookmarks' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md' 
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
            onClick={() => setActiveTab('bookmarks')}
          >
            <FaBookmark className="mr-2" /> Bookmark
          </button>
          
          <button
            className={`px-5 py-2.5 rounded-xl font-medium flex items-center ${
              isNearbyActive 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md' 
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
            onClick={filterNearby}
          >
            <FaMapMarkerAlt className="mr-2" /> Dekat Saya
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-hidden border border-emerald-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-emerald-700">Filter Kajian</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Provinsi</label>
                  <select
                    value={filters.provinsi}
                    onChange={(e) => setFilters({...filters, provinsi: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Semua Provinsi</option>
                    {provinces.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Kota</label>
                  <select
                    value={filters.kota}
                    onChange={(e) => setFilters({...filters, kota: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Semua Kota</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Hari</label>
                  <select
                    value={filters.hari}
                    onChange={(e) => setFilters({...filters, hari: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Semua Hari</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Urutkan</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({...filters, sort: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="terlama">Terlama</option>
                    <option value="terdekat">Terdekat</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Pemateri</label>
                <input
                  type="text"
                  value={filters.pemateri}
                  onChange={(e) => setFilters({...filters, pemateri: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Cari nama pemateri..."
                />
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setFilters({
                    provinsi: '',
                    kota: '',
                    hari: '',
                    pemateri: '',
                    sort: 'terbaru'
                  })}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl mr-3 hover:bg-gray-100 font-medium"
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:opacity-90 font-medium shadow-md"
                >
                  Terapkan Filter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Upload Kajian */}
        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <UploadKajian 
                onUploadSuccess={() => {
                  setShowUploadForm(false);
                  requestNotificationPermission();
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Notifikasi - Hanya tampilkan jika belum diaktifkan */}
        {!notificationEnabled && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex items-start shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-emerald-100 p-3 rounded-full mr-4">
              <FaRegBell className="text-emerald-600 text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-emerald-800 text-lg mb-1">Dapatkan Notifikasi Kajian Baru!</h3>
              <p className="text-emerald-600 mb-3">
                Aktifkan notifikasi untuk mendapatkan pemberitahuan saat ada kajian baru di daerah Anda.
              </p>
              <button 
                onClick={requestNotificationPermission}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg text-sm hover:opacity-90 shadow-sm"
              >
                Aktifkan Notifikasi
              </button>
            </div>
          </motion.div>
        )}

        {/* Statistik Kajian */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
            <div className="text-2xl font-bold text-emerald-700">{kajians.length}</div>
            <div className="text-sm text-gray-500">Total Kajian</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
            <div className="text-2xl font-bold text-emerald-700">
              {[...new Set(kajians.map(k => k.pemateri))].length}
            </div>
            <div className="text-sm text-gray-500">Pemateri</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
            <div className="text-2xl font-bold text-emerald-700">
              {[...new Set(kajians.map(k => k.kota))].length}
            </div>
            <div className="text-sm text-gray-500">Kota</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
            <div className="text-2xl font-bold text-emerald-700">{bookmarks.length}</div>
            <div className="text-sm text-gray-500">Bookmark</div>
          </div>
        </div>

        {/* Daftar Kajian */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-emerald-100">
                <Skeleton height={180} />
                <div className="p-5">
                  <Skeleton count={2} height={20} />
                  <div className="mt-4 space-y-2">
                    <Skeleton width={120} height={15} />
                    <Skeleton width={150} height={15} />
                    <Skeleton width={180} height={15} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredKajians.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-emerald-100">
            <div className="inline-block bg-emerald-100 p-4 rounded-full mb-4">
              <FaSearch className="text-emerald-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada kajian ditemukan</h3>
            <p className="text-gray-500 mb-4">Coba ubah filter pencarian atau tambahkan kajian baru</p>
            <button
              onClick={() => {
                setFilters({
                  provinsi: '',
                  kota: '',
                  hari: '',
                  pemateri: '',
                  sort: 'terbaru'
                });
                setSearchQuery('');
                setIsNearbyActive(false);
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg hover:opacity-90"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKajians.map((kajian) => (
                <KajianCard 
                  key={kajian.id} 
                  kajian={kajian} 
                  bookmarks={bookmarks}
                  toggleBookmark={toggleBookmark}
                  shareKajian={shareKajian}
                  formatDate={formatDate}
                  isNearbyActive={isNearbyActive}
                />
              ))}
            </div>
            
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center my-10">
                <button 
                  onClick={() => fetchKajians(page + 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:opacity-90 flex items-center shadow-md"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memuat...
                    </>
                  ) : 'Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Komponen Kartu Kajian
const KajianCard = ({ kajian, bookmarks, toggleBookmark, shareKajian, formatDate, isNearbyActive }) => {
  const isUpcoming = () => {
    const today = new Date();
    const kajianDate = new Date(kajian.tahun, kajian.bulan - 1, kajian.tanggal);
    return kajianDate >= today;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full border border-emerald-100"
    >
      {kajian.thumbnail ? (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={kajian.thumbnail} 
            alt={kajian.nama_kajian} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentNode.innerHTML = `<div class="bg-gradient-to-r from-emerald-500 to-teal-500 w-full h-full flex items-center justify-center text-white font-bold text-xl p-4 text-center">${kajian.nama_kajian}</div>`;
            }}
          />
          <button
            onClick={() => toggleBookmark(kajian.id)}
            className={`absolute top-3 right-3 p-2 rounded-full ${
              bookmarks.includes(kajian.id)
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-500'
            }`}
          >
            <FaBookmark />
          </button>
          
          {isUpcoming() && (
            <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Akan Datang
            </div>
          )}
          
          {isNearbyActive && kajian.distance && (
            <div className="absolute bottom-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {kajian.distance.toFixed(1)} km
            </div>
          )}

          {/* Badge Tipe Acara */}
          <div className="absolute bottom-3 right-3 bg-cyan-600 text-white px-2 py-1 rounded text-xs font-medium">
            {kajian.event_type === 'online' ? 'Online' : 
             kajian.event_type === 'hybrid' ? 'Hybrid' : 'Offline'}
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center p-4">
          <h3 className="text-white font-bold text-xl text-center">{kajian.nama_kajian}</h3>
        </div>
      )}
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-emerald-800 mb-3">{kajian.nama_kajian}</h3>
          
          <div className="flex items-center mb-3">
            <FaCalendarAlt className="text-emerald-600 mr-2 flex-shrink-0" />
            <span className="font-medium">{kajian.hari}, {formatDate(kajian.tanggal, kajian.bulan, kajian.tahun)}</span>
          </div>
          
          <div className="flex items-center mb-3">
            <FaClock className="text-emerald-600 mr-2 flex-shrink-0" />
            <span>{kajian.waktu_mulai} - {kajian.waktu_akhir}</span>
          </div>
          
          <div className="flex items-start mb-3">
            <FaMapMarkerAlt className="text-emerald-600 mr-2 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">{kajian.alamat_lengkap}</p>
              <p className="text-gray-600">{kajian.kota}, {kajian.provinsi}</p>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <FaUser className="text-emerald-600 mr-2 flex-shrink-0" />
            <span className="font-medium">{kajian.pemateri}</span>
          </div>

          {/* Badge Akses Publik */}
          <div className="mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              kajian.is_public ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {kajian.is_public ? 'Terbuka untuk Umum' : 'Khusus Undangan'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
          {kajian.google_maps_link && (
            <a 
              href={kajian.google_maps_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center text-sm"
            >
              <FaMapMarkerAlt className="mr-2" /> Maps
            </a>
          )}
          
          {kajian.registration_link && (
            <a 
              href={kajian.registration_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors flex items-center text-sm"
            >
              <FaCalendarCheck className="mr-2" /> Daftar
            </a>
          )}
          
          {kajian.link_sumber && (
            <a 
              href={kajian.link_sumber} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center text-sm"
            >
              <FaGlobe className="mr-2" /> Sumber
            </a>
          )}
          
          <button
            onClick={() => shareKajian(kajian)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center text-sm"
          >
            <FaShareAlt className="mr-2" /> Bagikan
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoKajianPage;