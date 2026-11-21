/**
 * Photos.gs
 * PDAM FieldTicket — Photo upload and retrieval via Google Drive.
 *
 * Photos are stored as files in a dedicated Drive folder.
 * Only metadata (Drive file ID, URL) is stored in the Photos sheet — no binary
 * data ever passes through the Spreadsheet.
 *
 * tipe_foto values: SEBELUM | PROGRES | SESUDAH
 * Maximum 5 photos per ticket.
 */

var MAX_PHOTOS_PER_TICKET = 5;
var ALLOWED_PHOTO_TYPES = ['SEBELUM', 'PROGRES', 'SESUDAH'];
var ALLOWED_MIME_TYPES  = ['image/jpeg', 'image/png', 'image/webp'];
var MAX_BASE64_LENGTH   = 7000000; // ~5MB binary payload limit

// ─────────────────────────────────────────────────────────────────────────────
// Upload
// ─────────────────────────────────────────────────────────────────────────────

/**
 * uploadPhoto(token, ticket_id, tipe_foto, base64Data, mimeType, fileName)
 * Decodes a base64-encoded image, saves it to the Drive photo folder,
 * records the metadata in the Photos sheet, and returns the photo record.
 *
 * @param {string} token
 * @param {string} ticket_id
 * @param {string} tipe_foto    SEBELUM | PROGRES | SESUDAH
 * @param {string} base64Data   Base64-encoded image bytes (no data-URL prefix)
 * @param {string} mimeType     e.g. "image/jpeg"
 * @param {string} fileName     Desired file name (will be prefixed with ticket number)
 * @return {Object}  Photo metadata record
 */
