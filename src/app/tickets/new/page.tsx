'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { dbService } from '@/lib/db';
import { Category, Wilayah, Priority } from '@/types';
import {
  MapPin,
  Camera,
  AlertCircle,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Crosshair,
  User,
  Phone,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

export default function NewTicketPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [pelangganId, setPelangganId] = useState('');
  const [noHp, setNoHp] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [wilayahId, setWilayahId] = useState('');
  const [ukuranPipa, setUkuranPipa] = useState('1/2"');
  const [prioritas, setPrioritas] = useState<Priority>('KRITIS');
  const [deskripsi, setDeskripsi] = useState('');

  // GPS State
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [akurasiGps, setAkurasiGps] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Foto State
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadMasters() {
      try {
        const [cats, wils] = await Promise.all([
          dbService.getCategories(),
          dbService.getWilayah(),
        ]);
        setCategories(cats);
        setWilayahList(wils);

        if (cats.length > 0) {
          setKategoriId(cats[0].id);
          setPrioritas(cats[0].prioritas_default);
        }
        if (wils.length > 0) {
          // If user has preferred wilayah, select that
          const preferred = user?.wilayah_id
            ? wils.find((w) => w.id === user.wilayah_id)
            : wils[0];
          setWilayahId(preferred ? preferred.id : wils[0].id);
        }
      } catch (e) {
        console.error('Failed to load masters', e);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadMasters();
  }, [user]);

  // When category changes, auto-set default priority
  const handleCategoryChange = (catId: string) => {
    setKategoriId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      setPrioritas(cat.prioritas_default);
    }
  };

  // Capture GPS via navigator.geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung pendeteksian lokasi GPS.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setAkurasiGps(Math.round(pos.coords.accuracy));
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsError('Gagal mengambil titik GPS. Pastikan izin lokasi diaktifkan.');
        // Fallback default Cikembar coordinates for testing
        setLat(-6.9832);
        setLng(106.7845);
        setAkurasiGps(5.0);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Photo Capture & Compress using HTML5 Canvas
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setFotoPreview(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPelanggan.trim() || !deskripsi.trim() || !kategoriId || !wilayahId) {
      alert('Mohon lengkapi nama pelanggan, wilayah, kategori, dan deskripsi!');
      return;
    }

    setSubmitting(true);
    try {
      const created = await dbService.createTicket({
        pelapor_id: user?.user_id || 'usr-baca-01',
        pelapor_nama: user?.nama || 'Petugas Lapangan',
        pelanggan_id: pelangganId,
        nama_pelanggan: namaPelanggan,
        no_hp: noHp,
        ukuran_pipa: ukuranPipa,
        kategori_id: kategoriId,
        wilayah_id: wilayahId,
        deskripsi,
        prioritas,
        lat,
        lng,
        akurasi_gps: akurasiGps,
        foto_sebelum_url: fotoPreview || undefined,
      });

      router.push(`/tickets/${created.id}`);
    } catch (err: any) {
      alert('Gagal membuat tiket: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedWilayah = wilayahList.find((w) => w.id === wilayahId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/tickets"
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Input Tiket Gangguan Baru
          </h1>
          <p className="text-xs text-slate-500">
            Formulir pelaporan gangguan dan kebocoran pipa lapangan PDAM Cabang Cikembar
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
        {/* Section 1: Data Pelanggan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-slate-800">
            <User className="w-4 h-4 text-pdam-600" />
            <span>1. Identitas Pelanggan & Lokasi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Pelanggan / Pelapor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ahmad Suhendar / RT 02"
                value={namaPelanggan}
                onChange={(e) => setNamaPelanggan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pdam-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. HP / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  placeholder="0812xxxxxxxx"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pdam-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Pelanggan / ID Sambungan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: 01020304"
                value={pelangganId}
                onChange={(e) => setPelangganId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pdam-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Wilayah / Blok Distribusi <span className="text-red-500">*</span>
              </label>
              <select
                value={wilayahId}
                onChange={(e) => setWilayahId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pdam-500 focus:border-transparent bg-white"
              >
                {wilayahList.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.nama}
                  </option>
                ))}
              </select>
              {selectedWilayah && (
                <p className="text-[11px] text-pdam-700 mt-1">
                  Petugas Pembaca Meter: <strong>{selectedWilayah.petugas}</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Klasifikasi Gangguan & Teknis */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-slate-800">
            <FileText className="w-4 h-4 text-pdam-600" />
            <span>2. Klasifikasi Gangguan & Spesifikasi Teknis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Gangguan <span className="text-red-500">*</span>
              </label>
              <select
                value={kategoriId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pdam-500 focus:border-transparent bg-white font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.grup}] {c.nama} (Prioritas: {c.prioritas_default})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prioritas Penanganan (SLA)
              </label>
              <select
                value={prioritas}
                onChange={(e) => setPrioritas(e.target.value as Priority)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pdam-500 focus:border-transparent bg-white font-semibold text-slate-800"
              >
                <option value="KRITIS">KRITIS (SLA 2 Jam)</option>
                <option value="TINGGI">TINGGI (SLA 6 Jam)</option>
                <option value="SEDANG">SEDANG (SLA 24 Jam)</option>
                <option value="RENDAH">RENDAH (SLA 72 Jam)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ukuran Pipa (Jika Kebocoran)
              </label>
              <select
                value={ukuranPipa}
                onChange={(e) => setUkuranPipa(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pdam-500 focus:border-transparent bg-white"
              >
                <option value="1/2&quot;">1/2 Inch</option>
                <option value="3/4&quot;">3/4 Inch</option>
                <option value="1&quot;">1 Inch</option>
                <option value="1 1/2&quot;">1 1/2 Inch</option>
                <option value="2&quot;">2 Inch</option>
                <option value="3&quot;">3 Inch</option>
                <option value="Tidak Diketahui">- Tidak Ada / Non-Pipa -</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deskripsi Gangguan & Patokan Lokasi <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Jelaskan kondisi kebocoran, semburan air, atau patokan rumah (contoh: depan mushola, samping tiang listrik)"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pdam-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Geotagging GPS Lapangan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-slate-800">
            <MapPin className="w-4 h-4 text-pdam-600" />
            <span>3. Titik Koordinat GPS Geotagging</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-800">
                Koordinat Lokasi Gangguan:
              </div>
              {lat && lng ? (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)} (Akurasi: ±{akurasiGps}m)
                  </span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  Belum ada koordinat. Klik tombol di samping untuk mengambil GPS saat di lokasi.
                </div>
              )}
              {gpsError && <p className="text-xs text-red-500">{gpsError}</p>}
            </div>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gpsLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pdam-600 hover:bg-pdam-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {gpsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Crosshair className="w-4 h-4" />
              )}
              <span>{lat ? 'Perbarui Titik GPS' : 'Ambil Titik GPS Sekarang'}</span>
            </button>
          </div>
        </div>

        {/* Section 4: Bukti Foto Lapangan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-slate-800">
            <Camera className="w-4 h-4 text-pdam-600" />
            <span>4. Bukti Foto Lapangan (SEBELUM / Kondisi Awal)</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="cursor-pointer flex flex-col items-center justify-center w-full sm:w-48 h-36 border-2 border-dashed border-slate-300 hover:border-pdam-500 rounded-2xl bg-slate-50 hover:bg-pdam-50/50 transition-colors p-4 text-center">
              <Camera className="w-8 h-8 text-pdam-600 mb-1" />
              <span className="text-xs font-bold text-slate-700">Ambil / Pilih Foto</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Kompresi Otomatis</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>

            {fotoPreview ? (
              <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={fotoPreview}
                  alt="Bukti Sebelum"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFotoPreview(null)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white text-xs hover:bg-red-700 shadow"
                >
                  ✕
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] py-1 text-center font-semibold">
                  Foto Terlampir
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                *Foto kondisi kebocoran pipa atau meteran air sangat disarankan untuk acuan teknisi.
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            href="/tickets"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pdam-600 hover:bg-pdam-700 text-white text-sm font-bold shadow-md shadow-pdam-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Tiket...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan & Kirim Tiket</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
