import { Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Circle, Frown, Meh, Plus, Save, Smile, Sparkles, Trash2 } from 'lucide-react';
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
    if (e.key === 'Enter' || e.type === 'click' || e.type === 'submit') {
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

  const completedCount = todos.filter((todo) => todo.completed).length;
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;
  const isToday = formatDateForApi(currentDate) === formatDateForApi(new Date());

  return (
    <div className="agenda-page min-h-full flex flex-col gap-5 animate-fade-in">
      <section className="relative overflow-hidden rounded-[2rem] border border-orange-200/70 dark:border-starlight/20 bg-[#fff8ef] dark:bg-twilight p-5 md:p-7 lg:p-8">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full border-[1.5rem] border-orange-200/35 dark:border-peach/10" aria-hidden="true" />
        <div className="pointer-events-none absolute right-16 bottom-5 text-3xl text-orange-300/80 dark:text-peach/50 rotate-12" aria-hidden="true">✳</div>
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-700/80 dark:text-peach">
              {language === 'tr' ? 'KİŞİSEL ÇALIŞMA GÜNLÜĞÜ' : 'YOUR DAILY JOURNAL'}
            </p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#38291f] dark:text-gray-100">
              {language === 'tr' ? 'Gününü tasarla.' : 'Make room for today.'}
            </h1>
            <p className="mt-2 max-w-xl text-sm md:text-base text-[#806b5c] dark:text-gray-400">
              {language === 'tr' ? 'Küçük adımlar da ilerlemedir. Bugün kendine nasıl bir gün hazırlıyorsun?' : 'Small steps count. What kind of day are you making for yourself?'}
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#594438] dark:text-gray-200">
              <CalendarIcon size={17} className="text-orange-600 dark:text-peach" />
              <span>{displayDate}</span>
              {isToday && <span className="rounded-full bg-orange-100 dark:bg-peach/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-800 dark:text-peach">{language === 'tr' ? 'Bugün' : 'Today'}</span>}
            </div>
          </div>
          <div className="relative flex shrink-0 items-center gap-2 self-start md:self-auto">
            <button onClick={() => changeDate(-1)} aria-label={language === 'tr' ? 'Önceki gün' : 'Previous day'} className="rounded-xl border border-orange-200/80 dark:border-starlight/20 bg-white/80 dark:bg-night/40 p-3 text-[#806b5c] dark:text-gray-300 transition hover:bg-white dark:hover:bg-night">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="rounded-xl border border-orange-200/80 dark:border-starlight/20 bg-white/80 dark:bg-night/40 px-4 py-3 text-xs font-bold text-[#594438] dark:text-gray-200 transition hover:bg-white dark:hover:bg-night">
              {language === 'tr' ? 'Bugüne dön' : 'Jump to today'}
            </button>
            <button onClick={() => changeDate(1)} aria-label={language === 'tr' ? 'Sonraki gün' : 'Next day'} className="rounded-xl border border-orange-200/80 dark:border-starlight/20 bg-white/80 dark:bg-night/40 p-3 text-[#806b5c] dark:text-gray-300 transition hover:bg-white dark:hover:bg-night">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3" aria-label={language === 'tr' ? 'Günlük özet' : 'Daily summary'}>
        <div className="rounded-2xl border border-gray-200/80 dark:border-starlight/20 bg-white dark:bg-twilight p-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{language === 'tr' ? 'Günün planı' : 'On your list'}</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{todos.length}<span className="ml-1 text-sm font-medium text-gray-400">{language === 'tr' ? 'görev' : 'tasks'}</span></p>
            <span className="rounded-xl bg-orange-50 dark:bg-peach/10 p-2 text-orange-700 dark:text-peach"><CalendarIcon size={18} /></span>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200/80 dark:border-starlight/20 bg-white dark:bg-twilight p-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{language === 'tr' ? 'Tamamlanan' : 'Completed'}</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{completedCount}<span className="ml-1 text-sm font-medium text-gray-400">/ {todos.length}</span></p>
            <span className="rounded-xl bg-green-50 dark:bg-cambridge/10 p-2 text-green-700 dark:text-cambridge"><CheckCircle2 size={18} /></span>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200/80 dark:border-starlight/20 bg-white dark:bg-twilight p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{language === 'tr' ? 'Günlük ilerleme' : 'Daily progress'}</p>
            <span className="text-sm font-extrabold text-orange-700 dark:text-peach">{progress}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-orange-100 dark:bg-night">
            <div className="h-full rounded-full bg-orange-500 transition-all duration-300 dark:bg-peach" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">{todos.length === 0 ? (language === 'tr' ? 'İlk görevini ekleyerek başla.' : 'Add your first task to begin.') : (language === 'tr' ? 'Kendi hızında ilerle.' : 'Keep moving at your own pace.')}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <section className="xl:col-span-7 rounded-[1.75rem] border border-gray-200/80 dark:border-starlight/20 bg-white dark:bg-twilight p-5 md:p-6 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-peach">{language === 'tr' ? 'ÖNCE BUGÜN' : 'ONE THING AT A TIME'}</p>
              <h2 className="mt-1 text-xl font-black text-gray-900 dark:text-gray-100">{t('agendaTodoTitle')}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{language === 'tr' ? 'Aklındakileri listele, bitirdikçe işaretle.' : 'Get it out of your head and onto your list.'}</p>
            </div>
            <span className="rounded-2xl bg-orange-50 dark:bg-peach/10 p-3 text-orange-700 dark:text-peach"><CheckCircle2 size={21} /></span>
          </div>

          <form className="flex items-center gap-2 mb-5" onSubmit={(e) => { e.preventDefault(); handleAddTodo(e); }}>
            <input
              type="text"
              placeholder={t('agendaNewTodoPlaceholder')}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-gray-200 dark:border-starlight/25 bg-[#fffaf5] dark:bg-night/40 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 dark:focus:ring-peach/15"
            />
            <button type="submit" aria-label={language === 'tr' ? 'Görev ekle' : 'Add task'} className="shrink-0 rounded-xl bg-orange-500 px-4 py-3 text-white shadow-sm transition hover:bg-orange-600 active:scale-95">
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </form>

          <div className="flex-1">
            {loading ? (
              <div className="py-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">{t('loading')}</div>
            ) : todos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-orange-200 dark:border-starlight/25 bg-orange-50/40 dark:bg-night/20 px-5 py-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 dark:bg-peach/10 text-orange-700 dark:text-peach"><Sparkles size={22} /></div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{language === 'tr' ? 'Bugün için yeni bir başlangıç' : 'A fresh page for today'}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('agendaNoTodo')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todos.map((todo, index) => (
                  <div key={index} className={`group flex items-center gap-3 rounded-xl border p-3 transition-all ${todo.completed ? 'border-gray-100 bg-gray-50/70 dark:border-starlight/10 dark:bg-night/20' : 'border-gray-200/80 bg-white dark:border-starlight/20 dark:bg-night/25 hover:border-orange-200 dark:hover:border-peach/30'}`}>
                    <button type="button" aria-label={todo.completed ? (language === 'tr' ? 'Tamamlanmadı olarak işaretle' : 'Mark incomplete') : (language === 'tr' ? 'Tamamlandı olarak işaretle' : 'Mark complete')} onClick={() => toggleTodo(index)} className="shrink-0 rounded-full text-orange-600 transition hover:scale-110 dark:text-peach">
                      {todo.completed ? <CheckCircle2 size={21} /> : <Circle size={21} className="text-gray-300 dark:text-gray-600" />}
                    </button>
                    <span className={`min-w-0 flex-1 break-words text-sm font-medium ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>{todo.text}</span>
                    <button type="button" aria-label={language === 'tr' ? 'Görevi sil' : 'Delete task'} onClick={() => deleteTodo(index)} className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="xl:col-span-5 flex flex-col gap-5 min-w-0">
          <section className="rounded-[1.75rem] border border-gray-200/80 dark:border-starlight/20 bg-white dark:bg-twilight p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-peach">{language === 'tr' ? 'KENDİNE BİR BAK' : 'CHECK IN WITH YOURSELF'}</p>
                <h2 className="mt-1 text-lg font-black text-gray-900 dark:text-gray-100">{t('agendaDailyMood')}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{language === 'tr' ? 'Bugün nasıl hissediyorsun?' : 'How are you feeling today?'}</p>
              </div>
              <span className="text-2xl" aria-hidden="true">✳</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { val: 'BAD', icon: Frown, label: language === 'tr' ? 'Zor' : 'Low', active: 'border-red-200 bg-red-50 text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300' },
                { val: 'NEUTRAL', icon: Meh, label: language === 'tr' ? 'Normal' : 'Okay', active: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300' },
                { val: 'GOOD', icon: Smile, label: language === 'tr' ? 'İyi' : 'Good', active: 'border-green-200 bg-green-50 text-green-700 dark:border-green-400/20 dark:bg-green-500/10 dark:text-green-300' }
              ].map((m) => (
                <button key={m.val} type="button" onClick={() => setMood(m.val)} aria-pressed={mood === m.val} className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 transition ${mood === m.val ? m.active : 'border-gray-200 bg-gray-50/70 text-gray-400 hover:border-orange-200 hover:text-gray-600 dark:border-starlight/20 dark:bg-night/25 dark:text-gray-400'}`}>
                  <m.icon size={23} />
                  <span className="text-xs font-bold">{m.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="flex-1 rounded-[1.75rem] border border-gray-200/80 dark:border-starlight/20 bg-white dark:bg-twilight p-5 md:p-6 flex flex-col min-h-[260px]">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700 dark:text-peach">{language === 'tr' ? 'AKLINDA KALSIN' : 'A THOUGHT TO KEEP'}</p>
                <h2 className="mt-1 text-lg font-black text-gray-900 dark:text-gray-100">{t('agendaNotesTitle')}</h2>
              </div>
              <span className="text-2xl text-orange-400 dark:text-peach" aria-hidden="true">✎</span>
            </div>
            {loading ? (
              <div className="flex-1 py-10 text-center text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">{t('loading')}</div>
            ) : (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('agendaNotesPlaceholder')}
                className="min-h-[190px] w-full flex-1 resize-y rounded-xl border border-dashed border-orange-200 dark:border-starlight/20 bg-[#fffaf5] dark:bg-night/30 p-4 text-sm leading-7 text-gray-800 dark:text-gray-200 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200/40 dark:focus:ring-peach/10"
              />
            )}
            <p className="mt-3 text-[11px] text-gray-400">{language === 'tr' ? 'Notlarını kaybetmemek için gün sonunda kaydet.' : 'Save your notes before you leave the page.'}</p>
          </section>
        </div>
      </div>

      <div className="sticky bottom-3 z-10 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-orange-900/10 transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? (language === 'tr' ? 'Kaydediliyor...' : 'Saving...') : saving === false && agendaId ? (language === 'tr' ? 'Değişiklikleri kaydet' : 'Save changes') : t('btnSave')}
        </button>
      </div>
    </div>
  );
}
