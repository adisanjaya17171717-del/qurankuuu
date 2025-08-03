// app/api/tuntunan-sholat/iqomah/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    
    const iqomahData = {
      metadata: {
        title: "Bacaan Iqomah",
        description: "Bacaan iqomah lengkap dengan teks arab, latin, terjemahan dan audio",
        source: "Tuntunan Sholat Lengkap",
        language: "id",
        createdAt: new Date().toISOString(),
        context: "Dikumandangkan sebelum sholat berjamaah dimulai"
      },
      content: [
        {
          id: 1,
          arabic: "اَللهُ اَكْبَر، اَللهُ اَكْبَر",
          latin: "Allaahu Akbar Allaahu Akbar",
          translation: "Allah Maha Besar, Allah Maha Besar",
          repetition: 1,
          audio: `${baseUrl}/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=0,4`
        },
        {
          id: 2,
          arabic: "أَشْهَدُ اَنْ لاَ اِلَهَ إِلاَّاللهُ",
          latin: "Asyhadu an laa illaaha illallaah",
          translation: "Aku bersaksi bahwa Tiada Tuhan melainkan Allah",
          repetition: 1,
          audio: `${baseUrl}/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=4,10`
        },
        {
          id: 3,
          arabic: "اَشْهَدُ اَنَّ مُحَمَّدًا رَسُوْلُ اللهِ",
          latin: "Asyhadu anna Muhammadar rasuulullah",
          translation: "Aku bersaksi bahwa nabi Muhammad itu adalah utusan Allah",
          repetition: 1,
          audio: `${baseUrl}/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=10,17`
        },
        {
          id: 4,
          arabic: "حَيَّ عَلَى الصَّلاَةِ",
          latin: "Hayya 'alas-shalaah",
          translation: "Marilah Sholat",
          repetition: 1,
          audio: `${baseUrl}/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=17.8,20.8`
        },
        {
          id: 5,
          arabic: "حَيَّ عَلَى الْفَلاَحِ",
          latin: "Hayya 'alal-falaah",
          translation: "Marilah menuju kepada kejayaan",
          repetition: 1,
          audio: `${baseUrl}/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=20.8,25`
        },
        {
          id: 6,
          arabic: "قَدْ قَامَتِ الصَّلاَةُ ، قَدْ قَامَتِ الصَّلاَةُ",
          latin: "Qad qaamatish-shalaah, Qad qaamatish-shalaah",
          translation: "Sesungguhnya sudah hampir mengerjakan sholat",
          repetition: 1,
          audio: `${baseUrl}/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=25,33`
        },
        {
          id: 7,
          arabic: "اَللهُ اَكْبَر، اَللهُ اَكْبَر",
          latin: "Allaahu Akbar, Allaahu Akbar",
          translation: "Allah Maha Besar, Allah Maha Besar",
          repetition: 1,
          audio: `${baseUrl}/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=34,38`
        },
        {
          id: 8,
          arabic: "لاَ إِلَهَ إِلاَّالله",
          latin: "Laa ilaaha illallaah",
          translation: "Tiada Tuhan melainkan Allah",
          repetition: 1,
          audio: `${baseUrl}/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=39,50`
        }
      ],
      fullAudio: `${baseUrl}/asset/tuntunan-sholat/iqomah/iqomah.mp3`,
      additionalInfo: {
        perbedaanAdzanIqomah: [
          "Iqomah dikumandangkan lebih cepat daripada adzan",
          "Jumlah pengulangan bacaan lebih sedikit",
          "Terdapat tambahan bacaan 'Qad qaamatish-shalaah'",
          "Iqomah menandakan sholat akan segera dimulai"
        ],
        tataCara: [
          "Dikumandangkan setelah jamaah sholat sudah siap",
          "Berdiri menghadap kiblat",
          "Menggunakan suara yang cukup keras untuk didengar jamaah",
          "Dilakukan setelah adzan"
        ],
        hukum: "Sunnah muakkadah (sangat dianjurkan) untuk sholat berjamaah",
        referensi: [
          "HR. Abu Daud no. 499",
          "HR. Tirmidzi no. 192",
          "Kitab Al-Fiqh Al-Islami wa Adillatuhu oleh Wahbah Az-Zuhaili"
        ]
      }
    };

    return NextResponse.json(iqomahData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}