const fs = require('fs');

const c1 = JSON.parse(fs.readFileSync('C:/Users/MSI/.gemini/antigravity/scratch/pdam-fieldticket-next/src/data/real-customers.json', 'utf8').replace(/^\uFEFF/, ''));
const c2 = JSON.parse(fs.readFileSync('C:/Users/MSI/.gemini/antigravity/scratch/pdam-fieldticket-next/src/data/dsr-september-customers.json', 'utf8').replace(/^\uFEFF/, ''));
const customers = [...c1, ...c2];

const categories = [
  { id: 'cat-001', nama: 'Kebocoran Pipa Dinas', grup: 'Teknik', prioritas_default: 'KRITIS', aktif: true },
  { id: 'cat-002', nama: 'Kebocoran Instalatur', grup: 'Teknik', prioritas_default: 'TINGGI', aktif: true },
  { id: 'cat-003', nama: 'Supply Air', grup: 'Distribusi', prioritas_default: 'TINGGI', aktif: true },
  { id: 'cat-004', nama: 'Pembayaran Melonjak', grup: 'Administrasi', prioritas_default: 'SEDANG', aktif: true },
  { id: 'cat-005', nama: 'Water Meter Rusak/Mati', grup: 'Meter', prioritas_default: 'SEDANG', aktif: true },
  { id: 'cat-006', nama: 'Lainnya', grup: 'Umum', prioritas_default: 'RENDAH', aktif: true },
];

