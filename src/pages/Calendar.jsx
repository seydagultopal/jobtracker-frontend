import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, Clock3, Search, X, CalendarCheck2, ArrowUpRight, ListFilter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useLanguage } from '../context/LanguageContext';

const pad = (value) => String(value).padStart(2, '0');
const toDateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const eventTypes = ['BOOTCAMP', 'INTERVIEW', 'MEETING', 'DEADLINE'];

export default function Calendar() {
  const { events, addEvent, deleteEvent } = useEvents();
  const { t, language } = useLanguage();
  const isTr = language === 'tr';
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [formData, setFormData] = useState({
    title: '', time: '10:00', type: 'BOOTCAMP', isRecurring: false, recurringWeeks: '4'
  });

  const monthNames = isTr
    ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = isTr ? ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const typeLabels = {
    BOOTCAMP: isTr ? 'Eğitim' : 'Learning',
    INTERVIEW: isTr ? 'Mülakat' : 'Interview',
    MEETING: isTr ? 'Toplantı' : 'Meeting',
    DEADLINE: isTr ? 'Son tarih' : 'Deadline'
  };
  const typeDescriptions = {
    BOOTCAMP: isTr ? 'Bootcamp / Eğitim' : 'Bootcamp / Learning',
    INTERVIEW: isTr ? 'Mülakat / Sınav' : 'Interview / Assessment',
    MEETING: isTr ? 'Toplantı' : 'Meeting',
    DEADLINE: isTr ? 'Teslim tarihi' : 'Deadline'
  };

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const firstDay = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const calendarCells = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 - firstDay);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return { date, key: toDateKey(date), inMonth: date.getMonth() === currentDate.getMonth() };
    });
  }, [currentDate, firstDay]);

  const monthEvents = useMemo(
    () => events.filter((event) => event.date?.startsWith(`${currentDate.getFullYear()}-${pad(currentDate.getMonth() + 1)}-`)),
    [events, currentDate]
  );
  const visibleEvents = useMemo(() => events.filter((event) => {
    const matchesSearch = !search.trim() || event.title?.toLowerCase().includes(search.trim().toLowerCase());
    const matchesType = activeFilter === 'ALL' || event.type === activeFilter;
    return matchesSearch && matchesType;
  }), [events, search, activeFilter]);
  const selectedEvents = visibleEvents
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const totalMonthEvents = monthEvents.length;
  const interviewCount = monthEvents.filter((event) => event.type === 'INTERVIEW').length;
  const deadlineCount = monthEvents.filter((event) => event.type === 'DEADLINE').length;
  const selectedDateObject = new Date(`${selectedDate}T12:00:00`);
  const selectedDateLabel = selectedDateObject.toLocaleDateString(isTr ? 'tr-TR' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };
  const goToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(toDateKey(now));
  };
  const openModalForDate = (dateKey = selectedDate) => {
    setSelectedDate(dateKey);
    setFormData({ title: '', time: '10:00', type: 'BOOTCAMP', isRecurring: false, recurringWeeks: '4' });
    setShowModal(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = formData.title.trim();
    if (!title || !selectedDate) return;
    const baseDate = new Date(`${selectedDate}T12:00:00`);
    const count = formData.isRecurring ? Number(formData.recurringWeeks) : 1;
    const newEvents = Array.from({ length: count }, (_, index) => {
      const eventDate = new Date(baseDate);
      eventDate.setDate(baseDate.getDate() + index * 7);
      return {
        id: globalThis.crypto?.randomUUID?.() || Date.now() + index,
        title,
        date: toDateKey(eventDate),
        time: formData.time,
        type: formData.type
      };
    });
    addEvent(newEvents);
    setShowModal(false);
    setFormData({ title: '', time: '10:00', type: 'BOOTCAMP', isRecurring: false, recurringWeeks: '4' });
  };

  const typeClass = (type) => ({
    BOOTCAMP: 'calendar-type-learning',
    INTERVIEW: 'calendar-type-interview',
    MEETING: 'calendar-type-meeting',
    DEADLINE: 'calendar-type-deadline'
  }[type] || 'calendar-type-default');

  return (
    <main className="calendar-page">
      <header className="calendar-hero calendar-hero-compact">
        <div className="calendar-hero-actions">
          <button type="button" className="calendar-today-button" onClick={goToToday}>{isTr ? 'Bugüne dön' : 'Today'}</button>
          <button type="button" className="calendar-add-button" onClick={() => openModalForDate(selectedDate)}><Plus size={17} />{isTr ? 'Etkinlik ekle' : 'Add event'}</button>
        </div>
      </header>

      <section className="calendar-overview" aria-label={isTr ? 'Aylık özet' : 'Monthly overview'}>
        <div className="calendar-overview-label"><span className="calendar-overview-icon"><CalendarDays size={18} /></span><div><span>{isTr ? 'BU AY' : 'THIS MONTH'}</span><strong>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</strong></div></div>
        <div className="calendar-overview-stat"><strong>{totalMonthEvents}</strong><span>{isTr ? 'planlı etkinlik' : 'planned events'}</span></div>
        <div className="calendar-overview-stat"><strong>{interviewCount}</strong><span>{isTr ? 'mülakat' : 'interviews'}</span></div>
        <div className="calendar-overview-stat"><strong>{deadlineCount}</strong><span>{isTr ? 'son tarih' : 'deadlines'}</span></div>
      </section>

      <div className="calendar-workspace">
        <section className="calendar-month-panel">
          <div className="calendar-month-toolbar">
            <div><span className="calendar-section-kicker">{isTr ? 'AYLIK GÖRÜNÜM' : 'MONTH VIEW'}</span><h2>{monthNames[currentDate.getMonth()]} <span>{currentDate.getFullYear()}</span></h2></div>
            <div className="calendar-month-controls">
              <button type="button" aria-label={isTr ? 'Önceki ay' : 'Previous month'} onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button>
              <button type="button" aria-label={isTr ? 'Sonraki ay' : 'Next month'} onClick={() => changeMonth(1)}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="calendar-weekdays">{dayNames.map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">
            {calendarCells.map(({ date, key, inMonth }) => {
              const dayEvents = visibleEvents.filter((event) => event.date === key).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
              const isToday = key === toDateKey(today);
              const isSelected = key === selectedDate;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  onDoubleClick={() => openModalForDate(key)}
                  className={`calendar-day-cell ${inMonth ? '' : 'is-outside'} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                  aria-label={`${date.toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}, ${dayEvents.length} ${isTr ? 'etkinlik' : 'events'}`}
                  aria-pressed={isSelected}
                >
                  <span className="calendar-day-number">{date.getDate()}</span>
                  <span className="calendar-day-events">
                    {dayEvents.slice(0, 3).map((item) => <span key={item.id} className={`calendar-event-chip ${typeClass(item.type)}`} title={item.title}><i />{item.title}</span>)}
                    {dayEvents.length > 3 && <span className="calendar-more-events">+{dayEvents.length - 3} {isTr ? 'daha' : 'more'}</span>}
                  </span>
                  {dayEvents.length > 0 && <span className="calendar-mobile-dots" aria-hidden="true">{dayEvents.slice(0, 3).map((item) => <i key={item.id} className={typeClass(item.type)} />)}</span>}
                </button>
              );
            })}
          </div>
          <div className="calendar-legend">
            {eventTypes.map((type) => <span key={type}><i className={typeClass(type)} />{typeLabels[type]}</span>)}
            <span className="calendar-double-click-hint">{isTr ? 'Güne çift tıkla: hızlı ekle' : 'Double-click a day to quick-add'}</span>
          </div>
        </section>

        <aside className="calendar-day-panel">
          <div className="calendar-day-panel-head">
            <div><span className="calendar-section-kicker">{isTr ? 'GÜNÜN PLANI' : 'DAILY PLAN'}</span><h2>{selectedDateObject.getDate()} <span>{monthNames[selectedDateObject.getMonth()]}</span></h2><p>{selectedDateLabel}</p></div>
            <button type="button" aria-label={isTr ? 'Seçili güne etkinlik ekle' : 'Add event to selected day'} onClick={() => openModalForDate(selectedDate)}><Plus size={18} /></button>
          </div>
          <div className="calendar-day-panel-tools">
            <label className="calendar-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={isTr ? 'Etkinlik ara...' : 'Search events...'} /></label>
            <label className="calendar-filter" aria-label={isTr ? 'Etkinlik türüne göre filtrele' : 'Filter by event type'}><ListFilter size={15} /><select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)}><option value="ALL">{isTr ? 'Tüm türler' : 'All types'}</option>{eventTypes.map((type) => <option key={type} value={type}>{typeLabels[type]}</option>)}</select></label>
          </div>
          <div className="calendar-selected-date-row"><span>{isTr ? 'SEÇİLİ GÜN' : 'SELECTED DAY'}</span><strong>{selectedEvents.length} {isTr ? 'etkinlik' : 'events'}</strong></div>
          <div className="calendar-selected-events">
            {selectedEvents.length === 0 ? (
              <div className="calendar-empty-day"><span className="calendar-empty-icon"><CalendarCheck2 size={23} /></span><strong>{isTr ? 'Bu gün henüz boş' : 'Nothing planned yet'}</strong><p>{isTr ? 'Küçük bir plan ekleyerek gününü netleştirebilirsin.' : 'Add a small plan to give your day some shape.'}</p><button type="button" onClick={() => openModalForDate(selectedDate)}><Plus size={15} />{isTr ? 'Etkinlik oluştur' : 'Create event'}</button></div>
            ) : selectedEvents.map((event) => (
              <article key={event.id} className="calendar-selected-event">
                <div className={`calendar-event-type-mark ${typeClass(event.type)}`} />
                <div className="calendar-selected-event-time"><Clock3 size={13} />{event.time || (isTr ? 'Saat belirtilmedi' : 'No time')}</div>
                <h3>{event.title}</h3>
                <span className={`calendar-event-category ${typeClass(event.type)}`}>{typeLabels[event.type] || (isTr ? 'Diğer' : 'Other')}</span>
                <button type="button" className="calendar-delete-event" aria-label={isTr ? `${event.title} etkinliğini sil` : `Delete ${event.title}`} onClick={() => deleteEvent(event.id)}><Trash2 size={14} /></button>
              </article>
            ))}
          </div>
          <div className="calendar-day-panel-footer"><span>{isTr ? 'Planlar değişebilir. Önemli olan bir sonraki adım.' : 'Plans can change. What matters is the next step.'}</span><ArrowUpRight size={16} /></div>
        </aside>
      </div>

      {showModal && (
        <div className="calendar-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowModal(false); }}>
          <section className="calendar-modal" role="dialog" aria-modal="true" aria-labelledby="calendar-modal-title">
            <div className="calendar-modal-heading"><div><span className="calendar-section-kicker">{isTr ? 'YENİ PLAN' : 'NEW PLAN'}</span><h2 id="calendar-modal-title">{t('calAddEvent')}</h2></div><button type="button" aria-label={isTr ? 'Kapat' : 'Close'} onClick={() => setShowModal(false)}><X size={19} /></button></div>
            <p className="calendar-modal-date"><CalendarDays size={15} />{new Date(`${selectedDate}T12:00:00`).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <form onSubmit={handleSubmit} className="calendar-event-form">
              <label>{t('calTitle')}<input autoFocus required maxLength={100} type="text" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} placeholder={isTr ? 'Örn. Teknik mülakat, Java eğitimi...' : 'e.g. Technical interview, Java course...'} /></label>
              <div className="calendar-form-row">
                <label>{t('calTime')}<input required type="time" value={formData.time} onChange={(event) => setFormData({ ...formData, time: event.target.value })} /></label>
                <label>{t('calType')}<select value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value })}>{eventTypes.map((type) => <option key={type} value={type}>{typeDescriptions[type]}</option>)}</select></label>
              </div>
              <label className="calendar-recurring-toggle"><input type="checkbox" checked={formData.isRecurring} onChange={(event) => setFormData({ ...formData, isRecurring: event.target.checked })} /><span><strong>{t('calRecurring')}</strong><small>{isTr ? 'Aynı etkinliği haftalık olarak ekle' : 'Repeat this event every week'}</small></span></label>
              {formData.isRecurring && <label>{t('calWeeks')}<select value={formData.recurringWeeks} onChange={(event) => setFormData({ ...formData, recurringWeeks: event.target.value })}><option value="2">{isTr ? '2 hafta' : '2 weeks'}</option><option value="4">{isTr ? '4 hafta (1 ay)' : '4 weeks (1 month)'}</option><option value="8">{isTr ? '8 hafta (2 ay)' : '8 weeks (2 months)'}</option><option value="12">{isTr ? '12 hafta (3 ay)' : '12 weeks (3 months)'}</option></select></label>}
              <div className="calendar-modal-actions"><button type="button" className="calendar-cancel-button" onClick={() => setShowModal(false)}>{isTr ? 'Vazgeç' : 'Cancel'}</button><button type="submit" className="calendar-confirm-button"><Plus size={16} />{t('calSaveEvent')}</button></div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
