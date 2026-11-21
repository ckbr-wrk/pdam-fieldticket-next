/**
 * Setup.gs
 * PDAM FieldTicket — Initial spreadsheet setup, seeding, and Drive folder creation.
 * Run setupSpreadsheet() once from the Apps Script editor to initialize the system.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Sheet definitions: name → [header columns]
// ─────────────────────────────────────────────────────────────────────────────
var SHEET_SCHEMA = {
  Users: [
    'user_id', 'nama', 'email', 'role', 'wilayah_id', 'status_aktif', 'password_hash'
  ],
  Tickets: [
    'ticket_id', 'nomor_tiket', 'pelapor_id', 'pelanggan_id', 'kategori_id',
    'wilayah_id', 'deskripsi', 'lat', 'lng', 'akurasi_gps', 'prioritas',
    'status', 'created_at', 'updated_at', 'idempotency_key', 'nama_pelanggan', 'no_hp', 'ukuran_pipa',
    'print_count', 'last_printed_at', 'last_printed_by'
  ],
  Assignments: [
    'id', 'ticket_id', 'assigned_by', 'assigned_to', 'assigned_at', 'catatan'
  ],
  Progress: [
    'id', 'ticket_id', 'actor_id', 'status_baru', 'catatan', 'created_at'
  ],
  Photos: [
    'id', 'ticket_id', 'uploader_id', 'tipe_foto', 'drive_file_id', 'created_at'
  ],
  Categories: [
    'id', 'nama', 'grup', 'prioritas_default', 'aktif'
  ],
  Wilayah: [
    'id', 'nama', 'petugas', 'aktif'
  ],
  Audit_Log: [
    'id', 'ticket_id', 'actor_id', 'aksi', 'nilai_sebelum', 'nilai_sesudah', 'timestamp'
  ],
  Notifications: [
    'id', 'user_id', 'message', 'ticket_id', 'is_read', 'created_at'
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// Seed data
// ─────────────────────────────────────────────────────────────────────────────
var SEED_CATEGORIES = [
  { id: 'cat-001', nama: 'Kebocoran Pipa Dinas',   grup: 'Teknik',       prioritas_default: 'KRITIS', aktif: true },
  { id: 'cat-002', nama: 'Kebocoran Instalatur',   grup: 'Teknik',       prioritas_default: 'TINGGI', aktif: true },
  { id: 'cat-003', nama: 'Supply Air',             grup: 'Distribusi',   prioritas_default: 'TINGGI', aktif: true },
  { id: 'cat-004', nama: 'Pembayaran Melonjak',    grup: 'Administrasi', prioritas_default: 'SEDANG', aktif: true },
  { id: 'cat-005', nama: 'Water Meter Rusak/Mati', grup: 'Meter',        prioritas_default: 'SEDANG', aktif: true },
  { id: 'cat-006', nama: 'Lainnya',                grup: 'Umum',         prioritas_default: 'RENDAH', aktif: true }
];

var SEED_WILAYAH = [
  // Petugas: GUGUM (Blok 1 - 12 Wilayah, 1.483 SL)
  { id: '1002', nama: '1002 - KP. BJ KOPO-CIBUNGUR-UBRUG',       petugas: 'Gugum', aktif: true },
  { id: '1003', nama: '1003 - KAMP. UBRUG I',                    petugas: 'Gugum', aktif: true },
  { id: '1004', nama: '1004 - KAMP. UBRUG II',                   petugas: 'Gugum', aktif: true },
  { id: '1005', nama: '1005 - HEGAR MANAH',                      petugas: 'Gugum', aktif: true },
  { id: '1006', nama: '1006 - KAMP. SALAMIJNCANG 2',             petugas: 'Gugum', aktif: true },
  { id: '1009', nama: '1009 - DS. GIRIJAYA',                     petugas: 'Gugum', aktif: true },
  { id: '1010', nama: '1010 - DAMARRAJA',                        petugas: 'Gugum', aktif: true },
  { id: '2001', nama: '2001 - KAMP. SUKAHARJA',                  petugas: 'Gugum', aktif: true },
  { id: '2002', nama: '2002 - KAMP. SUKAHARJA-LEBAKSARI',        petugas: 'Gugum', aktif: true },
  { id: '2003', nama: '2003 - KAMP. SUKASARI-SINDANGSARI',       petugas: 'Gugum', aktif: true },
  { id: '2004', nama: '2004 - KAMP. SIMPENAN',                   petugas: 'Gugum', aktif: true },
  { id: '2005', nama: '2005 - KAMP. PAWAGAN',                    petugas: 'Gugum', aktif: true },

  // Petugas: FAJAR (Blok 2 - 9 Wilayah, 1.207 SL)
  { id: '1001', nama: '1001 - KAMP. CIKONENG',                    petugas: 'Fajar', aktif: true },
  { id: '1008', nama: '1008 - KP. MANGGA DUA-SINDANG KERTA',     petugas: 'Fajar', aktif: true },
  { id: '3008', nama: '3008 - CIJAMBE',                          petugas: 'Fajar', aktif: true },
  { id: '3009', nama: '3009 - KP. CILANDAK - LIO',               petugas: 'Fajar', aktif: true },
  { id: '3010', nama: '3010 - BANTAR GADUNG PASEPAN I',          petugas: 'Fajar', aktif: true },
  { id: '3011', nama: '3011 - PERUM SME BAITI JANNATI',          petugas: 'Fajar', aktif: true },
  { id: '3012', nama: '3012 - KP. GELARSARI',                    petugas: 'Fajar', aktif: true },
  { id: '3014', nama: '3014 - TARISI CITAMBANG',                 petugas: 'Fajar', aktif: true },
  { id: '4016', nama: '4016 - PERUM. BUMI CIKEMBANG',             petugas: 'Fajar', aktif: true },

  // Petugas: ANDI (Blok 3 - 10 Wilayah, 1.474 SL)
  { id: '1007', nama: '1007 - KP. SOBOG KP. BARU SUKARESMI',     petugas: 'Andi', aktif: true },
  { id: '3001', nama: '3001 - KAMP. SELAGEDANG-CIGOMBONG',       petugas: 'Andi', aktif: true },
  { id: '3002', nama: '3002 - KAMP. CIGOMBONG',                  petugas: 'Andi', aktif: true },
  { id: '3004', nama: '3004 - KAMP. WARUNGKIARA',                petugas: 'Andi', aktif: true },
  { id: '3005', nama: '3005 - KAMP. WARUNGKIARA 02',             petugas: 'Andi', aktif: true },
  { id: '3006', nama: '3006 - WARUNGKIARA-BABAKAN',              petugas: 'Andi', aktif: true },
  { id: '3007', nama: '3007 - BAED I',                           petugas: 'Andi', aktif: true },
  { id: '3013', nama: '3013 - BAED II',                          petugas: 'Andi', aktif: true },
  { id: '8014', nama: '8014 - BOJONGPARI',                       petugas: 'Andi', aktif: true },
  { id: '8015', nama: '8015 - KP. MANGUNJAYA',                   petugas: 'Andi', aktif: true },

  // Petugas: APRI (Blok 4 - 10 Wilayah, 1.541 SL)
  { id: '4001', nama: '4001 - CICATIH',                          petugas: 'Apri', aktif: true },
  { id: '4002', nama: '4002 - KAMP. CIKEMBANG I',                petugas: 'Apri', aktif: true },
  { id: '4004', nama: '4004 - KAMP. CIKEMBANG II',               petugas: 'Apri', aktif: true },
  { id: '4006', nama: '4006 - KAMP. CIARENGKOK',                 petugas: 'Apri', aktif: true },
  { id: '4007', nama: '4007 - KAMP. CIARENGKOK-CIKAMANTRI',      petugas: 'Apri', aktif: true },
  { id: '4012', nama: '4012 - KAMP. CITENGAH-SUKAMULYA',          petugas: 'Apri', aktif: true },
  { id: '4013', nama: '4013 - KAMP. CIPETIR DS. SUKAMULYA',       petugas: 'Apri', aktif: true },
  { id: '4015', nama: '4015 - KAMP. CIBONGGOM',                  petugas: 'Apri', aktif: true },
  { id: '5001', nama: '5001 - KP. SUKAMANTRI-CIARENGKOK',         petugas: 'Apri', aktif: true },
  { id: '5002', nama: '5002 - KAMP. SIMPENAN 02',                petugas: 'Apri', aktif: true },

  // Petugas: ZIDAN (Blok 5 - 7 Wilayah, 1.205 SL)
  { id: '4003', nama: '4003 - KAMP. KEBON JERUK',                petugas: 'Zidan', aktif: true },
  { id: '4005', nama: '4005 - KAMP. CIMANGGU',                   petugas: 'Zidan', aktif: true },
  { id: '5004', nama: '5004 - KAMP. CIKEMBAR I',                 petugas: 'Zidan', aktif: true },
  { id: '5007', nama: '5007 - KAMP. CIKEMBAR IV',                petugas: 'Zidan', aktif: true },
  { id: '6006', nama: '6006 - SAMPORA-CIBODAS I',                petugas: 'Zidan', aktif: true },
  { id: '6007', nama: '6007 - SAMPORA-CIBODAS II',               petugas: 'Zidan', aktif: true },
  { id: '6008', nama: '6008 - PERUM. PERMATA INDAH SAMPORA',     petugas: 'Zidan', aktif: true },

  // Petugas: RIVALDI (Blok 6 - 7 Wilayah, 1.452 SL)
  { id: '4008', nama: '4008 - KAMP. CIANGSANA - SUKAMULYA',       petugas: 'Rivaldi', aktif: true },
  { id: '4009', nama: '4009 - PERUM. CIKEMBAR RESIDENCE',        petugas: 'Rivaldi', aktif: true },
  { id: '4010', nama: '4010 - CIMENTENG',                        petugas: 'Rivaldi', aktif: true },
  { id: '4011', nama: '4011 - KAMP. CIANGSANA 2',                petugas: 'Rivaldi', aktif: true },
  { id: '5005', nama: '5005 - KAMP. CIKEMBAR II',                petugas: 'Rivaldi', aktif: true },
  { id: '6003', nama: '6003 - MEKAR SARI-BJ WARUNG',             petugas: 'Rivaldi', aktif: true },
  { id: '6004', nama: '6004 - BJ KIDUL-BJ WARUNG-S.TUJUH',       petugas: 'Rivaldi', aktif: true },

  // Petugas: RIZAL (Blok 7 - 8 Wilayah, 1.299 SL)
  { id: '5003', nama: '5003 - KAMP. CILANGKAP',                  petugas: 'Rizal', aktif: true },
  { id: '5006', nama: '5006 - KAMP. CIKEMBAR III',               petugas: 'Rizal', aktif: true },
  { id: '5008', nama: '5008 - KAMP. PIPINJIL-CIHUNI',            petugas: 'Rizal', aktif: true },
  { id: '5009', nama: '5009 - KP. CIKATE-PALIMABELAS',           petugas: 'Rizal', aktif: true },
  { id: '5010', nama: '5010 - KP. TEGAL PANJANG-DS. SUKAMAJU',   petugas: 'Rizal', aktif: true },
  { id: '6001', nama: '6001 - KP. PS GABIG-GN GADUNG',           petugas: 'Rizal', aktif: true },
  { id: '6002', nama: '6002 - MK. SARI CIKAREO-GABIG BJK',       petugas: 'Rizal', aktif: true },
  { id: '6005', nama: '6005 - SAMPORA NEGLASARI-CIBODAS',        petugas: 'Rizal', aktif: true }
];

// Default admin credentials (change immediately after first login)
var DEFAULT_ADMIN = {
  nama:     'Administrator',
  email:    'admin@pdam.local',
  password: 'Admin@123!',
  role:     'admin',
  wilayah_id: '',
  status_aktif: true
};

// ─────────────────────────────────────────────────────────────────────────────
// Main setup entry point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * setupSpreadsheet()
 * Creates (or reuses) the master spreadsheet, builds all sheets with headers,
 * seeds reference data, creates the admin user, and stores IDs in Script Properties.
 *
 * Run this ONCE from the Apps Script editor: Extensions → Apps Script → Run → setupSpreadsheet
 */
function setupSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var spreadsheetId = props.getProperty('SPREADSHEET_ID');
  var photoFolderId = props.getProperty('PHOTO_FOLDER_ID');
  var projectFolderId = props.getProperty('PROJECT_FOLDER_ID');
  var ss;

  // ── Project Folder ────────────────────────────────────────────────────────
  var projectFolder;
  if (projectFolderId) {
    try {
      projectFolder = DriveApp.getFolderById(projectFolderId);
    } catch (e) {
      projectFolder = null;
    }
  }
  if (!projectFolder) {
    projectFolder = getOrCreateFolder('📁 PDAM - FieldTicket (Utama)');
    projectFolderId = projectFolder.getId();
    props.setProperty('PROJECT_FOLDER_ID', projectFolderId);
  }

  // ── Spreadsheet ──────────────────────────────────────────────────────────
  if (spreadsheetId) {
    try {
      ss = SpreadsheetApp.openById(spreadsheetId);
      Logger.log('Reusing existing spreadsheet: ' + spreadsheetId);
    } catch (e) {
      Logger.log('Stored SPREADSHEET_ID is invalid, creating new spreadsheet.');
      ss = null;
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create('PDAM FieldTicket — Database');
    spreadsheetId = ss.getId();
    props.setProperty('SPREADSHEET_ID', spreadsheetId);

    try {
      var ssFile = DriveApp.getFileById(spreadsheetId);
      projectFolder.addFile(ssFile);
      DriveApp.getRootFolder().removeFile(ssFile);
    } catch (err) {
      Logger.log('Note moving spreadsheet: ' + err.message);
    }
    Logger.log('Created new spreadsheet: ' + spreadsheetId);
  }

  // ── Sheets ───────────────────────────────────────────────────────────────
  for (var sheetName in SHEET_SCHEMA) {
    _ensureSheet(ss, sheetName, SHEET_SCHEMA[sheetName]);
  }

  // Remove the default blank "Sheet1" if it still exists
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  // ── Seed reference data (only if sheets are empty) ───────────────────────
  _seedCategories(ss);
  _seedWilayah(ss);
  _seedAdminUser(ss, props);

  // ── Drive photo folder inside project folder ──────────────────────────────
  var photoFolder;
  if (photoFolderId) {
    try {
      photoFolder = DriveApp.getFolderById(photoFolderId);
    } catch (e) {
      photoFolder = null;
    }
  }
  if (!photoFolder) {
    var subFolders = projectFolder.getFoldersByName('PDAM-FieldTicket-Photos');
    if (subFolders.hasNext()) {
      photoFolder = subFolders.next();
    } else {
      photoFolder = projectFolder.createFolder('PDAM-FieldTicket-Photos');
    }
    photoFolderId = photoFolder.getId();
    props.setProperty('PHOTO_FOLDER_ID', photoFolderId);
  }

  try {
    setupDailyBackupTrigger();
  } catch (e) {
    Logger.log('Note setting up daily backup trigger: ' + e.message);
  }

  Logger.log('=== Setup complete ===');
  Logger.log('Project Folder ID: ' + projectFolderId);
  Logger.log('Spreadsheet ID   : ' + spreadsheetId);
  Logger.log('Photo Folder ID  : ' + photoFolderId);
  Logger.log('Admin login      : ' + DEFAULT_ADMIN.email + ' / ' + DEFAULT_ADMIN.password);

  return {
    projectFolderId: projectFolderId,
    projectFolderUrl: projectFolder.getUrl(),
    spreadsheetId: spreadsheetId,
    spreadsheetUrl: ss.getUrl(),
    photoFolderId: photoFolderId
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Drive folder helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getOrCreateFolder(name)
 * Returns the Drive folder ID for the given name, creating it if absent.
 * @param {string} name  Folder display name
 * @return {string}      Drive folder ID
 */
function getOrCreateFolder(name) {
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) {
    var folder = folders.next();
    Logger.log('Reusing Drive folder "' + name + '": ' + folder.getId());
    return folder.getId();
  }
  var newFolder = DriveApp.createFolder(name);
  Logger.log('Created Drive folder "' + name + '": ' + newFolder.getId());
  return newFolder.getId();
}

// ─────────────────────────────────────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ensure a sheet exists with the correct header row.
 * Does NOT wipe existing data — only adds the sheet / header if missing.
 */
function _ensureSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    Logger.log('Created sheet: ' + name);
  }

  // Set or validate header row
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    // Style the header row
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a73e8');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    Logger.log('Added header to sheet: ' + name);
  }
  return sheet;
}

