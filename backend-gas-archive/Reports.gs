// ============================================================
// Reports.gs — Dashboard stats, KPI, notifications, export
// PDAM FieldTicket
// ============================================================

/**
 * Get dashboard summary stats.
 * All roles: counts by status. Filtered by user's wilayah.
 */
function getDashboardStats(token) {
  var user = requireAuth(token);
  var tickets = _getAccessibleTickets(user);

  var stats = {
    total: 0, BARU: 0, DITUGASKAN: 0, DALAM_PROSES: 0,
    MENUNGGU: 0, SELESAI_DIKERJAKAN: 0, DITUTUP: 0, DIBATALKAN: 0, overdue: 0
  };

  tickets.forEach(function(t) {
    stats.total++;
    var s = t.status || '';
    if (stats[s] !== undefined) stats[s]++;
    var sla = getSlaStatus(t);
    if (sla.overdue) stats.overdue++;
  });

  // For petugas_teknik: count their assigned tickets
  if (user.role === 'petugas_teknik') {
    stats.my_assigned = tickets.filter(function(t) {
      var assignments = findRows('Assignments', function(a) {
        return a.ticket_id === t.ticket_id && a.assigned_to === user.user_id;
      });
      return assignments.length > 0 &&
        ['DITUGASKAN','DALAM_PROSES','MENUNGGU'].indexOf(t.status) !== -1;
    }).length;
  }

  return stats;
}

/**
 * Get KPI data for admin/kaur.
 * Returns: tickets per category, per wilayah, SLA breach %, avg times, reopened count.
 */
function getKpiData(token, date_from, date_to) {
  var user = requireRole(token, ['admin', 'kaur', 'kepala_cabang']);
  var allTickets = _getAccessibleTickets(user);

  // Apply date filter
  var from = date_from ? new Date(date_from) : null;
  var to = date_to ? new Date(date_to) : null;

  var filtered = allTickets.filter(function(t) {
    if (!t.created_at) return false;
    var d = new Date(t.created_at);
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });

  // Per category
  var byCategory = {};
  var byWilayah = {};
  var categories = getCachedSheetObjects('Categories');
  var wilayahList = getCachedSheetObjects('Wilayah');

  filtered.forEach(function(t) {
    var cat = categories.find(function(c) { return c.id === t.kategori_id; });
    var catName = cat ? cat.nama : 'Tidak Diketahui';
    byCategory[catName] = (byCategory[catName] || 0) + 1;

    var wil = wilayahList.find(function(w) { return w.id === t.wilayah_id; });
    var wilName = wil ? wil.nama : 'Tidak Diketahui';
    byWilayah[wilName] = (byWilayah[wilName] || 0) + 1;
  });

  // SLA breach
  var closed = filtered.filter(function(t) {
    return t.status === 'DITUTUP' || t.status === 'SELESAI_DIKERJAKAN';
  });
  var breached = filtered.filter(function(t) {
    return getSlaStatus(t).overdue;
  }).length;
  var slaCompliancePct = filtered.length > 0
    ? Math.round((1 - breached / filtered.length) * 100)
    : 100;

  // Avg response time: BARU → DITUGASKAN (from progress logs)
  var progressAll = getCachedSheetObjects('Progress');
  var responseTimes = [];
  var completionTimes = [];

  filtered.forEach(function(t) {
    var progressRows = progressAll.filter(function(p) { return p.ticket_id === t.ticket_id; });
    var assigned = progressRows.find(function(p) { return p.status_baru === 'DITUGASKAN'; });
    var selesai = progressRows.find(function(p) {
      return p.status_baru === 'SELESAI_DIKERJAKAN' || p.status_baru === 'DITUTUP';
    });
    if (t.created_at && assigned && assigned.created_at) {
      responseTimes.push((new Date(assigned.created_at) - new Date(t.created_at)) / 3600000);
    }
    if (t.created_at && selesai && selesai.created_at) {
      completionTimes.push((new Date(selesai.created_at) - new Date(t.created_at)) / 3600000);
    }
  });

  var avgResponseHours = responseTimes.length
    ? Math.round(responseTimes.reduce(function(a,b){return a+b;},0) / responseTimes.length * 10) / 10
    : null;
  var avgCompletionHours = completionTimes.length
    ? Math.round(completionTimes.reduce(function(a,b){return a+b;},0) / completionTimes.length * 10) / 10
    : null;

  // Reopened count
  var reopenedCount = progressAll.filter(function(p) {
    return p.aksi === 'REOPEN' || p.status_baru === 'DALAM_PROSES';
  }).length;

  return {
    total: filtered.length,
    by_category: byCategory,
    by_wilayah: byWilayah,
    sla_compliance_pct: slaCompliancePct,
    sla_breached: breached,
    avg_response_hours: avgResponseHours,
    avg_completion_hours: avgCompletionHours,
    reopened_count: reopenedCount,
    closed_count: closed.length
  };
}

/** Get unread notifications for logged-in user */
function getNotifications(token) {
  var user = requireAuth(token);
  var notifs = findRows('Notifications', function(n) {
    return n.user_id === user.user_id;
  });
  notifs.sort(function(a,b) {
    return new Date(b.created_at) - new Date(a.created_at);
  });
  return notifs;
}

/** Mark notifications as read */
function markNotificationsRead(token, ids) {
  requireAuth(token);
  if (!Array.isArray(ids)) ids = [ids];
  ids.forEach(function(id) {
    updateRow('Notifications', 'id', id, { is_read: true });
  });
  return { message: 'Notifikasi ditandai sudah dibaca.' };
}

