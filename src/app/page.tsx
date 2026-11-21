'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { dbService } from '@/lib/db';
import { Ticket } from '@/types';

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
        console.error('Failed to load tickets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const total = tickets.length;
  const baru = tickets.filter((t) => t.status === 'BARU').length;
  const ditugaskan = tickets.filter((t) => t.status === 'DITUGASKAN').length;
  const proses = tickets.filter((t) => t.status === 'DALAM_PROSES').length;
  const menunggu = tickets.filter((t) => t.status === 'MENUNGGU').length;
  const selesai = tickets.filter((t) => t.status === 'SELESAI_DIKERJAKAN' || t.status === 'SELESAI').length;
  const ditutup = tickets.filter((t) => t.status === 'DITUTUP').length;
  const dibatalkan = tickets.filter((t) => t.status === 'DIBATALKAN').length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  const roleLabel: Record<string, string> = {
    petugas_baca: 'Petugas Baca Meter',
    kas: 'KAS (Kasir Lapangan)',
    petugas_teknik: 'Petugas Teknik',
    admin: 'Administrator',
    kaur: 'Ka.Ur',
    kepala_cabang: 'Kepala Cabang',
  };

  // Status segments for donut
  const segments = [
    { label: 'Baru', value: baru, color: '#E53935' },
    { label: 'Ditugaskan', value: ditugaskan, color: '#1E88E5' },
    { label: 'Dalam Proses', value: proses, color: '#FB8C00' },
    { label: 'Menunggu', value: menunggu, color: '#F9C80E' },
    { label: 'Selesai', value: selesai, color: '#43A047' },
    { label: 'Ditutup', value: ditutup, color: '#78909C' },
    { label: 'Dibatalkan', value: dibatalkan, color: '#B0BEC5' },
  ];

  // Conic gradient calculation
  const totalCount = total || 1;
  let acc = 0;
  const gradientParts = segments.map((s) => {
    const from = (acc / totalCount) * 100;
    acc += s.value;
    const to = (acc / totalCount) * 100;
    return `${s.color} ${from.toFixed(2)}% ${to.toFixed(2)}%`;
  });
  const donutBg = total > 0 ? `conic-gradient(${gradientParts.join(', ')})` : '#E6EBF3';

  // Group by category for bar chart
  const categoryCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    const cat = t.kategori_nama || 'Lainnya';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  // Group by wilayah for bar chart
  const wilayahCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    const w = t.wilayah_nama ? t.wilayah_nama.split(' - ')[1] || t.wilayah_nama : 'Cikembar';
    wilayahCounts[w] = (wilayahCounts[w] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const maxCat = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;

  const sortedWilayah = Object.entries(wilayahCounts).sort((a, b) => b[1] - a[1]).slice(0, 7);
  const maxWil = sortedWilayah.length > 0 ? sortedWilayah[0][1] : 1;

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      BARU: { label: 'Baru', cls: 'st-baru' },
      DITUGASKAN: { label: 'Ditugaskan', cls: 'st-ditugaskan' },
      DALAM_PROSES: { label: 'Dalam Proses', cls: 'st-dalam-proses' },
      MENUNGGU: { label: 'Menunggu', cls: 'st-menunggu' },
      SELESAI_DIKERJAKAN: { label: 'Selesai', cls: 'st-selesai-dikerjakan' },
      SELESAI: { label: 'Selesai', cls: 'st-selesai-dikerjakan' },
      DITUTUP: { label: 'Ditutup', cls: 'st-ditutup' },
      DIBATALKAN: { label: 'Dibatalkan', cls: 'st-dibatalkan' },
    };
    const s = map[status] || { label: status, cls: 'st-ditutup' };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  };

  const getPrioPill = (prio: string) => {
    const p = (prio || '').toUpperCase();
    const map: Record<string, string> = {
      KRITIS: 'pr-kritis',
      TINGGI: 'pr-tinggi',
      SEDANG: 'pr-sedang',
      RENDAH: 'pr-rendah',
    };
    return <span className={`pill ${map[p] || 'pr-rendah'}`}>{prio}</span>;
  };

  return (
    <div className="view-container">
      {/* ── 1. WELCOME HERO CARD ─────────────────────────────────────── */}
      <div
        className="hero-card"
        style={{
          background: 'linear-gradient(135deg, #1E6CF0 0%, #1557CD 100%)',
          borderRadius: 18,
          padding: '24px 22px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 16,
          boxShadow: '0 8px 24px rgba(10,76,192,0.25)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: 13.5, opacity: 0.9, marginBottom: 4 }}>{greeting},</p>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '2px 0 10px', color: '#fff' }}>
            {user?.nama || 'Administrator'}
          </h2>
          <span
            style={{
              display: 'inline-block',
              background: '#ffffff',
              color: '#0B57D0',
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: 0.5,
              padding: '3px 12px',
              borderRadius: 6,
              textTransform: 'uppercase',
            }}
          >
            {user?.role === 'admin' ? 'ADMIN' : (user?.role || 'ADMIN').toUpperCase()}
          </span>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 20,
            fontSize: 22,
            opacity: 0.9,
            zIndex: 1,
          }}
        >
          💧
        </div>
        {/* Soft background circles */}
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -20,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── 2. INPUT LAPORAN LAPANGAN BANNER (ADMIN) ────────────────── */}
      <div
        style={{
          background: '#EFF6FF',
          border: '1.5px solid #BFDBFE',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, color: '#1E40AF', fontSize: 14 }}>
            📝 Input Laporan Lapangan
          </div>
          <div style={{ fontSize: 12.5, color: '#3B82F6', marginTop: 2 }}>
            Buat laporan pengaduan / kebocoran pipa baru langsung sebagai Admin.
          </div>
        </div>
        <Link
          href="/tickets/new"
          className="btn btn-primary"
          style={{
            fontWeight: 700,
            fontSize: 13.5,
            padding: '9px 18px',
            borderRadius: 8,
            backgroundColor: '#0B57D0',
            color: '#fff',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          + Buat Laporan Baru
        </Link>
      </div>

      {/* ── 3. STAT CARDS (Vertikal / Full-Width Memanjang) ───────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {/* Total Tiket */}
        <Link href="/tickets" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="stat-ic ic-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <path d="M7 8h10" />
              <path d="M7 12h10" />
              <path d="M7 16h6" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Tiket</div>
          </div>
        </Link>

        {/* Baru */}
        <Link href="/tickets?status=BARU" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="stat-ic ic-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{baru}</div>
            <div className="stat-label">Baru</div>
          </div>
        </Link>

        {/* Dalam Proses */}
        <Link href="/tickets?status=DALAM_PROSES" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="stat-ic ic-orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{proses}</div>
            <div className="stat-label">Dalam Proses</div>
          </div>
        </Link>

        {/* Selesai */}
        <Link href="/tickets?status=SELESAI_DIKERJAKAN" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="stat-ic ic-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{selesai}</div>
            <div className="stat-label">Selesai</div>
          </div>
        </Link>

        {/* Ditutup */}
        <Link href="/tickets?status=DITUTUP" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="stat-ic ic-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{ditutup}</div>
            <div className="stat-label">Ditutup</div>
          </div>
        </Link>
      </div>

      {/* ── 4. DISTRIBUSI TIKET (DONUT CHART) ───────────────────────── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 className="card-title" style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>
          Distribusi Tiket
        </h3>
        <div className="donut-wrap">
          <div className="donut" style={{ background: donutBg }}>
            <div className="donut-hole">
              <b>{total}</b>
              <span>Total</span>
            </div>
          </div>
          <ul className="donut-legend">
            {segments.map((s) => (
              <li key={s.label}>
                <i style={{ background: s.color }} />
                <span>{s.label}</span>
                <em>{s.value}</em>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 5. KPI OPERASIONAL & DIAGRAM BATANG ──────────────────────── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 className="card-title" style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>
          KPI Operasional
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {/* Diagram Kategori */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7A90', margin: '0 0 8px' }}>
              📊 DIAGRAM BATANG PER KATEGORI
            </p>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 12 }}>
              {sortedCategories.slice(0, 5).map(([catName, count]) => (
                <div key={catName} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>
                    <span style={{ maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{catName}</span>
                    <span>{count}</span>
                  </div>
                  <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((count / maxCat) * 100)}%`, background: 'linear-gradient(90deg, #1E6CF0, #5AA2FF)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagram Wilayah */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7A90', margin: '0 0 8px' }}>
              🗺️ DIAGRAM BATANG PER WILAYAH
            </p>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 12 }}>
              {sortedWilayah.map(([wilName, count]) => (
                <div key={wilName} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>
                    <span style={{ maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wilName}</span>
                    <span>{count}</span>
                  </div>
                  <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((count / maxWil) * 100)}%`, background: 'linear-gradient(90deg, #10B981, #34D399)', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. TIKET TERBARU ────────────────────────────────────────── */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 className="card-title" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
            Tiket Terbaru
          </h3>
          <Link
            href="/tickets"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: 12, padding: '4px 10px', textDecoration: 'none' }}
          >
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <div className="loading-text" style={{ padding: '20px 0', textAlign: 'center', color: '#64748B' }}>
            Memuat tiket...
          </div>
        ) : recentTickets.length === 0 ? (
          <p className="text-muted text-sm">Belum ada tiket.</p>
        ) : (
          <div className="tk-list">
            {recentTickets.map((t) => {
              const ticketId = t.ticket_id || t.id || t.nomor_tiket;
              return (
                <Link
                  key={ticketId}
                  href={`/tickets/${ticketId}`}
                  className={`tk-item bd-${t.status.toLowerCase().replace(/_/g, '-')}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="tk-pin">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="tk-main">
                    <div className="tk-top">
                      <span className="tk-no">{t.nomor_tiket}</span>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {getStatusBadge(t.status)}
                      </div>
                    </div>
                    <div className="tk-cat" style={{ fontWeight: 600, color: '#1E293B', margin: '3px 0' }}>
                      {t.nama_pelanggan} - {t.kategori_nama}
                      {t.ukuran_pipa && (
                        <span
                          className="pill"
                          style={{
                            background: '#E0F2FE',
                            color: '#0369A1',
                            fontWeight: 700,
                            fontSize: 11,
                            padding: '2px 7px',
                            marginLeft: 6,
                            borderRadius: 4,
                            border: '1px solid #BAE6FD',
                          }}
                        >
                          🔧 {t.ukuran_pipa}
                        </span>
                      )}
                    </div>
                    <div className="tk-meta" style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--muted)', alignItems: 'center' }}>
                      {getPrioPill(t.prioritas)}
                      <span>📍 {t.wilayah_nama}</span>
                      <span>🕒 {new Date(t.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
