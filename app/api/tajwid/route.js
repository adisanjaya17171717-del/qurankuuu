export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const rule = searchParams.get('rule');
  
  const tajwidData = [
    {
      id: "nun-mati-tanwin",
      title: "Hukum Nun Mati dan Tanwin",
      description: "Hukum bacaan ketika bertemu nun sukun (نْ) atau tanwin (ـًـٍـٌ)",
      rules: [
        {
          name: "Izhar Halqi",
          description: "Apabila Nun Sukun atau Tanwin bertemu huruf Halqi (حلق), dibaca jelas tanpa dengung",
          letters: ["أ", "ه", "ح", "خ", "ع", "غ"],
          examples: ["مِنْ اٰيٰتِنَا (QS. Al-Baqarah:248)", "مِنْهُمْ (QS. Ali Imran:159)", "يَوْمًا اَوْ (QS. Al-A'raf:54)", "مِنْ اَمْرِنَا (QS. Yusuf:21)"]
        },
        {
          name: "Idgham Bighunnah",
          description: "Apabila Nun Sukun atau Tanwin bertemu huruf Idgham Bighunnah, dibaca dengan dengung 2 harakat",
          letters: ["ي", "ن", "م", "و"],
          examples: ["مَنْ يَّقُوْلُ (QS. Al-Baqarah:8)", "بِسُوْرَةٍ مِّنْ (QS. At-Tawbah:86)", "هُدًى مِّنْ (QS. Al-Baqarah:2)", "فِرَاشاً وَالسَّمَاء (QS. Al-Baqarah:22)"]
        },
        {
          name: "Idgham Bilaghunnah",
          description: "Apabila Nun Sukun atau Tanwin bertemu huruf Idgham Bilaghunnah, dibaca tanpa dengung",
          letters: ["ل", "ر"],
          examples: ["فَمَنْ رَبُكُمَا (QS. Taha:50)", "مِنْ لَدُ (QS. Al-Kahf:65)", "مِنْ رَبٍ رَحِيْمٍ (QS. Yasin:58)", "رِزْقاً لَّكُمْ (QS. Al-Baqarah:172)"]
        },
        {
          name: "Iqlab",
          description: "Apabila Nun Sukun atau Tanwin bertemu huruf Ba, dibaca seperti Mim dengan dengung",
          letters: ["ب"],
          examples: ["سَمِيْعٌ بَصِيْرٌ (QS. Al-Isra:1)", "تَنْبِيْهٌ (QS. Hud:120)", "مِنْ بَعْدِ (QS. Al-Baqarah:243)", "أَنبَتَكُم (QS. Nuh:17)"]
        },
        {
          name: "Ikhfa Haqiqi",
          description: "Apabila Nun Sukun atau Tanwin bertemu 15 huruf Ikhfa, dibaca samar dengan dengung 2 harakat",
          letters: ["ت", "ث", "ج", "د", "ذ", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ف", "ق", "ك"],
          examples: ["وَالْإِنْجِيلَ (QS. Al-Baqarah:136)", "أَنْزَلَ (QS. Al-Baqarah:4)", "ذُو انْتِقَامٍ (QS. Ibrahim:47)", "وَالْأُنثَىٰ (QS. Al-Lail:3)"]
        }
      ]
    },
    {
      id: "mim-mati",
      title: "Hukum Mim Mati",
      description: "Hukum bacaan ketika bertemu mim sukun (مْ)",
      rules: [
        {
          name: "Ikhfa Syafawi",
          description: "Apabila Mim Sukun bertemu huruf Ba, dibaca dengan dengung",
          letters: ["ب"],
          examples: ["تَرْمِيْهِمْ بِحِجَارَةٍ (QS. Al-Fil:4)", "يَعْلَمْ بِاَنَّ (QS. At-Takathur:7)", "كُلٌّ فِيْ فَلَكٍ يَسْبَحُوْنَ (QS. Al-Anbiya:33)"]
        },
        {
          name: "Idgham Mimi",
          description: "Apabila Mim Sukun bertemu huruf Mim, dibaca dengan dengung panjang (ghunnah musyaddadah)",
          letters: ["م"],
          examples: ["فِيْ قُلُوْبِهِمْ مَرَضٌ (QS. Al-Baqarah:10)", "اَجْرَهُمْ مَرَّتَيْنِ (QS. Al-Qasas:54)", "أَم مَّنْ (QS. An-Naml:60)"]
        },
        {
          name: "Izhar Syafawi",
          description: "Apabila Mim Sukun bertemu huruf selain Ba dan Mim, dibaca jelas",
          letters: [],
          examples: ["اَلَمْ تَرَ (QS. Al-Fil:1)", "كَيْدَهُمْ فِيْ (QS. Al-Fil:2)", "أَلَمْ نَشْرَحْ (QS. Al-Insyirah:1)"]
        }
      ]
    },
    {
      id: "hukum-mad",
      title: "Hukum Mad",
      description: "Hukum bacaan panjang dalam Al-Qur'an",
      rules: [
        {
          name: "Mad Thabi'i",
          description: "Mad asli yang panjangnya 2 harakat",
          letters: ["ا", "و", "ي"],
          examples: ["كتَا بٌ (QS. Al-Baqarah:2)", "يَقُوْلُ (QS. Al-Baqarah:8)", "سمِيْعٌ (QS. Al-Baqarah:127)"]
        },
        {
          name: "Mad Wajib Muttasil",
          description: "Mad bertemu hamzah dalam satu kata, panjang 4-5 harakat",
          letters: [],
          examples: ["سَوَآءٌ (QS. Al-Baqarah:6)", "جَآءَ (QS. Yusuf:12)", "جِيْءَ (QS. An-Nisa:18)"]
        },
        {
          name: "Mad Jaiz Munfasil",
          description: "Mad bertemu hamzah di kata berbeda, panjang 4-5 harakat",
          letters: [],
          examples: ["وَﻻَأنْتُمْ (QS. Al-Kafirun:3)", "بِمَا أُنْزِلَ (QS. Al-Baqarah:4)", "قَالُوٓاْ أَنُؤْمِنُ (QS. Al-Baqarah:13)"]
        },
        {
          name: "Mad 'Iwadh",
          description: "Tanwin fathah di akhir kata diwaqafkan, panjang 2 harakat",
          letters: [],
          examples: ["سَميْعًا بَصيْرًا (QS. Al-Isra:1)", "عَلِيْمًا حَكِيمًا (QS. An-Nisa:11)", "رَحِيْمًا (QS. Al-Baqarah:37)"]
        },
        {
          name: "Mad Lazim Kilmi Mutsaqqal",
          description: "Mad bertemu huruf bertasydid, panjang 6 harakat",
          letters: [],
          examples: ["وَﻻَالضَّآلِّينَ (QS. Al-Fatihah:7)", "اَلصّاخَةُ (QS. Abasa:33)", "الْحَآقَّةُ (QS. Al-Haqqah:1)"]
        },
        {
          name: "Mad Layyin",
          description: "Wau/ya sukun didahului fathah diwaqafkan, panjang 2-6 harakat",
          letters: ["و", "ي"],
          examples: ["الْخَيْرُ (QS. Al-Lail:5)", "بِأَيْدِي (QS. Al-Waqi'ah:96)", "بِنَاء (QS. At-Tawbah:109)"]
        },
        {
          name: "Mad 'Arid Lissukun",
          description: "Mad thabi'i diwaqafkan, panjang 2-6 harakat",
          letters: [],
          examples: ["الرَّحْمٰنِ (QS. Al-Fatihah:3)", "الْعَالَمِيْنَ (QS. Al-Fatihah:2)", "الضَّالِّيْنَ (QS. Al-Fatihah:7)"]
        }
      ]
    },
    {
      id: "qalqalah",
      title: "Qalqalah",
      description: "Hukum bacaan memantul pada huruf tertentu",
      rules: [
        {
          name: "Qalqalah Sughra",
          description: "Qalqalah kecil di tengah kata (huruf sukun asli)",
          letters: ["ب", "ج", "د", "ط", "ق"],
          examples: ["يَطْمَعُ (QS. Al-Qiyamah:5)", "يَبْخَلُ (QS. Al-Isra:100)", "أَقْتَلَ (QS. Al-Maidah:28)"]
        },
        {
          name: "Qalqalah Kubra",
          description: "Qalqalah besar di akhir kata karena waqaf (huruf sukun karena waqaf)",
          letters: ["ب", "ج", "د", "ط", "ق"],
          examples: ["تَبَّتْ (QS. Al-Masad:1)", "أَلَمْ نَخْلُقْ (QS. Al-Mursalat:20)", "وَالْفَجْرِ (QS. Al-Fajr:1)"]
        },
        {
          name: "Qalqalah Wusta",
          description: "Qalqalah sedang di tengah kata karena waqaf",
          letters: ["ب", "ج", "د", "ط", "ق"],
          examples: ["مَرْقَدِنَا (QS. Yasin:52)", "يَلْهَثْ (QS. Al-A'raf:176)", "الْحُبُكِ (QS. Adz-Dzariyat:7)"]
        }
      ]
    },
    {
      id: "tafkhim-tarqiq",
      title: "Tafkhim dan Tarqiq",
      description: "Hukum tebal dan tipisnya bacaan huruf Ra",
      rules: [
        {
          name: "Tafkhim",
          description: "Ra dibaca tebal",
          conditions: [
            "Ra berharakat fathah atau dammah",
            "Ra sukun setelah huruf berharakat fathah/dammah",
            "Ra di waqaf setelah alif atau wau",
            "Ra setelah hamzah washal"
          ],
          examples: ["رَسول (QS. Al-Baqarah:143)", "تَرْمِيْهِمْ (QS. Al-Fil:4)", "الصدور (QS. At-Tariq:9)", "ارْجِعِي (QS. Al-Fajr:28)"]
        },
        {
          name: "Tarqiq",
          description: "Ra dibaca tipis",
          conditions: [
            "Ra berharakat kasrah",
            "Ra sukun setelah huruf berharakat kasrah",
            "Ra di waqaf setelah ya sukun",
            "Ra setelah hamzah qath'"
          ],
          examples: ["اَلْبَرِيَّـةِ (QS. Al-Bayyinah:6)", "وأنذرهم (QS. Al-An'am:19)", "حجر (QS. Al-Hijr:80)", "ارْزُقْنَا (QS. Al-Baqarah:126)"]
        }
      ]
    },
    {
      id: "idgham",
      title: "Hukum Idgham",
      description: "Hukum pertemuan dua huruf",
      rules: [
        {
          name: "Idgham Mutamatsilain",
          description: "Pertemuan dua huruf sama makhraj dan sifat (huruf pertama sukun)",
          letters: [],
          examples: ["إِذ ذَّهَبَ (QS. At-Tawbah:38)", "وَقَدْ دَّخَلُوْا (QS. Yusuf:99)", "عَفَـواْ وَّقَالُواْ (QS. Al-Baqarah:237)"]
        },
        {
          name: "Idgham Mutajanisain",
          description: "Pertemuan dua huruf sama makhraj beda sifat",
          letters: [["ط", "د", "ت"], ["ظ", "ذ", "ث"], ["م", "ب"]],
          examples: ["وَدَّت طَّـآئِفَةٌ (QS. Ali Imran:72)", "لَئِن بَسَطتَ (QS. Al-Maidah:28)", "يَلْهَث ذَّلِكَ (QS. Al-A'raf:176)"]
        },
        {
          name: "Idgham Mutaqaribain",
          description: "Pertemuan dua huruf berdekatan makhraj",
          letters: [["ق", "ك"], ["ل", "ر"]],
          examples: ["اَلَمْ نَخْلُقْكُّمْ (QS. Al-Mursalat:20)", "وَقُـل رَّبِّ (QS. Al-Isra:24)", "بَل رَّفَعَهُ (QS. An-Nisa:158)"]
        },
        {
          name: "Idgham Shaghir",
          description: "Idgham dimana huruf pertama sukun dan kedua berharakat",
          letters: [],
          examples: ["مَن يَّقُولُ (QS. Al-Baqarah:8)", "عَلَى اللَّهِ تَوَكَّلْتُ (QS. Hud:56)"]
        }
      ]
    },
    {
      id: "bacaan-khusus",
      title: "Bacaan Khusus",
      description: "Bacaan unik dalam Al-Qur'an",
      rules: [
        {
          name: "Isymam",
          description: "Monyongkan bibir tanpa suara pada bacaan tertentu",
          examples: ["لَا تَأْمَنَّا (QS. Yusuf:11 - riwayat Warsy)", "بِمَا غَفَرَ لِي رَبِّي (QS. Yasin:27)"]
        },
        {
          name: "Imalah",
          description: "Membaca fathah condong ke kasrah (e seperti dalam 'bek')",
          examples: ["مَجۭرَىٰهَا (QS. Hud:41 - riwayat Hafs)", "هَلۡ أَتَىٰ (QS. Al-Insan:1)"]
        },
        {
          name: "Saktah",
          description: "Berhenti sejenak tanpa bernafas (2 harakat)",
          examples: [
            "وَلَمْ يَجْعَل لَّهُۥ عِوَجَا ۜ قَيِّمًا (QS. Al-Kahf:1-2)",
            "مِن مَّرْقَدِنَا ۜ هَـٰذَا (QS. Yasin:52)",
            "كَلَّا بَلْ ۜ رَانَ (QS. Al-Mutaffifin:14)"
          ]
        },
        {
          name: "Naql",
          description: "Memindahkan harakat hamzah ke huruf sebelumnya",
          examples: ["فَأَيُّۡمَ (QS. Al-Baqarah:226 - riwayat Warsy)", "بِئۡسَ (QS. Al-Baqarah:90)"]
        }
      ]
    },
    {
      id: "tanda-waqaf",
      title: "Tanda Waqaf",
      description: "Simbol-simbol penghentian bacaan dalam Al-Qur'an",
      rules: [
        {
          name: "Waqaf Lazim (مـ)",
          description: "Harus berhenti (jika tidak berhenti akan mengubah makna)",
          examples: ["أَنُلۡزِمُكُمُوهَا وَأَنتُمۡ لَهَا كَٰرِهُونَ ۩ (QS. Hud:28)"]
        },
        {
          name: "Waqaf Jaiz (ج)",
          description: "Boleh berhenti atau lanjut",
          examples: ["لِّلَّهِ مَا فِي ٱلسَّمَٰوَٰتِ وَمَا فِي ٱلۡأَرۡضِۚ (QS. Al-Baqarah:284)"]
        },
        {
          name: "Waqaf Mamnu' (لا)",
          description: "Tidak boleh berhenti",
          examples: ["لَآ أُقۡسِمُ بِيَوۡمِ ٱلۡقِيَٰمَةِ (QS. Al-Qiyamah:1)"]
        },
        {
          name: "Saktah (س)",
          description: "Berhenti sejenak tanpa bernafas (2 harakat)",
          examples: ["وَلَمۡ يَجۡعَل لَّهُۥ عِوَجَاۜ (QS. Al-Kahf:1)"]
        },
        {
          name: "Waqaf Murakhkhas (صلي)",
          description: "Boleh berhenti darurat meskipun tidak sempurna",
          examples: ["وَإِن يَمۡسَسۡكَ ٱللَّهُ بِضُرّٖ فَلَا كَاشِفَ لَهُۥٓ إِلَّا هُوَۖ (QS. Al-An'am:17)"]
        }
      ]
    },
    {
      id: "lam-jalalah",
      title: "Hukum Lam Jalalah",
      description: "Bacaan Lafaz Allah (ﷲ)",
      rules: [
        {
          name: "Tafkhim",
          description: "Dibaca tebal jika sebelum lam jalalah ada harakat fathah/dammah",
          examples: ["نَصْرُ اللهِ (QS. Ash-Shaff:13)", "رَسُولُ اللهِ (QS. Al-Baqarah:98)"]
        },
        {
          name: "Tarqiq",
          description: "Dibaca tipis jika sebelum lam jalalah ada harakat kasrah",
          examples: ["بِسْمِ اللهِ (QS. Al-Fatihah:1)", "فِي سَبِيلِ اللهِ (QS. Al-Baqarah:154)"]
        }
      ]
    },
    {
      id: "alif-lam-mafrifah",
      title: "Hukum Alif Lam Ma'rifah",
      description: "Bacaan Alif Lam (ال) pada isim ma'rifah",
      rules: [
        {
          name: "Idgham Syamsiyyah",
          description: "Lam diidghamkan ke huruf berikutnya (14 huruf syamsiyyah)",
          letters: ["ت", "ث", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ل", "ن"],
          examples: ["ٱلشَّمۡسُ (QS. Yusuf:4)", "ٱلرَّحۡمَٰنِ (QS. Al-Fatihah:3)"]
        },
        {
          name: "Izhar Qamariyyah",
          description: "Lam dibaca jelas (14 huruf qamariyyah)",
          letters: ["أ", "ب", "غ", "ح", "ج", "ك", "و", "خ", "ف", "ع", "ق", "ي", "م", "ه"],
          examples: ["ٱلۡقَمَرُ (QS. Yusuf:4)", "ٱلۡهَدۡيَ (QS. Al-Baqarah:196)"]
        }
      ]
    },
    {
      id: "ghunnah",
      title: "Hukum Ghunnah",
      description: "Hukum dengung pada Nun dan Mim tasydid",
      rules: [
        {
          name: "Ghunnah Musyaddadah",
          description: "Dengung wajib selama 2 harakat pada huruf bertasydid",
          letters: ["ن", "م"],
          examples: ["إِنَّ (QS. Al-Ikhlas:1)", "ثُمَّ (QS. Al-Baqarah:29)", "أَمَّن (QS. An-Naml:60)"]
        },
        {
          name: "Ghunnah Maal Ghunnah",
          description: "Dengung pada Idgham Bighunnah dan Iqlab",
          letters: [],
          examples: ["مِن يَّقُولُ (Idgham Bighunnah)", "لَيُنۢبَذَنَّ (Iqlab)"]
        }
      ]
    },
    {
      id: "makharij-huruf",
      title: "Makharijul Huruf",
      description: "Tempat keluar huruf hijaiyah",
      rules: [
        {
          name: "Al-Jauf (Rongga mulut)",
          letters: ["ا", "و", "ي"],
          examples: ["قالَ (QS. Al-Baqarah:34)", "نُوحِ (QS. Al-Isra:3)"]
        },
        {
          name: "Al-Halq (Tenggorokan)",
          letters: ["ء", "ه", "ع", "ح", "غ", "خ"],
          examples: ["أَعُوذُ (QS. An-Nahl:98)", "خَلَقَ (QS. Al-A'la:2)"]
        },
        {
          name: "Al-Lisan (Lidah)",
          letters: ["ق", "ك", "ش", "ج", "ض", "ل", "ن", "ر", "ط", "د", "ت", "ص", "ز", "س", "ظ", "ذ", "ث"],
          examples: ["قُلْ (QS. Al-Ikhlas:1)", "ن (QS. Al-Qalam:1)"]
        },
        {
          name: "Asy-Syafatain (Bibir)",
          letters: ["ب", "م", "و", "ف"],
          examples: ["بسم (QS. Al-Fatihah:1)", "مُحَمَّدٌ (QS. Al-Fath:29)"]
        },
        {
          name: "Al-Khaisyum (Rongga hidung)",
          description: "Khusus untuk ghunnah",
          letters: [],
          examples: ["مَنْ يَّقُولُ (Ghunnah pada Idgham Bighunnah)"]
        }
      ]
    }
  ];

  // Filter berdasarkan ID kategori
  if (id) {
    const category = tajwidData.find(item => item.id === id);
    
    if (!category) {
      return new Response(JSON.stringify({ error: "Kategori tidak ditemukan" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Filter berdasarkan nama rule
    if (rule) {
      const specificRule = category.rules.find(r => 
        r.name.toLowerCase().replace(/\s/g, '-') === rule.toLowerCase().replace(/\s/g, '-')
      );

      if (!specificRule) {
        return new Response(JSON.stringify({ error: "Hukum tidak ditemukan" }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        id: category.id,
        title: category.title,
        rule: specificRule
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600' 
        }
      });
    }

    return new Response(JSON.stringify(category), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' 
      }
    });
  }

  // Return semua data jika tidak ada parameter
  return new Response(JSON.stringify(tajwidData), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600' 
    }
  });
}