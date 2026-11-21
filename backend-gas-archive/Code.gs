// ============================================================
// Code.gs — Main entry point: doGet, doPost, API routing
// PDAM FieldTicket
// ============================================================

// ── Response helpers ──────────────────────────────────────────
function success(data) {
  return { success: true, data: data !== undefined ? data : null };
}

function fail(errMsg) {
  return { success: false, error: errMsg || 'Terjadi kesalahan.' };
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function _sanitizeErrorMessage(msg) {
  if (!msg) return 'Terjadi kesalahan pada sistem.';
  var str = String(msg);
  // Mask internal server stack traces and Google API internal errors
  if (/Exception:|at (Code|Auth|Tickets|AdminPanel|Photos|Reports|Utils|Setup):|openById|DriveApp|SpreadsheetApp|ScriptApp/i.test(str)) {
    return 'Terjadi kendala teknis internal pada server. Silakan hubungi Administrator.';
  }
  return str;
}

// ── handleRequest — dipanggil oleh google.script.run dari frontend ──
/**
 * handleRequest(action, token, params)
 * Entry point dari sisi client menggunakan google.script.run.
 * Mengembalikan string JSON agar bisa di-parse oleh withSuccessHandler.
 */
function handleRequest(action, token, params) {
  try {
    var result = routeAction(action, token, params || {});
    return JSON.stringify(result);
  } catch (e) {
    Logger.log('handleRequest error [' + action + ']: ' + (e.stack || e.message));
    return JSON.stringify(fail(_sanitizeErrorMessage(e.message)));
  }
}

/**
 * doGet: Serve the PWA frontend HTML.
 */
function doGet(e) {
  try {
    // If administrative action requested via GET, enforce secret key protection
    if (e && e.parameter && e.parameter.action) {
      var act = e.parameter.action;
      if (['import_wilayah', 'seed_dummy_tickets', 'clear_dummy_tickets', 'import_categories', 'import_all'].indexOf(act) !== -1) {
        var key = e.parameter.key || '';
        var expectedKey = PropertiesService.getScriptProperties().getProperty('ADMIN_API_KEY') || 'pdam-cikembar-admin-secret-2026';
        if (key !== expectedKey) {
          return HtmlService.createHtmlOutput(
            '<div style="font-family:Segoe UI,sans-serif;padding:30px;text-align:center;max-width:450px;margin:50px auto;border:1px solid #FECACA;border-radius:12px;background:#FEF2F2;color:#991B1B;">' +
            '<div style="font-size:36px;margin-bottom:10px;">🔒</div>' +
            '<h3 style="margin:0 0 8px;">Akses Ditolak</h3>' +
            '<p style="font-size:14px;color:#7F1D1D;line-height:1.5;">Tindakan administratif memerlukan parameter <code>key</code> yang valid.</p>' +
            '</div>'
          );
        }
      }

      if (act === 'organize_drive') {
        var res = organizeDriveProjects();
        var filesListHtml = '';
        if (res.movedFolders && res.movedFolders.length) {
          filesListHtml += '<div style="margin-top:10px;font-weight:600;color:#1E293B;">📁 Folder yang Dipindahkan:</div><ul style="margin:5px 0 15px;padding-left:20px;color:#475569;font-size:13px;">';
          res.movedFolders.forEach(function(item) {
            filesListHtml += '<li><code>' + item.name + '</code> &rarr; <b>' + item.to + '</b></li>';
          });
          filesListHtml += '</ul>';
        }
        if (res.movedFiles && res.movedFiles.length) {
          filesListHtml += '<div style="margin-top:10px;font-weight:600;color:#1E293B;">📄 File yang Dipindahkan:</div><ul style="margin:5px 0 15px;padding-left:20px;color:#475569;font-size:13px;">';
          res.movedFiles.forEach(function(item) {
            filesListHtml += '<li><code>' + item.name + '</code> &rarr; <b>' + item.to + '</b></li>';
          });
          filesListHtml += '</ul>';
        }
        if (!res.movedFiles.length && !res.movedFolders.length) {
          filesListHtml += '<p style="color:#64748B;font-size:14px;margin:15px 0;">Semua file dan folder sudah rapi di folder project masing-masing.</p>';
        }

        var foldersLinkHtml = '<div style="background:#F1F5F9;padding:14px;border-radius:10px;text-align:left;font-size:13px;line-height:1.8;">';
        res.foldersCreated.forEach(function(f) {
          foldersLinkHtml += '<div>📁 <b><a href="' + f.url + '" target="_blank" style="color:#2563EB;text-decoration:none;">' + f.name + ' &rarr;</a></b></div>';
        });
        foldersLinkHtml += '</div>';

        return HtmlService.createHtmlOutput(
          '<div style="font-family:Segoe UI,sans-serif;padding:35px;max-width:560px;margin:40px auto;border:1px solid #CBD5E1;border-radius:16px;background:#fff;box-shadow:0 10px 25px rgba(0,0,0,0.05);">' +
          '<div style="text-align:center;">' +
          '<div style="font-size:48px;margin-bottom:10px;">✨</div>' +
          '<h2 style="color:#0F172A;margin:0 0 8px;">Google Drive Berhasil Dirapikan!</h2>' +
          '<p style="color:#64748B;font-size:14px;margin:0 0 20px;">File dan folder telah dikelompokkan ke dalam folder masing-masing project.</p>' +
          '</div>' +
          foldersLinkHtml +
          '<div style="text-align:left;margin-top:15px;">' + filesListHtml + '</div>' +
          '<div style="text-align:center;margin-top:25px;">' +
          '<a href="' + ScriptApp.getService().getUrl() + '" style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Buka FieldTicket &rarr;</a>' +
          '</div>' +
          '</div>'
        );
      }



      if (act === 'import_wilayah') {
        var n = importCikembarWilayah();
        return HtmlService.createHtmlOutput(
          '<div style="font-family:Segoe UI,sans-serif;padding:40px;text-align:center;max-width:500px;margin:50px auto;border:1px solid #E0E7EF;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);">' +
          '<div style="font-size:48px;margin-bottom:12px;">✅</div>' +
          '<h2 style="color:#2E7D32;margin:0 0 10px;">Import Berhasil!</h2>' +
          '<p style="font-size:15px;color:#37474F;line-height:1.5;">Sebanyak <b>' + n + ' Blok Wilayah Cabang Cikembar</b> (beserta kode resminya) telah berhasil dimasukkan ke Google Sheets Database!</p>' +
          '<a href="' + ScriptApp.getService().getUrl() + '" style="display:inline-block;background:#1565C0;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:20px;font-weight:600;font-size:14px;">Buka Aplikasi FieldTicket &rarr;</a>' +
          '</div>'
        );
      }

      if (act === 'seed_dummy_tickets') {
        var nDummy = seed50DummyTickets();
        return HtmlService.createHtmlOutput(
          '<div style="font-family:Segoe UI,sans-serif;padding:40px;text-align:center;max-width:520px;margin:50px auto;border:1px solid #E0E7EF;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);">' +
          '<div style="font-size:48px;margin-bottom:12px;">✅</div>' +
          '<h2 style="color:#15803D;margin:0 0 10px;">50 Data Dummy Berhasil Dibuat!</h2>' +
          '<p style="font-size:15px;color:#334155;line-height:1.6;">Sebanyak <b>' + nDummy + ' tiket demo</b> lengkap dengan koordinat GPS peta Cikembar, kategori, ukuran pipa, status, dan riwayat progress telah dimasukkan ke Database!</p>' +
          '<a href="' + ScriptApp.getService().getUrl() + '" style="display:inline-block;background:#1E6CF0;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:20px;font-weight:600;font-size:14px;">Buka Aplikasi FieldTicket &rarr;</a>' +
          '</div>'
        );
      }

      if (act === 'clear_dummy_tickets') {
        var nClear = clearDummyTickets();
        return HtmlService.createHtmlOutput(
          '<div style="font-family:Segoe UI,sans-serif;padding:40px;text-align:center;max-width:520px;margin:50px auto;border:1px solid #E0E7EF;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);">' +
          '<div style="font-size:48px;margin-bottom:12px;">🗑️</div>' +
          '<h2 style="color:#B91C1C;margin:0 0 10px;">Data Dummy Berhasil Dihapus!</h2>' +
          '<p style="font-size:15px;color:#334155;line-height:1.6;">Sebanyak <b>' + nClear + ' tiket demo</b> telah dibersihkan dari sistem.</p>' +
          '<a href="' + ScriptApp.getService().getUrl() + '" style="display:inline-block;background:#1E6CF0;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:20px;font-weight:600;font-size:14px;">Buka Aplikasi FieldTicket &rarr;</a>' +
          '</div>'
        );
      }

      if (act === 'import_categories' || act === 'import_all') {
        var nc = importCikembarCategories();
        var nw = (act === 'import_all') ? importCikembarWilayah() : 0;
        return HtmlService.createHtmlOutput(
          '<div style="font-family:Segoe UI,sans-serif;padding:40px;text-align:center;max-width:500px;margin:50px auto;border:1px solid #E0E7EF;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);">' +
          '<div style="font-size:48px;margin-bottom:12px;">✅</div>' +
          '<h2 style="color:#2E7D32;margin:0 0 10px;">Sinkronisasi Kategori Berhasil!</h2>' +
          '<p style="font-size:15px;color:#37474F;line-height:1.5;">Sebanyak <b>' + nc + ' Kategori Pengaduan Resmi Cikembar</b> ' + (nw ? 'dan <b>' + nw + ' Blok Wilayah</b> ' : '') + 'telah berhasil disinkronkan ke Database!</p>' +
          '<a href="' + ScriptApp.getService().getUrl() + '" style="display:inline-block;background:#1565C0;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:20px;font-weight:600;font-size:14px;">Buka Aplikasi FieldTicket &rarr;</a>' +
          '</div>'
        );
      }
    }

    return HtmlService.createHtmlOutputFromFile('frontend/index-combined')
      .setTitle('Field Ticket Management System - PERUMDA Tirta Jaya Mandiri Cabang Cikembar')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    Logger.log('doGet error: ' + (err.stack || err.message));
    return HtmlService.createHtmlOutput(
      '<div style="font-family:Segoe UI,sans-serif;padding:30px;text-align:center;max-width:450px;margin:50px auto;border:1px solid #CBD5E1;border-radius:12px;background:#F8FAFC;">' +
      '<div style="font-size:36px;margin-bottom:10px;">⚠️</div>' +
      '<h3 style="margin:0 0 8px;color:#0F172A;">Gagal Memuat Aplikasi</h3>' +
      '<p style="font-size:14px;color:#64748B;">Terjadi kendala saat memuat halaman aplikasi. Silakan muat ulang atau hubungi Administrator.</p>' +
      '</div>'
    );
  }
}

/**
 * doPost: Handle all API calls.
 * Expects JSON body: { action, token, ...params }
 * Returns JSON: { success, data } or { success, error }
 */
function doPost(e) {
  var result;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse(fail('Data request tidak valid.'));
    }
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var token = body.token || null;

    result = routeAction(action, token, body);
  } catch (err) {
    Logger.log('doPost error: ' + (err.stack || err.message));
    result = fail(_sanitizeErrorMessage(err.message));
  }

  return jsonResponse(result);
}

