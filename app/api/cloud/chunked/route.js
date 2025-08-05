
// app/api/cloud/chunked/route.js
import { NextResponse } from 'next/server';

// Configure for large file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '200mb',
    },
    responseLimit: false,
  },
};

// In-memory storage for chunks (in production, use Redis or database)
const chunkStorage = new Map();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk');
    const chunkIndex = parseInt(formData.get('chunkIndex'));
    const totalChunks = parseInt(formData.get('totalChunks'));
    const fileName = formData.get('fileName');
    const fileId = formData.get('fileId');
    const fileType = formData.get('fileType');

    if (!chunk || chunkIndex === undefined || !totalChunks || !fileName || !fileId || !fileType) {
      return NextResponse.json(
        { success: false, error: 'Parameter chunk tidak lengkap' },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(fileType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Format file tidak didukung. Hanya JPG, PNG, GIF, atau WebP yang diperbolehkan' 
        },
        { status: 400 }
      );
    }

    // Simpan chunk ke memory storage
    if (!chunkStorage.has(fileId)) {
      chunkStorage.set(fileId, {
        chunks: new Map(),
        metadata: { fileName, fileType, totalChunks }
      });
    }

    const fileData = chunkStorage.get(fileId);
    fileData.chunks.set(chunkIndex, chunk);

    // Jika ini adalah chunk terakhir, gabungkan semua chunk dan upload ke IPFS
    if (chunkIndex === totalChunks - 1) {
      try {
        // Gabungkan semua chunk
        const chunks = [];
        for (let i = 0; i < totalChunks; i++) {
          const chunkData = fileData.chunks.get(i);
          if (!chunkData) {
            throw new Error(`Chunk ${i} tidak ditemukan`);
          }
          chunks.push(chunkData);
        }

        // Gabungkan chunks menjadi satu file
        const combinedBlob = new Blob(chunks, { type: fileType });

        // Upload ke Filebase IPFS
        const uploadForm = new FormData();
        uploadForm.append('file', combinedBlob, fileName);
        
        // Konfigurasi timeout yang lebih lama untuk file besar (5 menit)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 300000);

        const rpcResponse = await fetch(
          'https://rpc.filebase.io/api/v0/add?cid-version=1&pin=true&progress=false',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.FILEBASE_API_KEY}`,
              'Accept': 'application/json'
            },
            body: uploadForm,
            signal: controller.signal
          }
        );

        clearTimeout(timeout);

        if (!rpcResponse.ok) {
          const errorBody = await rpcResponse.text();
          throw new Error(
            `Filebase RPC error: ${rpcResponse.status} ${rpcResponse.statusText} - ${errorBody}`
          );
        }

        const rpcResult = await rpcResponse.json();
        
        if (!rpcResult.Hash) {
          throw new Error('CID tidak ditemukan dalam respons Filebase');
        }

        const publicUrl = `https://ipfs.filebase.io/ipfs/${rpcResult.Hash}`;

        // Bersihkan storage
        chunkStorage.delete(fileId);

        return NextResponse.json({
          success: true,
          url: publicUrl,
          provider: 'Filebase IPFS (Chunked)',
          cid: rpcResult.Hash,
          size: rpcResult.Size,
          fileName: fileName,
          isComplete: true
        });

      } catch (error) {
        // Bersihkan storage jika gagal
        chunkStorage.delete(fileId);
        throw error;
      }
    }

    // Return progress untuk chunk yang bukan terakhir
    return NextResponse.json({
      success: true,
      isComplete: false,
      progress: Math.round(((chunkIndex + 1) / totalChunks) * 100),
      message: `Chunk ${chunkIndex + 1}/${totalChunks} berhasil diterima`,
      fileId: fileId
    });

  } catch (error) {
    console.error('Chunked upload error:', error);
    
    let errorMessage = 'Upload chunk gagal';
    if (error.name === 'AbortError') {
      errorMessage = 'Waktu upload habis (5 menit)';
    } else if (error.message.includes('401')) {
      errorMessage = 'API key tidak valid';
    } else if (error.message.includes('403')) {
      errorMessage = 'Akses ditolak. Periksa izin API key';
    } else if (error.message.includes('CID tidak ditemukan')) {
      errorMessage = 'Filebase tidak mengembalikan CID';
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    }
  );
}
