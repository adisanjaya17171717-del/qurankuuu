
// app/api/cloud/chunked/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk');
    const chunkIndex = parseInt(formData.get('chunkIndex'));
    const totalChunks = parseInt(formData.get('totalChunks'));
    const fileName = formData.get('fileName');
    const fileId = formData.get('fileId');

    if (!chunk || chunkIndex === undefined || !totalChunks || !fileName || !fileId) {
      return NextResponse.json(
        { success: false, error: 'Parameter chunk tidak lengkap' },
        { status: 400 }
      );
    }

    // Simulasi penyimpanan chunk (dalam implementasi nyata, simpan ke temporary storage)
    console.log(`Received chunk ${chunkIndex + 1}/${totalChunks} for file ${fileName}`);

    // Jika ini adalah chunk terakhir, gabungkan semua chunk dan upload ke IPFS
    if (chunkIndex === totalChunks - 1) {
      // Di sini Anda akan menggabungkan semua chunk dan upload ke Filebase
      // Untuk contoh ini, kita return success response
      
      const mockCID = `Qm${Math.random().toString(36).substring(2, 15)}`;
      const publicUrl = `https://ipfs.filebase.io/ipfs/${mockCID}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        provider: 'Filebase IPFS (Chunked)',
        cid: mockCID,
        fileName: fileName,
        isComplete: true
      });
    }

    // Return progress untuk chunk yang bukan terakhir
    return NextResponse.json({
      success: true,
      isComplete: false,
      progress: Math.round(((chunkIndex + 1) / totalChunks) * 100),
      message: `Chunk ${chunkIndex + 1}/${totalChunks} berhasil diterima`
    });

  } catch (error) {
    console.error('Chunked upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Upload chunk gagal',
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
