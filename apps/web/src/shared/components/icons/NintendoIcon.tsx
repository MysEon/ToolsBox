import React from 'react';

interface Props {
  className?: string;
}

export default function NintendoIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      <rect x="4" y="8" width="40" height="32" rx="16" fill="#E60012" />
      <rect x="4" y="8" width="40" height="16" rx="16" fill="white" fillOpacity="0.1" />
      <rect x="10" y="17" width="12" height="3" rx="1" fill="white" />
      <rect x="15" y="13" width="3" height="11" rx="1" fill="white" />
      <circle cx="33" cy="20" r="4" fill="white" fillOpacity="0.9" />
      <circle cx="33" cy="29" r="4" fill="white" fillOpacity="0.9" />
      <circle cx="39" cy="24.5" r="4" fill="white" fillOpacity="0.9" />
      <rect x="20" y="30" width="5" height="2.5" rx="1.25" fill="white" fillOpacity="0.5" />
      <rect x="27" y="30" width="5" height="2.5" rx="1.25" fill="white" fillOpacity="0.5" />
    </svg>
  );
}
