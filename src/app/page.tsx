'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { dbService } from '@/lib/db';
import { Ticket, SLA_HOURS } from '@/types';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';
import {
  AlertTriangle,
  PlusCircle,
  Clock,
  CheckCircle2,
  MapPin,
  FileText,
  ChevronRight,
  Inbox,
  Ticket as TicketIcon,
  Check,
  Droplet,
  ShieldCheck,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await dbService.getTickets();
        setTickets(data);
      } catch (err) {
        console.error('Failed to load tickets', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const total = tickets.length;
  const baru = tickets.filter((t) => t.status === 'BARU').length;
  const proses = tickets.filter((t) => t.status === 'DALAM_PROSES').length;
  const ditugaskan = tickets.filter((t) => t.status === 'DITUGASKAN').length;
  const selesai = tickets.filter((t) => t.status === 'SELESAI_DIKERJAKAN').length;
  const ditutup = tickets.filter((t) => t.status === 'DITUTUP').length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Selamat Pagi'
      : hour < 15
      ? 'Selamat Siang'
      : hour < 18
      ? 'Selamat Sore'
      : 'Selamat Malam';

  const roleLabel: Record<string, string> = {
    petugas_baca: 'Petugas Baca Meter',
    kas: 'KAS (Kasir Lapangan)',
    petugas_teknik: 'Petugas Teknik Lapangan',
    admin: 'Administrator Sistem',
    kaur: 'Ka.Ur Teknik & Distribusi',
    kepala_cabang: 'Kepala Cabang Cikembar',
  };

  // SLA alerts
  const now = Date.now();
  const slaAlerts = tickets.filter((t) => {
    if (t.status === 'SELESAI_DIKERJAKAN' || t.status === 'DITUTUP' || t.status === 'DIBATALKAN') {
      return false;
    }
    const createdTime = new Date(t.created_at).getTime();
    const elapsedHours = (now - createdTime) / (1000 * 60 * 60);
    const maxSla = SLA_HOURS[t.prioritas];
    return elapsedHours >= maxSla * 0.7;
  });

  return (
    <div className="space-y-4 max-w-[1200px] mx-auto">
      {/* ── 1. HERO CARD (Style identik PDAM FieldTicket v3) ─────────────────── */}
      <div
        className="rounded-[18px] p-5 sm:p-6 text-white relative overflow-hidden shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #0A4CC0 0%, #2A86F5 100%)',
          boxShadow: '0 8px 24px rgba(10, 76, 192, 0.3)',
        }}
      >
        {/* Background decorative circles */}
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-12 -bottom-10 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm text-blue-100 font-medium tracking-wide">
              {greeting},
            </p>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {user?.nama || 'Petugas PDAM'}
            </h2>
            <div className="pt-0.5">
              <span className="inline-block bg-white/20 backdrop-blur rounded-full px-3 py-0.5 text-xs font-bold text-white tracking-wide">
                {roleLabel[user?.role || ''] || user?.role}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/15 backdrop-blur items-center justify-center text-white shadow-inner">
            <Droplet className="w-9 h-9 fill-white" />
          </div>
        </div>
      </div>

      {/* Admin / Petugas Quick Banner */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[14px] p-3.5 sm:p-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-bold text-[#1E40AF] text-xs sm:text-sm flex items-center gap-1.5">
            <span>📝 Input Laporan Lapangan Baru</span>
          </div>
          <div className="text-[11px] sm:text-xs text-[#3B82F6] mt-0.5">
            Laporkan temuan kebocoran pipa dinas, meter rusak, atau aduan distribusi air.
          </div>
        </div>
        <Link
          href="/tickets/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B57D0] hover:bg-[#0842A0] text-white font-bold text-xs shadow transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Buat Laporan Baru</span>
        </Link>
      </div>

      {/* SLA Alert banner */}
      {slaAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[14px] p-3.5 flex items-start gap-3">
          <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <strong className="text-amber-900 block font-bold">
              Peringatan SLA Terdeteksi ({slaAlerts.length} Tiket Aktif)
            </strong>
            <span className="text-amber-700 block mt-0.5">
              Tiket prioritas KRITIS/TINGGI membutuhkan penanganan atau delegasi teknisi segera.
            </span>
          </div>
        </div>
      )}

      {/* ── 2. QUICK ACTION GRID (qa-grid) ──────────────────────────────────── */}
      <div className="grid grid-cols-2 min-[900px]:grid-cols-4 gap-3">
        <Link
          href="/tickets/new"
          className="bg-white rounded-[14px] p-3.5 flex items-center gap-3 border border-[#E1E6EF] shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B57D0] flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <b className="block text-xs sm:text-sm text-[#0A1F44] truncate">Buat Tiket</b>
            <span className="text-[11px] text-[#6B778C] truncate block">Lapor gangguan</span>
          </div>
        </Link>

        <Link
          href="/tickets"
          className="bg-white rounded-[14px] p-3.5 flex items-center gap-3 border border-[#E1E6EF] shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
            <TicketIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <b className="block text-xs sm:text-sm text-[#0A1F44] truncate">Semua Tiket</b>
            <span className="text-[11px] text-[#6B778C] truncate block">Pantau progress</span>
          </div>
        </Link>

        <Link
          href="/map"
          className="bg-white rounded-[14px] p-3.5 flex items-center gap-3 border border-[#E1E6EF] shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <b className="block text-xs sm:text-sm text-[#0A1F44] truncate">Peta Sebaran</b>
            <span className="text-[11px] text-[#6B778C] truncate block">Titik kebocoran</span>
          </div>
        </Link>

        <Link
          href="/reports"
          className="bg-white rounded-[14px] p-3.5 flex items-center gap-3 border border-[#E1E6EF] shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <b className="block text-xs sm:text-sm text-[#0A1F44] truncate">Rekap SLA</b>
            <span className="text-[11px] text-[#6B778C] truncate block">Laporan & ekspor</span>
          </div>
        </Link>
      </div>

      {/* ── 3. STAT CARDS (stat-row) ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 min-[900px]:grid-cols-5 gap-3">
        <Link
          href="/tickets"
          className="bg-white rounded-[14px] p-4 border border-[#E1E6EF] shadow-sm hover:shadow transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#6B778C] uppercase tracking-wide">Total Tiket</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0B57D0] flex items-center justify-center">
              <TicketIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A1F44] mt-2">{total}</div>
        </Link>

        <Link
          href="/tickets?status=BARU"
          className="bg-white rounded-[14px] p-4 border border-[#E1E6EF] shadow-sm hover:shadow transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wide">Baru</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600 mt-2">{baru}</div>
        </Link>

        <Link
          href="/tickets?status=DALAM_PROSES"
          className="bg-white rounded-[14px] p-4 border border-[#E1E6EF] shadow-sm hover:shadow transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wide">Dalam Proses</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">{proses + ditugaskan}</div>
        </Link>

        <Link
          href="/tickets?status=SELESAI_DIKERJAKAN"
          className="bg-white rounded-[14px] p-4 border border-[#E1E6EF] shadow-sm hover:shadow transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Selesai</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{selesai}</div>
        </Link>

        <Link
          href="/tickets?status=DITUTUP"
          className="col-span-2 min-[900px]:col-span-1 bg-white rounded-[14px] p-4 border border-[#E1E6EF] shadow-sm hover:shadow transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Ditutup</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-700 mt-2">{ditutup}</div>
        </Link>
      </div>

      {/* ── 4. TICKETS & DISTRIBUTION ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-4">
        {/* Recent Tickets (2 Col) */}
        <div className="min-[900px]:col-span-2 bg-white rounded-[14px] border border-[#E1E6EF] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E1E6EF] flex items-center justify-between">
            <h3 className="font-bold text-[#0A1F44] text-sm sm:text-base m-0">
              Laporan Tiket Terbaru
            </h3>
            <Link
              href="/tickets"
              className="text-xs font-bold text-[#0B57D0] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#E1E6EF]">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">Memuat tiket...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">Belum ada tiket.</div>
            ) : (
              tickets.slice(0, 5).map((t) => (
                <Link
                  key={t.id}
                  href={`/tickets/${t.id}`}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#F2F5FA] transition-colors group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-[#0B57D0]">
                        {t.nomor_tiket}
                      </span>
                      <StatusBadge status={t.status} size="sm" />
                      <PriorityBadge prioritas={t.prioritas} showSla={false} />
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-[#1B2437] truncate">
                      {t.nama_pelanggan} —{' '}
                      <span className="font-medium text-slate-500">{t.kategori_nama}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {t.wilayah_nama ? `${t.wilayah_nama} • ` : ''}
                      {t.deskripsi}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Status Distribution (1 Col) */}
        <div className="bg-white rounded-[14px] border border-[#E1E6EF] p-4 shadow-sm space-y-4">
          <h3 className="font-bold text-[#0A1F44] text-sm border-b border-[#E1E6EF] pb-2 m-0">
            Distribusi Status Tiket
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { label: 'Baru', count: baru, color: '#C62828', bg: '#FDE8E8' },
              { label: 'Ditugaskan', count: ditugaskan, color: '#0B57D0', bg: '#E8F0FE' },
              { label: 'Dalam Proses', count: proses, color: '#B45309', bg: '#FEF3C7' },
              { label: 'Selesai', count: selesai, color: '#137333', bg: '#E6F4EA' },
              { label: 'Ditutup', count: ditutup, color: '#455A64', bg: '#ECEFF1' },
            ].map((st) => {
              const pct = total > 0 ? Math.round((st.count / total) * 100) : 0;
              return (
                <div key={st.label} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-slate-700">{st.label}</span>
                    <span className="font-bold text-slate-900">
                      {st.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#E1E6EF] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: st.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E1E6EF]">
            <Link
              href="/reports"
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A1F44] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Lihat Detail Laporan SLA</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
