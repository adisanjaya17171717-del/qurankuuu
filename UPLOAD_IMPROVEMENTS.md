# Public Gallery Upload Improvements

## Overview
Perbaikan pada sistem upload galeri publik untuk mendukung file hingga 200MB di Vercel.

## Perubahan yang Dilakukan

### 1. Konfigurasi Vercel (`vercel.json`)
- Menambahkan konfigurasi timeout function hingga 300 detik (5 menit)
- Mengatur CORS headers untuk API routes
- Memungkinkan upload file besar tanpa timeout

### 2. API Routes

#### `/api/cloud/route.js`
- Meningkatkan batas ukuran file dari 10MB ke 200MB
- Menambahkan deteksi otomatis untuk file besar (>50MB)
- Meningkatkan timeout dari 60 detik ke 120 detik
- Menambahkan konfigurasi body parser untuk file besar

#### `/api/cloud/chunked/route.js`
- Implementasi upload chunked untuk file besar
- Chunk size: 5MB per chunk
- Storage sementara di memory (dalam production gunakan Redis/database)
- Progress tracking untuk setiap chunk
- Timeout 5 menit untuk upload file besar

### 3. Frontend Improvements (`app/public-galeri/page.jsx`)

#### State Management
- Menambahkan `uploadProgress` untuk tracking progress
- Menambahkan `isChunkedUpload` untuk status upload chunked
- Reset progress saat upload selesai

#### File Validation
- Meningkatkan batas ukuran file dari 50MB ke 200MB
- Menambahkan support untuk format WebP
- Validasi otomatis ukuran file

#### Upload Logic
- Deteksi otomatis file besar (>50MB)
- Switch otomatis ke chunked upload untuk file besar
- Progress bar real-time untuk upload chunked
- Error handling yang lebih baik

#### UI Improvements
- Progress bar dengan persentase
- Indikator ukuran file
- Notifikasi ketika akan menggunakan chunked upload
- Button state yang berbeda untuk upload chunked

## Cara Kerja

### Upload File Kecil (<50MB)
1. File langsung diupload ke `/api/cloud`
2. Upload ke Filebase IPFS
3. Simpan metadata ke Supabase

### Upload File Besar (>50MB)
1. File dibagi menjadi chunks 5MB
2. Setiap chunk diupload ke `/api/cloud/chunked`
3. Progress tracking real-time
4. Chunks digabungkan di server
5. File lengkap diupload ke Filebase IPFS
6. Simpan metadata ke Supabase

## Konfigurasi Environment Variables

Pastikan environment variables berikut sudah diset:

```env
FILEBASE_API_KEY=your_filebase_api_key
```

## Deployment di Vercel

1. Push code ke repository
2. Vercel akan otomatis deploy dengan konfigurasi `vercel.json`
3. Function timeout akan diset ke 300 detik
4. Body size limit akan diset ke 200MB

## Testing

### File Kecil (1-50MB)
- Upload langsung tanpa chunking
- Progress bar sederhana
- Timeout 2 menit

### File Besar (50-200MB)
- Upload dengan chunking
- Progress bar detail per chunk
- Timeout 5 menit
- Indikator "Akan menggunakan chunked upload"

## Monitoring

- Progress upload real-time
- Error handling yang detail
- Log untuk debugging
- Timeout handling

## Performance

- Chunked upload mengurangi memory usage
- Progress tracking meningkatkan UX
- Timeout yang sesuai untuk file besar
- Fallback ke regular upload untuk file kecil

## Security

- Validasi tipe file (JPG, PNG, GIF, WebP)
- Validasi ukuran file (max 200MB)
- CORS headers yang aman
- Error handling tanpa expose sensitive info

## Future Improvements

1. **Persistent Storage**: Gunakan Redis/database untuk chunk storage
2. **Resume Upload**: Kemampuan melanjutkan upload yang terputus
3. **Parallel Chunks**: Upload multiple chunks secara parallel
4. **Compression**: Kompresi file sebelum upload
5. **CDN**: Integrasi dengan CDN untuk delivery yang lebih cepat