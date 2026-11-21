/**
 * DummyData.gs
 * Generator data dummy realistis untuk pengujian dan demonstrasi sistem
 * PERUMDA Tirta Jaya Mandiri Cabang Cikembar.
 */

function seed50DummyTickets() {
  syncTicketsHeader();
  var ticketsSheet = getSheet('Tickets');
  var progressSheet = getSheet('Progress');

  // Bersihkan data dummy lama jika sudah ada (idempotent)
  clearDummyTickets();

  // Ambil user pelapor yang tersedia
  var users = sheetToObjects(getSheet('Users'));
  var pelaporList = users.filter(function(u) {
    return u.role === 'petugas_baca' || u.role === 'admin';
  });
  if (pelaporList.length === 0) pelaporList = users;
  var defaultPelaporId = pelaporList.length > 0 ? pelaporList[0].user_id : 'usr-admin-01';

  // Ambil daftar wilayah
  var wilayahObjects = sheetToObjects(getSheet('Wilayah'));
  var wilayahIds = wilayahObjects.map(function(w) { return String(w.id); });
  if (wilayahIds.length === 0) {
    wilayahIds = ['1002', '1003', '1004', '1005', '1006', '1009', '1010', '2001', '2002', '3004', '4014'];
  }

  // Pool Data Dummy Realistis Cikembar
  var customerNames = [
    'Ahmad Suhendar', 'Ibu Hj. Cucu Rohaeti', 'H. Maman Sulaeman', 'Dede Rustandi', 'Hj. Siti Rohmah',
    'Endang Koswara', 'Ujang Supriatna', 'Bapak Ade Komarudin', 'Yayan Heryanto', 'Ibu Nunung Nurjanah',
    'Rahmat Hidayat', 'Asep Saepulloh', 'Ibu Ai Maryati', 'Cecep Gunawan', 'Agus Setiawan',
    'Bapak Deden Syarif', 'Ibu Lilis Suryani', 'Wawan Ridwan', 'H. Engkos Sarkosih', 'Ibu Kokom Komalasari',
    'Tatang Sudrajat', 'Ibu Elis Nurbaeti', 'Jajang Nurzaman', 'Bapak Herman Sutisna', 'Ibu Eni Rohaeni',
    'Didin Wahyudin', 'Ibu Neng Sumiati', 'Iskandar Zulkarnaen', 'Bapak Eman Suherman', 'Ibu Dewi Sartika',
    'Saepul Bahri', 'Ibu Tini Martini', 'Dedi Supriadi', 'Bapak Yudi Wahyudi', 'Ibu Yani Mulyani',
    'Kosasih', 'Ibu Imas Masitoh', 'Samsudin', 'Bapak Ruslan Abdulgani', 'Ibu Euis Ratnasari',
    'Nanang Suryana', 'Ibu Cucun Sukaesih', 'Oce Setiawan', 'Bapak Anwar Sanusi', 'Ibu Ratna Komala',
    'Zaenal Arifin', 'Ibu Yeti Nurhayati', 'Sobari', 'Bapak Kurnia Effendi', 'Ibu Sri Rahayu'
  ];

  var categoryPool = [
    {
      catId: 'cat-001', name: 'Kebocoran Pipa Dinas', prio: 'KRITIS', sizes: ['1/2"', '3/4"', '1"', '1 1/2"', '2"', '3"'],
      descList: [
        'Pipa dinas bocor sembur di depan rumah warga RT 02/03 dekat gapura desa, air meluap ke jalan.',
        'Pipa dinas retak sambungan socket akibat beban jalan, rembesan air cukup deras.',
        'Pipa dinas 2 inch pecah samping tiang listrik, aliran terbuang ke parit saluran drainase.',
        'Pipa tersenggol beko proyek perbaikan parit, air menyembur deras di bahu jalan.',
        'Rembesan air bersih muncul dari bawah aspal, aspal jalan sedikit amblas tergerus.',
        'Pipa dinas 1 inch pecah di tikungan jalan kampung, mengganggu lalu lintas warga.'
      ]
    },
    {
      catId: 'cat-002', name: 'Kebocoran Instalatur', prio: 'TINGGI', sizes: ['1/2"', '3/4"'],
      descList: [
        'Bocor pada stop kran sebelum meteran konsumen, kran dol tidak bisa dimatikan.',
        'Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman.',
        'Sambungan water torn longgar, pipa instalatur setelah meter bocor rembes terus menerus.',
        'Pipa instalatur bocor halus di bawah pondasi pagar rumah konsumen.'
      ]
    },
    {
      catId: 'cat-003', name: 'Supply Air', prio: 'TINGGI', sizes: [''],
      descList: [
        'Aliran air mati total sejak 2 hari lalu di daerah ketinggian/ujung jaringan blok.',
        'Tekanan air sangat kecil, air hanya menetes saat larut malam (pukul 01:00-03:00).',
        'Air mengalir keruh kekuningan bercampur endapan setelah ada pekerjaan pipa utama.',
        'Suplai air tidak stabil dan sering mati di jam sibuk pagi hari.'
      ]
    },
    {
      catId: 'cat-004', name: 'Pembayaran Melonjak', prio: 'SEDANG', sizes: [''],
      descList: [
        'Tagihan melonjak drastis 3 kali lipat padahal pemakaian rumah tangga biasa dan normal.',
        'Pelanggan mengajukan keberatan tagihan bulan ini naik tinggi, mohon cek stan meter.',
        'Konsumen merasa angka kubikasi di rekening tidak sesuai dengan fisik angka stan meter.',
        'Ada dugaan kebocoran dalam instalasi pipa rumah yang membuat tagihan melonjak.'
      ]
    },
    {
      catId: 'cat-005', name: 'Water Meter Rusak/Mati', prio: 'SEDANG', sizes: [''],
      descList: [
        'Angka stan meter macet total tidak berputar walaupun kran air sedang digunakan.',
        'Kaca water meter buram dan berembun tebal, digit angka kubikasi tidak terbaca petugas.',
        'Jarum indikator meteran patah dan segel meter terlepas.',
        'Body water meter retak dan bocor halus merembes dari sela drat jarum.'
      ]
    },
    {
      catId: 'cat-006', name: 'Lainnya', prio: 'RENDAH', sizes: [''],
      descList: [
        'Permintaan relokasi geser posisi meteran air karena ada renovasi pembangunan pagar rumah.',
        'Permohonan cek fisik dan balik nama sambungan langganan air PDAM.',
        'Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.'
      ]
    }
  ];

  // Distribusi status 50 tiket
  // 15 Baru, 12 Ditugaskan, 8 Dalam Proses, 8 Selesai Dikerjakan, 7 Ditutup
  var statusDist = [
    'BARU', 'BARU', 'BARU', 'BARU', 'BARU', 'BARU', 'BARU', 'BARU', 'BARU', 'BARU', 'BARU', 'BARU', 'BARU', 'BARU', 'BARU',
    'DITUGASKAN', 'DITUGASKAN', 'DITUGASKAN', 'DITUGASKAN', 'DITUGASKAN', 'DITUGASKAN', 'DITUGASKAN', 'DITUGASKAN', 'DITUGASKAN', 'DITUGASKAN', 'DITUGASKAN', 'DITUGASKAN',
    'DALAM_PROSES', 'DALAM_PROSES', 'DALAM_PROSES', 'DALAM_PROSES', 'DALAM_PROSES', 'DALAM_PROSES', 'DALAM_PROSES', 'DALAM_PROSES',
    'SELESAI_DIKERJAKAN', 'SELESAI_DIKERJAKAN', 'SELESAI_DIKERJAKAN', 'SELESAI_DIKERJAKAN', 'SELESAI_DIKERJAKAN', 'SELESAI_DIKERJAKAN', 'SELESAI_DIKERJAKAN', 'SELESAI_DIKERJAKAN',
    'DITUTUP', 'DITUTUP', 'DITUTUP', 'DITUTUP', 'DITUTUP', 'DITUTUP', 'DITUTUP'
  ];

  var ticketHeaders = SHEET_SCHEMA.Tickets;
  var progressHeaders = SHEET_SCHEMA.Progress;
  var ticketRows = [];
  var progressRows = [];

  var baseTime = new Date('2026-11-03T14:00:00Z').getTime();

  for (var i = 0; i < 50; i++) {
    var numStr = (i + 1 < 10 ? '0' : '') + (i + 1);
    var tId = 'dummy-tk-' + (i + 1);
    var nomorTiket = 'FT-202611-D0' + numStr;

    // Pelapor acak dari daftar pelapor
    var pelapor = pelaporList[i % pelaporList.length];
    var pelaporId = pelapor ? pelapor.user_id : defaultPelaporId;

    // Kategori
    var catObj = categoryPool[i % categoryPool.length];
    var descList = catObj.descList;
    var desc = descList[i % descList.length];
    var sizeList = catObj.sizes;
    var ukuranPipa = sizeList[i % sizeList.length] || '';

    // Wilayah acak
    var wilId = wilayahIds[i % wilayahIds.length];

    // Pelanggan
    var custName = customerNames[i];
    var noSambung = wilId + '0' + (1000 + i);
    var noHp = '08' + (12 + (i % 8)) + (1000000 + (i * 12345));

    // Koordinat GPS di seputar Cikembar (-6.9850 s/d -7.0150, 106.7820 s/d 106.8250)
    var lat = (-6.9850 - ((i % 15) * 0.0020) + ((i % 7) * 0.0008)).toFixed(6);
    var lng = (106.7820 + ((i % 12) * 0.0035) - ((i % 5) * 0.0012)).toFixed(6);

    // Waktu pembuatan tersebar antara 28 hari lalu s/d hari ini
    var daysAgo = (50 - i) * 0.55; // 0.5 s/d 27 hari yang lalu
    var createdDate = new Date(baseTime - (daysAgo * 24 * 3600 * 1000));
    var updatedDate = new Date(createdDate.getTime() + (3600 * 1000 * 2));

    var status = statusDist[i] || 'BARU';

    var ticketObj = {
      ticket_id: tId,
      nomor_tiket: nomorTiket,
      pelapor_id: pelaporId,
      pelanggan_id: noSambung,
      kategori_id: catObj.catId,
      wilayah_id: wilId,
      deskripsi: desc,
      lat: lat,
      lng: lng,
      akurasi_gps: (6.5 + (i % 8) * 1.2).toFixed(1),
      prioritas: catObj.prio,
      status: status,
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
      idempotency_key: 'dummy_50',
      nama_pelanggan: custName,
      no_hp: noHp,
      ukuran_pipa: ukuranPipa
    };

    var row = ticketHeaders.map(function(h) {
      return ticketObj[h] !== undefined ? ticketObj[h] : '';
    });
    ticketRows.push(row);

    // Progress record 1: Tiket dibuat
    progressRows.push(progressHeaders.map(function(h) {
      var pObj = {
        id: 'dummy-prg-' + (i + 1) + '-1',
        ticket_id: tId,
        actor_id: pelaporId,
        status_baru: 'BARU',
        catatan: 'Tiket pengaduan dibuat oleh petugas baca meter.',
        created_at: createdDate.toISOString()
      };
      return pObj[h] !== undefined ? pObj[h] : '';
    }));

    // Progress record 2: Jika ditugaskan atau lebih
    if (status !== 'BARU') {
      var assignedDate = new Date(createdDate.getTime() + (3600 * 1000 * 3));
      progressRows.push(progressHeaders.map(function(h) {
        var pObj = {
          id: 'dummy-prg-' + (i + 1) + '-2',
          ticket_id: tId,
          actor_id: defaultPelaporId,
          status_baru: 'DITUGASKAN',
          catatan: 'Diteruskan ke Kaur Teknik & ditugaskan ke teknisi.',
          created_at: assignedDate.toISOString()
        };
        return pObj[h] !== undefined ? pObj[h] : '';
      }));
    }

    // Progress record 3: Jika dalam proses atau selesai
    if (status === 'DALAM_PROSES' || status === 'SELESAI_DIKERJAKAN' || status === 'DITUTUP') {
      var processDate = new Date(createdDate.getTime() + (3600 * 1000 * 8));
      progressRows.push(progressHeaders.map(function(h) {
        var pObj = {
          id: 'dummy-prg-' + (i + 1) + '-3',
          ticket_id: tId,
          actor_id: defaultPelaporId,
          status_baru: 'DALAM_PROSES',
          catatan: 'Teknisi melakukan penanganan teknis di lokasi pelanggan.',
          created_at: processDate.toISOString()
        };
        return pObj[h] !== undefined ? pObj[h] : '';
      }));
    }

    // Progress record 4: Jika selesai dikerjakan atau ditutup
    if (status === 'SELESAI_DIKERJAKAN' || status === 'DITUTUP') {
      var doneDate = new Date(createdDate.getTime() + (3600 * 1000 * 18));
      progressRows.push(progressHeaders.map(function(h) {
        var pObj = {
          id: 'dummy-prg-' + (i + 1) + '-4',
          ticket_id: tId,
          actor_id: defaultPelaporId,
          status_baru: 'SELESAI_DIKERJAKAN',
          catatan: 'Pekerjaan perbaikan selesai. Laporan fisik diserahkan ke admin.',
          created_at: doneDate.toISOString()
        };
        return pObj[h] !== undefined ? pObj[h] : '';
      }));
    }

    // Progress record 5: Jika ditutup
    if (status === 'DITUTUP') {
      var closeDate = new Date(createdDate.getTime() + (3600 * 1000 * 24));
      progressRows.push(progressHeaders.map(function(h) {
        var pObj = {
          id: 'dummy-prg-' + (i + 1) + '-5',
          ticket_id: tId,
          actor_id: defaultPelaporId,
          status_baru: 'DITUTUP',
          catatan: 'Admin telah memverifikasi dan tiket resmi ditutup di sistem.',
          created_at: closeDate.toISOString()
        };
        return pObj[h] !== undefined ? pObj[h] : '';
      }));
    }
  }

  // Batch insert ke Tickets
  if (ticketRows.length > 0) {
    var startRow = ticketsSheet.getLastRow() + 1;
    ticketsSheet.getRange(startRow, 1, ticketRows.length, ticketHeaders.length).setValues(ticketRows);
  }

  // Batch insert ke Progress
  if (progressRows.length > 0) {
    var pStartRow = progressSheet.getLastRow() + 1;
    progressSheet.getRange(pStartRow, 1, progressRows.length, progressHeaders.length).setValues(progressRows);
  }

  clearSheetCache('Tickets');
  clearSheetCache('Progress');
  Logger.log('Berhasil membuat 50 data dummy tiket realistis.');
  return ticketRows.length;
}

