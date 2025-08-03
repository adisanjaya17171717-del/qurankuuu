// app/api/tuntunan-sholat/adzan/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    
    const adzanData = {
      metadata: {
        title: "Tuntunan Bacaan Adzan",
        description: "Bacaan adzan lengkap dengan teks arab, latin, terjemahan dan audio",
        source: "Tuntunan Sholat Lengkap",
        language: "id",
        createdAt: new Date().toISOString()
      },
      content: [
        {
          id: 1,
          arabic: "اَللهُ اَكْبَرُ،اَللهُ اَكْبَرُ",
          latin: "Allaahu Akbar, Allaahu Akbar",
          translation: "Allah Maha Besar, Allah Maha Besar",
          repetition: 2,
          audio: `${baseUrl}/asset/tuntunan-sholat/adzan/adzan.mp3#t=0,39`
        },
        {
          id: 2,
          arabic: "أَشْهَدُ اَنْ لاَ إِلٰهَ إِلَّااللهُ",
          latin: "Asyhadu allaa illaaha illallaah",
          translation: "Aku menyaksikan bahwa tiada Tuhan selain Allah",
          repetition: 2,
          audio: `${baseUrl}/asset/tuntunan-sholat/adzan/adzan.mp3#t=40,80`
        },
        {
          id: 3,
          arabic: "اَشْهَدُ اَنَّ مُحَمَّدًا رَسُوْلُ اللهِ",
          latin: "Asyhadu anna Muhammadar rasuulullah",
          translation: "Aku menyaksikan bahwa nabi Muhammad itu adalah utusan Allah",
          repetition: 2,
          audio: `${baseUrl}/asset/tuntunan-sholat/adzan/adzan.mp3#t=80,122`
        },
        {
          id: 4,
          arabic: "حَيَّ عَلَى الصَّلاَةِ",
          latin: "Hayya 'alashshalaah",
          translation: "Marilah Sholat",
          repetition: 2,
          audio: `${baseUrl}/asset/tuntunan-sholat/adzan/adzan.mp3#t=123,161`
        },
        {
          id: 5,
          arabic: "حَيَّ عَلَى الْفَلاَحِ",
          latin: "Hayya 'alalfalaah",
          translation: "Marilah menuju kepada kejayaan",
          repetition: 2,
          audio: `${baseUrl}/asset/tuntunan-sholat/adzan/adzan.mp3#t=162,197`
        },
        {
          id: 6,
          arabic: "اَللهُ اَكْبَرُ ،اَللهُ اَكْبَرُ",
          latin: "Allaahu Akbar, Allaahu Akbar",
          translation: "Allah Maha Besar, Allah Maha Besar",
          repetition: 1,
          audio: `${baseUrl}/asset/tuntunan-sholat/adzan/adzan.mp3#t=198,215`
        },
        {
          id: 7,
          arabic: "لَا إِلَهَ إِلَّااللهُ",
          latin: "Laa ilaaha illallaah",
          translation: "Tiada Tuhan selain Allah",
          repetition: 1,
          audio: `${baseUrl}/asset/tuntunan-sholat/adzan/adzan.mp3#t=216,232`
        }
      ],
      fullAudio: `${baseUrl}/asset/tuntunan-sholat/adzan/adzan.mp3`,
      additionalInfo: {
        notes: [
          "Untuk adzan Subuh, ditambahkan 'Assalatu khairum minan naum' (Sholat itu lebih baik daripada tidur) setelah 'Hayya 'alalfalaah'",
          "Dianjurkan menjawab adzan dengan mengikuti bacaan muadzin"
        ],
        references: [
          "HR. Bukhari no. 611 dan Muslim no. 674",
          "Fikih Sunnah jilid 1 oleh Sayyid Sabiq"
        ]
      }
    };

    return NextResponse.json(adzanData, {
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