// app/api/offline/route.js

import { NextResponse } from 'next/server';

// Static Quran data for offline fallback
const offlineQuranData = {
  surat: [
    {
      nomor: 1,
      nama: "الفاتحة",
      namaLatin: "Al-Fatihah",
      arti: "Pembukaan",
      jumlahAyat: 7,
      tempatTurun: "mekah",
      audioFull: {
        "01": "https://equran.id/audiodir/surah/1.mp3"
      }
    },
    {
      nomor: 2,
      nama: "البقرة",
      namaLatin: "Al-Baqarah",
      arti: "Sapi Betina",
      jumlahAyat: 286,
      tempatTurun: "madinah",
      audioFull: {
        "01": "https://equran.id/audiodir/surah/2.mp3"
      }
    },
    {
      nomor: 3,
      nama: "آل عمران",
      namaLatin: "Ali 'Imran",
      arti: "Keluarga Imran",
      jumlahAyat: 200,
      tempatTurun: "madinah",
      audioFull: {
        "01": "https://equran.id/audiodir/surah/3.mp3"
      }
    },
    {
      nomor: 4,
      nama: "النساء",
      namaLatin: "An-Nisa",
      arti: "Wanita",
      jumlahAyat: 176,
      tempatTurun: "madinah",
      audioFull: {
        "01": "https://equran.id/audiodir/surah/4.mp3"
      }
    },
    {
      nomor: 5,
      nama: "المائدة",
      namaLatin: "Al-Ma'idah",
      arti: "Hidangan",
      jumlahAyat: 120,
      tempatTurun: "madinah",
      audioFull: {
        "01": "https://equran.id/audiodir/surah/5.mp3"
      }
    },
    {
      nomor: 6,
      nama: "الأنعام",
      namaLatin: "Al-An'am",
      arti: "Binatang Ternak",
      jumlahAyat: 165,
      tempatTurun: "mekah",
      audioFull: {
        "01": "https://equran.id/audiodir/surah/6.mp3"
      }
    },
    {
      nomor: 7,
      nama: "الأعراف",
      namaLatin: "Al-A'raf",
      arti: "Tempat yang Tinggi",
      jumlahAyat: 206,
      tempatTurun: "mekah",
      audioFull: {
        "01": "https://equran.id/audiodir/surah/7.mp3"
      }
    },
    {
      nomor: 114,
      nama: "الناس",
      namaLatin: "An-Nas",
      arti: "Manusia",
      jumlahAyat: 6,
      tempatTurun: "mekah",
      audioFull: {
        "01": "https://equran.id/audiodir/surah/114.mp3"
      }
    }
  ],
  
  fatiha: {
    nomor: 1,
    nama: "الفاتحة",
    namaLatin: "Al-Fatihah",
    arti: "Pembukaan",
    jumlahAyat: 7,
    tempatTurun: "mekah",
    ayat: [
      {
        nomorAyat: 1,
        teksArab: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        teksLatin: "bismillāhi'r-raḥmāni'r-raḥīm",
        teksIndonesia: "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.",
        audio: {
          "01": "https://equran.id/audiodir/surah/1/1.mp3"
        }
      },
      {
        nomorAyat: 2,
        teksArab: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        teksLatin: "alḥamdu lillāhi rabbi'l-ʿālamīn",
        teksIndonesia: "Segala puji bagi Allah, Tuhan semesta alam.",
        audio: {
          "01": "https://equran.id/audiodir/surah/1/2.mp3"
        }
      },
      {
        nomorAyat: 3,
        teksArab: "الرَّحْمَٰنِ الرَّحِيمِ",
        teksLatin: "ar-raḥmāni'r-raḥīm",
        teksIndonesia: "Maha Pemurah lagi Maha Penyayang.",
        audio: {
          "01": "https://equran.id/audiodir/surah/1/3.mp3"
        }
      },
      {
        nomorAyat: 4,
        teksArab: "مَالِكِ يَوْمِ الدِّينِ",
        teksLatin: "māliki yawmi'd-dīn",
        teksIndonesia: "Yang menguasai di Hari Pembalasan.",
        audio: {
          "01": "https://equran.id/audiodir/surah/1/4.mp3"
        }
      },
      {
        nomorAyat: 5,
        teksArab: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        teksLatin: "iyyāka na'budu wa iyyāka nasta'īn",
        teksIndonesia: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.",
        audio: {
          "01": "https://equran.id/audiodir/surah/1/5.mp3"
        }
      },
      {
        nomorAyat: 6,
        teksArab: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        teksLatin: "ihdinā'ṣ-ṣirāṭa'l-mustaqīm",
        teksIndonesia: "Tunjukilah kami jalan yang lurus.",
        audio: {
          "01": "https://equran.id/audiodir/surah/1/6.mp3"
        }
      },
      {
        nomorAyat: 7,
        teksArab: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        teksLatin: "ṣirāṭa'lladhīna an'amta 'alayhim ghayri'l-maghḍūbi 'alayhim wa lā'ḍ-ḍāllīn",
        teksIndonesia: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.",
        audio: {
          "01": "https://equran.id/audiodir/surah/1/7.mp3"
        }
      }
    ]
  }
};

