import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Şifremi Unuttum Modalı State'leri
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotData, setForgotData] = useState({ email: '', newPassword: '', confirmNewPassword: '' });
  const [forgotLoading, setForgotLoading] = useState(false);

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
    setLoading(true);
    
    try {
      const payload = {
        email: formData.email,
        password: formData.password
      };

      const response = await api.post('/auth/login', payload);
      localStorage.setItem('auth_token', response.data.token);
      
      showToastMessage('success', t('msgLoginSuccess'));
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      showToastMessage('errorGeneral', t('msgLoginFailed'));
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passRegex.test(forgotData.newPassword)) {
      showToastMessage('warning', t('msgPassRules'));
      return;
    }

    if (forgotData.newPassword !== forgotData.confirmNewPassword) {
      showToastMessage('warning', t('msgPassMismatch'));
      setForgotData(prev => ({ ...prev, confirmNewPassword: '' }));
      return;
    }

    setForgotLoading(true);
    try {
      // API İsteği
      await api.post('/auth/reset-password', {
        email: forgotData.email,
        newPassword: forgotData.newPassword
      });
      
      showToastMessage('success', t('msgPassResetSuccess'));
      setShowForgotModal(false);
      setForgotData({ email: '', newPassword: '', confirmNewPassword: '' });
      
    } catch (error) {
      console.error("Reset Error:", error);
      // KAFA KARIŞTIRICI MESAJ DÜZELTİLDİ:
      if (error.response && error.response.status === 500) {
        showToastMessage('errorGeneral', 'Sistemde böyle bir mail bulunamadı!');
      } else if (error.response && error.response.status === 404) {
        showToastMessage('errorGeneral', 'Sunucuya ulaşılamıyor. Backend açık mı?');
      } else {
        showToastMessage('errorGeneral', 'Şifre güncellenemedi bir hata oluştu.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleComingSoon = () => {
    alert(t('comingSoon'));
  };

  const getToastStyle = (type) => {
    switch (type) {
      case 'success': return 'bg-cambridge text-white shadow-cambridge/40'; 
      case 'errorGeneral': return 'bg-cherry text-white shadow-cherry/40'; 
      case 'warning': return 'bg-peach/90 text-orange-900 shadow-peach/40'; 
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
        
        <div className="w-full md:w-1/2 flex flex-col justify-center px-2 md:px-6">
          
          <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight mb-8 text-center md:text-left">{t('loginTitle')}</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('regEmail')} className="w-full pl-11 pr-4 py-4 bg-white dark:bg-night/50 rounded-2xl border border-columbia/10 dark:border-starlight/30 focus:border-cherry dark:focus:border-cherry outline-none font-bold text-gray-700 dark:text-gray-200 transition-all placeholder:text-gray-400 placeholder:font-medium text-sm shadow-sm" />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input required type={showPass ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder={t('regPassword')} className="w-full pl-11 pr-12 py-4 bg-white dark:bg-night/50 rounded-2xl border border-columbia/10 dark:border-starlight/30 focus:border-cherry dark:focus:border-cherry outline-none font-bold text-gray-700 dark:text-gray-200 transition-all placeholder:text-gray-400 placeholder:font-medium text-sm shadow-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cherry transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-black text-gray-400 hover:text-cherry transition-colors">
                  {t('forgotPass')}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-cherry text-white text-sm font-black rounded-2xl hover:scale-[1.02] active:scale-95 shadow-xl shadow-cherry/30 dark:shadow-none transition-all uppercase tracking-widest disabled:opacity-70 disabled:hover:scale-100">
              {loading ? '...' : t('loginBtn')}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-columbia/10 dark:bg-starlight/30"></div>
            <span className="text-[10px] font-black text-gray-400 tracking-widest">{t('loginOr')}</span>
            <div className="flex-1 h-[1px] bg-columbia/10 dark:bg-starlight/30"></div>
          </div>

          <button type="button" onClick={handleComingSoon} className="w-full flex items-center justify-center gap-3 py-3.5 bg-white dark:bg-twilight text-gray-600 dark:text-gray-200 text-sm font-bold rounded-2xl border border-columbia/20 dark:border-starlight/40 hover:bg-gray-50 dark:hover:bg-night shadow-sm transition-all hover:scale-[1.02] active:scale-95">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264,51.509 C -3.264,50.719 -3.334,49.969 -3.454,49.239 L -14.754,49.239 L -14.754,53.749 L -8.284,53.749 C -8.574,55.229 -9.424,56.479 -10.684,57.329 L -10.684,60.329 L -6.824,60.329 C -4.564,58.239 -3.264,55.159 -3.264,51.509 Z"/>
                <path fill="#34A853" d="M -14.754,63.239 C -11.514,63.239 -8.804,62.159 -6.824,60.329 L -10.684,57.329 C -11.764,58.049 -13.134,58.489 -14.754,58.489 C -17.884,58.489 -20.534,56.379 -21.484,53.529 L -25.464,53.529 L -25.464,56.619 C -23.494,60.539 -19.444,63.239 -14.754,63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484,53.529 C -21.734,52.809 -21.864,52.039 -21.864,51.239 C -21.864,50.439 -21.724,49.669 -21.484,48.949 L -21.484,45.859 L -25.464,45.859 C -26.284,47.479 -26.754,49.299 -26.754,51.239 C -26.754,53.179 -26.284,54.999 -25.464,56.619 L -21.484,53.529 Z"/>
                <path fill="#EA4335" d="M -14.754,43.989 C -12.984,43.989 -11.404,44.599 -10.154,45.789 L -6.734,41.939 C -8.804,40.009 -11.514,39.239 -14.754,39.239 C -19.444,39.239 -23.494,41.939 -25.464,45.859 L -21.484,48.949 C -20.534,46.099 -17.884,43.989 -14.754,43.989 Z"/>
              </g>
            </svg>
            {t('loginGoogle')}
          </button>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/register')} className="text-xs font-bold text-gray-500 hover:text-columbia transition-colors">
              {t('loginNoAccount')}
            </button>
          </div>

        </div>

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

      {/* ŞİFREMİ UNUTTUM MODALI */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-columbia/20 dark:bg-night/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-twilight p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/50 dark:border-starlight/50 animate-fade-in relative overflow-hidden">
            
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-columbia/20 rounded-full blur-2xl"></div>

            <button onClick={() => setShowForgotModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-cherry transition-colors z-10 text-xl font-bold">×</button>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight mb-2">
                {t('forgotPassTitle')}
              </h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
                {t('forgotPassDesc')}
              </p>
              
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input required type="email" value={forgotData.email} onChange={e => setForgotData({...forgotData, email: e.target.value})} className="w-full pl-10 pr-4 py-3.5 bg-alabaster/50 dark:bg-night/50 rounded-2xl border border-columbia/10 dark:border-starlight/30 focus:border-cherry outline-none font-bold text-gray-700 dark:text-gray-200 text-sm" placeholder={t('regEmail')} />
                </div>
                
                <div className="group">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="password" value={forgotData.newPassword} onChange={e => setForgotData({...forgotData, newPassword: e.target.value})} className="w-full pl-10 pr-4 py-3.5 bg-alabaster/50 dark:bg-night/50 rounded-2xl border border-columbia/10 dark:border-starlight/30 focus:border-cherry outline-none font-bold text-gray-700 dark:text-gray-200 text-sm" placeholder={t('forgotNewPass')} />
                  </div>
                  <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out group-focus-within:max-h-40 group-focus-within:opacity-100 group-focus-within:mt-2 px-2">
                    <ul className="text-[10px] font-bold text-gray-500 space-y-1 list-disc pl-4 marker:text-peach">
                      <li>{t('passRule1')}</li>
                      <li>{t('passRule2')}</li>
                      <li>{t('passRule3')}</li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input required type="password" value={forgotData.confirmNewPassword} onChange={e => setForgotData({...forgotData, confirmNewPassword: e.target.value})} className="w-full pl-10 pr-4 py-3.5 bg-alabaster/50 dark:bg-night/50 rounded-2xl border border-columbia/10 dark:border-starlight/30 focus:border-cherry outline-none font-bold text-gray-700 dark:text-gray-200 text-sm" placeholder={t('forgotConfirmPass')} />
                </div>

                <button type="submit" disabled={forgotLoading} className="w-full py-4 bg-columbia text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-columbia/20 uppercase tracking-widest text-xs mt-2">
                  {forgotLoading ? '...' : t('btnResetPass')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}