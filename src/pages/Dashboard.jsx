import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { events } = useEvents(); 
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ total: 0, interview: 0, assessment: 0, video: 0, offer: 0 });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // 1. İstatistikleri Çekme
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

    // 2. GERÇEK GÜNLÜK SERİ (STREAK) ALGORİTMASI
    const calculateStreak = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      let currentStreak = parseInt(localStorage.getItem('pebble_streak_count')) || 0;
      const lastLogin = localStorage.getItem('pebble_last_login_date');

      if (lastLogin) {
        const lastDate = new Date(parseInt(lastLogin));
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak += 1;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      localStorage.setItem('pebble_streak_count', currentStreak);
      localStorage.setItem('pebble_last_login_date', today.getTime().toString());
      setStreak(currentStreak);
    };

    calculateStreak();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysEvents = events
    .filter(e => e.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const hasEvent = (day) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
    return events.some(e => e.date === dateStr);
  };

  // KUTULAR DARALTILDI: p-5'ten px-5 py-3.5'e çekildi, yazılar küçültüldü.
  const StatBox = ({ label, value }) => (
    <div className="bg-white/80 dark:bg-twilight px-5 py-3.5 rounded-[1.5rem] flex justify-between items-center shadow-sm border border-white dark:border-starlight/30 transition-all hover:scale-[1.02]">
      <span className="font-bold text-gray-600 dark:text-gray-300 text-sm">{label}</span>
      <span className="text-lg font-black text-gray-800 dark:text-white">{value}</span>
    </div>
  );

  return (
    // Ana kapsayıcının yüksekliği tam ekrana sabitlendi (h-full)
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full animate-fade-in pb-2">
      
      {/* SOL KOLON: İstatistikler ve STREAK KUTUSU (Boşluklar azaltıldı) */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <StatBox label={t('statTotal')} value={stats.total} />
        <StatBox label={t('statInterview')} value={stats.interview} />
        <StatBox label={t('statAssessment')} value={stats.assessment} />
        <StatBox label={t('statVideo')} value={stats.video} />
        <StatBox label={t('statOffer')} value={stats.offer} />
        
        {/* STREAK KUTUSU DARALTILDI (p-8'den p-6'ya, yazılar text-5xl'e çekildi) */}
        <div className="mt-auto relative bg-gradient-to-br from-cherry to-[#FF9A9E] p-6 rounded-[2rem] flex flex-col items-center justify-center text-white shadow-[0_15px_40px_-10px_rgba(233,172,187,0.6)] overflow-hidden group hover:scale-[1.02] transition-all duration-300 shrink-0">
          
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-peach/40 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>

          <span className="relative z-10 text-[10px] font-black tracking-[0.2em] uppercase opacity-90 mb-1">
            {language === 'tr' ? 'Günlük Seri' : 'Daily Streak'}
          </span>
          
          <div className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-5xl font-black drop-shadow-md">{streak}</span>
            <span className="text-4xl drop-shadow-lg animate-[bounce_2s_infinite]">🔥</span>
          </div>

          <span className="relative z-10 text-[9px] font-bold opacity-80 mt-2 text-center px-2">
            {language === 'tr' ? 'Seriyi bozmamak için yarın da gel!' : 'Come back tomorrow to keep it going!'}
          </span>
        </div>
      </div>

      {/* SAĞ KOLON: Mini Takvim & Hatırlatıcı */}
      <div className="lg:col-span-7 flex flex-col gap-5 h-full">
        
        {/* MİNİ TAKVİM DARALTILDI (p-6, mb-3 yapıldı) */}
        <div 
          onClick={() => navigate('/takvim')}
          className="bg-columbia/20 dark:bg-columbia/5 border-2 border-white/50 dark:border-starlight/30 p-5 md:p-6 rounded-[2rem] flex-1 flex flex-col shadow-inner cursor-pointer hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group relative"
        >
          <div className="absolute top-5 right-6 text-[9px] font-black text-columbia dark:text-columbia/70 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {language === 'tr' ? 'Takvime Git' : 'Go to Calendar'} <span>➔</span>
          </div>

          <span className="text-xl font-black tracking-widest uppercase text-columbia dark:text-columbia/80 mb-3">
            {monthNames[currentMonth]} {currentYear}
          </span>
          
          <div className="grid grid-cols-7 gap-1 md:gap-1.5 flex-1 content-center">
            {dayNames.map(d => (
              <div key={d} className="text-center text-[9px] font-black text-columbia/50 dark:text-columbia/40 uppercase tracking-widest mb-1">{d}</div>
            ))}
            
            {Array.from({ length: startDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate();
              const evt = hasEvent(day);
              
              return (
                <div 
                  key={day} 
                  className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isToday 
                      ? 'bg-white dark:bg-twilight text-columbia shadow-sm border border-columbia/20 dark:border-columbia/10' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {day}
                  {evt && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-cherry"></span>}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* HATIRLATICI KUTUSU DARALTILDI (min-h-[120px] yapıldı) */}
        <div className="bg-[#D4B996]/80 dark:bg-[#8A6F4E] border-2 border-white/30 dark:border-starlight/20 p-5 md:p-6 rounded-[2rem] flex flex-col justify-center min-h-[120px] shrink-0 shadow-lg relative overflow-hidden transition-colors duration-500">
          <div className="absolute right-[-10px] bottom-[-30px] text-8xl opacity-10">🔔</div>
          
          <h3 className="text-base font-black text-white/90 uppercase tracking-[0.2em] mb-3 relative z-10">
            {t('reminderTitle')}
          </h3>
          
          <div className="space-y-2 relative z-10 max-h-[80px] overflow-y-auto custom-scrollbar pr-2">
            {todaysEvents.length > 0 ? (
              todaysEvents.map(evt => (
                <div key={evt.id} className="flex items-center gap-2.5 bg-white/20 dark:bg-black/20 p-2.5 rounded-xl backdrop-blur-sm">
                  <span className="bg-white dark:bg-twilight text-[#D4B996] dark:text-[#8A6F4E] px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0">
                    {evt.time}
                  </span>
                  <span className="text-white text-sm font-bold truncate">{evt.title}</span>
                </div>
              ))
            ) : (
              <p className="text-white/80 text-sm font-bold italic">
                {language === 'tr' ? 'Bugün planlanan bir etkinlik yok. Sakin bir gün! ☕' : 'No events planned for today. A quiet day! ☕'}
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}