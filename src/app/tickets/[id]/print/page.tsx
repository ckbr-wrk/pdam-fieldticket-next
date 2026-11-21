'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { dbService } from '@/lib/db';
import { Ticket } from '@/types';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrintTicketSpkPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await dbService.getTicketById(ticketId);
        setTicket(data);
        if (data) {
          dbService.recordPrint(data.id, 'Petugas Kantor');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ticketId]);

  if (loading) return <div className="p-8 text-center text-sm">Memuat SPK...</div>;
  if (!ticket) return <div className="p-8 text-center text-sm">Tiket tidak ditemukan.</div>;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Control Actions (Hidden on Print) */}
      <div className="no-print mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Link
          href={`/tickets/${ticket.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Tiket</span>
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-pdam-600 hover:bg-pdam-700 text-white font-bold text-xs shadow transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Dokumen Sekarang (Print / PDF)</span>
        </button>
      </div>

      {/* Official SPK Document */}
      <div className="bg-white p-8 sm:p-10 border border-slate-300 rounded-lg shadow-sm print:border-0 print:shadow-none print:p-0 text-black font-serif">
        {/* Header Kop Surat */}
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h2 className="text-sm font-bold tracking-wider uppercase">
            PERUMDA AIR MINUM TIRTA JAYA MANDIRI
          </h2>
          <h1 className="text-xl font-black tracking-tight uppercase">
            CABANG CIKEMBAR
          </h1>
          <p className="text-xs font-sans mt-0.5 text-slate-700">
            Jl. Pelabuhan II Km. 18 Cikembar - Sukabumi | Layanan Pengaduan Lapangan
          </p>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-base font-bold underline tracking-wider uppercase">
            SURAT PERINTAH KERJA (SPK) LAPANGAN
          </h3>
          <p className="font-mono text-xs mt-1 font-bold">
            NO: {ticket.nomor_tiket}
          </p>
        </div>

        {/* SPK Details Table */}
        <table className="w-full text-xs font-sans mb-6 border-collapse">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-1.5 font-bold w-44">Tanggal & Waktu Lapor</td>
              <td className="py-1.5">: {new Date(ticket.created_at).toLocaleString('id-ID')}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1.5 font-bold">Petugas Pelapor</td>
              <td className="py-1.5">: {ticket.pelapor_nama || 'Petugas Pembaca Meter'}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1.5 font-bold">Nama Pelanggan / Pelapor</td>
              <td className="py-1.5 font-bold">: {ticket.nama_pelanggan}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1.5 font-bold">No. Sambungan (SL)</td>
              <td className="py-1.5">: {ticket.pelanggan_id || '-'}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1.5 font-bold">No. Kontak / Telepon</td>
              <td className="py-1.5">: {ticket.no_hp || '-'}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1.5 font-bold">Wilayah / Blok Distribusi</td>
              <td className="py-1.5">: {ticket.wilayah_nama}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1.5 font-bold">Jenis Gangguan</td>
              <td className="py-1.5 font-bold">: {ticket.kategori_nama} (Prioritas: {ticket.prioritas})</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1.5 font-bold">Ukuran Pipa</td>
              <td className="py-1.5">: {ticket.ukuran_pipa || '-'}</td>
            </tr>
            {ticket.lat && ticket.lng && (
              <tr className="border-b border-slate-200">
                <td className="py-1.5 font-bold">Koordinat GPS Geotagging</td>
                <td className="py-1.5 font-mono">: {ticket.lat.toFixed(6)}, {ticket.lng.toFixed(6)} (±{ticket.akurasi_gps}m)</td>
              </tr>
            )}
            <tr className="border-b border-slate-200">
              <td className="py-1.5 font-bold align-top">Deskripsi & Patokan</td>
              <td className="py-1.5 leading-relaxed">: {ticket.deskripsi}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1.5 font-bold">Teknisi Ditugaskan</td>
              <td className="py-1.5 font-bold text-pdam-900">: {ticket.assigned_to_nama || 'Tim Teknisi Lapangan'}</td>
            </tr>
          </tbody>
        </table>

        {/* Laporan Pekerjaan Blank Fill-in for Technician */}
        <div className="border border-black p-3 mb-8 font-sans text-xs">
          <div className="font-bold mb-2 uppercase">Catatan Realisasi Lapangan Teknisi:</div>
          <div className="space-y-4 text-slate-500">
            <div>Bahan / Material yang digunakan: ________________________________________________</div>
            <div>Waktu Mulai Pekerjaan: ___________________ Waktu Selesai: ____________________</div>
            <div>Keterangan Hasil Uji Coba Aliran Air: ___________________________________________</div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-4 text-center font-sans text-xs pt-4">
          <div>
            <p className="mb-14 text-slate-700">Pelanggan / Pelapor,</p>
            <p className="font-bold underline">({ticket.nama_pelanggan})</p>
          </div>
          <div>
            <p className="mb-14 text-slate-700">Petugas Teknisi,</p>
            <p className="font-bold underline">({ticket.assigned_to_nama || 'Tim Teknisi'})</p>
          </div>
          <div>
            <p className="mb-14 text-slate-700">Kaur Teknik & Distribusi,</p>
            <p className="font-bold underline">(........................................)</p>
          </div>
        </div>

        <div className="mt-8 text-[10px] text-slate-400 font-sans text-center">
          Dokumen cetak sistem PDAM FieldTicket Cikembar • Cetakan ke-{(ticket.print_count || 0) + 1}
        </div>
      </div>
    </div>
  );
}
