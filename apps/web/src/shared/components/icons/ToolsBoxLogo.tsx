import React from 'react';
import ToolsBoxMark from './ToolsBoxMark';

interface ToolsBoxLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
  markSize?: number;
}

/**
 * Full brand lockup: mark + wordmark.
 * Use for header, footer, README hero, social cards.
 */
export default function ToolsBoxLogo({
  className,
  showText = true,
  textClassName,
  markSize = 40,
}: ToolsBoxLogoProps) {
  const gradientId = React.useId();

  return (
    <div className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <ToolsBoxMark size={markSize} />
      {showText && (
        <div className="flex flex-col leading-none">
          <svg
            viewBox="0 0 240 48"
            height={markSize * 0.9}
            xmlns="http://www.w3.org/2000/svg"
            className={textClassName}
            aria-label="ToolsBox"
            role="img"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
            <text
              x="0"
              y="34"
              fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
              fontSize="34"
              fontWeight="700"
              letterSpacing="-0.5"
              fill={`url(#${gradientId})`}
            >
              ToolsBox
            </text>
            {/* Tiny mono kicker above */}
            <text
              x="2"
              y="14"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="9"
              fontWeight="500"
              letterSpacing="2"
              fill="#22d3ee"
              fillOpacity="0.7"
            >
              COMMAND CENTER
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}
