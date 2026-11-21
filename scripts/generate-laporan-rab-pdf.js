const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = 'C:/Users/MSI/.gemini/antigravity/scratch/pdam-fieldticket';
const logoB64 = fs.readFileSync(path.join(rootDir, 'frontend/assets/logo-pdam.b64'), 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Pembaruan Sistem dan Rencana Anggaran Biaya (RAB) - PDAM Cikembar</title>
<style>
  @page {
    size: A4;
    margin: 14mm 14mm 16mm 14mm;
  }
  
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.5;
    font-size: 9.5pt;
    margin: 0;
    padding: 0;
    background: #ffffff;
  }

  /* KOP SURAT */
  .kop {
    display: flex;
    align-items: center;
    border-bottom: 3px double #0f172a;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }

  .kop-logo {
    width: 68px;
    height: 68px;
    object-fit: contain;
    margin-right: 16px;
    flex-shrink: 0;
  }

  .kop-text {
    flex: 1;
  }

  .kop-instansi {
    font-size: 13pt;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: #0f172a;
    text-transform: uppercase;
    line-height: 1.2;
  }

  .kop-sub {
    font-size: 11.5pt;
    font-weight: 700;
    color: #0284c7;
    margin-top: 2px;
  }

  .kop-address {
    font-size: 8.5pt;
    color: #475569;
    margin-top: 3px;
  }

  /* DOCUMENT TITLE */
  .doc-title-box {
    text-align: center;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 16px;
  }

  .doc-title-box h1 {
    font-size: 13pt;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .doc-title-box .doc-subtitle {
    font-size: 10pt;
    font-weight: 700;
    color: #0369a1;
    margin-top: 3px;
  }

  .doc-meta {
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: #64748b;
    margin-top: 6px;
    border-top: 1px dashed #cbd5e1;
    padding-top: 6px;
  }

  /* SECTION HEADERS */
  h2 {
    font-size: 11pt;
    font-weight: 800;
    color: #0f172a;
    border-left: 4px solid #0284c7;
    padding-left: 8px;
    margin-top: 16px;
    margin-bottom: 8px;
    text-transform: uppercase;
    page-break-after: avoid;
  }

  h3 {
    font-size: 9.5pt;
    font-weight: 700;
    color: #0369a1;
    margin-top: 10px;
    margin-bottom: 4px;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 6px 0;
    text-align: justify;
  }

  ul {
    margin: 0 0 8px 0;
    padding-left: 18px;
  }

  li {
    margin-bottom: 3px;
  }

  /* MODULE GRID / CARDS */
  .feature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
    page-break-inside: avoid;
  }

  .feature-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 12px;
  }

  .feature-card .feat-title {
    font-weight: 700;
    font-size: 9pt;
    color: #1e3a8a;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .feature-card .feat-desc {
    font-size: 8.5pt;
    color: #334155;
    line-height: 1.4;
  }

  /* BADGES & CALLOUTS */
  .badge-status {
    display: inline-block;
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #86efac;
    padding: 2px 7px;
    border-radius: 12px;
    font-size: 7.5pt;
    font-weight: 700;
  }

  .callout-info {
    background: #f0f9ff;
    border-left: 3.5px solid #0284c7;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 8.5pt;
    color: #0369a1;
    margin: 10px 0;
  }

  /* TABLES */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }

  th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
    text-align: center;
    padding: 6px 8px;
    font-size: 8pt;
    border: 1px solid #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  td {
    padding: 5.5px 8px;
    border: 1px solid #cbd5e1;
    color: #1e293b;
    vertical-align: middle;
  }

  .subtotal-row td {
    background: #e2e8f0;
    font-weight: 700;
    color: #0f172a;
  }

  .total-row td {
    background: #1e3a8a;
    color: #ffffff;
    font-weight: 800;
    font-size: 9.5pt;
    border: 1px solid #1e3a8a;
  }

  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-bold { font-weight: 700; }

  /* SIGNATURES */
  .signature-section {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    text-align: center;
    page-break-inside: avoid;
  }

  .sig-col {
    width: 30%;
  }

  .sig-title {
    font-size: 8.5pt;
    color: #475569;
    margin-bottom: 2px;
  }

  .sig-name {
    font-weight: 800;
    font-size: 9pt;
    text-decoration: underline;
    color: #0f172a;
    margin-top: 50px;
  }

  .sig-role {
    font-size: 8pt;
    color: #64748b;
    margin-top: 2px;
  }

  .page-break {
    page-break-before: always;
  }
