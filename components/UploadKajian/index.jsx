'use client';
import { useState, useRef } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { 
  FaUpload, FaMapMarkerAlt, FaLink, FaCalendarAlt, 
  FaClock, FaUser, FaExclamationTriangle, FaGlobe, 
  FaTimes, FaUsers, FaLaptop, FaStore, FaCalendarCheck
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const UploadKajian = ({ onUploadSuccess }) => {
  // State untuk data form
  const [thumbnail, setThumbnail] = useState(null);
  const [namaKajian, setNamaKajian] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [kota, setKota] = useState('');
  const [hari, setHari] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState('');
  const [waktuMulai, setWaktuMulai] = useState('');
  const [pemateri, setPemateri] = useState('');
  const [linkSumber, setLinkSumber] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Fitur baru
  const [isPublic, setIsPublic] = useState(true);
  const [eventType, setEventType] = useState('offline');
  const [registrationLink, setRegistrationLink] = useState('');

  // Handler untuk upload gambar
  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file terlalu besar (maks 2MB)');
        return;
      }
      
      // Validasi tipe file
      if (!file.type.match('image.*')) {
        toast.error('Hanya file gambar yang diizinkan');
        return;
      }
      
      setThumbnail(file);
    }
  };

  // Handler untuk submit form
  const handleSubmit = async () => {
    setShowWarning(false);
    setIsUploading(true);

    try {
      // Validasi form
      if (!namaKajian || !alamatLengkap || !provinsi || !kota || !hari || !tanggal || !bulan || !tahun || !waktuMulai || !pemateri) {
        throw new Error('Semua field wajib diisi kecuali yang opsional');
      }

      // Upload gambar terlebih dahulu jika ada
      let thumbnailUrl = '';
      if (thumbnail) {
        const fileExt = thumbnail.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;
      
        const { error: uploadError } = await supabase.storage
          .from('kajian-thumbnails')
          .upload(filePath, thumbnail);
      
        if (uploadError) throw uploadError;
      
        const { data, error: publicUrlError } = supabase.storage
          .from('kajian-thumbnails')
          .getPublicUrl(filePath);
      
        if (publicUrlError) throw publicUrlError;
      
        thumbnailUrl = data.publicUrl;
      }

      // Ekstrak koordinat dari Google Maps link jika ada
      let coordinates = null;
      if (googleMapsLink) {
        const match = googleMapsLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match && match.length === 3) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          if (!isNaN(lat) && !isNaN(lng)) {
            coordinates = `POINT(${lng} ${lat})`;
          }
        }
      }

      // Simpan data kajian ke tabel 'kajians'
      const { error } = await supabase.from('kajians').insert([
        {
          nama_kajian: namaKajian,
          alamat_lengkap: alamatLengkap,
          provinsi,
          kota,
          hari,
          tanggal: parseInt(tanggal),
          bulan: parseInt(bulan),
          tahun: parseInt(tahun),
          waktu_mulai: waktuMulai,
          waktu_akhir: 'Sampai dengan selesai',
          pemateri,
          link_sumber: linkSumber,
          thumbnail: thumbnailUrl,
          google_maps_link: googleMapsLink,
          poin_map: coordinates,
          // Fitur baru
          is_public: isPublic,
          event_type: eventType,
          registration_link: registrationLink
        },
      ]);

      if (error) throw error;

      toast.success('Kajian berhasil diupload!');
      
      // Reset form
      setThumbnail(null);
      setNamaKajian('');
      setAlamatLengkap('');
      setProvinsi('');
      setKota('');
      setHari('');
      setTanggal('');
      setBulan('');
      setTahun('');
      setWaktuMulai('');
      setPemateri('');
      setLinkSumber('');
      setGoogleMapsLink('');
      setIsPublic(true);
      setEventType('offline');
      setRegistrationLink('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Panggil callback jika ada
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error(`Gagal mengupload kajian: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl border border-emerald-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-700 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Upload Kajian Baru
        </h2>
        <button 
          onClick={() => onUploadSuccess && onUploadSuccess()}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>
      
      {/* Popup Peringatan */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-emerald-200 shadow-2xl"
          >
            <div className="flex items-center mb-4">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <FaExclamationTriangle className="text-amber-500 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Peringatan Penting</h3>
            </div>
            <p className="mb-4 text-gray-600">
              Pastikan informasi yang Anda upload akurat dan valid. Mengupload informasi palsu adalah 
              perbuatan dosa dan Anda akan menanggung konsekuensinya di akhirat.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                Batal
              </button>
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium shadow-md"
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengupload...
                  </span>
                ) : 'Saya Mengerti, Lanjutkan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <form onSubmit={(e) => {
        e.preventDefault();
        setShowWarning(true);
      }}>
        {/* Input Thumbnail */}
        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-3">Thumbnail Kajian</label>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-emerald-300 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors overflow-hidden relative">
                {thumbnail ? (
                  <>
                    <img 
                      src={URL.createObjectURL(thumbnail)} 
                      alt="Thumbnail preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                      <span className="bg-emerald-500 px-3 py-1 rounded-lg">Ganti Gambar</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-emerald-400 p-4">
                    <FaUpload className="text-3xl mb-3" />
                    <span className="text-center">
                      <span className="font-medium text-emerald-600 block">Upload Thumbnail</span>
                      <span className="text-sm block mt-1">Format: JPG, PNG (max 2MB)</span>
                    </span>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleThumbnailChange}
                  ref={fileInputRef}
                  accept="image/*"
                />
              </label>
            </div>
            <div className="flex-grow">
              <div className="bg-emerald-50 rounded-xl p-4 h-full">
                <h4 className="font-medium text-emerald-700 mb-2">Tips Thumbnail yang Baik</h4>
                <ul className="text-sm text-emerald-600 space-y-1">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-emerald-500 rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5">✓</span>
                    Gunakan gambar dengan rasio 16:9
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-emerald-500 rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5">✓</span>
                    Pastikan teks jelas terbaca
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-emerald-500 rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5">✓</span>
                    Hindari gambar yang terlalu ramai
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-emerald-500 rounded-full text-white text-xs flex items-center justify-center mr-2 mt-0.5">✓</span>
                    Gunakan warna yang kontras dengan tema Islami
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Informasi Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Input Nama Kajian */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Nama Kajian *</label>
            <input
              type="text"
              value={namaKajian}
              onChange={(e) => setNamaKajian(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Nama kajian"
              required
            />
          </div>
          
          {/* Input Alamat Lengkap */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-emerald-600" /> Alamat Lengkap *
            </label>
            <textarea
              value={alamatLengkap}
              onChange={(e) => setAlamatLengkap(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Masukkan alamat lengkap tempat kajian"
              rows="3"
              required
            />
          </div>
          
          {/* Input Provinsi */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Provinsi *</label>
            <select
              value={provinsi}
              onChange={(e) => setProvinsi(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
          
          {/* Input Kota */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Kota/Kabupaten *</label>
            <input
              type="text"
              value={kota}
              onChange={(e) => setKota(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Kota/Kabupaten"
              required
            />
          </div>
          
          {/* Input Pemateri */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <FaUser className="mr-2 text-emerald-600" /> Pemateri (Ustadz/Ustadzah) *
            </label>
            <input
              type="text"
              value={pemateri}
              onChange={(e) => setPemateri(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Nama pemateri"
              required
            />
          </div>
          
          {/* Input Google Maps Link */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <FaGlobe className="mr-2 text-emerald-600" /> Link Google Maps
            </label>
            <input
              type="url"
              value={googleMapsLink}
              onChange={(e) => setGoogleMapsLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>

        {/* Fitur Baru: Tipe Acara dan Akses Publik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Tipe Acara */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Tipe Acara *</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setEventType('offline')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border ${
                  eventType === 'offline' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaStore className="text-xl mb-2" />
                <span>Offline</span>
              </button>
              
              <button
                type="button"
                onClick={() => setEventType('online')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border ${
                  eventType === 'online' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaLaptop className="text-xl mb-2" />
                <span>Online</span>
              </button>
              
              <button
                type="button"
                onClick={() => setEventType('hybrid')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border ${
                  eventType === 'hybrid' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-2">
                  <FaStore className="text-xs mr-1" />
                  <FaStore className="text-xs" />
                  <FaLaptop className="text-xs ml-1" />
                </div>
                <span>Hybrid</span>
              </button>
            </div>
          </div>
          
          {/* Akses Publik */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Akses Publik</label>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex items-center p-4 rounded-xl border ${
                  isPublic 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaUsers className="text-xl mr-3" />
                <div>
                  <div className="font-medium">Terbuka untuk Umum</div>
                  <div className="text-sm text-gray-500">Semua orang dapat menghadiri</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex items-center p-4 rounded-xl border ${
                  !isPublic 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <FaUsers className="text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">Khusus Undangan</div>
                  <div className="text-sm text-gray-500">Hanya untuk peserta tertentu</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Fitur Baru: Link Pendaftaran */}
        {isPublic && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <FaCalendarCheck className="mr-2 text-emerald-600" /> Link Pendaftaran (Opsional)
            </label>
            <input
              type="url"
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="https://..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Tautan untuk pendaftaran jika diperlukan (Google Form, Eventbrite, dll)
            </p>
          </div>
        )}

        {/* Grid Tanggal & Waktu */}
        <div className="bg-emerald-50 rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2" /> Waktu Pelaksanaan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Input Hari */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Hari *</label>
              <select
                value={hari}
                onChange={(e) => setHari(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Hari</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>

            {/* Input Tanggal */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tanggal *</label>
              <input
                type="number"
                min="1"
                max="31"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Tanggal"
                required
              />
            </div>

            {/* Input Bulan */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Bulan *</label>
              <select
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Bulan</option>
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>

            {/* Input Tahun */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tahun *</label>
              <input
                type="number"
                min="2023"
                max="2100"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Tahun"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <FaClock className="mr-2 text-emerald-600" /> Waktu Mulai *
            </label>
            <div className="flex items-center">
              <input
                type="time"
                value={waktuMulai}
                onChange={(e) => setWaktuMulai(e.target.value)}
                className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <span className="ml-4 text-emerald-600 font-medium">Sampai dengan selesai</span>
            </div>
          </div>
        </div>

        {/* Input Link Sumber */}
        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-2 flex items-center">
            <FaLink className="mr-2 text-emerald-600" /> Link Sumber (Optional)
          </label>
          <input
            type="url"
            value={linkSumber}
            onChange={(e) => setLinkSumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="https://..."
          />
          <p className="text-sm text-gray-500 mt-2">
            Tautan ke sumber informasi tambahan seperti YouTube, Instagram, atau website
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="reset"
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-medium"
            onClick={() => {
              setThumbnail(null);
              setNamaKajian('');
              setAlamatLengkap('');
              setProvinsi('');
              setKota('');
              setHari('');
              setTanggal('');
              setBulan('');
              setTahun('');
              setWaktuMulai('');
              setPemateri('');
              setLinkSumber('');
              setGoogleMapsLink('');
              setIsPublic(true);
              setEventType('offline');
              setRegistrationLink('');
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium shadow-md flex items-center justify-center"
            disabled={isUploading}
          >
            <FaUpload className="mr-2" />
            {isUploading ? 'Mengupload Kajian...' : 'Upload Kajian'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadKajian;