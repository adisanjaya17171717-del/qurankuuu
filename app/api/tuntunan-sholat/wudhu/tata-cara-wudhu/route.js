// app/api/tuntunan-sholat/wudhu/tata-cara-wudhu/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    
    const tataCaraWudhu = {
      metadata: {
        title: "Tata Cara Wudhu Lengkap",
        description: "Panduan praktis tata cara wudhu",
        source: "Tuntunan Sholat Lengkap",
        language: "id",
        createdAt: new Date().toISOString(),
        totalSteps: 9
      },
      langkahLangkah: [
        {
          id: 1,
          langkah: "Membaca Bismillah dan mencuci tangan",
          arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ",
          latin: "Bismillahir-rahmanir-rahim",
          translation: "Dengan menyebut nama Allah Yang Maha Pengasih Lagi Maha Penyayang",
          penjelasan: "Membaca basmalah sambil mencuci kedua tangan hingga pergelangan tangan",
          gambar: `${baseUrl}/asset/tuntunan-sholat/wudhu/step1.jpg`
        },
        {
          id: 2,
          langkah: "Berkumur",
          penjelasan: "Berkumur 3 kali sambil membersihkan gigi dari sisa makanan",
          gambar: `${baseUrl}/asset/tuntunan-sholat/wudhu/step2.jpg`
        },
        {
          id: 3,
          langkah: "Istinsyaq dan Istintsar",
          penjelasan: "Menghirup air ke hidung dengan tangan kanan lalu menyemburkannya dengan tangan kiri, dilakukan 3 kali",
          gambar: `${baseUrl}/asset/tuntunan-sholat/wudhu/step3.jpg`
        },
        {
          id: 4,
          langkah: "Membasuh muka dan niat",
          arabic: "نَوَيْتُ الْوُضُوْءَ لِرَفْعِ الْحَدَثِ اْلاَصْغَرِ فَرْضًا الِلَهِ تعَالَى",
          latin: "Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhal lilaahi ta'aalaa",
          translation: "Aku niat berwudhu untuk menghilangkan hadats kecil, fardhu karena Allah",
          penjelasan: "Membasuh muka 3 kali dari dahi hingga dagu dan telinga ke telinga sambil membaca niat",
          gambar: `${baseUrl}/asset/tuntunan-sholat/wudhu/step4.jpg`
        },
        {
          id: 5,
          langkah: "Membasuh tangan hingga siku",
          penjelasan: "Membasuh tangan kanan 3 kali dari ujung jari hingga siku sambil menyela-nyela jari, lalu tangan kiri",
          gambar: `${baseUrl}/asset/tuntunan-sholat/wudhu/step5.jpg`
        },
        {
          id: 6,
          langkah: "Mengusap kepala",
          penjelasan: "Mengusap sebagian kepala 3 kali dengan air",
          gambar: `${baseUrl}/asset/tuntunan-sholat/wudhu/step6.jpg`
        },
        {
          id: 7,
          langkah: "Mengusap telinga",
          penjelasan: "Memasukkan jari telunjuk ke dalam telinga dan ibu jari mengusap bagian luar telinga",
          gambar: `${baseUrl}/asset/tuntunan-sholat/wudhu/step7.jpg`
        },
        {
          id: 8,
          langkah: "Membasuh kaki hingga mata kaki",
          penjelasan: "Membasuh kaki kanan 3 kali dari ujung jari hingga mata kaki sambil menyela-nyela jari, lalu kaki kiri",
          gambar: `${baseUrl}/asset/tuntunan-sholat/wudhu/step8.jpg`
        }
      ],
      doaSetelahWudhu: {
        arabic: "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ. سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوْبُ إِلَيْكَ. اللّٰهُمَّ اجْعَلْنِيْ مِنَ التَّوَّابِيْنَ، وَاجْعَلْنِيْ مِنَ الْمُتَطَهِّرِيْنَ، وَاجْعَلْنِيْ مِنْ عِبَادِكَ الصَّالِحِيْنَ.",
        latin: "Asyhadu an lā ilāha illallāhu waḥdahū lā syarīka lah, wa asyhadu anna Muḥammadan ‘abduhū wa rasūluh. Subḥānaka allāhumma wa biḥamdika, asyhadu allā ilāha illā anta, astagfiruka wa atūbu ilaik. Allāhummaj‘alnī minat-tawwābīn, waj‘alnī minal-mutaṭahhirīn, waj‘alnī min ‘ibādikash-ṣāliḥīn.",
        translation: "Aku bersaksi bahwa tidak ada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Maha Suci Engkau ya Allah, dengan memuji-Mu aku bersaksi bahwa tidak ada Tuhan selain Engkau. Aku memohon ampun kepada-Mu dan bertaubat kepada-Mu. Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat, orang-orang yang bersuci, dan hamba-hamba-Mu yang saleh."
      },
      catatanPenting: [
        "Urutan wudhu harus sesuai langkah-langkah di atas",
        "Setiap basuhan dilakukan 3 kali",
        "Untuk wanita, pastikan semua anggota wudhu terbebas dari cat kuku atau makeup yang menghalangi air"
      ]
    };

    return NextResponse.json(tataCaraWudhu, {
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