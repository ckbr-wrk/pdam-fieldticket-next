'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { INITIAL_USERS } from '@/lib/seed-data';

export default function ProfilePage() {
  const { user, logout, quickLogin } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setMessage('Password baru minimal 6 karakter.');
      return;
    }
    setMessage('Password berhasil diperbarui.');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="view-container">
      <div className="card" style={{ maxWidth: 600, margin: '0 auto 20px', padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: '#0B57D0',
              color: '#fff',
              fontSize: 32,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            {user?.nama ? user.nama.charAt(0) : '?'}
          </div>
          <h2 style={{ fontSize: 20, color: 'var(--navy)', margin: '4px 0' }}>
            {user?.nama || 'Administrator'}
          </h2>
          <span
            className="badge st-ditugaskan"
            style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20 }}
          >
            {user?.role ? user.role.toUpperCase() : 'ADMIN'}
          </span>
        </div>

        <div style={{ borderTop: '1px solid #EDF0F6', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13.5 }}>
            <span style={{ color: 'var(--muted)' }}>User ID</span>
            <b>{user?.user_id}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13.5 }}>
            <span style={{ color: 'var(--muted)' }}>Email</span>
            <b>{user?.email}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13.5 }}>
            <span style={{ color: 'var(--muted)' }}>Wilayah Tugas</span>
            <b>{user?.wilayah_id || 'Seluruh Cabang Cikembar'}</b>
          </div>
        </div>

        {/* Ganti Password Form */}
        <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
          🔒 Ganti Password
        </h4>
        {message && (
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
            {message}
          </div>
        )}
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Password Lama</label>
            <input
              type="password"
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan password saat ini"
            />
          </div>
          <div className="form-group">
            <label>Password Baru</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 14 }}>
            Simpan Password Baru
          </button>
        </form>

        <button
          type="button"
          onClick={logout}
          className="btn btn-secondary"
          style={{ width: '100%', color: '#DC2626', borderColor: '#FECACA' }}
        >
          Keluar dari Akun (Logout)
        </button>
      </div>

      {/* Switch Demo User */}
      <div className="card" style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>
          🔄 Simulasi Ganti Peran Petugas (Demo Mode)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {INITIAL_USERS.map((u) => (
            <button
              key={u.user_id}
              type="button"
              onClick={() => quickLogin(u.user_id)}
              className="btn btn-sm"
              style={{
                background: user?.user_id === u.user_id ? '#0B57D0' : '#F1F5F9',
                color: user?.user_id === u.user_id ? '#fff' : '#1E293B',
                justifyContent: 'flex-start',
                textAlign: 'left',
                padding: '8px 10px',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{u.nama}</div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>{u.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
