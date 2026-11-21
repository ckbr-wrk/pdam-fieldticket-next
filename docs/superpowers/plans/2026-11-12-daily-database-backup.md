# Fitur Backup Harian Database PDAM Field Ticket - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

---

### Tujuan
Mengimplementasikan sistem pencadangan (backup) harian otomatis dan manual untuk database Google Spreadsheet `PDAM FieldTicket - Database`, yang tersimpan rapi di subfolder Google Drive dengan retensi otomatis 30 hari serta antarmuka kontrol manual di panel Admin.

---

### Arsitektur & Komponen
1. **Backend Service (`Backup.gs`)**:
   - `_getOrCreateBackupFolder()`: Mengambil atau membuat folder Drive `📁 PDAM - FieldTicket Backup` di dalam folder project utama.
   - `performDatabaseBackup(actor)`: Menyalin Spreadsheet database utama, memberi stempel waktu (`Backup_Database_PDAM_YYYY-MM-DD_HHmmss`), memindahkan ke folder backup, mencatat properti sistem, dan menghapus cadangan yang lebih tua dari 30 hari.
   - `dailyDatabaseBackupCron()`: Handler time-driven trigger harian (GAS trigger) setiap hari jam 01:00-02:00 WIB.
   - `setupDailyBackupTrigger()`: Otomatisasi pendaftaran trigger Google Apps Script agar tidak ada duplikasi.
   - `getBackupInfo(token)`: Mengambil status backup terakhir dan daftar 5-10 file backup terbaru di folder Drive.
   - `runManualBackup(token)`: Endpoint yang dipanggil saat admin menekan tombol "Backup Sekarang".

2. **API Dispatcher (`Code.gs`)**:
   - Mendaftarkan aksi `getBackupInfo`, `runManualBackup`, dan `setupBackupTrigger` ke `doPost`.

3. **Frontend API (`frontend/api.js`)**:
   - Menambahkan method `getBackupInfo()`, `runManualBackup()`, dan `setupBackupTrigger()`.

4. **Frontend UI (`frontend/views/admin-categories.js`)**:
   - Menambahkan tab "Backup Database" di menu Master/Admin.
   - Kartu status: jadwal harian (01:00 WIB), waktu terakhir backup, nama file, retensi 30 hari.
   - Tombol "Backup Database Sekarang" dengan konfirmasi & indikator progress.
   - Tombol pintasan "Buka Folder di Drive".
   - Tabel riwayat file backup terbaru beserta tautan unduh/buka di Google Drive.

---

### Task Breakdown

- [x] **Task 1: Buat Modul Backend `Backup.gs`**
  - Buat file `Backup.gs` dengan logika pembuatan folder, penyalinan spreadsheet, pembersihan file > 30 hari, manajemen properti, dan trigger cron.
  - Verifikasi fungsi `performDatabaseBackup` dan `getBackupInfo` bekerja dengan baik.

- [x] **Task 2: Integrasikan ke `Code.gs` dan `Setup.gs`**
  - Daftarkan case router di `Code.gs` untuk `getBackupInfo`, `runManualBackup`, dan `setupBackupTrigger`.
  - Pasang pemanggilan otomatis `setupDailyBackupTrigger()` pada file inisialisasi agar trigger otomatis aktif.

- [x] **Task 3: Perbarui Frontend API (`frontend/api.js`)**
  - Tambahkan fungsi `API.getBackupInfo()`, `API.runManualBackup()`, dan `API.setupBackupTrigger()`.

- [x] **Task 4: Tambahkan Tab & Antarmuka di `frontend/views/admin-categories.js`**
  - Tambahkan tombol tab ketiga: "Backup Database" berdampingan dengan Kategori & Wilayah.
  - Buat fungsi renderer `_renderBackup()` yang menampilkan kartu status, tombol eksekusi manual, dan tabel riwayat backup di Google Drive.

- [x] **Task 5: Build, Verifikasi, & Deploy**
  - Jalankan `build.ps1` untuk memvalidasi kompilasi bundle HTML.
  - Lakukan `clasp push --force` dan `clasp deploy`.
  - Sinkronkan aset mobile via `npx cap sync android`.
  - Jalankan tes backup manual satu kali untuk memastikan file backup perdana berhasil tercipta di Google Drive.
