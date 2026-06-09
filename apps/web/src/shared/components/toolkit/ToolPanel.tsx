import React from 'react';

interface ToolPanelProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function ToolPanel({
  title,
  subtitle,
  kicker,
  actions,
  children,
  className = '',
  bodyClassName = 'p-5',
}: ToolPanelProps) {
  return (
    <section className={`tb-glass-strong rounded-3xl overflow-hidden ${className}`}>
      <div className="flex flex-col gap-3 border-b border-[var(--tb-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {kicker && <div className="tb-section-kicker mb-1">{kicker}</div>}
          <h2 className="text-base font-semibold text-[var(--tb-text)]">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-[var(--tb-text-muted)]">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
