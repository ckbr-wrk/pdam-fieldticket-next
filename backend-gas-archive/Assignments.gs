/**
 * Assignments.gs
 * PDAM FieldTicket — Ticket assignment management.
 *
 * Admin and Kaur can assign / reassign tickets to technicians.
 * Technicians can view their own assignment queue.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Assign
// ─────────────────────────────────────────────────────────────────────────────

/**
 * assignTicket(token, ticket_id, assigned_to, catatan)
 * Assigns a BARU or DITUGASKAN ticket to a technician.
 * Transitions the ticket status to DITUGASKAN.
 * Sends an in-app notification to the assigned technician.
 *
 * @param {string} token
 * @param {string} ticket_id
 * @param {string} assigned_to  user_id of the technician to assign
 * @param {string} catatan      Optional note for the assignment
 * @return {Object}  Assignment record
 */
function assignTicket(token, ticket_id, assigned_to, catatan) {
  var session = requireRole(token, ['admin', 'kaur']);

  if (!ticket_id)   throw new Error('ticket_id wajib diisi.');
  if (!assigned_to) throw new Error('assigned_to (ID teknisi) wajib diisi.');

  // ── Validate ticket ───────────────────────────────────────────────────────
  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var ticket = tickets[0];

  var assignableStatuses = [TICKET_STATUSES.BARU, TICKET_STATUSES.DITUGASKAN];
  if (assignableStatuses.indexOf(ticket.status) === -1) {
    throw new Error(
      'Tiket hanya dapat ditugaskan saat berstatus BARU atau DITUGASKAN. ' +
      'Status saat ini: ' + ticket.status
    );
  }

  // ── Validate technician exists and is active ──────────────────────────────
  var techUsers = findRows('Users', function(u) {
    return u.user_id === assigned_to &&
           u.role === 'petugas_teknik' &&
           (u.status_aktif === true || u.status_aktif === 'true');
  });
  if (techUsers.length === 0) {
    throw new Error('Teknisi tidak ditemukan, tidak aktif, atau bukan petugas_teknik.');
  }
  var tech = techUsers[0];

  // ── Create assignment record ──────────────────────────────────────────────
  var now        = new Date();
  var assignment = {
    id:          generateId(),
    ticket_id:   ticket_id,
    assigned_by: session.user_id,
    assigned_to: assigned_to,
    assigned_at: now.toISOString(),
    catatan:     catatan || ''
  };
  appendRow('Assignments', assignment);

  // ── Update ticket status → DITUGASKAN ────────────────────────────────────
  var before = { status: ticket.status };
  updateRow('Tickets', 'ticket_id', ticket_id, {
    status:     TICKET_STATUSES.DITUGASKAN,
    updated_at: now.toISOString()
  });

  // Progress log
  appendRow('Progress', {
    id:          generateId(),
    ticket_id:   ticket_id,
    actor_id:    session.user_id,
    status_baru: TICKET_STATUSES.DITUGASKAN,
    catatan:     'Ditugaskan ke: ' + tech.nama + (catatan ? '. Catatan: ' + catatan : ''),
    created_at:  now.toISOString()
  });

  addAuditLog(ticket_id, session.user_id, 'ASSIGN_TICKET', before, {
    status:      TICKET_STATUSES.DITUGASKAN,
    assigned_to: assigned_to
  });

  // ── In-app notification to technician ────────────────────────────────────
  sendInAppNotification(
    assigned_to,
    'Anda mendapat penugasan tiket baru: ' + ticket.nomor_tiket +
    '. Prioritas: ' + ticket.prioritas + '.',
    ticket_id
  );

  return assignment;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reassign
// ─────────────────────────────────────────────────────────────────────────────

/**
 * reassignTicket(token, ticket_id, new_assigned_to, catatan)
 * Reassigns an already-assigned ticket to a different technician.
 * Creates a new Assignments record (keeps history).
 *
 * @param {string} token
 * @param {string} ticket_id
 * @param {string} new_assigned_to  user_id of the new technician
 * @param {string} catatan          Optional note
 * @return {Object}  New assignment record
 */
function reassignTicket(token, ticket_id, new_assigned_to, catatan) {
  var session = requireRole(token, ['admin', 'kaur']);

  if (!ticket_id)        throw new Error('ticket_id wajib diisi.');
  if (!new_assigned_to)  throw new Error('new_assigned_to wajib diisi.');

  // ── Validate ticket ───────────────────────────────────────────────────────
  var tickets = findRows('Tickets', function(t) { return t.ticket_id === ticket_id; });
  if (tickets.length === 0) throw new Error('Tiket tidak ditemukan.');
  var ticket = tickets[0];

  var reassignableStatuses = [
    TICKET_STATUSES.DITUGASKAN,
    TICKET_STATUSES.DALAM_PROSES,
    TICKET_STATUSES.MENUNGGU
  ];
  if (reassignableStatuses.indexOf(ticket.status) === -1) {
    throw new Error(
      'Tiket tidak dapat dialihkan dari status: ' + ticket.status
    );
  }

  // ── Validate new technician ───────────────────────────────────────────────
  var techUsers = findRows('Users', function(u) {
    return u.user_id === new_assigned_to &&
           u.role === 'petugas_teknik' &&
           (u.status_aktif === true || u.status_aktif === 'true');
  });
  if (techUsers.length === 0) {
    throw new Error('Teknisi baru tidak ditemukan, tidak aktif, atau bukan petugas_teknik.');
  }
  var newTech = techUsers[0];

  // ── Get previous assignee for audit ──────────────────────────────────────
  var prevAssignments = findRows('Assignments', function(a) {
    return a.ticket_id === ticket_id;
  });
  var prevAssignedTo = prevAssignments.length > 0
    ? prevAssignments[prevAssignments.length - 1].assigned_to
    : null;

  // ── Create new assignment record ──────────────────────────────────────────
  var now        = new Date();
  var assignment = {
    id:          generateId(),
    ticket_id:   ticket_id,
    assigned_by: session.user_id,
    assigned_to: new_assigned_to,
    assigned_at: now.toISOString(),
    catatan:     catatan || ''
  };
  appendRow('Assignments', assignment);

  // Keep status as DITUGASKAN (refresh updated_at)
  updateRow('Tickets', 'ticket_id', ticket_id, {
    status:     TICKET_STATUSES.DITUGASKAN,
    updated_at: now.toISOString()
  });

  appendRow('Progress', {
    id:          generateId(),
    ticket_id:   ticket_id,
    actor_id:    session.user_id,
    status_baru: TICKET_STATUSES.DITUGASKAN,
    catatan:     'Dialihkan ke: ' + newTech.nama + (catatan ? '. Catatan: ' + catatan : ''),
    created_at:  now.toISOString()
  });

  addAuditLog(ticket_id, session.user_id, 'REASSIGN_TICKET',
    { assigned_to: prevAssignedTo },
    { assigned_to: new_assigned_to }
  );

  // Notify new technician
  sendInAppNotification(
    new_assigned_to,
    'Tiket ' + ticket.nomor_tiket + ' telah dialihkan kepada Anda. Prioritas: ' + ticket.prioritas + '.',
    ticket_id
  );

  // Notify previous technician (if different)
  if (prevAssignedTo && prevAssignedTo !== new_assigned_to) {
    sendInAppNotification(
      prevAssignedTo,
      'Tiket ' + ticket.nomor_tiket + ' telah dialihkan dari Anda ke teknisi lain.',
      ticket_id
    );
  }

  return assignment;
}

// ─────────────────────────────────────────────────────────────────────────────
// Query
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getMyAssignments(token)
 * Returns all tickets currently assigned to the logged-in technician,
 * enriched with SLA status and sorted by priority then creation date.
 *
 * @param {string} token
 * @return {Object[]}  Array of enriched ticket objects
 */
function getMyAssignments(token) {
  var session = requireRole(token, ['petugas_teknik']);

  // Find distinct ticket IDs assigned to this user
  var myAssignments = findRows('Assignments', function(a) {
    return a.assigned_to === session.user_id;
  });

  var ticketIds = {};
  myAssignments.forEach(function(a) { ticketIds[a.ticket_id] = true; });

  // Active (non-terminal) statuses for a technician
  var activeStatuses = [
    TICKET_STATUSES.DITUGASKAN,
    TICKET_STATUSES.DALAM_PROSES,
    TICKET_STATUSES.MENUNGGU
  ];

  var tickets = findRows('Tickets', function(t) {
    return ticketIds[t.ticket_id] && activeStatuses.indexOf(t.status) !== -1;
  });

  // Priority sort order
  var priorityOrder = { KRITIS: 0, TINGGI: 1, SEDANG: 2, RENDAH: 3 };
  tickets.sort(function(a, b) {
    var pa = priorityOrder[a.prioritas] !== undefined ? priorityOrder[a.prioritas] : 99;
    var pb = priorityOrder[b.prioritas] !== undefined ? priorityOrder[b.prioritas] : 99;
    if (pa !== pb) return pa - pb;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  return tickets.map(function(t) { return _enrichTicket(t); });
}
