export type UserRole =
  | 'admin'
  | 'petugas_baca'
  | 'petugas_teknik'
  | 'kaur'
  | 'kas'
  | 'kepala_cabang';

export type TicketStatus =
  | 'BARU'
  | 'DITUGASKAN'
  | 'DALAM_PROSES'
  | 'MENUNGGU'
  | 'SELESAI'
  | 'SELESAI_DIKERJAKAN'
  | 'DITUTUP'
  | 'DIBATALKAN';

export type Priority = 'KRITIS' | 'TINGGI' | 'SEDANG' | 'RENDAH';

export type PhotoType = 'SEBELUM' | 'PROSES' | 'SESUDAH' | 'KONDISI_AWAL';

export interface User {
  id?: string;
  user_id: string;
  nama: string;
  email: string;
  role: UserRole;
  wilayah_id?: string | null;
  status_aktif: boolean;
  password?: string;
}

export interface Category {
  id: string;
  nama: string;
  grup: string;
  prioritas_default: Priority;
  aktif: boolean;
}

export interface Wilayah {
  id: string;
  nama: string;
  petugas: string;
  lat?: number;
  lng?: number;
  aktif: boolean;
}

export interface Ticket {
  id: string;
  ticket_id: string;
  nomor_tiket: string;
  pelapor_id: string;
  pelapor_nama?: string;
  pelanggan_id?: string;
  nama_pelanggan: string;
  no_hp?: string;
  ukuran_pipa?: string;
  kategori_id: string;
  kategori_nama?: string;
  wilayah_id: string;
  wilayah_nama?: string;
  deskripsi: string;
  lat?: number | null;
  lng?: number | null;
  akurasi_gps?: number | null;
  prioritas: Priority;
  status: TicketStatus;
  print_count?: number;
  last_printed_at?: string | null;
  last_printed_by?: string | null;
  assigned_to?: string | null;
  assigned_to_nama?: string | null;
  photos?: Photo[];
  progress?: ProgressLog[];
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  ticket_id: string;
  assigned_by: string;
  assigned_to: string;
  assigned_at: string;
  catatan?: string;
}

export interface ProgressLog {
  id: string;
  ticket_id: string;
  actor_id: string;
  actor_nama?: string;
  status_baru: TicketStatus;
  catatan?: string;
  created_at: string;
}

export interface Photo {
  id: string;
  ticket_id: string;
  uploader_id?: string;
  tipe_foto: PhotoType;
  file_url?: string;
  file_path?: string;
  drive_file_id?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  ticket_id?: string;
  actor_id: string;
  aksi: string;
  nilai_sebelum?: string;
  nilai_sesudah?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  ticket_id?: string;
  is_read: boolean;
  created_at: string;
}

export const SLA_HOURS: Record<Priority, number> = {
  KRITIS: 2,
  TINGGI: 6,
  SEDANG: 24,
  RENDAH: 72,
};

export const STATUS_TRANSITIONS: Record<TicketStatus, Partial<Record<UserRole, TicketStatus[]>>> = {
  BARU: {
    admin: ['DITUGASKAN', 'DALAM_PROSES', 'DIBATALKAN'],
    kaur: ['DITUGASKAN', 'DALAM_PROSES', 'DIBATALKAN'],
    petugas_teknik: ['DALAM_PROSES'],
    petugas_baca: [],
    kas: ['DITUGASKAN'],
    kepala_cabang: ['DITUGASKAN', 'DIBATALKAN'],
  },
  DITUGASKAN: {
    admin: ['DALAM_PROSES', 'MENUNGGU', 'SELESAI_DIKERJAKAN', 'DIBATALKAN'],
    kaur: ['DALAM_PROSES', 'MENUNGGU', 'DIBATALKAN'],
    petugas_teknik: ['DALAM_PROSES'],
    petugas_baca: [],
    kas: [],
    kepala_cabang: ['DIBATALKAN'],
  },
  DALAM_PROSES: {
    admin: ['MENUNGGU', 'SELESAI_DIKERJAKAN', 'DIBATALKAN'],
    kaur: ['MENUNGGU', 'SELESAI_DIKERJAKAN', 'DIBATALKAN'],
    petugas_teknik: ['MENUNGGU', 'SELESAI_DIKERJAKAN'],
    petugas_baca: [],
    kas: [],
    kepala_cabang: ['DIBATALKAN'],
  },
  MENUNGGU: {
    admin: ['DALAM_PROSES', 'SELESAI_DIKERJAKAN', 'DIBATALKAN'],
    kaur: ['DALAM_PROSES', 'SELESAI_DIKERJAKAN', 'DIBATALKAN'],
    petugas_teknik: ['DALAM_PROSES', 'SELESAI_DIKERJAKAN'],
    petugas_baca: [],
    kas: [],
    kepala_cabang: ['DIBATALKAN'],
  },
  SELESAI: {
    admin: ['DITUTUP', 'DALAM_PROSES'],
    kaur: ['DITUTUP', 'DALAM_PROSES'],
    petugas_teknik: [],
    petugas_baca: [],
    kas: ['DITUTUP'],
    kepala_cabang: ['DITUTUP'],
  },
  SELESAI_DIKERJAKAN: {
    admin: ['DITUTUP', 'DALAM_PROSES'],
    kaur: ['DITUTUP', 'DALAM_PROSES'],
    petugas_teknik: [],
    petugas_baca: [],
    kas: ['DITUTUP'],
    kepala_cabang: ['DITUTUP'],
  },
  DITUTUP: {
    admin: ['DALAM_PROSES'],
    kaur: ['DALAM_PROSES'],
    petugas_teknik: [],
    petugas_baca: [],
    kas: [],
    kepala_cabang: [],
  },
  DIBATALKAN: {
    admin: ['BARU'],
    kaur: ['BARU'],
    petugas_teknik: [],
    petugas_baca: [],
    kas: [],
    kepala_cabang: [],
  },
};
