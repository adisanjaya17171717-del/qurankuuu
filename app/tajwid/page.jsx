'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuran, FaSearch, FaArrowLeft, FaBook, FaInfoCircle, FaVolumeUp, FaStar, FaLightbulb } from 'react-icons/fa';

const TajwidPage = () => {
  const [tajwidData, setTajwidData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for quiz functionality
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tajwid');
        const data = await response.json();
        setTajwidData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tajwid data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = tajwidData.filter(category => {
    if (searchTerm === '') return true;
    
    const categoryMatch = category.title.toLowerCase().includes(searchTerm.toLowerCase());
    const ruleMatch = category.rules.some(rule => 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return categoryMatch || ruleMatch;
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  
  const generateQuiz = async () => {
    setQuizLoading(true);
    setQuizFeedback('');
    setUserAnswer('');
    setQuizQuestion(null);
  
    try {
      // Ambil aturan tajwid acak
      const randomCategory = tajwidData[Math.floor(Math.random() * tajwidData.length)];
      const randomRule = randomCategory.rules[Math.floor(Math.random() * randomCategory.rules.length)];
  
      const prompt = `Buatkan satu soal pilihan ganda tentang ilmu tajwid khususnya tentang "${randomRule.name}" 
  dengan penjelasan "${randomRule.description}". Berikan 4 opsi jawaban dimana hanya satu yang benar PASTIKAN JAWABAN BENARNYA RANDOM BISA A, B, C, ATAU D. 
  Format response harus JSON murni tanpa teks tambahan: {
    "question": "pertanyaan",
    "options": ["A. opsi1", "B. opsi2", "C. opsi3", "D. opsi4"],
    "correctAnswer": "A"
  }`;
  
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-8b-instruct:free",
          messages: [{ role: "user", content: prompt }]
        })
      });
  
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
  
      if (!content) {
        throw new Error("Tidak ada konten yang diterima dari AI.");
      }
  
      let quizData;
  
      try {
        // Ekstrak JSON string dari text AI (menghindari teks tambahan)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          quizData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Format respons AI tidak berisi JSON yang valid.");
        }
  
        // Validasi struktur JSON
        const isValid = quizData &&
          typeof quizData.question === 'string' &&
          Array.isArray(quizData.options) &&
          typeof quizData.correctAnswer === 'string';
  
        if (!isValid) {
          throw new Error("Struktur data soal tidak lengkap.");
        }
  
        setQuizQuestion(quizData);
        setShowQuiz(true);
  
      } catch (parseError) {
        console.error('Error parsing quiz JSON:', parseError);
        throw new Error('Gagal memproses soal dari AI.');
      }
  
    } catch (error) {
      console.error('Error generating quiz:', error);
      setQuizFeedback(error.message || 'Gagal membuat soal. Silakan coba lagi.');
    } finally {
      setQuizLoading(false);
    }
  };

  // Check user answer
  const checkAnswer = () => {
    if (!quizQuestion) return;
    
    setIsChecking(true);
    const userChoice = userAnswer.trim().toUpperCase();
    
    if (userChoice === quizQuestion.correctAnswer) {
      setQuizFeedback('Jawaban Anda benar! 🎉');
      setQuizScore(prev => prev + 1);
    } else {
      setQuizFeedback(`Jawaban salah. Yang benar adalah ${quizQuestion.correctAnswer}`);
    }
    
    setQuizCount(prev => prev + 1);
    setTimeout(() => setIsChecking(false), 3000);
  };

  // Reset quiz
  const resetQuiz = () => {
    setShowQuiz(false);
    setQuizQuestion(null);
    setUserAnswer('');
    setQuizFeedback('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FaQuran className="text-6xl text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-700 text-xl font-medium">Memuat ilmu tajwid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white py-6 px-4 md:px-8 shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <FaQuran className="text-3xl text-emerald-600 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Belajar Tajwid Al-Qur'an
            </h1>
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari hukum tajwid..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white border border-gray-200"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Quiz Card - Added at the top */}
      {!selectedCategory && !selectedRule && !showQuiz && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <FaLightbulb className="text-xl mr-2" />
                  <h2 className="text-xl md:text-2xl font-bold">Uji Pemahaman Tajwid</h2>
                </div>
                <p className="max-w-xl">Latih pengetahuan tajwid Anda dengan soal interaktif</p>
              </div>
              <button 
                onClick={generateQuiz}
                disabled={quizLoading}
                className="bg-white text-emerald-700 hover:bg-gray-100 px-5 py-2 rounded-full font-semibold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {quizLoading ? 'Membuat soal...' : 'Mulai Latihan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Breadcrumb */}
      {(selectedCategory || selectedRule || showQuiz) && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
          <div className="flex items-center text-gray-500 text-sm">
            <button 
              onClick={() => {
                if (selectedRule) setSelectedRule(null);
                else if (selectedCategory) setSelectedCategory(null);
                else if (showQuiz) resetQuiz();
              }}
              className="flex items-center hover:text-emerald-600"
            >
              <FaArrowLeft className="mr-1" /> Kembali
            </button>
            <span className="mx-2">/</span>
            {selectedCategory && !selectedRule && !showQuiz && (
              <span className="font-medium text-emerald-600">{selectedCategory.title}</span>
            )}
            {selectedRule && !showQuiz && (
              <span className="font-medium text-emerald-600">{selectedRule.name}</span>
            )}
            {showQuiz && (
              <span className="font-medium text-emerald-600">Latihan Soal</span>
            )}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {showQuiz ? (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Latihan Tajwid</h2>
                <p className="text-gray-500">Uji pengetahuan tajwid Anda</p>
                <div className="mt-2 text-sm bg-emerald-50 text-emerald-700 inline-block px-3 py-1 rounded-full">
                  Skor: {quizScore}/{quizCount}
                </div>
              </div>
            </div>
            
            {quizLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p>Sedang membuat soal...</p>
              </div>
            ) : quizFeedback && !quizQuestion ? (
              <div className="text-center py-10">
                <div className="bg-red-50 text-red-700 p-6 rounded-xl mb-6">
                  {quizFeedback}
                </div>
                <button
                  onClick={generateQuiz}
                  className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            ) : quizQuestion ? (
              <>
                <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{quizQuestion.question}</h3>
                  
                  <div className="space-y-3">
                    {quizQuestion.options.map((option, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                          userAnswer === option.split('.')[0] 
                            ? isChecking 
                              ? (userAnswer === quizQuestion.correctAnswer 
                                  ? 'border-emerald-500 bg-emerald-50' 
                                  : 'border-red-500 bg-red-50')
                              : 'border-emerald-300'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => !isChecking && setUserAnswer(option.split('.')[0])}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
                
                {quizFeedback && (
                  <div className={`p-4 rounded-xl mb-6 ${
                    quizFeedback.includes('benar') 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {quizFeedback}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={generateQuiz}
                    disabled={isChecking}
                    className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-5 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    Soal Baru
                  </button>
                  
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer || isChecking}
                    className={`flex-1 px-5 py-3 rounded-xl font-semibold transition-colors ${
                      userAnswer && !isChecking
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isChecking ? 'Memeriksa...' : 'Periksa Jawaban'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>Tidak ada soal tersedia</p>
              </div>
            )}
          </div>
        ) : !selectedCategory ? (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Kategori Hukum Tajwid</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pelajari berbagai hukum tajwid dalam Al-Qur'an untuk memperbaiki bacaan Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((category, index) => (
                <motion.div
                  key={category.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all"
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                        <FaBook className="text-xl text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{category.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-3 flex items-center">
                            <FaVolumeUp className="mr-1" /> {category.rules.length} hukum
                          </span>
                          <span className="flex items-center">
                            <FaStar className="mr-1 text-yellow-500" /> Penting
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : !selectedRule ? (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="mr-3 p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                >
                  <FaArrowLeft />
                </button>
                {selectedCategory.title}
              </h2>
              <p className="text-gray-600 max-w-2xl">
                {selectedCategory.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedCategory.rules.map((rule, index) => (
                <motion.div
                  key={rule.name}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all"
                  onClick={() => setSelectedRule(rule)}
                >
                  <div className="flex items-start mb-4">
                    <div className="bg-emerald-100 p-2 rounded-lg mr-4">
                      <FaInfoCircle className="text-lg text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{rule.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{rule.description}</p>
                  
                  {rule.letters && rule.letters.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-500 text-sm mb-2">Huruf terkait:</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(rule.letters[0]) ? (
                          rule.letters.map((group, idx) => (
                            <div key={idx} className="flex gap-2">
                              {group.map((letter, i) => (
                                <span 
                                  key={i} 
                                  className="bg-emerald-100 text-emerald-700 font-arabic text-xl w-10 h-10 rounded-full flex items-center justify-center"
                                >
                                  {letter}
                                </span>
                              ))}
                            </div>
                          ))
                        ) : (
                          rule.letters.map((letter, idx) => (
                            <span 
                              key={idx} 
                              className="bg-emerald-100 text-emerald-700 font-arabic text-xl w-10 h-10 rounded-full flex items-center justify-center"
                            >
                              {letter}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 flex items-center">
                    <span>Klik untuk detail →</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <button 
                  onClick={() => setSelectedRule(null)}
                  className="flex items-center text-gray-500 hover:text-emerald-600 mb-4"
                >
                  <FaArrowLeft className="mr-2" /> Kembali
                </button>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{selectedRule.name}</h2>
                <p className="text-gray-500 mt-1">{selectedCategory.title}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <FaInfoCircle className="text-2xl text-emerald-600" />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-emerald-600 mb-3">Penjelasan</h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedRule.description}
              </p>
            </div>
            
            {selectedRule.letters && selectedRule.letters.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-emerald-600 mb-4">Huruf Terkait</h3>
                <div className="flex flex-wrap gap-4">
                  {Array.isArray(selectedRule.letters[0]) ? (
                    selectedRule.letters.map((group, idx) => (
                      <div key={idx} className="mb-4">
                        <div className="flex gap-3 mb-2">
                          {group.map((letter, i) => (
                            <div 
                              key={i} 
                              className="relative bg-emerald-50 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border border-emerald-100"
                            >
                              <span className="font-arabic text-3xl text-emerald-700">{letter}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    selectedRule.letters.map((letter, idx) => (
                      <div 
                        key={idx} 
                        className="relative bg-emerald-50 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border border-emerald-100"
                      >
                        <span className="font-arabic text-3xl text-emerald-700">{letter}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {selectedRule.examples && selectedRule.examples.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-emerald-600 mb-4">Contoh Bacaan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRule.examples.map((example, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                    >
                      <div className="font-arabic text-3xl text-right text-emerald-700 mb-3 leading-relaxed">
                        {example}
                      </div>
                      <div className="text-gray-500 text-sm">
                        Contoh penerapan {selectedRule.name.toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedRule.conditions && selectedRule.conditions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 mb-4">Kondisi Terjadinya</h3>
                <ul className="space-y-3">
                  {selectedRule.conditions.map((condition, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700">{condition}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default TajwidPage;