'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ToolPageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backText?: string;
  actions?: React.ReactNode;
}

export default function ToolPageHeader({
  title,
  subtitle,
  backHref = '/',
  backText = '返回首页',
  actions,
}: ToolPageHeaderProps) {
  return (
    <div className="tb-glass border-b border-[var(--tb-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0">
            <Link
              href={backHref}
              className="flex items-center text-sm tb-pill tb-border shrink-0"
            >
              <ArrowLeft className="h-5 w-5 mr-1.5" />
              <span className="hidden sm:inline">{backText}</span>
            </Link>
            <div className="h-6 w-px bg-[var(--tb-border)]" />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-[var(--tb-text)] truncate">{title}</h1>
              {subtitle && (
                <p className="text-sm text-[var(--tb-text-muted)] mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center space-x-2 shrink-0 ml-4">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
