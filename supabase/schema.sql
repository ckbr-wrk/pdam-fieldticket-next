-- ==============================================================================
-- PDAM FieldTicket — Supabase PostgreSQL Schema & Seed Migration
-- PERUMDA Air Minum Tirta Jaya Mandiri Cabang Cikembar
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. MASTER TABEL: KATEGORI GANGGUAN
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  grup TEXT NOT NULL,
  prioritas_default TEXT NOT NULL CHECK (prioritas_default IN ('KRITIS', 'TINGGI', 'SEDANG', 'RENDAH')),
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. MASTER TABEL: WILAYAH / BLOK DISTRIBUSI
CREATE TABLE IF NOT EXISTS wilayah (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  petugas TEXT,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABEL PENGGUNA (PROFILES)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'petugas_baca', 'petugas_teknik', 'kaur', 'kas', 'kepala_cabang')),
  wilayah_id TEXT REFERENCES wilayah(id) ON DELETE SET NULL,
  status_aktif BOOLEAN DEFAULT TRUE,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABEL UTAMA: TIKET PENGADUAN & LAPORAN LAPANGAN
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_tiket TEXT UNIQUE NOT NULL,
  pelapor_id TEXT NOT NULL,
  pelanggan_id TEXT,
  nama_pelanggan TEXT NOT NULL,
  no_hp TEXT,
  ukuran_pipa TEXT,
  kategori_id TEXT REFERENCES categories(id),
  wilayah_id TEXT REFERENCES wilayah(id),
  deskripsi TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  akurasi_gps DOUBLE PRECISION,
  prioritas TEXT NOT NULL CHECK (prioritas IN ('KRITIS', 'TINGGI', 'SEDANG', 'RENDAH')),
  status TEXT NOT NULL DEFAULT 'BARU' CHECK (status IN ('BARU', 'DITUGASKAN', 'DALAM_PROSES', 'MENUNGGU', 'SELESAI_DIKERJAKAN', 'DITUTUP', 'DIBATALKAN')),
  idempotency_key TEXT,
  print_count INT DEFAULT 0,
  last_printed_at TIMESTAMPTZ,
  last_printed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABEL PENUGASAN TEKNISI (ASSIGNMENTS)
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  assigned_by TEXT NOT NULL,
  assigned_to TEXT NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  catatan TEXT
);

-- 7. TABEL LOG PROGRESS / TIMELINE PENGERJAAN
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL,
  status_baru TEXT NOT NULL,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TABEL DOKUMENTASI FOTO (PHOTOS)
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  uploader_id TEXT NOT NULL,
  tipe_foto TEXT NOT NULL CHECK (tipe_foto IN ('SEBELUM', 'PROSES', 'SESUDAH')),
  file_url TEXT NOT NULL,
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. TABEL AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id TEXT,
  actor_id TEXT NOT NULL,
  aksi TEXT NOT NULL,
  nilai_sebelum TEXT,
  nilai_sesudah TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. TABEL NOTIFIKASI
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  ticket_id TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR HIGH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_tickets_nomor ON tickets(nomor_tiket);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_wilayah ON tickets(wilayah_id);
CREATE INDEX IF NOT EXISTS idx_tickets_prioritas ON tickets(prioritas);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_ticket ON progress(ticket_id);
CREATE INDEX IF NOT EXISTS idx_photos_ticket ON photos(ticket_id);

-- TRIGGER UPDATE TIMESTAMP
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tickets_modtime ON tickets;
CREATE TRIGGER update_tickets_modtime
BEFORE UPDATE ON tickets
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ==============================================================================
-- STORAGE BUCKET SETUP (Supabase Storage for Photos)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('ticket-photos', 'ticket-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Public Read
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'ticket-photos');

-- Storage Policy: Insert Access
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ticket-photos');

