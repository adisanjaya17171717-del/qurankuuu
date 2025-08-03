"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaMosque, FaPrayingHands, FaBell } from "react-icons/fa";

export default function MorePage() {
  const features = [
    {
      title: "Adzan",
      description: "Lafadz Adzan dengan audio yang merdu",
      icon: <FaMosque className="text-4xl text-blue-400" />,
      path: "/more/adzan",
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Doa Setelah Adzan",
      description: "Doa dan dzikir penuh berkah setelah adzan",
      icon: <FaPrayingHands className="text-4xl text-emerald-400" />,
      path: "/more/doa-adzan",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Iqomah",
      description: "Lafadz Iqomah dengan audio yang jelas",
      icon: <FaBell className="text-4xl text-amber-400" />,
      path: "/more/iqomah",
      color: "from-amber-500 to-amber-700",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        damping: 15, 
        stiffness: 200,
        mass: 0.5
      },
    },
    hover: {
      y: -10,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.7,
            ease: "easeOut"
          }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.2,
              type: "spring"
            }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1 rounded-full">
              <div className="bg-white p-3 rounded-full">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">+</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Fitur <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Tambahan</span>
          </h1>
          <p className="text-gray-600 max-w-md mx-auto text-lg">
            Kumpulan utilitas islami untuk ibadah sehari-hari
          </p>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              className="h-full cursor-pointer"
            >
              <Link href={feature.path} className="block h-full">
                <div className={`bg-gradient-to-br ${feature.color} rounded-2xl shadow-xl overflow-hidden h-full flex flex-col border border-white/30`}>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mb-5 mx-auto">
                      {feature.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center mb-3">
                      {feature.title}
                    </h2>
                    <p className="text-white/90 text-center mb-6">{feature.description}</p>
                    <div className="mt-auto">
                      <div className="bg-white/20 rounded-full px-4 py-2 w-max mx-auto">
                        <span className="text-white/90 hover:text-white transition-colors font-medium flex items-center gap-2">
                          Buka <span className="text-lg">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="text-center mt-20"
        >
          <p className="text-gray-500 italic">"Dan Kami tidak menciptakan langit dan bumi dan apa yang ada di antara keduanya tanpa hikmah" (QS. Shad: 27)</p>
        </motion.div>
      </div>
    </div>
  );
}