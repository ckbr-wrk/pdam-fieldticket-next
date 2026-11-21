import React from 'react';
import { TicketStatus } from '@/types';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config: Record<TicketStatus, { label: string; style: React.CSSProperties }> = {
    BARU: {
      label: 'Baru',
      style: { background: '#FDE8E8', color: '#C62828' },
    },
    DITUGASKAN: {
      label: 'Ditugaskan',
      style: { background: '#E8F0FE', color: '#0B57D0' },
    },
    DALAM_PROSES: {
      label: 'Dalam Proses',
      style: { background: '#FEF3C7', color: '#B45309' },
    },
    MENUNGGU: {
      label: 'Menunggu',
      style: { background: '#FFFBEB', color: '#D97706' },
    },
    SELESAI: {
      label: 'Selesai',
      style: { background: '#E6F4EA', color: '#137333' },
    },
    SELESAI_DIKERJAKAN: {
      label: 'Selesai',
      style: { background: '#E6F4EA', color: '#137333' },
    },
    DITUTUP: {
      label: 'Ditutup',
      style: { background: '#ECEFF1', color: '#455A64' },
    },
    DIBATALKAN: {
      label: 'Dibatalkan',
      style: { background: '#FEE2E2', color: '#991B1B' },
    },
  };

  const curr = config[status] || {
    label: status,
    style: { background: '#ECEFF1', color: '#455A64' },
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-0.5 font-bold',
    lg: 'text-xs px-3 py-1 font-bold',
  };

  return (
    <span
      style={curr.style}
      className={`inline-flex items-center rounded-md uppercase tracking-wider font-extrabold ${sizeClasses[size]}`}
    >
      {curr.label}
    </span>
  );
}