-- ==============================================================================
-- SEED DATA: KATEGORI
-- ==============================================================================
INSERT INTO categories (id, nama, grup, prioritas_default, aktif) VALUES
('cat-001', 'Kebocoran Pipa Dinas', 'Teknik', 'KRITIS', true),
('cat-002', 'Kebocoran Instalatur', 'Teknik', 'TINGGI', true),
('cat-003', 'Supply Air', 'Distribusi', 'TINGGI', true),
('cat-004', 'Pembayaran Melonjak', 'Administrasi', 'SEDANG', true),
('cat-005', 'Water Meter Rusak/Mati', 'Meter', 'SEDANG', true),
('cat-006', 'Lainnya', 'Umum', 'RENDAH', true)
ON CONFLICT (id) DO UPDATE SET
  nama = EXCLUDED.nama,
  grup = EXCLUDED.grup,
  prioritas_default = EXCLUDED.prioritas_default;

-- ==============================================================================
-- SEED DATA: 50 WILAYAH RESMI CABANG CIKEMBAR
-- ==============================================================================
INSERT INTO wilayah (id, nama, petugas, aktif) VALUES
-- Blok 1: Gugum (12 Wilayah)
('1002', '1002 - KP. BJ KOPO-CIBUNGUR-UBRUG', 'Gugum', true),
('1003', '1003 - KAMP. UBRUG I', 'Gugum', true),
('1004', '1004 - KAMP. UBRUG II', 'Gugum', true),
('1005', '1005 - HEGAR MANAH', 'Gugum', true),
('1006', '1006 - KAMP. SALAMIJNCANG 2', 'Gugum', true),
('1009', '1009 - DS. GIRIJAYA', 'Gugum', true),
('1010', '1010 - DAMARRAJA', 'Gugum', true),
('2001', '2001 - KAMP. SUKAHARJA', 'Gugum', true),
('2002', '2002 - KAMP. SUKAHARJA-LEBAKSARI', 'Gugum', true),
('2003', '2003 - KAMP. SUKASARI-SINDANGSARI', 'Gugum', true),
('2004', '2004 - KAMP. SIMPENAN', 'Gugum', true),
('2005', '2005 - KAMP. PAWAGAN', 'Gugum', true),

-- Blok 2: Fajar (9 Wilayah)
('1001', '1001 - KAMP. CIKONENG', 'Fajar', true),
('1008', '1008 - KP. MANGGA DUA-SINDANG KERTA', 'Fajar', true),
('3008', '3008 - CIJAMBE', 'Fajar', true),
('3009', '3009 - KP. CILANDAK - LIO', 'Fajar', true),
('3010', '3010 - BANTAR GADUNG PASEPAN I', 'Fajar', true),
('3011', '3011 - PERUM SME BAITI JANNATI', 'Fajar', true),
('3012', '3012 - KP. GELARSARI', 'Fajar', true),
('3014', '3014 - TARISI CITAMBANG', 'Fajar', true),
('4016', '4016 - PERUM. BUMI CIKEMBANG', 'Fajar', true),

-- Blok 3: Andi (10 Wilayah)
('1007', '1007 - KP. SOBOG KP. BARU SUKARESMI', 'Andi', true),
('3001', '3001 - KAMP. SELAGEDANG-CIGOMBONG', 'Andi', true),
('3002', '3002 - KAMP. CIGOMBONG', 'Andi', true),
('3004', '3004 - KAMP. WARUNGKIARA', 'Andi', true),
('3005', '3005 - KAMP. WARUNGKIARA 02', 'Andi', true),
('3006', '3006 - WARUNGKIARA-BABAKAN', 'Andi', true),
('3007', '3007 - BAED I', 'Andi', true),
('3013', '3013 - BAED II', 'Andi', true),
('8014', '8014 - BOJONGPARI', 'Andi', true),
('8015', '8015 - KP. MANGUNJAYA', 'Andi', true),

