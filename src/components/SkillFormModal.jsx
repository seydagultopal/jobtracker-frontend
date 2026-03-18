import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SkillFormModal({ show, onClose, onSubmit, initialData }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    level: 50
  });

  useEffect(() => {
    if (show) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({ name: '', level: 50 });
      }
    }
  }, [show, initialData]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-all duration-500 overflow-y-auto">
      <div className="bg-white dark:bg-twilight rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-starlight/20 my-auto">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-starlight/20 flex justify-between items-center bg-gray-50/50 dark:bg-night/30">
          <h3 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">{initialData ? 'Yeteneği Düzenle' : t('modalAddSkill')}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-cherry bg-white dark:bg-twilight hover:bg-cherry/10 rounded-xl transition-all shadow-sm">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('formSkillName')} *</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 outline-none focus:border-columbia focus:ring-2 focus:ring-columbia/20 transition-all font-medium text-sm" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('formSkillLevel')}</label>
                <span className="text-xs font-black text-columbia">%{formData.level}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={formData.level} 
                onChange={(e) => setFormData({...formData, level: Number(e.target.value)})} 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-starlight/30 accent-columbia" 
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-starlight/20">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 px-4 bg-gray-100 dark:bg-night text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-night/80 transition-all text-sm uppercase tracking-wider">{t('btnCancel')}</button>
            <button type="submit" className="flex-1 py-3.5 px-4 bg-columbia text-gray-900 font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-columbia/20 text-sm uppercase tracking-wider">{t('btnSave')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}