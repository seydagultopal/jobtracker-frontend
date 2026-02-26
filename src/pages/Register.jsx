import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, User, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function Register() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [toast, setToast] = useState({ show: false, type: '', msg: '' });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, type: '', msg: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToastMessage = (type, msg) => {
    setToast({ show: true, type, msg });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Şifre Kuralları (Regex) Doğrulama
    // En az 8 karakter, en az 1 büyük harf, en az 1 rakam, en az 1 özel karakter
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passRegex.test(formData.password)) {
      showToastMessage('warning', t('msgPassRules'));
      return;
    }

    // 2. Şifre Eşleşme Kontrolü
    if (formData.password !== formData.confirmPassword) {
      showToastMessage('warning', t('msgPassMismatch'));
      setFormData(prev => ({ ...prev, confirmPassword: '' }));
      return;
    }

    setLoading(true);
    
    try {
      await api.post('/auth/register', formData);
      
      showToastMessage('success', t('msgRegSuccess'));
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showToastMessage('errorEmail', t('msgEmailInUse'));
      } else {
        showToastMessage('errorGeneral', t('msgRegFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getToastStyle = (type) => {
    switch (type) {
      case 'success': return 'bg-cambridge text-white shadow-cambridge/40'; 
      case 'errorEmail': return 'bg-cherry text-white shadow-cherry/40'; 
      case 'warning': return 'bg-peach/90 text-orange-900 shadow-peach/40'; 
      case 'errorGeneral': return 'bg-orange-400 text-white shadow-orange-400/40'; 
      default: return 'bg-gray-800 text-white';
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      default: return <XCircle size={20} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-alabaster dark:bg-night flex items-center justify-center p-4 overflow-hidden font-sans transition-colors duration-500">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-peach/40 dark:bg-peach/10 rounded-full blur-[100px] md:blur-[150px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-columbia/40 dark:bg-columbia/10 rounded-full blur-[100px] md:blur-[150px] opacity-70"></div>
      </div>

      {toast.show && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-black tracking-wide animate-fade-in transition-all ${getToastStyle(toast.type)}`}>
          {getToastIcon(toast.type)}
          {toast.msg}
        </div>
      )}

      <div className="relative z-10 w-full max-w-5xl bg-white/70 dark:bg-twilight/70 backdrop-blur-xl rounded-[3rem] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white/50 dark:border-starlight/30 animate-fade-in flex flex-col-reverse md:flex-row items-stretch gap-8">
        
        {/* SOL: KAYIT FORMU */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-2 md:px-4">
          
          <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight mb-6">{t('regTitle')}</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            
            <div className="flex gap-3">
              <div className="relative flex-1">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder={t('regFirstName')} className="w-full pl-10 pr-3 py-3 bg-white dark:bg-night/50 rounded-2xl border border-columbia/10 dark:border-starlight/30 focus:border-cherry dark:focus:border-cherry outline-none font-bold text-gray-700 dark:text-gray-200 transition-all placeholder:text-gray-400 placeholder:font-medium text-sm" />
              </div>
              <div className="relative flex-1">
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder={t('regLastName')} className="w-full px-4 py-3 bg-white dark:bg-night/50 rounded-2xl border border-columbia/10 dark:border-starlight/30 focus:border-cherry dark:focus:border-cherry outline-none font-bold text-gray-700 dark:text-gray-200 transition-all placeholder:text-gray-400 placeholder:font-medium text-sm" />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('regEmail')} className="w-full pl-10 pr-4 py-3 bg-white dark:bg-night/50 rounded-2xl border border-columbia/10 dark:border-starlight/30 focus:border-cherry dark:focus:border-cherry outline-none font-bold text-gray-700 dark:text-gray-200 transition-all placeholder:text-gray-400 placeholder:font-medium text-sm" />
            </div>

            {/* ŞİFRE ALANI VE KURALLAR (GROUP ILE BIRLESTIRILDI) */}
            <div className="group">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input required type={showPass ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder={t('regPassword')} className="w-full pl-10 pr-10 py-3 bg-white dark:bg-night/50 rounded-2xl border border-columbia/10 dark:border-starlight/30 focus:border-cherry dark:focus:border-cherry outline-none font-bold text-gray-700 dark:text-gray-200 transition-all placeholder:text-gray-400 placeholder:font-medium text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cherry transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* SADECE FOCUS OLUNCA AÇILAN KURAL LİSTESİ */}
              <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out group-focus-within:max-h-40 group-focus-within:opacity-100 group-focus-within:mt-3 px-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{t('passRulesTitle')}</p>
                <ul className="text-[10px] font-bold text-gray-500 space-y-1 list-disc pl-4 marker:text-peach">
                  <li>{t('passRule1')}</li>
                  <li>{t('passRule2')}</li>
                  <li>{t('passRule3')}</li>
                </ul>
              </div>
            </div>

            <div className="relative mb-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input required type={showConfirmPass ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder={t('regConfirmPassword')} className="w-full pl-10 pr-10 py-3 bg-white dark:bg-night/50 rounded-2xl border border-columbia/10 dark:border-starlight/30 focus:border-cherry dark:focus:border-cherry outline-none font-bold text-gray-700 dark:text-gray-200 transition-all placeholder:text-gray-400 placeholder:font-medium text-sm" />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cherry transition-colors">
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 mt-4 bg-cambridge text-white text-sm font-black rounded-2xl hover:scale-[1.02] active:scale-95 shadow-xl shadow-cambridge/30 dark:shadow-none transition-all uppercase tracking-widest disabled:opacity-70 disabled:hover:scale-100">
              {loading ? '...' : t('regBtn')}
            </button>
          </form>

          {/* Giriş Yap Yönlendirmesi */}
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/login')} className="text-xs font-bold text-gray-500 hover:text-columbia transition-colors">
              {t('regHasAccount')}
            </button>
          </div>

        </div>

        {/* SAĞ: LOGO VE SLOGAN */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-8 bg-peach/20 dark:bg-peach/10 rounded-[2.5rem] border border-peach/30 dark:border-peach/20">
          
          <div className="bg-white dark:bg-twilight w-full max-w-[320px] aspect-square flex flex-col items-center justify-center text-center p-8 rounded-[2rem] shadow-xl shadow-peach/20 dark:shadow-none border border-white/80 dark:border-starlight/30 transition-transform duration-500 hover:scale-[1.02]">
            <Logo className="w-24 h-24 md:w-28 md:h-28 shadow-sm rounded-[2rem] mb-6 rotate-[-2deg] hover:rotate-0 transition-transform duration-500" />
            <h1 className="text-4xl font-black text-cherry tracking-tighter mb-4">Pebble</h1>
            <p className="text-base md:text-lg font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
              {t('heroTitlePart1')} <br />
              <span className="text-cherry">{t('heroTitleHighlight')}</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}