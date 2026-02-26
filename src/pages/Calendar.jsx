import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useEvents } from '../context/EventContext';

export default function Calendar() {
  const { events, addEvent, deleteEvent } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    time: '10:00',
    type: 'BOOTCAMP', // BOOTCAMP, INTERVIEW, MEETING, DEADLINE
    isRecurring: false,
    recurringWeeks: 4
  });

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Pazartesiyi 0 yapmak için
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const openModalForDate = (day) => {
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    setSelectedDate(`${currentDate.getFullYear()}-${monthStr}-${dayStr}`);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvents = [];
    const baseDate = new Date(selectedDate);

    const weeksToAdd = formData.isRecurring ? parseInt(formData.recurringWeeks) : 1;

    for (let i = 0; i < weeksToAdd; i++) {
      const eventDate = new Date(baseDate);
      eventDate.setDate(baseDate.getDate() + (i * 7)); // Her döngüde 7 gün (1 hafta) ekle
      
      const monthStr = String(eventDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(eventDate.getDate()).padStart(2, '0');
      const formattedDate = `${eventDate.getFullYear()}-${monthStr}-${dayStr}`;

      newEvents.push({
        id: Date.now() + i,
        title: formData.title,
        date: formattedDate,
        time: formData.time,
        type: formData.type
      });
    }

    addEvent(newEvents);
    setShowModal(false);
    setFormData({ title: '', time: '10:00', type: 'BOOTCAMP', isRecurring: false, recurringWeeks: 4 });
  };

  const getEventColor = (type) => {
    const colors = {
      'BOOTCAMP': 'bg-cambridge/20 text-cambridge border-cambridge/30',
      'INTERVIEW': 'bg-peach/30 text-orange-600 border-peach/50',
      'MEETING': 'bg-columbia/30 text-columbia border-columbia/40',
      'DEADLINE': 'bg-cherry/20 text-cherry border-cherry/30'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in">
      
      {/* Takvim Üst Barı */}
      <div className="bg-white dark:bg-twilight rounded-[2rem] p-6 flex justify-between items-center shadow-sm border border-columbia/20 dark:border-starlight/30 transition-colors duration-500">
        <h2 className="text-3xl font-black text-cherry tracking-tight">
          {monthNames[currentDate.getMonth()]} <span className="text-columbia">{currentDate.getFullYear()}</span>
        </h2>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center rounded-xl bg-alabaster dark:bg-night text-gray-600 dark:text-gray-300 hover:bg-columbia/20 hover:text-columbia transition-all"><ChevronLeft size={20} /></button>
          <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center rounded-xl bg-alabaster dark:bg-night text-gray-600 dark:text-gray-300 hover:bg-columbia/20 hover:text-columbia transition-all"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Takvim Izgarası */}
      <div className="bg-white dark:bg-twilight rounded-[2rem] p-6 shadow-sm border border-columbia/20 dark:border-starlight/30 flex-1 flex flex-col transition-colors duration-500 min-h-[600px]">
        
        {/* Gün İsimleri */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        {/* Gün Kutucukları */}
        <div className="grid grid-cols-7 gap-3 flex-1 auto-rows-fr">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-alabaster/30 dark:bg-night/30 rounded-2xl border border-transparent"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const fullDate = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;
            const dayEvents = events.filter(e => e.date === fullDate);
            
            const isToday = new Date().toISOString().split('T')[0] === fullDate;

            return (
              <div 
                key={day} 
                onClick={() => openModalForDate(day)}
                className={`relative p-3 rounded-2xl border border-columbia/10 dark:border-starlight/20 flex flex-col gap-1 cursor-pointer transition-all hover:border-columbia hover:shadow-md ${isToday ? 'bg-peach/10 border-peach/30' : 'bg-white dark:bg-night'}`}
              >
                <span className={`text-sm font-black ${isToday ? 'text-peach' : 'text-gray-400 dark:text-gray-500'}`}>{day}</span>
                
                <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                  {dayEvents.map(evt => (
                    <div key={evt.id} className={`group relative text-[9px] font-bold px-2 py-1 rounded-lg truncate border ${getEventColor(evt.type)}`} title={evt.title}>
                      {evt.time} - {evt.title}
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteEvent(evt.id); }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-cherry hover:scale-110 transition-all bg-white/80 dark:bg-night/80 rounded"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Etkinlik Ekleme Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-columbia/20 dark:bg-night/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-twilight p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/50 dark:border-starlight/50">
            <h3 className="text-2xl font-black text-cherry tracking-tight mb-6 flex justify-between">
              Etkinlik Ekle
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-cherry">×</button>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Başlık</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-alabaster/50 dark:bg-night rounded-xl outline-none font-bold text-gray-700 dark:text-gray-200" placeholder="Örn: Java Bootcamp" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tarih</label>
                  <input type="text" disabled value={selectedDate} className="w-full p-3 bg-gray-100 dark:bg-starlight/20 rounded-xl outline-none font-bold text-gray-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Saat</label>
                  <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-3 bg-alabaster/50 dark:bg-night rounded-xl outline-none font-bold text-gray-700 dark:text-gray-200 [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tür</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 bg-alabaster/50 dark:bg-night rounded-xl outline-none font-bold text-gray-700 dark:text-gray-200">
                  <option value="BOOTCAMP">Bootcamp / Eğitim</option>
                  <option value="INTERVIEW">Mülakat / Sınav</option>
                  <option value="MEETING">Toplantı</option>
                  <option value="DEADLINE">Teslim Tarihi (Deadline)</option>
                </select>
              </div>

              {/* TEKRARLAMA (RECURRING) BÖLÜMÜ */}
              <div className="bg-columbia/10 dark:bg-starlight/20 p-4 rounded-2xl border border-columbia/20 dark:border-starlight/30 mt-4">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input type="checkbox" checked={formData.isRecurring} onChange={e => setFormData({...formData, isRecurring: e.target.checked})} className="w-4 h-4 text-cherry rounded border-gray-300" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Haftalık Tekrarla 🔁</span>
                </label>
                
                {formData.isRecurring && (
                  <div className="animate-fade-in flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500">Kaç hafta sürecek?</span>
                    <select value={formData.recurringWeeks} onChange={e => setFormData({...formData, recurringWeeks: e.target.value})} className="p-2 bg-white dark:bg-night rounded-xl outline-none font-bold text-sm text-columbia">
                      <option value="2">2 Hafta</option>
                      <option value="4">4 Hafta (1 Ay)</option>
                      <option value="8">8 Hafta (2 Ay)</option>
                      <option value="12">12 Hafta (3 Ay)</option>
                    </select>
                  </div>
                )}
              </div>

              <button type="submit" className="w-full mt-4 py-4 bg-cherry text-white font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cherry/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                <Plus size={16} /> Etkinliği Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}