/**
 * Hapus semua tiket dummy yang dibuat oleh generator (aman & bersih).
 */
function clearDummyTickets() {
  var ticketsSheet = getSheet('Tickets');
  var progressSheet = getSheet('Progress');

  var lastRow = ticketsSheet.getLastRow();
  if (lastRow <= 1) return 0;

  var data = ticketsSheet.getRange(2, 1, lastRow - 1, ticketsSheet.getLastColumn()).getValues();
  var rowsToKeep = [];
  var deletedTicketIds = {};
  var count = 0;

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var ticketId = String(row[0] || '');
    var nomorTiket = String(row[1] || '');
    var key = String(row[14] || ''); // idempotency_key

    var isDummy = (key === 'dummy_50') || (nomorTiket.indexOf('-D') !== -1) || (ticketId.indexOf('dummy-tk-') === 0);

    if (isDummy) {
      deletedTicketIds[ticketId] = true;
      count++;
    } else {
      rowsToKeep.push(row);
    }
  }

  if (count > 0) {
    // Tulis ulang Tickets yang tersisa
    var numCols = ticketsSheet.getLastColumn();
    ticketsSheet.deleteRows(2, lastRow - 1);
    if (rowsToKeep.length > 0) {
      ticketsSheet.getRange(2, 1, rowsToKeep.length, numCols).setValues(rowsToKeep);
    }

    // Bersihkan juga di Progress sheet
    var pLastRow = progressSheet.getLastRow();
    if (pLastRow > 1) {
      var pData = progressSheet.getRange(2, 1, pLastRow - 1, progressSheet.getLastColumn()).getValues();
      var pRowsToKeep = [];
      for (var j = 0; j < pData.length; j++) {
        var pRow = pData[j];
        var pTicketId = String(pRow[1] || '');
        if (!deletedTicketIds[pTicketId]) {
          pRowsToKeep.push(pRow);
        }
      }
      var pCols = progressSheet.getLastColumn();
      progressSheet.deleteRows(2, pLastRow - 1);
      if (pRowsToKeep.length > 0) {
        progressSheet.getRange(2, 1, pRowsToKeep.length, pCols).setValues(pRowsToKeep);
      }
    }

    clearSheetCache('Tickets');
    clearSheetCache('Progress');
    Logger.log('Berhasil menghapus ' + count + ' data dummy tiket.');
  }

  return count;
}
