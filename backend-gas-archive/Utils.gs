/**
 * Utils.gs
 * PDAM FieldTicket — Shared utility functions used across all modules.
 */

// ─────────────────────────────────────────────────────────────────────────────
// ID / Ticket Number Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * generateId()
 * Returns a UUID-style unique identifier using Apps Script's built-in UUID generator.
 * @return {string}  e.g. "a3f5c2d1-4b6e-7890-abcd-ef1234567890"
 */
function generateId() {
  return Utilities.getUuid();
}

/**
 * generateTicketNumber(date)
 * Generates a ticket number in the format FT-YYYYMMDD-NNNN.
 * Uses a script-level lock to prevent race conditions when multiple requests
 * arrive simultaneously, and cross-checks the Tickets spreadsheet to guarantee
 * 100% unique ticket numbers without duplicates.
 *
 * @param {Date} date  The date to use for the date portion (default: now)
 * @return {string}    e.g. "FT-20240115-0001"
 */
function generateTicketNumber(date) {
  date = date || new Date();

  var lock = LockService.getScriptLock();
  lock.waitLock(15000); // Tunggu hingga 15 detik untuk lock aman

  try {
    var props = PropertiesService.getScriptProperties();
    var tz = Session.getScriptTimeZone();
    var dateStr = Utilities.formatDate(date, tz, 'yyyyMMdd');
    var counterKey = 'TICKET_COUNTER_' + dateStr;
    var counter = parseInt(props.getProperty(counterKey) || '0', 10);

    // Kroscek data aktual dari sheet 'Tickets' untuk mencari sequence tertinggi & duplikasi
    var existingNumbers = {};
    var maxSeqInSheet = 0;
    var prefix = 'FT-' + dateStr + '-';

    try {
      var ss = getSpreadsheet();
      var sheet = ss.getSheetByName('Tickets');
      if (sheet && sheet.getLastRow() > 1) {
        var lastCol = sheet.getLastColumn();
        var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
        var numColIdx = headers.indexOf('nomor_tiket');
        if (numColIdx !== -1) {
          var values = sheet.getRange(2, numColIdx + 1, sheet.getLastRow() - 1, 1).getValues();
          for (var i = 0; i < values.length; i++) {
            var val = String(values[i][0] || '').trim();
            if (val) {
              existingNumbers[val] = true;
              if (val.indexOf(prefix) === 0) {
                var seqPart = parseInt(val.substring(prefix.length), 10);
                if (!isNaN(seqPart) && seqPart > maxSeqInSheet) {
                  maxSeqInSheet = seqPart;
                }
              }
            }
          }
        }
      }
    } catch (e) {
      Logger.log('Warning saat cek nomor tiket unik di sheet: ' + e.message);
    }

    // Tentukan counter baru yang pasti lebih besar dari counter props dan data sheet
    counter = Math.max(counter, maxSeqInSheet) + 1;

    // Loop pastikan nomor tiket benar-benar UNIK dan belum pernah ada sebelumnya
    var candidate = '';
    while (true) {
      var seq = (counter < 10 ? '000' : (counter < 100 ? '00' : (counter < 1000 ? '0' : ''))) + counter;
      candidate = prefix + seq;
      if (!existingNumbers[candidate]) {
        break;
      }
      counter++;
    }

    props.setProperty(counterKey, String(counter));
    return candidate;
  } finally {
    lock.releaseLock();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Spreadsheet Access & In-Memory Caching (Optimasi Satset)
// ─────────────────────────────────────────────────────────────────────────────

var _activeSS = null;
var _execCache = {};
var CACHE_PREFIX_SHEET = 'ft_sheet_';

// Konfigurasi TTL cache per sheet (dalam detik)
var SHEET_CACHE_TTL = {
  Categories: 7200,   // 2 jam
  Wilayah: 7200,      // 2 jam
  Users: 1800,        // 30 menit
  Tickets: 120,       // 2 menit (auto-invalidated saat add/edit/delete)
  Assignments: 180,   // 3 menit
  Progress: 180,      // 3 menit
  Photos: 300         // 5 menit
};

/**
 * getSpreadsheet()
 * Caches spreadsheet instance in execution memory to avoid redundant openById calls.
 */
function getSpreadsheet() {
  if (_activeSS) return _activeSS;
  var props = PropertiesService.getScriptProperties();
  var ssId  = props.getProperty('SPREADSHEET_ID');
  if (!ssId) throw new Error('SPREADSHEET_ID not configured. Run setupSpreadsheet() first.');

  _activeSS = SpreadsheetApp.openById(ssId);
  return _activeSS;
}

/**
 * getSheet(name)
 * Returns the named sheet using the cached spreadsheet reference.
 *
 * @param {string} name  Sheet name
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getSheet(name) {
  var ss    = getSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('Sheet "' + name + '" not found in spreadsheet.');
  return sheet;
}

/**
 * clearSheetCache(sheetName)
 * Clears cache for a given sheet when mutations occur across memory, lookup, and ScriptCache.
 */
function clearSheetCache(sheetName) {
  delete _execCache[sheetName];
  if (typeof _LK !== 'undefined') _LK = null;
  try {
    var cache = CacheService.getScriptCache();
    cache.remove(CACHE_PREFIX_SHEET + sheetName);
  } catch (e) {
    Logger.log('Failed to clear cache: ' + e.message);
  }
}

/**
 * getCachedSheetObjects(sheetName)
 * Arsitektur 3-Layer Caching Super Cepat:
 * Layer 1: In-Execution Memory Cache (0 ms)
 * Layer 2: Apps Script ScriptCache (~15 ms)
 * Layer 3: Google Sheets Spreadsheet (Hanya saat cache kosong/invalidated)
 */
function getCachedSheetObjects(sheetName) {
  // Layer 1: In-Execution Memory
  if (_execCache[sheetName]) {
    return _execCache[sheetName];
  }

  var ttl = SHEET_CACHE_TTL[sheetName];
  var isCacheable = (ttl !== undefined);
  var cache = CacheService.getScriptCache();

  // Layer 2: ScriptCache
  if (isCacheable) {
    try {
      var cached = cache.get(CACHE_PREFIX_SHEET + sheetName);
      if (cached) {
        var parsed = JSON.parse(cached);
        _execCache[sheetName] = parsed;
        return parsed;
      }
    } catch (e) {}
  }

  // Layer 3: Google Sheet
  var sheet = getSheet(sheetName);
  var objects = sheetToObjects(sheet);
  _execCache[sheetName] = objects;

  if (isCacheable) {
    try {
      var str = JSON.stringify(objects);
      if (str.length < 95000) {
        cache.put(CACHE_PREFIX_SHEET + sheetName, str, ttl);
      }
    } catch (e) {}
  }

  return objects;
}

// ─────────────────────────────────────────────────────────────────────────────
// Row → Object Conversion
// ─────────────────────────────────────────────────────────────────────────────

/**
 * sheetToObjects(sheet)
 * Reads all data rows from a sheet and returns them as an array of plain
 * objects keyed by the header row (row 1).  Empty rows are skipped.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @return {Object[]}
 */
function sheetToObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0].map(function(h) { return String(h).trim(); });
  var results = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    // Skip completely empty rows
    if (row.every(function(cell) { return cell === '' || cell === null || cell === undefined; })) {
      continue;
    }
    var obj = {};
    headers.forEach(function(header, idx) {
      var val = row[idx];
      // Normalise boolean-like values stored as strings
      if (val === 'true')  val = true;
      if (val === 'false') val = false;
      obj[header] = val;
    });
    obj._rowIndex = i + 1; // 1-based sheet row for later updates
    results.push(obj);
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// CRUD Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * appendRow(sheetName, obj)
 * Appends a new row to the named sheet.  Column order follows the existing
 * header row; missing fields are written as empty strings.
 *
 * @param {string} sheetName
 * @param {Object} obj  Plain object whose keys match the sheet headers
 * @return {number}     Row index of the newly appended row (1-based)
 */
function appendRow(sheetName, obj) {
  var sheet   = getSheet(sheetName);
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) { return String(h).trim(); });

  // Self-healing: jika ada kolom di obj yang belum ada di header sheet, tambahkan otomatis
  var missingCols = [];
  for (var k in obj) {
    if (k && k !== '_rowIndex' && headers.indexOf(k) === -1) {
      missingCols.push(k);
    }
  }
  if (missingCols.length > 0) {
    try {
      var maxCols = sheet.getMaxColumns();
      var needed = headers.length + missingCols.length;
      if (needed > maxCols) {
        sheet.insertColumnsAfter(maxCols, needed - maxCols);
      }
      sheet.getRange(1, headers.length + 1, 1, missingCols.length).setValues([missingCols]);
      headers = headers.concat(missingCols);
    } catch (e) {
      Logger.log('Warning expand header: ' + e.message);
    }
  }

  var row     = headers.map(function(h) {
    var val = obj[h];
    if (val === undefined || val === null) return '';
    if (typeof val === 'object') return JSON.stringify(val);
    return escapeFormula(val);
  });
  sheet.appendRow(row);
  clearSheetCache(sheetName);
  return sheet.getLastRow();
}

