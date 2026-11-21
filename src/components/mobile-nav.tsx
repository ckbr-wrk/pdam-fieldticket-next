'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  Plus,
  MapPin,
  BarChart3,
} from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Beranda', icon: LayoutDashboard },
    { href: '/tickets', label: 'Tiket', icon: TicketIcon },
    { href: '/tickets/new', label: 'Lapor', icon: Plus, isAction: true },
    { href: '/map', label: 'Peta', icon: MapPin },
    { href: '/reports', label: 'Laporan', icon: BarChart3 },
  ];

  return (
    <nav className="min-[900px]:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200/90 z-40 px-2 flex items-center justify-around shadow-[0_-4px_16px_rgba(16,40,90,.08)] no-print">
      {links.map((link) => {
        const active = pathname === link.href;
        const Icon = link.icon;

        if (link.isAction) {
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center -mt-6 group"
            >
              <div
                className="w-13 h-13 w-[52px] h-[52px] rounded-full text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 border-[3px] border-white"
                style={{
                  background: 'linear-gradient(135deg, #0A4CC0, #2A86F5)',
                  boxShadow: '0 6px 18px rgba(10, 76, 192, 0.4)',
                }}
              >
                <Icon className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold text-[#0B57D0] mt-0.5">
                {link.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10.5px] transition-colors ${
              active
                ? 'text-[#0B57D0] font-bold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${active ? 'stroke-[2.5]' : ''}`} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
