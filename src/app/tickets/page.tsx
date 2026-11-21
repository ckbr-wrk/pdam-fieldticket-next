'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/db';
import { Ticket, Wilayah, Category, Priority, TicketStatus } from '@/types';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';
import {
  Search,
  Filter,
  Plus,
  LayoutList,
  LayoutGrid,
  ChevronRight,
  MapPin,
  Clock,
  User,
  Wrench,
  RotateCcw,
} from 'lucide-react';

export default function TicketsListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('SEMUA');
  const [filterPrioritas, setFilterPrioritas] = useState('SEMUA');
  const [filterWilayah, setFilterWilayah] = useState('SEMUA');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    async function loadData() {
      try {
        const [wils, cats] = await Promise.all([
          dbService.getWilayah(),
          dbService.getCategories(),
        ]);
        setWilayahList(wils);
        setCategories(cats);
        await fetchTickets();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await dbService.getTickets({
        status: filterStatus !== 'SEMUA' ? filterStatus : undefined,
        prioritas: filterPrioritas !== 'SEMUA' ? filterPrioritas : undefined,
        wilayah_id: filterWilayah !== 'SEMUA' ? filterWilayah : undefined,
        search: search.trim() || undefined,
      });
      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 200);
    return () => clearTimeout(timer);
  }, [filterStatus, filterPrioritas, filterWilayah, search]);

  const statusPills: { id: string; label: string }[] = [
    { id: 'SEMUA', label: 'Semua' },
    { id: 'BARU', label: 'Baru' },
    { id: 'DITUGASKAN', label: 'Ditugaskan' },
    { id: 'DALAM_PROSES', label: 'Proses' },
    { id: 'MENUNGGU', label: 'Menunggu' },
    { id: 'SELESAI_DIKERJAKAN', label: 'Selesai' },
    { id: 'DITUTUP', label: 'Ditutup' },
  ];

  return (
    <div className="space-y-3 max-w-[1200px] mx-auto">
      {/* ── Search & Filter Toggle Bar ───────────────────────────────────────── */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Cari apa saja (nomor tiket, nama, wilayah, keluhan)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-[12px] border border-[#CBD5E1] bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B57D0] focus:border-transparent shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={`px-3.5 py-2.5 rounded-[12px] border text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap ${
            showFilterPanel || filterStatus !== 'SEMUA' || filterPrioritas !== 'SEMUA' || filterWilayah !== 'SEMUA'
              ? 'bg-blue-50 border-blue-300 text-[#0B57D0]'
              : 'bg-white border-[#CBD5E1] text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>

        <div className="hidden sm:flex items-center bg-white rounded-[12px] border border-[#CBD5E1] p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'cards' ? 'bg-blue-100 text-[#0B57D0]' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Kartu"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-blue-100 text-[#0B57D0]' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Tabel"
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Status Filter Horizontal Pills (Identik style.css pill) ─────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {statusPills.map((pill) => {
          const active = filterStatus === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => setFilterStatus(pill.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                active
                  ? 'bg-[#0B57D0] text-white shadow-blue-500/30'
                  : 'bg-white border border-[#E1E6EF] text-slate-600 hover:bg-slate-50'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* ── Collapsible Advanced Filter Panel ────────────────────────────────── */}
      {showFilterPanel && (
        <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-[14px] p-4 shadow-sm space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] m-0">
              ⚙️ Pengaturan Filter Lengkap
            </h4>
            <button
              type="button"
              onClick={() => {
                setFilterStatus('SEMUA');
                setFilterPrioritas('SEMUA');
                setFilterWilayah('SEMUA');
                setSearch('');
              }}
              className="text-xs text-[#0B57D0] hover:underline font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Prioritas Penanganan (SLA)</label>
              <select
                value={filterPrioritas}
                onChange={(e) => setFilterPrioritas(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="SEMUA">Semua Prioritas</option>
                <option value="KRITIS">KRITIS (SLA 2 Jam)</option>
                <option value="TINGGI">TINGGI (SLA 6 Jam)</option>
                <option value="SEDANG">SEDANG (SLA 24 Jam)</option>
                <option value="RENDAH">RENDAH (SLA 72 Jam)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Wilayah / Blok Distribusi</label>
              <select
                value={filterWilayah}
                onChange={(e) => setFilterWilayah(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white truncate"
              >
                <option value="SEMUA">Semua 50 Wilayah</option>
                {wilayahList.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nama} ({w.petugas})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Ticket Presentation ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-[14px] border border-[#E1E6EF]">
          Memuat tiket...
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-[14px] border border-[#E1E6EF] space-y-2">
          <div className="font-bold text-sm text-slate-800">Tidak ada tiket ditemukan</div>
          <p className="text-xs text-slate-500">Coba ubah kriteria pencarian atau filter status.</p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 min-[1000px]:grid-cols-3 gap-3">
          {tickets.map((t) => (
            <Link
              key={t.id}
              href={`/tickets/${t.id}`}
              className="bg-white rounded-[14px] border border-[#E1E6EF] p-4 shadow-sm hover:shadow-md hover:border-[#0B57D0]/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black text-[#0B57D0]">
                    {t.nomor_tiket}
                  </span>
                  <StatusBadge status={t.status} size="sm" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <PriorityBadge prioritas={t.prioritas} />
                    {t.ukuran_pipa && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {t.ukuran_pipa}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#0A1F44] truncate group-hover:text-[#0B57D0] transition-colors m-0">
                    {t.nama_pelanggan}
                  </h3>
                  <div className="text-[11px] text-[#0B57D0] font-semibold truncate">
                    {t.kategori_nama}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {t.deskripsi}
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{t.wilayah_nama || 'Cikembar'}</span>
                  </div>
                  {t.assigned_to_nama && (
                    <div className="flex items-center gap-1.5 text-purple-700 font-semibold truncate">
                      <Wrench className="w-3.5 h-3.5 shrink-0" />
                      <span>Teknisi: {t.assigned_to_nama}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-2.5 mt-2.5 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(t.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-[#0B57D0] font-bold group-hover:translate-x-1 transition-transform">
                  <span>Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[14px] border border-[#E1E6EF] shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 font-bold uppercase tracking-wider border-b border-[#E1E6EF]">
              <tr>
                <th className="px-4 py-3">Nomor Tiket</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Prioritas</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Wilayah</th>
                <th className="px-4 py-3">Teknisi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E6EF]">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono font-bold text-[#0B57D0]">
                    <Link href={`/tickets/${t.id}`}>{t.nomor_tiket}</Link>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <StatusBadge status={t.status} size="sm" />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <PriorityBadge prioritas={t.prioritas} />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-900">{t.nama_pelanggan}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{t.kategori_nama}</div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">
                    {t.wilayah_nama?.split('-')[0] || t.wilayah_id}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-purple-700 whitespace-nowrap">
                    {t.assigned_to_nama || '-'}
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <Link
                      href={`/tickets/${t.id}`}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-[#0B57D0] hover:bg-blue-100 font-bold"
                    >
                      Buka
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating Action Button (FAB) on Mobile */}
      <Link
        href="/tickets/new"
        className="min-[900px]:hidden fixed right-4 bottom-20 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl z-40 active:scale-95 transition-transform"
        style={{
          background: 'linear-gradient(135deg, #0A4CC0, #2A86F5)',
          boxShadow: '0 8px 24px rgba(10, 76, 192, 0.4)',
        }}
        title="Buat Laporan Baru"
      >
        <Plus className="w-8 h-8 stroke-[3]" />
      </Link>
    </div>
  );
}
