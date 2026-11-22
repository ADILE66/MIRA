import React from 'react';

interface MiraLogoProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
}

export default function MiraLogo({
  size = 32,
  className = '',
  withGlow = false,
}: MiraLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {withGlow && (
        <span
          className="absolute inset-0 rounded-lg bg-blue-600/30 blur-md pointer-events-none"
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
      >
        <defs>
          <linearGradient id="miraLogoNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#021C42" />
            <stop offset="100%" stopColor="#07306D" />
          </linearGradient>
        </defs>

        {/* Squircle Badge */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="22"
          fill="url(#miraLogoNavyGrad)"
          stroke="#1E40AF"
          strokeWidth="1.5"
        />

        {/* Flight Takeoff Symbol */}
        <g transform="translate(13, 11) scale(3.1)">
          {/* Runway line */}
          <rect x="2.5" y="19" width="19" height="2.2" rx="1.1" fill="#FFFFFF" />

          {/* Taking off plane */}
          <path
            d="M22.07 9.64c-.39-.8-1.35-1.12-2.15-.73L13.2 12.18 5.5 5.99l-1.95.95 5.22 7.34-5.14 2.52-1.92-.42-1.42.69 3.02 2.83 3.29 1.6 15.11-7.35c.9-.44 1.22-1.4.83-2.2l-.38-1.36z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
}
