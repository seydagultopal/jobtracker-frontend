import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ApplicationFormModal({ show, onClose, onSubmit }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    applicationType: 'JOB',
    workMode: 'REMOTE',
    location: '',
    platform: 'LinkedIn',
    otherPlatformUrl: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'APPLIED',
    salary: 'Bilinmiyor',
    description: '',
    applicationQuestions: '',
    notes: '[]'
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPlatform = formData.platform === 'Diğer' ? formData.otherPlatformUrl : formData.platform;
    onSubmit({ ...formData, platform: finalPlatform });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-columbia/20 dark:bg-night/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-500 ease-out">
      <div className="bg-white dark:bg-twilight p-10 rounded-[2.5rem] shadow-2xl dark:shadow-none w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/50 dark:border-starlight/50">
        
        <div className="flex justify-between items-center mb-6 shrink-0 border-b border-columbia/10 dark:border-starlight/30 pb-6">
          <h3 className="text-2xl font-black text-cherry tracking-tight uppercase">{t('newAppTitle')}</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-alabaster dark:bg-night rounded-full text-gray-400 dark:text-gray-500 hover:text-cherry transition-all text-2xl font-bold">×</button>
        </div>
        
        <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
            <div>
              <label className="block mb-1.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">{t('formCompany')}</label>
              <input type="text" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 dark:bg-night border-2 border-transparent rounded-2xl focus:border-columbia/30 dark:focus:border-starlight focus:bg-white dark:focus:bg-twilight outline-none transition-all text-gray-700 dark:text-gray-200 font-bold" />
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">{t('formPosition')}</label>
              <input type="text" required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 dark:bg-night border-2 border-transparent rounded-2xl focus:border-columbia/30 dark:focus:border-starlight focus:bg-white dark:focus:bg-twilight outline-none transition-all text-gray-700 dark:text-gray-200 font-bold" />
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">{t('formCategory')}</label>
              <select 
                value={formData.applicationType} 
                onChange={e => {
                  const newType = e.target.value;
                  let newSalary = formData.salary;
                  if (newType !== 'INTERNSHIP' && newSalary === 'Gönüllü') newSalary = 'Bilinmiyor';
                  setFormData({...formData, applicationType: newType, salary: newSalary});
                }}
                className="w-full px-5 py-4 bg-alabaster/50 dark:bg-night border-2 border-transparent rounded-2xl focus:border-columbia/30 dark:focus:border-starlight focus:bg-white dark:focus:bg-twilight outline-none transition-all text-gray-700 dark:text-gray-200 font-bold"
              >
                <option className="bg-white dark:bg-twilight" value="JOB">{t('catJob')}</option>
                <option className="bg-white dark:bg-twilight" value="INTERNSHIP">{t('catInternship')}</option>
                <option className="bg-white dark:bg-twilight" value="BOOTCAMP">{t('catBootcamp')}</option>
                <option className="bg-white dark:bg-twilight" value="WEBINAR">{t('catWebinar')}</option>
                <option className="bg-white dark:bg-twilight" value="OTHER">{t('catOther')}</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">{t('formPlatform')}</label>
              <div className="space-y-3">
                <select 
                  value={['LinkedIn', 'Kariyer.net', 'Indeed', 'Şirket Sitesi'].includes(formData.platform) ? formData.platform : 'Diğer'} 
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                  className="w-full px-5 py-4 bg-alabaster/50 dark:bg-night border-2 border-transparent rounded-2xl focus:border-columbia/30 dark:focus:border-starlight focus:bg-white dark:focus:bg-twilight outline-none transition-all text-gray-700 dark:text-gray-200 font-bold"
                >
                  <option className="bg-white dark:bg-twilight" value="LinkedIn">LinkedIn</option>
                  <option className="bg-white dark:bg-twilight" value="Kariyer.net">Kariyer.net</option>
                  <option className="bg-white dark:bg-twilight" value="Indeed">Indeed</option>
                  <option className="bg-white dark:bg-twilight" value="Şirket Sitesi">{t('platCompanySite')}</option>
                  <option className="bg-white dark:bg-twilight" value="Diğer">{t('platOther')}</option>
                </select>
                {(formData.platform === 'Diğer' || !['LinkedIn', 'Kariyer.net', 'Indeed', 'Şirket Sitesi'].includes(formData.platform)) && (
                  <input 
                    type="text" required placeholder={t('platPlaceholder')}
                    value={formData.otherPlatformUrl} onChange={e => setFormData({...formData, otherPlatformUrl: e.target.value})}
                    className="w-full px-5 py-3 bg-cherry/5 dark:bg-cherry/10 border border-cherry/20 dark:border-cherry/30 rounded-xl focus:border-cherry/40 outline-none text-sm dark:text-gray-200" 
                  />
                )}
              </div>
            </div>

            {(formData.applicationType === 'JOB' || formData.applicationType === 'INTERNSHIP') && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-peach/5 dark:bg-peach/10 p-6 rounded-[2rem] border border-peach/10 dark:border-peach/20 animate-fade-in">
                <div>
                  <label className="block mb-1.5 text-[10px] font-black text-peach tracking-[0.2em] uppercase px-1">{t('formSalaryStatus')}</label>
                  <select 
                    value={['Bilinmiyor', 'Gönüllü'].includes(formData.salary) ? formData.salary : 'SPECIFIC'}
                    onChange={e => setFormData({...formData, salary: e.target.value === 'SPECIFIC' ? '' : e.target.value})}
                    className="w-full px-5 py-4 bg-white dark:bg-night border-2 border-transparent rounded-2xl focus:border-peach/30 dark:focus:border-peach/50 outline-none transition-all text-gray-700 dark:text-gray-200 font-bold"
                  >
                    <option className="bg-white dark:bg-twilight" value="Bilinmiyor">{t('salUnknown')}</option>
                    {formData.applicationType === 'INTERNSHIP' && <option className="bg-white dark:bg-twilight" value="Gönüllü">{t('salVolunteer')}</option>}
                    <option className="bg-white dark:bg-twilight" value="SPECIFIC">{t('salSpecific')}</option>
                  </select>
                </div>
                {!['Bilinmiyor', 'Gönüllü'].includes(formData.salary) && (
                  <div className="animate-fade-in">
                    <label className="block mb-1.5 text-[10px] font-black text-peach tracking-[0.2em] uppercase px-1">{t('formAmount')}</label>
                    <input 
                      type="text" placeholder={t('salPlaceholder')}
                      value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})}
                      className="w-full px-5 py-4 bg-white dark:bg-night border-2 border-transparent rounded-2xl focus:border-peach/30 dark:focus:border-peach/50 outline-none transition-all text-gray-700 dark:text-gray-200 font-bold" 
                    />
                  </div>
                )}
              </div>
            )}

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block mb-1.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">{t('formWorkMode')}</label>
                <select value={formData.workMode} onChange={e => setFormData({...formData, workMode: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 dark:bg-night border-2 border-transparent rounded-2xl focus:border-columbia/30 dark:focus:border-starlight focus:bg-white dark:focus:bg-twilight outline-none transition-all text-gray-700 dark:text-gray-200 font-bold">
                  <option className="bg-white dark:bg-twilight" value="REMOTE">{t('modeRemote')}</option>
                  <option className="bg-white dark:bg-twilight" value="HYBRID">{t('modeHybrid')}</option>
                  <option className="bg-white dark:bg-twilight" value="ONSITE">{t('modeOnsite')}</option>
                </select>
              </div>
              <div>
                <label className="block mb-1.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">{t('formLocation')}</label>
                <input type="text" placeholder={t('locPlaceholder')} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 dark:bg-night border-2 border-transparent rounded-2xl focus:border-columbia/30 dark:focus:border-starlight outline-none transition-all text-gray-700 dark:text-gray-200 font-bold" />
              </div>
              <div>
                <label className="block mb-1.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">{t('formDate')}</label>
                <input type="date" value={formData.applicationDate} onChange={e => setFormData({...formData, applicationDate: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 dark:bg-night border-2 border-transparent rounded-2xl focus:border-columbia/30 dark:focus:border-starlight outline-none transition-all text-gray-700 dark:text-gray-200 font-bold [color-scheme:light] dark:[color-scheme:dark]" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1.5 text-[10px] font-black text-cherry/60 uppercase tracking-[0.2em] px-1">{t('formQuestions')}</label>
              <textarea rows="3" value={formData.applicationQuestions} onChange={e => setFormData({...formData, applicationQuestions: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 dark:bg-night border-2 border-transparent rounded-3xl focus:border-cherry/30 dark:focus:border-cherry/50 focus:bg-white dark:focus:bg-twilight outline-none transition-all text-gray-700 dark:text-gray-200 text-sm" placeholder={t('questionsPlaceholder')} />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">{t('formDescription')}</label>
              <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 dark:bg-night border-2 border-transparent rounded-3xl focus:border-columbia/30 dark:focus:border-starlight focus:bg-white dark:focus:bg-twilight outline-none transition-all text-gray-700 dark:text-gray-200 text-sm" placeholder={t('descPlaceholder')} />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button type="button" onClick={onClose} className="px-8 py-4 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-300 transition-all">{t('btnCancel')}</button>
              <button type="submit" className="px-12 py-4 bg-cherry text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cherry/20 dark:shadow-none uppercase tracking-widest text-xs">{t('btnSave')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}