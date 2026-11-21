# PDAM FieldTicket — Cabang Cikembar (Next.js + Supabase Edition)

Sistem Informasi Manajemen Pelayanan Pengaduan & Tiket Lapangan untuk **PERUMDA Air Minum Tirta Jaya Mandiri Cabang Cikembar**, dimodernisasi menggunakan **Next.js 14 (App Router)** dan **Supabase (PostgreSQL & Storage)**.

---

## 🌟 Fitur Utama & Keunggulan Lingkungan Baru

1. **Stack Modern & Cepat:**
   - **Frontend & Server:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons.
   - **Database & Storage:** Supabase PostgreSQL & Storage Bucket (`ticket-photos`).
   - **Dual-Mode Architecture:** Dilengkapi *Hybrid In-Memory/Local Storage fallback* sehingga aplikasi dapat langsung dijalankan dan didemokan secara instan (`npm run dev`) tanpa wajib menunggu pengaturan Supabase Cloud.

2. **Manajemen Tiket & Workflow Lapangan:**
   - 7 Siklus Status Tiket: `BARU` ➔ `DITUGASKAN` ➔ `DALAM_PROSES` ⇌ `MENUNGGU` ➔ `SELESAI_DIKERJAKAN` ➔ `DITUTUP` / `DIBATALKAN`.
   - SLA Waktu Respons: **KRITIS (2 Jam)**, **TINGGI (6 Jam)**, **SEDANG (24 Jam)**, **RENDAH (72 Jam)** dengan alert otomatis.
   - Cetak SPK (Surat Perintah Kerja) Lapangan format resmi PDAM siap print / PDF.

3. **Geotagging GPS & Peta Sebaran Interaktif:**
   - Tombol tangkap koordinat GPS otomatis (Latitude, Longitude, Akurasi Meter).
   - Peta sebaran titik gangguan interaktif berbasis Leaflet & OpenStreetMap terpusat di Cikembar.

4. **Bukti Foto Dokumentasi 3 Tahap:**
   - Foto kondisi **SEBELUM**, **PROSES PENGERJAAN**, dan **SESUDAH TUNTAS**.
   - Dilengkapi kompresi gambar berbasis HTML5 Canvas untuk menghemat kuota internet petugas lapangan.

5. **6 Peran Pengguna (Role-Based Access Control):**
   - `admin` (Administrator Sistem)
   - `petugas_baca` (Petugas Pembaca Meter / Pelapor Lapangan)
   - `petugas_teknik` (Tim Teknisi Reaksi Cepat Lapangan)
   - `kaur` (Kepala Urusan Teknik & Distribusi)
   - `kas` (Kepala Sub-Bagian Layanan Pengaduan)
   - `kepala_cabang` (Pimpinan Cabang PDAM)

6. **Master 50 Wilayah Cikembar:**
   - Seluruh 50 wilayah resmi telah di-seed lengkap dan dipetakan ke 7 blok petugas pembaca meter (Gugum, Fajar, Andi, Apri, Zidan, Rivaldi, Rizal).

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### 1. Jalankan Mode Lokal (Langsung Pakai)
Aplikasi sudah siap dijalankan langsung di komputer lokal:
```bash
cd C:\Users\MSI\.gemini\antigravity\scratch\pdam-fieldticket-next
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

*Tips:* Anda dapat berganti peran kapan saja melalui menu profil di pojok kanan atas untuk menguji sudut pandang Admin, Pembaca Meter, Teknisi, maupun Kaur.

---

### 2. Menghubungkan ke Supabase Cloud (Produksi)

1. Buka dashboard [Supabase](https://supabase.com) dan buat project baru.
2. Buka menu **SQL Editor** di dashboard Supabase Anda.
3. Salin seluruh isi file [`supabase/schema.sql`](./supabase/schema.sql) dan jalankan (Run). Seluruh tabel, index, storage bucket `ticket-photos`, 50 wilayah, 6 kategori, dan akun pengguna default akan otomatis terbuat.
4. Buka menu **Project Settings ➔ API** di Supabase, lalu salin `Project URL` dan `anon / public key`.
5. Buka file `.env.local` pada folder project ini dan tempelkan:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_DATA_MODE=supabase
   ```
6. Restart server Next.js (`npm run dev`). Status badge di navbar akan otomatis berubah menjadi **Supabase Cloud Aktif**.

---

## 📁 Struktur Direktori Proyek

```
pdam-fieldticket-next/
├── public/                    # PWA Manifest & Aset Statis
├── src/
│   ├── app/
│   │   ├── admin/             # Panel Admin & Master Data
│   │   ├── map/               # Peta Sebaran Titik Gangguan GIS
│   │   ├── reports/           # Rekapitulasi Laporan & Ekspor CSV
│   │   ├── tickets/
│   │   │   ├── [id]/          # Detail Tiket, Progress, Foto & Workflow
│   │   │   │   └── print/     # Dokumen Cetak SPK Resmi PDAM
│   │   │   ├── new/           # Form Pembuatan Tiket Baru & Geotagging
│   │   │   └── page.tsx       # Daftar Tiket (Mode Kartu & Mode Tabel)
│   │   ├── globals.css        # Tailwind CSS & Print Media Styling
│   │   ├── layout.tsx         # Root Layout, Auth Provider, Navbar, MobileNav
│   │   └── page.tsx           # Dashboard Utama & KPI SLA Tracker
│   ├── components/            # Reusable UI (Navbar, MobileNav, Badges)
│   ├── context/               # AuthContext & Session Management
│   ├── lib/                   # Database Service & Supabase Client
│   │   ├── db.ts              # Hybrid Data Service (Cloud + Local Fallback)
│   │   ├── seed-data.ts       # 50 Wilayah Cikembar, Kategori & Akun Dummy
│   │   └── supabase.ts        # Supabase Client SDK Provider
│   └── types/                 # Definisi Tipe TypeScript
├── supabase/
│   └── schema.sql             # Skema PostgreSQL & Seed Data Supabase
├── .env.example               # Panduan Konfigurasi Environment
├── .env.local                 # Konfigurasi Lokal
└── package.json               # Dependensi & Script
```

---

*Hak Cipta © 2026 PERUMDA Air Minum Tirta Jaya Mandiri Cabang Cikembar.*
