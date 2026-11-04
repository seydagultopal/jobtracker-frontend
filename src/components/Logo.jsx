export default function Logo({ className = "h-10 w-10" }) {
  return (
    <span className={`pebble-logo-mark ${className}`} role="img" aria-label="Pebble">
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="13" className="pebble-logo-tile" />
        <path
          d="M10.2 22.2c-.8-4.9 2.1-10 6.8-11.3 4.1-1.2 8.1.8 9.6 4.4 3.1-.2 5.6 2 5.6 5.1 0 3.2-2.5 5.7-5.8 5.7H16.8c-3.6 0-6-1.4-6.6-3.9Z"
          className="pebble-logo-stone"
        />
        <path d="M14.2 20.5c2.1 1.3 5.2 1.6 8.1.6 1.5-.5 2.7-1.4 3.7-2.6" className="pebble-logo-detail" />
        <circle cx="29.8" cy="10.5" r="2.1" className="pebble-logo-spark" />
      </svg>
    </span>
  );
}