/**
 * Seed Categories sheet with initial data if it has no data rows.
 */
function _seedCategories(ss) {
  var sheet = ss.getSheetByName('Categories');
  if (sheet.getLastRow() > 1) {
    Logger.log('Categories already seeded, skipping.');
    return;
  }
  var headers = SHEET_SCHEMA.Categories;
  SEED_CATEGORIES.forEach(function(cat) {
    var row = headers.map(function(h) { return cat[h] !== undefined ? cat[h] : ''; });
    sheet.appendRow(row);
  });
  Logger.log('Seeded ' + SEED_CATEGORIES.length + ' categories.');
}

/**
 * Seed Wilayah sheet with initial data if it has no data rows.
 */
function _seedWilayah(ss) {
  var sheet = ss.getSheetByName('Wilayah');
  if (sheet.getLastRow() > 1) {
    Logger.log('Wilayah already seeded, skipping.');
    return;
  }
  var headers = SHEET_SCHEMA.Wilayah;
  SEED_WILAYAH.forEach(function(wil) {
    var row = headers.map(function(h) { return wil[h] !== undefined ? wil[h] : ''; });
    sheet.appendRow(row);
  });
  Logger.log('Seeded ' + SEED_WILAYAH.length + ' wilayah entries.');
}

/**
 * importCikembarWilayah()
 * Replaces existing Wilayah entries with all 63 official Cikembar blocks.
 */
