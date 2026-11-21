// ============================================================
// AdminPanel.gs — User, category, and area management
// PDAM FieldTicket
// ============================================================

// ── USERS ────────────────────────────────────────────────────

/** Get all users (no password_hash) — admin only */
function getUsers(token) {
  requireRole(token, ['admin']);
  var users = sheetToObjects(getSheet('Users'));
  return users.map(function(u) {
    return {
      user_id: u.user_id, nama: u.nama, email: u.email,
      role: u.role, wilayah_id: u.wilayah_id, status_aktif: u.status_aktif
    };
  });
}

/** Create a new user — admin only */
function createUser(token, data) {
  var actor = requireRole(token, ['admin']);
  var required = ['nama', 'email', 'role', 'password'];
  required.forEach(function(f) {
    if (!data[f]) throw new Error('Field wajib: ' + f);
  });

  var validRoles = ['petugas_baca', 'kas', 'petugas_teknik', 'admin', 'kaur', 'kepala_cabang'];
  if (validRoles.indexOf(data.role) === -1) throw new Error('Role tidak valid.');

  // Check duplicate and valid email
  var newEmail = String(data.email || '').trim().toLowerCase();
  if (!isValidEmail(newEmail)) throw new Error('Format email tidak valid.');

  var existing = findRow('Users', function(u) { return u.email && u.email.toLowerCase() === newEmail; });
  if (existing) throw new Error('Email sudah terdaftar.');

  if (data.password.length < 6) throw new Error('Password minimal 6 karakter.');
  if (data.password.length > 64) throw new Error('Password maksimal 64 karakter.');

  var cleanNama = sanitizeInput(data.nama, 100);
  var userId = generateId();
  appendRow('Users', {
    user_id: userId,
    nama: cleanNama,
    email: newEmail,
    role: data.role,
    wilayah_id: data.wilayah_id || '',
    status_aktif: true,
    password_hash: hashPassword(data.password, userId)
  });

  addAuditLog('', actor.user_id, 'CREATE_USER', '', { email: newEmail, role: data.role });
  return { user_id: userId, nama: cleanNama, email: newEmail, role: data.role };
}

/** Update user (nama, email, role, wilayah, status_aktif) — admin only */
function updateUser(token, user_id, updates) {
  var actor = requireRole(token, ['admin']);
  if (!user_id) throw new Error('user_id wajib.');

  var validRoles = ['petugas_baca', 'kas', 'petugas_teknik', 'admin', 'kaur', 'kepala_cabang'];
  var allowed = ['nama', 'role', 'wilayah_id', 'status_aktif'];
  var safeUpdates = {};

  allowed.forEach(function(f) {
    if (updates[f] !== undefined) safeUpdates[f] = updates[f];
  });

  if (safeUpdates.nama !== undefined) {
    safeUpdates.nama = sanitizeInput(safeUpdates.nama, 100);
  }

  if (safeUpdates.role && validRoles.indexOf(safeUpdates.role) === -1) {
    throw new Error('Role tidak valid.');
  }

  // Prevent self-lockout
  if (actor.user_id === user_id) {
    if (safeUpdates.status_aktif === false || safeUpdates.status_aktif === 'false') {
      throw new Error('Anda tidak dapat menonaktifkan akun Admin Anda sendiri.');
    }
    if (safeUpdates.role && safeUpdates.role !== 'admin') {
      throw new Error('Anda tidak dapat mengubah role akun Admin Anda sendiri.');
    }
  }

  // Handle edit email
  if (updates.email !== undefined) {
    var newEmail = String(updates.email).trim().toLowerCase();
    if (!isValidEmail(newEmail)) {
      throw new Error('Format email tidak valid.');
    }
    var duplicate = findRow('Users', function(u) {
      return u.email && u.email.toLowerCase() === newEmail && u.user_id !== user_id;
    });
    if (duplicate) throw new Error('Email ' + newEmail + ' sudah digunakan oleh pengguna lain.');
    safeUpdates.email = newEmail;
  }

  var ok = updateRow('Users', 'user_id', user_id, safeUpdates);
  if (!ok) throw new Error('Pengguna tidak ditemukan.');
  addAuditLog('', actor.user_id, 'UPDATE_USER', '', { user_id: user_id, updates: safeUpdates });
  return { message: 'Pengguna berhasil diperbarui.' };
}

/** Reset password — admin only */
function resetPassword(token, user_id, new_password) {
  var actor = requireRole(token, ['admin']);
  if (!user_id || !new_password) throw new Error('user_id dan password baru wajib.');
  if (new_password.length < 6) throw new Error('Password minimal 6 karakter.');

  var ok = updateRow('Users', 'user_id', user_id, { password_hash: hashPassword(new_password, user_id) });
  if (!ok) throw new Error('Pengguna tidak ditemukan.');
  addAuditLog('', actor.user_id, 'RESET_PASSWORD', '', { user_id: user_id });
  return { message: 'Password berhasil direset.' };
}

