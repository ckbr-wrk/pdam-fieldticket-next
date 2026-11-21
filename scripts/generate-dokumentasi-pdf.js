const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = 'C:/Users/MSI/.gemini/antigravity/scratch/pdam-fieldticket';
const logoB64 = fs.readFileSync(path.join(rootDir, 'frontend/assets/logo-pdam.b64'), 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Dokumentasi Pembaruan Sistem (Release Notes & User Manual v2.21) - PDAM Cikembar</title>
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
    font-size: 9pt;
    margin: 0;
    padding: 0;
    background: #ffffff;
  }

  /* KOP SURAT */
  .kop {
    display: flex;
    align-items: center;
    border-bottom: 3px double #0f172a;
    padding-bottom: 10px;
    margin-bottom: 14px;
  }

  .kop-logo {
    width: 64px;
    height: 64px;
    object-fit: contain;
    margin-right: 14px;
    flex-shrink: 0;
  }

  .kop-text {
    flex: 1;
  }

  .kop-instansi {
    font-size: 12.5pt;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: #0f172a;
    text-transform: uppercase;
    line-height: 1.2;
  }

  .kop-sub {
    font-size: 11pt;
    font-weight: 700;
    color: #0284c7;
    margin-top: 2px;
  }

  .kop-address {
    font-size: 8pt;
    color: #475569;
    margin-top: 2px;
  }

  /* TITLE BOX */
  .doc-title-box {
    text-align: center;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 14px;
  }

  .doc-title-box h1 {
    font-size: 12pt;
    font-weight: 800;
    margin: 0;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .doc-title-box .doc-subtitle {
    font-size: 9.5pt;
    font-weight: 700;
    color: #0369a1;
    margin-top: 2px;
  }

  .doc-meta {
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: #64748b;
    margin-top: 6px;
    border-top: 1px dashed #cbd5e1;
    padding-top: 5px;
  }

  /* SECTION HEADERS */
  h2 {
    font-size: 10.5pt;
    font-weight: 800;
    color: #0f172a;
    border-left: 4px solid #0284c7;
    padding-left: 8px;
    margin-top: 14px;
    margin-bottom: 6px;
    text-transform: uppercase;
    page-break-after: avoid;
  }

  h3 {
    font-size: 9.5pt;
    font-weight: 700;
    color: #0369a1;
    margin-top: 8px;
    margin-bottom: 4px;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 6px 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0 0 8px 0;
    padding-left: 18px;
  }

  li {
    margin-bottom: 3px;
  }

  /* CALLOUT BOXES */
  .callout-info {
    background: #f0f9ff;
    border-left: 3.5px solid #0284c7;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 8.5pt;
    color: #0369a1;
    margin: 8px 0;
  }

  .callout-success {
    background: #f0fdf4;
    border-left: 3.5px solid #16a34a;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 8.5pt;
    color: #166534;
    margin: 8px 0;
  }

  /* TABLES */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 10px 0;
    font-size: 8pt;
    page-break-inside: avoid;
  }

  th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 6px 8px;
    border: 1px solid #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    font-size: 7.5pt;
  }

  td {
    padding: 5px 8px;
    border: 1px solid #cbd5e1;
    color: #1e293b;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-bold { font-weight: 700; }

  .badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 700;
  }

  .badge-success { background: #dcfce7; color: #15803d; }
  .badge-primary { background: #e0f2fe; color: #0369a1; }
  .badge-warning { background: #fef3c7; color: #92400e; }

  /* STEP BOXES */
  .step-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 8px;
    page-break-inside: avoid;
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: #1e3a8a;
    font-size: 8.5pt;
    margin-bottom: 4px;
  }

  .step-num {
    background: #0284c7;
    color: #ffffff;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 7.5pt;
    font-weight: 800;
  }

  /* SIGNATURES */
  .signature-section {
    display: flex;
    justify-content: space-between;
    margin-top: 22px;
    text-align: center;
    page-break-inside: avoid;
  }

  .sig-col {
    width: 30%;
  }

  .sig-title {
    font-size: 8pt;
    color: #475569;
    margin-bottom: 2px;
  }

  .sig-name {
    font-weight: 800;
    font-size: 8.5pt;
    text-decoration: underline;
    color: #0f172a;
    margin-top: 45px;
  }

  .sig-role {
    font-size: 7.5pt;
    color: #64748b;
    margin-top: 2px;
  }

  .page-break {
    page-break-before: always;
  }
</style>
</head>
<body>

  <!-- KOP SURAT -->
  <div class="kop">
    <img src="data:image/png;base64,${logoB64}" class="kop-logo" alt="Logo PDAM" />
    <div class="kop-text">
      <div class="kop-instansi">PERUMDA AIR MINUM TIRTA JAYA MANDIRI</div>
      <div class="kop-sub">KABUPATEN SUKABUMI &mdash; CABANG CIKEMBAR</div>
      <div class="kop-address">Jl. Pelabuhan II Km. 19 Cikembar, Sukabumi, Jawa Barat &bull; Sistem Informasi FieldTicket</div>
    </div>
  </div>

  <!-- TITLE -->
  <div class="doc-title-box">
    <h1>DOKUMENTASI PEMBARUAN SISTEM (RELEASE NOTES v2.21)</h1>
    <div class="doc-subtitle">PANDUAN OPERASIONAL FITUR BARU &bull; CHANGELOG TEKNIS &bull; ARSITEKTUR RILIS</div>
    <div class="doc-meta">
      <div>Nomor Dokumen: <b>DOC-UPD-2026-v2.21</b></div>
      <div>Tanggal Rilis: <b>07 November 2026</b></div>
      <div>Versi Deployment: <b>Production Build @37</b></div>
    </div>
  </div>

  <!-- RINGKASAN -->
  <div class="callout-success">
    <b>Status Rilis: SUKSES &amp; AKTIF DI PRODUKSI</b><br>
    Pembaruan sistem versi <b>v2.21</b> telah terpasang secara langsung pada infrastruktur cloud Google Apps Script (Deployment ID: <code>AKfycbzQWWoF5RQk6mvYRuqi1zgHpq4ZvWnXNLrBDinix2It37ZDkkLZ5Yxr3aeDWOurymg</code>) dan Cloudflare Workers Gateway (<code>https://tiket-pdamcikembar.pdamcikembar.workers.dev</code>).
  </div>

  <!-- MATRIKS BEFORE VS AFTER -->
  <h2>1. MATRIKS PERUBAHAN SISTEM (BEFORE VS AFTER)</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Komponen / Modul</th>
        <th style="width: 38%;">Kondisi Sebelumnya (v2.10)</th>
        <th style="width: 42%;">Kondisi Sesudah Pembaruan (v2.21)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Peta Sebaran Gangguan</b></td>
        <td>Semua marker tiket tercampur di peta tanpa opsi penyaringan petugas.</td>
        <td><b>Filter Dinamis Petugas Baca Meter</b>: Dropdown otomatis memuat nama pembaca meter, menyaring marker real-time, dan popup menampilkan identitas pelapor.</td>
      </tr>
      <tr>
        <td><b>Dokumentasi Foto Fisik</b></td>
        <td>Wajib membuka kamera langsung (<i>hardware camera lock</i>), kendala saat sinyal buruk.</td>
        <td><b>Dual Mode Upload</b>: Tersedia 2 tombol terpisah: <code>📷 Buka Kamera</code> (langsung) dan <code>🖼️ Pilih Galeri</code> (dari memori/galeri HP).</td>
      </tr>
      <tr>
        <td><b>SLA &amp; Batas Waktu</b></td>
        <td>Ada hitung mundur jam SLA, label "Lewat SLA", dan indikator overdue merah.</td>
        <td><b>SLA Dihapus Menyeluruh</b>: Alur kerja disederhanakan; indikator "Lewat SLA" diganti metrik riil operasional "Tiket Ditutup".</td>
      </tr>
      <tr>
        <td><b>Personil Kasir Lapangan</b></td>
        <td>Belum ada role khusus; kasir tidak bisa membuat tiket penagihan di lapangan.</td>
        <td><b>Role Baru: KAS (Kasir Lapangan)</b>: Role resmi untuk kasir keliling penagihan dengan hak lapor tiket, upload foto, dan akses seluruh wilayah.</td>
      </tr>
      <tr>
        <td><b>Kelola Pengguna Admin</b></td>
        <td>Email akun terkunci permanen, perubahan email harus hapus dan buat user baru.</td>
        <td><b>Edit Email Langsung</b>: Admin dapat mengubah email personil pada modal Edit User lengkap dengan validasi duplikasi.</td>
      </tr>
      <tr>
        <td><b>Pengurutan Dokumen Laporan</b></td>
        <td>Urutan tiket acak / berdasarkan tanggal input saja.</td>
        <td><b>Sorting Alfabetis Pembaca Meter</b>: Laporan PDF Tanpa Foto (Ka.Ur), PDF dengan Foto, dan Excel Resmi terurut rapi per petugas.</td>
      </tr>
      <tr>
        <td><b>Favicon &amp; Tampilan Tab</b></td>
        <td>Ikon bola dunia browser default (<code>🌐</code>) tanpa identitas instansi.</td>
        <td><b>Favicon Resmi 64x64 PNG</b>: Logo tajam pada tab browser, app header mobile/desktop, serta direct image pada kop cetak PDF.</td>
      </tr>
      <tr>
        <td><b>Tabel Laporan Excel Resmi</b></td>
        <td>Tinggi baris tidak rata (sebagian besar dan kecil karena enter/teks panjang).</td>
        <td><b>Tinggi Terkunci 26pt Seragam</b>: Sanitasi newline teks, XML WorksheetOptions 520 twips, dan penghapusan duplikasi tag header.</td>
      </tr>
    </tbody>
  </table>

  <!-- PANDUAN PENGOPERASIAN -->
  <div class="page-break"></div>

  <!-- KOP HALAMAN 2 -->
  <div class="kop" style="margin-bottom:10px;padding-bottom:6px">
    <img src="data:image/png;base64,${logoB64}" class="kop-logo" style="width:44px;height:44px" alt="Logo PDAM" />
    <div class="kop-text">
      <div class="kop-instansi" style="font-size:10.5pt">PERUMDA AIR MINUM TIRTA JAYA MANDIRI &bull; CABANG CIKEMBAR</div>
      <div class="kop-sub" style="font-size:9pt">DOKUMENTASI OPERASIONAL &amp; PANDUAN PENGGUNA (v2.21)</div>
    </div>
  </div>

  <h2>2. PANDUAN PENGOPERASIAN FITUR BARU</h2>

  <h3>A. Petugas Pembaca Meter &amp; Kasir Lapangan (KAS)</h3>
  <div class="step-box">
    <div class="step-header"><span class="step-num">1</span> Cara Memilih Foto dari Kamera vs Galeri HP:</div>
    <p>Buka menu <b>Lapor Tiket</b>. Pada bagian bukti foto, kini tersedia 2 pilihan tombol:</p>
    <ul>
      <li>Klik <b>📷 Buka Kamera</b>: Jika petugas berada langsung di titik lokasi dan ingin mengambil gambar secara instan.</li>
      <li>Klik <b>🖼️ Pilih Galeri</b>: Jika sebelumnya petugas sudah memotret saat kondisi sinyal tidak stabil dan ingin mengunggah foto yang tersimpan di galeri foto HP.</li>
    </ul>
  </div>

  <div class="step-box">
    <div class="step-header"><span class="step-num">2</span> Hak Akses &amp; Penugasan Role KAS (Kasir Lapangan):</div>
    <p>Personil kasir lapangan yang membantu penagihan dapat login dengan akun ber-role <b>KAS</b>. Petugas KAS dapat:</p>
    <ul>
      <li>Membuat tiket temuan lapangan (misal: pipa bocor, meter macet, atau laporan penagihan) untuk <b>seluruh wilayah</b> Cabang Cikembar.</li>
      <li>Memantau status penanganan tiket hasil laporannya melalui tab <b>Daftar Tiket</b>.</li>
    </ul>
  </div>

  <h3>B. Administrator Cabang &amp; Koordinator (Ka.Ur)</h3>
  <div class="step-box">
    <div class="step-header"><span class="step-num">3</span> Memfilter Peta Berdasarkan Petugas Pembaca Meter:</div>
    <ol>
      <li>Buka menu <b>Peta</b> pada bilah navigasi utama.</li>
      <li>Pilih nama petugas pada dropdown <b>"Semua Petugas / Pembaca Meter"</b>.</li>
      <li>Peta secara otomatis hanya akan menampilkan pin/marker lokasi gangguan yang dilaporkan oleh petugas yang bersangkutan.</li>
      <li>Klik salah satu pin marker untuk melihat rincian tiket, status, dan nama pelapor.</li>
    </ol>
  </div>

  <div class="step-box">
    <div class="step-header"><span class="step-num">4</span> Mengedit Alamat Email Pengguna (Kelola Akun):</div>
    <ol>
      <li>Masuk ke menu <b>Admin Panel &rarr; Kelola Pengguna</b>.</li>
      <li>Cari nama personil yang ingin diubah emailnya, lalu klik tombol <b>Edit</b>.</li>
      <li>Ubah alamat email pada field <b>"Email"</b>, lalu klik <b>Simpan Perubahan</b>.</li>
      <li>Sistem akan melakukan validasi format email dan memastikan email tersebut belum dipakai oleh akun lain.</li>
    </ol>
  </div>

  <div class="step-box">
    <div class="step-header"><span class="step-num">5</span> Mengunduh Laporan Tersortir Pembaca Meter &amp; Excel Seragam:</div>
    <ol>
      <li>Buka menu <b>Laporan</b>. Tentukan rentang tanggal dan filter status tiket yang diinginkan.</li>
      <li><b>Cetak Lembar Kerja Ka.Ur (Tanpa Foto)</b>: Menghasilkan PDF lembar kerja teknisi fisik yang otomatis terurut per pembaca meter dengan ceklis pekerjaan.</li>
      <li><b>Cetak Laporan PDF (Dengan Foto)</b>: Menghasilkan dokumen rekapitulasi lengkap dengan foto SEBELUM dan SESUDAH yang terurut per pembaca meter.</li>
      <li><b>Unduh Excel Resmi Cikembar</b>: Menghasilkan file <code>.xls</code> 20-kolom standar dinas Cikembar dengan seluruh tinggi baris terkunci rata <b>26pt</b> (rapi tanpa teks bertumpuk).</li>
    </ol>
  </div>

  <!-- ARSITEKTUR TEKNIS -->
  <div class="page-break"></div>

  <!-- KOP HALAMAN 3 -->
  <div class="kop" style="margin-bottom:10px;padding-bottom:6px">
    <img src="data:image/png;base64,${logoB64}" class="kop-logo" style="width:44px;height:44px" alt="Logo PDAM" />
    <div class="kop-text">
      <div class="kop-instansi" style="font-size:10.5pt">PERUMDA AIR MINUM TIRTA JAYA MANDIRI &bull; CABANG CIKEMBAR</div>
      <div class="kop-sub" style="font-size:9pt">DOKUMENTASI TEKNIS &amp; PENGESAHAN RILIS (v2.21)</div>
    </div>
  </div>

  <h2>3. DAFTAR FILE &amp; ARSITEKTUR TEKNIS YANG DIMODIFIKASI</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Nama File Sumber</th>
        <th style="width: 15%;">Komponen</th>
        <th style="width: 60%;">Rincian Modifikasi Teknis</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>AdminPanel.gs</code></td>
        <td>Backend GAS</td>
        <td>Menambahkan role <code>kas</code> ke daftar role valid; mendukung field <code>email</code> pada <code>updateUser()</code> dengan validasi tabrakan duplikasi.</td>
      </tr>
      <tr>
        <td><code>Tickets.gs</code></td>
        <td>Backend GAS</td>
        <td>Menetralisir fungsi <code>getSlaStatus()</code> (*overdue = false*); memberikan izin role <code>kas</code> untuk membuat dan melihat tiket semua wilayah.</td>
      </tr>
      <tr>
        <td><code>Photos.gs</code></td>
        <td>Backend GAS</td>
        <td>Mengizinkan hak akses unggah foto dokumentasi tiket untuk role <code>kas</code>.</td>
      </tr>
      <tr>
        <td><code>Reports.gs</code></td>
        <td>Backend GAS</td>
        <td>Memasukkan role <code>kas</code> dalam penyaringan akses data laporan operasional cabang.</td>
      </tr>
      <tr>
        <td><code>frontend/views/map.js</code></td>
        <td>Frontend</td>
        <td>Implementasi dropdown filter petugas pembaca meter dinamis dan integrasi nama pelapor pada popup Leaflet.</td>
      </tr>
      <tr>
        <td><code>frontend/views/laporan.js</code></td>
        <td>Frontend</td>
        <td>Sanitasi newline teks, kunci tinggi baris <code>26pt</code> pada Excel resmi, penyematan logo KOP PDF langsung, dan sorting per pembaca meter.</td>
      </tr>
      <tr>
        <td><code>frontend/views/ticket-form.js</code></td>
        <td>Frontend</td>
        <td>Pemisahan dual input foto (kamera belakang langsung vs galeri foto perangkat).</td>
      </tr>
      <tr>
        <td><code>frontend/views/ticket-detail.js</code></td>
        <td>Frontend</td>
        <td>Pembersihan banner countdown SLA dan dukungan galeri pada modal foto teknisi.</td>
      </tr>
      <tr>
        <td><code>frontend/views/admin-users.js</code></td>
        <td>Frontend</td>
        <td>Penambahan opsi role KAS dan input edit email pada form modal pengguna.</td>
      </tr>
      <tr>
        <td><code>frontend/style.css</code></td>
        <td>Styling</td>
        <td>Penyelarasan logo resmi pada <code>.hdr-logo</code> dan <code>.sb-brand-logo</code> dengan latar putih dan radius bersih.</td>
      </tr>
      <tr>
        <td><code>build.ps1</code></td>
        <td>Build Tool</td>
        <td>Injeksi otomatis favicon Base64 64x64 PNG beresolusi tinggi ke dalam single-file bundle <code>index-combined.html</code>.</td>
      </tr>
    </tbody>
  </table>

  <h2>4. PENGUJIAN &amp; VERIFIKASI (QUALITY ASSURANCE)</h2>
  <div class="callout-info">
    Seluruh fitur pembaruan telah melalui uji verifikasi fungsional (UAT):
    <ul>
      <li><b>Ekspor Excel</b>: Berhasil diverifikasi pada Microsoft Excel 2016/2019/365 &mdash; semua baris tampil rata 26pt tanpa ada baris yang membengkak.</li>
      <li><b>Tab Browser &amp; Favicon</b>: Tampil dengan logo resmi PERUMDA di Google Chrome, Microsoft Edge, dan Android WebView.</li>
      <li><b>Cetak PDF</b>: Logo pada kop surat tetap tercetak jelas dengan opsi background graphics aktif maupun tidak aktif.</li>
      <li><b>Role KAS</b>: Berhasil diuji coba login, input tiket lapangan, dan sinkronisasi foto.</li>
    </ul>
  </div>

  <!-- LEMBAR PENGESAHAN -->
  <div class="signature-section">
    <div class="sig-col">
      <div class="sig-title">Dibuat &amp; Dilaporkan Oleh:</div>
      <div class="sig-role">Tim Pengembang Sistem</div>
      <div class="sig-name">Lead Software Engineer</div>
      <div class="sig-role">Mitra Pengembang Perangkat Lunak</div>
    </div>
    <div class="sig-col">
      <div class="sig-title">Ditinjau &amp; Diperiksa Oleh:</div>
      <div class="sig-role">Plh. Kaur Admin &amp; Keuangan</div>
      <div class="sig-name">Yunita Krisdianti Utomo</div>
      <div class="sig-role">Cabang Cikembar</div>
    </div>
    <div class="sig-col">
      <div class="sig-title">Disetujui &amp; Disahkan Oleh:</div>
      <div class="sig-role">Kepala Cabang Cikembar</div>
      <div class="sig-name">Deden Agustian, S.IP</div>
      <div class="sig-role">PERUMDA Air Minum Tirta Jaya Mandiri</div>
    </div>
  </div>

</body>
</html>
`;

const htmlPath = path.join(rootDir, 'DOKUMENTASI_UPDATE_SISTEM.html');
const pdfPath = path.join(rootDir, 'DOKUMENTASI_UPDATE_SISTEM.pdf');
const brainPdfPath = 'C:/Users/MSI/.gemini/antigravity/brain/f9a24fb7-e14c-4938-9333-cd5923f197bc/DOKUMENTASI_UPDATE_SISTEM.pdf';

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML created at:', htmlPath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;
console.log('Running Edge command...');
execSync(cmd);
console.log('PDF created at:', pdfPath);

fs.copyFileSync(pdfPath, brainPdfPath);
console.log('PDF copied to artifact dir at:', brainPdfPath);
