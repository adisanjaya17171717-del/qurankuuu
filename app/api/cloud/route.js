
// app/api/cloud/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Ambil file dari request
    const formData = await request.formData();
    const file = formData.get('file');

    // 2. Validasi file
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada file yang diunggah' },
        { status: 400 }
      );
    }

    // 3. Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Format file tidak didukung. Hanya JPG, PNG, atau GIF yang diperbolehkan' 
        },
        { status: 400 }
      );
    }

    // 4. Validasi ukuran file (max 10MB untuk streaming)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ukuran file melebihi batas 10MB' 
        },
        { status: 400 }
      );
    }

    // 5. Convert file to stream untuk upload yang lebih efisien
    const fileBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([fileBuffer], { type: file.type });

    // 6. Siapkan payload untuk Filebase RPC dengan streaming
    const uploadForm = new FormData();
    uploadForm.append('file', fileBlob, file.name);
    
    // 7. Konfigurasi timeout yang lebih lama untuk file besar (60 detik)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    // 8. Kirim ke Filebase RPC API dengan header yang dioptimasi
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

    // 9. Hentikan timeout setelah response diterima
    clearTimeout(timeout);

    // 10. Handle response dari Filebase
    if (!rpcResponse.ok) {
      const errorBody = await rpcResponse.text();
      throw new Error(
        `Filebase RPC error: ${rpcResponse.status} ${rpcResponse.statusText} - ${errorBody}`
      );
    }

    // 11. Parse response JSON
    const rpcResult = await rpcResponse.json();
    
    // 12. Pastikan CID ada di response
    if (!rpcResult.Hash) {
      throw new Error('CID tidak ditemukan dalam respons Filebase');
    }

    // 13. Generate public URL
    const publicUrl = `https://ipfs.filebase.io/ipfs/${rpcResult.Hash}`;

    // 14. Return success response
    return NextResponse.json({
      success: true,
      url: publicUrl,
      provider: 'Filebase IPFS',
      cid: rpcResult.Hash,
      size: rpcResult.Size,
      originalName: file.name
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    // 15. Handle error secara spesifik
    console.error('Filebase IPFS RPC error:', error);
    
    let errorMessage = 'Upload gagal';
    if (error.name === 'AbortError') {
      errorMessage = 'Waktu upload habis (60 detik)';
    } else if (error.message.includes('401')) {
      errorMessage = 'API key tidak valid';
    } else if (error.message.includes('403')) {
      errorMessage = 'Akses ditolak. Periksa izin API key';
    } else if (error.message.includes('CID tidak ditemukan')) {
      errorMessage = 'Filebase tidak mengembalikan CID';
    } else if (error.message.includes('PayloadTooLargeError')) {
      errorMessage = 'File terlalu besar untuk diproses';
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