// ── CATEGORIES ───────────────────────────────────────────────

/** Get all categories (active) */
function getCategories(token) {
  requireAuth(token);
  return sheetToObjects(getSheet('Categories')).filter(function(c) { return c.aktif !== false; });
}

/** Create category — admin only */
function createCategory(token, data) {
  var actor = requireRole(token, ['admin']);
  if (!data.nama || !data.grup) throw new Error('Nama dan grup wajib.');

  var validPriority = ['KRITIS', 'TINGGI', 'SEDANG', 'RENDAH'];
  var prio = data.prioritas_default;
  if (validPriority.indexOf(prio) === -1) {
    prio = 'SEDANG';
  }

  var cleanNama = sanitizeInput(data.nama, 100);
  var cleanGrup = sanitizeInput(data.grup, 50);
  var id = generateId();
  appendRow('Categories', {
    id: id, nama: cleanNama, grup: cleanGrup,
    prioritas_default: prio, aktif: true
  });
  addAuditLog('', actor.user_id, 'CREATE_CATEGORY', '', { id: id, nama: cleanNama, grup: cleanGrup, prioritas_default: prio });
  return { id: id };
}

/** Update category — admin only */
function updateCategory(token, id, updates) {
  var actor = requireRole(token, ['admin']);
  if (!id) throw new Error('id wajib.');

  var safeUpdates = {};
  if (updates.nama !== undefined) safeUpdates.nama = sanitizeInput(updates.nama, 100);
  if (updates.grup !== undefined) safeUpdates.grup = sanitizeInput(updates.grup, 50);
  if (updates.prioritas_default !== undefined) {
    var validPriority = ['KRITIS', 'TINGGI', 'SEDANG', 'RENDAH'];
    if (validPriority.indexOf(updates.prioritas_default) !== -1) {
      safeUpdates.prioritas_default = updates.prioritas_default;
    }
  }
  if (updates.aktif !== undefined) safeUpdates.aktif = Boolean(updates.aktif);

  var ok = updateRow('Categories', 'id', id, safeUpdates);
  if (!ok) throw new Error('Kategori tidak ditemukan.');
  addAuditLog('', actor.user_id, 'UPDATE_CATEGORY', '', { id: id, updates: safeUpdates });
  return { message: 'Kategori berhasil diperbarui.' };
}

// ── WILAYAH ──────────────────────────────────────────────────

/** Ensure sheet Wilayah has 'petugas' column and backfills defaults if empty */
function ensureWilayahPetugasColumn() {
  try {
    var sheet = getSheet('Wilayah');
    if (!sheet) return;
    var lastCol = sheet.getLastColumn();
    if (lastCol < 1) return;
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) { return String(h).trim(); });
    var colIdx = headers.indexOf('petugas');
    if (colIdx === -1) {
      colIdx = headers.length;
      sheet.getRange(1, colIdx + 1).setValue('petugas');
      headers.push('petugas');
      clearSheetCache('Wilayah');
    }

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return;

    var defaultMap = {
      '1002': 'Gugum', '1003': 'Gugum', '1004': 'Gugum', '1005': 'Gugum', '1006': 'Gugum', '1009': 'Gugum', '1010': 'Gugum', '2001': 'Gugum', '2002': 'Gugum', '2003': 'Gugum', '2004': 'Gugum', '2005': 'Gugum',
      '1001': 'Fajar', '1008': 'Fajar', '3008': 'Fajar', '3009': 'Fajar', '3010': 'Fajar', '3011': 'Fajar', '3012': 'Fajar', '3014': 'Fajar', '4016': 'Fajar',
      '1007': 'Andi', '3001': 'Andi', '3002': 'Andi', '3004': 'Andi', '3005': 'Andi', '3006': 'Andi', '3007': 'Andi', '3013': 'Andi', '8014': 'Andi', '8015': 'Andi',
      '4001': 'Apri', '4002': 'Apri', '4004': 'Apri', '4006': 'Apri', '4007': 'Apri', '4012': 'Apri', '4013': 'Apri', '4015': 'Apri', '5001': 'Apri', '5002': 'Apri',
      '4003': 'Zidan', '4005': 'Zidan', '5004': 'Zidan', '5007': 'Zidan', '6006': 'Zidan', '6007': 'Zidan', '6008': 'Zidan',
      '4008': 'Rivaldi', '4009': 'Rivaldi', '4010': 'Rivaldi', '4011': 'Rivaldi', '5005': 'Rivaldi', '6003': 'Rivaldi', '6004': 'Rivaldi',
      '5003': 'Rizal', '5006': 'Rizal', '5008': 'Rizal', '5009': 'Rizal', '5010': 'Rizal', '6001': 'Rizal', '6002': 'Rizal', '6005': 'Rizal'
    };

    var data = sheet.getRange(1, 1, lastRow, headers.length).getValues();
    var idIdx = headers.indexOf('id');
    var namaIdx = headers.indexOf('nama');
    var pColIdx = headers.indexOf('petugas');
    var updatedAny = false;

    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var idVal = String(row[idIdx] || '').trim();
      var namaVal = String(row[namaIdx] || '').trim();

      // Normalize UUID ID to clean numeric code if nama contains code (e.g. "3003 - ...")
      if (idVal.length > 10 && idVal.indexOf('-') !== -1) {
        var mCode = namaVal.match(/^\s*(\d{3,5})/);
        if (mCode) {
          var cleanCode = mCode[1];
          sheet.getRange(r + 1, idIdx + 1).setValue(cleanCode);
          idVal = cleanCode;
          updatedAny = true;
        }
      }

      var existingVal = String(row[pColIdx] || '').trim();
      if (!existingVal) {
        var str = idVal + ' ' + namaVal;
        var m = str.match(/\d+/);
        var code = m ? m[0] : '';
        if (code && defaultMap[code]) {
          sheet.getRange(r + 1, pColIdx + 1).setValue(defaultMap[code]);
          updatedAny = true;
        }
      }
    }
    if (updatedAny) {
      clearSheetCache('Wilayah');
    }
  } catch (err) {
    Logger.log('ensureWilayahPetugasColumn err: ' + err.message);
  }
}

