import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function AccountDeletionPanel() {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [confirmation, setConfirmation] = useState('');
  const [working, setWorking] = useState(false);
  const expected = isTr ? 'SİL' : 'DELETE';

  const close = () => { setStep(0); setConfirmation(''); };

  const submit = async () => {
    if (confirmation.trim() !== expected) return;
    setWorking(true);
    try {
      await api.delete('/api/users/me/deletion');
      navigate('/login?accountDeletionScheduled=true', { replace: true });
    } catch {
      window.alert(isTr ? 'Hesap silme talebi oluşturulamadı. Lütfen tekrar dene.' : 'Could not schedule account deletion. Please try again.');
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <section className="profile-security-block border border-red-200/80 dark:border-red-900/60">
        <div className="profile-security-heading">
          <span className="profile-card-icon bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"><AlertTriangle size={18} /></span>
          <div><h3 className="text-red-800 dark:text-red-300">{isTr ? 'Hesabı sil' : 'Delete account'}</h3><p>{isTr ? 'Hesabını kapatmak istersen 30 günlük bekleme süreci başlatabilirsin.' : 'Start a 30-day grace period if you want to close your account.'}</p></div>
        </div>
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{isTr ? 'Hesabın hemen silinmez. Süre içinde giriş yapıp silme talebini iptal edebilirsin. Süre sonunda hesabın ve ilişkili verilerin kalıcı olarak silinir.' : 'Your account will not be deleted immediately. You can sign in and cancel the request during the grace period. After that, your account and associated data will be permanently deleted.'}</p>
        <button type="button" onClick={() => setStep(1)} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-3 text-sm font-black text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"><Trash2 size={16} />{isTr ? 'Hesabı silme sürecini başlat' : 'Start account deletion'}</button>
      </section>

      {step > 0 && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
          <div className="w-full max-w-xl rounded-[2rem] border border-orange-200 bg-white p-6 shadow-2xl dark:border-orange-900 dark:bg-twilight md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-black tracking-[.18em] text-red-700 dark:text-red-300">{isTr ? 'HESAP KAPATMA · ADIM' : 'ACCOUNT CLOSURE · STEP'} {step}/3</p><h2 id="delete-account-title" className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{isTr ? 'Hesabını silme talebi' : 'Request account deletion'}</h2></div>
              <button type="button" onClick={close} aria-label={isTr ? 'Kapat' : 'Close'} className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"><X size={20} /></button>
            </div>
            {step === 1 && <div className="mt-6 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300"><p>{isTr ? 'Hesabın hemen silinmeyecek. 30 günlük bekleme süresi başlayacak ve bu süre boyunca hesabına normal şekilde erişemeyeceksin.' : 'Your account will not be deleted immediately. A 30-day grace period will begin, and you will not be able to use your account normally during this period.'}</p><p>{isTr ? 'Bu sürede yeniden giriş yaparsan, silme talebini iptal etmek isteyip istemediğin ayrıca sorulacak.' : 'If you sign in during this period, you will be asked whether you want to cancel the deletion request.'}</p><p className="font-bold text-red-700 dark:text-red-300">{isTr ? 'Süre bittikten sonra profilin, başvuruların, ajandan ve gelişim kayıtların kalıcı olarak silinir.' : 'After the grace period, your profile, applications, agenda and development records will be permanently deleted.'}</p></div>}
            {step === 2 && <div className="mt-6 rounded-2xl bg-orange-50 p-5 text-sm leading-6 text-orange-950 dark:bg-orange-950/40 dark:text-orange-100"><h3 className="font-black">{isTr ? 'Neler olacak?' : 'What will happen?'}</h3><ul className="mt-3 list-disc space-y-2 pl-5"><li>{isTr ? 'Hesabın ve kişisel profilin kullanıma kapatılacak.' : 'Your account and personal profile will be inaccessible.'}</li><li>{isTr ? '30 gün boyunca verilerin bekletilecek; bu süre içinde hesabını yeniden etkinleştirebilirsin.' : 'Your data will be retained for 30 days, during which you can reactivate your account.'}</li><li>{isTr ? 'Süre dolunca ilişkili kayıtlar otomatik olarak kalıcı biçimde silinecek.' : 'When the period ends, associated records will be permanently removed automatically.'}</li></ul></div>}
            {step === 3 && <div className="mt-6"><p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{isTr ? 'Son onay için aşağıya SİL yaz.' : 'Type DELETE below to confirm.'}</p><input autoFocus value={confirmation} onChange={e => setConfirmation(e.target.value)} className="mt-4 w-full rounded-xl border border-red-200 bg-white px-4 py-3 font-bold text-gray-900 outline-none focus:border-red-500 dark:border-red-900 dark:bg-night dark:text-white" placeholder={isTr ? 'SİL yaz' : 'Type DELETE'} /></div>}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={close} className="rounded-xl px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">{isTr ? 'Vazgeç' : 'Cancel'}</button><button type="button" disabled={working || (step === 3 && confirmation.trim() !== expected)} onClick={() => step < 3 ? setStep(value => value + 1) : submit()} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40">{working ? '…' : step < 3 ? (isTr ? 'Devam et' : 'Continue') : (isTr ? '30 günlük silme sürecini başlat' : 'Start 30-day deletion period')}</button></div>
          </div>
        </div>
      )}
    </>
  );
}
