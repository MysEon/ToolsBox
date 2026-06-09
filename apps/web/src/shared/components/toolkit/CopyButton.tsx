'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '@/shared/utils/fileExport';

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  disabled?: boolean;
}

export default function CopyButton({
  value,
  label = '复制',
  copiedLabel = '已复制',
  className = '',
  disabled = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (disabled || !value) return;
    await copyToClipboard(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled || !value}
      className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--tb-border)] px-3 py-1.5 text-xs font-medium text-[var(--tb-text)] transition hover:border-[var(--tb-accent)] hover:text-[var(--tb-accent)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? copiedLabel : label}
    </button>
  );
}