const wilayahList = [
  // Petugas: GUGUM (Blok 1)
  { id: '1002', nama: '1002 - KP. BJ KOPO-CIBUNGUR-UBRUG', petugas: 'Gugum', lat: -6.9912, lng: 106.7753, aktif: true },
  { id: '1003', nama: '1003 - KAMP. UBRUG I', petugas: 'Gugum', lat: -6.9945, lng: 106.7712, aktif: true },
  { id: '1004', nama: '1004 - KAMP. UBRUG II', petugas: 'Gugum', lat: -6.9980, lng: 106.7690, aktif: true },
  { id: '1005', nama: '1005 - HEGAR MANAH', petugas: 'Gugum', lat: -6.9890, lng: 106.7845, aktif: true },
  { id: '1006', nama: '1006 - KAMP. SALAMIJNCANG 2', petugas: 'Gugum', lat: -6.9920, lng: 106.7890, aktif: true },
  { id: '1009', nama: '1009 - DS. GIRIJAYA', petugas: 'Gugum', lat: -7.0010, lng: 106.7650, aktif: true },
  { id: '1010', nama: '1010 - DAMARRAJA', petugas: 'Gugum', lat: -7.0035, lng: 106.7675, aktif: true },
  { id: '2001', nama: '2001 - KAMP. SUKAHARJA', petugas: 'Gugum', lat: -7.0020, lng: 106.7630, aktif: true },
  { id: '2002', nama: '2002 - KAMP. SUKAHARJA-LEBAKSARI', petugas: 'Gugum', lat: -7.0050, lng: 106.7610, aktif: true },
  { id: '2003', nama: '2003 - KAMP. SUKASARI-SINDANGSARI', petugas: 'Gugum', lat: -7.0075, lng: 106.7590, aktif: true },
  { id: '2004', nama: '2004 - KAMP. SIMPENAN', petugas: 'Gugum', lat: -7.0110, lng: 106.7560, aktif: true },
  { id: '2005', nama: '2005 - KAMP. PAWAGAN', petugas: 'Gugum', lat: -7.0140, lng: 106.7530, aktif: true },

  // Petugas: FAJAR (Blok 2)
  { id: '1001', nama: '1001 - KAMP. CIKONENG', petugas: 'Fajar', lat: -6.9852, lng: 106.7821, aktif: true },
  { id: '1008', nama: '1008 - KP. MANGGA DUA-SINDANG KERTA', petugas: 'Fajar', lat: -6.9780, lng: 106.7860, aktif: true },
  { id: '3008', nama: '3008 - CIJAMBE', petugas: 'Fajar', lat: -6.9815, lng: 106.7895, aktif: true },
  { id: '3009', nama: '3009 - KP. CILANDAK - LIO', petugas: 'Fajar', lat: -6.9790, lng: 106.7930, aktif: true },
  { id: '3010', nama: '3010 - BANTAR GADUNG PASEPAN I', petugas: 'Fajar', lat: -6.9740, lng: 106.7980, aktif: true },
  { id: '3011', nama: '3011 - PERUM SME BAITI JANNATI', petugas: 'Fajar', lat: -6.9820, lng: 106.7840, aktif: true },
  { id: '3012', nama: '3012 - KP. GELARSARI', petugas: 'Fajar', lat: -6.9865, lng: 106.7905, aktif: true },
  { id: '3014', nama: '3014 - TARISI CITAMBANG', petugas: 'Fajar', lat: -6.9890, lng: 106.7940, aktif: true },
  { id: '4016', nama: '4016 - PERUM. BUMI CIKEMBANG', petugas: 'Fajar', lat: -6.9840, lng: 106.7790, aktif: true },

  // Petugas: ANDI (Blok 3)
  { id: '1007', nama: '1007 - KP. SOBOG KP. BARU SUKARESMI', petugas: 'Andi', lat: -6.9830, lng: 106.7910, aktif: true },
  { id: '3001', nama: '3001 - KAMP. SELAGEDANG-CIGOMBONG', petugas: 'Andi', lat: -6.9760, lng: 106.7950, aktif: true },
  { id: '3002', nama: '3002 - KAMP. CIGOMBONG', petugas: 'Andi', lat: -6.9745, lng: 106.7975, aktif: true },
  { id: '3004', nama: '3004 - KAMP. WARUNGKIARA', petugas: 'Andi', lat: -6.9720, lng: 106.8020, aktif: true },
  { id: '3005', nama: '3005 - KAMP. WARUNGKIARA 02', petugas: 'Andi', lat: -6.9700, lng: 106.8040, aktif: true },
  { id: '3006', nama: '3006 - WARUNGKIARA-BABAKAN', petugas: 'Andi', lat: -6.9680, lng: 106.8060, aktif: true },
  { id: '3007', nama: '3007 - BAED I', petugas: 'Andi', lat: -6.9650, lng: 106.8080, aktif: true },
  { id: '3013', nama: '3013 - BAED II', petugas: 'Andi', lat: -6.9630, lng: 106.8100, aktif: true },
  { id: '8014', nama: '8014 - BOJONGPARI', petugas: 'Andi', lat: -6.9610, lng: 106.8120, aktif: true },
  { id: '8015', nama: '8015 - KP. MANGUNJAYA', petugas: 'Andi', lat: -6.9590, lng: 106.8140, aktif: true },

  // Petugas: APRI (Blok 4)
  { id: '4001', nama: '4001 - CICATIH', petugas: 'Apri', lat: -6.9810, lng: 106.7680, aktif: true },
  { id: '4002', nama: '4002 - KAMP. CIKEMBANG I', petugas: 'Apri', lat: -6.9860, lng: 106.7740, aktif: true },
  { id: '4004', nama: '4004 - KAMP. CIKEMBANG II', petugas: 'Apri', lat: -6.9875, lng: 106.7760, aktif: true },
  { id: '4006', nama: '4006 - KAMP. CIARENGKOK', petugas: 'Apri', lat: -6.9890, lng: 106.7710, aktif: true },
  { id: '4007', nama: '4007 - KAMP. CIARENGKOK-CIKAMANTRI', petugas: 'Apri', lat: -6.9910, lng: 106.7695, aktif: true },
  { id: '4012', nama: '4012 - KAMP. CITENGAH-SUKAMULYA', petugas: 'Apri', lat: -6.9930, lng: 106.7670, aktif: true },
  { id: '4013', nama: '4013 - KAMP. CIPETIR DS. SUKAMULYA', petugas: 'Apri', lat: -6.9950, lng: 106.7650, aktif: true },
  { id: '4015', nama: '4015 - KAMP. CIBONGGOM', petugas: 'Apri', lat: -6.9970, lng: 106.7630, aktif: true },
  { id: '5001', nama: '5001 - KP. SUKAMANTRI-CIARENGKOK', petugas: 'Apri', lat: -6.9985, lng: 106.7620, aktif: true },
  { id: '5002', nama: '5002 - KAMP. SIMPENAN 02', petugas: 'Apri', lat: -7.0005, lng: 106.7600, aktif: true },

  // Petugas: ZIDAN (Blok 5)
  { id: '4003', nama: '4003 - KAMP. KEBON JERUK', petugas: 'Zidan', lat: -6.9895, lng: 106.7780, aktif: true },
  { id: '4005', nama: '4005 - KAMP. CIMANGGU', petugas: 'Zidan', lat: -6.9915, lng: 106.7800, aktif: true },
  { id: '5004', nama: '5004 - KAMP. CIKEMBAR I', petugas: 'Zidan', lat: -6.9930, lng: 106.7810, aktif: true },
  { id: '5007', nama: '5007 - KAMP. CIKEMBAR IV', petugas: 'Zidan', lat: -6.9960, lng: 106.7830, aktif: true },
  { id: '6006', nama: '6006 - SAMPORA-CIBODAS I', petugas: 'Zidan', lat: -7.0080, lng: 106.7720, aktif: true },
  { id: '6007', nama: '6007 - SAMPORA-CIBODAS II', petugas: 'Zidan', lat: -7.0100, lng: 106.7700, aktif: true },
  { id: '6008', nama: '6008 - PERUM. PERMATA INDAH SAMPORA', petugas: 'Zidan', lat: -7.0125, lng: 106.7680, aktif: true },

  // Petugas: RIVALDI (Blok 6)
  { id: '4008', nama: '4008 - KAMP. CIANGSANA - SUKAMULYA', petugas: 'Rivaldi', lat: -7.0030, lng: 106.7580, aktif: true },
  { id: '4009', nama: '4009 - PERUM. CIKEMBAR RESIDENCE', petugas: 'Rivaldi', lat: -7.0010, lng: 106.7595, aktif: true },
  { id: '4010', nama: '4010 - CIMENTENG', petugas: 'Rivaldi', lat: -7.0050, lng: 106.7550, aktif: true },
  { id: '4011', nama: '4011 - KAMP. CIANGSANA 2', petugas: 'Rivaldi', lat: -7.0070, lng: 106.7530, aktif: true },
  { id: '5005', nama: '5005 - KAMP. CIKEMBAR II', petugas: 'Rivaldi', lat: -6.9940, lng: 106.7820, aktif: true },
  { id: '6003', nama: '6003 - MEKAR SARI-BJ WARUNG', petugas: 'Rivaldi', lat: -7.0160, lng: 106.7520, aktif: true },
  { id: '6004', nama: '6004 - BJ KIDUL-BJ WARUNG-S.TUJUH', petugas: 'Rivaldi', lat: -7.0180, lng: 106.7500, aktif: true },

  // Petugas: RIZAL (Blok 7)
  { id: '5003', nama: '5003 - KAMP. CILANGKAP', petugas: 'Rizal', lat: -7.0120, lng: 106.7540, aktif: true },
  { id: '5006', nama: '5006 - KAMP. CIKEMBAR III', petugas: 'Rizal', lat: -6.9950, lng: 106.7825, aktif: true },
  { id: '5008', nama: '5008 - KAMP. PIPINJIL-CIHUNI', petugas: 'Rizal', lat: -7.0200, lng: 106.7480, aktif: true },
  { id: '5009', nama: '5009 - KP. CIKATE-PALIMABELAS', petugas: 'Rizal', lat: -7.0220, lng: 106.7460, aktif: true },
  { id: '5010', nama: '5010 - KP. TEGAL PANJANG-DS. SUKAMAJU', petugas: 'Rizal', lat: -7.0240, lng: 106.7440, aktif: true },
  { id: '6001', nama: '6001 - KP. PS GABIG-GN GADUNG', petugas: 'Rizal', lat: -7.0150, lng: 106.7580, aktif: true },
  { id: '6002', nama: '6002 - MK. SARI CIKAREO-GABIG BJK', petugas: 'Rizal', lat: -7.0170, lng: 106.7560, aktif: true },
  { id: '6005', nama: '6005 - SAMPORA NEGLASARI-CIBODAS', petugas: 'Rizal', lat: -7.0140, lng: 106.7660, aktif: true },
];

