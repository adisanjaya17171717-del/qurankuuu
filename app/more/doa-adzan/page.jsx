// app/tuntunan-sholat/doa-adzan/page.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaInfoCircle, FaBookOpen, FaShare, FaCopy } from 'react-icons/fa';

export default function DoaSetelahAdzan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tuntunan-sholat/doa-setelah-adzan');
        if (!response.ok) {
          throw new Error('Gagal memuat doa setelah adzan');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const playAudio = () => {
    if (!data) return;
    
    // Jika audio sudah ada, toggle play/pause
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
      return;
    }

    // Jika belum ada audio, buat baru
    const newAudio = new Audio(data.content.audio);
    newAudio.play();
    setAudio(newAudio);
    setIsPlaying(true);

    newAudio.onended = () => {
      setIsPlaying(false);
    };
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.metadata.title,
          text: `Pelajari doa setelah adzan: ${data.content.arabic}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <FaBookOpen className="text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-4 text-blue-600 font-medium">Memuat doa setelah adzan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-6 bg-white rounded-2xl shadow-lg max-w-md w-full"
        >
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-red-500 text-3xl">!</div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-5">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl hover:opacity-90 transition-all shadow-md font-medium"
          >
            Coba Lagi
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-16">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 rounded-b-3xl shadow-lg"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl md:text-3xl font-bold"
              >
                {data.metadata.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-blue-100 mt-2"
              >
                {data.metadata.description}
              </motion.p>
            </div>
            <div className="flex gap-2">
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={shareContent}
                className="p-2.5 bg-white/20 rounded-xl hover:bg-white/30 transition"
              >
                <FaShare />
              </motion.button>
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2.5 rounded-xl ${showInfo ? 'bg-white/30' : 'bg-white/20'} hover:bg-white/30 transition`}
              >
                <FaInfoCircle />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="bg-gradient-to-br from-white to-blue-50 mx-4 rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto border border-blue-100"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-3">
                  <FaBookOpen className="text-blue-500 flex-shrink-0" />
                  Informasi Doa
                </h3>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Penjelasan
                  </h4>
                  <p className="text-gray-600 pl-4">{data.additionalInfo.penjelasan}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                    Tata Cara
                  </h4>
                  <ul className="space-y-2 pl-6">
                    {data.additionalInfo.tataCara.map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-gray-600 relative before:content-['•'] before:absolute before:-left-4 before:text-blue-400"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Keutamaan
                  </h4>
                  <ul className="space-y-2 pl-6">
                    {data.additionalInfo.keutamaan.map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="text-gray-600 relative before:content-['•'] before:absolute before:-left-4 before:text-purple-400"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Referensi
                  </h4>
                  <ul className="space-y-1 pl-6">
                    {data.additionalInfo.referensi.map((ref, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="text-gray-600 text-sm relative before:content-['-'] before:absolute before:-left-4"
                      >
                        {ref}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                  <h4 className="text-sm font-semibold text-yellow-700 mb-2">
                    Catatan Penting
                  </h4>
                  <p className="text-yellow-600 text-sm">{data.additionalInfo.catatan}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* Arabic Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Teks Arab</h3>
                <button 
                  onClick={() => copyText(data.content.arabic)}
                  className="text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-200 transition flex items-center gap-1"
                >
                  <FaCopy size={12} /> {copied ? 'Tersalin!' : 'Salin'}
                </button>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <p className="text-2xl md:text-3xl text-right leading-relaxed font-arabic">
                  {data.content.arabic}
                </p>
              </div>
            </motion.div>

            {/* Latin Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Transliterasi Latin</h3>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <p className="text-lg text-gray-700 italic">
                  {data.content.latin}
                </p>
              </div>
            </motion.div>

            {/* Translation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Terjemahan</h3>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <p className="text-gray-700">
                  {data.content.translation}
                </p>
              </div>
            </motion.div>

            {/* Audio Player */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-5 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/20">
                    <FaPlay />
                  </div>
                  <div>
                    <h3 className="font-medium">Dengarkan Doa</h3>
                    <p className="text-blue-100 text-sm opacity-90">Putar audio bacaan doa</p>
                  </div>
                </div>
                <button
                  onClick={playAudio}
                  className={`p-4 rounded-full ${isPlaying ? 'bg-red-500 shadow-lg' : 'bg-white/20'} hover:opacity-90 transition-all flex items-center justify-center shadow-md`}
                >
                  {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                </button>
              </div>
            </motion.div>

            {/* Source */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-center text-sm text-gray-500"
            >
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}