// app/tuntunan-sholat/adzan/page.jsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaBookOpen, FaInfoCircle, FaStepForward } from 'react-icons/fa';

export default function AdzanPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tuntunan-sholat/adzan');
        if (!response.ok) {
          throw new Error('Gagal memuat data');
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

  const playAudio = (audioSrc, id) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = new Audio(audioSrc);
    audio.play();
    setCurrentAudio(audio);
    setIsPlaying(true);
    setActiveItem(id);

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
      setActiveItem(null);
    };
  };

  const toggleFullAudio = () => {
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      setActiveItem(null);
    } else {
      playAudio(data.fullAudio, 'full');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <FaVolumeUp className="text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-4 text-blue-600 font-medium">Memuat tuntunan adzan...</p>
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
        className="bg-gradient-to-r from-blue-600 to-teal-500 text-white pt-10 pb-8 px-4 rounded-b-3xl shadow-lg"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold font-serif"
              >
                {data.metadata.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-blue-100 mt-2 max-w-xl"
              >
                {data.metadata.description}
              </motion.p>
            </div>
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowInfo(!showInfo)}
              className={`p-3 rounded-xl ${showInfo ? 'bg-white/30' : 'bg-white/20'} hover:bg-white/30 transition`}
            >
              <FaInfoCircle className="text-xl" />
            </motion.button>
          </div>

          {/* Full Audio Player */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`mt-8 bg-white/10 backdrop-blur-sm p-5 rounded-2xl border-2 ${activeItem === 'full' ? 'border-white' : 'border-transparent'} transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${activeItem === 'full' ? 'bg-white/20' : 'bg-white/10'}`}>
                  <FaVolumeUp className="text-xl" />
                </div>
                <div>
                  <h3 className="font-medium">Adzan Lengkap</h3>
                  <p className="text-blue-100 text-sm opacity-80">Dengarkan seluruh bacaan adzan</p>
                </div>
              </div>
              <button
                onClick={toggleFullAudio}
                className={`p-4 rounded-full ${activeItem === 'full' ? 'bg-red-500 shadow-lg' : 'bg-blue-500'} hover:opacity-90 transition-all flex items-center justify-center shadow-md`}
              >
                {activeItem === 'full' ? <FaPause /> : <FaPlay className="ml-1" />}
              </button>
            </div>
          </motion.div>
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
                  Panduan & Informasi
                </h3>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Catatan Penting
                  </h4>
                  <ul className="space-y-2 pl-6">
                    {data.additionalInfo.notes.map((note, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-gray-600 relative before:content-['•'] before:absolute before:-left-4 before:text-blue-400"
                      >
                        {note}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                    Sumber Referensi
                  </h4>
                  <ul className="space-y-1 pl-6">
                    {data.additionalInfo.references.map((ref, index) => (
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-100">
              {data.content.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`p-6 transition-all ${activeItem === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="flex items-start gap-4 w-full">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                        activeItem === item.id 
                          ? 'bg-gradient-to-br from-blue-500 to-teal-500 text-white shadow-md' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start gap-4">
                          <div className="w-full">
                            <h3 className="font-bold text-gray-800 text-xl mb-3 text-right font-arabic leading-relaxed">
                              {item.arabic}
                            </h3>
                            <div className="bg-gray-100 p-4 rounded-xl mb-3">
                              <p className="text-gray-700 font-medium text-lg">{item.latin}</p>
                              <p className="text-gray-600 mt-2">{item.translation}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                            Diulang {item.repetition} kali
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => playAudio(item.audio, item.id)}
                              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                activeItem === item.id 
                                  ? 'bg-gradient-to-br from-blue-500 to-teal-500 text-white shadow-lg'
                                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              }`}
                            >
                              {activeItem === item.id ? <FaPause /> : <FaPlay className="ml-1" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}