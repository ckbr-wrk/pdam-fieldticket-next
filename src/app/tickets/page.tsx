'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/db';
import { Ticket, Wilayah } from '@/types';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';

const STATUS_CHIPS = [
  { id: 'SEMUA', label: 'Semua' },
  { id: 'BARU', label: 'Baru' },
  { id: 'DITUGASKAN', label: 'Ditugaskan' },
  { id: 'DALAM_PROSES', label: 'Dalam Proses' },
  { id: 'MENUNGGU', label: 'Menunggu' },
  { id: 'SELESAI_DIKERJAKAN', label: 'Selesai' },
  { id: 'DITUTUP', label: 'Ditutup' },
  { id: 'DIBATALKAN', label: 'Dibatalkan' },
];

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    BARU: 'bd-baru',
    DITUGASKAN: 'bd-ditugaskan',
    DALAM_PROSES: 'bd-dalam-proses',
    MENUNGGU: 'bd-menunggu',
    SELESAI_DIKERJAKAN: 'bd-selesai-dikerjakan',
    DITUTUP: 'bd-ditutup',
    DIBATALKAN: 'bd-dibatalkan',
  };
  return map[status] || '';
}

export default function TicketsListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('SEMUA');
  const [filterPrioritas, setFilterPrioritas] = useState('SEMUA');
  const [filterWilayah, setFilterWilayah] = useState('SEMUA');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [wils, data] = await Promise.all([
          dbService.getWilayah(),
          dbService.getTickets(),
        ]);
        setWilayahList(wils);
        setAllTickets(data);
        setTickets(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...allTickets];
    if (filterStatus !== 'SEMUA') {
      result = result.filter((t) => t.status === filterStatus);
    }
    if (filterPrioritas !== 'SEMUA') {
      result = result.filter((t) => t.prioritas === filterPrioritas);
    }
    if (filterWilayah !== 'SEMUA') {
      result = result.filter((t) => t.wilayah_id === filterWilayah);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.nomor_tiket?.toLowerCase().includes(q) ||
          t.nama_pelanggan?.toLowerCase().includes(q) ||
          t.wilayah_nama?.toLowerCase().includes(q) ||
          t.deskripsi?.toLowerCase().includes(q) ||
          t.kategori_nama?.toLowerCase().includes(q)
      );
    }
    setTickets(result);
  }, [allTickets, filterStatus, filterPrioritas, filterWilayah, search]);

  useEffect(() => {
    const timer = setTimeout(applyFilters, 150);
    return () => clearTimeout(timer);
  }, [applyFilters]);

  const activeFilterCount = [
    filterStatus !== 'SEMUA',
    filterPrioritas !== 'SEMUA',
    filterWilayah !== 'SEMUA',
  ].filter(Boolean).length;

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h2>Daftar Tiket</h2>
          <p className="page-sub">Semua tiket pengaduan &amp; gangguan PDAM Cikembar</p>
        </div>
        <Link href="/tickets/new" className="btn btn-primary btn-sm">
          + Buat Tiket
        </Link>
      </div>

      {/* ── Search Bar ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="search"
            placeholder="Cari apa saja (nomor tiket, nama, wilayah, keluhan)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: 38 }}
          />
          <svg
            viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ width: 17, height: 17, stroke: 'var(--muted)', position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <button
          type="button"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={`btn btn-sm${showFilterPanel || activeFilterCount > 0 ? ' btn-primary' : ' btn-secondary'}`}
          style={{ position: 'relative', whiteSpace: 'nowrap' }}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, stroke: 'currentColor', display: 'inline-block', marginRight: 4 }}>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter
          {activeFilterCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6, background: '#E53935', color: '#fff',
              borderRadius: 10, fontSize: 10, minWidth: 17, height: 17, display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: '0 4px', fontWeight: 700,
            }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Status Chips ─────────────────────────────────────────────── */}
      <div className="chips" style={{ marginBottom: 10 }}>
        {STATUS_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilterStatus(chip.id)}
            className={`chip${filterStatus === chip.id ? ' active' : ''}`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* ── Filter Panel ─────────────────────────────────────────────── */}
      {showFilterPanel && (
        <div className="card card-flat" style={{ background: '#F8FAFC', border: '1px solid var(--border)', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h4 style={{ margin: 0 }}>⚙️ Filter Lanjutan</h4>
            <button
              type="button"
              onClick={() => { setFilterStatus('SEMUA'); setFilterPrioritas('SEMUA'); setFilterWilayah('SEMUA'); setSearch(''); }}
              className="btn btn-sm btn-secondary"
            >
              Reset Filter
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Prioritas</label>
              <select value={filterPrioritas} onChange={(e) => setFilterPrioritas(e.target.value)} className="form-control">
                <option value="SEMUA">Semua Prioritas</option>
                <option value="KRITIS">KRITIS (SLA 2 Jam)</option>
                <option value="TINGGI">TINGGI (SLA 6 Jam)</option>
                <option value="SEDANG">SEDANG (SLA 24 Jam)</option>
                <option value="RENDAH">RENDAH (SLA 72 Jam)</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Wilayah</label>
              <select value={filterWilayah} onChange={(e) => setFilterWilayah(e.target.value)} className="form-control">
                <option value="SEMUA">Semua Wilayah</option>
                {wilayahList.map((w) => (
                  <option key={w.id} value={w.id}>{w.nama}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Counter ──────────────────────────────────────────────────── */}
      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 8 }}>
        Menampilkan <strong style={{ color: 'var(--navy)' }}>{tickets.length}</strong> dari <strong style={{ color: 'var(--navy)' }}>{allTickets.length}</strong> tiket
      </div>

      {/* ── Ticket List (tk-item style) ───────────────────────────────── */}
      {loading ? (
        <div className="loading-text">Memuat tiket...</div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Tidak ada tiket ditemukan</div>
          <p className="text-muted text-sm">Coba ubah kriteria pencarian atau filter status.</p>
        </div>
      ) : (
        <div className="tl-cards">
          {tickets.map((t) => (
            <Link
              key={t.id}
              href={`/tickets/${t.id}`}
              className={`tk-item ${getStatusClass(t.status)}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="tk-pin">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="tk-main">
                <div className="tk-top">
                  <span className="tk-no">{t.nomor_tiket}</span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <StatusBadge status={t.status} size="sm" />
                    <PriorityBadge prioritas={t.prioritas} showSla={false} />
                  </div>
                </div>
                <div className="tk-cat">
                  <strong>{t.nama_pelanggan}</strong>
                  {t.kategori_nama && <span style={{ color: 'var(--muted)', fontWeight: 400 }}> — {t.kategori_nama}</span>}
                </div>
                <div className="tk-meta">
                  {t.wilayah_nama && <span>📍 {t.wilayah_nama}</span>}
                  {t.assigned_to_nama && <span>🔧 {t.assigned_to_nama}</span>}
                  <span>
                    {new Date(t.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* FAB Mobile */}
      <Link
        href="/tickets/new"
        className="min-[900px]:hidden"
        style={{
          position: 'fixed', right: 16, bottom: 76, width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0A4CC0, #2A86F5)',
          boxShadow: '0 8px 24px rgba(10,76,192,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40,
          textDecoration: 'none', color: '#fff',
        }}
        title="Buat Laporan Baru"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26, stroke: '#fff' }}>
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>
    </div>
  );
}
