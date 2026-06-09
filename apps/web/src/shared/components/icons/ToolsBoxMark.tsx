import React from 'react';

interface ToolsBoxMarkProps {
  className?: string;
  size?: number | string;
  variant?: 'full' | 'mono';
  title?: string;
}

/**
 * ToolsBox brand mark — Obsidian Command Center.
 *
 * Glass command module with `</>` brackets, status dots, and a live accent.
 * Variants:
 *   - full: cyan→emerald gradient (default, brand color)
 *   - mono: single `currentColor`, theme-aware via parent text color
 */
export default function ToolsBoxMark({
  className,
  size = 48,
  variant = 'full',
  title = 'ToolsBox',
}: ToolsBoxMarkProps) {
  const gradientId = React.useId();
  const fillId = React.useId();
  const dotGlowId = React.useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        {variant === 'full' && (
          <>
            <linearGradient id={gradientId} x1="8" y1="8" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id={fillId} x1="20" y1="20" x2="108" y2="108" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.04" />
            </linearGradient>
            <radialGradient id={dotGlowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
          </>
        )}
      </defs>

      {/* Outer rounded frame */}
      <rect
        x="6" y="6" width="116" height="116" rx="26"
        fill={variant === 'mono' ? 'transparent' : '#0a0f17'}
        stroke={variant === 'mono' ? 'currentColor' : `url(#${gradientId})`}
        strokeWidth="2.5"
      />

      {/* Inner panel */}
      <rect
        x="14" y="14" width="100" height="100" rx="20"
        fill={variant === 'mono' ? 'transparent' : `url(#${fillId})`}
        stroke={variant === 'mono' ? 'currentColor' : 'rgba(34, 211, 238, 0.22)'}
        strokeOpacity={variant === 'mono' ? 0.35 : 1}
        strokeWidth="0.6"
      />

      {/* Top status dots */}
      {variant === 'full' ? (
        <>
          <circle cx="24" cy="24" r="1.6" fill="rgba(34, 211, 238, 0.7)" />
          <circle cx="32" cy="24" r="1.6" fill="rgba(34, 211, 238, 0.7)" />
          <circle cx="40" cy="24" r="1.6" fill="rgba(34, 211, 238, 0.7)" />
        </>
      ) : (
        <>
          <circle cx="24" cy="24" r="1.6" fill="currentColor" fillOpacity="0.5" />
          <circle cx="32" cy="24" r="1.6" fill="currentColor" fillOpacity="0.5" />
          <circle cx="40" cy="24" r="1.6" fill="currentColor" fillOpacity="0.5" />
        </>
      )}

      {/* Faint module guides */}
      <line x1="64" y1="40" x2="64" y2="92"
            stroke={variant === 'mono' ? 'currentColor' : 'rgba(34, 211, 238, 0.10)'}
            strokeOpacity={variant === 'mono' ? 0.25 : 1}
            strokeWidth="0.8" strokeLinecap="round" />
      <line x1="40" y1="64" x2="88" y2="64"
            stroke={variant === 'mono' ? 'currentColor' : 'rgba(34, 211, 238, 0.10)'}
            strokeOpacity={variant === 'mono' ? 0.25 : 1}
            strokeWidth="0.8" strokeLinecap="round" />

      {/* Left bracket < */}
      <path d="M 52 46 L 36 64 L 52 82"
            stroke={variant === 'mono' ? 'currentColor' : `url(#${gradientId})`}
            strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Right bracket > */}
      <path d="M 76 46 L 92 64 L 76 82"
            stroke={variant === 'mono' ? 'currentColor' : `url(#${gradientId})`}
            strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Slash / */}
      <path d="M 72 40 L 56 88"
            stroke={variant === 'mono' ? 'currentColor' : `url(#${gradientId})`}
            strokeWidth="5" strokeLinecap="round" />

      {/* Live status dot (only in full variant) */}
      {variant === 'full' && (
        <>
          <circle cx="98" cy="98" r="8" fill={`url(#${dotGlowId})`} />
          <circle cx="98" cy="98" r="3" fill="#34d399" />
        </>
      )}
    </svg>
  );
}
