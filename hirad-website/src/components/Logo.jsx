import darkLogo from '../assets/hirad-log.svg';
import lightLogo from '../assets/hirad-log-light.svg';

// Legacy icon retained for standalone visual treatments.
export function HiradIcon({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="hirad-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="hirad-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="hirad-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      {/* Left vertical bar */}
      <rect x="8" y="8" width="18" height="64" rx="4" fill="url(#hirad-grad-1)" />
      {/* Right vertical bar */}
      <rect x="54" y="8" width="18" height="64" rx="4" fill="url(#hirad-grad-2)" />
      {/* Cross-bar top-left to bottom-right diagonal */}
      <path
        d="M26 22 L54 42 L54 58 L26 38 Z"
        fill="url(#hirad-grad-3)"
        opacity="0.9"
      />
      {/* Cross-bar top-right to bottom-left diagonal */}
      <path
        d="M54 22 L26 42 L26 58 L54 38 Z"
        fill="url(#hirad-grad-1)"
        opacity="0.75"
      />
    </svg>
  );
}

export function HiradLogo({ dark = false, size = 'md', className = '', style = {} }) {
  return (
    <img
      src={dark ? darkLogo : lightLogo}
      alt="HIRAD Digital Solutions"
      className={`hirad-logo hirad-logo-${size} ${className}`}
      style={{
        display: 'block',
        width: 'auto',
        objectFit: 'contain',
        ...style,
      }}
    />
  );
}