/**
 * Export report as CSV string.
 * Filtered by role/wilayah/date.
 */
function exportReport(token, filters) {
  var user = requireRole(token, ['admin', 'kaur', 'kepala_cabang']);
  filters = filters || {};
  var tickets = _getAccessibleTickets(user);

  var from = filters.date_from ? new Date(filters.date_from) : null;
  var to = filters.date_to ? new Date(filters.date_to) : null;
  if (filters.status) tickets = tickets.filter(function(t) { return t.status === filters.status; });
  if (from) tickets = tickets.filter(function(t) { return new Date(t.created_at) >= from; });
  if (to) tickets = tickets.filter(function(t) { return new Date(t.created_at) <= to; });

  var categories = sheetToObjects(getSheet('Categories'));
  var wilayahList = sheetToObjects(getSheet('Wilayah'));
  var users = sheetToObjects(getSheet('Users'));

  var headers = ['Nomor Tiket','Tanggal','Status','Prioritas','Kategori','Wilayah',
                 'Pelapor','Petugas Teknik','Deskripsi','Lat','Lng'];
  var rows = [headers.join(',')];

  var formatCsvCell = function(val) {
    if (val === null || val === undefined) return '""';
    var str = String(val);
    // Formula Injection Mitigation (CWE-1236)
    if (/^[=\+\-@\t\r]/.test(str)) {
      str = "'" + str;
    }
    return '"' + str.replace(/"/g, '""') + '"';
  };

  // Latest assignment per ticket (Assignments sheet is append-only)
  var latestAsg = {};
  sheetToObjects(getSheet('Assignments')).forEach(function(a) { latestAsg[a.ticket_id] = a; });

  tickets.forEach(function(t) {
    var cat = categories.find(function(c) { return c.id === t.kategori_id; });
    var wil = wilayahList.find(function(w) { return w.id === t.wilayah_id; });
    var pelapor = users.find(function(u) { return u.user_id === t.pelapor_id; });
    var asg = latestAsg[t.ticket_id];
    var teknisi = asg ? users.find(function(u) { return u.user_id === asg.assigned_to; }) : null;
    var row = [
      formatCsvCell(t.nomor_tiket),
      formatCsvCell(t.created_at ? t.created_at.substring(0,10) : ''),
      formatCsvCell(t.status),
      formatCsvCell(t.prioritas),
      formatCsvCell(cat ? cat.nama : ''),
      formatCsvCell(wil ? wil.nama : ''),
      formatCsvCell(pelapor ? pelapor.nama : ''),
      formatCsvCell(teknisi ? teknisi.nama : '-'),
      formatCsvCell(t.deskripsi || ''),
      formatCsvCell(t.lat || ''),
      formatCsvCell(t.lng || '')
    ];
    rows.push(row.join(','));
  });

  return { csv: rows.join('\n'), total: tickets.length };
}

/** Internal: get tickets accessible to user based on role */
function _getAccessibleTickets(user) {
  var allTickets = getCachedSheetObjects('Tickets');
  if (user.role === 'petugas_baca' || user.role === 'kas') {
    return allTickets.filter(function(t) { return t.pelapor_id === user.user_id; });
  }
  if (user.role === 'petugas_teknik') {
    var myAssignments = findRows('Assignments', function(a) {
      return a.assigned_to === user.user_id;
    });
    var myTicketIds = myAssignments.map(function(a) { return a.ticket_id; });
    return allTickets.filter(function(t) {
      return myTicketIds.indexOf(t.ticket_id) !== -1;
    });
  }
  // admin / kaur: filter by wilayah if set
  if (user.wilayah_id) {
    return allTickets.filter(function(t) { return t.wilayah_id === user.wilayah_id; });
  }
  return allTickets;
}

/**
 * getReportTickets(token, filters)
 * Admin / Kaur. Returns tickets (same filters as getTickets) enriched with
 * photo metadata (ids only) and completion timestamp, for building the
 * printable report with BEFORE / AFTER photos.
 */
function getReportTickets(token, filters) {
  requireRole(token, ['admin', 'kaur', 'kepala_cabang']);
  var list = getTickets(token, filters || {});

  var photosByTicket = {};
  getCachedSheetObjects('Photos').forEach(function(p) { // cached
    if (!photosByTicket[p.ticket_id]) photosByTicket[p.ticket_id] = [];
    photosByTicket[p.ticket_id].push({ id: p.id, tipe_foto: p.tipe_foto, created_at: p.created_at });
  });

  var doneAt = {};
  getCachedSheetObjects('Progress').forEach(function(pr) { // cached
    if (pr.status_baru === 'SELESAI_DIKERJAKAN' || pr.status_baru === 'DITUTUP') {
      doneAt[pr.ticket_id] = pr.created_at;
    }
  });

  return list.map(function(t) {
    t.photos = photosByTicket[t.ticket_id] || [];
    t.selesai_at = doneAt[t.ticket_id] || '';
    return t;
  });
}

/**
 * getKepalaCabangName(token)
 * Returns the name of the first active Kepala Cabang, used for the
 * "Mengetahui" signature block in printed reports.
 */
function getKepalaCabangName(token) {
  requireRole(token, ['admin', 'kaur', 'kepala_cabang']);
  var list = sheetToObjects(getSheet('Users')).filter(function(u) {
    return u.role === 'kepala_cabang' && (u.status_aktif === true || u.status_aktif === 'true');
  });
  return { nama: list.length ? list[0].nama : '' };
}