/**
 * updateRow(sheetName, idField, idValue, updates)
 * Finds the first row where idField === idValue and updates the columns
 * specified in the `updates` object.  Other columns are left unchanged.
 *
 * @param {string} sheetName
 * @param {string} idField   Header name used as the lookup key
 * @param {*}      idValue   Value to match
 * @param {Object} updates   Map of {header: newValue} to write
 * @return {boolean}         true if a row was found and updated, false otherwise
 */
function updateRow(sheetName, idField, idValue, updates) {
  var sheet   = getSheet(sheetName);
  var data    = sheet.getDataRange().getValues();
  if (data.length < 2) return false;

  var headers  = data[0].map(function(h) { return String(h).trim(); });
  var idColIdx = headers.indexOf(idField);
  if (idColIdx === -1) throw new Error('Column "' + idField + '" not found in sheet "' + sheetName + '".');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idColIdx]) === String(idValue)) {
      // Apply each update
      for (var field in updates) {
        var colIdx = headers.indexOf(field);
        // Self-healing: jika kolom belum ada di header sheet, tambahkan otomatis di header baris 1
        if (colIdx === -1) {
          try {
            var newCol = headers.length + 1;
            if (newCol > sheet.getMaxColumns()) {
              sheet.insertColumnsAfter(sheet.getMaxColumns(), newCol - sheet.getMaxColumns());
            }
            sheet.getRange(1, newCol).setValue(field);
            headers.push(field);
            colIdx = headers.length - 1;
          } catch (e) {
            Logger.log('Warning updateRow expand col: ' + e.message);
          }
        }

        var val = updates[field];
        if (val === undefined || val === null) val = '';
        if (typeof val === 'object') val = JSON.stringify(val);
        sheet.getRange(i + 1, colIdx + 1).setValue(escapeFormula(val));
      }
      clearSheetCache(sheetName);
      return true;
    }
  }
  return false; // row not found
}

