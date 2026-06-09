import React from 'react';

interface StatPillProps {
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
}

const toneClasses: Record<NonNullable<StatPillProps['tone']>, string> = {
  default: 'text-[var(--tb-text-muted)]',
  accent: 'text-[var(--tb-accent)]',
  success: 'text-[var(--tb-accent-2)]',
  warning: 'text-amber-400',
  danger: 'text-red-400',
};

export default function StatPill({ label, value, tone = 'default', className = '' }: StatPillProps) {
  return (
    <span className={`tb-pill inline-flex items-center gap-1 border border-[var(--tb-border)] px-3 py-1 text-xs ${className}`}>
      <span className="text-[var(--tb-text-muted)]">{label}</span>
      <span className={`font-semibold ${toneClasses[tone]}`}>{value}</span>
    </span>
  );
}