function importCikembarWilayah() {
  var sheet = getSheet('Wilayah');
  
  // Clear any existing rows (keep header row 1)
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }

  // Batch insert all 63 rows
  var headers = SHEET_SCHEMA.Wilayah;
  var rows = SEED_WILAYAH.map(function(wil) {
    return headers.map(function(h) { return wil[h] !== undefined ? wil[h] : ''; });
  });

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  clearSheetCache('Wilayah');
  Logger.log('Berhasil mengimpor ' + rows.length + ' Wilayah Cikembar.');
  return rows.length;
}

/**
 * importCikembarCategories()
 * Replaces existing Categories entries with the 6 official Cikembar complaint categories.
 */
function importCikembarCategories() {
  var sheet = getSheet('Categories');
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  var headers = SHEET_SCHEMA.Categories;
  var rows = SEED_CATEGORIES.map(function(cat) {
    return headers.map(function(h) { return cat[h] !== undefined ? cat[h] : ''; });
  });
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  clearSheetCache('Categories');
  syncTicketsHeader();
  Logger.log('Berhasil mengimpor ' + rows.length + ' Kategori Cikembar.');
  return rows.length;
}

/**
 * syncTicketsHeader()
 * Ensures optional columns (nama_pelanggan, no_hp) exist in Tickets sheet.
 */
