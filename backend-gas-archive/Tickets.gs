/**
 * Tickets.gs
 * PDAM FieldTicket — Core ticket lifecycle management.
 *
 * Status flow:
 *   BARU → DITUGASKAN → DALAM_PROSES ⇌ MENUNGGU → SELESAI_DIKERJAKAN → DITUTUP
 *   Any → DIBATALKAN  (admin / kaur only, mandatory reason)
 *   DITUTUP / SELESAI_DIKERJAKAN → DALAM_PROSES  (kaur reopen)
 *
 * SLA hours by priority:
 *   KRITIS: 2 h | TINGGI: 6 h | SEDANG: 24 h | RENDAH: 72 h
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

var TICKET_STATUSES = {
  BARU:                'BARU',
  DITUGASKAN:          'DITUGASKAN',
  DALAM_PROSES:        'DALAM_PROSES',
  MENUNGGU:            'MENUNGGU',
  SELESAI_DIKERJAKAN:  'SELESAI_DIKERJAKAN',
  DITUTUP:             'DITUTUP',
  DIBATALKAN:          'DIBATALKAN'
};

var PRIORITAS_LIST = ['KRITIS', 'TINGGI', 'SEDANG', 'RENDAH'];

var SLA_HOURS = {
  KRITIS: 2,
  TINGGI: 6,
  SEDANG: 24,
  RENDAH: 72
};

/**
 * Allowed status transitions per role.
 * Key   = current status
 * Value = map of {role: [allowed next statuses]}
 *
 * Transitions not listed here are forbidden.
 */
