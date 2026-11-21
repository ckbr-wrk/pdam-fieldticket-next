'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { dbService } from '@/lib/db';
import { Ticket, User, TicketStatus, PhotoType, STATUS_TRANSITIONS, SLA_HOURS } from '@/types';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';
import {
  ArrowLeft,
  Printer,
  Wrench,
  Camera,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  FileText,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Workflow Action States
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [assignNotes, setAssignNotes] = useState('');

  const [actionNotes, setActionNotes] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<TicketStatus | null>(null);

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoType, setPhotoType] = useState<PhotoType>('PROSES');
  const [photoFilePreview, setPhotoFilePreview] = useState<string | null>(null);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      try {
        const [t, uList] = await Promise.all([
          dbService.getTicketById(ticketId),
          dbService.getUsers(),
        ]);
        setTicket(t);
        setUsers(uList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        Memuat detail tiket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Tiket tidak ditemukan</h2>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 px-4 py-2 bg-pdam-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Tiket</span>
        </Link>
      </div>
    );
  }

  // Calculate SLA elapsed
  const createdTime = new Date(ticket.created_at).getTime();
  const elapsedHours = (Date.now() - createdTime) / (1000 * 60 * 60);
  const maxSla = SLA_HOURS[ticket.prioritas];
  const isOverdue =
    elapsedHours > maxSla &&
    ticket.status !== 'SELESAI_DIKERJAKAN' &&
    ticket.status !== 'DITUTUP' &&
    ticket.status !== 'DIBATALKAN';

  // Allowed next statuses for current user
  const role = user?.role || 'petugas_baca';
  const allowedTransitions =
    user?.role === 'admin'
      ? ['DITUGASKAN', 'DALAM_PROSES', 'MENUNGGU', 'SELESAI_DIKERJAKAN', 'DITUTUP', 'DIBATALKAN'].filter(
          (s) => s !== ticket.status
        ) as TicketStatus[]
      : STATUS_TRANSITIONS[ticket.status]?.[role] || [];

  const technicians = users.filter((u) => u.role === 'petugas_teknik' || u.role === 'admin');

  // Handle Assign Technician
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTechnicianId) return;
    setProcessing(true);
    try {
      const tech = users.find((u) => u.user_id === selectedTechnicianId);
      const updated = await dbService.assignTicket(
        ticket.id,
        selectedTechnicianId,
        tech?.nama || 'Teknisi',
        { id: user?.user_id || 'admin', nama: user?.nama || 'Admin' },
        assignNotes
      );
      if (updated) setTicket({ ...updated });
      setAssignModalOpen(false);
      setAssignNotes('');
    } catch (err: any) {
      alert('Gagal menugaskan: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Handle Status Update
  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStatus) return;
    setProcessing(true);
    try {
      const updated = await dbService.updateTicketStatus(
        ticket.id,
        targetStatus,
        { id: user?.user_id || 'admin', nama: user?.nama || 'Petugas', role },
        actionNotes
      );
      if (updated) setTicket({ ...updated });
      setStatusModalOpen(false);
      setActionNotes('');
      setTargetStatus(null);
    } catch (err: any) {
      alert('Gagal update status: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Handle Photo Upload
  const handlePhotoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoFilePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFilePreview) return;
    setProcessing(true);
    try {
      await dbService.addTicketPhoto(
        ticket.id,
        user?.user_id || 'petugas',
        photoType,
        photoFilePreview
      );
      // Reload ticket
      const fresh = await dbService.getTicketById(ticket.id);
      if (fresh) setTicket(fresh);
      setPhotoModalOpen(false);
      setPhotoFilePreview(null);
    } catch (err: any) {
      alert('Gagal mengunggah foto: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/tickets"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base sm:text-lg font-bold text-pdam-700">
                {ticket.nomor_tiket}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge prioritas={ticket.prioritas} />
            </div>
            <p className="text-xs text-slate-500">
              Dibuat {new Date(ticket.created_at).toLocaleString('id-ID')} oleh {ticket.pelapor_nama || 'Petugas'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href={`/tickets/${ticket.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak SPK</span>
          </Link>
        </div>
      </div>

      {/* SLA Alert if overdue */}
      {isOverdue && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <strong>Peringatan SLA Terlampaui!</strong> Tiket ini telah berjalan selama{' '}
            {elapsedHours.toFixed(1)} jam (Batas SLA prioritas {ticket.prioritas}: {maxSla} jam).
            Mohon percepat penyelesaian atau laporkan kendala ke supervisor.
          </div>
        </div>
      )}

      {/* Main Grid: Details + Workflow Actions & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ticket Info & Photos (2 Col) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Data Pengaduan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Informasi Pengaduan & Gangguan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Nama Pelanggan</span>
                <span className="font-bold text-slate-900 text-sm">{ticket.nama_pelanggan}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">No. HP / WhatsApp</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {ticket.no_hp || '-'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Kategori Gangguan</span>
                <span className="font-bold text-pdam-800">{ticket.kategori_nama || 'Gangguan'}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Ukuran Pipa</span>
                <span className="font-semibold text-slate-800">{ticket.ukuran_pipa || '-'}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Wilayah / Blok Distribusi</span>
                <span className="font-bold text-slate-900">{ticket.wilayah_nama || 'Cikembar'}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Teknisi Bertugas</span>
                <span className="font-bold text-purple-700">
                  {ticket.assigned_to_nama || <span className="text-slate-400 italic">Belum Ditugaskan</span>}
                </span>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-slate-400 block mb-1">Deskripsi & Patokan Lapangan</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-800 leading-relaxed font-medium">
                  {ticket.deskripsi}
                </p>
              </div>

              {/* Coordinates */}
              {ticket.lat && ticket.lng && (
                <div className="sm:col-span-2 pt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>
                      GPS: {ticket.lat.toFixed(6)}, {ticket.lng.toFixed(6)} (±{ticket.akurasi_gps}m)
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${ticket.lat},${ticket.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold underline"
                  >
                    <span>Buka Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Bukti Foto Lapangan 3 Tahap */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Dokumentasi Foto Lapangan (3 Tahap)
                </h2>
                <p className="text-xs text-slate-500">
                  Foto kondisi Sebelum, Proses Pengerjaan, dan Sesudah Perbaikan
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pdam-50 text-pdam-700 hover:bg-pdam-100 font-semibold text-xs transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>+ Unggah Foto</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['SEBELUM', 'PROSES', 'SESUDAH'] as PhotoType[]).map((type) => {
                const photosOfType = ticket.photos?.filter((p) => p.tipe_foto === type) || [];
                return (
                  <div key={type} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>{type}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({photosOfType.length} foto)
                      </span>
                    </div>

                    {photosOfType.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs italic">
                        Belum ada foto
                      </div>
                    ) : (
                      photosOfType.map((photo) => (
                        <div key={photo.id} className="relative rounded-lg overflow-hidden border border-slate-200 h-32 group">
                          <img
                            src={photo.file_url}
                            alt={`Foto ${type}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <a
                            href={photo.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity"
                          >
                            Lihat Full
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Workflow Actions & Timeline Progress (1 Col) */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <Wrench className="w-4 h-4 text-pdam-600" />
              <span>Aksi Workflow Tiket</span>
            </h3>

            {/* Quick Assign Technician Button (Admin/Kaur/Kacab) */}
            {(user?.role === 'admin' || user?.role === 'kaur' || user?.role === 'kas') && (
              <button
                type="button"
                onClick={() => setAssignModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>{ticket.assigned_to ? 'Ganti Teknisi Lapangan' : 'Tugaskan Teknisi'}</span>
              </button>
            )}

            {/* Transition Buttons */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600">
                Ubah Status Pengerjaan:
              </div>

              {allowedTransitions.length === 0 ? (
                <div className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">
                  Tidak ada transisi status lanjutan untuk peran Anda ({user?.role.replace('_', ' ')}).
                </div>
              ) : (
                allowedTransitions.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setTargetStatus(st);
                      setStatusModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs text-left flex items-center justify-between transition-colors"
                  >
                    <span>Lanjut ke: <strong>{st.replace('_', ' ')}</strong></span>
                    <Send className="w-3.5 h-3.5 text-pdam-600" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Timeline Riwayat Pengerjaan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-pdam-600" />
              <span>Riwayat Progress Pengerjaan</span>
            </h3>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {ticket.progress?.map((prog, idx) => (
                <div key={prog.id || idx} className="relative flex items-start gap-3 pl-1">
                  <div className="w-6 h-6 rounded-full bg-pdam-100 text-pdam-700 border-2 border-white flex items-center justify-center text-[10px] font-bold z-10 shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{prog.status_baru}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(prog.created_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{prog.catatan || 'Status diperbarui'}</p>
                    <div className="text-[10px] text-slate-400">Oleh: {prog.actor_nama || prog.actor_id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Assign Technician */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAssignSubmit}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl"
          >
            <h3 className="font-bold text-slate-900 text-base">Tugaskan Teknisi Lapangan</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Tim Teknisi:
              </label>
              <select
                required
                value={selectedTechnicianId}
                onChange={(e) => setSelectedTechnicianId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="">-- Pilih Teknisi --</option>
                {technicians.map((t) => (
                  <option key={t.user_id} value={t.user_id}>
                    {t.nama} ({t.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instruksi Khusus / Catatan:
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Bawa klem pipa 1/2 inch dan pompa celup"
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-slate-600 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={processing || !selectedTechnicianId}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold disabled:opacity-50"
              >
                {processing ? 'Menugaskan...' : 'Konfirmasi Penugasan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Status Transition */}
      {statusModalOpen && targetStatus && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleStatusSubmit}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl"
          >
            <h3 className="font-bold text-slate-900 text-base">
              Perbarui Status ke: <span className="text-pdam-700">{targetStatus.replace('_', ' ')}</span>
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Penanganan / Laporan Lapangan:
              </label>
              <textarea
                required
                rows={3}
                placeholder="Jelaskan tindakan yang telah dilakukan atau alasan status ini..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-slate-600 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 rounded-xl bg-pdam-600 text-white text-xs font-bold disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 3: Upload Photo */}
      {photoModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handlePhotoSubmit}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl"
          >
            <h3 className="font-bold text-slate-900 text-base">Unggah Foto Dokumentasi Lapangan</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahap Dokumentasi:</label>
              <select
                value={photoType}
                onChange={(e) => setPhotoType(e.target.value as PhotoType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="SEBELUM">SEBELUM (Kondisi Awal)</option>
                <option value="PROSES">PROSES (Saat Perbaikan)</option>
                <option value="SESUDAH">SESUDAH (Selesai Tuntas)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih / Jepret Foto:</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUploadChange}
                className="w-full text-xs"
              />
            </div>

            {photoFilePreview && (
              <div className="h-40 rounded-xl overflow-hidden border border-slate-200">
                <img src={photoFilePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPhotoModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-slate-600 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={processing || !photoFilePreview}
                className="px-4 py-2 rounded-xl bg-pdam-600 text-white text-xs font-bold disabled:opacity-50"
              >
                {processing ? 'Mengunggah...' : 'Unggah Foto'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
