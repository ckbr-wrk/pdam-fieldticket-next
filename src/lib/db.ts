import { supabase, isSupabaseConfigured } from './supabase';
import {
  INITIAL_CATEGORIES,
  INITIAL_WILAYAH,
  INITIAL_USERS,
  INITIAL_TICKETS,
} from './seed-data';
import {
  Ticket,
  Category,
  Wilayah,
  User,
  TicketStatus,
  Priority,
  PhotoType,
  ProgressLog,
  Photo,
} from '@/types';

// In-Memory store fallback (synced with localStorage in browser)
let localTickets: Ticket[] = [...INITIAL_TICKETS];
let localCategories: Category[] = [...INITIAL_CATEGORIES];
let localWilayah: Wilayah[] = [...INITIAL_WILAYAH];
let localUsers: User[] = [...INITIAL_USERS];

const STORAGE_KEY_TICKETS = 'pdam_fieldticket_data_tickets';
const STORAGE_KEY_USERS = 'pdam_fieldticket_data_users';

function initBrowserStorage() {
  if (typeof window === 'undefined') return;
  try {
    const savedTickets = localStorage.getItem(STORAGE_KEY_TICKETS);
    if (savedTickets) {
      const parsed = JSON.parse(savedTickets);
      // If cached data contains old dummy ids, auto-upgrade to real seed data
      if (Array.isArray(parsed) && parsed.some((t: any) => t.id && t.id.includes('dummy-tk'))) {
        localTickets = [...INITIAL_TICKETS];
        localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(localTickets));
      } else {
        localTickets = parsed;
      }
    } else {
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(localTickets));
    }

    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    if (savedUsers) {
      localUsers = JSON.parse(savedUsers);
    } else {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(localUsers));
    }
  } catch (err) {
    console.warn('LocalStorage not available:', err);
  }
}

function persistTickets() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(localTickets));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }
}

// Ensure browser storage is synced on import
if (typeof window !== 'undefined') {
  initBrowserStorage();
}

