import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CalendarClock, RotateCcw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function AccountReactivation() {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/api/users/me/deletion-status')
      .then(({ data }) => {
        if (!active) return;
        if (!data.deletionPending) navigate('/dashboard', { replace: true });
        else setStatus(data);
      })
      .catch(() => {
        if (active) setError(isTr ? 'Hesap durumu alınamadı. Yeniden giriş yapmayı dene.' : 'Could not load account status. Please sign in again.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [navigate, isTr]);

  const reactivate = async () => {
    const confirmed = window.confirm(isTr
      ? 'Hesabını yeniden etkinleştirip silme talebini iptal etmek istediğine emin misin?'
      : 'Are you sure you want to reactivate your account and cancel its deletion?');
    if (!confirmed) return;
    setWorking(true);
    setError('');
    try {
      await api.post('/api/users/me/reactivate');
      navigate('/dashboard', { replace: true });
    } catch {
      setError(isTr ? 'Hesap yeniden etkinleştirilemedi. Lütfen tekrar dene.' : 'Could not reactivate your account. Please try again.');
    } finally {
      setWorking(false);
    }
  };

  const signOut = async () => {
    setWorking(true);
    try { await api.post('/api/auth/logout'); } catch { /* The cookie may already be expired. */ }
    window.location.assign('/login');
  };

  const date = status?.deletionScheduledAt ? new Date(status.deletionScheduledAt).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <main className="min-h-screen bg-alabaster dark:bg-night flex items-center justify-center p-5">
      <section className="w-full max-w-xl rounded-[2rem] border border-orange-200/70 dark:border-orange-900/50 bg-white/90 dark:bg-twilight p-7 md:p-10 shadow-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"><AlertTriangle size={27} /></div>
        <p className="text-center text-xs font-black tracking-[.2em] text-orange-700 dark:text-orange-300">PEBBLE · {isTr ? 'HESAP DURUMU' : 'ACCOUNT STATUS'}</p>
        <h1 className="mt-3 text-center text-3xl font-black text-gray-900 dark:text-white">{isTr ? 'Hesabın silinmek üzere' : 'Your account is scheduled for deletion'}</h1>
        {loading ? <p className="mt-6 text-center text-gray-500">{isTr ? 'Hesap durumu kontrol ediliyor…' : 'Checking account status…'}</p> : (
          <>
            <p className="mt-4 text-center leading-7 text-gray-600 dark:text-gray-300">{isTr
              ? 'Hesabın henüz kalıcı olarak silinmedi. Bekleme süresi içinde yeniden etkinleştirebilir ve silme talebini iptal edebilirsin.'
              : 'Your account has not been permanently deleted yet. You can reactivate it and cancel the deletion request during the grace period.'}</p>
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-orange-50 p-4 text-orange-950 dark:bg-orange-950/40 dark:text-orange-100">
              <CalendarClock className="mt-1 shrink-0" size={20} />
              <div><strong>{isTr ? 'Planlanan kalıcı silme tarihi' : 'Scheduled permanent deletion'}</strong><p className="mt-1 text-sm">{date || (isTr ? 'Tarih bilgisi yüklenemedi' : 'Date unavailable')}</p></div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
              <ShieldCheck className="mt-1 shrink-0" size={20} />
              <p className="text-sm leading-6">{isTr ? 'Silme talebini iptal edersen profilin ve kayıtların tekrar erişilebilir olacak.' : 'If you cancel the deletion request, your profile and saved records will become accessible again.'}</p>
            </div>
            {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
            <button disabled={working || loading} onClick={reactivate} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-4 font-bold text-white transition hover:bg-orange-700 disabled:opacity-60"><RotateCcw size={18} />{working ? '…' : (isTr ? 'Hesabımı yeniden etkinleştir' : 'Reactivate my account')}</button>
            <button disabled={working} onClick={signOut} className="mt-3 w-full rounded-2xl px-5 py-3 text-sm font-bold text-gray-500 transition hover:bg-gray-100 dark:hover:bg-white/5">{isTr ? 'Hayır, silme talebim devam etsin · Çıkış yap' : 'No, keep deletion scheduled · Sign out'}</button>
          </>
        )}
        {error && loading === false && !status && <button onClick={() => window.location.assign('/login')} className="mt-5 w-full rounded-xl bg-gray-900 px-4 py-3 font-bold text-white">{isTr ? 'Girişe dön' : 'Return to sign in'}</button>}
      </section>
    </main>
  );
}
