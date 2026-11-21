import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';

export const metadata: Metadata = {
  title: 'PDAM FieldTicket — Cabang Cikembar',
  description:
    'Sistem Informasi Manajemen Pelayanan Pengaduan & Tiket Lapangan PERUMDA Air Minum Tirta Jaya Mandiri Cabang Cikembar',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo-pdam.png',
    apple: '/logo-pdam.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F2F5FA] text-[#1B2437] antialiased">
        <AuthProvider>
          {/* Desktop Sidebar (>= 900px) */}
          <Sidebar />

          {/* Mobile Top Header & Desktop Bar */}
          <Navbar />

          {/* Main App Content */}
          <main className="min-[900px]:ml-[240px] pt-16 min-[900px]:pt-20 pb-24 min-[900px]:pb-8 px-3.5 sm:px-6 lg:px-8 max-w-[1280px]">
            {children}
          </main>

          {/* Mobile Bottom Navigation (< 900px) */}
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