/** Get all wilayah (active), sorted numerically by area code / number */
function getWilayah(token) {
  requireAuth(token);
  ensureWilayahPetugasColumn();
  var list = sheetToObjects(getSheet('Wilayah')).filter(function(w) { return w.aktif !== false; });
  list.sort(function(a, b) {
    var getNum = function(obj) {
      if (!obj) return 0;
      var m = String(obj.nama || '').match(/\d+/);
      if (m) return parseInt(m[0], 10);
      if (obj.id && /^\d+$/.test(String(obj.id).trim())) return parseInt(obj.id, 10);
      return 0;
    };
    var na = getNum(a), nb = getNum(b);
    if (na !== nb) return na - nb;
    return String(a.nama || '').localeCompare(String(b.nama || ''), undefined, { numeric: true });
  });
  return list;
}

/** Create wilayah — admin only */
function createWilayah(token, data) {
  var actor = requireRole(token, ['admin']);
  if (!data.nama) throw new Error('Nama wilayah wajib.');
  var cleanNama = sanitizeInput(data.nama, 100);
  var cleanPetugas = sanitizeInput(data.petugas || '', 100);
  var m = cleanNama.match(/^\s*(\d{3,5})/);
  var id = (m ? m[1] : '') || generateId();
  ensureWilayahPetugasColumn();
  appendRow('Wilayah', { id: id, nama: cleanNama, petugas: cleanPetugas, aktif: true });
  addAuditLog('', actor.user_id, 'CREATE_WILAYAH', '', { id: id, nama: cleanNama, petugas: cleanPetugas });
  return { id: id };
}

/** Update wilayah — admin only */
function updateWilayah(token, id, updates) {
  var actor = requireRole(token, ['admin']);
  if (!id) throw new Error('id wajib.');
  ensureWilayahPetugasColumn();

  var safeUpdates = {};
  if (updates.nama !== undefined) safeUpdates.nama = sanitizeInput(updates.nama, 100);
  if (updates.petugas !== undefined) safeUpdates.petugas = sanitizeInput(updates.petugas, 100);
  if (updates.aktif !== undefined) safeUpdates.aktif = Boolean(updates.aktif);

  var ok = updateRow('Wilayah', 'id', id, safeUpdates);
  if (!ok) throw new Error('Wilayah tidak ditemukan.');
  addAuditLog('', actor.user_id, 'UPDATE_WILAYAH', '', { id: id, updates: safeUpdates });
  return { message: 'Wilayah berhasil diperbarui.' };
}

/**
 * Get active technicians — admin and kaur.
 * Used by the assignment form (getUsers itself is admin-only).
 */
function getTeknisiList(token) {
  requireRole(token, ['admin', 'kaur']);
  var users = sheetToObjects(getSheet('Users'));
  return users.filter(function(u) {
    var isTeknisi = String(u.role || '').trim().toLowerCase() === 'petugas_teknik';
    var isAktif = (u.status_aktif === true || String(u.status_aktif || '').trim().toLowerCase() === 'true' || u.status_aktif === 1);
    return isTeknisi && isAktif;
  }).map(function(u) {
    return { user_id: u.user_id, nama: u.nama, wilayah_id: u.wilayah_id };
  });
}