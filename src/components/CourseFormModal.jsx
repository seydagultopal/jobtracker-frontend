import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function CourseFormModal({ show, onClose, onSubmit, initialData }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    progress: 0,
    status: 'IN_PROGRESS'
  });

  // Modal her açıldığında veya initialData değiştiğinde formu güncelle
  useEffect(() => {
    if (show) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({ title: '', platform: '', progress: 0, status: 'IN_PROGRESS' });
      }
    }
  }, [show, initialData]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { ...formData };
    
    // Eğer kurs tamamlandıysa ilerleme yüzdesini otomatik 100 yap
    if (submissionData.status === 'COMPLETED') {
      submissionData.progress = 100;
    }
    
    onSubmit(submissionData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-all duration-500 overflow-y-auto">
      <div className="bg-white dark:bg-twilight rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-starlight/20 my-auto">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-starlight/20 flex justify-between items-center bg-gray-50/50 dark:bg-night/30">
          <h3 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">{initialData ? 'Eğitimi Düzenle' : t('modalAddCourse')}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-cherry bg-white dark:bg-twilight hover:bg-cherry/10 rounded-xl transition-all shadow-sm">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('formCourseName')} *</label>
              <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 outline-none focus:border-peach focus:ring-2 focus:ring-peach/20 transition-all font-medium text-sm" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('formCoursePlatform')}</label>
              <input type="text" value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value})} className="w-full bg-gray-50 dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 outline-none focus:border-peach focus:ring-2 focus:ring-peach/20 transition-all font-medium text-sm" />
            </div>

            <div className={`grid ${formData.status === 'COMPLETED' ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
              {/* Tamamlandıysa progress inputunu gizle */}
              {formData.status !== 'COMPLETED' && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('formCourseProgress')}</label>
                  <input type="number" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({...formData, progress: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 outline-none focus:border-peach focus:ring-2 focus:ring-peach/20 transition-all font-medium text-sm" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('formCourseStatus')}</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 outline-none focus:border-peach focus:ring-2 focus:ring-peach/20 transition-all font-medium text-sm">
                  <option value="IN_PROGRESS">{t('statusInProgress')}</option>
                  <option value="COMPLETED">{t('statusCompleted')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-starlight/20">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 px-4 bg-gray-100 dark:bg-night text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-night/80 transition-all text-sm uppercase tracking-wider">{t('btnCancel')}</button>
            <button type="submit" className="flex-1 py-3.5 px-4 bg-peach text-gray-900 font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-peach/20 text-sm uppercase tracking-wider">{t('btnSave')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}