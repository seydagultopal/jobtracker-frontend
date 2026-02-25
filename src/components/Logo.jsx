
// Logonun yüksekliğini h-14 yaparak yazıyla birlikte net okunmasını sağladık
export default function Logo({ className = "w-auto h-14" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/pebble-logo.png" 
        alt="Pebble Logo" 
        className="w-full h-full object-contain drop-shadow-sm"
      />
    </div>
  );
}