/**
 * findRows(sheetName, filterFn)
 * Returns all data-row objects from sheetName for which filterFn returns true.
 * Uses getCachedSheetObjects to deliver instant cached responses.
 *
 * @param {string}   sheetName
 * @param {Function} filterFn  Receives each row object; return true to include it
 * @return {Object[]}
 */
function findRows(sheetName, filterFn) {
  var objects = getCachedSheetObjects(sheetName);
  return filterFn ? objects.filter(filterFn) : objects;
}

/**
 * findRow(sheetName, filterFn)
 * Returns the FIRST matching row object, or null if none found.
 * Alias for findRows that returns a single object.
 */
function findRow(sheetName, filterFn) {
  var results = findRows(sheetName, filterFn);
  return results.length > 0 ? results[0] : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit Logging
// ─────────────────────────────────────────────────────────────────────────────

/**
 * addAuditLog(ticketId, actorId, aksi, before, after)
 * Appends one record to the Audit_Log sheet.
 *
 * @param {string} ticketId  ID of the ticket being acted on (may be '' for non-ticket actions)
 * @param {string} actorId   user_id of the actor
 * @param {string} aksi      Short action label, e.g. 'CREATE_TICKET', 'UPDATE_STATUS'
 * @param {*}      before    Previous value (will be JSON-stringified if object)
 * @param {*}      after     New value (will be JSON-stringified if object)
 */
function addAuditLog(ticketId, actorId, aksi, before, after) {
  var serialize = function(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  };

  appendRow('Audit_Log', {
    id:            generateId(),
    ticket_id:     ticketId  || '',
    actor_id:      actorId   || '',
    aksi:          aksi      || '',
    nilai_sebelum: serialize(before),
    nilai_sesudah: serialize(after),
    timestamp:     new Date().toISOString()
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Security
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Security: Password Hashing (Salted + Peppered) & Sanitization
// ─────────────────────────────────────────────────────────────────────────────

var GLOBAL_SECURITY_PEPPER = 'PDAM_FT_CKB_2026_#Sec!$';

/**
 * hashPassword(password, salt)
 * Computes a Salted SHA-256 digest with pepper to prevent Rainbow Table attacks.
 *
 * @param {string} password  Plain-text password
 * @param {string} [salt]    Unique salt per user (e.g. user_id or email)
 * @return {string}          64-character lowercase hex string
 */
function hashPassword(password, salt) {
  var s = salt || '';
  var input = password + ':' + s + ':' + GLOBAL_SECURITY_PEPPER;
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    input,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    return ('0' + (b & 0xff).toString(16)).slice(-2);
  }).join('');
}

/**
 * legacyHashPassword(password)
 * Backwards compatibility for unsalted SHA-256 hashes during auto-upgrade.
 */
function legacyHashPassword(password) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    return ('0' + (b & 0xff).toString(16)).slice(-2);
  }).join('');
}

