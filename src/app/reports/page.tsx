'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Ticket, Category, Wilayah, SLA_HOURS } from '@/types';
import {
  BarChart3,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';

export default function ReportsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [tList, cList, wList] = await Promise.all([
          dbService.getTickets(),
          dbService.getCategories(),
          dbService.getWilayah(),
        ]);
        setTickets(tList);
        setCategories(cList);
        setWilayahList(wList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute stats
  const total = tickets.length;
  const completed = tickets.filter(
    (t) => t.status === 'SELESAI_DIKERJAKAN' || t.status === 'DITUTUP'
  ).length;
  const inProgress = tickets.filter(
    (t) => t.status === 'DALAM_PROSES' || t.status === 'DITUGASKAN' || t.status === 'MENUNGGU'
  ).length;
  const newTickets = tickets.filter((t) => t.status === 'BARU').length;

  // Category counts
  const categoryStats = categories.map((c) => {
    const count = tickets.filter((t) => t.kategori_id === c.id).length;
    return {
      id: c.id,
      nama: c.nama,
      grup: c.grup,
      prioritas: c.prioritas_default,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  // Officer / Petugas breakdown
  const officers = ['Gugum', 'Fajar', 'Andi', 'Apri', 'Zidan', 'Rivaldi', 'Rizal'];
  const officerStats = officers.map((officer) => {
    const count = tickets.filter((t) => {
      const wil = wilayahList.find((w) => w.id === t.wilayah_id);
      return wil?.petugas === officer;
    }).length;
    return { officer, count };
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (tickets.length === 0) {
      alert('Tidak ada data tiket untuk diekspor.');
      return;
    }

    const headers = [
      'Nomor Tiket',
      'Status',
      'Prioritas',
      'Pelanggan',
      'No HP',
      'Kategori',
      'Wilayah',
      'Ukuran Pipa',
      'Deskripsi',
      'Teknisi',
      'Waktu Dibuat',
    ];

    const rows = tickets.map((t) => [
      `"${t.nomor_tiket}"`,
      `"${t.status}"`,
      `"${t.prioritas}"`,
      `"${t.nama_pelanggan.replace(/"/g, '""')}"`,
      `"${t.no_hp || ''}"`,
      `"${(t.kategori_nama || '').replace(/"/g, '""')}"`,
      `"${(t.wilayah_nama || '').replace(/"/g, '""')}"`,
      `"${t.ukuran_pipa || ''}"`,
      `"${t.deskripsi.replace(/"/g, '""')}"`,
      `"${t.assigned_to_nama || ''}"`,
      `"${t.created_at}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Tiket_PDAM_Cikembar_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-pdam-600" />
            <span>Rekap Laporan & Statistik Kinerja SLA</span>
          </h1>
          <p className="text-xs text-slate-500">
            Evaluasi pelayanan pengaduan lapangan PERUMDA Tirta Jaya Mandiri Cabang Cikembar
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Spreadsheet (CSV / Excel)</span>
        </button>
      </div>

      {/* KPI Highlight Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Total Aduan Masuk</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{total}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Semua kategori</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs text-emerald-600 font-medium">Tuntas Diselesaikan</span>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2">{completed}</div>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            {total > 0 ? `${Math.round((completed / total) * 100)}% Rasio Tuntas` : '0%'}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs text-amber-600 font-medium">Sedang Ditangani</span>
          <div className="text-3xl font-extrabold text-amber-700 mt-2">{inProgress}</div>
          <span className="text-[11px] text-amber-600 mt-1 block">Tahap tindak lanjut</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs text-blue-600 font-medium">Belum Ditugaskan</span>
          <div className="text-3xl font-extrabold text-blue-700 mt-2">{newTickets}</div>
          <span className="text-[11px] text-blue-600 mt-1 block">Menunggu delegasi kaur</span>
        </div>
      </div>

      {/* Grid: Kategori Breakdown & Petugas Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kategori Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Sebaran Menurut Kategori Gangguan</span>
            <PieChart className="w-4 h-4 text-pdam-600" />
          </h2>

          <div className="space-y-3">
            {categoryStats.map((c) => (
              <div key={c.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{c.nama}</span>
                  <span className="font-bold text-slate-900">{c.count} tiket ({c.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-pdam-600 h-2 rounded-full transition-all"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Petugas Baca Meter Blok Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Produktivitas Laporan per Petugas Pembaca Meter</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          </h2>

          <div className="divide-y divide-slate-100">
            {officerStats.map((o) => (
              <div key={o.officer} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{o.officer}</span>
                  <span className="text-slate-400 text-[11px] block">Wilayah Blok Distribusi</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-pdam-700">{o.count}</span>
                  <span className="text-slate-400 text-[11px]">tiket</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
