export async function GET(req) {
  const doaList = [
    {
      id: 1,
      title: "Doa Mohon Perlindungan",
      ayat: "رَبِّ إِنِّي أَعُوذُ بِكَ أَنْ أَسْأَلَكَ مَا لَيْسَ لِي بِهِ عِلْمٌ ۖ وَإِلَّا تَغْفِرْ لِي وَتَرْحَمْنِي أَكُنْ مِنَ الْخَاسِرِينَ",
      arti: "Ya Tuhanku, sungguh aku berlindung kepada-Mu dari memohon sesuatu yang aku tidak mengetahui hakikatnya. Dan sekiranya Engkau tidak memberi ampunan serta tidak menaruh belas kasihan kepadaku, niscaya aku akan termasuk golongan orang-orang yang merugi. (QS. Hûd: 47)"
    },
    {
      id: 2,
      title: "Doa Mohon Keselamatan",
      ayat: "رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِلْقَوْمِ الظَّالِمِينَ . وَنَجِّنَا بِرَحْمَتِكَ مِنَ الْقَوْمِ الْكَافِرِينَ",
      arti: "Ya Tuhan, janganlah Engkau jadikan kami sasaran fitnah bagi kaum yang zhalim, dan selamatkanlah kami dengan curahan rahmat-Mu dari tipu daya orang- orang yang kafir. (Qs. Yûnus: 85-86)"
    },
    {
      id: 3,
      title: "Doa Mohon Keadilan",
      ayat: "رَبَّنَا افْتَحْ بَيْنَنَا وَبَيْنَ قَوْمِنَا بِالْحَقِّ وَأَنْتَ خَيْرُ الْفَاتِحِينَ",
      arti: "Ya Tuhan, berilah keputusan antara kami dan kaum kami dengan haq (adil). Engkaulah Pemberi keputusan yang sebaik-baiknya. (QS. Al-A'râf: 89)"
    },
    {
      id: 4,
      title: "Doa Mohon Perlindungan dari Api Neraka",
      ayat: "رَبَّنَا لَا تَجْعَلْنَا مَعَ الْقَوْمِ الظَّالِمِينَ",
      arti: "Ya Tuhan, janganlah Engkau tempatkan kami bersama-sama dengan orangorang zhalim. (QS. Al-A'râf: 47)"
    },
    {
      id: 5,
      title: "Doa Penyesalan / Istighfar Nabi Adam",
      ayat: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
      arti: "Ya Tuhan, kami telah menganiaya dm kami sendiri, dan jika Engkau tidak mengampuni kami serta memberi rahmat kepada kami, niscaya kami termasuk orangorang yang merugi. (QS. Al-A'râf: 23)"
    },
    {
      id: 6,
      title: "Do’a Husnul Khâtimah (akhir yang baik)",
      ayat: "رَبَّنَا وَآتِنَا مَا وَعَدْتَنَا عَلَىٰ رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ ۗ إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ . رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا ۚ رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ",
      arti: 'Ya Tuhan sungguh kami telah mendengar seruan yang menyeru kepada iman: "Barimanlah kamu kepada Tuhanmu, maka kami pun beriman. Ya Tuhan, ampunilah dosadosa kami dan hapuskanlah kesalahan-kesalahan kami, serta matikanlah kami beserta orang-orang yang banyak berbuat kebajikan. Ya Tuhan, berilah kami apa yang telah Engkau janjikan kepada kami dengan perantaraan rasul-rasulMu, dan janganlah Engkau hinakan kami pada hari kiamat nanti. Sungguh Engkau sama sekali tidak akan pernah menyalahi janji." (QS. Âli Imrân: 193-294)'
    },
    {
      id: 7,
      title: "Doa Kekuatan Iman",
      ayat: "رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ",
      arti: "Ya Tuhan, sungguh kami telah beriman, maka ampunilah segala dosa kami, dan selamatkanlah kami dari siksa neraka. (QS. Âli 'Imrân: 16)"
    },
    {
      id: 8,
      title: "Doa Diberi Keteguhan Iman",
      ayat: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً ۚ إِنَّكَ أَنْتَ الْوَهَّابُ",
      arti: "Ya Tuhan, janganlah Engkau jadikan hati kami condong kepada kesesatan sesudah Engkau berikan petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisiMu. Sungguh hanya Engkaulah Yang Maha Pemberi karunia. (QS. Âli 'Imrân: 8)"
    },
    {
      id: 9,
      title: "Doa Tabah Menghadapi Lawan",
      ayat: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
      arti: "Ya Tuhan, limpahkanlah kesabaran atas diri kami, kokohkanlah pendirian kami, serta tolonglah kami dalam mengalahkan orang-orang kafir. (QS. Al-Baqarah: 250)"
    },
    {
      id: 10,
      title: "Doa Mohon Kebaikan Dunia Akhirat",
      ayat: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      arti: "Ya Tuhan, berilah kami kebaikan di dunia dan kebaikan di akhirat, serta selamatkanlah kami dari siksa neraka. (QS. AlBaqarah: 201)"
    },
    {
      id: 11,
      title: "Doa mohon dikaruniakan anak sholeh (Do’a Pertama)",
      ayat: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
      arti: "Wahai Robb kami, karuniakanlah pada kami dan keturunan kami serta istri-istri kami penyejuk mata kami. Jadikanlah pula kami sebagai imam bagi orang-orang yang bertakwa (QS. Al Furqon: 74)"
    },
    {
      id: 12,
      title: "Doa mohon dikaruniakan anak sholeh (Do’a Kedua)",
      ayat: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَصْلِحْ لِي فِي ذُرِّيَّتِي",
      arti: "Wahai Robbku, ilhamkanlah padaku untuk bersyukur atas nikmatmu yang telah Engkau karuniakan padaku juga pada orang tuaku. Dan ilhamkanlah padaku untuk melakukan amal sholeh yang Engkau ridhoi dan perbaikilah keturunanku (QS. Al Ahqof: 15)"
    },
    {
      id: 13,
      title: "Doa Untuk Kedua Orang Tua",
      ayat: "اَللّهُمَّ اغْفِرْلِيْ وَلِوَالِدَيَّ وَارْحَمْهُمَاكَمَارَبَّيَانِيْ صَغِيْرَا.",
      arti: "Wahai Tuhanku, ampunilah aku dan Ibu Bapakku, sayangilah mereka seperti mereka menyayangiku diwaktu kecil"
    },
    {
      id: 14,
      title: "Doa Memohon Rahmat untuk Orang Tua",
      ayat: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
      arti: "Wahai Tuhanku, sayangilah keduanya sebagaimana mereka berdua menyayangiku di waktu kecil. (QS. Al-Isra': 24)"
    },
    {
      id: 15,
      title: "Doa Kesembuhan untuk Orang Tua Sakit",
      ayat: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِهِ وَأَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ",
      arti: "Ya Allah, Tuhan manusia, hilangkanlah penyakit. Berikan kesembuhan, Engkau Zat Yang Maha Menyembuhkan. Tiada kesembuhan kecuali kesembuhan dari-Mu. (HR. Bukhari-Muslim)"
    },
    {
      id: 16,
      title: "Doa Ampunan untuk Orang Tua Meninggal",
      ayat: "اللَّهُمَّ اغْفِرْ لِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا وَلِجَمِيعِ الْمُؤْمِنِينَ",
      arti: "Ya Allah, ampunilah dosa kedua orang tuaku, sayangilah mereka sebagaimana mereka mendidikku di waktu kecil, dan ampunilah seluruh kaum mukminin."
    },
    {
      id: 17,
      title: "Doa Sapu Jagad untuk Orang Tua",
      ayat: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      arti: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, serta lindungilah kami dari siksa neraka. (QS. Al-Baqarah: 201)"
    },
    {
      id: 18,
      title: "Doa Kebaikan Dunia-Akhirat untuk Keluarga",
      ayat: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
      arti: "Ya Tuhan kami, anugerahkanlah pasangan dan keturunan yang menyenangkan hati, serta jadikanlah kami pemimpin bagi orang-orang bertakwa. (QS. Al-Furqan: 74)"
    },
    {
      id: 19,
      title: "Doa Perlindungan untuk Orang Tua",
      ayat: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
      arti: "Ya Tuhan kami, ampunilah aku, kedua orang tuaku, dan orang-orang mukmin pada hari perhitungan. (QS. Ibrahim: 41)"
    },
    {
      id: 20,
      title: "Doa Penutup Acara (mencakup orang tua)",
      ayat: "سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ وَسَلَامٌ عَلَى الْمُرْسَلِينَ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      arti: "Maha Suci Tuhanmu Pemilik Keagungan dari segala tuduhan, dan salam sejahtera bagi para rasul. Segala puji bagi Allah Tuhan semesta alam."
    },
    {
      id: 21,
      title: "Doa Bangun Tidur",
      ayat: "اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      arti: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kebangkitan. (HR. Bukhari)"
    },
    {
      id: 22,
      title: "Doa Masuk Kamar Mandi",
      ayat: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
      arti: "Ya Allah, sesungguhnya aku berlindung kepada-Mu dari setan laki-laki dan setan perempuan. (HR. Bukhari)"
    },
    {
      id: 23,
      title: "Doa Keluar Kamar Mandi",
      ayat: "غُفْرَانَكَ الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِي",
      arti: "Aku memohon ampunan-Mu. Segala puji bagi Allah yang telah menghilangkan kotoran dariku dan telah menyehatkanku. (HR. Ibnu Majah)"
    },
    {
      id: 24,
      title: "Doa Sebelum Makan",
      ayat: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
      arti: "Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami, dan lindungilah kami dari siksa neraka. (HR. Ibnu Majah)"
    },
    {
      id: 25,
      title: "Doa Sesudah Makan",
      ayat: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
      arti: "Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami termasuk orang-orang muslim. (HR. Abu Dawud)"
    },
    {
      id: 26,
      title: "Doa Masuk Rumah",
      ayat: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا",
      arti: "Ya Allah, aku memohon kebaikan tempat masuk dan kebaikan tempat keluar. Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Tuhan kami bertawakal. (HR. Abu Dawud)"
    },
    {
      id: 27,
      title: "Doa Keluar Rumah",
      ayat: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      arti: "Dengan nama Allah, aku bertawakkal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah. (HR. Tirmidzi)"
    },
    {
      id: 28,
      title: "Doa Memakai Pakaian",
      ayat: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      arti: "Segala puji bagi Allah yang telah memberiku pakaian ini dan memberiku rezeki tanpa daya dan kekuatan dariku. (HR. Abu Dawud)"
    },
    {
      id: 29,
      title: "Doa Bercermin",
      ayat: "اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
      arti: "Ya Allah, sebagaimana Engkau telah membaguskan rupaku, maka baguskanlah akhlakku. (HR. Ahmad)"
    },
    {
      id: 30,
      title: "Doa Pagi Hari",
      ayat: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
      arti: "Ya Allah, dengan-Mu kami memasuki pagi, dengan-Mu kami memasuki petang, dengan-Mu kami hidup, dengan-Mu kami mati, dan kepada-Mu kebangkitan. (HR. Tirmidzi)"
    },
    {
      id: 31,
      title: "Doa Sebelum Tidur",
      ayat: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      arti: "Dengan nama-Mu ya Allah, aku mati dan aku hidup. (HR. Bukhari)"
    },
    {
      id: 32,
      title: "Doa Setelah Adzan",
      ayat: "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ",
      arti: "Ya Allah, Tuhan pemilik dakwah yang sempurna ini dan shalat yang didirikan, berikanlah kepada Muhammad wasilah dan keutamaan. (HR. Bukhari)"
    },
    {
      id: 33,
      title: "Doa Memohon Ilmu Bermanfaat",
      ayat: "رَبِّ زِدْنِي عِلْمًا",
      arti: "Ya Tuhanku, tambahkanlah ilmu kepadaku. (QS. Thaha: 114)"
    },
    {
      id: 34,
      title: "Doa Mohon Kesehatan Lahir Batin",
      ayat: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي",
      arti: "Ya Allah, sehatkanlah badanku. Ya Allah, sehatkanlah pendengaranku. Ya Allah, sehatkanlah penglihatanku. (HR. Abu Dawud)"
    },
    {
      id: 35,
      title: "Doa Naik Kendaraan",
      ayat: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
      arti: "Mahasuci Allah yang telah menundukkan kendaraan ini untuk kami, padahal sebelumnya kami tidak mampu. Dan sesungguhnya kepada Tuhan kami, kami akan kembali. (QS. Az-Zukhruf: 13)"
    },
    {
      id: 36,
      title: "Doa Masuk Masjid",
      ayat: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      arti: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu. (HR. Muslim)"
    },
    {
      id: 37,
      title: "Doa Keluar Masjid",
      ayat: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
      arti: "Ya Allah, sesungguhnya aku memohon kepada-Mu dari karunia-Mu. (HR. Muslim)"
    },
    {
      id: 38,
      title: "Doa Ketika Hujan",
      ayat: "اللَّهُمَّ صَيِّبًا نَافِعًا",
      arti: "Ya Allah, turunkanlah hujan yang bermanfaat. (HR. Bukhari)"
    },
    {
      id: 39,
      title: "Doa Setelah Hujan",
      ayat: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ",
      arti: "Kita diberi hujan karena karunia dan rahmat Allah. (HR. Bukhari)"
    },
    {
      id: 40,
      title: "Doa Ketika Angin Bertiup",
      ayat: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَأَعُوذُ بِكَ مِنْ شَرِّهَا",
      arti: "Ya Allah, aku memohon kepada-Mu kebaikan angin ini dan aku berlindung kepada-Mu dari keburukannya. (HR. Abu Dawud)"
    },
    {
      id: 41,
      title: "Doa Melihat Bulan",
      ayat: "اللَّهُ أَكْبَرُ، اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ",
      arti: "Allah Maha Besar, ya Allah, tampakkanlah bulan itu kepada kami dengan membawa keamanan, keimanan, keselamatan, dan Islam. (HR. Tirmidzi)"
    },
    {
      id: 42,
      title: "Doa Memohon Rezeki",
      ayat: "اللَّهُمَّ أَغْنِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَبِطَاعَتِكَ عَنْ مَعْصِيَتِكَ وَبِفَضْلِكَ عَمَّنْ سِوَاكَ",
      arti: "Ya Allah, cukupkanlah aku dengan yang halal dan jauhkanlah aku dari yang haram, cukupkanlah aku dengan taat kepada-Mu dan jauhkanlah aku dari bermaksiat kepada-Mu, dan cukupkanlah aku dengan karunia-Mu daripada bergantung pada selain-Mu. (HR. Tirmidzi)"
    },
    {
      id: 43,
      title: "Doa Ketika Sakit",
      ayat: "اللَّهُمَّ رَبَّ النَّاسِ مُذْهِبَ الْبَأْسِ اشْفِ أَنْتَ الشَّافِي لَا شَافِيَ إِلَّا أَنْتَ",
      arti: "Ya Allah, Tuhan manusia, hilangkanlah penyakit. Berikanlah kesembuhan, Engkau Zat Yang Maha Menyembuhkan. Tidak ada yang dapat menyembuhkan kecuali Engkau. (HR. Bukhari)"
    }
  ];

  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const perPage = parseInt(searchParams.get('per_page')) || 10;

  let filtered = doaList;
  
  // Filter berdasarkan judul jika ada parameter title
  if (title) {
    filtered = doaList.filter(item =>
      item.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  // Paginasi
  const total = filtered.length;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  // Response
  const response = {
    status: 'success',
    developer: 'devnova-id',
    total,
    page,
    per_page: perPage,
    data: paginated
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'X-Developer': 'devnova-id'
    }
  });
}