const offlineTajwidData = [
  {
    id: 1,
    nama: "Nun Mati dan Tanwin",
    keterangan: "Nun mati (نْ) dan tanwin (ً ٍ ٌ) memiliki empat hukum bacaan.",
    contoh: "مِنْ بَعْدِ، جَنَّاتٍ تَجْرِي",
    audio: "/audio/tajwid/nun-mati.mp3"
  },
  {
    id: 2,
    nama: "Mim Mati",
    keterangan: "Mim mati (مْ) memiliki tiga hukum bacaan.",
    contoh: "أَمْوَالَهُمْ وَأَنْفُسَهُمْ",
    audio: "/audio/tajwid/mim-mati.mp3"
  },
  {
    id: 3,
    nama: "Qalqalah",
    keterangan: "Huruf qalqalah (ق ط ب ج د) dibaca dengan memantul.",
    contoh: "قَدْ أَفْلَحَ، اُطْلُبْ",
    audio: "/audio/tajwid/qalqalah.mp3"
  },
  {
    id: 4,
    nama: "Mad",
    keterangan: "Bacaan panjang yang terbagi menjadi beberapa jenis.",
    contoh: "قَالَ، جَاءَ، يَقُولُ",
    audio: "/audio/tajwid/mad.mp3"
  },
  {
    id: 5,
    nama: "Ghunnah",
    keterangan: "Bacaan dengung pada huruf nun dan mim.",
    contoh: "إِنَّ، أَمَّا",
    audio: "/audio/tajwid/ghunnah.mp3"
  }
];

