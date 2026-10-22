import { useId } from 'react';

/** The ECHO mark: one stem splitting into three futures. */
export default function LogoMark({ size = 28 }) {
  const gradientId = useId();

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="none" stroke="rgba(167,139,250,0.28)" />
      <path
        d="M16 27v-9m0 0c0-4-6-5-6-10m6 10c0-4 6-5 6-10m-6 10V7"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="7.5" r="2" fill="#a78bfa" />
      <circle cx="22" cy="7.5" r="2" fill="#67e8f9" />
      <circle cx="16" cy="6" r="2" fill="#ece9f7" />
    </svg>
  );
}
