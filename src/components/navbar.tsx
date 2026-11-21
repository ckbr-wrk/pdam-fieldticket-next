'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export function Navbar() {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      {/* ── MOBILE HEADER (< 900px) ── */}
      <header id="app-header" className="min-[900px]:hidden no-print">
        <div className="hdr-left">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#ffffff',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
            <span className="hdr-title" style={{ color: '#fff', fontSize: 16 }}>
              Field Ticket Management System
            </span>
          </Link>
        </div>

        <div className="hdr-right">
          <Link
            href="/profile"
            className="hdr-bell"
            style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              color: '#fff',
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ── DESKTOP HEADER (>= 900px) ── */}
      <header
        id="app-header"
        className="hidden min-[900px]:flex no-print"
        style={{
          left: 'var(--side)',
          background: '#ffffff',
          color: 'var(--text)',
          boxShadow: '0 1px 0 var(--border)',
          height: 64,
          padding: '0 24px',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <div className="hdr-left">
          <div className="hdr-title" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>
              Field Ticket Management System
            </span>
            <small style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, display: 'block' }}>
              PERUMDA Tirta Jaya Mandiri &middot; Cabang Cikembar
            </small>
          </div>
        </div>

        <div className="hdr-right" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Bell Icon Notification */}
          <Link
            href="/profile"
            title="Profil &amp; Notifikasi"
            style={{
              position: 'relative',
              background: 'var(--primary-l)',
              color: 'var(--primary)',
              width: 38,
              height: 38,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span
              className="notif-badge"
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                background: '#FF5252',
                color: '#fff',
                borderRadius: 10,
                fontSize: 10,
                minWidth: 16,
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                padding: '0 3px',
              }}
            >
              0
            </span>
          </Link>

          {/* User Meta & Avatar */}
          <Link
            href="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#0B57D0',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {user?.nama ? user.nama.charAt(0) : '?'}
            </div>
          </Link>
        </div>
      </header>
    </>
  );
}
