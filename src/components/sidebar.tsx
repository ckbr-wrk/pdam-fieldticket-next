'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { INITIAL_USERS } from '@/lib/seed-data';

export function Sidebar() {
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const { user, quickLogin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setCurrentTab(params.get('tab'));
    }
  }, [pathname]);

  // Cek apakah item aktif
  const isActive = (itemHref: string) => {
    if (itemHref === '/') return pathname === '/';
    if (itemHref === '/tickets') return pathname === '/tickets';
    if (itemHref === '/tickets/new') return pathname === '/tickets/new';
    if (itemHref === '/map') return pathname === '/map';
    if (itemHref === '/reports') return pathname === '/reports';
    if (itemHref === '/admin?tab=users') return pathname === '/admin' && (!currentTab || currentTab === 'users');
    if (itemHref === '/admin?tab=categories') return pathname === '/admin' && currentTab === 'categories';
    if (itemHref === '/profile') return pathname === '/profile';
    return pathname.startsWith(itemHref);
  };

  const navItems = [
    {
      label: 'Beranda',
      href: '/',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: 'Tiket',
      href: '/tickets',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M7 8h10" />
          <path d="M7 12h10" />
          <path d="M7 16h6" />
        </svg>
      ),
    },
    {
      label: 'Lapor',
      href: '/tickets/new',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      label: 'Peta',
      href: '/map',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      ),
    },
    {
      label: 'Laporan',
      href: '/reports',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      label: 'Pengguna',
      href: '/admin?tab=users',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: 'Master',
      href: '/admin?tab=categories',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      label: 'Profil',
      href: '/profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <nav id="bottom-nav">
      {/* ── Sidebar Brand (Desktop) ── */}
      <div className="sb-brand">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: '#ffffff',
            padding: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            flexShrink: 0,
          }}
        >
          <img
            src="/logo-pdam.png"
            alt="Logo PDAM"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div>
          <div className="sb-1">PERUMDA AIR MINUM</div>
          <div className="sb-2">TIRTA JAYA MANDIRI</div>
          <div className="sb-3">Cabang Cikembar</div>
        </div>
      </div>

      {/* ── Nav Links ── */}
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${active ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}

      {/* ── User Meta di Bawah Sidebar (Desktop) ── */}
      <div
        className="sb-user"
        style={{ cursor: 'pointer', position: 'relative' }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title="Ganti Pengguna Demo"
      >
        <div
          className="avatar"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {user?.nama ? user.nama.charAt(0) : '?'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <b
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
          >
            {user?.nama || 'Administrator'}
          </b>
          <span>{user?.role === 'admin' ? 'Admin' : (user?.role || 'Pengguna')}</span>
        </div>

        {/* Dropdown switch user demo */}
        {dropdownOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 110 }}
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(false);
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                width: 220,
                marginBottom: 8,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 10px 35px rgba(0,0,0,0.3)',
                border: '1px solid #CBD5E1',
                zIndex: 120,
                color: '#1E293B',
                overflow: 'hidden',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '8px 12px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                PILIH AKUN LOGIN:
              </div>
              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {INITIAL_USERS.map((u) => (
                  <button
                    key={u.user_id}
                    type="button"
                    onClick={() => {
                      quickLogin(u.user_id);
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      border: 'none',
                      background: user?.user_id === u.user_id ? '#EFF6FF' : 'transparent',
                      color: user?.user_id === u.user_id ? '#1D4ED8' : '#334155',
                      fontWeight: user?.user_id === u.user_id ? 700 : 400,
                      cursor: 'pointer',
                      fontSize: 12,
                      borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    <div>{u.nama}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>{u.role}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
