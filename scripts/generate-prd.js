const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>PRD - Sistem Manajemen Penagihan & Audit Meter PDAM FieldTicket</title>
<style>
  @page {
    size: A4;
    margin: 15mm 15mm 18mm 15mm;
  }
  
  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.5;
    font-size: 9.5pt;
    margin: 0;
    padding: 0;
  }

  /* Cover Page */
  .cover {
    page-break-after: always;
    height: 94vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 35px 25px;
    box-sizing: border-box;
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0284c7 100%);
    color: white;
    border-radius: 8px;
  }

  .cover-header {
    border-bottom: 2px solid rgba(255,255,255,0.25);
    padding-bottom: 15px;
  }

  .cover-org {
    font-size: 13pt;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #38bdf8;
    margin-bottom: 4px;
  }

  .cover-suborg {
    font-size: 10pt;
    color: #cbd5e1;
    font-weight: 500;
  }

  .cover-body {
    margin: auto 0;
  }

  .cover-badge {
    display: inline-block;
    background: rgba(56, 189, 248, 0.25);
    border: 1px solid #38bdf8;
    color: #38bdf8;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 8.5pt;
    font-weight: 700;
    margin-bottom: 18px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cover-title {
    font-size: 24pt;
    font-weight: 800;
    line-height: 1.25;
    margin: 0 0 16px 0;
    color: #ffffff;
  }

  .cover-subtitle {
    font-size: 11.5pt;
    color: #cbd5e1;
    max-width: 650px;
    line-height: 1.5;
  }

  .cover-meta {
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 14px 18px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    font-size: 8.5pt;
  }

  .cover-meta div span {
    display: block;
    color: #94a3b8;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }

  .cover-meta div strong {
    color: #f8fafc;
    font-size: 9pt;
  }

  /* Document Body */
  h1 {
    font-size: 14pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #0284c7;
    padding-bottom: 5px;
    margin-top: 22px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }

  h2 {
    font-size: 11.5pt;
    font-weight: 700;
    color: #0369a1;
    margin-top: 15px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }

  h3 {
    font-size: 10pt;
    font-weight: 700;
    color: #334155;
    margin-top: 10px;
    margin-bottom: 4px;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 8px 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0 0 10px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 3px;
  }

  /* Callout boxes */
  .callout {
    padding: 10px 14px;
    border-radius: 6px;
    margin: 10px 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }

  .callout-info {
    background-color: #f0f9ff;
    border-left: 4px solid #0284c7;
    color: #0369a1;
  }

  .callout-warning {
    background-color: #fffbeb;
    border-left: 4px solid #f59e0b;
    color: #92400e;
  }

  .callout-success {
    background-color: #f0fdf4;
    border-left: 4px solid #16a34a;
    color: #166534;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 14px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }

  th {
    background-color: #0f172a;
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 6px 8px;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 6px 8px;
    border-bottom: 1px solid #e2e8f0;
    color: #334155;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  .text-right { text-align: right; }
  .text-center { text-align: center; }

  .badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 700;
  }

  .badge-p0 { background: #fee2e2; color: #991b1b; }
  .badge-p1 { background: #fef3c7; color: #92400e; }
  .badge-p2 { background: #e0f2fe; color: #075985; }

  /* Stat cards */
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 10px 0;
    page-break-inside: avoid;
  }

  .stat-card {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 10px;
    text-align: center;
  }

  .stat-num {
    font-size: 14pt;
    font-weight: 800;
    color: #0369a1;
    margin-bottom: 2px;
  }

  .stat-label {
    font-size: 7.5pt;
    color: #64748b;
    text-transform: uppercase;
    font-weight: 700;
  }

  .page-break {
    page-break-before: always;
  }

  .signature-box {
    margin-top: 25px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    text-align: center;
    page-break-inside: avoid;
  }

  .sig-line {
    margin-top: 45px;
    border-top: 1px solid #334155;
    padding-top: 4px;
    font-weight: 700;
    font-size: 8.5pt;
  }

  .sig-role {
    font-size: 7.5pt;
    color: #64748b;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-header">
    <div class="cover-org">PERUMDA AIR MINUM TIRTA JAYA MANDIRI</div>
    <div class="cover-suborg">CABANG CIKEMBAR - KABUPATEN SUKABUMI</div>
  </div>

  <div class="cover-body">
    <div class="cover-badge">Product Requirements Document (PRD)</div>
    <h1 class="cover-title">Sistem Manajemen Penagihan Rekening, Rekonsiliasi Billing & Audit Stan Meter Lapangan</h1>
    <div class="cover-subtitle">
      Spesifikasi Integrasi Modul Closing Loket (LPP/DSR), Smart Field Ticket Dispatching, Audit Pemakaian Stan 0 m&sup3;, dan Executive Dashboard Keuangan pada Aplikasi PDAM FieldTicket.
    </div>
  </div>

  <div class="cover-meta">
    <div>
      <span>Nomor Dokumen</span>
      <strong>PRD-CFT-2026-V2.8</strong>
    </div>
    <div>
      <span>Tanggal Terbit</span>
      <strong>5 November 2026</strong>
    </div>
    <div>
      <span>Status Dokumen</span>
      <strong>Disetujui / Siap Rilis</strong>
    </div>
    <div>
      <span>Pemilik Produk</span>
      <strong>Tim IT & Operasional Cabang</strong>
    </div>
    <div>
      <span>Target Rilis</span>
      <strong>Sprint 1-2 (November 2026)</strong>
    </div>
    <div>
      <span>Platform Sasaran</span>
      <strong>Web Admin & Android APK</strong>
    </div>
  </div>
</div>

<!-- SECTION 1 -->
<h1>1. Ringkasan Eksekutif & Latar Belakang Masalah</h1>

<p>
  Dokumen Kebutuhan Produk (<em>Product Requirements Document / PRD</em>) ini menetapkan arah pengembangan modul baru untuk sistem <strong>PDAM FieldTicket (v2.8.0)</strong> di lingkungan <strong>PERUMDA Tirta Jaya Mandiri Cabang Cikembar</strong>.
</p>
<p>
  Pengembangan ini didasari oleh temuan langsung pada pembukuan rekening bulan September 2026 dan masa penutupan loket (closing) kasir akhir Oktober 2026:
</p>

<div class="grid-3">
  <div class="stat-card">
    <div class="stat-num">Rp 337,79 Jt</div>
    <div class="stat-label">Total Piutang DSR Sept (2.645 Rek)</div>
  </div>
  <div class="stat-card">
    <div class="stat-num">9,96%</div>
    <div class="stat-label">Realisasi Closing (Rp 33,64 Jt / 203 Rek)</div>
  </div>
  <div class="stat-card">
    <div class="stat-num">Rp 304,15 Jt</div>
    <div class="stat-label">Sisa Piutang Lapangan (2.442 Rek)</div>
  </div>
</div>

<h2>1.1. Rumusan Masalah Operasional</h2>
<ol>
  <li>
    <strong>Rendahnya Serapan Piutang Pasca-Closing Kasir</strong>: Data <em>Daftar Sisa Rekening (DSR)</em> September 2026 mencatat 2.645 pelanggan belum bayar senilai Rp 337,79 Juta. Realisasi pembayaran loket pada masa closing tanggal 29 dan 30 Oktober 2026 hanya mencapai 203 pelanggan (Rp 33,64 Juta atau 9,96%). Sisa <strong>2.442 pelanggan (Rp 304,15 Juta)</strong> belum memiliki tindak lanjut otomatis ke tim lapangan.
  </li>
  <li>
    <strong>Tingginya Anomali Pemakaian 0 m&sup3; (Stan Tetap)</strong>: Berdasarkan audit dokumen DRD pembacaan meter di <strong>Wilayah III - KP. Gelarsari (1003012)</strong>, sebanyak <strong>7 dari 12 pelanggan (58,3%)</strong> mencatatkan pemakaian 0 m&sup3; (stan awal = stan akhir). Pelanggan tetap dibebani tarif minimum (RT. B: Rp 79.900, RT. C: Rp 95.500) ditambah denda Rp 10.000, namun tidak pernah terverifikasi apakah water meter macet/rusak, ada bypass pipa, atau rumah kosong.
  </li>
  <li>
    <strong>Sistem Penagihan Terfragmentasi & Rawan Human Error</strong>: Data kasir dikelola via spreadsheet LPP, sedangkan penugasan teknisi berjalan terpisah. Ditemukan anomali penomoran pada LPP 30 Oktober (nomor melompat dari 18 langsung ke 20, menyebabkan selisih pencatatan volume transaksi).
  </li>
</ol>

<div class="callout callout-info">
  <strong>Tujuan Solusi:</strong> Menjembatani data penagihan kasir (LPP/DSR) langsung ke genggaman teknisi lapangan (Field Ticket Mobile), mengotomatiskan penerbitan surat penagihan tunggakan dan SPK audit meter stan 0 m&sup3;, serta menyajikan visibilitas keuangan real-time bagi Kepala Cabang dan Kaur Keuangan.
</div>

<!-- SECTION 2 -->
<div class="page-break"></div>
<h1>2. Persona Pengguna & Sasaran Kinerja (OKRs)</h1>

<h2>2.1. Matriks Persona Pengguna</h2>
<table>
  <thead>
    <tr>
      <th style="width: 20%;">Peran Pengguna</th>
      <th style="width: 38%;">Tanggung Jawab Operasional</th>
      <th style="width: 42%;">Kebutuhan Kunci Sistem</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Kepala Cabang</strong><br><em>(Deden Agustian, S.IP)</em></td>
      <td>Monitoring pencapaian target efisiensi penagihan cabang, approval SPK pemutusan/segel meter, pengendalian risiko piutang macet.</td>
      <td>Dashboard Executive yang menampilkan rasio pencapaian target DRD cabang (Rp 2,86 Miliar), performa penagihan per wilayah, dan laporan eksekutif PDF siap cetak.</td>
    </tr>
    <tr>
      <td><strong>Plh. Kaur Admin & Keuangan</strong><br><em>(Yunita Krisdianti Utomo)</em></td>
      <td>Verifikasi setoran kasir, kontrol saldo piutang rekening, penetapan prioritas penagihan, pelaporan keuangan berkala.</td>
      <td>Modul import Excel LPP/DSR dengan auto-reconciliation, deteksi anomali penomoran kasir otomatis, dan tombol "Dispatch Tiket Penagihan Wilayah".</td>
    </tr>
    <tr>
      <td><strong>Kasir Loket</strong><br><em>(Neni Lisnawati)</em></td>
      <td>Melayani pembayaran pelanggan, menerbitkan kuitansi/LPP harian, validasi identitas sambungan pelanggan.</td>
      <td>Pencarian instan ID pelanggan (100XXXX/XXXX), validasi anti-duplikasi pembayaran, dan integrasi penutupan buku harian otomatis.</td>
    </tr>
    <tr>
      <td><strong>Petugas Lapangan / Kolektor</strong><br><em>(Fajar, Gugum, Andi, Apri)</em></td>
      <td>Distribusi surat penagihan fisik, inspeksi stan meter lapangan, eksekusi segel/cabut meter, pelaporan status rumah.</td>
      <td>Aplikasi Android offline-first, navigasi GPS lokasi pelanggan, formulir input stan fisik + foto meter ber-watermark waktu/koordinat.</td>
    </tr>
  </tbody>
</table>

<h2>2.2. Sasaran Terukur (Objectives & Key Results - OKRs)</h2>
<table>
  <thead>
    <tr>
      <th>Objektif (Sasaran)</th>
      <th>Key Results (Indikator Keberhasilan)</th>
      <th>Kondisi Awal (Baseline)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>O1: Pemulihan Piutang Menunggak DSR</strong></td>
      <td>Collection rate sisa piutang September naik dari 9,96% menjadi <strong>&ge; 50%</strong> dalam tempo 21 hari kerja pasca-closing.</td>
      <td>9,96% (Hanya Rp 33,64 Jt tertagih dari Rp 337,79 Jt).</td>
    </tr>
    <tr>
      <td><strong>O2: Audit Tuntas Water Meter Stan 0 m&sup3;</strong></td>
      <td><strong>100%</strong> pelanggan dengan stan meter 0 m&sup3; terverifikasi fisik di lapangan (meter macet vs rumah kosong).</td>
      <td>0% terverifikasi (58,3% meter nihil di Kp. Gelarsari tanpa tiket).</td>
    </tr>
    <tr>
      <td><strong>O3: Integritas Rekonsiliasi Kasir & DSR</strong></td>
      <td><strong>100%</strong> data LPP terrekonsiliasi otomatis dengan DSR dan 0% kesalahan nomor urut kasir.</td>
      <td>Ada lonjakan nomor kasir (No 19 hilang di Sheet LPP 30 Okt).</td>
    </tr>
    <tr>
      <td><strong>O4: Akurasi & Bukti Kunjungan Lapangan</strong></td>
      <td><strong>&ge; 95%</strong> tiket lapangan terdokumentasi foto meteran air dan koordinat GPS akurat (&lt; 20 meter).</td>
      <td>Pencatatan manual kertas tanpa koordinat geolokasi.</td>
    </tr>
  </tbody>
</table>

<!-- SECTION 3 -->
<div class="page-break"></div>
<h1>3. Peta Kapabilitas & Pembagian Wilayah Kerja</h1>

<h2>3.1. Capability Map (Modul Sistem)</h2>
<table>
  <thead>
    <tr>
      <th style="width: 16%;">Modul ID</th>
      <th style="width: 26%;">Nama Modul</th>
      <th style="width: 44%;">Fungsi Utama</th>
      <th style="width: 14%;">Dependensi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>MOD-RECON</code></td>
      <td><strong>Billing & LPP Reconciler</strong></td>
      <td>Engine parser file Excel multi-sheet, validasi formula & saldo, deteksi anomali nomor urut, auto-marking rekening lunas.</td>
      <td>Setup.gs (DB)</td>
    </tr>
    <tr>
      <td><code>MOD-DISPATCH</code></td>
      <td><strong>Smart Ticket Dispatcher</strong></td>
      <td>Konversi otomatis sisa DSR menjadi tiket penagihan massal, routing otomatis ke petugas berdasarkan kode wilayah 4 digit.</td>
      <td><code>MOD-RECON</code></td>
    </tr>
    <tr>
      <td><code>MOD-METERAUDIT</code></td>
      <td><strong>Stan-Zero & Meter Inspector</strong></td>
      <td>Deteksi stan awal = stan akhir, pembuatan tiket inspeksi meter kategori khusus (<code>cat-005</code>), klasifikasi kondisi fisik meteran.</td>
      <td><code>MOD-DISPATCH</code></td>
    </tr>
    <tr>
      <td><code>MOD-MOBILECOLLECT</code></td>
      <td><strong>Mobile Field Collector</strong></td>
      <td>UI Android petugas: daftar tagihan wilayah, geotagging GPS, upload foto meter ber-watermark, formulir komitmen janji bayar.</td>
      <td>Capacitor, <code>Tickets</code></td>
    </tr>
    <tr>
      <td><code>MOD-DASHBOARD</code></td>
      <td><strong>Executive Billing Dashboard</strong></td>
      <td>Visualisasi perbandingan target DRD (Rp 2,86 M) vs LPP vs DSR, pemeringkatan top penunggak, heatmap kepatuhan wilayah.</td>
      <td><code>MOD-RECON</code>, Reports</td>
    </tr>
  </tbody>
</table>

<h2>3.2. Matriks Penugasan Wilayah Cabang Cikembar (Faktual September 2026)</h2>
<p>
  Berdasarkan data rekening September dan konfigurasi master wilayah di sistem:
</p>
<table>
  <thead>
    <tr>
      <th>Kode Wilayah</th>
      <th>Nama Wilayah Cakupan</th>
      <th>Petugas Penanggung Jawab</th>
      <th>Jumlah DSR</th>
      <th>Terbayar Closing</th>
      <th>Sisa Piutang (Rp)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1001</strong></td>
      <td>Kamp. Cikoneng</td>
      <td><strong>FAJAR</strong></td>
      <td>404 rek</td>
      <td>48 rek (13,95%)</td>
      <td>Rp 44.121.920 (356 rek)</td>
    </tr>
    <tr>
      <td><strong>1002</strong></td>
      <td>Kp. Bj Kopo - Cibungur - Ubrug</td>
      <td><strong>GUGUM</strong></td>
      <td>126 rek</td>
      <td>11 rek (11,86%)</td>
      <td>Rp 14.510.940 (115 rek)</td>
    </tr>
    <tr>
      <td><strong>1003</strong></td>
      <td>Kamp. Ubrug I</td>
      <td><strong>GUGUM</strong></td>
      <td>543 rek</td>
      <td>37 rek (8,32%)</td>
      <td>Rp 70.349.816 (506 rek)</td>
    </tr>
    <tr>
      <td><strong>1004</strong></td>
      <td>Kamp. Ubrug II</td>
      <td><strong>GUGUM</strong></td>
      <td>774 rek</td>
      <td>71 rek (13,06%)</td>
      <td>Rp 88.516.628 (703 rek)</td>
    </tr>
    <tr>
      <td><strong>1005</strong></td>
      <td>Hegar Manah</td>
      <td><strong>GUGUM</strong></td>
      <td>363 rek</td>
      <td>19 rek (6,00%)</td>
      <td>Rp 39.274.720 (344 rek)</td>
    </tr>
    <tr>
      <td><strong>1006</strong></td>
      <td>Kamp. Salamijncang 2</td>
      <td><strong>GUGUM</strong></td>
      <td>435 rek</td>
      <td>17 rek (4,73%)</td>
      <td>Rp 47.378.120 (418 rek)</td>
    </tr>
    <tr>
      <td><strong>3012</strong></td>
      <td>Kamp. Gelarsari (Wilayah III)</td>
      <td><strong>FAJAR</strong></td>
      <td>12 rek</td>
      <td>0 rek (0,00%)</td>
      <td>Rp 2.055.360 (12 rek)</td>
    </tr>
    <tr>
      <td colspan="3"><strong>TOTAL CABANG CIKEMBAR (SAMPEL ANALISIS)</strong></td>
      <td><strong>2.645 rek</strong></td>
      <td><strong>203 rek (9,96%)</strong></td>
      <td><strong>Rp 304.152.144 (2.442 rek)</strong></td>
    </tr>
  </tbody>
</table>

<!-- SECTION 4 -->
<div class="page-break"></div>
<h1>4. Kebutuhan Fungsional Sistem (Functional Requirements)</h1>

<h2>4.1. FR-01: Engine Parser & Rekonsiliasi Excel (MOD-RECON)</h2>
<ul>
  <li><strong>Multi-Sheet Parsing</strong>: Sistem dapat menerima upload file Excel (<code>.xlsx</code>) yang berisi sheet LPP harian dan sheet DSR bulanan.</li>
  <li><strong>Validasi Saldo & Kolom</strong>:
    <ul>
      <li>Mengekstrak kolom: ID Pelanggan, Nama, Golongan Tarif, Periode Rekening, Harga Air, Beban Tetap, Denda, dan Total.</li>
      <li>Memverifikasi formula rekonsiliasi: <code>Total = Harga Air + Beban Tetap + Denda</code>.</li>
      <li>Mendeteksi lonjakan nomor urut kasir secara otomatis dan memberi catatan audit di dashboard.</li>
    </ul>
  </li>
  <li><strong>Auto-Reconciliation Engine</strong>:
    <ul>
      <li>Mencocokkan ID pelanggan antara LPP dan DSR secara instan (100% akurasi ID).</li>
      <li>Menghasilkan daftar saldo piutang bersih pasca-closing (2.442 pelanggan belum bayar).</li>
      <li>Menyediakan tombol download <strong>DSR Bersih Pasca Closing (.xlsx)</strong> untuk arsip resmi.</li>
    </ul>
  </li>
</ul>

<h2>4.2. FR-02: Otomatisasi Dispatch Tiket Penagihan (MOD-DISPATCH)</h2>
<ul>
  <li><strong>Batch Ticket Generator</strong>:
    <ul>
      <li>Mengonversi seluruh data sisa DSR menjadi tiket penagihan di tabel <code>Tickets</code> sistem FieldTicket.</li>
      <li>Penetapan prioritas tiket secara pintar:
        <ul>
          <li><span class="badge badge-p0">KRITIS</span>: Tunggakan &gt; Rp 500.000 atau golongan Niaga/Instansi (NK/NB/TI).</li>
          <li><span class="badge badge-p1">TINGGI</span>: Kelompok RT. C dengan konsumsi air &gt; 30 m&sup3;.</li>
          <li><span class="badge badge-p2">SEDANG</span>: Kelompok RT. B standar (pemakaian minimum).</li>
        </ul>
      </li>
    </ul>
  </li>
  <li><strong>Pemetaan Petugas Otomatis</strong>:
    <ul>
      <li>Prefix 1001 & 3012 otomatis ditugaskan ke user <strong>Fajar</strong>.</li>
      <li>Prefix 1002, 1003, 1004, 1005, 1006 otomatis ditugaskan ke user <strong>Gugum</strong>.</li>
      <li>Notifikasi push langsung masuk ke aplikasi smartphone masing-masing petugas.</li>
    </ul>
  </li>
</ul>

<h2>4.3. FR-03: Modul Audit Stan 0 m&sup3; & Investigasi Fisik (MOD-METERAUDIT)</h2>
<ul>
  <li><strong>Filter Stan Tetap</strong>: Sistem mendeteksi otomatis meteran dengan rumus <code>Stan Akhir - Stan Awal = 0</code>.</li>
  <li><strong>Tiket Khusus Pemeriksaan Fisik</strong>:
    <ul>
      <li>Diterbitkan dengan kategori <code>cat-005 (Water Meter Rusak/Mati)</code> dan tag <code>STAN_NOL</code>.</li>
      <li>Formulir hasil audit lapangan mewajibkan teknisi memilih salah satu opsi:
        <ol>
          <li><code>METER_MACET</code>: Air mengalir deras saat kran dibuka tapi stan tidak berputar ? Terbitkan rekomendasi penggantian meter.</li>
          <li><code>RUMAH_KOSONG</code>: Properti kosong / pagar terkunci ? Catat keterangan warga sekitar dan koordinat GPS.</li>
          <li><code>PENGGUNAAN_MINIMAL</code>: Rumah berpenghuni tetapi jarang digunakan (konsumsi nihil riil).</li>
          <li><code>INDIKASI_BYPASS</code>: Terdapat percabangan pipa sebelum water meter.</li>
        </ol>
      </li>
    </ul>
  </li>
</ul>

<h2>4.4. FR-04: Fitur Kolektor Lapangan Mobile (MOD-MOBILECOLLECT)</h2>
<ul>
  <li><strong>Offline-First Architecture</strong>: Daftar tagihan dan data pelanggan tersimpan di IndexedDB smartphone, memungkinkan teknisi bekerja di daerah blind-spot (Kopobojong, Ubrug pelosok).</li>
  <li><strong>Input Stan Meter Terkini</strong>: Teknisi dapat mencatat angka stan riil saat kunjungan fisik sebagai pembanding data billing.</li>
  <li><strong>Geotagging & Kamera Wajib</strong>: Tombol submit mewajibkan pengambilan foto water meter langsung (kamera in-app) dengan perekaman otomatis latitude, longitude, dan timestamp.</li>
  <li><strong>Formulir Janji Bayar</strong>: Bila pelanggan belum melunasi, teknisi menginput tanggal janji bayar yang otomatis masuk reminder kasir.</li>
</ul>

<!-- SECTION 5 -->
<div class="page-break"></div>
<h1>5. Arsitektur Data, Skema & Standar Keamanan</h1>

<h2>5.1. Struktur Data Tambahan (Google Sheets Database)</h2>

<h3>Sheet Baru: <code>Billing_Closing</code></h3>
<table>
  <thead>
    <tr>
      <th>Field Name</th>
      <th>Type</th>
      <th>Constraint</th>
      <th>Deskripsi</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>closing_id</code></td><td>String</td><td>PK, Unique</td><td>Kode unik penutupan kasir (e.g., <code>CLS-202610-01</code>)</td></tr>
    <tr><td><code>periode_rek</code></td><td>String</td><td>Not Null</td><td>Bulan tagihan (e.g., <code>9/2026</code>)</td></tr>
    <tr><td><code>tanggal_lpp</code></td><td>Date</td><td>Not Null</td><td>Tanggal penerimaan kasir (e.g., <code>2026-10-29</code>)</td></tr>
    <tr><td><code>total_lembar</code></td><td>Integer</td><td>&gt; 0</td><td>Jumlah transaksi lembar rekening (e.g., 104)</td></tr>
    <tr><td><code>total_pokok</code></td><td>Number</td><td>&ge; 0</td><td>Harga air + Beban tetap (Rp)</td></tr>
    <tr><td><code>total_denda</code></td><td>Number</td><td>&ge; 0</td><td>Total denda keterlambatan (Rp)</td></tr>
    <tr><td><code>grand_total</code></td><td>Number</td><td>&gt; 0</td><td>Total uang masuk loket kasir (Rp)</td></tr>
    <tr><td><code>nama_kasir</code></td><td>String</td><td>Not Null</td><td>Nama kasir penanggung jawab</td></tr>
    <tr><td><code>audit_status</code></td><td>Enum</td><td>Valid/Alert</td><td>Status keutuhan nomor urut kasir</td></tr>
  </tbody>
</table>

<h3>Penambahan Kolom pada Sheet: <code>Tickets</code></h3>
<table>
  <thead>
    <tr>
      <th>Field Tambahan</th>
      <th>Type</th>
      <th>Default</th>
      <th>Keterangan Fungsi</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>tipe_tiket</code></td><td>Enum</td><td><code>TEKNIK</code></td><td><code>TEKNIK</code> | <code>PENAGIHAN</code> | <code>AUDIT_METER</code></td></tr>
    <tr><td><code>nominal_pokok</code></td><td>Number</td><td>0</td><td>Tagihan pokok rekening (Rp)</td></tr>
    <tr><td><code>nominal_denda</code></td><td>Number</td><td>0</td><td>Denda keterlambatan (Rp)</td></tr>
    <tr><td><code>total_tagihan</code></td><td>Number</td><td>0</td><td>Total piutang berjalan (Rp)</td></tr>
    <tr><td><code>stan_awal_meter</code></td><td>Number</td><td>0</td><td>Stan meter awal buku DRD</td></tr>
    <tr><td><code>stan_akhir_meter</code></td><td>Number</td><td>0</td><td>Stan meter akhir buku DRD</td></tr>
    <tr><td><code>stan_cek_lapangan</code></td><td>Number</td><td>null</td><td>Angka meteran riil yang dibaca teknisi</td></tr>
    <tr><td><code>hasil_kunjungan</code></td><td>Enum</td><td>null</td><td><code>LUNAS_LOKET</code> | <code>JANJI_BAYAR</code> | <code>RUMAH_KOSONG</code> | <code>METER_MACET</code> | <code>SEGEL</code></td></tr>
    <tr><td><code>tgl_janji_bayar</code></td><td>Date</td><td>null</td><td>Komitmen tanggal bayar pelanggan</td></tr>
  </tbody>
</table>

<h2>5.2. Keamanan & Kontrol Akses (Security & RBAC)</h2>
<ul>
  <li><strong>Pembagian Peran Ketat (RBAC)</strong>:
    <ul>
      <li><code>admin</code> / <code>kaur</code>: Akses penuh upload file LPP/DSR, eksekusi rekonsiliasi, dan dispatch tiket penagihan massal.</li>
      <li><code>petugas_teknik</code>: Hanya dapat melihat tiket yang di-assign ke wilayahnya, mengupdate stan riil, memilih hasil kunjungan, dan melampirkan foto.</li>
      <li><code>kasir</code>: Akses ke menu penerimaan loket dan pencarian saldo tunggakan pelanggan.</li>
    </ul>
  </li>
  <li><strong>Integritas Data & Audit Trail</strong>:
    <ul>
      <li>Setiap file Excel yang diunggah disimpan arsipnya di Google Drive folder <code>Billing_Archives/</code>.</li>
      <li>Pencatatan riwayat setiap perubahan status tiket di tabel <code>Audit_Log</code> (Actor, Timestamp, Old Value, New Value).</li>
    </ul>
  </li>
</ul>

<!-- SECTION 6 -->
<div class="page-break"></div>
<h1>6. Rencana Implementasi & Lembar Persetujuan</h1>

<h2>6.1. Timeline Rilis (Roadmap)</h2>
<table>
  <thead>
    <tr>
      <th style="width: 15%;">Sprint</th>
      <th style="width: 45%;">Ruang Lingkup Pekerjaan</th>
      <th style="width: 25%;">Target Selesai</th>
      <th style="width: 15%;">Prioritas</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Sprint 1</strong></td>
      <td>
        &bull; Parser Excel multi-sheet (LPP harian & DSR September).<br>
        &bull; Skema DB baru (<code>Billing_Closing</code> & perluasan <code>Tickets</code>).<br>
        &bull; Algoritma rekonsiliasi & validator nomor urut kasir.
      </td>
      <td>10 November 2026</td>
      <td><span class="badge badge-p0">P0 - Kritis</span></td>
    </tr>
    <tr>
      <td><strong>Sprint 2</strong></td>
      <td>
        &bull; Smart Dispatcher: Penugasan otomatis tiket sisa DSR per wilayah.<br>
        &bull; Generator tiket khusus audit stan 0 m&sup3; (Kp. Gelarsari).<br>
        &bull; UI Web Admin: Tab Rekonsiliasi Billing & Kasir.
      </td>
      <td>17 November 2026</td>
      <td><span class="badge badge-p0">P0 - Kritis</span></td>
    </tr>
    <tr>
      <td><strong>Sprint 3</strong></td>
      <td>
        &bull; Pembaruan Mobile App Android (Capacitor): Mode Kolektor Lapangan.<br>
        &bull; Formulir input stan meter fisik + validasi kamera GPS.<br>
        &bull; Sinkronisasi offline-to-online data lapangan.
      </td>
      <td>24 November 2026</td>
      <td><span class="badge badge-p1">P1 - Tinggi</span></td>
    </tr>
    <tr>
      <td><strong>Sprint 4</strong></td>
      <td>
        &bull; Executive KPI Dashboard (Target DRD Rp 2,86 M vs Realisasi).<br>
        &bull; Pengujian UAT bersama Kasir & Kaur Keuangan Cabang.<br>
        &bull; Build APK Produksi v2.8.0 & Pelatihan Petugas Lapangan.
      </td>
      <td>30 November 2026</td>
      <td><span class="badge badge-p2">P2 - Sedang</span></td>
    </tr>
  </tbody>
</table>

<h2>6.2. Kriteria Penerimaan Produk (Acceptance Criteria)</h2>
<ol>
  <li>Sistem berhasil memproses file <code>LPP CLOSSING.xlsx</code> (2.645 baris DSR + 203 baris LPP) secara nir-kesalahan dalam tempo &lt; 15 detik.</li>
  <li>Seluruh 2.442 rekening piutang pasca-closing berhasil terdistribusi otomatis menjadi tiket penagihan kepada teknisi wilayah yang berwenang (Fajar dan Gugum).</li>
  <li>12 pelanggan Kp. Gelarsari dengan 7 meteran ber-stan 0 m&sup3; berhasil diterbitkan menjadi tiket inspeksi fisik berkategori <code>cat-005</code>.</li>
  <li>Petugas lapangan dapat menyelesaikan dan mendokumentasikan kunjungan penagihan serta foto meteran secara offline di aplikasi mobile.</li>
</ol>

<div class="signature-box">
  <div>
    <p>Dibuat Oleh:</p>
    <div class="sig-line">Tim Pengembang Sistem</div>
    <div class="sig-role">Lead Product Engineer</div>
  </div>
  <div>
    <p>Ditinjau Oleh:</p>
    <div class="sig-line">Yunita Krisdianti Utomo</div>
    <div class="sig-role">Plh. Kaur Admin & Keuangan</div>
  </div>
  <div>
    <p>Disetujui Oleh:</p>
    <div class="sig-line">Deden Agustian, S.IP</div>
    <div class="sig-role">Kepala Cabang Cikembar</div>
  </div>
</div>

</body>
</html>
`;

const targetHtml = 'C:/Users/MSI/.gemini/antigravity/scratch/pdam-fieldticket/PRD-PDAM-FieldTicket.html';
fs.writeFileSync(targetHtml, htmlContent, 'utf8');
console.log('Successfully generated HTML at:', targetHtml);
