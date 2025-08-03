// app/api/fikih-nikah/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bagian = searchParams.get('bagian');

  const semuaBagian = {
    bagian1: {
      title: "Fikih Nikah (Bag. 1)",
      source: "https://muslim.or.id/71772-fikih-nikah-bag-1.html",
      author: "Muhammad Idris, Lc.",
      content: [
        {
          sectionTitle: "Kedudukan Pernikahan Di Dalam Islam, Pengertian, dan Rukunnya",
          paragraphs: [
            "Salah satu ujian yang Allah Ta’ala berikan untuk mereka yang hidup di akhir zaman adalah tersebarnya fitnah syahwat, di mana manusia begitu mudahnya mengumbar aurat, baik itu berpakaian minim ataupun berpakaian namun membentuk lekuk tubuh. Belum lagi betapa mudahnya kita menemukan dan mendapati foto maupun video yang menampilkan hal-hal yang tidak pantas untuk kita lihat. Ini semua sejalan dengan hadis Nabi shallallahu 'alaihi wasallam,",
            "صِنْفَانِ مِنْ أَهْلِ النَّارِ لَمْ أَرَهُمَا، قَوْمٌ مَعَهُمْ سِيَاطٌ كَأَذْنَابِ الْبَقَرِ يَضْرِبُونَ بِهَا النَّاسَ، وَنِسَاءٌ كَاسِيَاتٌ عَارِيَاتٌ مُمِيلَاتٌ مَائِلَاتٌ، رُءُوسُهُنَّ كَأَسْنِمَةِ الْبُخْتِ الْمَائِلَةِ، لَا يَدْخُلْنَ الْجَنَّةَ، وَلَا يَجِدْنَ رِيحَهَا، وَإِنَّ رِيحَهَا لَيُوجَدُ مِنْ مَسِيرَةِ كَذَا وَكَذَا",
            "“Dua (jenis manusia) dari ahli neraka yang aku belum melihatnya sekarang, yaitu: kaum yang membawa cemeti-cemeti seperti ekor sapi yang mereka memukul manusia dengannya dan perempuan-perempuan yang berpakaian tapi telanjang, yang berjalan berlenggak lenggok yang kepala mereka seperti punuk unta yang condong. Mereka tidak akan masuk surga bahkan tidak akan mendapati wanginya, padahal sesungguhnya wangi surga itu telah tercium dari jarak perjalanan sekian dan sekian.” (HR. Muslim)",
            "Harus kita ketahui, tidaklah Allah Ta’ala menurunkan cobaan dan fitnah, kecuali pasti Allah Ta’ala menurunkan penangkalnya serta memberikan penggantinya. Fitnah syahwat ini sudah Allah Ta’ala takdirkan terjadi di zaman kita, namun tentu saja Allah sudah memberikan solusinya. Apa itu?",
            "Menikah. Rasulullah sangat menganjurkan umatnya untuk menikah, terutama untuk para pemudanya. Nabi shallallahu 'alaihi wasallam bersabda,",
            "يَا مَعْشَرَ الشَّبَابِ مَنِ اسْتَطَاعَ مِنْكُمُ الْبَاءَةَ فَلْيَتَزَوَّجْ، فَإِنَّهُ أَغَضُّ لِلْبَصَرِ وَأَحْصَنُ لِلْفَرْجِ، وَمَنْ لَمْ يَسْتَطِعْ فَعَلَيْهِ بِالصَّوْمِ فَإِنَّهُ لَهُ وِجَاءٌ",
            "“Wahai para pemuda! Barangsiapa di antara kalian berkemampuan untuk menikah, maka menikahlah. Karena sesunguhnya nikah itu lebih menundukkan pandangan dan lebih menjaga kemaluan. Dan barangsiapa yang tidak mampu, maka hendaklah ia berpuasa. Karena sesungguhnya puasa itu dapat membentengi dirinya.” (HR. Bukhari, Muslim, Tirmidzi, dan lainnya)",
            "Pernikahan merupakan salah satu kenikmatan terbesar yang Allah Ta’ala berikan kepada kita, serta merupakan salah satu ibadah yang paling agung. Dengannya kita akan meraih ketenangan hati, ketentraman jiwa, serta menjaga kehormatan diri kita. Allah Ta’ala berfirman,",
            "ومِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۗاِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ",
            "“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri agar kamu cenderung dan merasa tenteram kepadanya dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.” (QS. Ar-Rum: 21)",
            "Yang tidak kalah penting, pernikahan merupakan pintu untuk kebaikan-kebakaran lainnya. Salah satunya adalah ia merupakan wasilah keselamatan dan ladang pahala jika kita sudah meninggal dunia. Bagaimana bisa? Ya, ketika dengan pernikahan ini kita dikaruniai anak-anak saleh yang selalu mendoakan kita, dan memintakan ampunan untuk kita kelak ketika kita meninggal, ketika diri kita sudah tidak mampu melakukan semua hal. Rasulullah shallallahu 'alaihi wasallam bersabda,",
            "إِذَا مَاتَ ابْنُ آدَمَ انْقَطَعَ عَمَلُهُ إِلا مِنْ ثَلاثٍ : صَدَقَةٍ جَارِيَةٍ ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
            "“Ketika seseorang telah meninggal dunia, maka terputuslah amalnya, kecuali 3 (perkara), yaitu : sedekah jariyah, ilmu yang bermanfaat, dan anak saleh yang mendoakannya.” (HR. Muslim)"
          ]
        },
        {
          sectionTitle: "Definisi Pernikahan dan Hukumnya di dalam Islam",
          paragraphs: [
            "Kata pernikahan berasal dari bahasa Arab, yaitu 'An-nikah' yang memiliki beberapa makna. Menurut bahasa, kata “nikah” berarti berkumpul, bersatu, dan berhubungan. Sedangkan menurut istilah fikih sebagaimana yang tertera di dalam kitab-kitab fikih-fikih mazhab Syafi’i, pernikahan adalah “akad yang membolehkan hubungan seksual dengan lafaz nikah, tazwij, atau lafadz lain dengan makna serupa”.",
            "Sedangkan hukum pernikahan, maka itu tergantung berdasarkan kondisi yang terjadi pada kedua calon pasangan pengantin. Hukum pernikahan dalam Islam dibagi ke dalam beberapa jenis, yakni:",
            "1. Wajib: Jika baik pihak laki-laki dan perempuan sudah memasuki usia wajib nikah, tidak ada halangan, mampu membayar mahar dan menafkahi, serta ia yakin akan terjatuh ke dalam zina jika tidak menikah.",
            "2. Sunah: Kondisi di mana seseorang memiliki kemauan dan kemampuan untuk menikah, namun belum juga melaksanakannya dan masih terhindar dari zina.",
            "3. Haram: Ketika pernikahan dilaksanakan saat seseorang tidak memiliki keinginan dan kemampuan untuk menikah, namun dipaksakan.",
            "4. Makruh: Apabila seseorang memiliki kemampuan untuk menahan diri dari perbuatan zina namun belum berkeinginan menikah.",
            "5. Mubah: Jika pernikahan dilakukan oleh orang yang memiliki kemampuan dan keinginan, tetapi jika tidak menikah pun dia bisa menahan diri dari zina."
          ]
        },
        {
          sectionTitle: "Rukun Nikah dan Syarat-Syaratnya",
          paragraphs: [
            "Rukun nikah adalah semua perkara yang wajib dilaksanakan untuk menentukan sah atau tidaknya sebuah pernikahan. Rukun pernikahan dalam Islam ada 5 hal:",
            "1. Calon pengantin pria: Beragama Islam, tidak sedang ihram, keinginan sendiri, identitas jelas, mengetahui calon istri bukan dari kategori haram.",
            "2. Calon pengantin perempuan: Tidak sedang ihram, identitas jelas, berstatus single, tidak dalam masa iddah.",
            "3. Wali: Hadis Nabi: 'Tidak (sah) nikah, kecuali dengan kehadiran wali dan dua orang saksi.' (HR. Thabrani). Syarat wali: merdeka, laki-laki, dewasa, akal sehat, tidak fasik.",
            "4. Dua orang saksi: Kompeten di bidang persaksian dan tidak dirangkap sebagai wali.",
            "5. Ijab dan qabul: Akad antara calon suami dan wali. Syarat: Menggunakan kata zawwajtuka/ankahtuka, dibaca jelas, tanpa jeda, tanpa syarat."
          ]
        }
      ]
    },
    bagian2: {
      title: "Fikih Nikah (Bag. 2)",
      source: "https://muslim.or.id/71774-fikih-nikah-bag-2.html",
      author: "Muhammad Idris, Lc.",
      content: [
        {
          sectionTitle: "Siapakah yang berhak menjadi wali nikah seorang wanita?",
          paragraphs: [
            "Keberadaan wali merupakan satu dari lima rukun nikah. Wali adalah sebutan pihak laki-laki dalam keluarga atau lainnya, yang bertugas untuk mengawasi keadaan atau kondisi seorang perempuan, khususnya berkenaan dengan menikah. Hal ini secara jelas ditegaskan oleh Rasulullah Shallallahu 'alaihi wasallam:",
            "أَيُّمَا امْرَأَةٍ نَكَحَتْ بِغَيْرِ إذْنِ وَلِيِّهَا فَنِكَاحُهَا بَاطِلٌ، فَنِكَاحُهَا بَاطِلٌ، فَنِكَاحُهَا بَاطِلٌ",
            "“Wanita yang menikah tanpa wali, maka pernikahannya batal. Pernikahannya batal. Pernikahannya batal” (HR. Imam yang lima, kecuali Nasa’i).",
            "Rasulullah juga bersabda:",
            "لَا تُزَوِّجُ الْمَرْأَةُ الْمَرْأَةَ، وَلَا تُزَوِّجُ الْمَرْأَةُ نَفْسَهَا",
            "“Hendaklah perempuan tidak menikahkan perempuan, dan hendaklah perempuan tidak menikahkan dirinya sendiri” (HR. Ibnu Majah dan Daruqutni).",
            "Wali/wilayah secara bahasa Arab artinya 'menolong' dan 'berkuasa'. Sedangkan dalam istilah fikih, wali artinya 'kekuasaan atau otoritas yang dimiliki seseorang untuk secara langsung melakukan suatu tindakan tanpa harus bergantung atas izin orang lain.'"
          ]
        },
        {
          sectionTitle: "Urutan Prioritas Wali Nikah",
          paragraphs: [
            "Menurut Abu Syuja' dalam Matan al-Ghâyah wa Taqrîb:",
            "أولى الولاة الأب ثم الجد أبو الأب ثم الأخ للأب والأم ثم الأخ للأب ثم ابن الأخ للأب والأم ثم ابن الأخ للأب ثم العم ثم ابنه على هذا الترتيب فإذا عدمت العصبات ف…الحاكم",
            "Urutan prioritas wali nikah:",
            "1. Ayah",
            "2. Kakek (dari pihak ayah)",
            "3. Saudara laki-laki kandung (seayah-seibu)",
            "4. Saudara laki-laki seayah",
            "5. Anak laki-laki dari saudara kandung (keponakan)",
            "6. Anak laki-laki dari saudara seayah",
            "7. Paman (saudara laki-laki ayah)",
            "8. Anak laki-laki paman (sepupu)",
            "9. Wali hakim (jika semua wali nasab tidak ada)"
          ]
        },
        {
          sectionTitle: "Wali Hakim dan Kondisi Perpindahan",
          paragraphs: [
            "Wali hakim adalah pejabat yang ditunjuk oleh menteri agama untuk bertindak sebagai wali nikah. Rasulullah bersabda:",
            "أيما امرأة نكحت بغير إذن وليها فنكاحها باطل فنكاحها باطل ، فنكاحها باطل ، فإن دخل بها فلها المهر بما استحل من فرجها ، فإن اشتجروا فالسلطان ولي من لا ولي له",
            "“Wanita manapun yang menikah tanpa izin wali, maka nikahnya batal... Jika terjadi perselisihan, maka pemerintah menjadi wali wanita yang tidak mempunyai wali.” (HR. Tirmidzi)",
            "Perpindahan ke wali hakim terjadi ketika:",
            "1. Tidak ada wali nasab",
            "2. Wali hilang (mafqud)",
            "3. Wali tinggal jauh dan tidak bisa dihubungi (baid)",
            "4. Wali sakit tidak memungkinkan",
            "5. Wali sedang ihram",
            "6. Wali menolak menikahkan tanpa alasan syar'i (adhol)"
          ]
        },
        {
          sectionTitle: "Kasus Khusus: Wanita Hasil Zina",
          paragraphs: [
            "Pendapat yang kuat, anak hasil zina hanya dinisbatkan kepada ibunya:",
            "الولد للفراش وللعاهر الحجر",
            "“Anak itu menjadi hak pemilik firasy (suami sah). Sedangkan untuk pezina, baginya adalah batu.” (HR. Bukhari-Muslim)",
            "Wanita ini tidak memiliki ashabah dari garis nasab ayahnya, sehingga walinya adalah wali hakim."
          ]
        },
        {
          sectionTitle: "Hikmah Adanya Wali",
          paragraphs: [
            "Rasulullah bersabda tentang fitrah wanita:",
            "مَا رَأَيْتُ مِنْ نَاقِصَاتِ عَقْلٍ وَدِينٍ أَذْهَبَ لِلُبِّ الرَّجُلِ الْحَازِمِ مِنْ إِحْدَاكُنَّ",
            "“Aku perhatikan kalian memang kurang akal dan kurang agama.” (Muttafaq 'alaih)",
            "Hikmah keberadaan wali:",
            "- Perlindungan bagi wanita sesuai fitrah penciptaannya",
            "- Pelimpahan tanggung jawab dari wali ke suami",
            "- Penengah dan pelindung jika terjadi masalah dalam pernikahan",
            "- Penjaga hak-hak wanita dalam pernikahan"
          ]
        }
      ]
    },
    bagian3: {
      title: "Fikih Nikah (Bag. 3)",
      source: "https://muslim.or.id/71852-fikih-nikah-bag-3.html",
      author: "Muhammad Idris, Lc.",
      content: [
        {
          sectionTitle: "Berapakah Mahar yang Layak untuk Meminang Seorang Wanita?",
          paragraphs: [
            "Mahar merupakan salah satu persyaratan yang harus dipenuhi oleh mempelai pria ketika hendak meminang seorang wanita. Mahar adalah tanda kesungguhan seorang laki-laki untuk menikahi seorang wanita.",
            "Allah Ta'ala berfirman:",
            "وَآتُوا النِّسَاءَ صَدُقَاتِهِنَّ نِحْلَةً ۚ فَإِن طِبْنَ لَكُمْ عَن شَيْءٍ مِّنْهُ نَفْسًا فَكُلُوهُ هَنِيئًا مَّرِيئًا",
            "“Berikanlah maskawin (mahar) kepada wanita (yang kamu nikahi) sebagai pemberian dengan penuh kerelaan. Kemudian jika mereka menyerahkan kepadamu sebagian dari maskawin itu dengan senang hati, maka makanlah (ambillah) pemberian itu (sebagai makanan) yang sedap lagi baik akibatnya.” (QS. An-Nisa’: 4)",
            "Pernikahan tanpa mahar berarti pernikahan tersebut tidak sah, meskipun pihak wanita telah rida untuk tidak mendapatkan mahar."
          ]
        },
        {
          sectionTitle: "Batasan Mahar",
          paragraphs: [
            "Mahar bisa berupa:",
            "1. Harta (materi) dengan berbagai macam bentuknya.",
            "Allah berfirman:",
            "وَٱلۡمُحۡصَنَـٰتُ مِنَ ٱلنِّسَاۤءِ إِلَّا مَا مَلَكَتۡ أَیۡمَـٰنُكُمۡۖ كِتَـٰبَ ٱللَّهِ عَلَیۡكُمۡۚ وَأُحِلَّ لَكُم مَّا وَرَاۤءَ ذَ ٰ⁠لِكُمۡ أَن تَبۡتَغُوا۟ بِأَمۡوَ ٰ⁠لِكُم مُّحۡصِنِینَ غَیۡرَ مُسَـٰفِحِینَۚ فَمَا ٱسۡتَمۡتَعۡتُم بِهِۦ مِنۡهُنَّ فَـَٔاتُوهُنَّ أُجُورَهُنَّ فَرِیضَةࣰۚ وَلَا جُنَاحَ عَلَیۡكُمۡ فِیمَا تَرَ ٰ⁠ضَیۡتُم بِهِۦ مِن� بَعۡدِ ٱلۡفَرِیضَةِۚ إِنَّ ٱللَّهَ كَانَ عَلِیمًا حَكِیمࣰا",
            "“Dan dihalalkan bagi kalian selain yang demikian (yaitu) mencari isteri-isteri dengan hartamu untuk dikawini bukan untuk berzina. Maka, isteri-isteri yang telah kamu nikmati (campuri) di antara mereka, berikanlah kepada mereka maharnya (dengan sempurna) sebagai suatu kewajiban...” (QS. An-Nisa’: 24)",
            "2. Sesuatu yang dapat diambil upahnya (jasa).",
            "Allah berfirman:",
            "قَالَ اِنِّيْٓ اُرِيْدُ اَنْ اُنْكِحَكَ اِحْدَى ابْنَتَيَّ هٰتَيْنِ عَلٰٓى اَنْ تَأْجُرَنِيْ ثَمٰنِيَ حِجَجٍۚ فَاِنْ اَتْمَمْتَ عَشْرًا فَمِنْ عِنْدِكَۚ وَمَآ اُرِيْدُ اَنْ اَشُقَّ عَلَيْكَۗ سَتَجِدُنِيْٓ اِنْ شَاۤءَ اللّٰهُ مِنَ الصّٰلِحِيْنَ",
            "“Berkatalah dia (Syu'aib), ‘Sesungguhnya Aku bermaksud menikahkan kamu dengan salah seorang dari kedua anakku ini atas dasar bahwa kamu bekerja denganku delapan tahun...” (QS. Al-Qashash: 27)",
            "3. Manfaat yang akan kembali kepada sang wanita, seperti:",
            "- Kemerdekaan dari perbudakan:",
            "أن رسول الله صلى الله عليه وسلم أعتق صفية وجعل عتقها صداقها",
            "“Sesungguhnya Rasulullah shallallahu 'alaihi wasallam memerdekakan Shafiyah binti Huyayin dan menjadikan kemerdekaannya sebagai mahar.” (HR. Bukhari)",
            "- Keislaman seseorang:",
            "“Abu Thalhah menikahi Ummu Sulaim. Maharnya keislaman Abu Thalhah...” (HR. An-Nasa'i)",
            "- Hafalan Al-Qur'an yang akan diajarkannya:",
            "Nabi shallallahu 'alaihi wasallam pernah menikahkan sahabat dengan mahar mengajarkan Al-Qur'an. (HR. Bukhari dan Muslim)"
          ]
        },
        {
          sectionTitle: "Mahar Hanya dengan Seperangkat Alat Salat, Bolehkah?",
          paragraphs: [
            "Seorang wanita bebas menentukan bentuk dan jumlah mahar yang diinginkannya karena tidak ada batasan mahar dalam syariat Islam. Namun, Islam menganjurkan agar meringankan mahar.",
            "Rasulullah shallallahu 'alaihi wasallam bersabda:",
            "خَيْرُ الصَّدَاقِ أَيْسَرَهُ",
            "“Sebaik-baik mahar adalah mahar yang paling mudah (ringan).” (HR. Al-Hakim)",
            "Tidak ada batasan minimal untuk mahar. Sehingga, tidak mengapa bila mahar hanya berupa seperangkat alat salat dengan syarat calon mempelai wanita dan walinya meridai hal tersebut.",
            "Rasulullah shallallahu 'alaihi wasallam bersabda:",
            "خَيْرُ النِّكَاحِ أَيْسَرُهُ",
            "“Sebaik-baik pernikahan adalah yang paling mudah.” (HR. Abu Dawud)",
            "Hikmah: mempermudah proses pernikahan dan tidak memberatkan calon suami."
          ]
        },
        {
          sectionTitle: "Hukum Mengakhirkan Mahar Setelah Akad",
          paragraphs: [
            "Diperbolehkan bagi seseorang untuk mendahulukan pembayaran mahar ataupun mengakhirkannya secara keseluruhan, atau mendahulukan pembayaran sebagian mahar dan mengakhirkan sebagian lainnya.",
            "Apabila sang suami telah menggauli istri, sedangkan ia belum membayar mahar, maka hal itu sah-sah saja. Akan tetapi, ia wajib membayar mahar mitsil (mahar senilai yang biasa diberikan kepada wanita kerabat wanita itu) apabila dalam akad nikah ia tidak menyebutkan maskawin apa yang akan ia berikan.",
            "Rasulullah shallallahu 'alaihi wasallam bersabda:",
            "أَحَقُّ مَا أَوْفَيْتُمْ مِنَ الشُّرُوْطِ أَنْ تُوفُواْ بِهِ مَا اسْتَحْلَلْتُمْ بِهِ الفُرُوْجَ",
            "“Sesungguhnya suatu syarat yang paling berhak untuk kalian penuhi adalah syarat yang dengannya dihalalkan bagi kalian kemaluan (wanita).” (HR. Bukhari dan Muslim)",
            "Apabila sang suami meninggal setelah akad dan belum menggauli, maka istri berhak mendapatkan mahar seluruhnya. (HR. Tirmidzi, Abu Dawud, Ibnu Majah, dan Nasa'i)"
          ]
        }
      ]
    },
    bagian4: {
      title: "Fikih Nikah (Bag. 4)",
      source: "https://muslim.or.id/71940-fikih-nikah-bag-4.html",
      author: "Muhammad Idris, Lc.",
      content: [
        {
          sectionTitle: "Pengertian Walimah dan Hikmah Diadakannya",
          paragraphs: [
            "Walimah (وليمة) dalam bahasa Arab artinya 'perjamuan/perkumpulan' untuk makan. Biasanya jamuan pernikahan dikenal dengan walimah al-'urs.",
            "Tujuan walimah adalah mengumumkan pernikahan. Rasulullah bersabda:",
            "أَعلِنوا النِّكاحَ",
            "“Umumkanlah pernikahan!” (HR. Ahmad)",
            "Muhammad bin Ismail ash-Shan’ani: walimah adalah mengumumkan pernikahan yang menghalalkan hubungan suami istri dan perpindahan status kepemilikan.",
            "Hikmah walimah:",
            "- Memohon doa dari tamu undangan",
            "- Mendapatkan keberkahan pernikahan",
            "- Mensyiarkan hukum Allah",
            "- Membangun keluarga atas dasar keimanan"
          ]
        },
        {
          sectionTitle: "Sahkah Menikah Tanpa Walimah?",
          paragraphs: [
            "Ulama berbeda pendapat tentang hukum walimah:",
            "1. Wajib: Berdasarkan hadis Abdurrahman bin 'Auf:",
            "فَقَالَ لَهُ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ أَوْلِمْ وَلَوْ بِشَاةٍ",
            "“Adakanlah walimah walau hanya dengan seekor kambing” (HR. Bukhari)",
            "2. Sunah Muakkadah (sangat dianjurkan): Berdasarkan hadis:",
            "ليس في المال حق سوى الزكاة",
            "“Tidak ada hak wajib pada harta kecuali zakat” (HR. Ibnu Majah)",
            "Syekh bin Baz menjelaskan:",
            "“Walimah tidak mempengaruhi sahnya akad nikah. Nikah tetap sah tanpa walimah jika syarat dan rukun terpenuhi. Namun walimah sesuai kemampuan adalah sunah nabi yang selayaknya dilakukan.”",
            "Kesimpulan:",
            "- Walimah hukumnya sunah muakkadah, bukan wajib",
            "- Pernikahan tetap sah tanpa walimah",
            "- Dianjurkan walimah sederhana sesuai kemampuan"
          ]
        },
        {
          sectionTitle: "Hukum Menghadiri Walimah dan Syarat-syaratnya",
          paragraphs: [
            "Jumhur ulama: menghadiri undangan walimah hukumnya wajib. Rasulullah bersabda:",
            "“Rasulullah memerintahkan kami... memenuhi undangan...” (HR. Muslim)",
            "An-Nawawi: “Memenuhi undangan walimah hukumnya wajib menurut kesepakatan ulama.”",
            "Rasulullah juga bersabda:",
            "شَرُّ الطَّعَامِ طَعَامُ الْوَلِيمَةِ يُمْنَعُهَا مَنْ يَأْتِيهَا وَيُدْعَى إِلَيْهَا مَنْ يَأْبَاهَا وَمَنْ لَمْ يُجِبْ الدَّعْوَةَ فَقَدْ عَصَى اللَّهَ وَرَسُولَهُ",
            "“Siapa yang tidak memenuhi undangan, berarti telah bermaksiat kepada Allah dan Rasul-Nya” (HR. Bukhari-Muslim)",
            "Syarat menghadiri walimah (Syekh Utsaimin):",
            "1. Tidak ada kemungkaran di dalam acara",
            "2. Pengundang bukan orang yang wajib dijauhi (fasik/ahli bid'ah)",
            "3. Pengundang muslim",
            "4. Makanan yang disajikan halal",
            "5. Tidak mengabaikan kewajiban lain",
            "6. Tidak menimbulkan mudarat",
            "7. Undangan bersifat khusus (bukan umum)"
          ]
        }
      ]
    },
    bagian5: {
      title: "Fikih Nikah (Bag. 5)",
      source: "https://muslim.or.id/72128-fikih-nikah-bag-5.html",
      author: "Muhammad Idris, Lc.",
      content: [
        {
          sectionTitle: "Beberapa Hukum Terkait Poligami",
          paragraphs: [
            "Poligami dalam Islam dilandasi hikmah dan tujuan mulia:",
            "- Solusi pertambahan wanita lebih banyak dari laki-laki",
            "- Mengatasi berkurangnya laki-laki akibat peperangan",
            "- Menolong wanita tidak bersuami menjadi istri terhormat",
            "Islam membatasi poligami maksimal 4 istri, berbeda dengan agama lain yang tanpa batas.",
            "Allah berfirman:",
            "وَاِنْ خِفْتُمْ اَلَّا تُقْسِطُوْا فِى الْيَتٰمٰى فَانْكِحُوْا مَا طَابَ لَكُمْ مِّنَ النِّسَاۤءِ مَثْنٰى وَثُلٰثَ وَرُبٰعَ ۚ فَاِنْ خِفْتُمْ اَلَّا تَعْدِلُوْا فَوَاحِدَةً اَوْ مَا مَلَكَتْ اَيْمَانُكُمْ ۗ ذٰلِكَ اَدْنٰٓى اَلَّا تَعُوْلُوْاۗ",
            "“Nikahilah perempuan (lain) yang kamu senangi, dua, tiga, atau empat...” (QS. An-Nisa: 3)"
          ]
        },
        {
          sectionTitle: "Hukum Berpoligami",
          paragraphs: [
            "Hukum asal poligami adalah mubah (boleh), bisa berubah sesuai kondisi:",
            "- Wajib: Jika diperlukan untuk menyelamatkan wanita dari zina",
            "- Sunnah: Jika mampu berbuat adil dan ada kebutuhan",
            "- Haram: Jika tidak mampu berbuat adil",
            "Batas maksimal 4 istri berdasarkan hadis:",
            "أَنَّ غَيْلاَنَ بْنَ سَلَمَةَ الثَّقَفِىَّ أَسْلَمَ وَلَهُ عَشْرُ نِسْوَةٍ... فَأَمَرَهُ النَّبِىُّ أَنْ يَتَخَيَّرَ أَرْبَعًا مِنْهُنَّ",
            "“Nabi memerintahkan Ghoylan bin Salamah yang punya 10 istri untuk memilih 4 saja” (HR. Tirmidzi)"
          ]
        },
        {
          sectionTitle: "Syarat-Syarat Poligami",
          paragraphs: [
            "1. Adil terhadap seluruh istri:",
            "Allah berfirman:",
            "فَاِنْ خِفْتُمْ اَلَّا تَعْدِلُوْا فَوَاحِدَةً",
            "“Jika kamu khawatir tidak mampu berlaku adil, maka (nikahilah) seorang saja” (QS. An-Nisa: 3)",
            "Rasulullah bersabda:",
            "مَنْ كَانَ لَهُ امْرَأَتَانِ فَمَالَ إِلَى إِحْدَاهُمَا جَاءَ يَوْمَ القِيَامَةِ وَشِقُّهُ مَائِلٌ",
            "“Barangsiapa punya dua istri lalu lebih cenderung pada salah satunya, di akhirat tubuhnya miring” (HR. Abu Dawud)",
            "Keadilan yang dimaksud:",
            "- Tempat tinggal, pakaian, makanan",
            "- Pembagian waktu malam",
            "- Nafkah materi",
            "2. Kemampuan finansial:",
            "Allah berfirman:",
            "وَلْيَسْتَعْفِفِ الَّذِيْنَ لَا يَجِدُوْنَ نِكَاحًا حَتّٰى يُغْنِيَهُمُ اللّٰهُ",
            "“Orang yang tidak mampu menikah hendaklah menjaga kesucian sampai Allah memberi kemampuan” (QS. An-Nur: 33)",
            "Rasulullah bersabda:",
            "يا معشر الشباب من استطاع منكم الباءة فليتزوج",
            "“Wahai pemuda, siapa yang mampu menikah maka menikahlah” (HR. Bukhari-Muslim)"
          ]
        },
        {
          sectionTitle: "Nasihat Bagi yang Menghendaki Poligami",
          paragraphs: [
            "Nasihat pertama:",
            "Poligami tanpa keadilan akan menimbulkan:",
            "- Keributan dan permusuhan antar keluarga",
            "- Permusuhan turun ke anak-anak",
            "- Perpecahan dan saling mendiamkan",
            "Rasulullah melarang:",
            "لايحلّ لمسلم ان يهجر اخاه فوق ثلاث",
            "“Tidak halal muslim mendiamkan saudaranya lebih dari 3 hari” (HR. Bukhari-Muslim)",
            "Nasihat kedua:",
            "Adil dalam cinta mustahil, yang penting tidak menelantarkan:",
            "Allah berfirman:",
            "وَلَنْ تَسْتَطِيْعُوْٓا اَنْ تَعْدِلُوْا بَيْنَ النِّسَاۤءِ وَلَوْ حَرَصْتُمْ فَلَا تَمِيْلُوْا كُلَّ الْمَيْلِ فَتَذَرُوْهَا كَالْمُعَلَّقَةِ",
            "“Kamu tidak akan bisa adil dalam cinta, jangan terlalu condong hingga yang lain terkatung” (QS. An-Nisa: 129)",
            "Contoh Nabi:",
            "Cinta Nabi ke Aisyah lebih besar tapi tidak menelantarkan istri lain",
            "Kewajiban suami:",
            "- Adil dalam pembagian materi dan waktu",
            "- Tidak membedakan perhatian secara mencolok",
            "- Bertakwa kepada Allah dalam setiap keputusan"
          ]
        }
      ]
    },
    bagian6: {
      title: "Fikih Nikah (Bag. 6)",
      source: "https://muslim.or.id/72260-fikih-nikah-bag-6.html",
      author: "Muhammad Idris, Lc.",
      content: [
        {
          sectionTitle: "Sikap Islam Terhadap Istri yang Durhaka",
          paragraphs: [
            "Nusyuz (durhaka) adalah ketika istri merasa tinggi sehingga tidak menaati suaminya.",
            "Ibnu Katsir:",
            "المرأة الناشز هي المرأة المرتفعة على زوجها ، التاركة لأمره ، المعرضة عنه ، المبغضة له",
            "“Perempuan yang durhaka adalah yang merasa tinggi terhadap suami, meninggalkan perintahnya, berpaling darinya, dan membencinya.”"
          ]
        },
        {
          sectionTitle: "Kapan Istri Dikatakan Nasyiz?",
          paragraphs: [
            "Menurut mazhab Syafi'i:",
            "- Keluar rumah tanpa izin suami",
            "- Menolak ajakan suami ke tempat tidur",
            "- Menutup pintu di depan suami",
            "Tidak dibedakan antara kewajiban atau bukan, keduanya bentuk meremehkan suami."
          ]
        },
        {
          sectionTitle: "Hukum Durhaka terhadap Suami",
          paragraphs: [
            "Haram karena dua alasan:",
            "1. Meninggalkan kewajiban taat pada suami",
            "Rasulullah bersabda:",
            "لَوْ كُنْتُ آمِرًا أَحَدًا أَنْ يَسْجُدَ ِلأَحَدٍ َلأَمَرْتُ الْمَرْأَةَ أَنْ تَسْجُدَ لِزَوْجِهَا",
            "“Seandainya aku boleh menyuruh sujud, aku akan perintahkan istri sujud pada suaminya.” (HR. Tirmidzi)",
            "2. Mendapat ancaman hukuman dan laknat",
            "Allah berfirman:",
            "وَالّٰتِيْ تَخَافُوْنَ نُشُوْزَهُنَّ فَعِظُوْهُنَّ وَاهْجُرُوْهُنَّ فِى الْمَضَاجِعِ وَاضْرِبُوْهُنَّ",
            "“Perempuan yang kamu khawatirkan kedurhakaannya, nasihatilah, pisahkan di tempat tidur, dan pukullah.” (QS. An-Nisa:34)",
            "Rasulullah bersabda:",
            "إِذَا دَعَا الرَّجُلُ امْرَأَتَهُ إِلَى فِرَاشِهِ فَأَبَتْ... لَعَنَتْهَا الْمَلاَئِكَةُ",
            "“Jika istri menolak ajakan suami ke tempat tidur, malaikat melaknatnya sampai subuh.” (HR. Bukhari-Muslim)"
          ]
        },
        {
          sectionTitle: "Menyikapi Istri yang Durhaka",
          paragraphs: [
            "Tahapan sesuai QS. An-Nisa:34:",
            "1. Memberi Nasihat:",
            "- Dengan kasih sayang dan ketulusan",
            "- Ingatkan akibat durhaka",
            "- Jika berubah, hentikan proses",
            "2. Hajr (Boikot):",
            "- Pisah ranjang",
            "- Tidak berbicara (maksimal 3 hari)",
            "- Syarat:",
            "  • Tidak di depan anak-anak",
            "  • Hanya di dalam rumah",
            "3. Memukul:",
            "- Pukulan tidak menyakitkan",
            "- Tidak di wajah",
            "- Tidak melukai",
            "Rasulullah bersabda:",
            "فَاضْرِبُوهُنَّ ضَرْبًا غَيْرَ مُبَرِّحٍ",
            "“Pukullah dengan pukulan tidak membekas” (HR. Muslim)"
          ]
        },
        {
          sectionTitle: "Akibat Hukum bagi Istri Durhaka",
          paragraphs: [
            "Syekh Bin Baz:",
            "- Tidak berhak mendapat nafkah selama durhaka",
            "- Kewajiban nafkah kembali saat istri taat",
            "- Hakim harus meneliti penyebab durhaka",
            "Catatan penting:",
            "- Durhaka tanpa alasan syar'i = kehilangan hak",
            "- Jika ada alasan syar'i (misal suami zhalim), istri tidak dihukum"
          ]
        }
      ]
    },
    bagian7: {
      title: "Fikih Nikah (Bag. 7)",
      source: "https://muslim.or.id/72567-fikih-nikah-bag-7.html",
      author: "Muhammad Idris, Lc.",
      content: [
        {
          sectionTitle: "Istri Meminta Cerai, Bagaimanakah Hukumnya?",
          paragraphs: [
            "Rasulullah bersabda:",
            "أَيُّمَا امْرَأَةٍ سَأَلَتْ زَوْجَهَا طَلاَقًا فِى غَيْرِ مَا بَأْسٍ فَحَرَامٌ عَلَيْهَا رَائِحَةُ الْجَنَّةِ",
            "“Wanita yang meminta cerai tanpa alasan jelas, haram baginya mencium bau surga.” (HR. Abu Daud, Tirmidzi)",
            "Gugat cerai dibolehkan jika ada alasan syar'i, berdasarkan ayat:",
            "فَإِنْ خِفْتُمْ أَلَّا يُقِيمَا حُدُودَ اللَّهِ فَلَا جُنَاحَ عَلَيْهِمَا فِيمَا افْتَدَتْ بِهِ",
            "“Jika kamu khawatir tidak dapat menjalankan hukum Allah, tidak dosa tentang bayaran yang diberikan istri untuk menebus dirinya.” (QS. Al-Baqarah:229)"
          ]
        },
        {
          sectionTitle: "Kasus Pertama Gugat Cerai di Zaman Nabi",
          paragraphs: [
            "Ibnu Abbas berkata:",
            "جَاءَتِ امۡرَأَةُ ثَابِتِ بۡنِ قَيۡسِ... إِلَّا أَنِّي أَخَافُ الۡكُفۡرَ",
            "“Istri Tsabit bin Qais datang kepada Nabi: 'Aku tidak mencela agamanya, tapi aku takut kekufuran.' Nabi memerintahkan Tsabit menceraikannya setelah istri mengembalikan mahar.” (HR. Bukhari)",
            "Dalam riwayat lain:",
            "“Tsabit jelek rupanya, jika ia masuk kamarku, aku ludahi wajahnya.” (Bulughul Maram)",
            "Ini menjadi preseden pertama gugat cerai dalam Islam."
          ]
        },
        {
          sectionTitle: "Pengertian Khulu' (Gugat Cerai)",
          paragraphs: [
            "Secara bahasa: melepas",
            "Secara istilah:",
            "- Perpisahan suami istri dengan keridhaan kedua pihak",
            "- Dengan kompensasi dari istri ke suami",
            "Dalil: QS. Al-Baqarah:229 dan hadis Tsabit bin Qais",
            "Sudah menjadi ijma' ulama tentang syariat khulu'"
          ]
        },
        {
          sectionTitle: "Kondisi Dibolehkannya Gugat Cerai",
          paragraphs: [
            "Khulu' boleh jika:",
            "1. Istri membenci keadaan suami (fisik/akhlak)",
            "2. Istri khawatir tidak bisa menunaikan kewajiban pada suami",
            "3. Istri tidak bisa menunaikan kewajiban pada Allah dalam pernikahan",
            "Prosedur modern:",
            "- Diajukan ke Pengadilan Agama/KUA",
            "- Besaran kompensasi ditentukan pengadilan"
          ]
        },
        {
          sectionTitle: "Kasus Khusus: Suami Lalai Ibadah",
          paragraphs: [
            "Syekh Bin Baz ditanya tentang suami yang sering meninggalkan shalat:",
            "“Jika suami lebih banyak meninggalkan shalat daripada menunaikannya, tidak boleh istri tinggal bersamanya. Meninggalkan shalat termasuk kufur akbar. Akad nikah batal. Ajukan ke pengadilan.”",
            "Gugat cerai dianjurkan jika:",
            "- Suami memiliki akidah rusak",
            "- Pecandu narkoba",
            "- Memerintahkan istri berbuat haram (misal: tidak menutup aurat)"
          ]
        }
      ]
    },
    bagian8: {
      title: "Fikih Nikah (Bag. 8)",
      source: "https://muslim.or.id/72590-fikih-nikah-bag-8.html",
      author: "Muhammad Idris, Lc.",
      content: [
        {
          sectionTitle: "Hukum-Hukum Terkait Perceraian",
          paragraphs: [
            "Talak menurut bahasa Arab adalah 'melepaskan ikatan'. Menurut istilah agama: melepas ikatan perkawinan (nikah) dengan lafaz.",
            "Talak tidak sah kecuali terpenuhi syarat-syaratnya, terutama menggunakan lafaz (ucapan).",
            "Rasulullah bersabda:",
            "إن الله تجاوز عن أمتي ما حدثت به أنفسها ما لم تعمل أو تتكلم",
            "“Sesungguhya Allah memaafkan bisikan hati dalam diri umatku, selama belum dilakukan atau diucapkan.” (HR. Bukhari dan Muslim)",
            "Contoh: Jika seseorang berniat menceraikan istri dalam hati tetapi tidak mengucapkannya, talak tidak jatuh."
          ]
        },
        {
          sectionTitle: "Hukum Asal Cerai adalah Dilarang",
          paragraphs: [
            "Hukum perceraian bisa beragam tergantung situasi, tetapi hukum asalnya dilarang:",
            "Syekhul Islam Ibnu Taimiyyah:",
            "“Sesungguhnya hukum asal perceraian/talak adalah dilarang. Sesungguhnya dibolehkan hanya sesuai kadar kebutuhan.” (Majmu' Fatawa)",
            "Syekh Ibnu Utsaimin:",
            "“Talak, hukum asalnya adalah makruh. Dalilnya QS. Al-Baqarah:226-227:",
            "لِّلَّذِينَ يُؤۡلُونَ مِن نِّسَآئِهِمۡ تَرَبُّصُ أَرۡبَعَةِ أَشۡهُرٍۖ فَإِن فَآءُو فَإِنَّ ٱللَّهَ غَفُورٌ رَّحِيمٌ ٢٢٦ وَإِنۡ عَزَمُواْ ٱلطَّلَٰقَ فَإِنَّ ٱللَّهَ سَمِيعٌ عَلِيمٌ ٢٢٧",
            "“Orang-orang meng-ila’ istri-istri mereka, wajib menunggu selama empat bulan... Jika mereka bertekad untuk menalaknya, sesungguhnya Allah Mahamendengar lagi Mahatahu.”",
            "Perceraian bisa bernilai:",
            "- Wajib: Jika diperlukan untuk mencegah kemudaratan",
            "- Sunnah: Demi kemaslahatan istri",
            "- Makruh: Jika tanpa alasan kuat",
            "- Haram: Jika bertentangan dengan syariat",
            "Allah berfirman:",
            "وَأَحۡسِنُوٓاْۚ إِنَّ ٱللَّهَ يُحِبُّ ٱلۡمُحۡسِنِينَ",
            "“Dan berbuat baiklah, karena sesungguhnya Allah menyukai orang-orang yang berbuat baik.” (QS. Al-Baqarah:195)"
          ]
        },
        {
          sectionTitle: "Macam-Macam Lafaz Talak",
          paragraphs: [
            "1. Talak Sharih (Tegas):",
            "- Ucapan yang jelas berarti cerai",
            "- Contoh: 'Kau aku ceraikan!', 'Kita cerai!'",
            "- Lafaz dalam Al-Qur'an: الطلاق (talak), الفراق (firaq), السراح (sirah)",
            "Allah berfirman:",
            "اَلطَّلَاقُ مَرَّتٰنِ ۖ فَاِمْسَاكٌۢ بِمَعْرُوْفٍ اَوْ تَسْرِيْحٌۢ بِاِحْسَانٍ",
            "“Talak (yang dapat dirujuk) itu dua kali. (Setelah itu suami dapat) menahan dengan baik, atau melepaskan dengan baik.” (QS. Al-Baqarah:229)",
            "أَوْ فَارِقُوْهُنَّ بِمَعْرُوْفٍ",
            "“Atau lepaskanlah mereka dengan baik.” (QS. At-Talaq:2)",
            "فَتَعَالَيۡنَ أُمَتِّعۡكُنَّ وَأُسَرِّحۡكُنَّ سَرَاحٗا جَمِيلٗا",
            "“Maka, marilah supaya kuberikan kepadamu mut’ah dan aku ceraikan kamu dengan cara yang baik.” (QS. Al-Ahzab:28)",
            "2. Talak Kinayah (Sindiran):",
            "- Kata-kata yang tidak jelas berarti cerai",
            "- Contoh: 'Kamu lain ya.', 'Kau haram untukku'",
            "- Tidak jatuh talak kecuali disertai niat",
            "Perbedaan penanganan:",
            "- Talak sharih: Jatuh meski tanpa niat",
            "- Talak kinayah: Hanya jatuh dengan niat jelas"
          ]
        },
        {
          sectionTitle: "Hukum Talak Saat Istri Haid",
          paragraphs: [
            "1. Talak Sunni:",
            "- Talak yang sesuai syariat",
            "- Dilakukan saat istri suci dari haid",
            "- Belum dicampuri sejak masa suci terakhir",
            "Allah berfirman:",
            "يَـأَيُّـهَا النَّبِيُّ إِذَا طَلَّقْـتُـمُ النِّسَـآءَ فَطَلِّقُو هُنَّ لِعِدَّ تِهِنَّ",
            "“Wahai Nabi! Apabila kamu menceraikan istri-istrimu, maka hendaklah kamu ceraikan mereka pada waktu ‘iddah mereka (waktu yang wajar).” (QS. At-Thalaq:1)",
            "2. Talak Bid'i:",
            "- Talak yang menyelisihi syariat",
            "- Dilakukan saat istri haid",
            "- Atau dalam masa suci setelah dicampuri",
            "Hikmah larangan:",
            "- Memperpanjang masa iddah",
            "- Membahayakan wanita",
            "- Potensi penyesalan suami",
            "Hukum talak bid'i:",
            "- Sah sebagai satu talak (mayoritas ulama)",
            "- Suami berdosa",
            "- Diperintahkan rujuk kembali",
            "Rasulullah bersabda tentang kasus Ibnu Umar:",
            "“Perintahkan agar ia kembali kepada (istri)nya, kemudian menahannya hingga masa suci, lalu masa haid dan suci lagi. Setelah itu, bila ia menghendaki, ia boleh tetap menahannya menjadi istri. Atau bila ia menghendaki, ia boleh menceraikannya sebelum bersetubuh dengannya. Itu adalah masa ‘iddah yang diperintahkan Allah untuk menceraikan istri.” (HR. Bukhari dan Muslim)"
          ]
        }
      ]
    }
  };

  // Validasi parameter
  if (!bagian || !semuaBagian[bagian]) {
    return new Response(JSON.stringify({ 
      error: true,
      message: "Parameter 'bagian' tidak valid. Gunakan: bagian1 sampai bagian8"
    }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }

  return new Response(JSON.stringify(semuaBagian[bagian]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      'X-Content-Type-Options': 'nosniff',
      'Vary': 'bagian'
    }
  });
}