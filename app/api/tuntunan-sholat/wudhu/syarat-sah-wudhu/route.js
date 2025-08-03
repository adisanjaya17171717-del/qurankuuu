// app/api/tuntunan-sholat/wudhu/syarat-sah-wudhu/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const data = {
      metadata: {
        title: "Syarat Sah Wudhu, Fardhu Wudhu, dan Sunnah Wudhu",
        description: "Panduan lengkap tata cara wudhu sesuai syariat Islam",
        source: "Kitab Safinatun Najah, Matn Ghayah At-Taqrib",
        language: "id",
        createdAt: new Date().toISOString(),
        category: "Tuntunan Sholat"
      },
      syaratSahWudhu: {
        title: "Syarat Sah Wudhu",
        description: "Kondisi-kondisi yang harus dipenuhi agar wudhu dianggap sah",
        items: [
          {
            id: 1,
            syarat: "Islam",
            penjelasan: "Tidak sah wudhunya orang kafir atau murtad"
          },
          {
            id: 2,
            syarat: "Tamyiz",
            penjelasan: "Mampu memahami pembicaraan, bisa membedakan antara kanan-kiri, dan membedakan benda bermanfaat dan berbahaya"
          },
          {
            id: 3,
            syarat: "Bersih dari haid dan nifas",
            penjelasan: "Wanita yang sedang haid atau nifas tidak sah wudhunya"
          },
          {
            id: 4,
            syarat: "Tidak ada penghalang air ke kulit",
            penjelasan: "Kulit harus bersih dari cat, lem, atau kotoran yang menghalangi air"
          },
          {
            id: 5,
            syarat: "Tidak ada zat yang mengubah sifat air",
            penjelasan: "Tidak ada zat seperti tinta atau pewarna yang mengubah sifat air"
          },
          {
            id: 6,
            syarat: "Mengetahui kewajiban wudhu",
            penjelasan: "Harus meyakini bahwa wudhu adalah kewajiban, bukan sunnah"
          },
          {
            id: 7,
            syarat: "Meyakini kefardhuan rukun wudhu",
            penjelasan: "Harus meyakini bahwa semua rukun wudhu adalah wajib"
          },
          {
            id: 8,
            syarat: "Menggunakan air suci dan mensucikan",
            penjelasan: "Air harus bersih dari najis dan bukan air musta'mal (air bekas wudhu)"
          },
          {
            id: 9,
            syarat: "Masuk waktu (khusus mustahadhah)",
            penjelasan: "Bagi yang memiliki hadats terus-menerus (beser), wudhu harus dilakukan setelah masuk waktu sholat"
          },
          {
            id: 10,
            syarat: "Muwalah (khusus mustahadhah)",
            penjelasan: "Bagi yang hadats terus-menerus, harus berurutan antara basuhan dan langsung sholat setelah wudhu"
          }
        ],
        catatan: "Syarat nomor 9 dan 10 hanya berlaku bagi yang selalu mengeluarkan hadats secara terus menerus (mustahadhah)"
      },
      fardhuWudhu: {
        title: "Fardhu Wudhu",
        description: "Rukun-rukun yang harus dilakukan dalam wudhu",
        niat: {
          arabic: "نَوَيْتُ الْوُضُوْءَ لِرَفْعِ الْحَدَثِ اْلاَصْغَرِ فَرْضًا الِلَهِ تعَالَى",
          latin: "Nawaitul whudu-a lirof'il hadatsil ashghori fardhol lillaahi ta'aalaa",
          translation: "Saya niat berwudhu untuk menghilangkan hadast kecil fardu (wajib) karena Allah ta'ala"
        },
        items: [
          {
            id: 1,
            fardhu: "Niat",
            penjelasan: "Dilakukan bersamaan saat membasuh muka pertama kali. Ada tiga jenis niat: 1) Menghilangkan hadats, 2) Untuk boleh sholat, 3) Melakukan fardhu wudhu"
          },
          {
            id: 2,
            fardhu: "Membasuh muka",
            penjelasan: "Batasan muka: dari tempat tumbuh rambut hingga bawah dagu, dan dari telinga ke telinga. Termasuk rambut di wajah (alis, bulu mata, kumis, jenggot)"
          },
          {
            id: 3,
            fardhu: "Membasuh kedua tangan hingga siku",
            penjelasan: "Termasuk siku meskipun bentuknya tidak normal"
          },
          {
            id: 4,
            fardhu: "Mengusap sebagian kepala",
            penjelasan: "Cukup mengusap sebagian kecil rambut atau kulit kepala. Tidak sah jika mengusap rambut di luar batas kepala"
          },
          {
            id: 5,
            fardhu: "Membasuh kedua kaki hingga mata kaki",
            penjelasan: "Termasuk mata kaki. Jika kaki terpotong, basuh bagian yang tersisa"
          },
          {
            id: 6,
            fardhu: "Tertib",
            penjelasan: "Urutan: muka → tangan → usap kepala → kaki. Tidak boleh diubah urutannya"
          }
        ]
      },
      sunnahWudhu: {
        title: "Sunnah Wudhu",
        description: "Hal-hal yang dianjurkan dalam pelaksanaan wudhu",
        items: [
          {
            id: 1,
            sunnah: "Membaca basmalah",
            penjelasan: "Dibaca di awal wudhu: 'Bismillah' atau 'Bismillahirrahmanirrahim'"
          },
          {
            id: 2,
            sunnah: "Membasuh telapak tangan sebelum wudhu",
            penjelasan: "Mencuci tangan hingga pergelangan sebelum memulai wudhu"
          },
          {
            id: 3,
            sunnah: "Berkumur",
            penjelasan: "Memasukkan air ke mulut dan menggerakkannya"
          },
          {
            id: 4,
            sunnah: "Menghirup air ke hidung",
            penjelasan: "Menghirup air hingga pangkal hidung, lebih sempurna jika disemprotkan keluar"
          },
          {
            id: 5,
            sunnah: "Membasuh seluruh kepala",
            penjelasan: "Membasuh seluruh kepala bukan hanya mengusap sebagian"
          },
          {
            id: 6,
            sunnah: "Mengusap telinga",
            penjelasan: "Mengusap bagian luar dan dalam telinga dengan air baru"
          },
          {
            id: 7,
            sunnah: "Menyela-nyela jenggot tebal",
            penjelasan: "Memasukkan jari ke bawah jenggot yang tebal"
          },
          {
            id: 8,
            sunnah: "Menyela-nyela jari",
            penjelasan: "Menyela-nyela jari tangan dan kaki"
          },
          {
            id: 9,
            sunnah: "Mendahulukan yang kanan",
            penjelasan: "Mendahulukan anggota badan sebelah kanan"
          },
          {
            id: 10,
            sunnah: "Tiga kali basuhan",
            penjelasan: "Membasuh setiap anggota tiga kali"
          },
          {
            id: 11,
            sunnah: "Muwalah (berturut-turut)",
            penjelasan: "Melakukan wudhu tanpa jeda lama antar anggota badan"
          }
        ],
        catatan: "Muwalah menjadi wajib bagi orang yang hadats terus-menerus"
      }
    };

    return NextResponse.json(data, {
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