const users = [
  { user_id: 'usr-admin-01', nama: 'Administrator Cabang', email: 'admin@pdam.local', role: 'admin', status_aktif: true },
  { user_id: 'usr-kaur-01', nama: 'Kaur Teknik & Distribusi', email: 'kaur@pdam.local', role: 'kaur', status_aktif: true },
  { user_id: 'usr-kacab-01', nama: 'Kepala Cabang Cikembar', email: 'kacab@pdam.local', role: 'kepala_cabang', status_aktif: true },
  { user_id: 'usr-kas-01', nama: 'Petugas Kassa', email: 'kas@pdam.local', role: 'kas', status_aktif: true },
  { user_id: 'usr-baca-01', nama: 'Gugum (Pembaca Meter Blok 1)', email: 'gugum@pdam.local', role: 'petugas_baca', wilayah_id: '1002', status_aktif: true },
  { user_id: 'usr-baca-02', nama: 'Fajar (Pembaca Meter Blok 2)', email: 'fajar@pdam.local', role: 'petugas_baca', wilayah_id: '1001', status_aktif: true },
  { user_id: 'usr-baca-03', nama: 'Andi (Pembaca Meter Blok 3)', email: 'andi@pdam.local', role: 'petugas_baca', wilayah_id: '3004', status_aktif: true },
  { user_id: 'usr-baca-04', nama: 'Apri (Pembaca Meter Blok 4)', email: 'apri@pdam.local', role: 'petugas_baca', wilayah_id: '4002', status_aktif: true },
  { user_id: 'usr-baca-05', nama: 'Zidan (Pembaca Meter Blok 5)', email: 'zidan@pdam.local', role: 'petugas_baca', wilayah_id: '5004', status_aktif: true },
  { user_id: 'usr-baca-06', nama: 'Rivaldi (Pembaca Meter Blok 6)', email: 'rivaldi@pdam.local', role: 'petugas_baca', wilayah_id: '4008', status_aktif: true },
  { user_id: 'usr-baca-07', nama: 'Rizal (Pembaca Meter Blok 7)', email: 'rizal@pdam.local', role: 'petugas_baca', wilayah_id: '5003', status_aktif: true },
  { user_id: 'usr-tek-01', nama: 'Dadan Hamdani (Teknisi Lapangan)', email: 'dadan@pdam.local', role: 'petugas_teknik', status_aktif: true },
  { user_id: 'usr-tek-02', nama: 'Hendra Gunawan (Teknisi Lapangan)', email: 'hendra@pdam.local', role: 'petugas_teknik', status_aktif: true },
  { user_id: 'usr-tek-03', nama: 'Iwan Setiawan (Teknisi Lapangan)', email: 'iwan@pdam.local', role: 'petugas_teknik', status_aktif: true },
];

