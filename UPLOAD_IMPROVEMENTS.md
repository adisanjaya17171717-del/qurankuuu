# Public Gallery Upload Improvements

## Overview
Perbaikan pada sistem upload galeri publik untuk mendukung file hingga 200MB di Vercel dengan mengatasi batasan 4.5MB request body.

## Batasan Vercel
- **Request Body Limit**: 4.5MB per request
- **Function Timeout**: 300 detik (5 menit) maksimal
- **Memory**: Terbatas per function execution

## Solusi Implementasi

### 1. Chunked Upload System
- File dibagi menjadi chunks 3MB (di bawah batasan 4.5MB)
- Setiap chunk diupload secara terpisah
- Chunks digabungkan di server sebelum upload ke IPFS

### 2. Konfigurasi Vercel (`vercel.json`)
```json
{
  "functions": {
    "app/api/cloud/route.js": {
      "maxDuration": 300
    },
    "app/api/cloud/chunked/route.js": {
      "maxDuration": 300
    }
  }
}
```

### 3. API Routes

#### `/api/cloud/route.js`
- **Batas ukuran**: 4MB (di bawah 4.5MB Vercel limit)
- **Timeout**: 120 detik
- **Fungsi**: Upload langsung untuk file kecil

#### `/api/cloud/chunked/route.js`
- **Chunk size**: 3MB per chunk
- **Storage**: In-memory dengan base64 encoding
- **Timeout**: 300 detik (5 menit)
- **Fungsi**: Upload chunked untuk file besar

### 4. Frontend Logic

#### File Size Detection
- **< 4MB**: Upload langsung ke `/api/cloud`
- **> 4MB**: Upload chunked ke `/api/cloud/chunked`

#### Progress Tracking
- Real-time progress untuk setiap chunk
- Indikator ukuran file
- Notifikasi upload type

## Cara Kerja

### Upload File Kecil (<4MB)
1. File langsung diupload ke `/api/cloud`
2. Upload ke Filebase IPFS
3. Simpan metadata ke Supabase

### Upload File Besar (4MB-200MB)
1. File dibagi menjadi chunks 3MB
2. Setiap chunk diupload ke `/api/cloud/chunked`
3. Chunks disimpan di memory (base64)
4. Progress tracking real-time
5. Chunks digabungkan di server
6. File lengkap diupload ke Filebase IPFS
7. Simpan metadata ke Supabase

## Teknis Implementasi

### Chunked Upload Flow
```
Frontend → Chunk 1 (3MB) → API → Memory Storage
Frontend → Chunk 2 (3MB) → API → Memory Storage
...
Frontend → Chunk N (3MB) → API → Combine All Chunks → IPFS
```

### Memory Management
- Chunks disimpan sebagai base64 string di memory
- Cleanup otomatis setelah upload selesai
- Error handling dengan cleanup

### Error Handling
- Timeout handling (5 menit)
- Chunk validation
- Memory cleanup on error
- User-friendly error messages

## Konfigurasi Environment Variables

```env
FILEBASE_API_KEY=your_filebase_api_key
```

## Deployment di Vercel

1. Push code ke repository
2. Vercel deploy dengan konfigurasi `vercel.json`
3. Function timeout: 300 detik
4. Chunk size: 3MB (aman di bawah 4.5MB limit)

## Testing Scenarios

### File Kecil (1-4MB)
- ✅ Upload langsung tanpa chunking
- ✅ Progress bar sederhana
- ✅ Timeout 2 menit

### File Besar (4-200MB)
- ✅ Upload dengan chunking
- ✅ Progress bar detail per chunk
- ✅ Timeout 5 menit
- ✅ Indikator "Akan menggunakan chunked upload"

## Performance Considerations

### Memory Usage
- Base64 encoding menambah 33% overhead
- Chunks disimpan di memory selama upload
- Cleanup otomatis setelah selesai

### Network Efficiency
- Chunk size optimal (3MB)
- Progress tracking per chunk
- Retry mechanism untuk chunk yang gagal

### Vercel Limitations
- 4.5MB request body limit
- 300 detik function timeout
- Memory constraints per function

## Security

- ✅ Validasi tipe file (JPG, PNG, GIF, WebP)
- ✅ Validasi ukuran file (max 200MB total)
- ✅ Validasi chunk size (max 4MB per chunk)
- ✅ CORS headers yang aman
- ✅ Error handling tanpa expose sensitive info

## Monitoring & Debugging

- Progress tracking real-time
- Detailed error messages
- Chunk validation logs
- Memory usage monitoring
- Timeout handling

## Future Improvements

### Production Ready
1. **External Storage**: Gunakan Redis/Supabase untuk chunk storage
2. **Resume Upload**: Kemampuan melanjutkan upload yang terputus
3. **Parallel Chunks**: Upload multiple chunks secara parallel
4. **Compression**: Kompresi file sebelum chunking

### Performance
1. **CDN Integration**: Integrasi dengan CDN untuk delivery
2. **Caching**: Cache untuk file yang sering diakses
3. **Optimization**: Optimasi chunk size berdasarkan network

### User Experience
1. **Drag & Drop**: Support untuk multiple files
2. **Preview**: Preview file sebelum upload
3. **Batch Upload**: Upload multiple files sekaligus

## Troubleshooting

### Common Issues
1. **Chunk Upload Failed**: Check network connection
2. **Memory Error**: Reduce chunk size or file size
3. **Timeout Error**: Increase function timeout
4. **File Too Large**: Split into smaller files

### Debug Steps
1. Check browser console for errors
2. Verify API key configuration
3. Monitor function logs in Vercel
4. Test with smaller files first