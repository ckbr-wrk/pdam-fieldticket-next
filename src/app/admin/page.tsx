'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { dbService } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { User, Wilayah, Category } from '@/types';
import {
  ShieldCheck,
  Users,
  MapPin,
  Tag,
  Database,
  Cloud,
  HardDrive,
  Copy,
  CheckCircle2,
  Key,
  ExternalLink,
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'wilayah' | 'kategori' | 'supabase'>('users');

  const [users, setUsers] = useState<User[]>([]);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [copied, setCopied] = useState(false);

  const isCloud = isSupabaseConfigured();

  useEffect(() => {
    async function load() {
      try {
        const [u, w, c] = await Promise.all([
          dbService.getUsers(),
          dbService.getWilayah(),
          dbService.getCategories(),
        ]);
        setUsers(u);
        setWilayahList(w);
        setCategories(c);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleCopySql = () => {
    const sqlText = `-- Jalankan file supabase/schema.sql di SQL Editor Supabase Anda`;
    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-pdam-600" />
            <span>Admin Panel & Master Data</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pusat konfigurasi pengguna, wilayah distribusi, kategori pipa, dan integrasi Supabase
          </p>
        </div>

        {/* Database Mode Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white shadow-sm text-xs">
          {isCloud ? (
            <>
              <Cloud className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-700">Supabase Cloud Aktif</span>
            </>
          ) : (
            <>
              <HardDrive className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-amber-800">Local Hybrid Mode</span>
            </>
          )}
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-pdam-600 text-pdam-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pengguna & Petugas ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wilayah')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'wilayah'
              ? 'border-pdam-600 text-pdam-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Wilayah Cikembar ({wilayahList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kategori')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'kategori'
              ? 'border-pdam-600 text-pdam-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Kategori & SLA ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'supabase'
              ? 'border-pdam-600 text-pdam-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Koneksi Supabase</span>
        </button>
      </div>

      {/* Tab 1: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Daftar Akun Pengguna & Petugas</h3>
              <p className="text-xs text-slate-500">Mencakup seluruh 6 role sistem PDAM FieldTicket</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Lengkap</th>
                  <th className="px-4 py-3">Email Login</th>
                  <th className="px-4 py-3">Role / Jabatan</th>
                  <th className="px-4 py-3">Wilayah Tugas</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.user_id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-slate-900">{u.nama}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pdam-50 text-pdam-700 uppercase border border-pdam-100">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {u.wilayah_id ? `Kode ${u.wilayah_id}` : 'Semua Wilayah'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Aktif</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Wilayah */}
      {activeTab === 'wilayah' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Master 50 Wilayah Resmi Cabang Cikembar</h3>
            <p className="text-xs text-slate-500">
              Dibagi ke dalam 7 Blok Pembaca Meter (Gugum, Fajar, Andi, Apri, Zidan, Rivaldi, Rizal)
            </p>
          </div>
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3">Kode ID</th>
                  <th className="px-4 py-3">Nama Wilayah / Rute</th>
                  <th className="px-4 py-3">Petugas Pembaca Meter</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wilayahList.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-2.5 font-mono font-bold text-pdam-700">{w.id}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-900">{w.nama}</td>
                    <td className="px-4 py-2.5 font-bold text-purple-700">{w.petugas}</td>
                    <td className="px-4 py-2.5 text-emerald-600 font-semibold">Aktif</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Kategori */}
      {activeTab === 'kategori' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Master Kategori Gangguan & SLA</h3>
            <p className="text-xs text-slate-500">
              Standar Layanan Operasional (SLA) respon gangguan teknis PDAM
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Kode Kategori</th>
                  <th className="px-4 py-3">Nama Gangguan</th>
                  <th className="px-4 py-3">Divisi / Grup</th>
                  <th className="px-4 py-3">Prioritas Standar</th>
                  <th className="px-4 py-3">Maksimal SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">{c.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{c.nama}</td>
                    <td className="px-4 py-3 text-slate-600">{c.grup}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-pdam-700">{c.prioritas_default}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {c.prioritas_default === 'KRITIS'
                        ? '2 Jam'
                        : c.prioritas_default === 'TINGGI'
                        ? '6 Jam'
                        : c.prioritas_default === 'SEDANG'
                        ? '24 Jam'
                        : '72 Jam'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Supabase Connection Guide */}
      {activeTab === 'supabase' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Panduan Menghubungkan ke Supabase Cloud
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Aplikasi ini telah dirancang dengan arsitektur cloud-first Supabase. Anda dapat langsung menghubungkan database PostgreSQL dan Storage Supabase dengan 3 langkah mudah:
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pdam-600 text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>Buat Project di Supabase</span>
              </div>
              <p className="pl-7 text-slate-600">
                Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-pdam-600 underline font-semibold">https://supabase.com</a> dan buat project baru (gratis).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pdam-600 text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>Jalankan Script Skema Database Lengkap</span>
              </div>
              <p className="pl-7 text-slate-600">
                Salin dan jalankan seluruh isi file <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800">supabase/schema.sql</code> di menu <strong>SQL Editor</strong> di dashboard Supabase Anda. Script tersebut otomatis membuat semua tabel, 50 wilayah, 6 kategori, dan storage bucket foto.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pdam-600 text-white flex items-center justify-center text-xs">
                  3
                </span>
                <span>Masukkan Kredensial ke .env.local</span>
              </div>
              <p className="pl-7 text-slate-600">
                Salin <strong>Project URL</strong> dan <strong>Anon Public Key</strong> dari Settings API Supabase Anda ke file <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800">.env.local</code> di direktori proyek ini:
              </p>
              <div className="pl-7">
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
