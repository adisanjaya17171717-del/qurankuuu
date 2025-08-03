// app/surah/[nomor]/page.jsx
'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaBookmark, FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import { IoMdBookmark, IoMdBookmarks } from 'react-icons/io';

export default function SurahDetailPage({ params }) {
  const { nomor } = use(params);
  const router = useRouter();
  const [surah, setSurah] = useState(null);
  const [currentAyat, setCurrentAyat] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [qari, setQari] = useState('05');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [bookmarkedAyats, setBookmarkedAyats] = useState({});
  const ayatRef = useRef(null);

  // Initialize bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quranBookmarks');
    if (savedBookmarks) {
      setBookmarkedAyats(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save reading history
  const saveReadingHistory = (surahNumber, ayatNumber) => {
    const history = JSON.parse(localStorage.getItem('quranReadingHistory') || '[]');
    const newHistory = history.filter(item => 
      !(item.surah === surahNumber && item.ayat === ayatNumber)
    );
    
    newHistory.unshift({
      surah: surahNumber,
      ayat: ayatNumber,
      timestamp: new Date().toISOString(),
      surahName: surah?.namaLatin || `Surah ${surahNumber}`,
      ayatCount: surah?.jumlahAyat || 0
    });
    
    localStorage.setItem('quranReadingHistory', JSON.stringify(newHistory.slice(0, 10)));
  };

  // Toggle bookmark
  const toggleBookmark = (ayatNumber) => {
    const newBookmarks = { ...bookmarkedAyats };
    
    if (newBookmarks[nomor] && newBookmarks[nomor].includes(ayatNumber)) {
      newBookmarks[nomor] = newBookmarks[nomor].filter(a => a !== ayatNumber);
      if (newBookmarks[nomor].length === 0) {
        delete newBookmarks[nomor];
      }
    } else {
      if (!newBookmarks[nomor]) {
        newBookmarks[nomor] = [];
      }
      newBookmarks[nomor].push(ayatNumber);
    }
    
    setBookmarkedAyats(newBookmarks);
    localStorage.setItem('quranBookmarks', JSON.stringify(newBookmarks));
  };

  // Fetch surah data
  useEffect(() => {
    const fetchSurahData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
        const data = await response.json();
        setSurah(data.data);
        
        const history = JSON.parse(localStorage.getItem('quranReadingHistory') || '[]');
        const lastRead = history.find(item => item.surah === parseInt(nomor));
        
        if (lastRead) {
          setCurrentAyat(lastRead.ayat);
        }
      } catch (error) {
        console.error('Error fetching surah data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurahData();
  }, [nomor]);

  // Navigate to ayat
  const goToAyat = (ayatNumber) => {
    setCurrentAyat(ayatNumber);
    saveReadingHistory(parseInt(nomor), ayatNumber);
    
    // Scroll to ayat container after state update
    setTimeout(() => {
      if (ayatRef.current) {
        ayatRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 0);
  };

  // Navigate to previous/next surah
  const navigateToSurah = (surahNumber) => {
    saveReadingHistory(parseInt(nomor), currentAyat);
    router.push(`/surah/${surahNumber}`);
  };

  // Play/pause audio
  const toggleAudio = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-200 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-emerald-100 flex items-center justify-center">
              <FaBookmark className="text-emerald-500 text-2xl" />
            </div>
          </div>
          <p className="text-emerald-700 font-medium">Memuat surah...</p>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Surah tidak ditemukan</h2>
          <p className="text-gray-600 mb-6">Maaf, surah yang Anda cari tidak ditemukan. Silakan kembali ke daftar surah.</p>
          <Link href="/" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-full transition-colors">
            Kembali ke Daftar Surah
          </Link>
        </div>
      </div>
    );
  }

  const currentAyatData = surah.ayat.find(ayat => ayat.nomorAyat === currentAyat);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/" 
            className="flex items-center text-emerald-700 hover:text-emerald-900 font-medium group"
          >
            <FaArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> 
            <span>Daftar Surah</span>
          </Link>
          
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <IoMdBookmarks className="text-emerald-600" />
            <span className="font-medium text-emerald-700">
              Ayat {currentAyat} dari {surah.jumlahAyat}
            </span>
          </div>
        </div>

        {/* Surah Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl shadow-xl p-6 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <p className="font-arabic text-9xl">{surah.nama}</p>
          </div>
          
          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-bold">{surah.namaLatin}</h1>
            <p className="font-arabic text-5xl mt-3">{surah.nama}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <span className="bg-white/20 py-1 px-3 rounded-full text-sm">{surah.arti}</span>
              <span className="bg-white/20 py-1 px-3 rounded-full text-sm">{surah.tempatTurin}</span>
              <span className="bg-white/20 py-1 px-3 rounded-full text-sm">{surah.jumlahAyat} Ayat</span>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaVolumeUp className="text-emerald-600 mr-2" />
              <span className="font-medium text-gray-700">Qari {qari}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {Object.keys(surah.audioFull).map(qariId => (
                <button
                  key={qariId}
                  onClick={() => setQari(qariId)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    qari === qariId
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {qariId}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex items-center">
            <button 
              onClick={toggleAudio}
              className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors"
            >
              {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
            </button>
            
            <div className="ml-4 flex-1">
              <audio 
                ref={el => {
                  if (el && !audioElement) {
                    setAudioElement(el);
                    el.addEventListener('ended', () => setIsPlaying(false));
                  }
                }}
                className="w-full"
                src={surah.audioFull[qari]}
              />
              
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <span>{isPlaying ? "Sedang diputar..." : "Dengarkan seluruh surah"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Ayat Display */}
        <div ref={ayatRef} className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-emerald-100 relative">
          <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
            <span className="font-bold text-white">{currentAyatData.nomorAyat}</span>
          </div>
          
          <button 
            onClick={() => toggleBookmark(currentAyat)}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${
              bookmarkedAyats[nomor]?.includes(currentAyat)
                ? 'text-amber-500 bg-amber-50'
                : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
            }`}
          >
            <IoMdBookmark className="text-xl" />
          </button>
          
          <div className="p-6 pt-16">
            <div className="mb-6">
              <p className="font-arabic text-3xl text-right leading-loose text-emerald-800">
                {currentAyatData.teksArab}
              </p>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-4 mb-6">
              <p className="text-emerald-700 italic font-medium mb-3">{currentAyatData.teksLatin}</p>
              <p className="text-gray-800">{currentAyatData.teksIndonesia}</p>
            </div>
            
            <div className="mt-6">
              <audio 
                controls 
                className="w-full"
                src={currentAyatData.audio[qari]}
              />
            </div>
          </div>
        </div>

        {/* Ayat Navigation */}
        <div className="flex justify-between mb-8">
          <button
            onClick={() => goToAyat(currentAyat - 1)}
            disabled={currentAyat <= 1}
            className={`flex items-center px-5 py-3 rounded-xl ${
              currentAyat <= 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90'
            }`}
          >
            <FaArrowLeft className="mr-2" /> Prev Ayat
          </button>
          
          <button
            onClick={() => goToAyat(currentAyat + 1)}
            disabled={currentAyat >= surah.jumlahAyat}
            className={`flex items-center px-5 py-3 rounded-xl ${
              currentAyat >= surah.jumlahAyat
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90'
            }`}
          >
           Next Ayat <FaArrowRight className="ml-2" />
          </button>
        </div>

        {/* Ayat Quick Navigation */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">Navigasi Ayat:</h3>
            <span className="text-sm text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              {currentAyat} dari {surah.jumlahAyat}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: surah.jumlahAyat }, (_, i) => i + 1).map(ayatNum => (
              <button
                key={ayatNum}
                onClick={() => goToAyat(ayatNum)}
                className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl text-sm ${
                  currentAyat === ayatNum
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                } relative`}
              >
                {ayatNum}
                {bookmarkedAyats[nomor]?.includes(ayatNum) && (
                  <span className="absolute -top-1 -right-1 text-amber-500">
                    <IoMdBookmark />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Surah Navigation */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-bold text-gray-700 mb-4 text-center">Navigasi Surah:</h3>
          <div className="flex justify-between gap-4">
            {surah.suratSebelumnya && (
              <button
                onClick={() => navigateToSurah(surah.suratSebelumnya.nomor)}
                className="flex-1 flex items-center justify-center p-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-xl hover:from-emerald-200 hover:to-teal-200 transition-all group"
              >
                <FaArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> 
                <div className="text-left">
                  <div className="text-xs text-emerald-500">Surah Sebelumnya</div>
                  <div className="font-medium truncate max-w-[120px]">
                    {surah.suratSebelumnya.nomor}. {surah.suratSebelumnya.namaLatin}
                  </div>
                </div>
              </button>
            )}
            
            {surah.suratSelanjutnya && (
              <button
                onClick={() => navigateToSurah(surah.suratSelanjutnya.nomor)}
                className="flex-1 flex items-center justify-center p-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-xl hover:from-emerald-200 hover:to-teal-200 transition-all group"
              >
                <div className="text-right">
                  <div className="text-xs text-emerald-500">Surah Selanjutnya</div>
                  <div className="font-medium truncate max-w-[120px]">
                    {surah.suratSelanjutnya.nomor}. {surah.suratSelanjutnya.namaLatin}
                  </div>
                </div>
                <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}