export default function Logo({ className = "h-10 w-10" }) {
  return (
    <span className={`pebble-logo-mark ${className}`} role="img" aria-label="Pebble">
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="12" fill="currentColor" />
        <path d="M9 23.1c0-5.5 4.2-9.9 10.1-9.9 4.1 0 7.3 2.2 8.7 5.6 3.3.5 5.2 2.8 5.2 5.8 0 3.5-2.8 6.1-6.5 6.1H18c-5.3 0-9-2.9-9-7.6Z" fill="#fff" opacity=".96"/>
        <path d="M9.2 21.8c1.8 1.5 4.1 2.3 6.8 2.3 4.1 0 7.1-1.7 9.1-4.9" stroke="#CBD5E1" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="29.2" cy="11.3" r="2.1" fill="#A5B4FC"/>
      </svg>
    </span>
  );
}
