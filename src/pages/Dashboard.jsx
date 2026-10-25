import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3,
  Flame, Sparkles, Video, ClipboardCheck, PartyPopper, Bell, Leaf
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { events } = useEvents();
  const navigate = useNavigate();
  const isTr = language === 'tr';

  const [stats, setStats] = useState({ total: 0, interview: 0, assessment: 0, video: 0, offer: 0 });
  const [streak, setStreak] = useState(0);

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentStreak = parseInt(localStorage.getItem('pebble_streak_count')) || 0;
    const lastLogin = localStorage.getItem('pebble_last_login_date');

    if (lastLogin) {
      const lastDate = new Date(parseInt(lastLogin));
      const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) currentStreak += 1;
      else if (diffDays > 1) currentStreak = 1;
    } else {
      currentStreak = 1;
    }

    localStorage.setItem('pebble_streak_count', currentStreak);
    localStorage.setItem('pebble_last_login_date', today.getTime().toString());
    setStreak(currentStreak);
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

  const monthNames = isTr
    ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = isTr
    ? ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const hasEvent = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(e => e.date === dateStr);
  };

  const statCards = [
    { label: t('statTotal'), value: stats.total, icon: BriefcaseBusiness, tone: 'sage', note: isTr ? 'Toplam başvuru' : 'Applications tracked' },
    { label: t('statInterview'), value: stats.interview, icon: Clock3, tone: 'peach', note: isTr ? 'Görüşme aşaması' : 'In interview stage' },
    { label: t('statAssessment'), value: stats.assessment, icon: ClipboardCheck, tone: 'lilac', note: isTr ? 'Değerlendirme' : 'Assessments' },
    { label: t('statVideo'), value: stats.video, icon: Video, tone: 'rose', note: isTr ? 'Video görüşmesi' : 'Video interviews' },
    { label: t('statOffer'), value: stats.offer, icon: PartyPopper, tone: 'gold', note: isTr ? 'Teklifler' : 'Offers received' },
  ];

  return (
    <div className="pebble-dashboard space-y-6 md:space-y-8 pb-6">
      <section className="dash-welcome relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-9 lg:p-10">
        <div className="dash-welcome-orb dash-orb-one" />
        <div className="dash-welcome-orb dash-orb-two" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="dash-eyebrow"><Sparkles size={15} /> {isTr ? 'KÜÇÜK ADIMLAR, BÜYÜK HEDEFLER' : 'SMALL STEPS, BIG GOALS'}</div>
            <h1 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight">
              {isTr ? <>Merhaba, <span>hayallerinin</span><br className="hidden md:block" /> peşinden git. ✨</> : <>Hello, keep chasing<br className="hidden md:block" /> <span>what’s next.</span> ✨</>}
            </h1>
            <p className="mt-3 max-w-lg text-sm md:text-base leading-7 dash-welcome-copy">
              {isTr ? 'Kariyer yolculuğunu adım adım takip et. Bugün kendin için küçük bir şey yapman yeterli.' : 'Keep your career journey moving, one small step at a time. Something small today is still progress.'}
            </p>
          </div>
          <button onClick={() => navigate('/tracker')} className="dash-primary-action shrink-0">
            <BriefcaseBusiness size={17} /> {isTr ? 'Başvurularımı gör' : 'View applications'} <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="dash-welcome-decoration" aria-hidden="true">
          <div className="dash-sun"><span /></div>
          <div className="dash-plant"><Leaf size={48} /><Leaf size={34} /><Leaf size={26} /></div>
          <span className="dash-spark dash-spark-a">✳</span><span className="dash-spark dash-spark-b">✦</span>
        </div>
      </section>

      <section>
        <div className="dash-section-heading">
          <div><p className="dash-kicker">{isTr ? 'YOLCULUĞUN' : 'YOUR JOURNEY'}</p><h2>{isTr ? 'İlerleme panon' : 'Your progress at a glance'}</h2></div>
          <button onClick={() => navigate('/tracker')} className="dash-text-link">{isTr ? 'Tümünü görüntüle' : 'View all'} <ArrowUpRight size={15} /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 md:gap-4 mt-4">
          {statCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={() => navigate('/tracker')} className={`dash-stat-card dash-tone-${item.tone} text-left`} style={{ animationDelay: `${index * 65}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <span className="dash-stat-icon"><Icon size={19} strokeWidth={1.8} /></span>
                  <ArrowUpRight size={16} className="dash-stat-arrow" />
                </div>
                <span className="dash-stat-value">{item.value}</span>
                <span className="dash-stat-label">{item.label}</span>
                <span className="dash-stat-note">{item.note}</span>
                <span className="dash-stat-squiggle" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6">
        <section className="xl:col-span-5 dash-streak-card relative overflow-hidden">
          <div className="dash-streak-pattern" aria-hidden="true">✳</div>
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="dash-kicker dash-kicker-light">{isTr ? 'DEVAMLILIK KAZANIR' : 'CONSISTENCY IS MAGIC'}</p>
              <h2 className="mt-2 text-2xl md:text-3xl">{t('dashStreak')}</h2>
              <p className="mt-2 text-sm dash-streak-copy">{t('dashStreakMsg')}</p>
            </div>
            <span className="dash-flame-badge"><Flame size={25} fill="currentColor" /></span>
          </div>
          <div className="relative z-10 flex items-end gap-3 mt-7">
            <span className="dash-streak-number">{streak}</span>
            <span className="dash-streak-unit">{isTr ? 'günlük seri' : 'day streak'}</span>
          </div>
          <div className="dash-streak-progress" aria-label={isTr ? `${Math.min(streak, 7)} / 7 gün` : `${Math.min(streak, 7)} of 7 days`}>
            {Array.from({ length: 7 }).map((_, index) => <span key={index} className={index < streak % 8 || streak >= 7 ? 'is-filled' : ''} />)}
          </div>
          <p className="dash-streak-footnote">{isTr ? 'Her gün küçük bir adım at. Kendine yatırım yapıyorsun.' : 'One small step a day is an investment in yourself.'}</p>
          <div className="dash-streak-sun" aria-hidden="true" />
        </section>

        <section className="xl:col-span-7 dash-calendar-card">
          <div className="flex items-start justify-between gap-3">
            <div><p className="dash-kicker">{isTr ? 'PLANLARIN' : 'ON YOUR RADAR'}</p><h2 className="mt-1 text-2xl">{monthNames[currentMonth]} <span className="dash-calendar-year">{currentYear}</span></h2></div>
            <button onClick={() => navigate('/takvim')} className="dash-round-link" aria-label={isTr ? 'Takvimi aç' : 'Open calendar'}><ArrowUpRight size={19} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mt-5">
            {dayNames.map(day => <div key={day} className="dash-day-name">{day}</div>)}
            {Array.from({ length: startDayIndex }).map((_, index) => <div key={`empty-${index}`} />)}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isToday = day === today.getDate();
              const eventDay = hasEvent(day);
              return (
                <div key={day} className={`dash-calendar-day ${isToday ? 'is-today' : ''} ${eventDay ? 'has-event' : ''}`}>
                  <span>{day}</span>{eventDay && <i />}
                </div>
              );
            })}
          </div>
          <button onClick={() => navigate('/takvim')} className="dash-calendar-footer"><CalendarDays size={15} /> {isTr ? 'Tüm takvimi aç' : 'Open full calendar'} <ArrowUpRight size={15} /></button>
        </section>
      </div>

      <section className="dash-reminders-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="dash-reminder-icon"><Bell size={19} /></span>
            <div><p className="dash-kicker">{isTr ? 'BUGÜNÜN AKIŞI' : 'TODAY AT A GLANCE'}</p><h2 className="text-2xl mt-1">{t('reminderTitle')}</h2></div>
          </div>
          <span className="dash-reminder-count">{todaysEvents.length} {isTr ? 'etkinlik' : 'events'}</span>
        </div>
        {todaysEvents.length > 0 ? (
          <div className="dash-event-list mt-5">
            {todaysEvents.map((event, index) => (
              <div key={event.id} className="dash-event-row">
                <div className="dash-event-time">{event.time}</div>
                <div className="dash-event-timeline"><span /></div>
                <div className="min-w-0 flex-1"><p className="dash-event-title">{event.title}</p></div>
                <span className="dash-event-index">{String(index + 1).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="dash-empty-state mt-5">
            <span className="dash-empty-illustration"><CalendarDays size={24} /></span>
            <div><p className="font-semibold">{t('dashNoEvent')}</p><p className="text-sm mt-1">{isTr ? 'Bugün için bir plan ekleyerek başlayabilirsin.' : 'Add a little plan to give your day some shape.'}</p></div>
            <button onClick={() => navigate('/takvim')} className="dash-empty-action">{isTr ? 'Plan ekle' : 'Add a plan'} <ArrowUpRight size={15} /></button>
          </div>
        )}
      </section>
    </div>
  );
}
