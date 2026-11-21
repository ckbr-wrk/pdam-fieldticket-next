'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/db';
import { Ticket } from '@/types';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';
import { MapPin, Navigation, Info, ExternalLink, Layers, ChevronRight } from 'lucide-react';

export default function MapPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await dbService.getTickets();
        setTickets(data);
        if (data.length > 0) {
          setSelectedTicket(data[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Initialize Leaflet Map dynamically
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      const L = (window as any).L;
      if (!L || mapInstanceRef.current) return;

      // Cikembar center coordinates: -6.9854, 106.7821
      const map = L.map(mapContainerRef.current).setView([-6.9854, 106.7821], 13);
      mapInstanceRef.current = map;

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | PDAM Cikembar',
        maxZoom: 19,
      }).addTo(map);

      // Add markers for tickets with coordinates
      tickets.forEach((t) => {
        if (!t.lat || !t.lng) return;

        const isCritical = t.prioritas === 'KRITIS';
        const color = isCritical ? '#dc2626' : t.prioritas === 'TINGGI' ? '#ea580c' : '#0c8fe9';

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([t.lat, t.lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
            <strong style="color: #025aa1;">${t.nomor_tiket}</strong><br/>
            <strong>${t.nama_pelanggan}</strong><br/>
            <span>${t.kategori_nama || 'Gangguan'}</span><br/>
            <span style="font-size: 10px; color: #64748b;">${t.wilayah_nama || ''}</span>
          </div>
        `);

        marker.on('click', () => {
          setSelectedTicket(t);
        });
      });
    };

    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tickets]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-pdam-600" />
            <span>Peta Sebaran Titik Gangguan Cikembar</span>
          </h1>
          <p className="text-xs text-slate-500">
            Visualisasi pemetaan spasial laporan kebocoran pipa dan aduan aliran air
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tickets/new"
            className="px-3.5 py-2 rounded-xl bg-pdam-600 hover:bg-pdam-700 text-white font-semibold text-xs shadow-sm"
          >
            + Lapor Titik Baru
          </Link>
        </div>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Canvas (3 Columns) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[520px] relative">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Map Legend */}
          <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1.5">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
              Prioritas Titik:
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-white" />
              <span>KRITIS (2 Jam)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-white" />
              <span>TINGGI (6 Jam)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
              <span>SEDANG / RENDAH</span>
            </div>
          </div>
        </div>

        {/* Selected Ticket Preview Sidebar (1 Column) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Detail Titik Terpilih</h3>
              <Info className="w-4 h-4 text-slate-400" />
            </div>

            {selectedTicket ? (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-mono text-xs font-bold text-pdam-700">
                    {selectedTicket.nomor_tiket}
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedTicket.nama_pelanggan}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {selectedTicket.wilayah_nama}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <StatusBadge status={selectedTicket.status} size="sm" />
                  <PriorityBadge prioritas={selectedTicket.prioritas} />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-700">
                  <div className="font-semibold text-slate-900">
                    {selectedTicket.kategori_nama}
                  </div>
                  <p className="line-clamp-3 text-[11px]">{selectedTicket.deskripsi}</p>
                </div>

                {selectedTicket.lat && selectedTicket.lng && (
                  <div className="text-[11px] text-slate-500 font-mono">
                    Lat: {selectedTicket.lat.toFixed(5)}, Lng: {selectedTicket.lng.toFixed(5)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic text-center py-8">
                Pilih atau klik salah satu titik penanda di peta untuk melihat ringkasan.
              </div>
            )}
          </div>

          {selectedTicket && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                href={`/tickets/${selectedTicket.id}`}
                className="w-full py-2 px-3 rounded-xl bg-pdam-600 hover:bg-pdam-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Buka Tiket Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              {selectedTicket.lat && selectedTicket.lng && (
                <a
                  href={`https://www.google.com/maps?q=${selectedTicket.lat},${selectedTicket.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Petunjuk Arah (Google Maps)</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
