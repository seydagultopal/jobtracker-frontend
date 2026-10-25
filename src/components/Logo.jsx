export default function Logo({ className = "h-10 w-10" }) {
  return (
    <div className={`inline-flex shrink-0 items-center justify-center ${className}`} aria-label="Pebble" role="img">
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="48" height="48" rx="15" fill="#D9572B" />
        <path d="M14 34V14.5H25.5C31.2 14.5 34.5 17.4 34.5 22.1C34.5 26.8 31.2 29.7 25.5 29.7H20.5" stroke="#FFF8F1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="34" r="2.5" fill="#F2B99D"/>
      </svg>
    </div>
  );
}
