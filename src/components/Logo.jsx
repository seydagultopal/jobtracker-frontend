export default function Logo({ className = "w-8 h-8" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Alabaster (Krem) arka plan yuvarlağı */}
      <rect width="100" height="100" rx="28" fill="#EEEFE8" />
      
      {/* Columbia Blue - Çanta Gövdesi */}
      <rect x="22" y="42" width="56" height="38" rx="10" fill="#C5D7E8" />
      
      {/* Cherry Blossom Pink - Çanta Sapı */}
      <path 
        d="M38 42V30C38 25.5817 41.5817 22 46 22H54C58.4183 22 62 25.5817 62 30V42" 
        stroke="#E9ACBB" 
        strokeWidth="6" 
        strokeLinecap="round" 
      />
      
      {/* Cambridge Blue - Onay İşareti */}
      <path 
        d="M42 61L48 66L58 52" 
        stroke="#8FBC93" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}