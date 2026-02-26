import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function Dashboard() {
  const { t } = useLanguage();
  const { events } = useEvents(); 
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, interview: 0, assessment: 0, video: 0, offer: 0 });

  useEffect(() => {
    api.get('/applications').then(res => {
      const apps = res.data;
      setStats({
        total: apps.length,
        interview: apps.filter(a => a.status === 'INTERVIEW').length,
        assessment: apps.filter(a => a.status === 'ASSESSMENT').length,
        video: apps.filter(a => a.status === 'VIDEO_INTERVIEW').length,
        offer: apps.filter(a => a.status === 'OFFER').length,
      });
    }).catch(err => console.error(err));
  }, []);

  // BUGÜNÜN ETKİNLİKLERİNİ BUL
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysEvents = events
    .filter(e => e.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  // MİNİ TAKVİM İÇİN GEREKLİ HESAPLAMALAR
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Pazartesiyi başa alıyoruz
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const hasEvent = (day) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
    return events.some(e => e.date === dateStr);
  };

  const StatBox = ({ label, value }) => (
    <div className="bg-white/80 dark:bg-twilight p-5 rounded-3xl flex justify-between items-center shadow-sm border border-white dark:border-starlight/30 transition-all hover:scale-[1.02]">
      <span className="font-bold text-gray-600 dark:text-gray-300">{label}</span>
      <span className="text-xl font-black text-gray-800 dark:text-white">{value}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px] animate-fade-in">
      
      {/* Sol Kolon (İstatistikler) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <StatBox label={t('statTotal')} value={stats.total} />
        <StatBox label={t('statInterview')} value={stats.interview} />
        <StatBox label={t('statAssessment')} value={stats.assessment} />
        <StatBox label={t('statVideo')} value={stats.video} />
        <StatBox label={t('statOffer')} value={stats.offer} />
        
        <div className="mt-auto bg-cherry p-8 rounded-[2.5rem] flex items-center justify-center text-6xl font-black text-white shadow-xl shadow-cherry/20">
          5 <span className="ml-3 drop-shadow-md">🔥</span>
        </div>
      </div>

      {/* Sağ Kolon (Mini Takvim & Hatırlatıcı) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* MİNİ TAKVİM (Tıklanabilir) */}
        <div 
          onClick={() => navigate('/takvim')}
          className="bg-columbia/20 dark:bg-columbia/5 border-2 border-white/50 dark:border-starlight/30 p-8 rounded-[3rem] flex-1 flex flex-col shadow-inner cursor-pointer hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group relative"
        >
          {/* Takvime Git İpucu */}
          <div className="absolute top-6 right-8 text-[10px] font-black text-columbia dark:text-columbia/70 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Takvime Git <span>➔</span>
          </div>

          <span className="text-2xl font-black tracking-widest uppercase text-columbia dark:text-columbia/80 mb-6">
            {monthNames[currentMonth]} {currentYear}
          </span>
          
          <div className="grid grid-cols-7 gap-2 flex-1">
            {/* Gün İsimleri */}
            {dayNames.map(d => (
              <div key={d} className="text-center text-[10px] font-black text-columbia/50 dark:text-columbia/40 uppercase tracking-widest mb-2">{d}</div>
            ))}
            
            {/* Boş Günler */}
            {Array.from({ length: startDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {/* Ayın Günleri */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate();
              const evt = hasEvent(day);
              
              return (
                <div 
                  key={day} 
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-sm font-bold transition-all ${
                    isToday 
                      ? 'bg-white dark:bg-twilight text-columbia shadow-sm border border-columbia/20 dark:border-columbia/10' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {day}
                  {evt && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cherry"></span>}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* HATIRLATICI KUTUSU (Dinamik) */}
        <div className="bg-[#D4B996]/80 dark:bg-[#8A6F4E] border-2 border-white/30 dark:border-starlight/20 p-8 rounded-[2.5rem] flex flex-col justify-center min-h-[160px] shadow-lg relative overflow-hidden">
          {/* Arka plan deseni */}
          <div className="absolute right-[-20px] bottom-[-40px] text-9xl opacity-10">🔔</div>
          
          <h3 className="text-lg font-black text-white/90 uppercase tracking-[0.2em] mb-4 relative z-10">
            {t('reminderTitle')} (Bugün)
          </h3>
          
          <div className="space-y-3 relative z-10">
            {todaysEvents.length > 0 ? (
              todaysEvents.map(evt => (
                <div key={evt.id} className="flex items-center gap-3 bg-white/20 dark:bg-black/20 p-3 rounded-xl backdrop-blur-sm">
                  <span className="bg-white dark:bg-twilight text-[#D4B996] dark:text-[#8A6F4E] px-2 py-1 rounded-lg text-xs font-black shrink-0">
                    {evt.time}
                  </span>
                  <span className="text-white font-bold truncate">{evt.title}</span>
                </div>
              ))
            ) : (
              <p className="text-white/80 font-bold italic">
                Bugün planlanan bir etkinlik yok. Sakin bir gün! ☕
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}