export const dbService = {
  isCloudMode(): boolean {
    return isSupabaseConfigured();
  },

  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('aktif', true)
        .order('id');
      if (!error && data && data.length > 0) return data as Category[];
    }
    return localCategories.filter((c) => c.aktif);
  },

  async getWilayah(): Promise<Wilayah[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('wilayah')
        .select('*')
        .eq('aktif', true)
        .order('id');
      if (!error && data && data.length > 0) return data as Wilayah[];
    }
    return localWilayah.filter((w) => w.aktif);
  },

  async getUsers(): Promise<User[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, nama, email, role, wilayah_id, status_aktif')
        .eq('status_aktif', true);
      if (!error && data && data.length > 0) return data as User[];
    }
    initBrowserStorage();
    return localUsers.filter((u) => u.status_aktif);
  },

  async getTickets(filter?: {
    status?: string;
    wilayah_id?: string;
    prioritas?: string;
    search?: string;
    assigned_to?: string;
  }): Promise<Ticket[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('tickets').select(`
        *,
        categories(nama),
        wilayah(nama)
      `);

      if (filter?.status) query = query.eq('status', filter.status);
      if (filter?.wilayah_id) query = query.eq('wilayah_id', filter.wilayah_id);
      if (filter?.prioritas) query = query.eq('prioritas', filter.prioritas);
      if (filter?.assigned_to) query = query.eq('assigned_to', filter.assigned_to);

      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((t: any) => ({
          ...t,
          kategori_nama: t.categories?.nama || '',
          wilayah_nama: t.wilayah?.nama || '',
        })) as Ticket[];
      }
    }

    initBrowserStorage();
    let result = [...localTickets];

    if (filter?.status && filter.status !== 'SEMUA') {
      result = result.filter((t) => t.status === filter.status);
    }
    if (filter?.wilayah_id && filter.wilayah_id !== 'SEMUA') {
      result = result.filter((t) => t.wilayah_id === filter.wilayah_id);
    }
    if (filter?.prioritas && filter.prioritas !== 'SEMUA') {
      result = result.filter((t) => t.prioritas === filter.prioritas);
    }
    if (filter?.assigned_to) {
      result = result.filter((t) => t.assigned_to === filter.assigned_to);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.nomor_tiket.toLowerCase().includes(q) ||
          t.nama_pelanggan.toLowerCase().includes(q) ||
          t.deskripsi.toLowerCase().includes(q) ||
          (t.no_hp && t.no_hp.includes(q))
      );
    }

    return result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async getTicketById(id: string): Promise<Ticket | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          categories(nama),
          wilayah(nama),
          photos(*),
          progress(*)
        `)
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          ...data,
          kategori_nama: data.categories?.nama || '',
          wilayah_nama: data.wilayah?.nama || '',
          photos: data.photos || [],
          progress: data.progress ? data.progress.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) : [],
        } as Ticket;
      }
    }

    initBrowserStorage();
    const found = localTickets.find((t) => t.id === id || t.nomor_tiket === id);
    return found ? { ...found } : null;
  },

  async createTicket(payload: {
    pelapor_id: string;
    pelapor_nama: string;
    pelanggan_id?: string;
    nama_pelanggan: string;
    no_hp?: string;
    ukuran_pipa?: string;
    kategori_id: string;
    wilayah_id: string;
    deskripsi: string;
    prioritas: Priority;
    lat?: number | null;
    lng?: number | null;
    akurasi_gps?: number | null;
    foto_sebelum_url?: string;
  }): Promise<Ticket> {
    const today = new Date();
    const ymd = today.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const nomor_tiket = `TKT-${ymd}-${rand}`;
    const id = `tkt-uuid-${Date.now()}`;
    const nowIso = today.toISOString();

    const cat = localCategories.find((c) => c.id === payload.kategori_id);
    const wil = localWilayah.find((w) => w.id === payload.wilayah_id);

    const initialPhoto: Photo[] = payload.foto_sebelum_url
      ? [
          {
            id: `p-${Date.now()}`,
            ticket_id: id,
            uploader_id: payload.pelapor_id,
            tipe_foto: 'SEBELUM',
            file_url: payload.foto_sebelum_url,
            created_at: nowIso,
          },
        ]
      : [];

    const initialProgress: ProgressLog[] = [
      {
        id: `pr-${Date.now()}`,
        ticket_id: id,
        actor_id: payload.pelapor_id,
        actor_nama: payload.pelapor_nama,
        status_baru: 'BARU',
        catatan: 'Tiket berhasil dibuat oleh pelapor lapangan.',
        created_at: nowIso,
      },
    ];

    const newTicket: Ticket = {
      id,
      nomor_tiket,
      pelapor_id: payload.pelapor_id,
      pelapor_nama: payload.pelapor_nama,
      pelanggan_id: payload.pelanggan_id || '',
      nama_pelanggan: payload.nama_pelanggan,
      no_hp: payload.no_hp || '',
      ukuran_pipa: payload.ukuran_pipa || '',
      kategori_id: payload.kategori_id,
      kategori_nama: cat?.nama || '',
      wilayah_id: payload.wilayah_id,
      wilayah_nama: wil?.nama || '',
      deskripsi: payload.deskripsi,
      lat: payload.lat,
      lng: payload.lng,
      akurasi_gps: payload.akurasi_gps,
      prioritas: payload.prioritas,
      status: 'BARU',
      print_count: 0,
      photos: initialPhoto,
      progress: initialProgress,
      created_at: nowIso,
      updated_at: nowIso,
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          nomor_tiket,
          pelapor_id: payload.pelapor_id,
          pelanggan_id: payload.pelanggan_id,
          nama_pelanggan: payload.nama_pelanggan,
          no_hp: payload.no_hp,
          ukuran_pipa: payload.ukuran_pipa,
          kategori_id: payload.kategori_id,
          wilayah_id: payload.wilayah_id,
          deskripsi: payload.deskripsi,
          lat: payload.lat,
          lng: payload.lng,
          akurasi_gps: payload.akurasi_gps,
          prioritas: payload.prioritas,
          status: 'BARU',
        })
        .select()
        .single();

      if (!error && data) {
        newTicket.id = data.id;
        // insert initial progress
        await supabase.from('progress').insert({
          ticket_id: data.id,
          actor_id: payload.pelapor_id,
          status_baru: 'BARU',
          catatan: 'Tiket berhasil dibuat oleh pelapor lapangan.',
        });
        if (payload.foto_sebelum_url) {
          await supabase.from('photos').insert({
            ticket_id: data.id,
            uploader_id: payload.pelapor_id,
            tipe_foto: 'SEBELUM',
            file_url: payload.foto_sebelum_url,
          });
        }
      }
    }

    localTickets.unshift(newTicket);
    persistTickets();
    return newTicket;
  },

  async updateTicketStatus(
    ticketId: string,
    newStatus: TicketStatus,
    actor: { id: string; nama: string; role: string },
    catatan?: string
  ): Promise<Ticket | null> {
    const nowIso = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('tickets')
        .update({ status: newStatus, updated_at: nowIso })
        .eq('id', ticketId);

      await supabase.from('progress').insert({
        ticket_id: ticketId,
        actor_id: actor.id,
        status_baru: newStatus,
        catatan: catatan || `Status diubah menjadi ${newStatus}`,
      });
    }

    initBrowserStorage();
    const idx = localTickets.findIndex((t) => t.id === ticketId);
    if (idx !== -1) {
      localTickets[idx].status = newStatus;
      localTickets[idx].updated_at = nowIso;
      if (!localTickets[idx].progress) localTickets[idx].progress = [];
      localTickets[idx].progress!.push({
        id: `pr-${Date.now()}`,
        ticket_id: ticketId,
        actor_id: actor.id,
        actor_nama: actor.nama,
        status_baru: newStatus,
        catatan: catatan || `Status diperbarui menjadi ${newStatus}`,
        created_at: nowIso,
      });
      persistTickets();
      return localTickets[idx];
    }
    return null;
  },

  async assignTicket(
    ticketId: string,
    technicianId: string,
    technicianNama: string,
    assignedBy: { id: string; nama: string },
    catatan?: string
  ): Promise<Ticket | null> {
    const nowIso = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('tickets')
        .update({
          assigned_to: technicianId,
          status: 'DITUGASKAN',
          updated_at: nowIso,
        })
        .eq('id', ticketId);

      await supabase.from('assignments').insert({
        ticket_id: ticketId,
        assigned_by: assignedBy.id,
        assigned_to: technicianId,
        catatan: catatan || `Penugasan kepada ${technicianNama}`,
      });

      await supabase.from('progress').insert({
        ticket_id: ticketId,
        actor_id: assignedBy.id,
        status_baru: 'DITUGASKAN',
        catatan: catatan || `Tiket ditugaskan ke ${technicianNama}`,
      });
    }

    initBrowserStorage();
    const idx = localTickets.findIndex((t) => t.id === ticketId);
    if (idx !== -1) {
      localTickets[idx].assigned_to = technicianId;
      localTickets[idx].assigned_to_nama = technicianNama;
      localTickets[idx].status = 'DITUGASKAN';
      localTickets[idx].updated_at = nowIso;
      if (!localTickets[idx].progress) localTickets[idx].progress = [];
      localTickets[idx].progress!.push({
        id: `pr-${Date.now()}`,
        ticket_id: ticketId,
        actor_id: assignedBy.id,
        actor_nama: assignedBy.nama,
        status_baru: 'DITUGASKAN',
        catatan: catatan || `Penugasan ke teknisi ${technicianNama}`,
        created_at: nowIso,
      });
      persistTickets();
      return localTickets[idx];
    }
    return null;
  },

  async addTicketPhoto(
    ticketId: string,
    uploaderId: string,
    tipeFoto: PhotoType,
    fileUrl: string
  ): Promise<Photo> {
    const nowIso = new Date().toISOString();
    const photo: Photo = {
      id: `p-${Date.now()}`,
      ticket_id: ticketId,
      uploader_id: uploaderId,
      tipe_foto: tipeFoto,
      file_url: fileUrl,
      created_at: nowIso,
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('photos').insert({
        ticket_id: ticketId,
        uploader_id: uploaderId,
        tipe_foto: tipeFoto,
        file_url: fileUrl,
      });
    }

    initBrowserStorage();
    const idx = localTickets.findIndex((t) => t.id === ticketId);
    if (idx !== -1) {
      if (!localTickets[idx].photos) localTickets[idx].photos = [];
      localTickets[idx].photos!.push(photo);
      persistTickets();
    }
    return photo;
  },

  async recordPrint(ticketId: string, printedBy: string): Promise<void> {
    const nowIso = new Date().toISOString();
    initBrowserStorage();
    const idx = localTickets.findIndex((t) => t.id === ticketId);
    if (idx !== -1) {
      localTickets[idx].print_count = (localTickets[idx].print_count || 0) + 1;
      localTickets[idx].last_printed_at = nowIso;
      localTickets[idx].last_printed_by = printedBy;
      persistTickets();
    }
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.rpc('increment_print_count', { t_id: ticketId, p_by: printedBy });
      } catch (err) {
        console.warn('RPC increment_print_count error', err);
      }
    }
  },
};