function uploadPhoto(token, ticket_id, tipe_foto, base64Data, mimeType, fileName) {
  var session = requireAuth(token);

  // ── Validate inputs ───────────────────────────────────────────────────────
  if (!ticket_id)  throw new Error('ticket_id wajib diisi.');
  if (!base64Data) throw new Error('base64Data wajib diisi.');
  if (!tipe_foto)  throw new Error('tipe_foto wajib diisi.');

  if (ALLOWED_PHOTO_TYPES.indexOf(tipe_foto) === -1) {
    throw new Error('tipe_foto tidak valid. Gunakan: ' + ALLOWED_PHOTO_TYPES.join(', '));
  }

  mimeType = mimeType || 'image/jpeg';
  if (ALLOWED_MIME_TYPES.indexOf(mimeType) === -1) {
    throw new Error('Tipe MIME tidak didukung. Gunakan: ' + ALLOWED_MIME_TYPES.join(', '));
  }

  // ── Validate ticket exists and user has access ────────────────────────────
  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var ticket = tickets[0];

  // Check access — petugas_teknik must be assigned
  if (session.role === 'petugas_teknik') {
    var assignment = findRows('Assignments', function(a) {
      return a.ticket_id === ticket_id && a.assigned_to === session.user_id;
    });
    if (assignment.length === 0) {
      throw new Error('Anda tidak memiliki akses untuk mengunggah foto ke tiket ini.');
    }
  } else if (session.role === 'kepala_cabang') {
    throw new Error('Kepala Cabang hanya memiliki akses lihat (read-only).');
  } else if (session.role === 'petugas_baca' || session.role === 'kas') {
    if (ticket.pelapor_id !== session.user_id) {
      throw new Error('Anda hanya dapat mengunggah foto ke tiket yang Anda buat.');
    }
  }
  // admin and kaur can upload to any ticket in their wilayah
  else if (session.role === 'admin' || session.role === 'kaur') {
    if (session.wilayah_id && ticket.wilayah_id !== session.wilayah_id) {
      throw new Error('Tiket berada di luar wilayah Anda.');
    }
  }

  // ── Enforce maximum photo count ───────────────────────────────────────────
  var existingPhotos = findRows('Photos', function(p) { return p.ticket_id === ticket_id; });
  if (existingPhotos.length >= MAX_PHOTOS_PER_TICKET) {
    throw new Error(
      'Jumlah foto sudah mencapai batas maksimum (' + MAX_PHOTOS_PER_TICKET + ' foto per tiket).'
    );
  }

  // ── Decode base64 and save to Drive ──────────────────────────────────────
  var props    = PropertiesService.getScriptProperties();
  var folderId = props.getProperty('PHOTO_FOLDER_ID');
  if (!folderId) {
    // Fallback: create folder on the fly
    folderId = getOrCreateFolder('PDAM-FieldTicket-Photos');
    props.setProperty('PHOTO_FOLDER_ID', folderId);
  }

  var folder = DriveApp.getFolderById(folderId);

  // Strip data-URL prefix if caller accidentally included it
  var cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');

  if (cleanBase64.length > MAX_BASE64_LENGTH) {
    throw new Error('Ukuran file foto melebihi batas maksimal (maksimal 5 MB).');
  }

  var decodedBytes;
  try {
    decodedBytes = Utilities.base64Decode(cleanBase64);
  } catch (e) {
    throw new Error('Format base64 foto tidak valid: ' + e.message);
  }

  // Verify magic bytes to ensure file is genuinely an image (prevent file upload attacks)
  if (!_verifyImageMagicBytes(decodedBytes, mimeType)) {
    throw new Error('Integritas file foto tidak valid atau tipe file tidak sesuai.');
  }

  var blob = Utilities.newBlob(
    decodedBytes,
    mimeType,
    _buildFileName(ticket.nomor_tiket, tipe_foto, fileName)
  );

  var driveFile = folder.createFile(blob);
  // Make the file viewable by anyone with the link (sharing URL generation)
  driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // ── Persist metadata to Photos sheet ─────────────────────────────────────
  var now       = new Date();
  var photoId   = generateId();
  var photoMeta = {
    id:            photoId,
    ticket_id:     ticket_id,
    uploader_id:   session.user_id,
    tipe_foto:     tipe_foto,
    drive_file_id: driveFile.getId(),
    created_at:    now.toISOString()
  };
  appendRow('Photos', photoMeta);

  addAuditLog(ticket_id, session.user_id, 'UPLOAD_PHOTO', null, {
    photo_id: photoId, tipe_foto: tipe_foto, drive_file_id: driveFile.getId()
  });

  // Return metadata with URL
  return Object.assign({}, photoMeta, {
    photo_id:  photoId,
    url:       driveFile.getUrl(),
    view_url:  'https://drive.google.com/file/d/' + driveFile.getId() + '/view',
    thumbnail: 'https://drive.google.com/thumbnail?id=' + driveFile.getId() + '&sz=w400'
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Retrieve
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getTicketPhotos(token, ticket_id)
 * Returns a list of photo metadata records for the given ticket.
 * Includes Drive sharing URLs but NOT base64 binary data.
 *
 * @param {string} token
 * @param {string} ticket_id
 * @return {Object[]}  Array of photo metadata objects
 */
function getTicketPhotos(token, ticket_id) {
  var session = requireAuth(token);
  if (!ticket_id) throw new Error('ticket_id wajib diisi.');

  // Ensure ticket exists and verify RBAC access (prevent IDOR)
  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  _assertTicketAccess(session, tickets[0]);

  var photos = findRows('Photos', function(p) { return p.ticket_id === ticket_id; });

  return photos.map(function(p) {
    var fileId = p.drive_file_id;
    return {
      id:            p.id,
      ticket_id:     p.ticket_id,
      uploader_id:   p.uploader_id,
      tipe_foto:     p.tipe_foto,
      drive_file_id: fileId,
      created_at:    p.created_at,
      view_url:      'https://drive.google.com/file/d/' + fileId + '/view',
      thumbnail:     'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w400',
      download_url:  'https://drive.google.com/uc?export=download&id=' + fileId
    };
  }).sort(function(a, b) { return new Date(a.created_at) - new Date(b.created_at); });
}

/**
 * getPhotoBase64(token, photo_id)
 * Returns the photo as a base64-encoded data URL string.
 * Used by the frontend (via google.script.run) to display photos
 * inside the GAS sandbox where external Drive URLs are blocked.
 */
function getPhotoBase64(token, photo_id) {
  var session = requireAuth(token);
  if (!photo_id) throw new Error('photo_id wajib diisi.');

  var photos = findRows('Photos', function(p) { return p.id === photo_id; });
  if (photos.length === 0) throw new Error('Foto tidak ditemukan.');
  var photo  = photos[0];

  // Prevent IDOR: verify user has access to this ticket
  var tickets = findRows('Tickets', function(t) { return t.ticket_id === photo.ticket_id; });
  if (tickets.length > 0) {
    _assertTicketAccess(session, tickets[0]);
  }

  var fileId = photo.drive_file_id;
  var file;
  try {
    file = DriveApp.getFileById(fileId);
  } catch (e) {
    throw new Error('File foto tidak ditemukan di Drive.');
  }

  var blob     = file.getBlob();
  var mimeType = blob.getContentType() || 'image/jpeg';
  var b64      = Utilities.base64Encode(blob.getBytes());

  return {
    photo_id:  photo_id,
    data_url:  'data:' + mimeType + ';base64,' + b64,
    mime_type: mimeType
  };
}

/**
 * getPhotoUrl(token, photo_id)
 * Returns a short-lived temporary download URL for a specific photo.
 * The URL is valid for the duration of a standard Drive session.
 *
 * @param {string} token
 * @param {string} photo_id
 * @return {{view_url: string, download_url: string, thumbnail: string}}
 */
function getPhotoUrl(token, photo_id) {
  var session = requireAuth(token);
  if (!photo_id) throw new Error('photo_id wajib diisi.');

  var photos = findRows('Photos', function(p) { return p.id === photo_id; });
  if (photos.length === 0) throw new Error('Foto tidak ditemukan.');
  var photo  = photos[0];

  // Prevent IDOR: verify user has access to this ticket
  var tickets = findRows('Tickets', function(t) { return t.ticket_id === photo.ticket_id; });
  if (tickets.length > 0) {
    _assertTicketAccess(session, tickets[0]);
  }

  var fileId = photo.drive_file_id;

  // Verify the file still exists in Drive
  try {
    DriveApp.getFileById(fileId);
  } catch (e) {
    throw new Error('File foto tidak ditemukan di Drive. Mungkin telah dihapus.');
  }

  return {
    photo_id:     photo_id,
    drive_file_id: fileId,
    view_url:     'https://drive.google.com/file/d/' + fileId + '/view',
    download_url: 'https://drive.google.com/uc?export=download&id=' + fileId,
    thumbnail:    'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w800'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verify Magic Bytes of decoded binary image
 */
function _verifyImageMagicBytes(decodedBytes, mimeType) {
  if (!decodedBytes || decodedBytes.length < 12) return false;
  var b = function(i) { return decodedBytes[i] & 0xFF; };

  if (mimeType === 'image/jpeg') {
    return b(0) === 0xFF && b(1) === 0xD8 && b(2) === 0xFF;
  }
  if (mimeType === 'image/png') {
    return b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4E && b(3) === 0x47;
  }
  if (mimeType === 'image/webp') {
    return b(0) === 0x52 && b(1) === 0x49 && b(2) === 0x46 && b(3) === 0x46 &&
           b(8) === 0x57 && b(9) === 0x45 && b(10) === 0x42 && b(11) === 0x50;
  }
  return false;
}

/**
 * Build a sanitised filename for the Drive upload.
 * Format: <nomor_tiket>_<tipe_foto>_<timestamp>_<clean_name>
 */
function _buildFileName(nomorTiket, tipeFoto, originalName) {
  var ts   = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
  var ext  = _guessExtension(originalName || '');
  var base = (nomorTiket || 'TIKET').replace(/[^a-zA-Z0-9_\-]/g, '_');
  return base + '_' + tipeFoto + '_' + ts + ext;
}

/**
 * Attempt to extract the file extension from a file name, defaulting to .jpg.
 */
function _guessExtension(fileName) {
  var match = String(fileName).match(/\.[a-zA-Z0-9]+$/);
  return match ? match[0].toLowerCase() : '.jpg';
}
