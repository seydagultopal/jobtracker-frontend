export default function Logo({ className = "h-10 w-10" }) {
  return (
    <span className={`pebble-logo-mark ${className}`} role="img" aria-label="Pebble">
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="11" fill="#292826"/>
        <path d="M13 29V11h9.2c4.7 0 7.4 2.4 7.4 6.1s-2.7 6.1-7.4 6.1H18" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="13" cy="29" r="2" fill="#F0A36D"/>
      </svg>
    </span>
  );
}