</style>
</head>
<body>

  <!-- KOP SURAT RESMI -->
  <div class="kop">
    <img src="data:image/png;base64,${logoB64}" class="kop-logo" alt="Logo PDAM" />
    <div class="kop-text">
      <div class="kop-instansi">PERUMDA AIR MINUM TIRTA JAYA MANDIRI</div>
      <div class="kop-sub">KABUPATEN SUKABUMI &mdash; CABANG CIKEMBAR</div>
      <div class="kop-address">Jl. Pelabuhan II Km. 19 Cikembar, Sukabumi, Jawa Barat &bull; Sistem Informasi FieldTicket</div>
    </div>
  </div>

  <!-- JUDUL DOKUMEN -->
  <div class="doc-title-box">
    <h1>LAPORAN PEMBARUAN SISTEM &amp; RENCANA ANGGARAN BIAYA (RAB)</h1>
    <div class="doc-subtitle">PENGEMBANGAN FITUR OPERASIONAL &bull; STABILISASI LAPORAN &bull; DUKUNGAN PEMELIHARAAN</div>
    <div class="doc-meta">
      <div>Tanggal: <b>07 November 2026</b></div>
      <div>Versi Sistem: <b>v2.21 (Production @37)</b></div>
      <div>Status Deployment: <span class="badge-status">LIVE &amp; AKTIF</span></div>
    </div>
  </div>

  <div class="callout-info">
    <b>Ringkasan Eksekutif</b>: Sistem Field Ticket Manajemen Pengaduan Cabang Cikembar telah berhasil diperbarui ke versi <b>v2.21</b>. Pembaruan mencakup integrasi branding resmi, standardisasi kunci tinggi baris tabel Excel (26pt), filter peta pembaca meter, penambahan role KAS, dual photo upload, eliminasi SLA, edit email admin, dan sorting laporan pembaca meter.
  </div>

  <!-- BAGIAN I -->
  <h2>BAGIAN I: LAPORAN RINCIAN PEMBARUAN SISTEM (v2.21)</h2>

  <div class="feature-grid">
    <div class="feature-card">
      <div class="feat-title">&#128506;&#65039; 1. Filter Peta Pembaca Meter</div>
      <div class="feat-desc">Peta interaktif dilengkapi filter dropdown petugas baca meter. Marker tersaring secara real-time dan popup menampilkan identitas nama pembaca meter.</div>
    </div>
    <div class="feature-card">
      <div class="feat-title">&#128247; 2. Dual Upload (Kamera &amp; Galeri)</div>
      <div class="feat-desc">Formulir tiket dan modul tindak lanjut teknisi memisahkan tombol <i>Kamera Langsung</i> dan <i>Pilih Galeri</i> untuk fleksibilitas dokumentasi saat offline/low-signal.</div>
    </div>
    <div class="feature-card">
      <div class="feat-title">&#9201;&#65039; 3. Penghapusan Fitur SLA</div>
      <div class="feat-desc">Menghapus indikator "Lewat SLA", KPI kepatuhan SLA, dan banner countdown yang membebani petugas, disesuaikan dengan ritme operasional riil Cikembar.</div>
    </div>
    <div class="feature-card">
      <div class="feat-title">&#128100; 4. Penambahan Role KAS (Kasir Lapangan)</div>
      <div class="feat-desc">Akun personil penagih lapangan (KAS) aktif dengan hak akses pembuatan tiket, upload foto, pemantauan semua wilayah, dan dashboard setara pembaca meter.</div>
    </div>
    <div class="feature-card">
      <div class="feat-title">&#9999;&#65039; 5. Edit Email di Kelola Pengguna</div>
      <div class="feat-desc">Admin dapat langsung memperbarui alamat email personil tanpa perlu membuat ulang akun, dilengkapi validasi format dan proteksi anti-duplikasi.</div>
    </div>
    <div class="feature-card">
      <div class="feat-title">&#128196; 6. Laporan Sortir Pembaca Meter</div>
      <div class="feat-desc">Seluruh dokumen laporan (PDF Lembar Kerja Ka.Ur tanpa foto, PDF Rekapitulasi dengan Foto, dan Excel Resmi) otomatis diurutkan rapi per petugas pembaca meter.</div>
    </div>
    <div class="feature-card">
      <div class="feat-title">&#127991;&#65039; 7. Favicon &amp; Branding Logo Profesional</div>
      <div class="feat-desc">Favicon resmi 64x64 PNG aktif di tab browser (menggantikan globe default), logo tajam pada header mobile/desktop, serta direct image pada kop cetak PDF.</div>
    </div>
    <div class="feature-card">
      <div class="feat-title">&#128202; 8. Standardisasi Tabel Excel Resmi (26pt)</div>
      <div class="feat-desc">Pembersihan karakter newline pada teks tiket, eliminasi duplikasi header, dan penguncian tinggi baris seragam 26pt (mso-height-source) di Microsoft Excel.</div>
    </div>
  </div>

  <!-- BAGIAN II -->
  <div class="page-break"></div>

  <!-- KOP HALAMAN KEDUA -->
  <div class="kop" style="margin-bottom:12px;padding-bottom:8px">
    <img src="data:image/png;base64,${logoB64}" class="kop-logo" style="width:48px;height:48px" alt="Logo PDAM" />
    <div class="kop-text">
      <div class="kop-instansi" style="font-size:11pt">PERUMDA AIR MINUM TIRTA JAYA MANDIRI &bull; CABANG CIKEMBAR</div>
      <div class="kop-sub" style="font-size:9.5pt">RENCANA ANGGARAN BIAYA (RAB) PENGEMBANGAN &amp; PEMELIHARAAN SISTEM</div>
    </div>
  </div>

  <h2>BAGIAN II: RENCANA ANGGARAN BIAYA (RAB)</h2>
  <p>Rincian estimasi biaya pengembangan perangkat lunak, integrasi arsitektur cloud serverless, pengujian kualitas, serta jaminan pemeliharaan teknis sistem:</p>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;">No</th>
        <th style="width: 48%;">Uraian Pekerjaan / Spesifikasi Teknis</th>
        <th style="width: 9%;">Satuan</th>
        <th style="width: 7%;">Vol</th>
        <th style="width: 15%;">Harga Satuan (Rp)</th>
        <th style="width: 16%;">Jumlah Biaya (Rp)</th>
      </tr>
    </thead>
    <tbody>
      <!-- A -->
      <tr style="background:#f1f5f9;font-weight:700">
        <td class="text-center">A</td>
        <td colspan="5">PENGEMBANGAN FITUR &amp; PEMBARUAN SISTEM (SOFTWARE DEVELOPMENT)</td>
      </tr>
      <tr>
        <td class="text-center">1</td>
        <td>Modul Filter Peta Interaktif &amp; Dinamisasi Petugas Pembaca Meter</td>
        <td class="text-center">Modul</td>
        <td class="text-center">1</td>
        <td class="text-right">1.250.000</td>
        <td class="text-right">1.250.000</td>
      </tr>
      <tr>
        <td class="text-center">2</td>
        <td>Modul Fleksibilitas Media (Dual Upload Kamera Langsung &amp; Galeri HP)</td>
        <td class="text-center">Modul</td>
        <td class="text-center">1</td>
        <td class="text-right">950.000</td>
        <td class="text-right">950.000</td>
      </tr>
      <tr>
        <td class="text-center">3</td>
        <td>Restrukturisasi Workflow Operasional &amp; Eliminasi Modul SLA</td>
        <td class="text-center">Paket</td>
        <td class="text-center">1</td>
        <td class="text-right">750.000</td>
        <td class="text-right">750.000</td>
      </tr>
      <tr>
        <td class="text-center">4</td>
        <td>Implementasi Skema Otorisasi &amp; Antarmuka Role KAS (Kasir Lapangan)</td>
        <td class="text-center">Role</td>
        <td class="text-center">1</td>
        <td class="text-right">1.200.000</td>
        <td class="text-right">1.200.000</td>
      </tr>
      <tr>
        <td class="text-center">5</td>
        <td>Pembaruan Modul Kelola Pengguna (Fitur Edit Email &amp; Validasi Regex)</td>
        <td class="text-center">Modul</td>
        <td class="text-center">1</td>
        <td class="text-right">850.000</td>
        <td class="text-right">850.000</td>
      </tr>
      <tr>
        <td class="text-center">6</td>
        <td>Standardisasi Engine Laporan (Sorting Pembaca Meter, Lembar Ka.Ur &amp; PDF Foto)</td>
        <td class="text-center">Paket</td>
        <td class="text-center">1</td>
        <td class="text-right">1.500.000</td>
        <td class="text-right">1.500.000</td>
      </tr>
      <tr>
        <td class="text-center">7</td>
        <td>Penyempurnaan Engine Ekspor Excel Cikembar (Fixed Height 26pt &amp; XML Sanitizing)</td>
        <td class="text-center">Paket</td>
        <td class="text-center">1</td>
        <td class="text-right">1.350.000</td>
        <td class="text-right">1.350.000</td>
      </tr>
      <tr>
        <td class="text-center">8</td>
        <td>UI/UX Re-Branding, Favicon Engine Tab Browser &amp; Ingestion Logo Resmi</td>
        <td class="text-center">Paket</td>
        <td class="text-center">1</td>
        <td class="text-right">650.000</td>
        <td class="text-right">650.000</td>
      </tr>
      <tr class="subtotal-row">
        <td></td>
        <td colspan="4">Subtotal A (Pengembangan Fitur &amp; Pembaruan Sistem)</td>
        <td class="text-right">8.500.000</td>
      </tr>

      <!-- B -->
      <tr style="background:#f1f5f9;font-weight:700">
        <td class="text-center">B</td>
        <td colspan="5">INFRASTRUKTUR CLOUD &amp; DEPLOYMENT PIPELINE</td>
      </tr>
      <tr>
        <td class="text-center">1</td>
        <td>Konfigurasi Cloudflare Workers Edge Gateway (Reverse Proxy &amp; Custom Domain)</td>
        <td class="text-center">Paket</td>
        <td class="text-center">1</td>
        <td class="text-right">1.200.000</td>
        <td class="text-right">1.200.000</td>
      </tr>
      <tr>
        <td class="text-center">2</td>
        <td>Setup Serverless Google Apps Script Multi-Deployment &amp; Cloud Storage</td>
        <td class="text-center">Paket</td>
        <td class="text-center">1</td>
        <td class="text-right">1.000.000</td>
        <td class="text-right">1.000.000</td>
      </tr>
      <tr>
        <td class="text-center">3</td>
        <td>Penyusunan Script Automation Bundling &amp; Asset Compiler (build.ps1)</td>
        <td class="text-center">Paket</td>
        <td class="text-center">1</td>
        <td class="text-right">800.000</td>
        <td class="text-right">800.000</td>
      </tr>
      <tr class="subtotal-row">
        <td></td>
        <td colspan="4">Subtotal B (Infrastruktur Cloud &amp; Deployment)</td>
        <td class="text-right">3.000.000</td>
      </tr>

      <!-- C -->
      <tr style="background:#f1f5f9;font-weight:700">
        <td class="text-center">C</td>
        <td colspan="5">QUALITY ASSURANCE (QA), TESTING &amp; MOBILE SYNC</td>
      </tr>
      <tr>
        <td class="text-center">1</td>
        <td>Pengujian Kompatibilitas Lintas Browser (Chrome, Edge, Firefox, Mobile Safari)</td>
        <td class="text-center">Sesi</td>
        <td class="text-center">1</td>
        <td class="text-right">750.000</td>
        <td class="text-right">750.000</td>
      </tr>
      <tr>
        <td class="text-center">2</td>
        <td>Sinkronisasi Aset &amp; Konfigurasi Container Capacitor Android Native</td>
        <td class="text-center">Paket</td>
        <td class="text-center">1</td>
        <td class="text-right">1.000.000</td>
        <td class="text-right">1.000.000</td>
      </tr>
      <tr class="subtotal-row">
        <td></td>
        <td colspan="4">Subtotal C (Testing, QA &amp; Mobile Sync)</td>
        <td class="text-right">1.750.000</td>
      </tr>

      <!-- D -->
      <tr style="background:#f1f5f9;font-weight:700">
        <td class="text-center">D</td>
        <td colspan="5">DOKUMENTASI, PELATIHAN &amp; GARANSI PEMELIHARAAN (3 BULAN)</td>
      </tr>
      <tr>
        <td class="text-center">1</td>
        <td>Penyusunan Dokumentasi Teknis, Changelog &amp; Panduan Operasional Sistem</td>
        <td class="text-center">Paket</td>
        <td class="text-center">1</td>
        <td class="text-right">1.000.000</td>
        <td class="text-right">1.000.000</td>
      </tr>
      <tr>
        <td class="text-center">2</td>
        <td>Garansi Pemeliharaan Sistem (Standby Bugfix, Database Integrity, 3 Bulan)</td>
        <td class="text-center">Bulan</td>
        <td class="text-center">3</td>
        <td class="text-right">750.000</td>
        <td class="text-right">2.250.000</td>
      </tr>
      <tr class="subtotal-row">
        <td></td>
        <td colspan="4">Subtotal D (Dokumentasi &amp; Garansi Pemeliharaan)</td>
        <td class="text-right">3.250.000</td>
      </tr>

      <!-- GRAND TOTAL -->
      <tr class="total-row">
        <td class="text-center" colspan="5">TOTAL RENCANA ANGGARAN BIAYA (A + B + C + D)</td>
        <td class="text-right">Rp 16.500.000</td>
      </tr>
    </tbody>
  </table>

  <p style="font-size: 8.5pt; font-style: italic; margin-top: 4px;">
    * <b>Terbilang</b>: <i>Enam Belas Juta Lima Ratus Ribu Rupiah.</i>
  </p>

  <div style="font-size: 8pt; color: #475569; margin-top: 10px; border: 1px solid #e2e8f0; border-radius: 4px; padding: 6px 10px; background: #f8fafc;">
    <b>Catatan Efisiensi Biaya Operasional:</b><br>
    Sistem dibangun menggunakan arsitektur <i>Serverless Cloud</i> (Google Apps Script &amp; Cloudflare Workers Free Tier) yang terbebas dari beban biaya sewa server bulanan (VPS Hosting), sehingga menghemat biaya belanja modal (CapEx) maupun belanja operasional (OpEx) instansi secara berkelanjutan.
  </div>

  <!-- LEMBAR TANDA TANGAN -->
  <div class="signature-section">
    <div class="sig-col">
      <div class="sig-title">Dibuat Oleh:</div>
      <div class="sig-role">Tim Pengembang Sistem</div>
      <div class="sig-name">Lead Software Engineer</div>
      <div class="sig-role">Developer Mitra Teknis</div>
    </div>
    <div class="sig-col">
      <div class="sig-title">Ditinjau Oleh:</div>
      <div class="sig-role">Plh. Kaur Admin &amp; Keuangan</div>
      <div class="sig-name">Yunita Krisdianti Utomo</div>
      <div class="sig-role">Cabang Cikembar</div>
    </div>
    <div class="sig-col">
      <div class="sig-title">Disetujui Oleh:</div>
      <div class="sig-role">Kepala Cabang Cikembar</div>
      <div class="sig-name">Deden Agustian, S.IP</div>
      <div class="sig-role">PERUMDA Tirta Jaya Mandiri</div>
    </div>
  </div>

</body>
</html>
`;

const htmlPath = path.join(rootDir, 'LAPORAN_UPDATE_DAN_RAB.html');
const pdfPath = path.join(rootDir, 'LAPORAN_UPDATE_DAN_RAB.pdf');
const brainPdfPath = 'C:/Users/MSI/.gemini/antigravity/brain/f9a24fb7-e14c-4938-9333-cd5923f197bc/LAPORAN_UPDATE_DAN_RAB.pdf';

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML created at:', htmlPath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;
console.log('Running Edge command...');
execSync(cmd);
console.log('PDF created at:', pdfPath);

fs.copyFileSync(pdfPath, brainPdfPath);
console.log('PDF copied to artifact dir at:', brainPdfPath);