const complaintTemplates = {
  'cat-001': [
    'Pipa dinas bocor sembur di depan rumah warga dekat jalan utama, air bersih meluap ke bahu jalan.',
    'Pipa dinas retak sambungan socket akibat beban kendaraan, rembesan air cukup deras.',
    'Pipa dinas 2 inch pecah samping tiang listrik, aliran air terbuang ke drainase.',
    'Pipa tersenggol alat berat perbaikan parit jalan, air menyembur deras di badan jalan.',
    'Rembesan air bersih muncul dari bawah aspal jalan, aspal mulai amblas tergerus air.'
  ],
  'cat-002': [
    'Bocor pada stop kran sebelum meteran konsumen, kran dol tidak bisa ditutup rapat.',
    'Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman rumah.',
    'Sambungan water torn longgar, pipa instalatur setelah meter bocor merembes terus menerus.',
    'Pipa instalatur bocor halus di bawah pondasi pagar rumah konsumen.'
  ],
  'cat-003': [
    'Aliran air mati total sejak 2 hari lalu di daerah ketinggian/ujung jaringan pipa blok.',
    'Tekanan air sangat kecil, air hanya menetes saat larut malam (pukul 01:00-03:00).',
    'Air mengalir keruh kekuningan bercampur endapan lumpur setelah ada perbaikan pipa utama.',
    'Suplai air tidak stabil dan sering mati tiba-tiba saat jam sibuk pagi hari.'
  ],
  'cat-004': [
    'Tagihan rekening air melonjak drastis 3 kali lipat padahal pemakaian rumah tangga normal.',
    'Pelanggan mengajukan keberatan tagihan bulan ini naik tinggi, mohon cek stan meteran fisik.',
    'Konsumen merasa angka kubikasi di rekening tidak sesuai dengan fisik angka stan meter.',
    'Ada dugaan kebocoran dalam instalasi pipa rumah yang menyebabkan lonjakan tagihan air.'
  ],
  'cat-005': [
    'Angka stan meter macet total tidak berputar walaupun kran air sedang digunakan.',
    'Kaca water meter buram dan berembun tebal, digit angka kubikasi tidak terbaca petugas.',
    'Jarum indikator meteran patah dan segel meter terlepas.',
    'Body water meter retak dan bocor halus merembes dari sela drat jarum meter.'
  ],
  'cat-006': [
    'Permintaan relokasi geser posisi meteran air karena ada renovasi pembangunan pagar rumah.',
    'Permohonan cek fisik dan balik nama sambungan langganan air PDAM.',
    'Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.'
  ]
};

