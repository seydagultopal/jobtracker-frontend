import { Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Circle, Frown, Meh, Plus, Save, Smile, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function Agenda() {
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [agendaId, setAgendaId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [mood, setMood] = useState('NEUTRAL'); 
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAgendaData(currentDate);
  }, [currentDate]);

  const formatDateForApi = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const fetchAgendaData = async (date) => {
    try {
      setLoading(true);
      const dateStr = formatDateForApi(date);
      const response = await api.get(`/agenda/${dateStr}`);
      
      if (response.data) {
        setAgendaId(response.data.id);
        setTodos(response.data.todos || []);
        setMood(response.data.mood || 'NEUTRAL');
        setNotes(response.data.notes || '');
      } else {
        resetForm();
      }
    } catch (error) {
      if (error.response?.status === 404) {
        resetForm();
      } else {
        console.error("Ajanda verisi çekilirken hata:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAgendaId(null);
    setTodos([]);
    setMood('NEUTRAL');
    setNotes('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const dateStr = formatDateForApi(currentDate);
      const payload = {
        date: dateStr,
        mood: mood,
        notes: notes,
        todos: todos
      };

      const response = await api.post(`/agenda/${dateStr}`, payload);
      setAgendaId(response.data.id);
      
      setTimeout(() => setSaving(false), 500);
    } catch (error) {
      console.error("Ajanda kaydedilirken hata:", error);
      setSaving(false);
    }
  };

  const handleAddTodo = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!newTodo.trim()) return;
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const displayDate = currentDate.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    // DÜZELTME: h-full yerine min-h-full kullanıldı. Böylece içerik arttıkça container da aşağıya doğru genişler.
    <div className="bg-white dark:bg-twilight rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none p-6 md:p-8 lg:p-10 border border-gray-100 dark:border-starlight/20 transition-colors duration-500 min-h-full flex flex-col space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] p-4 md:p-6 border border-gray-100 dark:border-starlight/20 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 transition-colors">
        
        <div className="flex items-center gap-4 bg-white dark:bg-night/50 p-2 rounded-2xl border border-gray-100 dark:border-starlight/20 shadow-sm">
          <button onClick={() => changeDate(-1)} className="p-2 text-gray-400 hover:text-columbia hover:bg-gray-50 dark:hover:bg-twilight rounded-xl transition-all">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <div className="flex items-center gap-2 px-2">
            <CalendarIcon size={18} className="text-columbia" />
            <span className="font-black text-gray-700 dark:text-gray-200 text-sm tracking-wide w-48 text-center">{displayDate}</span>
          </div>
          <button onClick={() => changeDate(1)} className="p-2 text-gray-400 hover:text-columbia hover:bg-gray-50 dark:hover:bg-twilight rounded-xl transition-all">
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="flex-1 md:flex-none px-6 py-3.5 bg-columbia/10 dark:bg-columbia/20 text-columbia font-black rounded-xl hover:bg-columbia hover:text-white transition-all text-xs uppercase tracking-widest text-center"
          >
            {language === 'tr' ? 'Bugün' : 'Today'}
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 md:flex-none px-8 py-3.5 bg-cambridge text-white font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cambridge/20 text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
          >
            <Save size={16} strokeWidth={2.5} />
            {saving ? (language === 'tr' ? 'Kaydediliyor...' : 'Saving...') : t('btnSave')}
          </button>
        </div>
      </div>

      {/* İÇERİK: Yapılacaklar, Ruh Hali ve Notlar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* SOL KOLON */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] p-6 border border-gray-100 dark:border-starlight/20 shrink-0">
            <h3 className="text-sm font-black text-gray-800 dark:text-white tracking-widest uppercase mb-4 text-center">{t('agendaDailyMood')}</h3>
            <div className="flex justify-center gap-4 md:gap-6">
              {[
                { val: 'BAD', icon: Frown, color: 'text-cherry hover:bg-cherry/10', active: 'bg-cherry/20 text-cherry border-cherry/30' },
                { val: 'NEUTRAL', icon: Meh, color: 'text-peach hover:bg-peach/10', active: 'bg-peach/20 text-peach border-peach/30' },
                { val: 'GOOD', icon: Smile, color: 'text-cambridge hover:bg-cambridge/10', active: 'bg-cambridge/20 text-cambridge border-cambridge/30' }
              ].map((m) => (
                <button
                  key={m.val}
                  onClick={() => setMood(m.val)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 shadow-sm ${
                    mood === m.val 
                      ? m.active 
                      : `border-transparent bg-white dark:bg-night/50 ${m.color} opacity-60 hover:opacity-100`
                  }`}
                >
                  <m.icon size={32} strokeWidth={2.5} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] p-6 border border-gray-100 dark:border-starlight/20 flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-lg font-black text-gray-800 dark:text-white tracking-tight mb-6">{t('agendaTodoTitle')}</h3>
            
            <div className="flex items-center gap-3 mb-6 relative">
              <input 
                type="text" 
                placeholder={t('agendaNewTodoPlaceholder')}
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleAddTodo}
                className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-2xl pl-4 pr-12 py-3.5 outline-none focus:border-columbia focus:ring-2 focus:ring-columbia/20 transition-all font-medium text-sm shadow-sm"
              />
              <button 
                onClick={handleAddTodo}
                className="absolute right-2 p-2 bg-columbia text-white rounded-xl hover:bg-columbia/80 transition-all shadow-sm"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>

            {/* DÜZELTME: Sabit bir yüksekliğe sıkışıp kaydırma çubuğu çıkarmasın diye esnek bir liste yapısına geçildi */}
            {loading ? (
              <div className="flex-1 flex justify-center items-center text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                {t('loading')}
              </div>
            ) : todos.length === 0 ? (
              <div className="flex-1 flex justify-center items-center text-gray-400 dark:text-gray-500 italic text-sm text-center px-4">
                {t('agendaNoTodo')}
              </div>
            ) : (
              <div className="flex-1 space-y-3 pb-4">
                {todos.map((todo, index) => (
                  <div key={index} className="flex items-center justify-between group bg-white dark:bg-night/40 p-3.5 rounded-2xl border border-gray-100 dark:border-starlight/20 hover:border-columbia/30 transition-all shadow-sm">
                    <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleTodo(index)}>
                      {todo.completed ? (
                        <CheckCircle2 size={20} className="text-cambridge shrink-0" strokeWidth={2.5} />
                      ) : (
                        <Circle size={20} className="text-gray-300 dark:text-gray-600 shrink-0" strokeWidth={2.5} />
                      )}
                      <span className={`text-sm font-bold transition-all ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                        {todo.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTodo(index)}
                      className="p-2 text-gray-300 dark:text-gray-600 hover:text-cherry bg-gray-50 dark:bg-twilight hover:bg-cherry/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SAĞ KOLON: Çalışma Notları & Günlük */}
        {/* DÜZELTME: h-[500px] kaldırıldı, minimum 400px ama içerik arttıkça sonsuza kadar esneyebilen hale getirildi */}
        <div className="lg:col-span-7 bg-gray-50/50 dark:bg-night/20 rounded-[2rem] p-6 md:p-8 border border-gray-100 dark:border-starlight/20 flex flex-col min-h-[400px]">
          <h3 className="text-lg font-black text-gray-800 dark:text-white tracking-tight mb-6">{t('agendaNotesTitle')}</h3>
          
          {loading ? (
             <div className="flex-1 flex justify-center items-center text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">
               {t('loading')}
             </div>
          ) : (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('agendaNotesPlaceholder')}
              className="w-full flex-1 min-h-[300px] bg-white dark:bg-night/30 border border-gray-200 dark:border-starlight/20 text-gray-800 dark:text-gray-200 rounded-[2rem] p-6 outline-none focus:border-peach focus:ring-4 focus:ring-peach/10 transition-all font-medium text-sm resize-y custom-scrollbar leading-relaxed shadow-sm"
            />
          )}
        </div>

      </div>
    </div>
  );
}