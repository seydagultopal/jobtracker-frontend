import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function StatusUpdateModal({ show, onClose, onConfirm, newStatus }) {
  const [note, setNote] = useState('');
  const { t } = useLanguage();

  if (!show) return null;

  const getStatusLabel = (status) => {
    const labels = {
      'APPLIED': t('statusApplied'),
      'ASSESSMENT': t('statusAssessment'),
      'VIDEO_INTERVIEW': t('statusVideo'),
      'INTERVIEW': t('statusInterview'),
      'OFFER': t('statusOffer'),
      'REJECTED': t('statusRejected')
    };
    return labels[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-columbia/20 dark:bg-night/70 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="bg-white dark:bg-twilight p-10 rounded-[2.5rem] shadow-2xl dark:shadow-none w-full max-w-lg border border-white/50 dark:border-starlight/50">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 bg-columbia/10 dark:bg-columbia/20 text-columbia text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
            {t('statusUpdating')}
          </span>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
            {t('newStatusLabel')} <span className="text-cherry">{getStatusLabel(newStatus)}</span>
          </h3>
          <p className="text-gray-400 dark:text-gray-400 font-medium mt-2">{t('statusNotePrompt')}</p>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('statusNotePlaceholder')}
          className="w-full p-5 bg-alabaster/50 dark:bg-night border-2 border-transparent rounded-[1.5rem] focus:border-cherry/20 dark:focus:border-cherry/50 focus:bg-white dark:focus:bg-twilight outline-none transition-all text-sm text-gray-700 dark:text-gray-200 min-h-[150px] mb-6"
        />

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onConfirm(note)}
            className="w-full py-4 bg-cherry text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cherry/20 dark:shadow-none uppercase tracking-widest text-xs"
          >
            {t('btnUpdateAndNote')}
          </button>
          <button
            onClick={() => onConfirm(null)}
            className="w-full py-4 bg-gray-50 dark:bg-night text-gray-400 dark:text-gray-500 font-black rounded-2xl hover:text-gray-600 dark:hover:text-gray-300 transition-all uppercase tracking-widest text-[10px]"
          >
            {t('btnContinueWithoutNote')}
          </button>
        </div>
      </div>
    </div>
  );
}