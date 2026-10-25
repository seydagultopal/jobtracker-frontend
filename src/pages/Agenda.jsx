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

  const dayNumber = currentDate.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: '2-digit' });
  const monthLabel = currentDate.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'long' });
  const weekdayLabel = currentDate.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long' });
  const greeting = language === 'tr' ? (isToday ? 'Bugün kendine biraz alan aç.' : 'Bu günü kendin için ayır.') : (isToday ? 'Make a little room for yourself.' : 'A page for this day.');
  const moodLabel = mood === 'GOOD' ? (language === 'tr' ? 'İyi hissediyorum' : 'Feeling good') : mood === 'BAD' ? (language === 'tr' ? 'Biraz zor' : 'A little low') : (language === 'tr' ? 'Dengede' : 'Steady');

  return (
    <div className="agenda-editorial min-h-full animate-fade-in">
      <header className="agenda-editorial-header">
        <div className="agenda-editorial-heading">
          <div className="agenda-date-lockup">
            <span className="agenda-date-number">{dayNumber}</span>
            <div className="agenda-date-copy">
              <span>{monthLabel}</span>
              <span>{weekdayLabel}</span>
            </div>
          </div>
        </div>
        <div className="agenda-date-controls">
          <button type="button" onClick={() => changeDate(-1)} aria-label={language === 'tr' ? 'Önceki gün' : 'Previous day'}><ChevronLeft size={17} /></button>
          <button type="button" className="agenda-today-button" onClick={() => setCurrentDate(new Date())}>{language === 'tr' ? 'Bugün' : 'Today'}</button>
          <button type="button" onClick={() => changeDate(1)} aria-label={language === 'tr' ? 'Sonraki gün' : 'Next day'}><ChevronRight size={17} /></button>
        </div>
      </header>

      <div className="agenda-editorial-grid">
        <main className="agenda-journal-column">
          <section className="agenda-journal-paper">
            <div className="agenda-section-topline">
              <span className="agenda-section-number">01</span>
              <span>{language === 'tr' ? 'GÜNLÜK NOTU' : 'JOURNAL ENTRY'}</span>
              <span className="agenda-paper-date">{formatDateForApi(currentDate)}</span>
            </div>
            <label className="agenda-writing-label" htmlFor="agenda-journal-notes">{language === 'tr' ? 'Bugün aklında ne var?' : 'What’s on your mind today?'}</label>
            {loading ? (
              <div className="agenda-loading">{t('loading')}</div>
            ) : (
              <textarea
                id="agenda-journal-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'tr' ? 'Bir düşünceyle başla. Güzel yazmak zorunda değilsin; sadece kendin için yaz…' : 'Start with one thought. It doesn’t have to be perfect — just yours…'}
                className="agenda-journal-textarea"
              />
            )}
            <div className="agenda-journal-footer">
              <span>{language === 'tr' ? 'Bu sayfa sana ait.' : 'This page is yours.'}</span>
              <span>{notes.length} {language === 'tr' ? 'karakter' : 'characters'}</span>
            </div>
          </section>

          <section className="agenda-reflection">
            <div className="agenda-section-topline">
              <span className="agenda-section-number">02</span>
              <span>{language === 'tr' ? 'KENDİNE DÖN' : 'CHECK IN WITH YOURSELF'}</span>
            </div>
            <div className="agenda-mood-layout">
              <div>
                <h2>{language === 'tr' ? 'Bugün nasıl hissediyorsun?' : 'How are you feeling today?'}</h2>
                <p>{language === 'tr' ? 'Bir kelime bile yeter.' : 'Even one word is enough.'}</p>
              </div>
              <div className="agenda-mood-options">
                {[
                  { val: 'BAD', icon: Frown, label: language === 'tr' ? 'Zor' : 'Low' },
                  { val: 'NEUTRAL', icon: Meh, label: language === 'tr' ? 'Dengede' : 'Steady' },
                  { val: 'GOOD', icon: Smile, label: language === 'tr' ? 'İyi' : 'Good' }
                ].map((item) => (
                  <button key={item.val} type="button" onClick={() => setMood(item.val)} aria-pressed={mood === item.val} className={`agenda-mood-choice ${mood === item.val ? 'is-selected' : ''}`}>
                    <item.icon size={19} strokeWidth={1.7} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="agenda-mood-status"><span className="agenda-mood-dot" />{language === 'tr' ? 'Bugünkü ruh hâlin:' : 'Today’s mood:'} <strong>{moodLabel}</strong></div>
          </section>

          <section className="agenda-weekly-note">
            <span className="agenda-weekly-mark">“</span>
            <div>
              <p>{language === 'tr' ? 'Küçük şeyler de hayatın kendisi.' : 'The little things are still life.'}</p>
              <span>{language === 'tr' ? 'BUGÜNÜN HATIRLATMASI' : 'A NOTE TO REMEMBER'}</span>
            </div>
            <Sparkles size={19} strokeWidth={1.4} />
          </section>
        </main>

        <aside className="agenda-planning-column">
          <section className="agenda-tasks-panel">
            <div className="agenda-section-topline">
              <span className="agenda-section-number">03</span>
              <span>{language === 'tr' ? 'GÜNÜN AKIŞI' : 'THE DAY AHEAD'}</span>
            </div>
            <div className="agenda-task-heading">
              <div>
                <h2>{language === 'tr' ? 'Aklındakiler' : 'On your mind'}</h2>
                <p>{language === 'tr' ? 'Adım adım ilerle.' : 'One thing at a time.'}</p>
              </div>
              <span className="agenda-task-count">{completedCount}<i>/</i>{todos.length}</span>
            </div>
            <div className="agenda-progress-track"><span style={{ width: `${progress}%` }} /></div>
            <form className="agenda-add-task" onSubmit={(e) => { e.preventDefault(); handleAddTodo(e); }}>
              <input type="text" placeholder={language === 'tr' ? 'Bir görev ekle…' : 'Add a task…'} value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
              <button type="submit" aria-label={language === 'tr' ? 'Görev ekle' : 'Add task'}><Plus size={17} /></button>
            </form>
            <div className="agenda-task-list">
              {loading ? (
                <div className="agenda-loading">{t('loading')}</div>
              ) : todos.length === 0 ? (
                <p className="agenda-task-empty">{language === 'tr' ? 'Burada henüz bir şey yok. Aklındaki ilk şeyi ekle.' : 'Nothing here yet. Add the first thing on your mind.'}</p>
              ) : todos.map((todo, index) => (
                <div key={index} className={`agenda-task-row ${todo.completed ? 'is-complete' : ''}`}>
                  <button type="button" onClick={() => toggleTodo(index)} aria-label={todo.completed ? (language === 'tr' ? 'Tamamlanmadı olarak işaretle' : 'Mark incomplete') : (language === 'tr' ? 'Tamamlandı olarak işaretle' : 'Mark complete')}>
                    {todo.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <span>{todo.text}</span>
                  <button type="button" className="agenda-task-delete" onClick={() => deleteTodo(index)} aria-label={language === 'tr' ? 'Görevi sil' : 'Delete task'}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className="agenda-task-footnote"><CheckCircle2 size={14} />{language === 'tr' ? `${progress}% tamamlandı` : `${progress}% complete`}</div>
          </section>

          <section className="agenda-day-summary">
            <div className="agenda-section-topline">
              <span className="agenda-section-number">04</span>
              <span>{language === 'tr' ? 'GÜNÜN KAYDI' : 'DAY IN REVIEW'}</span>
            </div>
            <div className="agenda-summary-stat">
              <span>{language === 'tr' ? 'Planlanan görev' : 'Tasks planned'}</span>
              <strong>{todos.length.toString().padStart(2, '0')}</strong>
            </div>
            <div className="agenda-summary-stat">
              <span>{language === 'tr' ? 'Tamamlanan' : 'Completed'}</span>
              <strong>{completedCount.toString().padStart(2, '0')}</strong>
            </div>
            <div className="agenda-summary-stat">
              <span>{language === 'tr' ? 'Ruh hâli' : 'Mood'}</span>
              <strong className="agenda-summary-mood">{moodLabel}</strong>
            </div>
          </section>
          <p className="agenda-sidebar-signoff">{language === 'tr' ? 'Kendi hızında. Kendi yolunda.' : 'Your pace. Your path.'}<span>✳</span></p>
        </aside>
      </div>

      <footer className="agenda-save-bar">
        <span>{saving ? (language === 'tr' ? 'Kaydediliyor…' : 'Saving…') : (language === 'tr' ? 'Değişikliklerini kaydetmeyi unutma.' : 'Remember to save your changes.')}</span>
        <button type="button" onClick={handleSave} disabled={saving || loading}>
          <Save size={16} />
          {saving ? (language === 'tr' ? 'Kaydediliyor' : 'Saving') : (agendaId ? (language === 'tr' ? 'Günlüğü kaydet' : 'Save journal') : t('btnSave'))}
        </button>
      </footer>
    </div>
  );
}
