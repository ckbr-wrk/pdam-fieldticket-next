'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { INITIAL_USERS } from '@/lib/seed-data';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Bell,
  UserCheck,
  ChevronDown,
  Cloud,
  HardDrive,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, quickLogin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isCloud = isSupabaseConfigured();

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard Utama';
    if (pathname === '/tickets') return 'Daftar Tiket Gangguan';
    if (pathname === '/tickets/new') return 'Input Laporan Baru';
    if (pathname === '/map') return 'Peta Sebaran Titik Gangguan';
    if (pathname === '/reports') return 'Rekapitulasi Laporan & SLA';
    if (pathname === '/admin') return 'Admin Panel & Master Data';
    if (pathname.includes('/tickets/')) return 'Detail Tiket Gangguan';
    return 'PDAM FieldTicket';
  };

  const roleLabel: Record<string, string> = {
    petugas_baca: 'Pembaca Meter',
    kas: 'KAS Lapangan',
    petugas_teknik: 'Teknisi',
    admin: 'Admin',
    kaur: 'Ka.Ur',
    kepala_cabang: 'Kepala Cabang',
  };

  return (
    <>
      {/* ── MOBILE HEADER (< 900px) ───────────────────────────────────────── */}
      <header
        className="min-[900px]:hidden fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-3 text-white shadow-md select-none no-print"
        style={{
          background: 'linear-gradient(90deg, #0A4CC0 0%, #1A73E8 100%)',
        }}
      >
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow">
            <img
              src="/logo-pdam.png"
              alt="Logo PDAM"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm leading-tight tracking-tight truncate">
              PDAM FieldTicket
            </h1>
            <p className="text-[10px] text-blue-100 font-medium truncate">
              Cabang Cikembar
            </p>
          </div>
        </Link>

        {/* Mobile Right: Role Switcher & Notification */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-white text-[#0A4CC0] flex items-center justify-center text-[10px] font-bold uppercase">
                {user?.nama.charAt(0) || 'U'}
              </div>
              <span className="max-w-[70px] truncate text-[11px] font-bold">
                {roleLabel[user?.role || ''] || user?.role}
              </span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Ganti Akun Demo:
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {INITIAL_USERS.map((u) => (
                      <button
                        key={u.user_id}
                        type="button"
                        onClick={() => {
                          quickLogin(u.user_id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 ${
                          user?.user_id === u.user_id ? 'bg-blue-50 text-blue-700 font-bold' : ''
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{u.nama}</div>
                          <div className="text-[10px] text-slate-500 capitalize">{u.role}</div>
                        </div>
                        {user?.user_id === u.user_id && (
                          <UserCheck className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── DESKTOP HEADER (>= 900px) ───────────────────────────────────────── */}
      <header className="hidden min-[900px]:flex fixed top-0 right-0 left-[240px] h-16 z-40 items-center justify-between px-8 bg-white border-b border-slate-200/80 shadow-sm no-print">
        <div>
          <h2 className="text-lg font-bold text-[#0A1F44] tracking-tight">
            {getPageTitle()}
          </h2>
          <p className="text-xs text-slate-400">
            PERUMDA Air Minum Tirta Jaya Mandiri Cabang Cikembar
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isCloud
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {isCloud ? <Cloud className="w-3.5 h-3.5" /> : <HardDrive className="w-3.5 h-3.5" />}
            <span>{isCloud ? 'Supabase Cloud Connected' : 'Local Hybrid Store'}</span>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* User profile summary */}
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <span className="font-bold text-xs text-slate-800 block">
                {user?.nama}
              </span>
              <span className="text-[11px] text-blue-600 font-semibold uppercase">
                {roleLabel[user?.role || ''] || user?.role}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0A4CC0] text-white flex items-center justify-center font-bold text-xs shadow-md">
              {user?.nama.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
