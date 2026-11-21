import { Category, Wilayah, User, Ticket } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    "id": "cat-001",
    "nama": "Kebocoran Pipa Dinas",
    "grup": "Teknik",
    "prioritas_default": "KRITIS",
    "aktif": true
  },
  {
    "id": "cat-002",
    "nama": "Kebocoran Instalatur",
    "grup": "Teknik",
    "prioritas_default": "TINGGI",
    "aktif": true
  },
  {
    "id": "cat-003",
    "nama": "Supply Air",
    "grup": "Distribusi",
    "prioritas_default": "TINGGI",
    "aktif": true
  },
  {
    "id": "cat-004",
    "nama": "Pembayaran Melonjak",
    "grup": "Administrasi",
    "prioritas_default": "SEDANG",
    "aktif": true
  },
  {
    "id": "cat-005",
    "nama": "Water Meter Rusak/Mati",
    "grup": "Meter",
    "prioritas_default": "SEDANG",
    "aktif": true
  },
  {
    "id": "cat-006",
    "nama": "Lainnya",
    "grup": "Umum",
    "prioritas_default": "RENDAH",
    "aktif": true
  }
];

export const INITIAL_WILAYAH: Wilayah[] = [
  {
    "id": "1002",
    "nama": "1002 - KP. BJ KOPO-CIBUNGUR-UBRUG",
    "petugas": "Gugum",
    "lat": -6.9912,
    "lng": 106.7753,
    "aktif": true
  },
  {
    "id": "1003",
    "nama": "1003 - KAMP. UBRUG I",
    "petugas": "Gugum",
    "lat": -6.9945,
    "lng": 106.7712,
    "aktif": true
  },
  {
    "id": "1004",
    "nama": "1004 - KAMP. UBRUG II",
    "petugas": "Gugum",
    "lat": -6.998,
    "lng": 106.769,
    "aktif": true
  },
  {
    "id": "1005",
    "nama": "1005 - HEGAR MANAH",
    "petugas": "Gugum",
    "lat": -6.989,
    "lng": 106.7845,
    "aktif": true
  },
  {
    "id": "1006",
    "nama": "1006 - KAMP. SALAMIJNCANG 2",
    "petugas": "Gugum",
    "lat": -6.992,
    "lng": 106.789,
    "aktif": true
  },
  {
    "id": "1009",
    "nama": "1009 - DS. GIRIJAYA",
    "petugas": "Gugum",
    "lat": -7.001,
    "lng": 106.765,
    "aktif": true
  },
  {
    "id": "1010",
    "nama": "1010 - DAMARRAJA",
    "petugas": "Gugum",
    "lat": -7.0035,
    "lng": 106.7675,
    "aktif": true
  },
  {
    "id": "2001",
    "nama": "2001 - KAMP. SUKAHARJA",
    "petugas": "Gugum",
    "lat": -7.002,
    "lng": 106.763,
    "aktif": true
  },
  {
    "id": "2002",
    "nama": "2002 - KAMP. SUKAHARJA-LEBAKSARI",
    "petugas": "Gugum",
    "lat": -7.005,
    "lng": 106.761,
    "aktif": true
  },
  {
    "id": "2003",
    "nama": "2003 - KAMP. SUKASARI-SINDANGSARI",
    "petugas": "Gugum",
    "lat": -7.0075,
    "lng": 106.759,
    "aktif": true
  },
  {
    "id": "2004",
    "nama": "2004 - KAMP. SIMPENAN",
    "petugas": "Gugum",
    "lat": -7.011,
    "lng": 106.756,
    "aktif": true
  },
  {
    "id": "2005",
    "nama": "2005 - KAMP. PAWAGAN",
    "petugas": "Gugum",
    "lat": -7.014,
    "lng": 106.753,
    "aktif": true
  },
  {
    "id": "1001",
    "nama": "1001 - KAMP. CIKONENG",
    "petugas": "Fajar",
    "lat": -6.9852,
    "lng": 106.7821,
    "aktif": true
  },
  {
    "id": "1008",
    "nama": "1008 - KP. MANGGA DUA-SINDANG KERTA",
    "petugas": "Fajar",
    "lat": -6.978,
    "lng": 106.786,
    "aktif": true
  },
  {
    "id": "3008",
    "nama": "3008 - CIJAMBE",
    "petugas": "Fajar",
    "lat": -6.9815,
    "lng": 106.7895,
    "aktif": true
  },
  {
    "id": "3009",
    "nama": "3009 - KP. CILANDAK - LIO",
    "petugas": "Fajar",
    "lat": -6.979,
    "lng": 106.793,
    "aktif": true
  },
  {
    "id": "3010",
    "nama": "3010 - BANTAR GADUNG PASEPAN I",
    "petugas": "Fajar",
    "lat": -6.974,
    "lng": 106.798,
    "aktif": true
  },
  {
    "id": "3011",
    "nama": "3011 - PERUM SME BAITI JANNATI",
    "petugas": "Fajar",
    "lat": -6.982,
    "lng": 106.784,
    "aktif": true
  },
  {
    "id": "3012",
    "nama": "3012 - KP. GELARSARI",
    "petugas": "Fajar",
    "lat": -6.9865,
    "lng": 106.7905,
    "aktif": true
  },
  {
    "id": "3014",
    "nama": "3014 - TARISI CITAMBANG",
    "petugas": "Fajar",
    "lat": -6.989,
    "lng": 106.794,
    "aktif": true
  },
  {
    "id": "4016",
    "nama": "4016 - PERUM. BUMI CIKEMBANG",
    "petugas": "Fajar",
    "lat": -6.984,
    "lng": 106.779,
    "aktif": true
  },
  {
    "id": "1007",
    "nama": "1007 - KP. SOBOG KP. BARU SUKARESMI",
    "petugas": "Andi",
    "lat": -6.983,
    "lng": 106.791,
    "aktif": true
  },
  {
    "id": "3001",
    "nama": "3001 - KAMP. SELAGEDANG-CIGOMBONG",
    "petugas": "Andi",
    "lat": -6.976,
    "lng": 106.795,
    "aktif": true
  },
  {
    "id": "3002",
    "nama": "3002 - KAMP. CIGOMBONG",
    "petugas": "Andi",
    "lat": -6.9745,
    "lng": 106.7975,
    "aktif": true
  },
  {
    "id": "3004",
    "nama": "3004 - KAMP. WARUNGKIARA",
    "petugas": "Andi",
    "lat": -6.972,
    "lng": 106.802,
    "aktif": true
  },
  {
    "id": "3005",
    "nama": "3005 - KAMP. WARUNGKIARA 02",
    "petugas": "Andi",
    "lat": -6.97,
    "lng": 106.804,
    "aktif": true
  },
  {
    "id": "3006",
    "nama": "3006 - WARUNGKIARA-BABAKAN",
    "petugas": "Andi",
    "lat": -6.968,
    "lng": 106.806,
    "aktif": true
  },
  {
    "id": "3007",
    "nama": "3007 - BAED I",
    "petugas": "Andi",
    "lat": -6.965,
    "lng": 106.808,
    "aktif": true
  },
  {
    "id": "3013",
    "nama": "3013 - BAED II",
    "petugas": "Andi",
    "lat": -6.963,
    "lng": 106.81,
    "aktif": true
  },
  {
    "id": "8014",
    "nama": "8014 - BOJONGPARI",
    "petugas": "Andi",
    "lat": -6.961,
    "lng": 106.812,
    "aktif": true
  },
  {
    "id": "8015",
    "nama": "8015 - KP. MANGUNJAYA",
    "petugas": "Andi",
    "lat": -6.959,
    "lng": 106.814,
    "aktif": true
  },
  {
    "id": "4001",
    "nama": "4001 - CICATIH",
    "petugas": "Apri",
    "lat": -6.981,
    "lng": 106.768,
    "aktif": true
  },
  {
    "id": "4002",
    "nama": "4002 - KAMP. CIKEMBANG I",
    "petugas": "Apri",
    "lat": -6.986,
    "lng": 106.774,
    "aktif": true
  },
  {
    "id": "4004",
    "nama": "4004 - KAMP. CIKEMBANG II",
    "petugas": "Apri",
    "lat": -6.9875,
    "lng": 106.776,
    "aktif": true
  },
  {
    "id": "4006",
    "nama": "4006 - KAMP. CIARENGKOK",
    "petugas": "Apri",
    "lat": -6.989,
    "lng": 106.771,
    "aktif": true
  },
  {
    "id": "4007",
    "nama": "4007 - KAMP. CIARENGKOK-CIKAMANTRI",
    "petugas": "Apri",
    "lat": -6.991,
    "lng": 106.7695,
    "aktif": true
  },
  {
    "id": "4012",
    "nama": "4012 - KAMP. CITENGAH-SUKAMULYA",
    "petugas": "Apri",
    "lat": -6.993,
    "lng": 106.767,
    "aktif": true
  },
  {
    "id": "4013",
    "nama": "4013 - KAMP. CIPETIR DS. SUKAMULYA",
    "petugas": "Apri",
    "lat": -6.995,
    "lng": 106.765,
    "aktif": true
  },
  {
    "id": "4015",
    "nama": "4015 - KAMP. CIBONGGOM",
    "petugas": "Apri",
    "lat": -6.997,
    "lng": 106.763,
    "aktif": true
  },
  {
    "id": "5001",
    "nama": "5001 - KP. SUKAMANTRI-CIARENGKOK",
    "petugas": "Apri",
    "lat": -6.9985,
    "lng": 106.762,
    "aktif": true
  },
  {
    "id": "5002",
    "nama": "5002 - KAMP. SIMPENAN 02",
    "petugas": "Apri",
    "lat": -7.0005,
    "lng": 106.76,
    "aktif": true
  },
  {
    "id": "4003",
    "nama": "4003 - KAMP. KEBON JERUK",
    "petugas": "Zidan",
    "lat": -6.9895,
    "lng": 106.778,
    "aktif": true
  },
  {
    "id": "4005",
    "nama": "4005 - KAMP. CIMANGGU",
    "petugas": "Zidan",
    "lat": -6.9915,
    "lng": 106.78,
    "aktif": true
  },
  {
    "id": "5004",
    "nama": "5004 - KAMP. CIKEMBAR I",
    "petugas": "Zidan",
    "lat": -6.993,
    "lng": 106.781,
    "aktif": true
  },
  {
    "id": "5007",
    "nama": "5007 - KAMP. CIKEMBAR IV",
    "petugas": "Zidan",
    "lat": -6.996,
    "lng": 106.783,
    "aktif": true
  },
  {
    "id": "6006",
    "nama": "6006 - SAMPORA-CIBODAS I",
    "petugas": "Zidan",
    "lat": -7.008,
    "lng": 106.772,
    "aktif": true
  },
  {
    "id": "6007",
    "nama": "6007 - SAMPORA-CIBODAS II",
    "petugas": "Zidan",
    "lat": -7.01,
    "lng": 106.77,
    "aktif": true
  },
  {
    "id": "6008",
    "nama": "6008 - PERUM. PERMATA INDAH SAMPORA",
    "petugas": "Zidan",
    "lat": -7.0125,
    "lng": 106.768,
    "aktif": true
  },
  {
    "id": "4008",
    "nama": "4008 - KAMP. CIANGSANA - SUKAMULYA",
    "petugas": "Rivaldi",
    "lat": -7.003,
    "lng": 106.758,
    "aktif": true
  },
  {
    "id": "4009",
    "nama": "4009 - PERUM. CIKEMBAR RESIDENCE",
    "petugas": "Rivaldi",
    "lat": -7.001,
    "lng": 106.7595,
    "aktif": true
  },
  {
    "id": "4010",
    "nama": "4010 - CIMENTENG",
    "petugas": "Rivaldi",
    "lat": -7.005,
    "lng": 106.755,
    "aktif": true
  },
  {
    "id": "4011",
    "nama": "4011 - KAMP. CIANGSANA 2",
    "petugas": "Rivaldi",
    "lat": -7.007,
    "lng": 106.753,
    "aktif": true
  },
  {
    "id": "5005",
    "nama": "5005 - KAMP. CIKEMBAR II",
    "petugas": "Rivaldi",
    "lat": -6.994,
    "lng": 106.782,
    "aktif": true
  },
  {
    "id": "6003",
    "nama": "6003 - MEKAR SARI-BJ WARUNG",
    "petugas": "Rivaldi",
    "lat": -7.016,
    "lng": 106.752,
    "aktif": true
  },
  {
    "id": "6004",
    "nama": "6004 - BJ KIDUL-BJ WARUNG-S.TUJUH",
    "petugas": "Rivaldi",
    "lat": -7.018,
    "lng": 106.75,
    "aktif": true
  },
  {
    "id": "5003",
    "nama": "5003 - KAMP. CILANGKAP",
    "petugas": "Rizal",
    "lat": -7.012,
    "lng": 106.754,
    "aktif": true
  },
  {
    "id": "5006",
    "nama": "5006 - KAMP. CIKEMBAR III",
    "petugas": "Rizal",
    "lat": -6.995,
    "lng": 106.7825,
    "aktif": true
  },
  {
    "id": "5008",
    "nama": "5008 - KAMP. PIPINJIL-CIHUNI",
    "petugas": "Rizal",
    "lat": -7.02,
    "lng": 106.748,
    "aktif": true
  },
  {
    "id": "5009",
    "nama": "5009 - KP. CIKATE-PALIMABELAS",
    "petugas": "Rizal",
    "lat": -7.022,
    "lng": 106.746,
    "aktif": true
  },
  {
    "id": "5010",
    "nama": "5010 - KP. TEGAL PANJANG-DS. SUKAMAJU",
    "petugas": "Rizal",
    "lat": -7.024,
    "lng": 106.744,
    "aktif": true
  },
  {
    "id": "6001",
    "nama": "6001 - KP. PS GABIG-GN GADUNG",
    "petugas": "Rizal",
    "lat": -7.015,
    "lng": 106.758,
    "aktif": true
  },
  {
    "id": "6002",
    "nama": "6002 - MK. SARI CIKAREO-GABIG BJK",
    "petugas": "Rizal",
    "lat": -7.017,
    "lng": 106.756,
    "aktif": true
  },
  {
    "id": "6005",
    "nama": "6005 - SAMPORA NEGLASARI-CIBODAS",
    "petugas": "Rizal",
    "lat": -7.014,
    "lng": 106.766,
    "aktif": true
  }
];