var STATUS_TRANSITIONS = {
  BARU: {
    admin:          ['DITUTUP', 'SELESAI_DIKERJAKAN', 'DITUGASKAN', 'DIBATALKAN'],
    kaur:           [],
    petugas_teknik: [],
    petugas_baca:   [],
    kas:            []
  },
  DITUGASKAN: {
    admin:          ['DITUTUP', 'SELESAI_DIKERJAKAN', 'DALAM_PROSES', 'DIBATALKAN'],
    kaur:           [],
    petugas_teknik: [],
    petugas_baca:   [],
    kas:            []
  },
  DALAM_PROSES: {
    admin:          ['DITUTUP', 'SELESAI_DIKERJAKAN', 'MENUNGGU', 'DIBATALKAN'],
    kaur:           [],
    petugas_teknik: [],
    petugas_baca:   [],
    kas:            []
  },
  MENUNGGU: {
    admin:          ['DITUTUP', 'SELESAI_DIKERJAKAN', 'DALAM_PROSES', 'DIBATALKAN'],
    kaur:           [],
    petugas_teknik: [],
    petugas_baca:   [],
    kas:            []
  },
  SELESAI_DIKERJAKAN: {
    admin:          ['DITUTUP', 'BARU', 'DIBATALKAN'],
    kaur:           [],
    petugas_teknik: [],
    petugas_baca:   [],
    kas:            []
  },
  DITUTUP: {
    admin:          ['BARU'],
    kaur:           [],
    petugas_teknik: [],
    petugas_baca:   [],
    kas:            []
  },
  DIBATALKAN: {
    admin:          ['BARU'],
    kaur:           [],
    petugas_teknik: [],
    petugas_baca:   [],
    kas:            []
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Create
// ─────────────────────────────────────────────────────────────────────────────

/**
 * createTicket(token, data)
 * Creates a new field ticket.  Idempotency key prevents duplicate submissions
 * (e.g. from offline-first mobile retries).
 *
 * @param {string} token
 * @param {Object} data  {idempotency_key, pelanggan_id, kategori_id, wilayah_id,
 *                        deskripsi, lat, lng, akurasi_gps, prioritas}
 * @return {Object}  Created ticket object
 */
function createTicket(token, data) {
  var session = requireAuth(token);

  // Only petugas_baca, kas, petugas_teknik, and admin may create tickets
  if (['petugas_baca', 'kas', 'petugas_teknik', 'admin', 'kaur'].indexOf(session.role) === -1) {
    throw new Error('Peran Anda tidak diizinkan membuat tiket.');
  }

  // ── Validate required fields ─────────────────────────────────────────────
  if (!data.deskripsi)    throw new Error('Deskripsi tiket wajib diisi.');
  if (!data.kategori_id)  throw new Error('Kategori tiket wajib dipilih.');
  if (!data.wilayah_id)   throw new Error('Wilayah tiket wajib dipilih.');

  // ── Idempotency check ─────────────────────────────────────────────────────
  if (data.idempotency_key) {
    var existing = findRows('Tickets', function(t) {
      return t.idempotency_key === data.idempotency_key;
    });
    if (existing.length > 0) {
      // Return the existing ticket (idempotent response)
      return _enrichTicket(existing[0]);
    }
  }

  // Resolve priority: from data or category default
  var prioritas = data.prioritas;
  if (!prioritas && data.kategori_id) {
    var kat = findRow('Categories', function(c) { return c.id === data.kategori_id; });
    if (kat && kat.prioritas_default) {
      prioritas = kat.prioritas_default;
    }
  }
  if (!prioritas) prioritas = 'SEDANG';

  // ── Build ticket object ───────────────────────────────────────────────────
  var now = new Date();
  // Admin dapat menentukan tanggal laporan secara kustom (retroaktif / historis)
  if (session.role === 'admin' && data.custom_created_at) {
    var parsedDate = new Date(data.custom_created_at);
    if (!isNaN(parsedDate.getTime())) {
      now = parsedDate;
    }
  }

  // Validasi initial_status (hanya admin, hanya status yang diizinkan)
  var VALID_INIT = ['BARU', 'SELESAI_DIKERJAKAN', 'DITUTUP'];
  var initialStatus = (session.role === 'admin' && data.initial_status &&
    VALID_INIT.indexOf(data.initial_status) !== -1)
    ? data.initial_status : 'BARU';

  // assigned_to: petugas teknik yang akan ditugaskan
  var assignedTo = (session.role === 'admin' && data.assigned_to)
    ? String(data.assigned_to).trim() : '';

  // Jika ada teknisi dan status awal bukan BARU → mulai dari DITUGASKAN lalu advance
  // Jika ada teknisi dan status = BARU → tetap di DITUGASKAN
  var finalStatus = initialStatus;
  if (assignedTo && initialStatus === 'BARU') {
    finalStatus = TICKET_STATUSES.DITUGASKAN;
  }

  // Validate GPS coordinates
  var lat = (data.lat !== undefined && data.lat !== null && data.lat !== '') ? parseFloat(data.lat) : '';
  var lng = (data.lng !== undefined && data.lng !== null && data.lng !== '') ? parseFloat(data.lng) : '';
  if (typeof lat === 'number' && !isNaN(lat)) {
    if (lat < -90 || lat > 90) lat = '';
  } else {
    lat = '';
  }
  if (typeof lng === 'number' && !isNaN(lng)) {
    if (lng < -180 || lng > 180) lng = '';
  } else {
    lng = '';
  }

  var ticketId = generateId();
  var ticket   = {
    ticket_id:       ticketId,
    nomor_tiket:     generateTicketNumber(now),
    pelapor_id:      session.user_id,
    pelanggan_id:    sanitizeInput(data.pelanggan_id || '', 50),
    nama_pelanggan:  sanitizeInput(data.nama_pelanggan || '', 150),
    no_hp:           sanitizeInput(data.no_hp || '', 30),
    ukuran_pipa:     sanitizeInput(data.ukuran_pipa || '', 30),
    kategori_id:     data.kategori_id,
    wilayah_id:      data.wilayah_id,
    deskripsi:       sanitizeInput(data.deskripsi, 2000),
    lat:             lat,
    lng:             lng,
    akurasi_gps:     data.akurasi_gps     || '',
    prioritas:       (PRIORITAS_LIST.indexOf(prioritas) !== -1) ? prioritas : 'SEDANG',
    status:          finalStatus,
    created_at:      now.toISOString(),
    updated_at:      new Date().toISOString(),
    idempotency_key: data.idempotency_key || '',
    print_count:     0,
    last_printed_at: '',
    last_printed_by: ''
  };

  appendRow('Tickets', ticket);

  // ── Progress log: BARU ────────────────────────────────────────────────────
  var catatanBuat = 'Tiket dibuat.';
  if (data.custom_created_at && session.role === 'admin') catatanBuat += ' (Tanggal disesuaikan oleh Admin)';
  appendRow('Progress', {
    id: generateId(), ticket_id: ticketId, actor_id: session.user_id,
    status_baru: TICKET_STATUSES.BARU,
    catatan: catatanBuat, created_at: now.toISOString()
  });

  // ── Jika ada penugasan teknisi ─────────────────────────────────────────────
  if (assignedTo) {
    appendRow('Assignments', {
      id:          generateId(),
      ticket_id:   ticketId,
      assigned_by: session.user_id,
      assigned_to: assignedTo,
      assigned_at: now.toISOString(),
      catatan:     'Ditugaskan saat pembuatan tiket oleh Admin.'
    });
    if (finalStatus !== TICKET_STATUSES.BARU) {
      appendRow('Progress', {
        id: generateId(), ticket_id: ticketId, actor_id: session.user_id,
        status_baru: TICKET_STATUSES.DITUGASKAN,
        catatan: 'Langsung ditugaskan oleh Admin.', created_at: now.toISOString()
      });
    }
    // Notifikasi ke teknisi
    try {
      appendRow('Notifications', {
        id: generateId(), user_id: assignedTo,
        message: 'Anda ditugaskan ke tiket ' + ticket.nomor_tiket + ' oleh Admin.',
        ticket_id: ticketId, is_read: false, created_at: now.toISOString()
      });
    } catch(e) {}
  }

  // ── Advance ke status akhir jika bukan BARU / DITUGASKAN ─────────────────
  if (finalStatus === TICKET_STATUSES.SELESAI_DIKERJAKAN ||
      finalStatus === TICKET_STATUSES.DITUTUP) {
    // Log DALAM_PROSES → SELESAI_DIKERJAKAN (atau langsung DITUTUP)
    if (assignedTo) {
      appendRow('Progress', {
        id: generateId(), ticket_id: ticketId, actor_id: session.user_id,
        status_baru: TICKET_STATUSES.DALAM_PROSES,
        catatan: 'Pekerjaan dimulai (dicatat oleh Admin).', created_at: now.toISOString()
      });
    }
    appendRow('Progress', {
      id: generateId(), ticket_id: ticketId, actor_id: session.user_id,
      status_baru: finalStatus,
      catatan: (finalStatus === TICKET_STATUSES.DITUTUP
        ? 'Tiket ditutup langsung oleh Admin (laporan historis).'
        : 'Pekerjaan selesai dicatat oleh Admin (laporan historis).'),
      created_at: now.toISOString()
    });
  }

  addAuditLog(ticketId, session.user_id, 'CREATE_TICKET', null, ticket);

  return _enrichTicket(ticket);
}


// ─────────────────────────────────────────────────────────────────────────────
// List / Search
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getTickets(token, filters)
 * Returns a filtered list of tickets, applying role-based visibility rules:
 *  - petugas_baca:   sees only their own tickets (pelapor_id)
 *  - petugas_teknik: sees only tickets assigned to them
 *  - admin / kaur:   sees all tickets in their wilayah (or all if wilayah_id is empty)
 *
 * @param {string} token
 * @param {Object} filters  {status, kategori_id, wilayah_id, prioritas, pelapor_id,
 *                           assigned_to, search, date_from, date_to}
 * @return {Object[]}
 */
function getTickets(token, filters) {
  var session = requireAuth(token);
  filters = filters || {};

  var tickets = findRows('Tickets', function() { return true; });

  // ── Role-based base filter ────────────────────────────────────────────────
  if (session.role === 'petugas_baca' || session.role === 'kas') {
    tickets = tickets.filter(function(t) { return t.pelapor_id === session.user_id; });

  } else if (session.role === 'petugas_teknik') {
    // Only tickets whose LATEST assignment is this technician
    var latestMap = _latestAssignMap();
    tickets = tickets.filter(function(t) {
      var a = latestMap[t.ticket_id];
      return a && a.assigned_to === session.user_id;
    });

  } else {
    // admin / kaur: filter by their wilayah unless they have none
    if (session.wilayah_id) {
      tickets = tickets.filter(function(t) {
        return t.wilayah_id === session.wilayah_id;
      });
    }
  }

  // ── Additional optional filters ───────────────────────────────────────────
  if (filters.status) {
    tickets = tickets.filter(function(t) { return t.status === filters.status; });
  }
  if (filters.kategori_id) {
    tickets = tickets.filter(function(t) { return t.kategori_id === filters.kategori_id; });
  }
  if (filters.wilayah_id) {
    tickets = tickets.filter(function(t) { return t.wilayah_id === filters.wilayah_id; });
  }
  if (filters.prioritas) {
    tickets = tickets.filter(function(t) { return t.prioritas === filters.prioritas; });
  }
  if (filters.print_status === 'unprinted') {
    tickets = tickets.filter(function(t) { return !t.print_count || parseInt(t.print_count, 10) === 0; });
  } else if (filters.print_status === 'printed') {
    tickets = tickets.filter(function(t) { return t.print_count && parseInt(t.print_count, 10) > 0; });
  }
  if (filters.pelapor_id) {
    tickets = tickets.filter(function(t) { return t.pelapor_id === filters.pelapor_id; });
  }
  if (filters.assigned_to) {
    var lm2 = _latestAssignMap();
    tickets = tickets.filter(function(t) {
      var a = lm2[t.ticket_id];
      return a && a.assigned_to === filters.assigned_to;
    });
  }
  if (filters.search) {
    var q = String(filters.search).toLowerCase();
    tickets = tickets.filter(function(t) {
      return String(t.nomor_tiket || '').toLowerCase().indexOf(q) !== -1 ||
             String(t.deskripsi || '').toLowerCase().indexOf(q) !== -1 ||
             String(t.pelanggan_id || '').toLowerCase().indexOf(q) !== -1 ||
             String(t.nama_pelanggan || '').toLowerCase().indexOf(q) !== -1 ||
             String(t.no_hp || '').toLowerCase().indexOf(q) !== -1 ||
             String(t.ukuran_pipa || '').toLowerCase().indexOf(q) !== -1;
    });
  }
  if (filters.date_from) {
    var df = parseISODate(filters.date_from);
    if (df) tickets = tickets.filter(function(t) { return new Date(t.created_at) >= df; });
  }
  if (filters.date_to) {
    var dt = parseISODate(filters.date_to);
    if (dt) {
      dt.setHours(23, 59, 59, 999);
      tickets = tickets.filter(function(t) { return new Date(t.created_at) <= dt; });
    }
  }

  // Sort newest first
  tickets.sort(function(a, b) { return new Date(b.created_at) - new Date(a.created_at); });

  return tickets.map(function(t) { return _enrichTicket(t); });
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getTicketDetail(token, ticket_id)
 * Returns a full ticket detail object including assignments, progress history,
 * photos metadata, and (for admin/kaur) the audit log.
 *
 * @param {string} token
 * @param {string} ticket_id
 * @return {Object}
 */
function getTicketDetail(token, ticket_id) {
  var session = requireAuth(token);

  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var ticket = tickets[0];

  // ── Access control ────────────────────────────────────────────────────────
  _assertTicketAccess(session, ticket);

  // ── Enrich with related data ──────────────────────────────────────────────
  var detail = _enrichTicket(ticket);

  detail.assignments = findRows('Assignments', function(a) {
    return a.ticket_id === ticket_id;
  });

  detail.progress = findRows('Progress', function(p) {
    return p.ticket_id === ticket_id;
  }).sort(function(a, b) { return new Date(a.created_at) - new Date(b.created_at); });

  detail.photos = findRows('Photos', function(p) {
    return p.ticket_id === ticket_id;
  }).map(function(p) {
    return {
      id:           p.id,
      tipe_foto:    p.tipe_foto,
      drive_file_id: p.drive_file_id,
      uploader_id:  p.uploader_id,
      created_at:   p.created_at,
      // Provide the Drive view URL (no binary data)
      url: 'https://drive.google.com/file/d/' + p.drive_file_id + '/view'
    };
  });

  // Audit log: visible to admin and kaur only
  if (session.role === 'admin' || session.role === 'kaur' || session.role === 'kepala_cabang') {
    detail.audit_log = findRows('Audit_Log', function(a) {
      return a.ticket_id === ticket_id;
    }).sort(function(a, b) { return new Date(a.timestamp) - new Date(b.timestamp); });
  }

  return detail;
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Updates
// ─────────────────────────────────────────────────────────────────────────────

/**
 * updateTicketStatus(token, ticket_id, new_status, catatan, foto_required)
 * Transitions a ticket to a new status after validating the transition is
 * permitted for the current user's role.
 *
 * Special rule: transitioning to SELESAI_DIKERJAKAN requires at least one
 * SESUDAH photo to be already uploaded.
 *
 * @param {string}  token
 * @param {string}  ticket_id
 * @param {string}  new_status   One of TICKET_STATUSES
 * @param {string}  catatan      Optional note
 * @param {boolean} foto_required  (Unused parameter kept for API compatibility)
 * @return {Object}  Updated ticket
 */
function updateTicketStatus(token, ticket_id, new_status, catatan, foto_required) {
  var session = requireAuth(token);
  if (!ticket_id)  throw new Error('ticket_id wajib diisi.');
  if (!new_status) throw new Error('Status baru wajib diisi.');

  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var ticket = tickets[0];

  _assertTicketAccess(session, ticket);

  // ── Validate transition ───────────────────────────────────────────────────
  var currentStatus = ticket.status;
  var allowedForRole = (STATUS_TRANSITIONS[currentStatus] || {})[session.role] || [];
  if (allowedForRole.indexOf(new_status) === -1) {
    throw new Error(
      'Transisi status dari "' + currentStatus + '" ke "' + new_status +
      '" tidak diizinkan untuk peran "' + session.role + '".'
    );
  }

  // ── Photo requirement for SELESAI_DIKERJAKAN (skipped for admin) ──────────
  if (new_status === TICKET_STATUSES.SELESAI_DIKERJAKAN && session.role !== 'admin') {
    var sesudahPhotos = findRows('Photos', function(p) {
      return p.ticket_id === ticket_id && p.tipe_foto === 'SESUDAH';
    });
    if (sesudahPhotos.length === 0) {
      throw new Error(
        'Foto SESUDAH wajib diunggah sebelum menandai tiket sebagai SELESAI_DIKERJAKAN.'
      );
    }
  }

  var now = new Date();
  var before = { status: currentStatus };
  var after  = { status: new_status };

  // ── Persist status change ─────────────────────────────────────────────────
  updateRow('Tickets', 'ticket_id', ticket_id, {
    status:     new_status,
    updated_at: now.toISOString()
  });

  catatan = sanitizeInput(catatan || '', 1000);

  // Progress log entry
  appendRow('Progress', {
    id:          generateId(),
    ticket_id:   ticket_id,
    actor_id:    session.user_id,
    status_baru: new_status,
    catatan:     catatan,
    created_at:  now.toISOString()
  });

  addAuditLog(ticket_id, session.user_id, 'UPDATE_STATUS', before, after);

  // Return refreshed ticket
  var updated = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  return _enrichTicket(updated[0]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Cancel / Reopen / Close  (convenience wrappers with extra validation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * cancelTicket(token, ticket_id, alasan)
 * Cancels a ticket.  Admin / Kaur only.  Reason is mandatory.
 *
 * @param {string} token
 * @param {string} ticket_id
 * @param {string} alasan  Mandatory cancellation reason
 * @return {Object}  Updated ticket
 */
function cancelTicket(token, ticket_id, alasan) {
  requireRole(token, ['admin', 'kaur']);
  alasan = sanitizeInput(alasan || '', 1000);
  if (!alasan) {
    throw new Error('Alasan pembatalan wajib diisi.');
  }

  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var ticket = tickets[0];

  if (ticket.status === TICKET_STATUSES.DITUTUP) {
    throw new Error('Tiket yang sudah DITUTUP tidak dapat dibatalkan.');
  }
  if (ticket.status === TICKET_STATUSES.DIBATALKAN) {
    throw new Error('Tiket sudah berstatus DIBATALKAN.');
  }

  var session = getSession(token);
  var now     = new Date();
  var before  = { status: ticket.status };

  updateRow('Tickets', 'ticket_id', ticket_id, {
    status:     TICKET_STATUSES.DIBATALKAN,
    updated_at: now.toISOString()
  });

  appendRow('Progress', {
    id:          generateId(),
    ticket_id:   ticket_id,
    actor_id:    session.user_id,
    status_baru: TICKET_STATUSES.DIBATALKAN,
    catatan:     'Alasan: ' + alasan,
    created_at:  now.toISOString()
  });

  addAuditLog(ticket_id, session.user_id, 'CANCEL_TICKET', before, {
    status: TICKET_STATUSES.DIBATALKAN, alasan: alasan
  });

  var updated = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  return _enrichTicket(updated[0]);
}

/**
 * reopenTicket(token, ticket_id, catatan)
 * Reopens a DITUTUP or SELESAI_DIKERJAKAN ticket back to DALAM_PROSES.
 * Kaur only.
 *
 * @param {string} token
 * @param {string} ticket_id
 * @param {string} catatan  Reason for reopening
 * @return {Object}  Updated ticket
 */
function reopenTicket(token, ticket_id, catatan) {
  var session = requireRole(token, ['admin', 'kaur']);

  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var ticket = tickets[0];

  if (ticket.status !== TICKET_STATUSES.DITUTUP && ticket.status !== TICKET_STATUSES.DIBATALKAN && ticket.status !== TICKET_STATUSES.SELESAI_DIKERJAKAN) {
    throw new Error('Hanya tiket yang ditutup/dibatalkan yang dapat dibuka kembali.');
  }

  var now    = new Date();
  var before = { status: ticket.status };

  updateRow('Tickets', 'ticket_id', ticket_id, {
    status:     TICKET_STATUSES.BARU,
    updated_at: now.toISOString()
  });

  catatan = sanitizeInput(catatan || 'Tiket dibuka kembali oleh Admin.', 1000);

  appendRow('Progress', {
    id:          generateId(),
    ticket_id:   ticket_id,
    actor_id:    session.user_id,
    status_baru: TICKET_STATUSES.BARU,
    catatan:     catatan,
    created_at:  now.toISOString()
  });

  addAuditLog(ticket_id, session.user_id, 'REOPEN_TICKET', before, {
    status: TICKET_STATUSES.BARU
  });

  var updated = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  return _enrichTicket(updated[0]);
}

/**
 * closeTicket(token, ticket_id, catatan)
 * Closes an active ticket upon physical work completion.
 * Performed directly by Admin based on physical reporting from Kaur / technicians.
 *
 * @param {string} token
 * @param {string} ticket_id
 * @param {string} catatan
 * @return {Object}  Updated ticket
 */
function closeTicket(token, ticket_id, catatan) {
  var session = requireRole(token, ['admin']);

  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var ticket = tickets[0];

  if (ticket.status === TICKET_STATUSES.DITUTUP) {
    throw new Error('Tiket sudah berstatus DITUTUP.');
  }

  var now    = new Date();
  var before = { status: ticket.status };

  updateRow('Tickets', 'ticket_id', ticket_id, {
    status:     TICKET_STATUSES.DITUTUP,
    updated_at: now.toISOString()
  });

  catatan = sanitizeInput(catatan || 'Pekerjaan fisik telah selesai dan tiket ditutup oleh Admin.', 1000);

  appendRow('Progress', {
    id:          generateId(),
    ticket_id:   ticket_id,
    actor_id:    session.user_id,
    status_baru: TICKET_STATUSES.DITUTUP,
    catatan:     catatan,
    created_at:  now.toISOString()
  });

  addAuditLog(ticket_id, session.user_id, 'CLOSE_TICKET', before, {
    status: TICKET_STATUSES.DITUTUP
  });

  var updated = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  return _enrichTicket(updated[0]);
}

/**
 * recordTicketPrint(token, ticket_id)
 * Mencatat riwayat cetak tiket / SPK agar tidak terjadi cetak ganda.
 * Menambah print_count dan memperbarui last_printed_at serta last_printed_by.
 */
function recordTicketPrint(token, ticket_id) {
  var session = requireAuth(token);
  if (!ticket_id) throw new Error('ticket_id wajib diisi.');

  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var t = tickets[0];

  var currentCount = parseInt(t.print_count || '0', 10);
  var newCount = currentCount + 1;
  var nowIso = new Date().toISOString();
  var printedBy = session.nama || session.email || session.user_id;

  updateRow('Tickets', 'ticket_id', ticket_id, {
    print_count: newCount,
    last_printed_at: nowIso,
    last_printed_by: printedBy
  });

  addAuditLog(ticket_id, session.user_id, 'PRINT_TICKET', { print_count: currentCount }, {
    print_count: newCount,
    last_printed_at: nowIso,
    last_printed_by: printedBy
  });

  return {
    ticket_id: ticket_id,
    print_count: newCount,
    last_printed_at: nowIso,
    last_printed_by: printedBy
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SLA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getSlaStatus(ticket)
 * Calculates the SLA status for a given ticket object.
 *
 * @param {Object} ticket  Ticket row object (must have created_at and prioritas)
 * @return {{overdue: boolean, hours_elapsed: number, sla_hours: number}}
 */
function getSlaStatus(ticket) {
  // Fitur SLA telah dinonaktifkan sesuai permintaan operasional
  return {
    overdue:       false,
    hours_elapsed: 0,
    sla_hours:     0
  };
}

// -----------------------------------------------------------------------------
// Private helpers
// -----------------------------------------------------------------------------

/**
 * Per-execution lookup cache (categories, wilayah, users, latest assignment).
 * Google Apps Script globals are re-initialised on every execution, so this
 * cache only lives for the duration of one request.
 */
var _LK = null;

function _getLookups() {
  if (_LK) return _LK;
  var cats = {}, wils = {}, users = {}, latest = {}, photosByTicket = {};
  getCachedSheetObjects('Categories').forEach(function(c) { cats[c.id] = c; });
  getCachedSheetObjects('Wilayah').forEach(function(w) { wils[w.id] = w; });
  getCachedSheetObjects('Users').forEach(function(u) { users[u.user_id] = u; });
  // Assignments sheet is append-only, so the last row per ticket is the latest.
  getCachedSheetObjects('Assignments').forEach(function(a) { latest[a.ticket_id] = a; });
  // Photos per ticket (for reports and list views)
  getCachedSheetObjects('Photos').forEach(function(p) {
    if (!photosByTicket[p.ticket_id]) photosByTicket[p.ticket_id] = [];
    photosByTicket[p.ticket_id].push({
      id: p.id,
      tipe_foto: p.tipe_foto,
      drive_file_id: p.drive_file_id,
      created_at: p.created_at
    });
  });
  _LK = { cats: cats, wils: wils, users: users, latest: latest, photos: photosByTicket };
  return _LK;
}

/** Map of ticket_id -> latest assignment row. */
function _latestAssignMap() {
  return _getLookups().latest;
}

/**
 * Augment a raw ticket object with joined names, the current technician
 * and the computed SLA status. Removes the internal _rowIndex field.
 */
function _enrichTicket(ticket) {
  var lk = _getLookups();
  var enriched = JSON.parse(JSON.stringify(ticket));
  delete enriched._rowIndex;

  var kat = lk.cats[enriched.kategori_id];
  enriched.kategori_nama = kat ? kat.nama : (enriched.kategori_id || '-');

  var wil = lk.wils[enriched.wilayah_id];
  enriched.wilayah_nama = wil ? wil.nama : (enriched.wilayah_id || '-');

  var usr = lk.users[enriched.pelapor_id];
  enriched.pelapor_nama = usr ? usr.nama : (enriched.pelapor_id || '-');

  var asg = lk.latest[enriched.ticket_id];
  if (asg) {
    var tech = lk.users[asg.assigned_to];
    enriched.assigned_to = asg.assigned_to;
    enriched.assigned_to_nama = tech ? tech.nama : asg.assigned_to;
  } else {
    enriched.assigned_to = '';
    enriched.assigned_to_nama = '';
  }

  enriched.sla = getSlaStatus(enriched);
  enriched.photos = (lk.photos && lk.photos[enriched.ticket_id]) || [];
  enriched.print_count = parseInt(ticket.print_count || '0', 10);
  enriched.last_printed_at = ticket.last_printed_at || '';
  enriched.last_printed_by = ticket.last_printed_by || '';
  return enriched;
}

/**
 * Assert that the current session user may access the given ticket.
 * Throws if access is denied.
 */
function _assertTicketAccess(session, ticket) {
  if (session.role === 'admin' || session.role === 'kaur' || session.role === 'kepala_cabang') {
    if (session.wilayah_id && ticket.wilayah_id !== session.wilayah_id) {
      throw new Error('Akses ditolak: tiket ini berada di luar wilayah Anda.');
    }
    return;
  }
  if (session.role === 'petugas_baca' || session.role === 'kas') {
    if (ticket.pelapor_id !== session.user_id) {
      throw new Error('Akses ditolak: Anda hanya dapat melihat tiket yang Anda buat.');
    }
    return;
  }
  if (session.role === 'petugas_teknik') {
    var asg = _latestAssignMap()[ticket.ticket_id];
    if (!asg || asg.assigned_to !== session.user_id) {
      throw new Error('Akses ditolak: tiket ini tidak ditugaskan kepada Anda.');
    }
    return;
  }
  throw new Error('Peran tidak dikenali.');
}


// -----------------------------------------------------------------------------
// Update / Edit Ticket (Admin only)
// -----------------------------------------------------------------------------

/**
 * updateTicket(token, data)
 * Allows Admin to edit any ticket details:
 * - pelanggan_id, nama_pelanggan, no_hp, ukuran_pipa
 * - kategori_id, wilayah_id, deskripsi, prioritas
 * - status (with automated progress log)
 * - created_at (custom retroactive date)
 * - assigned_to (assign or change technician)
 *
 * @param {string} token
 * @param {Object} data
 * @return {Object} Enriched updated ticket
 */
function updateTicket(token, data) {
  var session = requireRole(token, ['admin']);
  if (!data || !data.ticket_id) {
    throw new Error('ticket_id wajib diisi.');
  }

  var ticketId = data.ticket_id;
  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticketId; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var oldTicket = tickets[0];

  var now = new Date();
  var updates = { updated_at: now.toISOString() };

  if (data.pelanggan_id !== undefined) updates.pelanggan_id = sanitizeInput(data.pelanggan_id || '', 50);
  if (data.nama_pelanggan !== undefined) updates.nama_pelanggan = sanitizeInput(data.nama_pelanggan || '', 150);
  if (data.no_hp !== undefined) updates.no_hp = sanitizeInput(data.no_hp || '', 30);
  if (data.ukuran_pipa !== undefined) updates.ukuran_pipa = sanitizeInput(data.ukuran_pipa || '', 30);
  if (data.deskripsi !== undefined) updates.deskripsi = sanitizeInput(data.deskripsi || '', 2000);
  if (data.kategori_id !== undefined && data.kategori_id) updates.kategori_id = data.kategori_id;
  if (data.wilayah_id !== undefined && data.wilayah_id) updates.wilayah_id = data.wilayah_id;

  if (data.prioritas !== undefined && data.prioritas) {
    if (PRIORITAS_LIST.indexOf(data.prioritas) !== -1) {
      updates.prioritas = data.prioritas;
    }
  }

  // Tanggal kustom jika diubah
  if (data.created_at) {
    var pDate = new Date(data.created_at);
    if (!isNaN(pDate.getTime())) {
      updates.created_at = pDate.toISOString();
    }
  }

  // Status tiket jika diubah
  var statusChanged = false;
  var oldStatus = oldTicket.status;
  if (data.status && data.status !== oldStatus) {
    if (Object.values(TICKET_STATUSES).indexOf(data.status) !== -1) {
      updates.status = data.status;
      statusChanged = true;
    }
  }

  // Update sheet Tickets
  updateRow('Tickets', 'ticket_id', ticketId, updates);

  // Catat Progress log jika ada perubahan status atau catatan edit
  if (statusChanged) {
    var catatanStatus = data.catatan_edit
      ? ('Status diubah menjadi ' + updates.status + ' oleh Admin. Catatan: ' + data.catatan_edit)
      : ('Status tiket diubah menjadi ' + updates.status + ' oleh Admin.');
    appendRow('Progress', {
      id: generateId(),
      ticket_id: ticketId,
      actor_id: session.user_id,
      status_baru: updates.status,
      catatan: catatanStatus,
      created_at: now.toISOString()
    });
  } else if (data.catatan_edit) {
    appendRow('Progress', {
      id: generateId(),
      ticket_id: ticketId,
      actor_id: session.user_id,
      status_baru: updates.status || oldStatus,
      catatan: 'Data tiket diedit oleh Admin: ' + data.catatan_edit,
      created_at: now.toISOString()
    });
  }

  // Penugasan teknisi jika diubah
  if (data.assigned_to !== undefined && String(data.assigned_to).trim() !== '') {
    var newTech = String(data.assigned_to).trim();
    var latestMap = _latestAssignMap();
    var currentAsg = latestMap[ticketId];
    if (!currentAsg || currentAsg.assigned_to !== newTech) {
      appendRow('Assignments', {
        id: generateId(),
        ticket_id: ticketId,
        assigned_by: session.user_id,
        assigned_to: newTech,
        assigned_at: now.toISOString(),
        catatan: 'Penugasan diperbarui saat edit tiket oleh Admin.'
      });
      // Notifikasi ke teknisi
      try {
        appendRow('Notifications', {
          id: generateId(),
          user_id: newTech,
          message: 'Anda ditugaskan ke tiket ' + (oldTicket.nomor_tiket || ticketId) + ' oleh Admin.',
          ticket_id: ticketId,
          is_read: false,
          created_at: now.toISOString()
        });
      } catch(e) {}
    }
  }

  // Audit Log
  addAuditLog(ticketId, session.user_id, 'UPDATE_TICKET', oldTicket, updates);

  // Reset cache lookup agar data terbaru langsung terbaca
  _LK = null;
  var updatedList = findRows('Tickets', function(t) { return t.ticket_id === ticketId; });
  return _enrichTicket(updatedList[0]);
}

// -----------------------------------------------------------------------------
// Delete (Admin only)
// -----------------------------------------------------------------------------

/**
 * deleteTicket(token, ticket_id, alasan)
 * Permanently deletes a ticket and all related rows (Assignments, Progress,
 * Photos, Notifications). Photo files in Drive are moved to Trash.
 * Admin only. A DELETE_TICKET entry (with a snapshot of the ticket) is kept in
 * Audit_Log so the deletion is always traceable.
 */
function deleteTicket(token, ticket_id, alasan) {
  var session = requireRole(token, ['admin']);
  if (!ticket_id) throw new Error('ticket_id wajib diisi.');

  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var ticket = tickets[0];
  _assertTicketAccess(session, ticket);

  // Move photo files to Drive trash (ignore files that are already gone)
  findRows('Photos', function(p) { return p.ticket_id === ticket_id; }).forEach(function(p) {
    try { DriveApp.getFileById(p.drive_file_id).setTrashed(true); } catch (e) {}
  });

  var snapshot = JSON.parse(JSON.stringify(ticket));
  delete snapshot._rowIndex;

  // Audit first, so the trace survives even if a later step fails
  addAuditLog(ticket_id, session.user_id, 'DELETE_TICKET', snapshot,
              { deleted: true, alasan: alasan || '' });

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    _deleteRowsWhere('Photos', 'ticket_id', ticket_id);
    _deleteRowsWhere('Progress', 'ticket_id', ticket_id);
    _deleteRowsWhere('Assignments', 'ticket_id', ticket_id);
    try { _deleteRowsWhere('Notifications', 'ticket_id', ticket_id); } catch (e) {}
    _deleteRowsWhere('Tickets', 'ticket_id', ticket_id);
  } finally {
    lock.releaseLock();
  }
  return { deleted: true, ticket_id: ticket_id, nomor_tiket: ticket.nomor_tiket };
}

/**
 * deleteTickets(token, ticket_ids, alasan)
 * Bulk deletes multiple tickets. Admin only.
 */
function deleteTickets(token, ticket_ids, alasan) {
  var session = requireRole(token, ['admin']);
  if (!ticket_ids || !ticket_ids.length) throw new Error('Daftar ticket_ids wajib diisi.');
  var count = 0;
  for (var i = 0; i < ticket_ids.length; i++) {
    try {
      deleteTicket(token, ticket_ids[i], alasan || 'Hapus massal oleh admin');
      count++;
    } catch (e) {
      Logger.log('Gagal hapus tiket ' + ticket_ids[i] + ': ' + e.message);
    }
  }
  return { deleted_count: count, total_requested: ticket_ids.length };
}

/**
 * batchUpdateTicketStatus(token, ticket_ids, new_status, catatan)
 * Bulk transitions multiple tickets to SELESAI_DIKERJAKAN or DITUTUP.
 * Highly optimized with 1 batch read & 1 batch write across Tickets, Progress & Audit_Log.
 * Admin & Kaur.
 */
function batchUpdateTicketStatus(token, ticket_ids, new_status, catatan) {
  var session = requireRole(token, ['admin', 'kaur']);
  if (!ticket_ids || !ticket_ids.length) throw new Error('Daftar tiket wajib dipilih.');
  if (new_status !== TICKET_STATUSES.SELESAI_DIKERJAKAN && new_status !== TICKET_STATUSES.DITUTUP) {
    throw new Error('Status batch hanya mendukung SELESAI_DIKERJAKAN atau DITUTUP.');
  }

  catatan = sanitizeInput(catatan || (new_status === TICKET_STATUSES.DITUTUP ? 'Tiket ditutup secara bersamaan.' : 'Pekerjaan selesai secara bersamaan.'), 1000);

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) throw new Error('Sistem sedang sibuk. Silakan coba beberapa saat lagi.');

  var updatedCount = 0;
  try {
    var sheet = getSheet('Tickets');
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return { updated_count: 0, total_requested: ticket_ids.length };

    var headers = data[0].map(function(h) { return String(h).trim(); });
    var idCol = headers.indexOf('ticket_id');
    var statusCol = headers.indexOf('status');
    var updatedCol = headers.indexOf('updated_at');

    if (idCol === -1 || statusCol === -1) throw new Error('Kolom ticket_id/status tidak ditemukan.');

    var idSet = {};
    for (var k = 0; k < ticket_ids.length; k++) {
      idSet[String(ticket_ids[k])] = true;
    }

    var nowIso = new Date().toISOString();
    var progressEntries = [];
    var auditEntries = [];

    for (var r = 1; r < data.length; r++) {
      var rowId = String(data[r][idCol]);
      if (idSet[rowId]) {
        var oldStatus = String(data[r][statusCol]);
        // Jangan ubah jika sudah sama dengan new_status
        if (oldStatus === new_status) continue;
        // Jangan tutup/selesaikan tiket yang sudah dibatalkan
        if (oldStatus === TICKET_STATUSES.DIBATALKAN) continue;
        // Jangan downgrade dari DITUTUP ke SELESAI_DIKERJAKAN
        if (oldStatus === TICKET_STATUSES.DITUTUP && new_status === TICKET_STATUSES.SELESAI_DIKERJAKAN) continue;

        data[r][statusCol] = new_status;
        if (updatedCol !== -1) data[r][updatedCol] = nowIso;
        updatedCount++;

        progressEntries.push({
          id: generateId(),
          ticket_id: rowId,
          actor_id: session.user_id,
          status_baru: new_status,
          catatan: catatan,
          created_at: nowIso
        });

        auditEntries.push({
          id: generateId(),
          ticket_id: rowId,
          actor_id: session.user_id,
          aksi: (new_status === TICKET_STATUSES.DITUTUP ? 'CLOSE_TICKET_BULK' : 'RESOLVE_TICKET_BULK'),
          nilai_sebelum: JSON.stringify({ status: oldStatus }),
          nilai_sesudah: JSON.stringify({ status: new_status, catatan: catatan }),
          timestamp: nowIso
        });
      }
    }

    if (updatedCount > 0) {
      // 1. Tulis perubahan status tiket sekaligus (1 batch write)
      sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
      clearSheetCache('Tickets');

      // 2. Tulis entri Progress secara batch
      if (progressEntries.length > 0) {
        var pSheet = getSheet('Progress');
        var pHeaders = pSheet.getRange(1, 1, 1, pSheet.getLastColumn()).getValues()[0];
        var pRows = progressEntries.map(function(obj) {
          return pHeaders.map(function(h) {
            var val = obj[h];
            if (val === undefined || val === null) return '';
            return escapeFormula(val);
          });
        });
        pSheet.getRange(pSheet.getLastRow() + 1, 1, pRows.length, pHeaders.length).setValues(pRows);
        clearSheetCache('Progress');
      }

      // 3. Tulis entri Audit Log secara batch
      if (auditEntries.length > 0) {
        var aSheet = getSheet('Audit_Log');
        var aHeaders = aSheet.getRange(1, 1, 1, aSheet.getLastColumn()).getValues()[0];
        var aRows = auditEntries.map(function(obj) {
          return aHeaders.map(function(h) {
            var val = obj[h];
            if (val === undefined || val === null) return '';
            return escapeFormula(val);
          });
        });
        aSheet.getRange(aSheet.getLastRow() + 1, 1, aRows.length, aHeaders.length).setValues(aRows);
        clearSheetCache('Audit_Log');
      }
    }
  } finally {
    lock.releaseLock();
  }

  return {
    updated_count: updatedCount,
    total_requested: ticket_ids.length,
    new_status: new_status
  };
}

/**
 * closeTickets(token, ticket_ids, catatan)
 * Bulk closes tickets directly to DITUTUP.
 */
function closeTickets(token, ticket_ids, catatan) {
  return batchUpdateTicketStatus(token, ticket_ids, TICKET_STATUSES.DITUTUP, catatan);
}

/**
 * resolveTickets(token, ticket_ids, catatan)
 * Bulk marks tickets as SELESAI_DIKERJAKAN.
 */
function resolveTickets(token, ticket_ids, catatan) {
  return batchUpdateTicketStatus(token, ticket_ids, TICKET_STATUSES.SELESAI_DIKERJAKAN, catatan);
}

/** Delete every row of a sheet whose `field` equals `value` (bottom-up). */
function _deleteRowsWhere(sheetName, field, value) {
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return 0;
  var col = data[0].indexOf(field);
  if (col === -1) return 0;
  var n = 0;
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][col]) === String(value)) { sheet.deleteRow(i + 1); n++; }
  }
  if (n > 0) clearSheetCache(sheetName);
  return n;
}