-- Blok 4: Apri (10 Wilayah)
('4001', '4001 - CICATIH', 'Apri', true),
('4002', '4002 - KAMP. CIKEMBANG I', 'Apri', true),
('4004', '4004 - KAMP. CIKEMBANG II', 'Apri', true),
('4006', '4006 - KAMP. CIARENGKOK', 'Apri', true),
('4007', '4007 - KAMP. CIARENGKOK-CIKAMANTRI', 'Apri', true),
('4012', '4012 - KAMP. CITENGAH-SUKAMULYA', 'Apri', true),
('4013', '4013 - KAMP. CIPETIR DS. SUKAMULYA', 'Apri', true),
('4015', '4015 - KAMP. CIBONGGOM', 'Apri', true),
('5001', '5001 - KP. SUKAMANTRI-CIARENGKOK', 'Apri', true),
('5002', '5002 - KAMP. SIMPENAN 02', 'Apri', true),

-- Blok 5: Zidan (7 Wilayah)
('4003', '4003 - KAMP. KEBON JERUK', 'Zidan', true),
('4005', '4005 - KAMP. CIMANGGU', 'Zidan', true),
('5004', '5004 - KAMP. CIKEMBAR I', 'Zidan', true),
('5007', '5007 - KAMP. CIKEMBAR IV', 'Zidan', true),
('6006', '6006 - SAMPORA-CIBODAS I', 'Zidan', true),
('6007', '6007 - SAMPORA-CIBODAS II', 'Zidan', true),
('6008', '6008 - PERUM. PERMATA INDAH SAMPORA', 'Zidan', true),

-- Blok 6: Rivaldi (7 Wilayah)
('4008', '4008 - KAMP. CIANGSANA - SUKAMULYA', 'Rivaldi', true),
('4009', '4009 - PERUM. CIKEMBAR RESIDENCE', 'Rivaldi', true),
('4010', '4010 - CIMENTENG', 'Rivaldi', true),
('4011', '4011 - KAMP. CIANGSANA 2', 'Rivaldi', true),
('5005', '5005 - KAMP. CIKEMBAR II', 'Rivaldi', true),
('6003', '6003 - MEKAR SARI-BJ WARUNG', 'Rivaldi', true),
('6004', '6004 - BJ KIDUL-BJ WARUNG-S.TUJUH', 'Rivaldi', true),

-- Blok 7: Rizal (8 Wilayah)
('5003', '5003 - KAMP. CILANGKAP', 'Rizal', true),
('5006', '5006 - KAMP. CIKEMBAR III', 'Rizal', true),
('5008', '5008 - KAMP. PIPINJIL-CIHUNI', 'Rizal', true),
('5009', '5009 - KP. CIKATE-PALIMABELAS', 'Rizal', true),
('5010', '5010 - KP. TEGAL PANJANG-DS. SUKAMAJU', 'Rizal', true),
('6001', '6001 - KP. PS GABIG-GN GADUNG', 'Rizal', true),
('6002', '6002 - MK. SARI CIKAREO-GABIG BJK', 'Rizal', true),
('6005', '6005 - SAMPORA NEGLASARI-CIBODAS', 'Rizal', true)
ON CONFLICT (id) DO UPDATE SET
  nama = EXCLUDED.nama,
  petugas = EXCLUDED.petugas;

-- ==============================================================================
-- SEED DATA: PENGGUNA DEFAULT
-- ==============================================================================
INSERT INTO users (user_id, nama, email, role, wilayah_id, status_aktif, password_hash) VALUES
('usr-admin-01', 'Administrator Sistem', 'admin@pdam.local', 'admin', NULL, true, 'Admin@123!'),
('usr-kaur-01', 'Kaur Teknik & Distribusi', 'kaur@pdam.local', 'kaur', NULL, true, 'Kaur@123!'),
('usr-baca-01', 'Gugum (Pembaca Meter Blok 1)', 'gugum@pdam.local', 'petugas_baca', '1002', true, 'Gugum@123!'),
('usr-baca-02', 'Fajar (Pembaca Meter Blok 2)', 'fajar@pdam.local', 'petugas_baca', '1001', true, 'Fajar@123!'),
('usr-teknik-01', 'Tim Teknisi Reaksi Cepat', 'teknisi@pdam.local', 'petugas_teknik', NULL, true, 'Teknisi@123!'),
('usr-kas-01', 'Kas Seksi Pengaduan', 'kas@pdam.local', 'kas', NULL, true, 'Kas@123!'),
('usr-kacab-01', 'Kepala Cabang Cikembar', 'kacab@pdam.local', 'kepala_cabang', NULL, true, 'Kacab@123!')
ON CONFLICT (user_id) DO UPDATE SET
  nama = EXCLUDED.nama,
  role = EXCLUDED.role;


