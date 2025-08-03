// app/api/tuntunan-sholat/doa-setelah-azan/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    
    const doaData = {
      metadata: {
        title: "Doa Setelah Selesai Mengumandangkan Azan",
        description: "Doa yang dibaca oleh muadzin setelah selesai mengumandangkan azan",
        source: "HR. Al-Bukhari no. 614",
        language: "id",
        createdAt: new Date().toISOString(),
        category: "Tuntunan Sholat",
        context: "Dibaca oleh muadzin setelah selesai mengumandangkan azan"
      },
      content: {
        arabic: "اَللّٰهُمَّ رَبَّ هٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ سَيِّدَنَا مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَالشَّرَفَ وَالدَّرَجَةَ الْعَالِيَةَ الرَّفِيعَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ، إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ.",
        latin: "Allahumma rabba hāzihid-da‘watit-tāmmati wash-shalātil-qā’imati, āti sayyidanā Muhammadan al-wasīlata wal-fadhīlata wasy-syaroofa wad-darajatal-‘āliyatar-rāfi‘ah, wab‘ath-hu maqāman mahmūdanil-ladzī wa‘adtahu, innaka lā tukhliful-mī‘ād.",
        translation: "Ya Allah, Tuhan yang memiliki seruan yang sempurna dan shalat yang ditegakkan, berilah Sayyiduna Muhammad wasilah, keutamaan, kemuliaan, dan derajat yang tinggi lagi luhur. Bangkitkanlah beliau ke tempat yang terpuji sebagaimana yang telah Engkau janjikan. Sesungguhnya Engkau tidak menyalahi janji.",
        audio: `${baseUrl}/asset/tuntunan-sholat/doa-setelah-adzan/doa-setelah-adzan.mp3`
      },
      additionalInfo: {
        penjelasan: "Doa ini dibaca oleh muadzin setelah selesai mengumandangkan azan. Berbeda dengan doa setelah mendengar azan yang dibaca oleh jamaah, doa ini khusus dibaca oleh orang yang mengumandangkan azan.",
        tataCara: [
          "Dibaca setelah selesai mengumandangkan azan",
          "Dibaca dengan suara yang lembut (tidak keras)",
          "Menghadap kiblat",
          "Mengangkat tangan dengan penuh kekhusyukan"
        ],
        keutamaan: [
          "Mendapatkan syafaat Nabi Muhammad SAW di hari kiamat",
          "Diampuni dosa-dosanya oleh Allah SWT",
          "Dikabulkan doanya oleh Allah SWT"
        ],
        referensi: [
          "HR. Al-Bukhari no. 614",
          "HR. Muslim no. 384",
          "Fikih Sunnah karya Sayyid Sabiq jilid 1",
          "Kitab Al-Adzkar oleh Imam An-Nawawi"
        ],
        catatan: "Doa ini sama bacaannya dengan doa setelah mendengar azan, namun konteks dan waktu pembacaannya berbeda. Muadzin membacanya setelah selesai azan, sedangkan jamaah membacanya setelah mendengar azan."
      }
    };

    return NextResponse.json(doaData, {
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