export const INITIAL_USERS: User[] = [
  {
    "user_id": "usr-admin-01",
    "nama": "Administrator Cabang",
    "email": "admin@pdam.local",
    "role": "admin",
    "status_aktif": true
  },
  {
    "user_id": "usr-kaur-01",
    "nama": "Kaur Teknik & Distribusi",
    "email": "kaur@pdam.local",
    "role": "kaur",
    "status_aktif": true
  },
  {
    "user_id": "usr-kacab-01",
    "nama": "Kepala Cabang Cikembar",
    "email": "kacab@pdam.local",
    "role": "kepala_cabang",
    "status_aktif": true
  },
  {
    "user_id": "usr-kas-01",
    "nama": "Petugas Kassa",
    "email": "kas@pdam.local",
    "role": "kas",
    "status_aktif": true
  },
  {
    "user_id": "usr-baca-01",
    "nama": "Gugum (Pembaca Meter Blok 1)",
    "email": "gugum@pdam.local",
    "role": "petugas_baca",
    "wilayah_id": "1002",
    "status_aktif": true
  },
  {
    "user_id": "usr-baca-02",
    "nama": "Fajar (Pembaca Meter Blok 2)",
    "email": "fajar@pdam.local",
    "role": "petugas_baca",
    "wilayah_id": "1001",
    "status_aktif": true
  },
  {
    "user_id": "usr-baca-03",
    "nama": "Andi (Pembaca Meter Blok 3)",
    "email": "andi@pdam.local",
    "role": "petugas_baca",
    "wilayah_id": "3004",
    "status_aktif": true
  },
  {
    "user_id": "usr-baca-04",
    "nama": "Apri (Pembaca Meter Blok 4)",
    "email": "apri@pdam.local",
    "role": "petugas_baca",
    "wilayah_id": "4002",
    "status_aktif": true
  },
  {
    "user_id": "usr-baca-05",
    "nama": "Zidan (Pembaca Meter Blok 5)",
    "email": "zidan@pdam.local",
    "role": "petugas_baca",
    "wilayah_id": "5004",
    "status_aktif": true
  },
  {
    "user_id": "usr-baca-06",
    "nama": "Rivaldi (Pembaca Meter Blok 6)",
    "email": "rivaldi@pdam.local",
    "role": "petugas_baca",
    "wilayah_id": "4008",
    "status_aktif": true
  },
  {
    "user_id": "usr-baca-07",
    "nama": "Rizal (Pembaca Meter Blok 7)",
    "email": "rizal@pdam.local",
    "role": "petugas_baca",
    "wilayah_id": "5003",
    "status_aktif": true
  },
  {
    "user_id": "usr-tek-01",
    "nama": "Dadan Hamdani (Teknisi Lapangan)",
    "email": "dadan@pdam.local",
    "role": "petugas_teknik",
    "status_aktif": true
  },
  {
    "user_id": "usr-tek-02",
    "nama": "Hendra Gunawan (Teknisi Lapangan)",
    "email": "hendra@pdam.local",
    "role": "petugas_teknik",
    "status_aktif": true
  },
  {
    "user_id": "usr-tek-03",
    "nama": "Iwan Setiawan (Teknisi Lapangan)",
    "email": "iwan@pdam.local",
    "role": "petugas_teknik",
    "status_aktif": true
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    "id": "tk-cikembar-1",
    "nomor_tiket": "TKT-202611-0001",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010010110",
    "nama_pelanggan": "HU. (E. Baesusi)",
    "no_hp": "085700000000",
    "ukuran_pipa": "1/2\"",
    "kategori_id": "cat-001",
    "kategori_nama": "Kebocoran Pipa Dinas",
    "wilayah_id": "1002",
    "wilayah_nama": "1002 - KP. BJ KOPO-CIBUNGUR-UBRUG",
    "deskripsi": "Pipa dinas bocor sembur di depan rumah warga dekat jalan utama, air bersih meluap ke bahu jalan.",
    "lat": -6.9912,
    "lng": 106.7783,
    "akurasi_gps": 4.5,
    "prioritas": "KRITIS",
    "status": "BARU",
    "assigned_to": null,
    "assigned_to_nama": null,
    "created_at": "2026-11-01T08:00:00.000Z",
    "updated_at": "2026-11-01T10:00:00.000Z",
    "photos": [
      {
        "id": "photo-1-1",
        "ticket_id": "tk-cikembar-1",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0001.jpg",
        "created_at": "2026-11-01T08:00:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-1-1",
        "ticket_id": "tk-cikembar-1",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 1002 - KP. BJ KOPO-CIBUNGUR-UBRUG",
        "created_at": "2026-11-01T08:00:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-2",
    "nomor_tiket": "TKT-202611-0002",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010010571",
    "nama_pelanggan": "TITIN RUSTINI",
    "no_hp": "085701234567",
    "ukuran_pipa": "3/4\"",
    "kategori_id": "cat-002",
    "kategori_nama": "Kebocoran Instalatur",
    "wilayah_id": "1003",
    "wilayah_nama": "1003 - KAMP. UBRUG I",
    "deskripsi": "Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman rumah.",
    "lat": -6.991976,
    "lng": 106.772821,
    "akurasi_gps": 5.5,
    "prioritas": "TINGGI",
    "status": "DITUGASKAN",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-02T09:07:00.000Z",
    "updated_at": "2026-11-02T11:07:00.000Z",
    "photos": [
      {
        "id": "photo-2-1",
        "ticket_id": "tk-cikembar-2",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0002.jpg",
        "created_at": "2026-11-02T09:07:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-2-1",
        "ticket_id": "tk-cikembar-2",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 1003 - KAMP. UBRUG I",
        "created_at": "2026-11-02T09:07:00.000Z"
      },
      {
        "id": "prog-2-2",
        "ticket_id": "tk-cikembar-2",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-02T09:37:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-3",
    "nomor_tiket": "TKT-202611-0003",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010010947",
    "nama_pelanggan": "SITI RAHAYU",
    "no_hp": "085702469134",
    "ukuran_pipa": "",
    "kategori_id": "cat-003",
    "kategori_nama": "Supply Air",
    "wilayah_id": "1004",
    "wilayah_nama": "1004 - KAMP. UBRUG II",
    "deskripsi": "Air mengalir keruh kekuningan bercampur endapan lumpur setelah ada perbaikan pipa utama.",
    "lat": -6.995272,
    "lng": 106.767752,
    "akurasi_gps": 6.5,
    "prioritas": "TINGGI",
    "status": "DALAM_PROSES",
    "assigned_to": "usr-tek-03",
    "assigned_to_nama": "Iwan Setiawan (Teknisi Lapangan)",
    "created_at": "2026-11-03T10:14:00.000Z",
    "updated_at": "2026-11-03T12:14:00.000Z",
    "photos": [
      {
        "id": "photo-3-1",
        "ticket_id": "tk-cikembar-3",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0003.jpg",
        "created_at": "2026-11-03T10:14:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-3-1",
        "ticket_id": "tk-cikembar-3",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 1004 - KAMP. UBRUG II",
        "created_at": "2026-11-03T10:14:00.000Z"
      },
      {
        "id": "prog-3-2",
        "ticket_id": "tk-cikembar-3",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Iwan Setiawan (Teknisi Lapangan)",
        "created_at": "2026-11-03T10:44:00.000Z"
      },
      {
        "id": "prog-3-3",
        "ticket_id": "tk-cikembar-3",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-03T12:14:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-4",
    "nomor_tiket": "TKT-202611-0004",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010020055",
    "nama_pelanggan": "Mahni",
    "no_hp": "085703703701",
    "ukuran_pipa": "",
    "kategori_id": "cat-004",
    "kategori_nama": "Pembayaran Melonjak",
    "wilayah_id": "1005",
    "wilayah_nama": "1005 - HEGAR MANAH",
    "deskripsi": "Ada dugaan kebocoran dalam instalasi pipa rumah yang menyebabkan lonjakan tagihan air.",
    "lat": -6.988577,
    "lng": 106.78153,
    "akurasi_gps": 7.5,
    "prioritas": "SEDANG",
    "status": "SELESAI",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-04T11:21:00.000Z",
    "updated_at": "2026-11-05T11:21:00.000Z",
    "photos": [
      {
        "id": "photo-4-1",
        "ticket_id": "tk-cikembar-4",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0004.jpg",
        "created_at": "2026-11-04T11:21:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-4-1",
        "ticket_id": "tk-cikembar-4",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 1005 - HEGAR MANAH",
        "created_at": "2026-11-04T11:21:00.000Z"
      },
      {
        "id": "prog-4-2",
        "ticket_id": "tk-cikembar-4",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-04T11:51:00.000Z"
      },
      {
        "id": "prog-4-3",
        "ticket_id": "tk-cikembar-4",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-04T13:21:00.000Z"
      },
      {
        "id": "prog-4-4",
        "ticket_id": "tk-cikembar-4",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-05T11:21:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-5",
    "nomor_tiket": "TKT-202611-0005",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010020290",
    "nama_pelanggan": "Duloh",
    "no_hp": "085704938268",
    "ukuran_pipa": "",
    "kategori_id": "cat-005",
    "kategori_nama": "Water Meter Rusak/Mati",
    "wilayah_id": "1006",
    "wilayah_nama": "1006 - KAMP. SALAMIJNCANG 2",
    "deskripsi": "Angka stan meter macet total tidak berputar walaupun kran air sedang digunakan.",
    "lat": -6.99427,
    "lng": 106.787039,
    "akurasi_gps": 8.5,
    "prioritas": "SEDANG",
    "status": "DITUTUP",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-05T12:28:00.000Z",
    "updated_at": "2026-11-06T12:28:00.000Z",
    "photos": [
      {
        "id": "photo-5-1",
        "ticket_id": "tk-cikembar-5",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0005.jpg",
        "created_at": "2026-11-05T12:28:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-5-1",
        "ticket_id": "tk-cikembar-5",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 1006 - KAMP. SALAMIJNCANG 2",
        "created_at": "2026-11-05T12:28:00.000Z"
      },
      {
        "id": "prog-5-2",
        "ticket_id": "tk-cikembar-5",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-05T12:58:00.000Z"
      },
      {
        "id": "prog-5-3",
        "ticket_id": "tk-cikembar-5",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-05T14:28:00.000Z"
      },
      {
        "id": "prog-5-4",
        "ticket_id": "tk-cikembar-5",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-06T12:28:00.000Z"
      },
      {
        "id": "prog-5-5",
        "ticket_id": "tk-cikembar-5",
        "actor_id": "usr-admin-01",
        "actor_nama": "Administrator Cabang",
        "status_baru": "DITUTUP",
        "catatan": "Tiket ditutup dan diverifikasi oleh admin cabang.",
        "created_at": "2026-11-06T13:28:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-6",
    "nomor_tiket": "TKT-202611-0006",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010020330",
    "nama_pelanggan": "Endang",
    "no_hp": "085706172835",
    "ukuran_pipa": "",
    "kategori_id": "cat-006",
    "kategori_nama": "Lainnya",
    "wilayah_id": "1009",
    "wilayah_nama": "1009 - DS. GIRIJAYA",
    "deskripsi": "Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.",
    "lat": -7.003877,
    "lng": 106.765851,
    "akurasi_gps": 4.5,
    "prioritas": "RENDAH",
    "status": "BARU",
    "assigned_to": null,
    "assigned_to_nama": null,
    "created_at": "2026-11-06T13:35:00.000Z",
    "updated_at": "2026-11-06T15:35:00.000Z",
    "photos": [
      {
        "id": "photo-6-1",
        "ticket_id": "tk-cikembar-6",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0006.jpg",
        "created_at": "2026-11-06T13:35:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-6-1",
        "ticket_id": "tk-cikembar-6",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 1009 - DS. GIRIJAYA",
        "created_at": "2026-11-06T13:35:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-7",
    "nomor_tiket": "TKT-202611-0007",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010020457",
    "nama_pelanggan": "Dayat Hidayat",
    "no_hp": "085707407402",
    "ukuran_pipa": "3/4\"",
    "kategori_id": "cat-001",
    "kategori_nama": "Kebocoran Pipa Dinas",
    "wilayah_id": "1010",
    "wilayah_nama": "1010 - DAMARRAJA",
    "deskripsi": "Pipa dinas retak sambungan socket akibat beban kendaraan, rembesan air cukup deras.",
    "lat": -7.004338,
    "lng": 106.770381,
    "akurasi_gps": 5.5,
    "prioritas": "KRITIS",
    "status": "DITUGASKAN",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-07T14:42:00.000Z",
    "updated_at": "2026-11-07T16:42:00.000Z",
    "photos": [
      {
        "id": "photo-7-1",
        "ticket_id": "tk-cikembar-7",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0007.jpg",
        "created_at": "2026-11-07T14:42:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-7-1",
        "ticket_id": "tk-cikembar-7",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 1010 - DAMARRAJA",
        "created_at": "2026-11-07T14:42:00.000Z"
      },
      {
        "id": "prog-7-2",
        "ticket_id": "tk-cikembar-7",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-07T15:12:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-8",
    "nomor_tiket": "TKT-202611-0008",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010020484",
    "nama_pelanggan": "Nazarudin Latif",
    "no_hp": "085708641969",
    "ukuran_pipa": "1\"",
    "kategori_id": "cat-002",
    "kategori_nama": "Kebocoran Instalatur",
    "wilayah_id": "2001",
    "wilayah_nama": "2001 - KAMP. SUKAHARJA",
    "deskripsi": "Pipa instalatur bocor halus di bawah pondasi pagar rumah konsumen.",
    "lat": -7.000029,
    "lng": 106.765262,
    "akurasi_gps": 6.5,
    "prioritas": "TINGGI",
    "status": "DALAM_PROSES",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-08T15:49:00.000Z",
    "updated_at": "2026-11-08T17:49:00.000Z",
    "photos": [
      {
        "id": "photo-8-1",
        "ticket_id": "tk-cikembar-8",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0008.jpg",
        "created_at": "2026-11-08T15:49:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-8-1",
        "ticket_id": "tk-cikembar-8",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 2001 - KAMP. SUKAHARJA",
        "created_at": "2026-11-08T15:49:00.000Z"
      },
      {
        "id": "prog-8-2",
        "ticket_id": "tk-cikembar-8",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-08T16:19:00.000Z"
      },
      {
        "id": "prog-8-3",
        "ticket_id": "tk-cikembar-8",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-08T17:49:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-9",
    "nomor_tiket": "TKT-202611-0009",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010020516",
    "nama_pelanggan": "GUMILAR KHAERUL MUTAQIN",
    "no_hp": "085709876536",
    "ukuran_pipa": "",
    "kategori_id": "cat-003",
    "kategori_nama": "Supply Air",
    "wilayah_id": "2002",
    "wilayah_nama": "2002 - KAMP. SUKAHARJA-LEBAKSARI",
    "deskripsi": "Aliran air mati total sejak 2 hari lalu di daerah ketinggian/ujung jaringan pipa blok.",
    "lat": -7.002032,
    "lng": 106.760563,
    "akurasi_gps": 7.5,
    "prioritas": "TINGGI",
    "status": "SELESAI",
    "assigned_to": "usr-tek-03",
    "assigned_to_nama": "Iwan Setiawan (Teknisi Lapangan)",
    "created_at": "2026-11-09T08:56:00.000Z",
    "updated_at": "2026-11-10T08:56:00.000Z",
    "photos": [
      {
        "id": "photo-9-1",
        "ticket_id": "tk-cikembar-9",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0009.jpg",
        "created_at": "2026-11-09T08:56:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-9-1",
        "ticket_id": "tk-cikembar-9",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 2002 - KAMP. SUKAHARJA-LEBAKSARI",
        "created_at": "2026-11-09T08:56:00.000Z"
      },
      {
        "id": "prog-9-2",
        "ticket_id": "tk-cikembar-9",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Iwan Setiawan (Teknisi Lapangan)",
        "created_at": "2026-11-09T09:26:00.000Z"
      },
      {
        "id": "prog-9-3",
        "ticket_id": "tk-cikembar-9",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-09T10:56:00.000Z"
      },
      {
        "id": "prog-9-4",
        "ticket_id": "tk-cikembar-9",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-10T08:56:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-10",
    "nomor_tiket": "TKT-202611-0010",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010020902",
    "nama_pelanggan": "Ujang Samsudin",
    "no_hp": "085711111103",
    "ukuran_pipa": "",
    "kategori_id": "cat-004",
    "kategori_nama": "Pembayaran Melonjak",
    "wilayah_id": "2003",
    "wilayah_nama": "2003 - KAMP. SUKASARI-SINDANGSARI",
    "deskripsi": "Pelanggan mengajukan keberatan tagihan bulan ini naik tinggi, mohon cek stan meteran fisik.",
    "lat": -7.006264,
    "lng": 106.756267,
    "akurasi_gps": 8.5,
    "prioritas": "SEDANG",
    "status": "DITUTUP",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-10T09:03:00.000Z",
    "updated_at": "2026-11-11T09:03:00.000Z",
    "photos": [
      {
        "id": "photo-10-1",
        "ticket_id": "tk-cikembar-10",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0010.jpg",
        "created_at": "2026-11-10T09:03:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-10-1",
        "ticket_id": "tk-cikembar-10",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 2003 - KAMP. SUKASARI-SINDANGSARI",
        "created_at": "2026-11-10T09:03:00.000Z"
      },
      {
        "id": "prog-10-2",
        "ticket_id": "tk-cikembar-10",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-10T09:33:00.000Z"
      },
      {
        "id": "prog-10-3",
        "ticket_id": "tk-cikembar-10",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-10T11:03:00.000Z"
      },
      {
        "id": "prog-10-4",
        "ticket_id": "tk-cikembar-10",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-11T09:03:00.000Z"
      },
      {
        "id": "prog-10-5",
        "ticket_id": "tk-cikembar-10",
        "actor_id": "usr-admin-01",
        "actor_nama": "Administrator Cabang",
        "status_baru": "DITUTUP",
        "catatan": "Tiket ditutup dan diverifikasi oleh admin cabang.",
        "created_at": "2026-11-11T10:03:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-11",
    "nomor_tiket": "TKT-202611-0011",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010030033",
    "nama_pelanggan": "KARLAN",
    "no_hp": "085712345670",
    "ukuran_pipa": "",
    "kategori_id": "cat-005",
    "kategori_nama": "Water Meter Rusak/Mati",
    "wilayah_id": "2004",
    "wilayah_nama": "2004 - KAMP. SIMPENAN",
    "deskripsi": "Jarum indikator meteran patah dan segel meter terlepas.",
    "lat": -7.012632,
    "lng": 106.753483,
    "akurasi_gps": 4.5,
    "prioritas": "SEDANG",
    "status": "BARU",
    "assigned_to": null,
    "assigned_to_nama": null,
    "created_at": "2026-11-11T10:10:00.000Z",
    "updated_at": "2026-11-11T12:10:00.000Z",
    "photos": [
      {
        "id": "photo-11-1",
        "ticket_id": "tk-cikembar-11",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0011.jpg",
        "created_at": "2026-11-11T10:10:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-11-1",
        "ticket_id": "tk-cikembar-11",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 2004 - KAMP. SIMPENAN",
        "created_at": "2026-11-11T10:10:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-12",
    "nomor_tiket": "TKT-202611-0012",
    "pelapor_id": "usr-baca-01",
    "pelapor_nama": "Gugum (Pembaca Meter Blok 1)",
    "pelanggan_id": "10010050007",
    "nama_pelanggan": "ADE KARYA",
    "no_hp": "085713580237",
    "ukuran_pipa": "",
    "kategori_id": "cat-006",
    "kategori_nama": "Lainnya",
    "wilayah_id": "2005",
    "wilayah_nama": "2005 - KAMP. PAWAGAN",
    "deskripsi": "Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.",
    "lat": -7.017,
    "lng": 106.753013,
    "akurasi_gps": 5.5,
    "prioritas": "RENDAH",
    "status": "DITUGASKAN",
    "assigned_to": "usr-tek-03",
    "assigned_to_nama": "Iwan Setiawan (Teknisi Lapangan)",
    "created_at": "2026-11-12T11:17:00.000Z",
    "updated_at": "2026-11-12T13:17:00.000Z",
    "photos": [
      {
        "id": "photo-12-1",
        "ticket_id": "tk-cikembar-12",
        "uploader_id": "usr-baca-01",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0012.jpg",
        "created_at": "2026-11-12T11:17:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-12-1",
        "ticket_id": "tk-cikembar-12",
        "actor_id": "usr-baca-01",
        "actor_nama": "Gugum (Pembaca Meter Blok 1)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 2005 - KAMP. PAWAGAN",
        "created_at": "2026-11-12T11:17:00.000Z"
      },
      {
        "id": "prog-12-2",
        "ticket_id": "tk-cikembar-12",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Iwan Setiawan (Teknisi Lapangan)",
        "created_at": "2026-11-12T11:47:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-13",
    "nomor_tiket": "TKT-202611-0013",
    "pelapor_id": "usr-baca-02",
    "pelapor_nama": "Fajar (Pembaca Meter Blok 2)",
    "pelanggan_id": "10010050060",
    "nama_pelanggan": "Rahmat N",
    "no_hp": "085714814804",
    "ukuran_pipa": "1\"",
    "kategori_id": "cat-001",
    "kategori_nama": "Kebocoran Pipa Dinas",
    "wilayah_id": "1001",
    "wilayah_nama": "1001 - KAMP. CIKONENG",
    "deskripsi": "Pipa dinas 2 inch pecah samping tiang listrik, aliran air terbuang ke drainase.",
    "lat": -6.98681,
    "lng": 106.784632,
    "akurasi_gps": 6.5,
    "prioritas": "KRITIS",
    "status": "DALAM_PROSES",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-13T12:24:00.000Z",
    "updated_at": "2026-11-13T14:24:00.000Z",
    "photos": [
      {
        "id": "photo-13-1",
        "ticket_id": "tk-cikembar-13",
        "uploader_id": "usr-baca-02",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0013.jpg",
        "created_at": "2026-11-13T12:24:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-13-1",
        "ticket_id": "tk-cikembar-13",
        "actor_id": "usr-baca-02",
        "actor_nama": "Fajar (Pembaca Meter Blok 2)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 1001 - KAMP. CIKONENG",
        "created_at": "2026-11-13T12:24:00.000Z"
      },
      {
        "id": "prog-13-2",
        "ticket_id": "tk-cikembar-13",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-13T12:54:00.000Z"
      },
      {
        "id": "prog-13-3",
        "ticket_id": "tk-cikembar-13",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-13T14:24:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-14",
    "nomor_tiket": "TKT-202611-0014",
    "pelapor_id": "usr-baca-02",
    "pelapor_nama": "Fajar (Pembaca Meter Blok 2)",
    "pelanggan_id": "10010060024",
    "nama_pelanggan": "I J A",
    "no_hp": "085716049371",
    "ukuran_pipa": "1 1/2\"",
    "kategori_id": "cat-002",
    "kategori_nama": "Kebocoran Instalatur",
    "wilayah_id": "1008",
    "wilayah_nama": "1008 - KP. MANGGA DUA-SINDANG KERTA",
    "deskripsi": "Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman rumah.",
    "lat": -6.976739,
    "lng": 106.788722,
    "akurasi_gps": 7.5,
    "prioritas": "TINGGI",
    "status": "SELESAI",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-14T13:31:00.000Z",
    "updated_at": "2026-11-15T13:31:00.000Z",
    "photos": [
      {
        "id": "photo-14-1",
        "ticket_id": "tk-cikembar-14",
        "uploader_id": "usr-baca-02",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0014.jpg",
        "created_at": "2026-11-14T13:31:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-14-1",
        "ticket_id": "tk-cikembar-14",
        "actor_id": "usr-baca-02",
        "actor_nama": "Fajar (Pembaca Meter Blok 2)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 1008 - KP. MANGGA DUA-SINDANG KERTA",
        "created_at": "2026-11-14T13:31:00.000Z"
      },
      {
        "id": "prog-14-2",
        "ticket_id": "tk-cikembar-14",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-14T14:01:00.000Z"
      },
      {
        "id": "prog-14-3",
        "ticket_id": "tk-cikembar-14",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-14T15:31:00.000Z"
      },
      {
        "id": "prog-14-4",
        "ticket_id": "tk-cikembar-14",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-15T13:31:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-15",
    "nomor_tiket": "TKT-202611-0015",
    "pelapor_id": "usr-baca-02",
    "pelapor_nama": "Fajar (Pembaca Meter Blok 2)",
    "pelanggan_id": "10010060101",
    "nama_pelanggan": "ANAH",
    "no_hp": "085717283938",
    "ukuran_pipa": "",
    "kategori_id": "cat-003",
    "kategori_nama": "Supply Air",
    "wilayah_id": "3008",
    "wilayah_nama": "3008 - CIJAMBE",
    "deskripsi": "Air mengalir keruh kekuningan bercampur endapan lumpur setelah ada perbaikan pipa utama.",
    "lat": -6.978528,
    "lng": 106.78991,
    "akurasi_gps": 8.5,
    "prioritas": "TINGGI",
    "status": "DITUTUP",
    "assigned_to": "usr-tek-03",
    "assigned_to_nama": "Iwan Setiawan (Teknisi Lapangan)",
    "created_at": "2026-11-15T14:38:00.000Z",
    "updated_at": "2026-11-16T14:38:00.000Z",
    "photos": [
      {
        "id": "photo-15-1",
        "ticket_id": "tk-cikembar-15",
        "uploader_id": "usr-baca-02",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0015.jpg",
        "created_at": "2026-11-15T14:38:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-15-1",
        "ticket_id": "tk-cikembar-15",
        "actor_id": "usr-baca-02",
        "actor_nama": "Fajar (Pembaca Meter Blok 2)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3008 - CIJAMBE",
        "created_at": "2026-11-15T14:38:00.000Z"
      },
      {
        "id": "prog-15-2",
        "ticket_id": "tk-cikembar-15",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Iwan Setiawan (Teknisi Lapangan)",
        "created_at": "2026-11-15T15:08:00.000Z"
      },
      {
        "id": "prog-15-3",
        "ticket_id": "tk-cikembar-15",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-15T16:38:00.000Z"
      },
      {
        "id": "prog-15-4",
        "ticket_id": "tk-cikembar-15",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-16T14:38:00.000Z"
      },
      {
        "id": "prog-15-5",
        "ticket_id": "tk-cikembar-15",
        "actor_id": "usr-admin-01",
        "actor_nama": "Administrator Cabang",
        "status_baru": "DITUTUP",
        "catatan": "Tiket ditutup dan diverifikasi oleh admin cabang.",
        "created_at": "2026-11-16T15:38:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-16",
    "nomor_tiket": "TKT-202611-0016",
    "pelapor_id": "usr-baca-02",
    "pelapor_nama": "Fajar (Pembaca Meter Blok 2)",
    "pelanggan_id": "10010060112",
    "nama_pelanggan": "Erny Nuraini",
    "no_hp": "085718518505",
    "ukuran_pipa": "",
    "kategori_id": "cat-004",
    "kategori_nama": "Pembayaran Melonjak",
    "wilayah_id": "3009",
    "wilayah_nama": "3009 - KP. CILANDAK - LIO",
    "deskripsi": "Ada dugaan kebocoran dalam instalasi pipa rumah yang menyebabkan lonjakan tagihan air.",
    "lat": -6.977049,
    "lng": 106.790721,
    "akurasi_gps": 4.5,
    "prioritas": "SEDANG",
    "status": "BARU",
    "assigned_to": null,
    "assigned_to_nama": null,
    "created_at": "2026-11-16T15:45:00.000Z",
    "updated_at": "2026-11-16T17:45:00.000Z",
    "photos": [
      {
        "id": "photo-16-1",
        "ticket_id": "tk-cikembar-16",
        "uploader_id": "usr-baca-02",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0016.jpg",
        "created_at": "2026-11-16T15:45:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-16-1",
        "ticket_id": "tk-cikembar-16",
        "actor_id": "usr-baca-02",
        "actor_nama": "Fajar (Pembaca Meter Blok 2)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3009 - KP. CILANDAK - LIO",
        "created_at": "2026-11-16T15:45:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-17",
    "nomor_tiket": "TKT-202611-0017",
    "pelapor_id": "usr-baca-02",
    "pelapor_nama": "Fajar (Pembaca Meter Blok 2)",
    "pelanggan_id": "10010060113",
    "nama_pelanggan": "Eti",
    "no_hp": "085719753072",
    "ukuran_pipa": "",
    "kategori_id": "cat-005",
    "kategori_nama": "Water Meter Rusak/Mati",
    "wilayah_id": "3010",
    "wilayah_nama": "3010 - BANTAR GADUNG PASEPAN I",
    "deskripsi": "Angka stan meter macet total tidak berputar walaupun kran air sedang digunakan.",
    "lat": -6.974864,
    "lng": 106.795127,
    "akurasi_gps": 5.5,
    "prioritas": "SEDANG",
    "status": "DITUGASKAN",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-17T08:52:00.000Z",
    "updated_at": "2026-11-17T10:52:00.000Z",
    "photos": [
      {
        "id": "photo-17-1",
        "ticket_id": "tk-cikembar-17",
        "uploader_id": "usr-baca-02",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0017.jpg",
        "created_at": "2026-11-17T08:52:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-17-1",
        "ticket_id": "tk-cikembar-17",
        "actor_id": "usr-baca-02",
        "actor_nama": "Fajar (Pembaca Meter Blok 2)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3010 - BANTAR GADUNG PASEPAN I",
        "created_at": "2026-11-17T08:52:00.000Z"
      },
      {
        "id": "prog-17-2",
        "ticket_id": "tk-cikembar-17",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-17T09:22:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-18",
    "nomor_tiket": "TKT-202611-0018",
    "pelapor_id": "usr-baca-02",
    "pelapor_nama": "Fajar (Pembaca Meter Blok 2)",
    "pelanggan_id": "10010070087",
    "nama_pelanggan": "NANANG B",
    "no_hp": "085720987639",
    "ukuran_pipa": "",
    "kategori_id": "cat-006",
    "kategori_nama": "Lainnya",
    "wilayah_id": "3011",
    "wilayah_nama": "3011 - PERUM SME BAITI JANNATI",
    "deskripsi": "Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.",
    "lat": -6.984884,
    "lng": 106.783175,
    "akurasi_gps": 6.5,
    "prioritas": "RENDAH",
    "status": "DALAM_PROSES",
    "assigned_to": "usr-tek-03",
    "assigned_to_nama": "Iwan Setiawan (Teknisi Lapangan)",
    "created_at": "2026-11-18T09:59:00.000Z",
    "updated_at": "2026-11-18T11:59:00.000Z",
    "photos": [
      {
        "id": "photo-18-1",
        "ticket_id": "tk-cikembar-18",
        "uploader_id": "usr-baca-02",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0018.jpg",
        "created_at": "2026-11-18T09:59:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-18-1",
        "ticket_id": "tk-cikembar-18",
        "actor_id": "usr-baca-02",
        "actor_nama": "Fajar (Pembaca Meter Blok 2)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3011 - PERUM SME BAITI JANNATI",
        "created_at": "2026-11-18T09:59:00.000Z"
      },
      {
        "id": "prog-18-2",
        "ticket_id": "tk-cikembar-18",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Iwan Setiawan (Teknisi Lapangan)",
        "created_at": "2026-11-18T10:29:00.000Z"
      },
      {
        "id": "prog-18-3",
        "ticket_id": "tk-cikembar-18",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-18T11:59:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-19",
    "nomor_tiket": "TKT-202611-0019",
    "pelapor_id": "usr-baca-02",
    "pelapor_nama": "Fajar (Pembaca Meter Blok 2)",
    "pelanggan_id": "10010070190",
    "nama_pelanggan": "WAWAN GUNAWAN",
    "no_hp": "085722222206",
    "ukuran_pipa": "1 1/2\"",
    "kategori_id": "cat-001",
    "kategori_nama": "Kebocoran Pipa Dinas",
    "wilayah_id": "3012",
    "wilayah_nama": "3012 - KP. GELARSARI",
    "deskripsi": "Pipa tersenggol alat berat perbaikan parit jalan, air menyembur deras di badan jalan.",
    "lat": -6.988753,
    "lng": 106.792481,
    "akurasi_gps": 7.5,
    "prioritas": "KRITIS",
    "status": "SELESAI",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-19T10:06:00.000Z",
    "updated_at": "2026-11-20T10:06:00.000Z",
    "photos": [
      {
        "id": "photo-19-1",
        "ticket_id": "tk-cikembar-19",
        "uploader_id": "usr-baca-02",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0019.jpg",
        "created_at": "2026-11-19T10:06:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-19-1",
        "ticket_id": "tk-cikembar-19",
        "actor_id": "usr-baca-02",
        "actor_nama": "Fajar (Pembaca Meter Blok 2)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3012 - KP. GELARSARI",
        "created_at": "2026-11-19T10:06:00.000Z"
      },
      {
        "id": "prog-19-2",
        "ticket_id": "tk-cikembar-19",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-19T10:36:00.000Z"
      },
      {
        "id": "prog-19-3",
        "ticket_id": "tk-cikembar-19",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-19T12:06:00.000Z"
      },
      {
        "id": "prog-19-4",
        "ticket_id": "tk-cikembar-19",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-20T10:06:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-20",
    "nomor_tiket": "TKT-202611-0020",
    "pelapor_id": "usr-baca-02",
    "pelapor_nama": "Fajar (Pembaca Meter Blok 2)",
    "pelanggan_id": "10010070191",
    "nama_pelanggan": "A I P",
    "no_hp": "085723456773",
    "ukuran_pipa": "2\"",
    "kategori_id": "cat-002",
    "kategori_nama": "Kebocoran Instalatur",
    "wilayah_id": "3014",
    "wilayah_nama": "3014 - TARISI CITAMBANG",
    "deskripsi": "Pipa instalatur bocor halus di bawah pondasi pagar rumah konsumen.",
    "lat": -6.98855,
    "lng": 106.796966,
    "akurasi_gps": 8.5,
    "prioritas": "TINGGI",
    "status": "DITUTUP",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-20T11:13:00.000Z",
    "updated_at": "2026-11-21T11:13:00.000Z",
    "photos": [
      {
        "id": "photo-20-1",
        "ticket_id": "tk-cikembar-20",
        "uploader_id": "usr-baca-02",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0020.jpg",
        "created_at": "2026-11-20T11:13:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-20-1",
        "ticket_id": "tk-cikembar-20",
        "actor_id": "usr-baca-02",
        "actor_nama": "Fajar (Pembaca Meter Blok 2)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3014 - TARISI CITAMBANG",
        "created_at": "2026-11-20T11:13:00.000Z"
      },
      {
        "id": "prog-20-2",
        "ticket_id": "tk-cikembar-20",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-20T11:43:00.000Z"
      },
      {
        "id": "prog-20-3",
        "ticket_id": "tk-cikembar-20",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-20T13:13:00.000Z"
      },
      {
        "id": "prog-20-4",
        "ticket_id": "tk-cikembar-20",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-21T11:13:00.000Z"
      },
      {
        "id": "prog-20-5",
        "ticket_id": "tk-cikembar-20",
        "actor_id": "usr-admin-01",
        "actor_nama": "Administrator Cabang",
        "status_baru": "DITUTUP",
        "catatan": "Tiket ditutup dan diverifikasi oleh admin cabang.",
        "created_at": "2026-11-21T12:13:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-21",
    "nomor_tiket": "TKT-202611-0021",
    "pelapor_id": "usr-baca-02",
    "pelapor_nama": "Fajar (Pembaca Meter Blok 2)",
    "pelanggan_id": "10010077962",
    "nama_pelanggan": "Yuli",
    "no_hp": "085724691340",
    "ukuran_pipa": "",
    "kategori_id": "cat-003",
    "kategori_nama": "Supply Air",
    "wilayah_id": "4016",
    "wilayah_nama": "4016 - PERUM. BUMI CIKEMBANG",
    "deskripsi": "Aliran air mati total sejak 2 hari lalu di daerah ketinggian/ujung jaringan pipa blok.",
    "lat": -6.981261,
    "lng": 106.780224,
    "akurasi_gps": 4.5,
    "prioritas": "TINGGI",
    "status": "BARU",
    "assigned_to": null,
    "assigned_to_nama": null,
    "created_at": "2026-11-01T12:20:00.000Z",
    "updated_at": "2026-11-01T14:20:00.000Z",
    "photos": [
      {
        "id": "photo-21-1",
        "ticket_id": "tk-cikembar-21",
        "uploader_id": "usr-baca-02",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0021.jpg",
        "created_at": "2026-11-01T12:20:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-21-1",
        "ticket_id": "tk-cikembar-21",
        "actor_id": "usr-baca-02",
        "actor_nama": "Fajar (Pembaca Meter Blok 2)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 4016 - PERUM. BUMI CIKEMBANG",
        "created_at": "2026-11-01T12:20:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-22",
    "nomor_tiket": "TKT-202611-0022",
    "pelapor_id": "usr-baca-03",
    "pelapor_nama": "Andi (Pembaca Meter Blok 3)",
    "pelanggan_id": "10010080050",
    "nama_pelanggan": "HENDRA ISKANDAR",
    "no_hp": "085725925907",
    "ukuran_pipa": "",
    "kategori_id": "cat-004",
    "kategori_nama": "Pembayaran Melonjak",
    "wilayah_id": "1007",
    "wilayah_nama": "1007 - KP. SOBOG KP. BARU SUKARESMI",
    "deskripsi": "Pelanggan mengajukan keberatan tagihan bulan ini naik tinggi, mohon cek stan meteran fisik.",
    "lat": -6.98049,
    "lng": 106.789357,
    "akurasi_gps": 5.5,
    "prioritas": "SEDANG",
    "status": "DITUGASKAN",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-02T13:27:00.000Z",
    "updated_at": "2026-11-02T15:27:00.000Z",
    "photos": [
      {
        "id": "photo-22-1",
        "ticket_id": "tk-cikembar-22",
        "uploader_id": "usr-baca-03",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0022.jpg",
        "created_at": "2026-11-02T13:27:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-22-1",
        "ticket_id": "tk-cikembar-22",
        "actor_id": "usr-baca-03",
        "actor_nama": "Andi (Pembaca Meter Blok 3)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 1007 - KP. SOBOG KP. BARU SUKARESMI",
        "created_at": "2026-11-02T13:27:00.000Z"
      },
      {
        "id": "prog-22-2",
        "ticket_id": "tk-cikembar-22",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-02T13:57:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-23",
    "nomor_tiket": "TKT-202611-0023",
    "pelapor_id": "usr-baca-03",
    "pelapor_nama": "Andi (Pembaca Meter Blok 3)",
    "pelanggan_id": "10010080126",
    "nama_pelanggan": "SMP N 4 WARUNG KIARA",
    "no_hp": "085727160474",
    "ukuran_pipa": "",
    "kategori_id": "cat-005",
    "kategori_nama": "Water Meter Rusak/Mati",
    "wilayah_id": "3001",
    "wilayah_nama": "3001 - KAMP. SELAGEDANG-CIGOMBONG",
    "deskripsi": "Jarum indikator meteran patah dan segel meter terlepas.",
    "lat": -6.976027,
    "lng": 106.792,
    "akurasi_gps": 6.5,
    "prioritas": "SEDANG",
    "status": "DALAM_PROSES",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-03T14:34:00.000Z",
    "updated_at": "2026-11-03T16:34:00.000Z",
    "photos": [
      {
        "id": "photo-23-1",
        "ticket_id": "tk-cikembar-23",
        "uploader_id": "usr-baca-03",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0023.jpg",
        "created_at": "2026-11-03T14:34:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-23-1",
        "ticket_id": "tk-cikembar-23",
        "actor_id": "usr-baca-03",
        "actor_nama": "Andi (Pembaca Meter Blok 3)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3001 - KAMP. SELAGEDANG-CIGOMBONG",
        "created_at": "2026-11-03T14:34:00.000Z"
      },
      {
        "id": "prog-23-2",
        "ticket_id": "tk-cikembar-23",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-03T15:04:00.000Z"
      },
      {
        "id": "prog-23-3",
        "ticket_id": "tk-cikembar-23",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-03T16:34:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-24",
    "nomor_tiket": "TKT-202611-0024",
    "pelapor_id": "usr-baca-03",
    "pelapor_nama": "Andi (Pembaca Meter Blok 3)",
    "pelanggan_id": "10010080188",
    "nama_pelanggan": "UTARI TRI MUMPUNI",
    "no_hp": "085728395041",
    "ukuran_pipa": "",
    "kategori_id": "cat-006",
    "kategori_nama": "Lainnya",
    "wilayah_id": "3002",
    "wilayah_nama": "3002 - KAMP. CIGOMBONG",
    "deskripsi": "Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.",
    "lat": -6.977039,
    "lng": 106.795902,
    "akurasi_gps": 7.5,
    "prioritas": "RENDAH",
    "status": "SELESAI",
    "assigned_to": "usr-tek-03",
    "assigned_to_nama": "Iwan Setiawan (Teknisi Lapangan)",
    "created_at": "2026-11-04T15:41:00.000Z",
    "updated_at": "2026-11-05T15:41:00.000Z",
    "photos": [
      {
        "id": "photo-24-1",
        "ticket_id": "tk-cikembar-24",
        "uploader_id": "usr-baca-03",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0024.jpg",
        "created_at": "2026-11-04T15:41:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-24-1",
        "ticket_id": "tk-cikembar-24",
        "actor_id": "usr-baca-03",
        "actor_nama": "Andi (Pembaca Meter Blok 3)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3002 - KAMP. CIGOMBONG",
        "created_at": "2026-11-04T15:41:00.000Z"
      },
      {
        "id": "prog-24-2",
        "ticket_id": "tk-cikembar-24",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Iwan Setiawan (Teknisi Lapangan)",
        "created_at": "2026-11-04T16:11:00.000Z"
      },
      {
        "id": "prog-24-3",
        "ticket_id": "tk-cikembar-24",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-04T17:41:00.000Z"
      },
      {
        "id": "prog-24-4",
        "ticket_id": "tk-cikembar-24",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-05T15:41:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-25",
    "nomor_tiket": "TKT-202611-0025",
    "pelapor_id": "usr-baca-03",
    "pelapor_nama": "Andi (Pembaca Meter Blok 3)",
    "pelanggan_id": "10010081254",
    "nama_pelanggan": "ENDANG",
    "no_hp": "085729629608",
    "ukuran_pipa": "2\"",
    "kategori_id": "cat-001",
    "kategori_nama": "Kebocoran Pipa Dinas",
    "wilayah_id": "3004",
    "wilayah_nama": "3004 - KAMP. WARUNGKIARA",
    "deskripsi": "Rembesan air bersih muncul dari bawah aspal jalan, aspal mulai amblas tergerus air.",
    "lat": -6.974717,
    "lng": 106.803273,
    "akurasi_gps": 8.5,
    "prioritas": "KRITIS",
    "status": "DITUTUP",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-05T08:48:00.000Z",
    "updated_at": "2026-11-06T08:48:00.000Z",
    "photos": [
      {
        "id": "photo-25-1",
        "ticket_id": "tk-cikembar-25",
        "uploader_id": "usr-baca-03",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0025.jpg",
        "created_at": "2026-11-05T08:48:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-25-1",
        "ticket_id": "tk-cikembar-25",
        "actor_id": "usr-baca-03",
        "actor_nama": "Andi (Pembaca Meter Blok 3)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3004 - KAMP. WARUNGKIARA",
        "created_at": "2026-11-05T08:48:00.000Z"
      },
      {
        "id": "prog-25-2",
        "ticket_id": "tk-cikembar-25",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-05T09:18:00.000Z"
      },
      {
        "id": "prog-25-3",
        "ticket_id": "tk-cikembar-25",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-05T10:48:00.000Z"
      },
      {
        "id": "prog-25-4",
        "ticket_id": "tk-cikembar-25",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-06T08:48:00.000Z"
      },
      {
        "id": "prog-25-5",
        "ticket_id": "tk-cikembar-25",
        "actor_id": "usr-admin-01",
        "actor_nama": "Administrator Cabang",
        "status_baru": "DITUTUP",
        "catatan": "Tiket ditutup dan diverifikasi oleh admin cabang.",
        "created_at": "2026-11-06T09:48:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-26",
    "nomor_tiket": "TKT-202611-0026",
    "pelapor_id": "usr-baca-03",
    "pelapor_nama": "Andi (Pembaca Meter Blok 3)",
    "pelanggan_id": "10010081258",
    "nama_pelanggan": "JEJEM JAENUDIN",
    "no_hp": "085730864175",
    "ukuran_pipa": "1/2\"",
    "kategori_id": "cat-002",
    "kategori_nama": "Kebocoran Instalatur",
    "wilayah_id": "3005",
    "wilayah_nama": "3005 - KAMP. WARUNGKIARA 02",
    "deskripsi": "Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman rumah.",
    "lat": -6.970397,
    "lng": 106.806974,
    "akurasi_gps": 4.5,
    "prioritas": "TINGGI",
    "status": "BARU",
    "assigned_to": null,
    "assigned_to_nama": null,
    "created_at": "2026-11-06T09:55:00.000Z",
    "updated_at": "2026-11-06T11:55:00.000Z",
    "photos": [
      {
        "id": "photo-26-1",
        "ticket_id": "tk-cikembar-26",
        "uploader_id": "usr-baca-03",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0026.jpg",
        "created_at": "2026-11-06T09:55:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-26-1",
        "ticket_id": "tk-cikembar-26",
        "actor_id": "usr-baca-03",
        "actor_nama": "Andi (Pembaca Meter Blok 3)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3005 - KAMP. WARUNGKIARA 02",
        "created_at": "2026-11-06T09:55:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-27",
    "nomor_tiket": "TKT-202611-0027",
    "pelapor_id": "usr-baca-03",
    "pelapor_nama": "Andi (Pembaca Meter Blok 3)",
    "pelanggan_id": "10010090078",
    "nama_pelanggan": "HENDRO",
    "no_hp": "085732098742",
    "ukuran_pipa": "",
    "kategori_id": "cat-003",
    "kategori_nama": "Supply Air",
    "wilayah_id": "3006",
    "wilayah_nama": "3006 - WARUNGKIARA-BABAKAN",
    "deskripsi": "Air mengalir keruh kekuningan bercampur endapan lumpur setelah ada perbaikan pipa utama.",
    "lat": -6.965712,
    "lng": 106.807941,
    "akurasi_gps": 5.5,
    "prioritas": "TINGGI",
    "status": "DITUGASKAN",
    "assigned_to": "usr-tek-03",
    "assigned_to_nama": "Iwan Setiawan (Teknisi Lapangan)",
    "created_at": "2026-11-07T10:02:00.000Z",
    "updated_at": "2026-11-07T12:02:00.000Z",
    "photos": [
      {
        "id": "photo-27-1",
        "ticket_id": "tk-cikembar-27",
        "uploader_id": "usr-baca-03",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0027.jpg",
        "created_at": "2026-11-07T10:02:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-27-1",
        "ticket_id": "tk-cikembar-27",
        "actor_id": "usr-baca-03",
        "actor_nama": "Andi (Pembaca Meter Blok 3)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3006 - WARUNGKIARA-BABAKAN",
        "created_at": "2026-11-07T10:02:00.000Z"
      },
      {
        "id": "prog-27-2",
        "ticket_id": "tk-cikembar-27",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Iwan Setiawan (Teknisi Lapangan)",
        "created_at": "2026-11-07T10:32:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-28",
    "nomor_tiket": "TKT-202611-0028",
    "pelapor_id": "usr-baca-03",
    "pelapor_nama": "Andi (Pembaca Meter Blok 3)",
    "pelanggan_id": "10010090094",
    "nama_pelanggan": "USUP SUPENDI",
    "no_hp": "085733333309",
    "ukuran_pipa": "",
    "kategori_id": "cat-004",
    "kategori_nama": "Pembayaran Melonjak",
    "wilayah_id": "3007",
    "wilayah_nama": "3007 - BAED I",
    "deskripsi": "Ada dugaan kebocoran dalam instalasi pipa rumah yang menyebabkan lonjakan tagihan air.",
    "lat": -6.962131,
    "lng": 106.807124,
    "akurasi_gps": 6.5,
    "prioritas": "SEDANG",
    "status": "DALAM_PROSES",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-08T11:09:00.000Z",
    "updated_at": "2026-11-08T13:09:00.000Z",
    "photos": [
      {
        "id": "photo-28-1",
        "ticket_id": "tk-cikembar-28",
        "uploader_id": "usr-baca-03",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0028.jpg",
        "created_at": "2026-11-08T11:09:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-28-1",
        "ticket_id": "tk-cikembar-28",
        "actor_id": "usr-baca-03",
        "actor_nama": "Andi (Pembaca Meter Blok 3)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3007 - BAED I",
        "created_at": "2026-11-08T11:09:00.000Z"
      },
      {
        "id": "prog-28-2",
        "ticket_id": "tk-cikembar-28",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-08T11:39:00.000Z"
      },
      {
        "id": "prog-28-3",
        "ticket_id": "tk-cikembar-28",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-08T13:09:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-29",
    "nomor_tiket": "TKT-202611-0029",
    "pelapor_id": "usr-baca-03",
    "pelapor_nama": "Andi (Pembaca Meter Blok 3)",
    "pelanggan_id": "10010090132",
    "nama_pelanggan": "ADE",
    "no_hp": "085734567876",
    "ukuran_pipa": "",
    "kategori_id": "cat-005",
    "kategori_nama": "Water Meter Rusak/Mati",
    "wilayah_id": "3013",
    "wilayah_nama": "3013 - BAED II",
    "deskripsi": "Angka stan meter macet total tidak berputar walaupun kran air sedang digunakan.",
    "lat": -6.962187,
    "lng": 106.807112,
    "akurasi_gps": 7.5,
    "prioritas": "SEDANG",
    "status": "SELESAI",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-09T12:16:00.000Z",
    "updated_at": "2026-11-10T12:16:00.000Z",
    "photos": [
      {
        "id": "photo-29-1",
        "ticket_id": "tk-cikembar-29",
        "uploader_id": "usr-baca-03",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0029.jpg",
        "created_at": "2026-11-09T12:16:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-29-1",
        "ticket_id": "tk-cikembar-29",
        "actor_id": "usr-baca-03",
        "actor_nama": "Andi (Pembaca Meter Blok 3)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 3013 - BAED II",
        "created_at": "2026-11-09T12:16:00.000Z"
      },
      {
        "id": "prog-29-2",
        "ticket_id": "tk-cikembar-29",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-09T12:46:00.000Z"
      },
      {
        "id": "prog-29-3",
        "ticket_id": "tk-cikembar-29",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-09T14:16:00.000Z"
      },
      {
        "id": "prog-29-4",
        "ticket_id": "tk-cikembar-29",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-10T12:16:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-30",
    "nomor_tiket": "TKT-202611-0030",
    "pelapor_id": "usr-baca-03",
    "pelapor_nama": "Andi (Pembaca Meter Blok 3)",
    "pelanggan_id": "10010090227",
    "nama_pelanggan": "EDI MULYADI",
    "no_hp": "085735802443",
    "ukuran_pipa": "",
    "kategori_id": "cat-006",
    "kategori_nama": "Lainnya",
    "wilayah_id": "8014",
    "wilayah_nama": "8014 - BOJONGPARI",
    "deskripsi": "Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.",
    "lat": -6.962991,
    "lng": 106.809756,
    "akurasi_gps": 8.5,
    "prioritas": "RENDAH",
    "status": "DITUTUP",
    "assigned_to": "usr-tek-03",
    "assigned_to_nama": "Iwan Setiawan (Teknisi Lapangan)",
    "created_at": "2026-11-10T13:23:00.000Z",
    "updated_at": "2026-11-11T13:23:00.000Z",
    "photos": [
      {
        "id": "photo-30-1",
        "ticket_id": "tk-cikembar-30",
        "uploader_id": "usr-baca-03",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0030.jpg",
        "created_at": "2026-11-10T13:23:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-30-1",
        "ticket_id": "tk-cikembar-30",
        "actor_id": "usr-baca-03",
        "actor_nama": "Andi (Pembaca Meter Blok 3)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 8014 - BOJONGPARI",
        "created_at": "2026-11-10T13:23:00.000Z"
      },
      {
        "id": "prog-30-2",
        "ticket_id": "tk-cikembar-30",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Iwan Setiawan (Teknisi Lapangan)",
        "created_at": "2026-11-10T13:53:00.000Z"
      },
      {
        "id": "prog-30-3",
        "ticket_id": "tk-cikembar-30",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-10T15:23:00.000Z"
      },
      {
        "id": "prog-30-4",
        "ticket_id": "tk-cikembar-30",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-11T13:23:00.000Z"
      },
      {
        "id": "prog-30-5",
        "ticket_id": "tk-cikembar-30",
        "actor_id": "usr-admin-01",
        "actor_nama": "Administrator Cabang",
        "status_baru": "DITUTUP",
        "catatan": "Tiket ditutup dan diverifikasi oleh admin cabang.",
        "created_at": "2026-11-11T14:23:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-31",
    "nomor_tiket": "TKT-202611-0031",
    "pelapor_id": "usr-baca-03",
    "pelapor_nama": "Andi (Pembaca Meter Blok 3)",
    "pelanggan_id": "10010090293",
    "nama_pelanggan": "ICAH",
    "no_hp": "085737037010",
    "ukuran_pipa": "1/2\"",
    "kategori_id": "cat-001",
    "kategori_nama": "Kebocoran Pipa Dinas",
    "wilayah_id": "8015",
    "wilayah_nama": "8015 - KP. MANGUNJAYA",
    "deskripsi": "Pipa dinas bocor sembur di depan rumah warga dekat jalan utama, air bersih meluap ke bahu jalan.",
    "lat": -6.961964,
    "lng": 106.814463,
    "akurasi_gps": 4.5,
    "prioritas": "KRITIS",
    "status": "BARU",
    "assigned_to": null,
    "assigned_to_nama": null,
    "created_at": "2026-11-11T14:30:00.000Z",
    "updated_at": "2026-11-11T16:30:00.000Z",
    "photos": [
      {
        "id": "photo-31-1",
        "ticket_id": "tk-cikembar-31",
        "uploader_id": "usr-baca-03",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0031.jpg",
        "created_at": "2026-11-11T14:30:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-31-1",
        "ticket_id": "tk-cikembar-31",
        "actor_id": "usr-baca-03",
        "actor_nama": "Andi (Pembaca Meter Blok 3)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 8015 - KP. MANGUNJAYA",
        "created_at": "2026-11-11T14:30:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-32",
    "nomor_tiket": "TKT-202611-0032",
    "pelapor_id": "usr-baca-04",
    "pelapor_nama": "Apri (Pembaca Meter Blok 4)",
    "pelanggan_id": "10010100080",
    "nama_pelanggan": "MULYANA YUSUP",
    "no_hp": "085738271577",
    "ukuran_pipa": "3/4\"",
    "kategori_id": "cat-002",
    "kategori_nama": "Kebocoran Instalatur",
    "wilayah_id": "4001",
    "wilayah_nama": "4001 - CICATIH",
    "deskripsi": "Pipa instalatur bocor halus di bawah pondasi pagar rumah konsumen.",
    "lat": -6.982212,
    "lng": 106.770744,
    "akurasi_gps": 5.5,
    "prioritas": "TINGGI",
    "status": "DITUGASKAN",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-12T15:37:00.000Z",
    "updated_at": "2026-11-12T17:37:00.000Z",
    "photos": [
      {
        "id": "photo-32-1",
        "ticket_id": "tk-cikembar-32",
        "uploader_id": "usr-baca-04",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0032.jpg",
        "created_at": "2026-11-12T15:37:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-32-1",
        "ticket_id": "tk-cikembar-32",
        "actor_id": "usr-baca-04",
        "actor_nama": "Apri (Pembaca Meter Blok 4)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 4001 - CICATIH",
        "created_at": "2026-11-12T15:37:00.000Z"
      },
      {
        "id": "prog-32-2",
        "ticket_id": "tk-cikembar-32",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-12T16:07:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-33",
    "nomor_tiket": "TKT-202611-0033",
    "pelapor_id": "usr-baca-04",
    "pelapor_nama": "Apri (Pembaca Meter Blok 4)",
    "pelanggan_id": "10020010290",
    "nama_pelanggan": "APIP ROHMAN",
    "no_hp": "085739506144",
    "ukuran_pipa": "",
    "kategori_id": "cat-003",
    "kategori_nama": "Supply Air",
    "wilayah_id": "4002",
    "wilayah_nama": "4002 - KAMP. CIKEMBANG I",
    "deskripsi": "Aliran air mati total sejak 2 hari lalu di daerah ketinggian/ujung jaringan pipa blok.",
    "lat": -6.984346,
    "lng": 106.776503,
    "akurasi_gps": 6.5,
    "prioritas": "TINGGI",
    "status": "DALAM_PROSES",
    "assigned_to": "usr-tek-03",
    "assigned_to_nama": "Iwan Setiawan (Teknisi Lapangan)",
    "created_at": "2026-11-13T08:44:00.000Z",
    "updated_at": "2026-11-13T10:44:00.000Z",
    "photos": [
      {
        "id": "photo-33-1",
        "ticket_id": "tk-cikembar-33",
        "uploader_id": "usr-baca-04",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0033.jpg",
        "created_at": "2026-11-13T08:44:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-33-1",
        "ticket_id": "tk-cikembar-33",
        "actor_id": "usr-baca-04",
        "actor_nama": "Apri (Pembaca Meter Blok 4)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 4002 - KAMP. CIKEMBANG I",
        "created_at": "2026-11-13T08:44:00.000Z"
      },
      {
        "id": "prog-33-2",
        "ticket_id": "tk-cikembar-33",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Iwan Setiawan (Teknisi Lapangan)",
        "created_at": "2026-11-13T09:14:00.000Z"
      },
      {
        "id": "prog-33-3",
        "ticket_id": "tk-cikembar-33",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-13T10:44:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-34",
    "nomor_tiket": "TKT-202611-0034",
    "pelapor_id": "usr-baca-04",
    "pelapor_nama": "Apri (Pembaca Meter Blok 4)",
    "pelanggan_id": "10020020948",
    "nama_pelanggan": "RIYANA",
    "no_hp": "085740740711",
    "ukuran_pipa": "",
    "kategori_id": "cat-004",
    "kategori_nama": "Pembayaran Melonjak",
    "wilayah_id": "4004",
    "wilayah_nama": "4004 - KAMP. CIKEMBANG II",
    "deskripsi": "Pelanggan mengajukan keberatan tagihan bulan ini naik tinggi, mohon cek stan meteran fisik.",
    "lat": -6.9845,
    "lng": 106.77596,
    "akurasi_gps": 7.5,
    "prioritas": "SEDANG",
    "status": "SELESAI",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-14T09:51:00.000Z",
    "updated_at": "2026-11-15T09:51:00.000Z",
    "photos": [
      {
        "id": "photo-34-1",
        "ticket_id": "tk-cikembar-34",
        "uploader_id": "usr-baca-04",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0034.jpg",
        "created_at": "2026-11-14T09:51:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-34-1",
        "ticket_id": "tk-cikembar-34",
        "actor_id": "usr-baca-04",
        "actor_nama": "Apri (Pembaca Meter Blok 4)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 4004 - KAMP. CIKEMBANG II",
        "created_at": "2026-11-14T09:51:00.000Z"
      },
      {
        "id": "prog-34-2",
        "ticket_id": "tk-cikembar-34",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-14T10:21:00.000Z"
      },
      {
        "id": "prog-34-3",
        "ticket_id": "tk-cikembar-34",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-14T11:51:00.000Z"
      },
      {
        "id": "prog-34-4",
        "ticket_id": "tk-cikembar-34",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-15T09:51:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-35",
    "nomor_tiket": "TKT-202611-0035",
    "pelapor_id": "usr-baca-04",
    "pelapor_nama": "Apri (Pembaca Meter Blok 4)",
    "pelanggan_id": "10020030334",
    "nama_pelanggan": "EBAH SUAEBAH",
    "no_hp": "085741975278",
    "ukuran_pipa": "",
    "kategori_id": "cat-005",
    "kategori_nama": "Water Meter Rusak/Mati",
    "wilayah_id": "4006",
    "wilayah_nama": "4006 - KAMP. CIARENGKOK",
    "deskripsi": "Jarum indikator meteran patah dan segel meter terlepas.",
    "lat": -6.987413,
    "lng": 106.768454,
    "akurasi_gps": 8.5,
    "prioritas": "SEDANG",
    "status": "DITUTUP",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-15T10:58:00.000Z",
    "updated_at": "2026-11-16T10:58:00.000Z",
    "photos": [
      {
        "id": "photo-35-1",
        "ticket_id": "tk-cikembar-35",
        "uploader_id": "usr-baca-04",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0035.jpg",
        "created_at": "2026-11-15T10:58:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-35-1",
        "ticket_id": "tk-cikembar-35",
        "actor_id": "usr-baca-04",
        "actor_nama": "Apri (Pembaca Meter Blok 4)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 4006 - KAMP. CIARENGKOK",
        "created_at": "2026-11-15T10:58:00.000Z"
      },
      {
        "id": "prog-35-2",
        "ticket_id": "tk-cikembar-35",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-15T11:28:00.000Z"
      },
      {
        "id": "prog-35-3",
        "ticket_id": "tk-cikembar-35",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-15T12:58:00.000Z"
      },
      {
        "id": "prog-35-4",
        "ticket_id": "tk-cikembar-35",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-16T10:58:00.000Z"
      },
      {
        "id": "prog-35-5",
        "ticket_id": "tk-cikembar-35",
        "actor_id": "usr-admin-01",
        "actor_nama": "Administrator Cabang",
        "status_baru": "DITUTUP",
        "catatan": "Tiket ditutup dan diverifikasi oleh admin cabang.",
        "created_at": "2026-11-16T11:58:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-36",
    "nomor_tiket": "TKT-202611-0036",
    "pelapor_id": "usr-baca-04",
    "pelapor_nama": "Apri (Pembaca Meter Blok 4)",
    "pelanggan_id": "10020050010",
    "nama_pelanggan": "TATE KUSNANDAR",
    "no_hp": "085743209845",
    "ukuran_pipa": "",
    "kategori_id": "cat-006",
    "kategori_nama": "Lainnya",
    "wilayah_id": "4007",
    "wilayah_nama": "4007 - KAMP. CIARENGKOK-CIKAMANTRI",
    "deskripsi": "Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.",
    "lat": -6.992285,
    "lng": 106.766789,
    "akurasi_gps": 4.5,
    "prioritas": "RENDAH",
    "status": "BARU",
    "assigned_to": null,
    "assigned_to_nama": null,
    "created_at": "2026-11-16T11:05:00.000Z",
    "updated_at": "2026-11-16T13:05:00.000Z",
    "photos": [
      {
        "id": "photo-36-1",
        "ticket_id": "tk-cikembar-36",
        "uploader_id": "usr-baca-04",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0036.jpg",
        "created_at": "2026-11-16T11:05:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-36-1",
        "ticket_id": "tk-cikembar-36",
        "actor_id": "usr-baca-04",
        "actor_nama": "Apri (Pembaca Meter Blok 4)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 4007 - KAMP. CIARENGKOK-CIKAMANTRI",
        "created_at": "2026-11-16T11:05:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-37",
    "nomor_tiket": "TKT-202611-0037",
    "pelapor_id": "usr-baca-04",
    "pelapor_nama": "Apri (Pembaca Meter Blok 4)",
    "pelanggan_id": "10020050136",
    "nama_pelanggan": "YEYEP NURYEDIN",
    "no_hp": "085744444412",
    "ukuran_pipa": "3/4\"",
    "kategori_id": "cat-001",
    "kategori_nama": "Kebocoran Pipa Dinas",
    "wilayah_id": "4012",
    "wilayah_nama": "4012 - KAMP. CITENGAH-SUKAMULYA",
    "deskripsi": "Pipa dinas retak sambungan socket akibat beban kendaraan, rembesan air cukup deras.",
    "lat": -6.995975,
    "lng": 106.766616,
    "akurasi_gps": 5.5,
    "prioritas": "KRITIS",
    "status": "DITUGASKAN",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-17T12:12:00.000Z",
    "updated_at": "2026-11-17T14:12:00.000Z",
    "photos": [
      {
        "id": "photo-37-1",
        "ticket_id": "tk-cikembar-37",
        "uploader_id": "usr-baca-04",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0037.jpg",
        "created_at": "2026-11-17T12:12:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-37-1",
        "ticket_id": "tk-cikembar-37",
        "actor_id": "usr-baca-04",
        "actor_nama": "Apri (Pembaca Meter Blok 4)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 4012 - KAMP. CITENGAH-SUKAMULYA",
        "created_at": "2026-11-17T12:12:00.000Z"
      },
      {
        "id": "prog-37-2",
        "ticket_id": "tk-cikembar-37",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-17T12:42:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-38",
    "nomor_tiket": "TKT-202611-0038",
    "pelapor_id": "usr-baca-04",
    "pelapor_nama": "Apri (Pembaca Meter Blok 4)",
    "pelanggan_id": "10030010738",
    "nama_pelanggan": "A d u n",
    "no_hp": "085745678979",
    "ukuran_pipa": "1\"",
    "kategori_id": "cat-002",
    "kategori_nama": "Kebocoran Instalatur",
    "wilayah_id": "4013",
    "wilayah_nama": "4013 - KAMP. CIPETIR DS. SUKAMULYA",
    "deskripsi": "Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman rumah.",
    "lat": -6.996931,
    "lng": 106.767296,
    "akurasi_gps": 6.5,
    "prioritas": "TINGGI",
    "status": "DALAM_PROSES",
    "assigned_to": "usr-tek-02",
    "assigned_to_nama": "Hendra Gunawan (Teknisi Lapangan)",
    "created_at": "2026-11-18T13:19:00.000Z",
    "updated_at": "2026-11-18T15:19:00.000Z",
    "photos": [
      {
        "id": "photo-38-1",
        "ticket_id": "tk-cikembar-38",
        "uploader_id": "usr-baca-04",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0038.jpg",
        "created_at": "2026-11-18T13:19:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-38-1",
        "ticket_id": "tk-cikembar-38",
        "actor_id": "usr-baca-04",
        "actor_nama": "Apri (Pembaca Meter Blok 4)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 4013 - KAMP. CIPETIR DS. SUKAMULYA",
        "created_at": "2026-11-18T13:19:00.000Z"
      },
      {
        "id": "prog-38-2",
        "ticket_id": "tk-cikembar-38",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Hendra Gunawan (Teknisi Lapangan)",
        "created_at": "2026-11-18T13:49:00.000Z"
      },
      {
        "id": "prog-38-3",
        "ticket_id": "tk-cikembar-38",
        "actor_id": "usr-tek-02",
        "actor_nama": "Hendra Gunawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-18T15:19:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-39",
    "nomor_tiket": "TKT-202611-0039",
    "pelapor_id": "usr-baca-04",
    "pelapor_nama": "Apri (Pembaca Meter Blok 4)",
    "pelanggan_id": "10030020002",
    "nama_pelanggan": "HENDRA FASHA",
    "no_hp": "085746913546",
    "ukuran_pipa": "",
    "kategori_id": "cat-003",
    "kategori_nama": "Supply Air",
    "wilayah_id": "4015",
    "wilayah_nama": "4015 - KAMP. CIBONGGOM",
    "deskripsi": "Air mengalir keruh kekuningan bercampur endapan lumpur setelah ada perbaikan pipa utama.",
    "lat": -6.996111,
    "lng": 106.765865,
    "akurasi_gps": 7.5,
    "prioritas": "TINGGI",
    "status": "SELESAI",
    "assigned_to": "usr-tek-03",
    "assigned_to_nama": "Iwan Setiawan (Teknisi Lapangan)",
    "created_at": "2026-11-19T14:26:00.000Z",
    "updated_at": "2026-11-20T14:26:00.000Z",
    "photos": [
      {
        "id": "photo-39-1",
        "ticket_id": "tk-cikembar-39",
        "uploader_id": "usr-baca-04",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0039.jpg",
        "created_at": "2026-11-19T14:26:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-39-1",
        "ticket_id": "tk-cikembar-39",
        "actor_id": "usr-baca-04",
        "actor_nama": "Apri (Pembaca Meter Blok 4)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 4015 - KAMP. CIBONGGOM",
        "created_at": "2026-11-19T14:26:00.000Z"
      },
      {
        "id": "prog-39-2",
        "ticket_id": "tk-cikembar-39",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Iwan Setiawan (Teknisi Lapangan)",
        "created_at": "2026-11-19T14:56:00.000Z"
      },
      {
        "id": "prog-39-3",
        "ticket_id": "tk-cikembar-39",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-19T16:26:00.000Z"
      },
      {
        "id": "prog-39-4",
        "ticket_id": "tk-cikembar-39",
        "actor_id": "usr-tek-03",
        "actor_nama": "Iwan Setiawan (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-20T14:26:00.000Z"
      }
    ]
  },
  {
    "id": "tk-cikembar-40",
    "nomor_tiket": "TKT-202611-0040",
    "pelapor_id": "usr-baca-04",
    "pelapor_nama": "Apri (Pembaca Meter Blok 4)",
    "pelanggan_id": "10030020454",
    "nama_pelanggan": "ELIA LESMANAWATI",
    "no_hp": "085748148113",
    "ukuran_pipa": "",
    "kategori_id": "cat-004",
    "kategori_nama": "Pembayaran Melonjak",
    "wilayah_id": "5001",
    "wilayah_nama": "5001 - KP. SUKAMANTRI-CIARENGKOK",
    "deskripsi": "Ada dugaan kebocoran dalam instalasi pipa rumah yang menyebabkan lonjakan tagihan air.",
    "lat": -6.995609,
    "lng": 106.7628,
    "akurasi_gps": 8.5,
    "prioritas": "SEDANG",
    "status": "DITUTUP",
    "assigned_to": "usr-tek-01",
    "assigned_to_nama": "Dadan Hamdani (Teknisi Lapangan)",
    "created_at": "2026-11-20T15:33:00.000Z",
    "updated_at": "2026-11-21T15:33:00.000Z",
    "photos": [
      {
        "id": "photo-40-1",
        "ticket_id": "tk-cikembar-40",
        "uploader_id": "usr-baca-04",
        "tipe_foto": "SEBELUM",
        "file_url": "/uploads/logo_pdam.png",
        "drive_file_id": "foto_lapangan_tkt-202611-0040.jpg",
        "created_at": "2026-11-20T15:33:00.000Z"
      }
    ],
    "progress": [
      {
        "id": "prog-40-1",
        "ticket_id": "tk-cikembar-40",
        "actor_id": "usr-baca-04",
        "actor_nama": "Apri (Pembaca Meter Blok 4)",
        "status_baru": "BARU",
        "catatan": "Laporan lapangan diterima dari pembaca meter saat patroli rute 5001 - KP. SUKAMANTRI-CIARENGKOK",
        "created_at": "2026-11-20T15:33:00.000Z"
      },
      {
        "id": "prog-40-2",
        "ticket_id": "tk-cikembar-40",
        "actor_id": "usr-kaur-01",
        "actor_nama": "Kaur Teknik & Distribusi",
        "status_baru": "DITUGASKAN",
        "catatan": "Disposisi penanganan teknis lapangan kepada Dadan Hamdani (Teknisi Lapangan)",
        "created_at": "2026-11-20T16:03:00.000Z"
      },
      {
        "id": "prog-40-3",
        "ticket_id": "tk-cikembar-40",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "DALAM_PROSES",
        "catatan": "Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan",
        "created_at": "2026-11-20T17:33:00.000Z"
      },
      {
        "id": "prog-40-4",
        "ticket_id": "tk-cikembar-40",
        "actor_id": "usr-tek-01",
        "actor_nama": "Dadan Hamdani (Teknisi Lapangan)",
        "status_baru": "SELESAI",
        "catatan": "Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.",
        "created_at": "2026-11-21T15:33:00.000Z"
      },
      {
        "id": "prog-40-5",
        "ticket_id": "tk-cikembar-40",
        "actor_id": "usr-admin-01",
        "actor_nama": "Administrator Cabang",
        "status_baru": "DITUTUP",
        "catatan": "Tiket ditutup dan diverifikasi oleh admin cabang.",
        "created_at": "2026-11-21T16:33:00.000Z"
      }
    ]
  }
];
