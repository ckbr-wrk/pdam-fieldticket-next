'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { INITIAL_USERS } from '@/lib/seed-data';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  PlusCircle,
  MapPin,
  BarChart3,
  ShieldCheck,
  UserCheck,
  ChevronUp,
  Cloud,
  HardDrive,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user, quickLogin, hasRole } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const isCloud = isSupabaseConfigured();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tickets', label: 'Daftar Tiket', icon: TicketIcon },
    { href: '/tickets/new', label: '+ Buat Laporan', icon: PlusCircle, isHighlight: true },
    { href: '/map', label: 'Peta Sebaran', icon: MapPin },
    { href: '/reports', label: 'Rekap Laporan', icon: BarChart3 },
    ...(hasRole(['admin', 'kaur', 'kepala_cabang'])
      ? [{ href: '/admin', label: 'Admin Panel', icon: ShieldCheck }]
      : []),
  ];

  const roleLabel: Record<string, string> = {
    petugas_baca: 'Petugas Baca Meter',
    kas: 'KAS (Kasir Lapangan)',
    petugas_teknik: 'Petugas Teknik',
    admin: 'Administrator',
    kaur: 'Ka.Ur Teknik & Distribusi',
    kepala_cabang: 'Kepala Cabang',
  };

  return (
    <aside
      className="hidden min-[900px]:flex fixed top-0 bottom-0 left-0 w-[240px] z-50 flex-col justify-between p-4 text-white shadow-xl select-none"
      style={{
        background: 'linear-gradient(180deg, #0A1F44 0%, #0C2B63 100%)',
      }}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 pt-1 pb-3 border-b border-white/10 group">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-105">
            <img
              src="/logo-pdam.png"
              alt="Logo PDAM"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to text if img not loaded
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-[15px] leading-tight text-white tracking-tight truncate">
              PDAM FieldTicket
            </h1>
            <p className="text-[11px] text-blue-200 font-medium truncate">
              Cabang Cikembar
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            if (item.isHighlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    active
                      ? 'bg-blue-600 text-white shadow-blue-500/40'
                      : 'bg-blue-600/90 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#1E6CF0] text-white font-semibold shadow-md shadow-blue-900/30'
                    : 'text-[#B9C6E4] hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Database Mode & User Profile with Quick Role Switcher */}
      <div className="pt-3 border-t border-white/10 space-y-3 relative">
        {/* Cloud / Local Mode Pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            isCloud
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
              : 'bg-amber-950/60 text-amber-300 border-amber-700/50'
          }`}
        >
          {isCloud ? <Cloud className="w-3.5 h-3.5" /> : <HardDrive className="w-3.5 h-3.5" />}
          <span className="truncate">{isCloud ? 'Supabase Cloud' : 'Local Hybrid'}</span>
        </div>

        {/* User Card with Role Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white text-[#0A4CC0] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {user?.nama.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-white truncate max-w-[120px]">
                  {user?.nama || 'Petugas'}
                </div>
                <div className="text-[10.5px] text-blue-200 truncate">
                  {roleLabel[user?.role || ''] || user?.role}
                </div>
              </div>
            </div>
            <ChevronUp
              className={`w-4 h-4 text-white/60 transition-transform ${
                userDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Quick Role Switcher Modal / Popup */}
          {userDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserDropdownOpen(false)}
              />
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ganti Peran Petugas:
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Pilih akun untuk simulasi hak akses:
                  </p>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {INITIAL_USERS.map((u) => (
                    <button
                      key={u.user_id}
                      type="button"
                      onClick={() => {
                        quickLogin(u.user_id);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                        user?.user_id === u.user_id
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{u.nama}</div>
                        <div className="text-[10px] text-slate-500 capitalize">
                          {roleLabel[u.role] || u.role}
                        </div>
                      </div>
                      {user?.user_id === u.user_id && (
                        <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
