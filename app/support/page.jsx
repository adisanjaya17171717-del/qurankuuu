// app/support/page.jsx
"use client"
import Image from "next/image";
import { motion } from "framer-motion";

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-25 to-blue-75 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Animated Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Dukung Perjalanan DevNova-ID
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-light">
            Bantu kami terus berkarya dan menyediakan konten bermanfaat bagi komunitas
          </p>
        </motion.div>

        {/* Main Card - Modern Glassmorphism */}
        <motion.div 
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/60"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Animated Ko-fi Illustration */}
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ rotate: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl p-6 shadow-inner">
                  <Image 
                    src="/icons/Ko-fi bean.gif" 
                    alt="Ko-fi" 
                    width={140} 
                    height={140}
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </motion.div>
              
              {/* Support Content */}
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Dukungan Anda Menjadi <span className="text-blue-600">Bahan Bakar</span> Kami
                </h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100/50 shadow-sm">
                  <p className="text-blue-800 text-sm font-medium flex items-start">
                    <span className="mr-2 text-blue-500 text-lg">🎯</span>
                    Donasi ini ditujukan untuk mendukung DevNova-ID secara keseluruhan dan digunakan untuk berbagai kebutuhan tim, tidak hanya fokus pada pengembangan aplikasi.
                  </p>
                </div>
                
                <p className="text-gray-700 mb-6 font-medium">
                  Kontribusi Anda membantu kami dalam:
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Menutupi biaya operasional tim",
                    "Pemeliharaan infrastruktur dan server",
                    "Produksi konten edukasi dan sumber daya gratis",
                    "Kegiatan komunitas dan event",
                    "Pengembangan diri anggota tim"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.a 
                  href="https://ko-fi.com/devnova_id" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-[#29ABE0] to-[#1f7de1] hover:from-[#238fc7] hover:to-[#1a6bc0] transition-all duration-300 shadow-lg hover:shadow-xl group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Image 
                    src="https://storage.ko-fi.com/cdn/cup-border.png" 
                    alt="Ko-fi cup" 
                    width={28} 
                    height={28}
                    className="mr-3 transition-transform group-hover:rotate-[-10deg]"
                  />
                  <span className="font-semibold tracking-wide">Dukung Kami di Ko-fi</span>
                </motion.a>
              </div>
            </div>
          </div>
          
          {/* Payment Info - Modern Styled */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t border-gray-200/50">
            <div className="flex items-center text-gray-700">
              <div className="mr-3 flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Donasi aman diproses melalui Ko-fi dengan berbagai metode pembayaran</span>
            </div>
          </div>
        </motion.div>
        
        {/* Support Note - Modern Card */}
        <motion.div 
          className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-lg p-6 max-w-2xl mx-auto border border-white/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-start">
            <div className="mr-4 flex-shrink-0 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14.857v3.714a2.143 2.143 0 01-2.143 2.143H5.143A2.143 2.143 0 013 18.571v-3.857m16 0v-3a2.143 2.143 0 00-2.143-2.143H5.143A2.143 2.143 0 003 11v3.857m16 0V9.143C19 5.154 15.866 2 12 2s-7 3.154-7 7.143v2.714" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">Tentang Dukungan Anda</h3>
              <p className="text-gray-700 mb-4">
                Setiap kontribusi yang Anda berikan akan digunakan secara fleksibel untuk mendukung keberlangsungan DevNova-ID. Dana akan dialokasikan untuk:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  "Biaya operasional harian",
                  "Pembuatan konten edukasi",
                  "Pengembangan kapasitas tim",
                  "Aktivitas komunitas",
                  "Proyek open-source"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-lg p-4 border border-indigo-200/50">
                <p className="text-indigo-900 text-sm font-medium italic">
                  "Kami sangat menghargai setiap bentuk dukungan yang diberikan dan berkomitmen untuk menggunakan dana dengan bijak."
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Elements for Visual Interest */}
        <div className="fixed top-20 -left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="fixed bottom-10 -right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
};

export default SupportPage;