function syncTicketsHeader() {
  var sheet = getSheet('Tickets');
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return;
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var missing = [];
  ['nama_pelanggan', 'no_hp', 'ukuran_pipa'].forEach(function(col) {
    if (headers.indexOf(col) === -1) missing.push(col);
  });
  if (missing.length > 0) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    clearSheetCache('Tickets');
    Logger.log('Added missing ticket columns: ' + missing.join(', '));
  }
}

/**
 * Create the default admin user if no users exist yet.
 */
function _seedAdminUser(ss, props) {
  var sheet = ss.getSheetByName('Users');
  if (sheet.getLastRow() > 1) {
    Logger.log('Users already seeded, skipping admin creation.');
    return;
  }

  var userId = generateId();
  var hash = hashPassword(DEFAULT_ADMIN.password, userId);
  var headers = SHEET_SCHEMA.Users;
  var userObj = {
    user_id:       userId,
    nama:          DEFAULT_ADMIN.nama,
    email:         DEFAULT_ADMIN.email,
    role:          DEFAULT_ADMIN.role,
    wilayah_id:    DEFAULT_ADMIN.wilayah_id,
    status_aktif:  DEFAULT_ADMIN.status_aktif,
    password_hash: hash
  };
  var row = headers.map(function(h) { return userObj[h] !== undefined ? userObj[h] : ''; });
  sheet.appendRow(row);
  Logger.log('Created default admin user: ' + DEFAULT_ADMIN.email);
}