const pipeSizes = ['1/2"', '3/4"', '1"', '1 1/2"', '2"'];
const statuses = ['BARU', 'DITUGASKAN', 'DALAM_PROSES', 'SELESAI', 'DITUTUP'];
const teknisiList = users.filter(u => u.role === 'petugas_teknik');
const pembacaList = users.filter(u => u.role === 'petugas_baca');

const tickets = [];

for (let i = 0; i < 40; i++) {
  const cust = customers[i % customers.length];
  const cat = categories[i % categories.length];
  const wil = wilayahList[i % wilayahList.length];
  const status = statuses[i % statuses.length];
  
  // Find meter reader for this wilayah
  const reader = pembacaList.find(p => p.nama.toLowerCase().includes(wil.petugas.toLowerCase())) || pembacaList[0];
  
  // Assign technician if not BARU
  let assignedTech = null;
  if (status !== 'BARU') {
    assignedTech = teknisiList[i % teknisiList.length];
  }

  const descList = complaintTemplates[cat.id];
  const desc = descList[i % descList.length];
  const pipe = cat.id === 'cat-001' || cat.id === 'cat-002' ? pipeSizes[i % pipeSizes.length] : '';

  const ticketNo = 'TKT-202611-' + String(i + 1).padStart(4, '0');
  const ticketId = 'tk-cikembar-' + (i + 1);

  // Generate date in Nov 2026
  const day = 1 + (i % 20);
  const hour = 8 + (i % 8);
  const min = (i * 7) % 60;
  const createdDate = new Date(Date.UTC(2026, 10, day, hour, min, 0));
  const updatedDate = new Date(createdDate.getTime() + (status === 'SELESAI' || status === 'DITUTUP' ? 3600000 * 24 : 3600000 * 2));

  // Clean customer id (take part before slash)
  const custId = cust.id_pelanggan.split('/')[0].trim();

  tickets.push({
    id: ticketId,
    nomor_tiket: ticketNo,
    pelapor_id: reader.user_id,
    pelapor_nama: reader.nama,
    pelanggan_id: custId,
    nama_pelanggan: cust.nama,
    no_hp: '08' + (5700000000 + (i * 1234567) % 90000000),
    ukuran_pipa: pipe,
    kategori_id: cat.id,
    kategori_nama: cat.nama,
    wilayah_id: wil.id,
    wilayah_nama: wil.nama,
    deskripsi: desc,
    lat: Number((wil.lat + (Math.sin(i) * 0.003)).toFixed(6)),
    lng: Number((wil.lng + (Math.cos(i) * 0.003)).toFixed(6)),
    akurasi_gps: Number((4.5 + (i % 5)).toFixed(1)),
    prioritas: cat.prioritas_default,
    status: status,
    assigned_to: assignedTech ? assignedTech.user_id : null,
    assigned_to_nama: assignedTech ? assignedTech.nama : null,
    created_at: createdDate.toISOString(),
    updated_at: updatedDate.toISOString(),
    photos: [
      {
        id: 'photo-' + (i + 1) + '-1',
        ticket_id: ticketId,
        uploader_id: reader.user_id,
        tipe_foto: 'SEBELUM',
        file_url: '/uploads/logo_pdam.png',
        drive_file_id: 'foto_lapangan_' + ticketNo.toLowerCase() + '.jpg',
        created_at: createdDate.toISOString()
      }
    ],
    progress: [
      {
        id: 'prog-' + (i + 1) + '-1',
        ticket_id: ticketId,
        actor_id: reader.user_id,
        actor_nama: reader.nama,
        status_baru: 'BARU',
        catatan: 'Laporan lapangan diterima dari pembaca meter saat patroli rute ' + wil.nama,
        created_at: createdDate.toISOString()
      },
      ...(assignedTech ? [{
        id: 'prog-' + (i + 1) + '-2',
        ticket_id: ticketId,
        actor_id: 'usr-kaur-01',
        actor_nama: 'Kaur Teknik & Distribusi',
        status_baru: 'DITUGASKAN',
        catatan: 'Disposisi penanganan teknis lapangan kepada ' + assignedTech.nama,
        created_at: new Date(createdDate.getTime() + 1800000).toISOString()
      }] : []),
      ...(status === 'DALAM_PROSES' || status === 'SELESAI' || status === 'DITUTUP' ? [{
        id: 'prog-' + (i + 1) + '-3',
        ticket_id: ticketId,
        actor_id: assignedTech.user_id,
        actor_nama: assignedTech.nama,
        status_baru: 'DALAM_PROSES',
        catatan: 'Tim teknisi tiba di lokasi dan sedang melakukan penanganan fisik pipa di lapangan',
        created_at: new Date(createdDate.getTime() + 7200000).toISOString()
      }] : []),
      ...(status === 'SELESAI' || status === 'DITUTUP' ? [{
        id: 'prog-' + (i + 1) + '-4',
        ticket_id: ticketId,
        actor_id: assignedTech.user_id,
        actor_nama: assignedTech.nama,
        status_baru: 'SELESAI',
        catatan: 'Perbaikan selesai dilakukan. Aliran air kembali normal dan tidak ada kebocoran.',
        created_at: updatedDate.toISOString()
      }] : []),
      ...(status === 'DITUTUP' ? [{
        id: 'prog-' + (i + 1) + '-5',
        ticket_id: ticketId,
        actor_id: 'usr-admin-01',
        actor_nama: 'Administrator Cabang',
        status_baru: 'DITUTUP',
        catatan: 'Tiket ditutup dan diverifikasi oleh admin cabang.',
        created_at: new Date(updatedDate.getTime() + 3600000).toISOString()
      }] : [])
    ]
  });
}

const fileContent = `import { Category, Wilayah, User, Ticket } from '@/types';

export const INITIAL_CATEGORIES: Category[] = ${JSON.stringify(categories, null, 2)};

export const INITIAL_WILAYAH: Wilayah[] = ${JSON.stringify(wilayahList, null, 2)};

export const INITIAL_USERS: User[] = ${JSON.stringify(users, null, 2)};

export const INITIAL_TICKETS: Ticket[] = ${JSON.stringify(tickets, null, 2)};
`;

fs.writeFileSync('C:/Users/MSI/.gemini/antigravity/scratch/pdam-fieldticket-next/src/lib/seed-data.ts', fileContent, 'utf8');
console.log('SUCCESS: Written seed-data.ts with ' + tickets.length + ' real tickets, ' + wilayahList.length + ' wilayah, and ' + users.length + ' users!');
