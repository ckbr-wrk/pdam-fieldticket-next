import React from 'react';
import { Priority, SLA_HOURS } from '@/types';
import { AlertCircle, Clock, Zap, Info } from 'lucide-react';

interface PriorityBadgeProps {
  prioritas: Priority;
  showSla?: boolean;
}

export function PriorityBadge({ prioritas, showSla = true }: PriorityBadgeProps) {
  const config: Record<Priority, { label: string; bg: string; text: string; icon: any }> = {
    KRITIS: {
      label: 'Kritis',
      bg: 'bg-red-50 text-red-700 border-red-200',
      text: 'text-red-700',
      icon: Zap,
    },
    TINGGI: {
      label: 'Tinggi',
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      text: 'text-orange-700',
      icon: AlertCircle,
    },
    SEDANG: {
      label: 'Sedang',
      bg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      text: 'text-yellow-800',
      icon: Clock,
    },
    RENDAH: {
      label: 'Rendah',
      bg: 'bg-green-50 text-green-700 border-green-200',
      text: 'text-green-700',
      icon: Info,
    },
  };

  const curr = config[prioritas] || config.SEDANG;
  const Icon = curr.icon;
  const slaHour = SLA_HOURS[prioritas];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${curr.bg}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{curr.label}</span>
      {showSla && <span className="opacity-75 font-normal ml-0.5">({slaHour}j)</span>}
    </span>
  );
}
