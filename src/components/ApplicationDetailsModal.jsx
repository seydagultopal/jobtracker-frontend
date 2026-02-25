import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function ApplicationDetailsModal({ app, onClose, onUpdate }) {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  if (!app) return null;

  const parseNotes = () => {
    try {
      return app.notes && app.notes !== "[]" ? JSON.parse(app.notes) : [];
    } catch (e) {
      return app.notes ? [{ date: t('oldNote'), text: app.notes }] : [];
    }
  };

  const notesList = parseNotes();
  const isPaidCategory = app.applicationType === 'JOB' || app.applicationType === 'INTERNSHIP';

  const displayPlatform = app.platform === 'Şirket Sitesi' ? t('platCompanySite') : (app.platform === 'Diğer' ? t('platOther') : app.platform);
  const displaySalary = app.salary === 'Bilinmiyor' ? t('salUnknown') : (app.salary === 'Gönüllü' ? t('salVolunteer') : app.salary);
  const displayMode = app.workMode === 'ONSITE' ? t('modeOnsite') : (app.workMode === 'HYBRID' ? t('modeHybrid') : (app.workMode === 'REMOTE' ? t('modeRemote') : app.workMode));

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsSubmitting(true);
    const updatedNotes = [{ date: new Date().toLocaleString('tr-TR'), text: newNote }, ...notesList];
    try {
      await api.put(`/applications/${app.id}`, { ...app, notes: JSON.stringify(updatedNotes) });
      setNewNote('');
      onUpdate();
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-columbia/20 dark:bg-night/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in transition-all duration-500">
      <div className="bg-white dark:bg-twilight p-10 rounded-[2.5rem] shadow-2xl dark:shadow-none w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-white/50 dark:border-starlight/50">
        
        <div className="flex justify-between items-start mb-8 shrink-0 border-b border-columbia/10 dark:border-starlight/30 pb-6">
          <div>
            <h2 className="text-4xl font-black text-cherry tracking-tighter">{app.companyName}</h2>
            <p className="text-xl text-gray-400 dark:text-gray-400 font-bold tracking-tight">{app.position}</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-alabaster dark:bg-night rounded-full text-gray-300 dark:text-gray-500 hover:text-cherry dark:hover:text-cherry transition-all text-2xl font-bold">×</button>
        </div>

        <div className="overflow-y-auto pr-2 custom-scrollbar space-y-8 flex-grow">
          
          <div className={`grid ${isPaidCategory ? 'grid-cols-4' : 'grid-cols-3'} gap-3`}>
            <div className="bg-columbia/5 dark:bg-columbia/10 p-4 rounded-3xl border border-columbia/10 dark:border-columbia/20 text-center">
              <span className="block text-[9px] font-black text-columbia tracking-[0.2em] uppercase mb-1">{t('detailPlatform')}</span>
              <span className="text-gray-700 dark:text-gray-200 font-bold text-xs truncate block px-1">{displayPlatform || t('detailUnspecified')}</span>
            </div>
            
            {isPaidCategory && (
              <div className="bg-peach/10 dark:bg-peach/10 p-4 rounded-3xl border border-peach/20 dark:border-peach/20 text-center animate-fade-in">
                <span className="block text-[9px] font-black text-peach tracking-[0.2em] uppercase mb-1">{t('detailSalary')}</span>
                <span className="text-gray-700 dark:text-gray-200 font-bold text-xs block">{displaySalary}</span>
              </div>
            )}

            <div className="bg-cambridge/10 dark:bg-cambridge/10 p-4 rounded-3xl border border-cambridge/20 dark:border-cambridge/20 text-center">
              <span className="block text-[9px] font-black text-cambridge tracking-[0.2em] uppercase mb-1">{t('detailMode')}</span>
              <span className="text-gray-700 dark:text-gray-200 font-bold text-xs block">{displayMode}</span>
            </div>

            <div className="bg-alabaster/40 dark:bg-night/50 p-4 rounded-3xl border border-columbia/10 dark:border-starlight/30 text-center">
              <span className="block text-[9px] font-black text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase mb-1">{t('detailLocation')}</span>
              <span className="text-gray-700 dark:text-gray-200 font-bold text-xs truncate block px-1">{app.location || t('detailNotSpecified')}</span>
            </div>
          </div>

          {app.applicationQuestions && (
            <div className="animate-fade-in">
              <h4 className="text-[10px] font-black text-cherry/60 tracking-[0.2em] uppercase mb-3 px-2">{t('detailQuestions')}</h4>
              <div className="bg-cherry/5 dark:bg-cherry/10 p-6 rounded-[2rem] text-gray-600 dark:text-gray-300 text-sm leading-relaxed border border-cherry/10 dark:border-cherry/20 italic">
                {app.applicationQuestions}
              </div>
            </div>
          )}

          {app.description && (
            <div>
              <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase mb-3 px-2">{t('detailDescription')}</h4>
              <div className="bg-alabaster/40 dark:bg-night/50 p-6 rounded-[2rem] text-gray-500 dark:text-gray-300 text-sm leading-relaxed border border-columbia/10 dark:border-starlight/30 whitespace-pre-wrap">
                {app.description}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-[10px] font-black text-cherry tracking-[0.2em] uppercase mb-4 px-2">{t('detailJournal')}</h4>
            <div className="space-y-4 mb-6 px-1">
              <textarea 
                value={newNote} onChange={(e) => setNewNote(e.target.value)}
                placeholder={t('journalPlaceholder')}
                className="w-full p-5 bg-white dark:bg-night border-2 border-alabaster dark:border-starlight/30 rounded-[1.5rem] focus:border-cherry/20 dark:focus:border-cherry/50 outline-none transition-all text-sm text-gray-700 dark:text-gray-200 min-h-[120px] shadow-sm dark:shadow-none"
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleAddNote} disabled={isSubmitting}
                  className="px-8 py-3 bg-cherry text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 shadow-lg shadow-cherry/20 dark:shadow-none transition-all disabled:opacity-50"
                >
                  {isSubmitting ? t('btnUpdating') : t('btnAddJournal')}
                </button>
              </div>
            </div>

            <div className="space-y-5 px-2">
              {notesList.length === 0 ? (
                <p className="text-center text-gray-300 dark:text-gray-600 py-6 text-sm italic">{t('emptyJournal')}</p>
              ) : (
                notesList.map((note, idx) => (
                  <div key={idx} className="relative pl-8 border-l-2 border-alabaster dark:border-starlight/30 group pb-2">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-alabaster dark:bg-starlight/50 rounded-full group-hover:bg-cherry dark:group-hover:bg-cherry transition-all duration-300 shadow-sm dark:shadow-none" />
                    <span className="text-[9px] font-black text-gray-300 dark:text-gray-500 uppercase tracking-widest">{note.date}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed font-medium">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}