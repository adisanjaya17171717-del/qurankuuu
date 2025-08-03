// src/app/offline/page.jsx

'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Anda Sedang Offline</h1>
        <p className="text-gray-600 mb-6">
          Maaf, konten ini memerlukan koneksi internet. Silakan cek koneksi Anda.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}