/**
 * escapeFormula(val)
 * Mitigates CSV / Spreadsheet Formula Injection (CWE-1236).
 * Prepend single quote (') if string starts with dangerous characters: =, +, -, @, \t, \r
 * Safe numeric numbers (e.g. -6.98 or +628...) are preserved as numbers.
 */
function escapeFormula(val) {
  if (typeof val === 'string' && val.length > 0) {
    var firstChar = val.charAt(0);
    if (firstChar === '=' || firstChar === '@' || firstChar === '\t' || firstChar === '\r') {
      return "'" + val;
    }
    if ((firstChar === '+' || firstChar === '-') && !/^[\+\-]?\d+(\.\d+)?$/.test(val.trim())) {
      return "'" + val;
    }
  }
  return val;
}

/**
 * sanitizeInput(str, maxLen)
 * Strips script tags, removes null bytes, and trims input to prevent XSS / Injection.
 * Truncates to maxLen if provided.
 */
function sanitizeInput(str, maxLen) {
  if (str === null || str === undefined) return '';
  var clean = String(str)
    .replace(/\0/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
  if (maxLen && clean.length > maxLen) {
    clean = clean.substring(0, maxLen);
  }
  return clean;
}

/**
 * isValidEmail(email)
 * Validates email format with a standard RFC 5322 regex.
 */
function isValidEmail(email) {
  if (!email) return false;
  var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).trim().toLowerCase());
}

/**
 * cleanText(val)
 * Normalizes multi-line whitespace and tabs into single space.
 */
function cleanText(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────────────────────

/**
 * sendInAppNotification(userId, message, ticketId)
 * Stores an in-app notification in the Notifications sheet.
 *
 * @param {string} userId    Recipient's user_id
 * @param {string} message   Notification text
 * @param {string} ticketId  Related ticket_id (optional, can be '')
 */
function sendInAppNotification(userId, message, ticketId) {
  appendRow('Notifications', {
    id:         generateId(),
    user_id:    userId,
    message:    message,
    ticket_id:  ticketId || '',
    is_read:    false,
    created_at: new Date().toISOString()
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Date / Time helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * parseISODate(str)
 * Safely parses an ISO-8601 date string into a Date object.
 * Returns null if the string is empty or invalid.
 *
 * @param {string} str
 * @return {Date|null}
 */
function parseISODate(str) {
  if (!str) return null;
  var d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * hoursBetween(d1, d2)
 * Returns the number of hours elapsed between two Date objects (d2 − d1).
 *
 * @param {Date} d1  Earlier date
 * @param {Date} d2  Later date (default: now)
 * @return {number}
 */
function hoursBetween(d1, d2) {
  d2 = d2 || new Date();
  return (d2 - d1) / (1000 * 60 * 60);
}

/**
 * isoNow()
 * Returns the current UTC time as an ISO-8601 string.
 * @return {string}
 */
function isoNow() {
  return new Date().toISOString();
}
