// app/open-api/page.jsx

import React from 'react';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const OpenAPIPage = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction 
    ? "https://qurankuuu.vercel.app" 
    : "http://localhost:3000";

  const apiSpec = {
    openapi: "3.0.0",
    info: {
      title: "Open API Islami",
      version: "1.0.0",
      description: "Kumpulan API Islami",
      contact: {
        name: "Quran App Pro",
        url: "https://qurankuuu.vercel.app",
      },
      license: {
        name: "MIT License",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: baseUrl,
        description: isProduction ? "Production server" : "Development server"
      }
    ],
    paths: {
      "/api/tajwid": {
        get: {
          summary: "Mendapatkan data hukum tajwid",
          description: "Mengembalikan daftar kategori atau detail hukum tertentu",
          operationId: "getTajwidData",
          parameters: [
            {
              name: "id",
              in: "query",
              description: "ID kategori tajwid",
              required: false,
              schema: { 
                type: "string",
                example: "nun-mati-tanwin" 
              }
            },
            {
              name: "rule",
              in: "query",
              description: "Nama hukum (format slug)",
              required: false,
              schema: { 
                type: "string",
                example: "izhar-halqi" 
              }
            }
          ],
          responses: {
            "200": {
              description: "Sukses mendapatkan data",
              content: {
                "application/json": {
                  schema: {
                    oneOf: [
                      { 
                        type: "array",
                        items: { 
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            title: { type: "string" },
                            description: { type: "string" }
                          }
                        } 
                      },
                      { 
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          title: { type: "string" },
                          description: { type: "string" },
                          rules: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                name: { type: "string" },
                                description: { type: "string" },
                                letters: { 
                                  type: "array",
                                  items: { type: "string" }
                                },
                                examples: { 
                                  type: "array",
                                  items: { type: "string" }
                                }
                              }
                            }
                          }
                        }
                      },
                      { 
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          title: { type: "string" },
                          rule: {
                            type: "object",
                            properties: {
                              name: { type: "string" },
                              description: { type: "string" },
                              letters: { 
                                type: "array",
                                items: { type: "string" }
                              },
                              examples: { 
                                type: "array",
                                items: { type: "string" }
                              }
                            }
                          }
                        }
                      }
                    ]
                  },
                  examples: {
                    allCategories: {
                      value: [
                        {
                          id: "nun-mati-tanwin",
                          title: "Hukum Nun Mati dan Tanwin",
                          description: "Hukum bacaan ketika bertemu nun sukun (نْ) atau tanwin (ـًـٍـٌ)"
                        },
                        {
                          id: "mim-mati",
                          title: "Hukum Mim Mati",
                          description: "Hukum bacaan ketika bertemu mim sukun (مْ)"
                        }
                      ]
                    },
                    singleCategory: {
                      value: {
                        id: "nun-mati-tanwin",
                        title: "Hukum Nun Mati dan Tanwin",
                        description: "Hukum bacaan ketika bertemu nun sukun (نْ) atau tanwin (ـًـٍـٌ)",
                        rules: [
                          {
                            name: "Izhar Halqi",
                            description: "Apabila Nun Sukun atau Tanwin bertemu huruf Halqi (حلق), dibaca jelas tanpa dengung",
                            letters: ["أ", "ه", "ح", "خ", "ع", "غ"],
                            examples: ["مِنْ اٰيٰتِنَا (QS. Al-Baqarah:248)"]
                          }
                        ]
                      }
                    },
                    singleRule: {
                      value: {
                        id: "nun-mati-tanwin",
                        title: "Hukum Nun Mati dan Tanwin",
                        rule: {
                          name: "Izhar Halqi",
                          description: "Apabila Nun Sukun atau Tanwin bertemu huruf Halqi (حلق), dibaca jelas tanpa dengung",
                          letters: ["أ", "ه", "ح", "خ", "ع", "غ"],
                          examples: [
                            "مِنْ اٰيٰتِنَا (QS. Al-Baqarah:248)",
                            "مِنْهُمْ (QS. Ali Imran:159)"
                          ]
                        }
                      }
                    }
                  }
                }
              }
            },
            "404": {
              description: "Data tidak ditemukan",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  },
                  example: {
                    error: "Kategori tidak ditemukan"
                  }
                }
              }
            }
          }
        }
      },
      "/api/doa": {
        get: {
          summary: "Mendapatkan kumpulan doa-doa harian",
          description: "Mengembalikan daftar doa Islami dengan fitur pencarian dan paginasi",
          operationId: "getDoaList",
          parameters: [
            {
              name: "title",
              in: "query",
              description: "Filter berdasarkan judul doa",
              required: false,
              schema: { 
                type: "string",
                example: "mohon perlindungan" 
              }
            },
            {
              name: "page",
              in: "query",
              description: "Nomor halaman",
              required: false,
              schema: { 
                type: "integer",
                minimum: 1,
                default: 1,
                example: 1 
              }
            },
            {
              name: "per_page",
              in: "query",
              description: "Jumlah item per halaman (max 50)",
              required: false,
              schema: { 
                type: "integer",
                minimum: 1,
                maximum: 50,
                default: 10,
                example: 10 
              }
            }
          ],
          responses: {
            "200": {
              description: "Sukses mendapatkan data doa",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { 
                        type: "string",
                        example: "success" 
                      },
                      developer: { 
                        type: "string",
                        example: "devnova-id" 
                      },
                      total: { 
                        type: "integer",
                        example: 43 
                      },
                      page: { 
                        type: "integer",
                        example: 1 
                      },
                      per_page: { 
                        type: "integer",
                        example: 10 
                      },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { 
                              type: "integer",
                              example: 1 
                            },
                            title: { 
                              type: "string",
                              example: "Doa Mohon Perlindungan" 
                            },
                            ayat: { 
                              type: "string",
                              example: "رَبِّ إِنِّي أَعُوذُ بِكَ أَنْ أَسْأَلَكَ مَا لَيْسَ لِي بِهِ عِلْمٌ ۖ وَإِلَّا تَغْفِرْ لِي وَتَرْحَمْنِي أَكُنْ مِنَ الْخَاسِرِينَ" 
                            },
                            arti: { 
                              type: "string",
                              example: "Ya Tuhanku, sungguh aku berlindung kepada-Mu dari memohon sesuatu yang aku tidak mengetahui hakikatnya..." 
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tuntunan-sholat/adzan": {
        get: {
          summary: "Mendapatkan tuntunan bacaan adzan",
          description: "Mengembalikan bacaan adzan lengkap dengan teks arab, latin, terjemahan, audio, dan informasi tambahan",
          operationId: "getAdzanGuide",
          responses: {
            "200": {
              description: "Sukses mendapatkan data adzan",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      metadata: {
                        type: "object",
                        properties: {
                          title: { type: "string", example: "Tuntunan Bacaan Adzan" },
                          description: { 
                            type: "string", 
                            example: "Bacaan adzan lengkap dengan teks arab, latin, terjemahan dan audio" 
                          },
                          source: { type: "string", example: "Tuntunan Sholat Lengkap" },
                          language: { type: "string", example: "id" },
                          createdAt: { type: "string", format: "date-time" }
                        }
                      },
                      content: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "integer", example: 1 },
                            arabic: { type: "string", example: "اَللهُ اَكْبَرُ،اَللهُ اَكْبَرُ" },
                            latin: { type: "string", example: "Allaahu Akbar, Allaahu Akbar" },
                            translation: { type: "string", example: "Allah Maha Besar, Allah Maha Besar" },
                            repetition: { type: "integer", example: 2 },
                            audio: { 
                              type: "string", 
                              example: "https://example.com/asset/tuntunan-sholat/adzan/adzan.mp3#t=0,39" 
                            }
                          }
                        }
                      },
                      fullAudio: {
                        type: "string",
                        example: "https://example.com/asset/tuntunan-sholat/adzan/adzan.mp3"
                      },
                      additionalInfo: {
                        type: "object",
                        properties: {
                          notes: {
                            type: "array",
                            items: { 
                              type: "string",
                              example: "Untuk adzan Subuh, ditambahkan 'Assalatu khairum minan naum'..."
                            }
                          },
                          references: {
                            type: "array",
                            items: { 
                              type: "string",
                              example: "HR. Bukhari no. 611 dan Muslim no. 674" 
                            }
                          }
                        }
                      }
                    }
                  },
                  example: {
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
                        audio: "https://example.com/asset/tuntunan-sholat/adzan/adzan.mp3#t=0,39"
                      },
                      {
                        id: 2,
                        arabic: "أَشْهَدُ اَنْ لاَ إِلٰهَ إِلَّااللهُ",
                        latin: "Asyhadu allaa illaaha illallaah",
                        translation: "Aku menyaksikan bahwa tiada Tuhan selain Allah",
                        repetition: 2,
                        audio: "https://example.com/asset/tuntunan-sholat/adzan/adzan.mp3#t=40,80"
                      }
                    ],
                    fullAudio: "https://example.com/asset/tuntunan-sholat/adzan/adzan.mp3",
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
                  }
                }
              }
            },
            "500": {
              description: "Internal Server Error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      message: { type: "string" }
                    }
                  },
                  example: {
                    error: "Internal Server Error",
                    message: "An unexpected error occurred"
                  }
                }
              }
            }
          }
        }
      },
      "/api/tuntunan-sholat/doa-setelah-adzan": {
        get: {
          summary: "Doa Setelah Mengumandangkan adzan",
          description: "Doa yang dibaca oleh muadzin setelah selesai mengumandangkan adzan",
          operationId: "getDoaSetelahAdzan",
          responses: {
            "200": {
              description: "Sukses mendapatkan data doa setelah adzan",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      metadata: {
                        type: "object",
                        properties: {
                          title: { 
                            type: "string", 
                            example: "Doa Setelah Selesai Mengumandangkan adzan" 
                          },
                          description: { 
                            type: "string", 
                            example: "Doa yang dibaca oleh muadzin setelah selesai mengumandangkan adzan" 
                          },
                          source: { 
                            type: "string", 
                            example: "HR. Al-Bukhari no. 614" 
                          },
                          language: { 
                            type: "string", 
                            example: "id" 
                          },
                          createdAt: { 
                            type: "string", 
                            format: "date-time" 
                          },
                          category: { 
                            type: "string", 
                            example: "Tuntunan Sholat" 
                          },
                          context: { 
                            type: "string", 
                            example: "Dibaca oleh muadzin setelah selesai mengumandangkan adzan" 
                          }
                        }
                      },
                      content: {
                        type: "object",
                        properties: {
                          arabic: { 
                            type: "string", 
                            example: "اَللّٰهُمَّ رَبَّ هٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ سَيِّدَنَا مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَالشَّرَفَ وَالدَّرَجَةَ الْعَالِيَةَ الرَّفِيعَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ، إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ." 
                          },
                          latin: { 
                            type: "string", 
                            example: "Allahumma rabba hāzihid-da‘watit-tāmmati wash-shalātil-qā’imati, āti sayyidanā Muhammadan al-wasīlata wal-fadhīlata wasy-syaroofa wad-darajatal-‘āliyatar-rāfi‘ah, wab‘ath-hu maqāman mahmūdanil-ladzī wa‘adtahu, innaka lā tukhliful-mī‘ād." 
                          },
                          translation: { 
                            type: "string", 
                            example: "Ya Allah, Tuhan yang memiliki seruan yang sempurna dan shalat yang ditegakkan, berilah Sayyiduna Muhammad wasilah, keutamaan, kemuliaan, dan derajat yang tinggi lagi luhur..." 
                          },
                          audio: { 
                            type: "string", 
                            example: "https://example.com/asset/tuntunan-sholat/doa-setelah-adzan/doa-setelah-adzan.mp3" 
                          }
                        }
                      },
                      additionalInfo: {
                        type: "object",
                        properties: {
                          penjelasan: { 
                            type: "string", 
                            example: "Doa ini dibaca oleh muadzin setelah selesai mengumandangkan adzan..." 
                          },
                          tataCara: {
                            type: "array",
                            items: { 
                              type: "string", 
                              example: "Dibaca setelah selesai mengumandangkan adzan" 
                            }
                          },
                          keutamaan: {
                            type: "array",
                            items: { 
                              type: "string", 
                              example: "Mendapatkan syafaat Nabi Muhammad SAW di hari kiamat" 
                            }
                          },
                          referensi: {
                            type: "array",
                            items: { 
                              type: "string", 
                              example: "HR. Al-Bukhari no. 614" 
                            }
                          },
                          catatan: { 
                            type: "string", 
                            example: "Doa ini sama bacaannya dengan doa setelah mendengar adzan, namun konteks dan waktu pembacaannya berbeda..." 
                          }
                        }
                      }
                    }
                  },
                  example: {
                    metadata: {
                      title: "Doa Setelah Selesai Mengumandangkan adzan",
                      description: "Doa yang dibaca oleh muadzin setelah selesai mengumandangkan adzan",
                      source: "HR. Al-Bukhari no. 614",
                      language: "id",
                      createdAt: new Date().toISOString(),
                      category: "Tuntunan Sholat",
                      context: "Dibaca oleh muadzin setelah selesai mengumandangkan adzan"
                    },
                    content: {
                      arabic: "اَللّٰهُمَّ رَبَّ هٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ سَيِّدَنَا مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَالشَّرَفَ وَالدَّرَجَةَ الْعَالِيَةَ الرَّفِيعَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ، إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ.",
                      latin: "Allahumma rabba hāzihid-da‘watit-tāmmati wash-shalātil-qā’imati, āti sayyidanā Muhammadan al-wasīlata wal-fadhīlata wasy-syaroofa wad-darajatal-‘āliyatar-rāfi‘ah, wab‘ath-hu maqāman mahmūdanil-ladzī wa‘adtahu, innaka lā tukhliful-mī‘ād.",
                      translation: "Ya Allah, Tuhan yang memiliki seruan yang sempurna dan shalat yang ditegakkan, berilah Sayyiduna Muhammad wasilah, keutamaan, kemuliaan, dan derajat yang tinggi lagi luhur. Bangkitkanlah beliau ke tempat yang terpuji sebagaimana yang telah Engkau janjikan. Sesungguhnya Engkau tidak menyalahi janji.",
                      audio: "https://example.com/asset/tuntunan-sholat/doa-setelah-adzan/doa-setelah-adzan.mp3"
                    },
                    additionalInfo: {
                      penjelasan: "Doa ini dibaca oleh muadzin setelah selesai mengumandangkan adzan. Berbeda dengan doa setelah mendengar adzan yang dibaca oleh jamaah, doa ini khusus dibaca oleh orang yang mengumandangkan adzan.",
                      tataCara: [
                        "Dibaca setelah selesai mengumandangkan adzan",
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
                      catatan: "Doa ini sama bacaannya dengan doa setelah mendengar adzan, namun konteks dan waktu pembacaannya berbeda. Muadzin membacanya setelah selesai adzan, sedangkan jamaah membacanya setelah mendengar adzan."
                    }
                  }
                }
              }
            },
            "500": {
              description: "Internal Server Error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      message: { type: "string" }
                    }
                  },
                  example: {
                    error: "Internal Server Error",
                    message: "An unexpected error occurred"
                  }
                }
              }
            }
          }
        }
      },
      "/api/tuntunan-sholat/iqomah": {
        get: {
          summary: "Bacaan Iqomah",
          description: "Bacaan iqomah lengkap dengan teks arab, latin, terjemahan dan audio",
          operationId: "getIqomahGuide",
          responses: {
            "200": {
              description: "Sukses mendapatkan data iqomah",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      metadata: {
                        type: "object",
                        properties: {
                          title: { 
                            type: "string", 
                            example: "Bacaan Iqomah" 
                          },
                          description: { 
                            type: "string", 
                            example: "Bacaan iqomah lengkap dengan teks arab, latin, terjemahan dan audio" 
                          },
                          source: { 
                            type: "string", 
                            example: "Tuntunan Sholat Lengkap" 
                          },
                          language: { 
                            type: "string", 
                            example: "id" 
                          },
                          createdAt: { 
                            type: "string", 
                            format: "date-time" 
                          },
                          context: { 
                            type: "string", 
                            example: "Dikumandangkan sebelum sholat berjamaah dimulai" 
                          }
                        }
                      },
                      content: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "integer", example: 1 },
                            arabic: { 
                              type: "string", 
                              example: "اَللهُ اَكْبَر، اَللهُ اَكْبَر" 
                            },
                            latin: { 
                              type: "string", 
                              example: "Allaahu Akbar Allaahu Akbar" 
                            },
                            translation: { 
                              type: "string", 
                              example: "Allah Maha Besar, Allah Maha Besar" 
                            },
                            repetition: { 
                              type: "integer", 
                              example: 1 
                            },
                            audio: { 
                              type: "string", 
                              example: "https://example.com/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=0,4" 
                            }
                          }
                        }
                      },
                      fullAudio: {
                        type: "string",
                        example: "https://example.com/asset/tuntunan-sholat/iqomah/iqomah.mp3"
                      },
                      additionalInfo: {
                        type: "object",
                        properties: {
                          perbedaanAdzanIqomah: {
                            type: "array",
                            items: { 
                              type: "string", 
                              example: "Iqomah dikumandangkan lebih cepat daripada adzan" 
                            }
                          },
                          tataCara: {
                            type: "array",
                            items: { 
                              type: "string", 
                              example: "Dikumandangkan setelah jamaah sholat sudah siap" 
                            }
                          },
                          hukum: { 
                            type: "string", 
                            example: "Sunnah muakkadah (sangat dianjurkan) untuk sholat berjamaah" 
                          },
                          referensi: {
                            type: "array",
                            items: { 
                              type: "string", 
                              example: "HR. Abu Daud no. 499" 
                            }
                          }
                        }
                      }
                    }
                  },
                  example: {
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
                        audio: "https://example.com/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=0,4"
                      },
                      {
                        id: 2,
                        arabic: "أَشْهَدُ اَنْ لاَ اِلَهَ إِلاَّاللهُ",
                        latin: "Asyhadu an laa illaaha illallaah",
                        translation: "Aku bersaksi bahwa Tiada Tuhan melainkan Allah",
                        repetition: 1,
                        audio: "https://example.com/asset/tuntunan-sholat/iqomah/iqomah.mp3#t=4,10"
                      }
                    ],
                    fullAudio: "https://example.com/asset/tuntunan-sholat/iqomah/iqomah.mp3",
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
                  }
                }
              }
            },
            "500": {
              description: "Internal Server Error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      message: { type: "string" }
                    }
                  },
                  example: {
                    error: "Internal Server Error",
                    message: "An unexpected error occurred"
                  }
                }
              }
            }
          }
        }
      },
      "/api/fikih-nikah": {
        get: {
          summary: "Mendapatkan materi fikih pernikahan",
          description: "Mengembalikan materi fikih pernikahan berdasarkan bagian tertentu (bagian1 sampai bagian8)",
          operationId: "getFikihNikah",
          parameters: [
            {
              name: "bagian",
              in: "query",
              description: "Nomor bagian materi (contoh: bagian1)",
              required: true,
              schema: {
                type: "string",
                enum: ["bagian1", "bagian2", "bagian3", "bagian4", "bagian5", "bagian6", "bagian7", "bagian8"],
                example: "bagian1"
              }
            }
          ],
          responses: {
            "200": {
              description: "Sukses mendapatkan data fikih nikah",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      title: { 
                        type: "string", 
                        example: "Fikih Nikah (Bag. 1)" 
                      },
                      source: { 
                        type: "string", 
                        example: "https://muslim.or.id/71772-fikih-nikah-bag-1.html" 
                      },
                      author: { 
                        type: "string", 
                        example: "Muhammad Idris, Lc." 
                      },
                      content: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            sectionTitle: { 
                              type: "string", 
                              example: "Kedudukan Pernikahan Di Dalam Islam, Pengertian, dan Rukunnya" 
                            },
                            paragraphs: {
                              type: "array",
                              items: { 
                                type: "string" 
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  example: {
                    title: "Fikih Nikah (Bag. 1)",
                    source: "https://muslim.or.id/71772-fikih-nikah-bag-1.html",
                    author: "Muhammad Idris, Lc.",
                    content: [
                      {
                        sectionTitle: "Kedudukan Pernikahan Di Dalam Islam, Pengertian, dan Rukunnya",
                        paragraphs: [
                          "Salah satu ujian yang Allah Ta’ala berikan untuk mereka yang hidup di akhir zaman adalah tersebarnya fitnah syahwat...",
                          "يَا مَعْشَرَ الشَّبَابِ مَنِ اسْتَطَاعَ مِنْكُمُ الْبَاءَةَ فَلْيَتَزَوَّجْ...",
                          "“Wahai para pemuda! Barangsiapa di antara kalian berkemampuan untuk menikah, maka menikahlah..."
                        ]
                      }
                    ]
                  }
                }
              }
            },
            "400": {
              description: "Parameter tidak valid",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "boolean", example: true },
                      message: { type: "string" }
                    }
                  },
                  example: {
                    error: true,
                    message: "Parameter 'bagian' tidak valid. Gunakan: bagian1 sampai bagian8"
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const swaggerConfig = {
    persistAuthorization: true,
    deepLinking: true,
    docExpansion: "list",
    // filter: true,
    tryItOutEnabled: false,
    validatorUrl: null
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <SwaggerUI 
            spec={apiSpec} 
            {...swaggerConfig} 
          />
        </div>
      </div>
    </div>
  );
};

export default OpenAPIPage;