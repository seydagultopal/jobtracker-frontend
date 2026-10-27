import { ArrowRight, BriefcaseBusiness, Check, Compass, MapPin, Sparkles, Target, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const GOALS = {
  tr: [
    ['first-job', 'İlk işimi bulmak'],
    ['better-role', 'Daha iyi bir role geçmek'],
    ['career-change', 'Kariyerimi değiştirmek'],
    ['internship', 'Staj bulmak'],
    ['organize', 'Kariyerimi daha iyi organize etmek'],
  ],
  en: [
    ['first-job', 'Find my first job'],
    ['better-role', 'Move into a better role'],
    ['career-change', 'Change my career path'],
    ['internship', 'Find an internship'],
    ['organize', 'Organize my career journey'],
  ],
};

const ROLE_SUGGESTIONS = [
  'Software Developer', 'Backend Developer', 'Frontend Developer',
  'Full Stack Developer', 'Android Developer', 'Data Analyst',
  'Product Designer', 'Product Manager', 'Other',
];

export default function Onboarding() {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const navigate = useNavigate();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', targetRole: '', location: '', careerGoal: '',
  });

  useEffect(() => {
    let active = true;
    api.get('/api/users/me')
      .then(({ data }) => {
        if (!active) return;
        if (data.onboardingCompleted) {
          navigate('/dashboard', { replace: true });
          return;
        }
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          targetRole: data.title || '',
          location: data.location || '',
          careerGoal: data.careerGoal || '',
        });
      })
      .catch(() => {
        if (active) setError(isTr ? 'Profil bilgileri yüklenemedi. Lütfen yeniden dene.' : 'We could not load your profile. Please try again.');
      })
      .finally(() => { if (active) setLoadingProfile(false); });
    return () => { active = false; };
  }, [navigate, isTr]);

  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put('/api/users/me/onboarding', form);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      const validationMessage = requestError.response?.data?.detail || requestError.response?.data?.message;
      setError(validationMessage || (isTr
        ? 'Bilgiler kaydedilemedi. Lütfen alanları kontrol edip tekrar dene.'
        : 'We could not save your details. Check the fields and try again.'));
    } finally {
      setSaving(false);
    }
  };

  const copy = isTr ? {
    eyebrow: 'PEBBLE’A HOŞ GELDİN', title: 'Sana uygun bir başlangıç yapalım.',
    description: 'Birkaç küçük detayla Pebble’ı kariyer hedeflerine göre şekillendirelim.',
    step: 'Profilini oluşturalım', stepNote: '1 dakikadan kısa sürer',
    firstName: 'Ad', lastName: 'Soyad', role: 'Hedef rolün',
    rolePlaceholder: 'Örn. Backend Developer', location: 'Konum',
    locationPlaceholder: 'Şehir veya ülke (isteğe bağlı)', goal: 'Şu anki önceliğin ne?',
    chooseGoal: 'Bir hedef seç', submit: 'Pebble’ı keşfet',
    privacy: 'Bu bilgileri daha sonra profilinden değiştirebilirsin.',
    loading: 'Profilin hazırlanıyor…',
  } : {
    eyebrow: 'WELCOME TO PEBBLE', title: 'Let’s make this feel like yours.',
    description: 'A few quick details will help Pebble fit your career goals.',
    step: 'Set up your profile', stepNote: 'Takes less than a minute',
    firstName: 'First name', lastName: 'Last name', role: 'Target role',
    rolePlaceholder: 'e.g. Backend Developer', location: 'Location',
    locationPlaceholder: 'City or country (optional)', goal: 'What are you focusing on?',
    chooseGoal: 'Choose a goal', submit: 'Explore Pebble',
    privacy: 'You can change these details later in your profile.',
    loading: 'Preparing your profile…',
  };

  const fieldClass = 'w-full rounded-xl border border-[var(--pebble-line)] bg-[var(--pebble-canvas)] px-4 py-3.5 text-sm text-[var(--pebble-ink)] outline-none transition focus:border-[var(--pebble-neon-orange)] focus:ring-4 focus:ring-orange-500/10';

  if (loadingProfile) {
    return <main className="min-h-screen flex items-center justify-center bg-[var(--pebble-canvas)] text-[var(--pebble-muted)]" role="status">{copy.loading}</main>;
  }

  return (
    <main className="pebble-onboarding min-h-screen bg-[var(--pebble-canvas)] px-4 py-8 md:px-8 md:py-12 text-[var(--pebble-ink)]">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <section className="onboarding-intro relative overflow-hidden rounded-[28px] p-7 md:p-10 lg:min-h-[590px] lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-16 -top-14 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <Logo className="h-11 w-11 rounded-xl" />
              <span className="text-xl font-bold tracking-tight">Pebble</span>
            </div>
            <p className="mt-12 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-[var(--pebble-neon-orange)]">
              <Sparkles size={14} /> {copy.eyebrow}
            </p>
            <h1 className="mt-5 max-w-lg text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-[var(--pebble-muted)]">{copy.description}</p>
          </div>
          <div className="relative mt-10 rounded-2xl border border-[var(--pebble-line)] bg-[var(--pebble-surface)]/80 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-[var(--pebble-neon-orange)]"><Compass size={21} /></span>
              <div><p className="font-semibold">{copy.step}</p><p className="mt-1 text-sm text-[var(--pebble-muted)]">{copy.stepNote}</p></div>
              <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700"><Check size={17} /></span>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--pebble-line)]"><div className="h-full w-2/3 rounded-full bg-[var(--pebble-neon-orange)]" /></div>
          </div>
        </section>

        <section className="onboarding-form-card rounded-[28px] border border-[var(--pebble-line)] bg-[var(--pebble-surface)] p-6 shadow-[0_24px_80px_rgba(48,37,31,.08)] md:p-9">
          <div className="mb-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-[var(--pebble-neon-orange)]"><UserRound size={23} /></span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">{copy.step}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--pebble-muted)]">{copy.privacy}</p>
          </div>
          {error && <div role="alert" className="mb-5 rounded-xl border border-red-300/70 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-sm font-medium">{copy.firstName}<input className={fieldClass} autoComplete="given-name" maxLength={100} required value={form.firstName} onChange={change('firstName')} /></label>
              <label className="block space-y-2 text-sm font-medium">{copy.lastName}<input className={fieldClass} autoComplete="family-name" maxLength={100} required value={form.lastName} onChange={change('lastName')} /></label>
            </div>
            <label className="block space-y-2 text-sm font-medium"><span className="inline-flex items-center gap-2"><BriefcaseBusiness size={16} className="text-[var(--pebble-neon-orange)]" />{copy.role}</span>
              <input className={fieldClass} list="pebble-role-suggestions" maxLength={120} required placeholder={copy.rolePlaceholder} value={form.targetRole} onChange={change('targetRole')} />
              <datalist id="pebble-role-suggestions">{ROLE_SUGGESTIONS.map((role) => <option key={role} value={role} />)}</datalist>
            </label>
            <label className="block space-y-2 text-sm font-medium"><span className="inline-flex items-center gap-2"><MapPin size={16} className="text-[var(--pebble-neon-orange)]" />{copy.location}</span>
              <input className={fieldClass} autoComplete="address-level2" maxLength={160} placeholder={copy.locationPlaceholder} value={form.location} onChange={change('location')} />
            </label>
            <label className="block space-y-2 text-sm font-medium"><span className="inline-flex items-center gap-2"><Target size={16} className="text-[var(--pebble-neon-orange)]" />{copy.goal}</span>
              <select className={fieldClass} required value={form.careerGoal} onChange={change('careerGoal')}>
                <option value="" disabled>{copy.chooseGoal}</option>
                {GOALS[isTr ? 'tr' : 'en'].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <button type="submit" disabled={saving} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--pebble-neon-orange)] px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65">
              {saving ? (isTr ? 'Kaydediliyor…' : 'Saving…') : copy.submit}<ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
