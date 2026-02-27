import { Bell, Calendar as CalendarIcon, CheckCircle2, Circle, Frown, Meh, Plus, Save, Smile, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const { isDarkMode } = useTheme();
  const { events } = useEvents(); // Takvim etkinliklerini çekiyoruz

  // Tarih değiştiğinde o güne ait verileri Backend'den yükle
  useEffect(() => {
    fetchAgendaData(currentDate);
  }, [currentDate]);

  const fetchAgendaData = async (dateStr) => {
    try {
      const response = await api.get(`/agenda/${dateStr}`);
      const data = response.data;
      setTodos(data.todos || []);
      setNotes(data.notes || '');
      setMood(data.mood || null);
      setIsSaved(false);
    } catch (error) {
      console.error("Ajanda verisi çekilirken hata oluştu:", error);
    }
  };

  // Verileri Backend'e kaydetme fonksiyonu
  const handleSave = async () => {
    try {
      const dataToSave = { date: currentDate, todos, notes, mood };
      await api.post(`/agenda/${currentDate}`, dataToSave);
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000); 
    } catch (error) {
      console.error("Ajanda kaydedilirken hata:", error);
      alert("Kaydedilirken bir hata oluştu!");
    }
  };

  // To-Do İşlemleri
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([{ id: Date.now(), text: newTodo, completed: false }, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handlePrevDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  // --- YENİ ÖZELLİK: Takvim Önerileri ---
  
  // 1. O güne ait takvim etkinliklerini buluyoruz
  const todaysEvents = events.filter(e => {
    // Takvim verisi yapısına göre 'date' veya 'start' alanı üzerinden tarihi yakalıyoruz
    const eventDate = e.date || (e.start ? new Date(e.start).toISOString().split('T')[0] : null);
    return eventDate === currentDate;
  });

  // 2. Takvimdeki etkinlik zaten To-Do listesinde var mı diye kontrol ediyoruz
  const suggestedEvents = todaysEvents.filter(e => {
    const title = e.title || e.text || 'Takvim Etkinliği';
    return !todos.some(t => t.text === title);
  });

  // 3. Önerilen etkinliği tek tıkla To-Do listesine ekleme fonksiyonu
  const addSuggestedToTodo = (title) => {
    setTodos([{ id: Date.now(), text: title, completed: false }, ...todos]);
  };

  return (
    <div className="bg-white dark:bg-twilight rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none overflow-hidden border border-cambridge/20 dark:border-starlight/30 transition-colors duration-500 flex flex-col min-h-[calc(100vh-8rem)]">
      
      {/* Üst Kısım: Başlık ve Tarih Seçici */}
      <div className="p-8 md:p-10 border-b border-columbia/10 dark:border-starlight/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Günlük Planlayıcı</h2>
          <p className="text-gray-400 dark:text-gray-400 font-medium mt-2">Bugün neler yapıyoruz?</p>
        </div>
        
        <div className="flex items-center gap-4 bg-columbia/5 dark:bg-night/50 p-2 rounded-2xl border border-columbia/10 dark:border-starlight/30">
          <button onClick={handlePrevDay} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-columbia/10 dark:hover:bg-starlight/30 text-gray-500 dark:text-gray-400 transition-all font-bold">&lt;</button>
          <div className="flex items-center gap-3 px-4">
            <CalendarIcon size={18} className="text-cambridge dark:text-columbia" />
            <input 
              type="date" 
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-black text-gray-700 dark:text-gray-200 cursor-pointer uppercase tracking-widest"
            />
          </div>
          <button onClick={handleNextDay} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-columbia/10 dark:hover:bg-starlight/30 text-gray-500 dark:text-gray-400 transition-all font-bold">&gt;</button>
        </div>
      </div>

      {/* Ana İçerik Grid Alanı */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* SOL SÜTUN: To-Do Listesi ve Mod */}
        <div className="lg:col-span-5 border-r border-columbia/10 dark:border-starlight/30 p-8 flex flex-col gap-8 bg-columbia/5 dark:bg-transparent">
          
          {/* To-Do Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Yapılacaklar</h3>
              <span className="text-xs font-bold text-columbia bg-columbia/10 px-3 py-1 rounded-full">
                {todos.filter(t => t.completed).length} / {todos.length}
              </span>
            </div>

            {/* TAKVİM ÖNERİ KARTI */}
            {suggestedEvents.length > 0 && (
              <div className="mb-4 space-y-2 animate-fade-in">
                {suggestedEvents.map((evt, idx) => {
                  const title = evt.title || evt.text || 'Takvim Etkinliği';
                  return (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-cambridge/10 dark:bg-cambridge/20 border border-cambridge/20 dark:border-cambridge/30 rounded-2xl transition-all">
                      <div className="flex items-center gap-3">
                        <Bell size={16} className="text-cambridge dark:text-cambridge animate-pulse" />
                        <div>
                          <p className="text-[10px] font-black text-cambridge/70 uppercase tracking-widest">Takviminde Var</p>
                          <p className="text-xs font-bold text-cambridge dark:text-white mt-0.5">{title}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => addSuggestedToTodo(title)} 
                        className="px-4 py-2 bg-cambridge text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-cambridge/90 active:scale-95 transition-all shadow-sm shadow-cambridge/30"
                      >
                        Listeye Ekle
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <form onSubmit={handleAddTodo} className="relative mb-6">
              <input 
                type="text" 
                placeholder="Yeni bir görev ekle..." 
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="w-full pl-5 pr-14 py-4 bg-white dark:bg-night/50 border border-columbia/20 dark:border-starlight/30 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:border-columbia dark:focus:border-columbia transition-all shadow-sm dark:shadow-none placeholder:text-gray-400"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 w-10 bg-columbia hover:bg-columbia/80 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-columbia/20">
                <Plus size={18} strokeWidth={3} />
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar max-h-[400px]">
              {todos.length === 0 ? (
                <div className="text-center py-10 text-gray-400 dark:text-gray-600 font-medium italic text-sm">
                  Henüz bir görev eklenmedi.
                </div>
              ) : (
                todos.map(todo => (
                  <div key={todo.id} className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${todo.completed ? 'bg-columbia/5 border-columbia/10 dark:bg-columbia/5 dark:border-columbia/10 opacity-70' : 'bg-white dark:bg-night/40 border-columbia/20 dark:border-starlight/30 shadow-sm dark:shadow-none hover:border-columbia/40'}`} onClick={() => toggleTodo(todo.id)}>
                    <button className={`shrink-0 transition-colors ${todo.completed ? 'text-columbia' : 'text-gray-300 dark:text-gray-600 group-hover:text-columbia'}`}>
                      {todo.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                    <span className={`flex-1 text-sm font-bold transition-all ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                      {todo.text}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }}
                      className="text-gray-300 dark:text-gray-600 hover:text-cherry dark:hover:text-cherry transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mod Section */}
          <div className="mt-auto pt-6 border-t border-columbia/10 dark:border-starlight/30">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 text-center">Günün Modu</h3>
            <div className="flex justify-center gap-4">
              <button onClick={() => setMood('good')} className={`p-4 rounded-2xl transition-all ${mood === 'good' ? 'bg-cambridge/20 text-cambridge border-cambridge/30' : 'bg-white dark:bg-night/40 text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-starlight/20'} border`}>
                <Smile size={28} strokeWidth={2.5} />
              </button>
              <button onClick={() => setMood('neutral')} className={`p-4 rounded-2xl transition-all ${mood === 'neutral' ? 'bg-peach/20 text-peach border-peach/30' : 'bg-white dark:bg-night/40 text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-starlight/20'} border`}>
                <Meh size={28} strokeWidth={2.5} />
              </button>
              <button onClick={() => setMood('bad')} className={`p-4 rounded-2xl transition-all ${mood === 'bad' ? 'bg-cherry/20 text-cherry border-cherry/30' : 'bg-white dark:bg-night/40 text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-starlight/20'} border`}>
                <Frown size={28} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* SAĞ SÜTUN: Günlük / Notlar */}
        <div className="lg:col-span-7 p-8 flex flex-col h-full relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Çalışma Notları & Günlük</h3>
            
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all shadow-md active:scale-95 ${isSaved ? 'bg-cambridge text-white shadow-cambridge/20' : 'bg-columbia text-white shadow-columbia/20 hover:bg-columbia/90'}`}
            >
              <Save size={16} strokeWidth={2.5} />
              {isSaved ? 'Kaydedildi!' : 'Kaydet'}
            </button>
          </div>

          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bugün neler öğrendin? Neler yaptın? Buraya yazabilirsin..."
            className="flex-1 w-full bg-columbia/5 dark:bg-night/40 border border-columbia/10 dark:border-starlight/30 rounded-[2rem] p-8 text-sm font-medium text-gray-700 dark:text-gray-200 resize-none outline-none focus:border-columbia/30 dark:focus:border-starlight/50 transition-all leading-relaxed placeholder:text-gray-400"
          />
        </div>
        
      </div>
    </div>
  );
}