/** Route action string to the correct handler function */
function routeAction(action, token, body) {
  switch (action) {
    // ── AUTH ──────────────────────────────────────────────────
    case 'diag':
      return success({ status: 'ok', serverTime: new Date().toISOString() });
    case 'login':
      return success(login(body.email, body.password));
    case 'logout':
      logout(token);
      return success({ message: 'Logout berhasil.' });
    case 'changePassword':
      return success(changePassword(token, body.old_password, body.new_password));

    // ── TICKETS ───────────────────────────────────────────────
    case 'createTicket':
      return success(createTicket(token, body));
    case 'getTickets':
      return success(getTickets(token, body.filters || {}));
    case 'getTicketDetail':
      return success(getTicketDetail(token, body.ticket_id));
    case 'updateTicketStatus':
      return success(updateTicketStatus(token, body.ticket_id, body.new_status, body.catatan));
    case 'cancelTicket':
      return success(cancelTicket(token, body.ticket_id, body.alasan));
    case 'updateTicket':
      return success(updateTicket(token, body));
    case 'deleteTicket':
      return success(deleteTicket(token, body.ticket_id, body.alasan));
    case 'deleteTickets':
      return success(deleteTickets(token, body.ticket_ids, body.alasan));
    case 'batchUpdateTicketStatus':
      return success(batchUpdateTicketStatus(token, body.ticket_ids, body.new_status, body.catatan));
    case 'closeTickets':
      return success(closeTickets(token, body.ticket_ids, body.catatan));
    case 'resolveTickets':
      return success(resolveTickets(token, body.ticket_ids, body.catatan));
    case 'reopenTicket':
      return success(reopenTicket(token, body.ticket_id, body.catatan));
    case 'closeTicket':
      return success(closeTicket(token, body.ticket_id, body.catatan));
    case 'recordTicketPrint':
      return success(recordTicketPrint(token, body.ticket_id));

    // ── ASSIGNMENTS ───────────────────────────────────────────
    case 'assignTicket':
      return success(assignTicket(token, body.ticket_id, body.assigned_to, body.catatan));
    case 'reassignTicket':
      return success(reassignTicket(token, body.ticket_id, body.assigned_to, body.catatan));
    case 'getMyAssignments':
      return success(getMyAssignments(token));

    // ── PHOTOS ────────────────────────────────────────────────
    case 'uploadPhoto':
      return success(uploadPhoto(token, body.ticket_id, body.tipe_foto,
                                 body.base64Data, body.mimeType, body.fileName));
    case 'getTicketPhotos':
      return success(getTicketPhotos(token, body.ticket_id));
    case 'getPhotoUrl':
      return success(getPhotoUrl(token, body.photo_id));
    case 'getPhotoBase64':
      return success(getPhotoBase64(token, body.photo_id));

    // ── REPORTS ───────────────────────────────────────────────
    case 'getDashboardStats':
      return success(getDashboardStats(token));
    case 'getKpiData':
      return success(getKpiData(token, body.date_from, body.date_to));
    case 'getNotifications':
      return success(getNotifications(token));
    case 'markNotificationsRead':
      return success(markNotificationsRead(token, body.ids));
    case 'exportReport':
      return success(exportReport(token, body.filters || {}));

    // ── ADMIN PANEL ───────────────────────────────────────────
    case 'getTeknisiList':
      return success(getTeknisiList(token));
    case 'getKepalaCabangName':
      return success(getKepalaCabangName(token));
    case 'getReportTickets':
      return success(getReportTickets(token, body.filters || {}));
    case 'getUsers':
      return success(getUsers(token));
    case 'createUser':
      return success(createUser(token, body));
    case 'updateUser':
      return success(updateUser(token, body.user_id, body.updates));
    case 'resetPassword':
      return success(resetPassword(token, body.user_id, body.new_password));
    case 'getCategories':
      return success(getCategories(token));
    case 'createCategory':
      return success(createCategory(token, body));
    case 'updateCategory':
      return success(updateCategory(token, body.id, body.updates));
    case 'getWilayah':
      return success(getWilayah(token));
    case 'createWilayah':
      return success(createWilayah(token, body));
    case 'updateWilayah':
      return success(updateWilayah(token, body.id, body.updates));
    case 'seedDummyTickets':
      requireRole(token, ['admin']);
      return success({ count: seed50DummyTickets() });
    case 'clearDummyTickets':
      requireRole(token, ['admin']);
      return success({ count: clearDummyTickets() });
    case 'getBackupInfo':
      return success(getBackupInfo(token));
    case 'runManualBackup':
      return success(runManualBackup(token));
    case 'setupBackupTrigger':
      requireRole(token, ['admin']);
      return success(setupDailyBackupTrigger());

    default:
      return fail('Action tidak dikenali: ' + action);
  }
}