-- ==============================================================================
-- SEED DATA: 50 TIKET REALISTIS CABANG CIKEMBAR
-- ==============================================================================
INSERT INTO tickets (id, nomor_tiket, pelapor_id, pelanggan_id, nama_pelanggan, no_hp, ukuran_pipa, kategori_id, wilayah_id, deskripsi, lat, lng, akurasi_gps, prioritas, status, created_at, updated_at) VALUES
(uuid_generate_v4(), 'FT-202611-D001', 'usr-baca-01', '100101000', 'Ahmad Suhendar', '08121000000', '1/2 Inch', 'cat-001', '1001', 'Pipa dinas bocor sembur di depan rumah warga RT 02/03 dekat gapura desa, air meluap ke jalan.', -6.985, 106.782, 6.5, 'KRITIS', 'BARU', '2026-10-26T08:00:00.000Z', '2026-10-26T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D002', 'usr-baca-02', '100201001', 'Ibu Hj. Cucu Rohaeti', '08131012345', '3/4 Inch', 'cat-002', '1002', 'Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman.', -6.9862, 106.7843, 7.7, 'TINGGI', 'BARU', '2026-10-26T20:00:00.000Z', '2026-10-26T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D003', 'usr-baca-01', '100301002', 'H. Maman Sulaeman', '08141024690', NULL, 'cat-003', '1003', 'Air mengalir keruh kekuningan bercampur endapan setelah ada pekerjaan pipa utama.', -6.9874, 106.7866, 8.9, 'TINGGI', 'BARU', '2026-10-27T08:00:00.000Z', '2026-10-27T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D004', 'usr-baca-02', '100401003', 'Dede Rustandi', '08151037035', NULL, 'cat-004', '1004', 'Ada dugaan kebocoran dalam instalasi pipa rumah yang membuat tagihan melonjak.', -6.9886, 106.7889, 10.1, 'SEDANG', 'BARU', '2026-10-27T20:00:00.000Z', '2026-10-27T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D005', 'usr-baca-01', '100501004', 'Hj. Siti Rohmah', '08161049380', NULL, 'cat-005', '1005', 'Angka stan meter macet total tidak berputar walaupun kran air sedang digunakan.', -6.9898, 106.7912, 11.3, 'SEDANG', 'BARU', '2026-10-28T08:00:00.000Z', '2026-10-28T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D006', 'usr-baca-02', '100601005', 'Endang Koswara', '08171061725', NULL, 'cat-006', '1006', 'Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.', -6.991, 106.7995, 12.5, 'RENDAH', 'BARU', '2026-10-28T20:00:00.000Z', '2026-10-28T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D007', 'usr-baca-01', '100801006', 'Ujang Supriatna', '08181074070', '1/2 Inch', 'cat-001', '1008', 'Pipa dinas bocor sembur di depan rumah warga RT 02/03 dekat gapura desa, air meluap ke jalan.', -6.9922, 106.8018, 13.7, 'KRITIS', 'BARU', '2026-10-29T08:00:00.000Z', '2026-10-29T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D008', 'usr-baca-02', '100901007', 'Bapak Ade Komarudin', '08191086415', '3/4 Inch', 'cat-002', '1009', 'Pipa instalatur bocor halus di bawah pondasi pagar rumah konsumen.', -6.999, 106.8041, 14.9, 'TINGGI', 'BARU', '2026-10-29T20:00:00.000Z', '2026-10-29T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D009', 'usr-baca-01', '101001008', 'Yayan Heryanto', '08121098760', NULL, 'cat-003', '1010', 'Aliran air mati total sejak 2 hari lalu di daerah ketinggian/ujung jaringan blok.', -7.0002, 106.8064, 6.5, 'TINGGI', 'BARU', '2026-10-30T08:00:00.000Z', '2026-10-30T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D010', 'usr-baca-02', '200101009', 'Ibu Nunung Nurjanah', '08131111105', NULL, 'cat-004', '2001', 'Pelanggan mengajukan keberatan tagihan bulan ini naik tinggi, mohon cek stan meter.', -7.0014, 106.8087, 7.7, 'SEDANG', 'BARU', '2026-10-30T20:00:00.000Z', '2026-10-30T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D011', 'usr-baca-01', '200201010', 'Rahmat Hidayat', '08141123450', NULL, 'cat-005', '2002', 'Jarum indikator meteran patah dan segel meter terlepas.', -7.0026, 106.817, 8.9, 'SEDANG', 'BARU', '2026-10-31T08:00:00.000Z', '2026-10-31T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D012', 'usr-baca-02', '300401011', 'Asep Saepulloh', '08151135795', NULL, 'cat-006', '3004', 'Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.', -7.0038, 106.8193, 10.1, 'RENDAH', 'BARU', '2026-10-31T20:00:00.000Z', '2026-10-31T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D013', 'usr-baca-01', '300801012', 'Ibu Ai Maryati', '08161148140', '1/2 Inch', 'cat-001', '3008', 'Pipa dinas bocor sembur di depan rumah warga RT 02/03 dekat gapura desa, air meluap ke jalan.', -7.005, 106.7796, 11.3, 'KRITIS', 'BARU', '2026-11-01T08:00:00.000Z', '2026-11-01T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D014', 'usr-baca-02', '400101013', 'Cecep Gunawan', '08171160485', '3/4 Inch', 'cat-002', '4001', 'Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman.', -7.0062, 106.7819, 12.5, 'TINGGI', 'BARU', '2026-11-01T20:00:00.000Z', '2026-11-01T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D015', 'usr-baca-01', '500301014', 'Agus Setiawan', '08181172830', NULL, 'cat-003', '5003', 'Air mengalir keruh kekuningan bercampur endapan setelah ada pekerjaan pipa utama.', -7.013, 106.7842, 13.7, 'TINGGI', 'BARU', '2026-11-02T08:00:00.000Z', '2026-11-02T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D016', 'usr-baca-02', '100101015', 'Bapak Deden Syarif', '08191185175', NULL, 'cat-004', '1001', 'Ada dugaan kebocoran dalam instalasi pipa rumah yang membuat tagihan melonjak.', -6.9842, 106.7925, 14.9, 'SEDANG', 'DITUGASKAN', '2026-11-02T20:00:00.000Z', '2026-11-02T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D017', 'usr-baca-01', '100201016', 'Ibu Lilis Suryani', '08121197520', NULL, 'cat-005', '1002', 'Angka stan meter macet total tidak berputar walaupun kran air sedang digunakan.', -6.9854, 106.7948, 6.5, 'SEDANG', 'DITUGASKAN', '2026-11-03T08:00:00.000Z', '2026-11-03T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D018', 'usr-baca-02', '100301017', 'Wawan Ridwan', '08131209865', NULL, 'cat-006', '1003', 'Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.', -6.9866, 106.7971, 7.7, 'RENDAH', 'DITUGASKAN', '2026-11-03T20:00:00.000Z', '2026-11-03T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D019', 'usr-baca-01', '100401018', 'H. Engkos Sarkosih', '08141222210', '1/2 Inch', 'cat-001', '1004', 'Pipa dinas bocor sembur di depan rumah warga RT 02/03 dekat gapura desa, air meluap ke jalan.', -6.9878, 106.7994, 8.9, 'KRITIS', 'DITUGASKAN', '2026-11-04T08:00:00.000Z', '2026-11-04T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D020', 'usr-baca-02', '100501019', 'Ibu Kokom Komalasari', '08151234555', '3/4 Inch', 'cat-002', '1005', 'Pipa instalatur bocor halus di bawah pondasi pagar rumah konsumen.', -6.989, 106.8017, 10.1, 'TINGGI', 'DITUGASKAN', '2026-11-04T20:00:00.000Z', '2026-11-04T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D021', 'usr-baca-01', '100601020', 'Tatang Sudrajat', '08161246900', NULL, 'cat-003', '1006', 'Aliran air mati total sejak 2 hari lalu di daerah ketinggian/ujung jaringan blok.', -6.9902, 106.81, 11.3, 'TINGGI', 'DITUGASKAN', '2026-11-05T08:00:00.000Z', '2026-11-05T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D022', 'usr-baca-02', '100801021', 'Ibu Elis Nurbaeti', '08171259245', NULL, 'cat-004', '1008', 'Pelanggan mengajukan keberatan tagihan bulan ini naik tinggi, mohon cek stan meter.', -6.997, 106.8123, 12.5, 'SEDANG', 'DITUGASKAN', '2026-11-05T20:00:00.000Z', '2026-11-05T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D023', 'usr-baca-01', '100901022', 'Jajang Nurzaman', '08181271590', NULL, 'cat-005', '1009', 'Jarum indikator meteran patah dan segel meter terlepas.', -6.9982, 106.8146, 13.7, 'SEDANG', 'DITUGASKAN', '2026-11-06T08:00:00.000Z', '2026-11-06T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D024', 'usr-baca-02', '101001023', 'Bapak Herman Sutisna', '08191283935', NULL, 'cat-006', '1010', 'Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.', -6.9994, 106.8169, 14.9, 'RENDAH', 'DITUGASKAN', '2026-11-06T20:00:00.000Z', '2026-11-06T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D025', 'usr-baca-01', '200101024', 'Ibu Eni Rohaeni', '08121296280', '1/2 Inch', 'cat-001', '2001', 'Pipa dinas bocor sembur di depan rumah warga RT 02/03 dekat gapura desa, air meluap ke jalan.', -7.0006, 106.7772, 6.5, 'KRITIS', 'DITUGASKAN', '2026-11-07T08:00:00.000Z', '2026-11-07T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D026', 'usr-baca-02', '200201025', 'Didin Wahyudin', '08131308625', '3/4 Inch', 'cat-002', '2002', 'Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman.', -7.0018, 106.7855, 7.7, 'TINGGI', 'DITUGASKAN', '2026-11-07T20:00:00.000Z', '2026-11-07T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D027', 'usr-baca-01', '300401026', 'Ibu Neng Sumiati', '08141320970', NULL, 'cat-003', '3004', 'Air mengalir keruh kekuningan bercampur endapan setelah ada pekerjaan pipa utama.', -7.003, 106.7878, 8.9, 'TINGGI', 'DITUGASKAN', '2026-11-08T08:00:00.000Z', '2026-11-08T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D028', 'usr-baca-02', '300801027', 'Iskandar Zulkarnaen', '08151333315', NULL, 'cat-004', '3008', 'Ada dugaan kebocoran dalam instalasi pipa rumah yang membuat tagihan melonjak.', -7.0042, 106.7901, 10.1, 'SEDANG', 'DALAM_PROSES', '2026-11-08T20:00:00.000Z', '2026-11-08T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D029', 'usr-baca-01', '400101028', 'Bapak Eman Suherman', '08161345660', NULL, 'cat-005', '4001', 'Angka stan meter macet total tidak berputar walaupun kran air sedang digunakan.', -7.011, 106.7924, 11.3, 'SEDANG', 'DALAM_PROSES', '2026-11-09T08:00:00.000Z', '2026-11-09T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D030', 'usr-baca-02', '500301029', 'Ibu Dewi Sartika', '08171358005', NULL, 'cat-006', '5003', 'Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.', -7.0122, 106.7947, 12.5, 'RENDAH', 'DALAM_PROSES', '2026-11-09T20:00:00.000Z', '2026-11-09T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D031', 'usr-baca-01', '100101030', 'Saepul Bahri', '08181370350', '1/2 Inch', 'cat-001', '1001', 'Pipa dinas bocor sembur di depan rumah warga RT 02/03 dekat gapura desa, air meluap ke jalan.', -6.9834, 106.803, 13.7, 'KRITIS', 'DALAM_PROSES', '2026-11-10T08:00:00.000Z', '2026-11-10T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D032', 'usr-baca-02', '100201031', 'Ibu Tini Martini', '08191382695', '3/4 Inch', 'cat-002', '1002', 'Pipa instalatur bocor halus di bawah pondasi pagar rumah konsumen.', -6.9846, 106.8053, 14.9, 'TINGGI', 'DALAM_PROSES', '2026-11-10T20:00:00.000Z', '2026-11-10T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D033', 'usr-baca-01', '100301032', 'Dedi Supriadi', '08121395040', NULL, 'cat-003', '1003', 'Aliran air mati total sejak 2 hari lalu di daerah ketinggian/ujung jaringan blok.', -6.9858, 106.8076, 6.5, 'TINGGI', 'DALAM_PROSES', '2026-11-11T08:00:00.000Z', '2026-11-11T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D034', 'usr-baca-02', '100401033', 'Bapak Yudi Wahyudi', '08131407385', NULL, 'cat-004', '1004', 'Pelanggan mengajukan keberatan tagihan bulan ini naik tinggi, mohon cek stan meter.', -6.987, 106.8099, 7.7, 'SEDANG', 'DALAM_PROSES', '2026-11-11T20:00:00.000Z', '2026-11-11T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D035', 'usr-baca-01', '100501034', 'Ibu Yani Mulyani', '08141419730', NULL, 'cat-005', '1005', 'Jarum indikator meteran patah dan segel meter terlepas.', -6.9882, 106.8122, 8.9, 'SEDANG', 'DALAM_PROSES', '2026-11-12T08:00:00.000Z', '2026-11-12T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D036', 'usr-baca-02', '100601035', 'Kosasih', '08151432075', NULL, 'cat-006', '1006', 'Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.', -6.995, 106.8205, 10.1, 'RENDAH', 'SELESAI_DIKERJAKAN', '2026-11-12T20:00:00.000Z', '2026-11-12T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D037', 'usr-baca-01', '100801036', 'Ibu Imas Masitoh', '08161444420', '1/2 Inch', 'cat-001', '1008', 'Pipa dinas bocor sembur di depan rumah warga RT 02/03 dekat gapura desa, air meluap ke jalan.', -6.9962, 106.7808, 11.3, 'KRITIS', 'SELESAI_DIKERJAKAN', '2026-11-13T08:00:00.000Z', '2026-11-13T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D038', 'usr-baca-02', '100901037', 'Samsudin', '08171456765', '3/4 Inch', 'cat-002', '1009', 'Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman.', -6.9974, 106.7831, 12.5, 'TINGGI', 'SELESAI_DIKERJAKAN', '2026-11-13T20:00:00.000Z', '2026-11-13T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D039', 'usr-baca-01', '101001038', 'Bapak Ruslan Abdulgani', '08181469110', NULL, 'cat-003', '1010', 'Air mengalir keruh kekuningan bercampur endapan setelah ada pekerjaan pipa utama.', -6.9986, 106.7854, 13.7, 'TINGGI', 'SELESAI_DIKERJAKAN', '2026-11-14T08:00:00.000Z', '2026-11-14T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D040', 'usr-baca-02', '200101039', 'Ibu Euis Ratnasari', '08191481455', NULL, 'cat-004', '2001', 'Ada dugaan kebocoran dalam instalasi pipa rumah yang membuat tagihan melonjak.', -6.9998, 106.7877, 14.9, 'SEDANG', 'SELESAI_DIKERJAKAN', '2026-11-14T20:00:00.000Z', '2026-11-14T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D041', 'usr-baca-01', '200201040', 'Nanang Suryana', '08121493800', NULL, 'cat-005', '2002', 'Angka stan meter macet total tidak berputar walaupun kran air sedang digunakan.', -7.001, 106.796, 6.5, 'SEDANG', 'SELESAI_DIKERJAKAN', '2026-11-15T08:00:00.000Z', '2026-11-15T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D042', 'usr-baca-02', '300401041', 'Ibu Cucun Sukaesih', '08131506145', NULL, 'cat-006', '3004', 'Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.', -7.0022, 106.7983, 7.7, 'RENDAH', 'SELESAI_DIKERJAKAN', '2026-11-15T20:00:00.000Z', '2026-11-15T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D043', 'usr-baca-01', '300801042', 'Oce Setiawan', '08141518490', '1/2 Inch', 'cat-001', '3008', 'Pipa dinas bocor sembur di depan rumah warga RT 02/03 dekat gapura desa, air meluap ke jalan.', -7.009, 106.8006, 8.9, 'KRITIS', 'SELESAI_DIKERJAKAN', '2026-11-16T08:00:00.000Z', '2026-11-16T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D044', 'usr-baca-02', '400101043', 'Bapak Anwar Sanusi', '08151530835', '3/4 Inch', 'cat-002', '4001', 'Pipa instalatur bocor halus di bawah pondasi pagar rumah konsumen.', -7.0102, 106.8029, 10.1, 'TINGGI', 'DITUTUP', '2026-11-16T20:00:00.000Z', '2026-11-16T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D045', 'usr-baca-01', '500301044', 'Ibu Ratna Komala', '08161543180', NULL, 'cat-003', '5003', 'Aliran air mati total sejak 2 hari lalu di daerah ketinggian/ujung jaringan blok.', -7.0114, 106.8052, 11.3, 'TINGGI', 'DITUTUP', '2026-11-17T08:00:00.000Z', '2026-11-17T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D046', 'usr-baca-02', '100101045', 'Zaenal Arifin', '08171555525', NULL, 'cat-004', '1001', 'Pelanggan mengajukan keberatan tagihan bulan ini naik tinggi, mohon cek stan meter.', -6.9826, 106.8135, 12.5, 'SEDANG', 'DITUTUP', '2026-11-17T20:00:00.000Z', '2026-11-17T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D047', 'usr-baca-01', '100201046', 'Ibu Yeti Nurhayati', '08181567870', NULL, 'cat-005', '1002', 'Jarum indikator meteran patah dan segel meter terlepas.', -6.9838, 106.8158, 13.7, 'SEDANG', 'DITUTUP', '2026-11-18T08:00:00.000Z', '2026-11-18T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D048', 'usr-baca-02', '100301047', 'Sobari', '08191580215', NULL, 'cat-006', '1003', 'Box meteran tertimbun material tanah longsoran tebing saat hujan deras kemarin sore.', -6.985, 106.8181, 14.9, 'RENDAH', 'DITUTUP', '2026-11-18T20:00:00.000Z', '2026-11-18T22:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D049', 'usr-baca-01', '100401048', 'Bapak Kurnia Effendi', '08121592560', '1/2 Inch', 'cat-001', '1004', 'Pipa dinas bocor sembur di depan rumah warga RT 02/03 dekat gapura desa, air meluap ke jalan.', -6.9862, 106.7784, 6.5, 'KRITIS', 'DITUTUP', '2026-11-19T08:00:00.000Z', '2026-11-19T10:00:00.000Z'),
(uuid_generate_v4(), 'FT-202611-D050', 'usr-baca-02', '100501049', 'Ibu Sri Rahayu', '08131604905', '3/4 Inch', 'cat-002', '1005', 'Pipa instalatur pecah akibat terkena cangkul kebun warga, air menggenangi halaman.', -6.993, 106.7807, 7.7, 'TINGGI', 'DITUTUP', '2026-11-19T20:00:00.000Z', '2026-11-19T22:00:00.000Z')
ON CONFLICT (nomor_tiket) DO NOTHING;