const offlineDoaData = [
  {
    id: 1,
    kategori: "Doa Harian",
    judul: "Doa Bangun Tidur",
    arab: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillahilladzi ahyaana ba'da maa amaatanaa wa ilaihin nusyuur",
    terjemahan: "Segala puji bagi Allah yang telah menghidupkan kami sesudah kami mati (tidur) dan kepada-Nya kami dikembalikan.",
    audio: "/audio/doa/bangun-tidur.mp3"
  },
  {
    id: 2,
    kategori: "Doa Harian",
    judul: "Doa Mau Tidur",
    arab: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
    latin: "Allahumma bismika amuutu wa ahyaa",
    terjemahan: "Ya Allah, dengan nama-Mu aku mati dan aku hidup.",
    audio: "/audio/doa/mau-tidur.mp3"
  },
  {
    id: 3,
    kategori: "Doa Makan",
    judul: "Doa Sebelum Makan",
    arab: "بِسْمِ اللَّهِ وَبَرَكَةِ اللَّهِ",
    latin: "Bismillahi wa barakatillahi",
    terjemahan: "Dengan nama Allah dan berkah Allah.",
    audio: "/audio/doa/sebelum-makan.mp3"
  },
  {
    id: 4,
    kategori: "Doa Makan",
    judul: "Doa Sesudah Makan",
    arab: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    latin: "Alhamdulillahilladzi ath'amanaa wa saqaanaa wa ja'alanaa muslimiina",
    terjemahan: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami orang-orang yang berserah diri.",
    audio: "/audio/doa/sesudah-makan.mp3"
  },
  {
    id: 5,
    kategori: "Doa Perjalanan",
    judul: "Doa Naik Kendaraan",
    arab: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    latin: "Subhaanalladzi sakhkhara lanaa haadzaa wa maa kunnaa lahu muqriniina wa innaa ilaa rabbinaa lamunqalibuuna",
    terjemahan: "Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.",
    audio: "/audio/doa/naik-kendaraan.mp3"
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'surat';
    const id = searchParams.get('id');

    console.log('[Offline API] Request for:', type, id);

    // Handle different types of offline data
    switch (type) {
      case 'surat':
        if (id === '1') {
          return NextResponse.json({
            status: true,
            data: offlineQuranData.fatiha
          });
        }
        return NextResponse.json({
          status: true,
          data: offlineQuranData.surat
        });

      case 'tajwid':
        return NextResponse.json({
          status: true,
          data: offlineTajwidData
        });

      case 'doa':
        const kategori = searchParams.get('kategori');
        let filteredDoa = offlineDoaData;
        
        if (kategori && kategori !== 'all') {
          filteredDoa = offlineDoaData.filter(doa => 
            doa.kategori.toLowerCase().includes(kategori.toLowerCase())
          );
        }
        
        return NextResponse.json({
          status: true,
          data: filteredDoa,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: filteredDoa.length
          }
        });

      case 'fikih-nikah':
        return NextResponse.json({
          status: true,
          data: {
            message: "Konten fikih nikah akan tersedia saat online",
            offlineAvailable: false
          }
        });

      case 'tuntunan-sholat':
        const subType = searchParams.get('sub');
        const sholatData = {
          adzan: {
            judul: "Adzan",
            arab: "اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ",
            latin: "Allahu akbar, Allahu akbar",
            terjemahan: "Allah Maha Besar, Allah Maha Besar"
          },
          iqomah: {
            judul: "Iqomah",
            arab: "قَدْ قَامَتِ الصَّلاَةُ قَدْ قَامَتِ الصَّلاَةُ",
            latin: "Qad qaamatis sholah, qad qaamatis sholah",
            terjemahan: "Sesungguhnya sholat telah tegak, sesungguhnya sholat telah tegak"
          }
        };
        
        return NextResponse.json({
          status: true,
          data: sholatData[subType] || sholatData
        });

      default:
        return NextResponse.json({
          status: false,
          message: "Data type not available offline",
          availableTypes: ['surat', 'tajwid', 'doa', 'tuntunan-sholat']
        });
    }

  } catch (error) {
    console.error('[Offline API] Error:', error);
    
    return NextResponse.json({
      status: false,
      message: "Offline data service error",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // Handle offline actions like bookmarking, progress tracking
    switch (action) {
      case 'bookmark':
        // Store bookmark in localStorage (handled by client)
        return NextResponse.json({
          status: true,
          message: "Bookmark action queued for sync"
        });

      case 'progress':
        // Store reading progress
        return NextResponse.json({
          status: true,
          message: "Progress saved locally"
        });

      case 'preference':
        // Store user preferences
        return NextResponse.json({
          status: true,
          message: "Preferences updated"
        });

      default:
        return NextResponse.json({
          status: false,
          message: "Action not supported offline"
        });
    }

  } catch (error) {
    console.error('[Offline API] POST Error:', error);
    
    return NextResponse.json({
      status: false,
      message: "Offline action failed",
      error: error.message
    }, { status: 500 });
  }
}