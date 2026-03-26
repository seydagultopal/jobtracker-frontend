import { BookOpen, Calendar, FileText, Globe, LayoutDashboard, ListTodo, Moon, Sun, TrendingUp, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const DEFAULT_COVER = 'bg-gradient-to-r from-rose-400 to-orange-300 dark:from-rose-900 dark:to-orange-900';

export default function Topbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', photo: null });
  const [coverPhoto, setCoverPhoto] = useState(DEFAULT_COVER);
  
  const { t, language, toggleLanguage } = useLanguage(); 
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const res = await api.get('/api/users/me');
        if (res.data) {
          setUserData({
            name: res.data.firstName ? `${res.data.firstName} ${res.data.lastName || ''}` : '',
            email: res.data.email || payload.sub,
            photo: res.data.photo || null
          });
          // Veritabanında kapak resmi varsa al, yoksa varsayılanı kullan
          if (res.data.coverPhoto) {
            setCoverPhoto(res.data.coverPhoto);
          } else {
            setCoverPhoto(DEFAULT_COVER);
          }
        }
      } catch (error) {
        console.error('User info error', error); 
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    
    // Profilden anlık seçilen rengi yakala
    const handlePreview = (e) => {
      if (e.detail) setCoverPhoto(e.detail);
    };
    
    window.addEventListener('profileUpdated', fetchUserData);
    window.addEventListener('coverPreview', handlePreview);
    
    return () => {
      window.removeEventListener('profileUpdated', fetchUserData);
      window.removeEventListener('coverPreview', handlePreview);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsProfileMenuOpen(false);
  };

  const getPageInfo = () => {
    switch(location.pathname) {
      case '/dashboard': return { title: t('menuDashboard'), icon: LayoutDashboard };
      case '/tracker': return { title: t('menuTracker'), icon: ListTodo };
      case '/ajanda': return { title: t('menuAgenda'), icon: BookOpen };
      case '/takvim': return { title: t('menuCalendar'), icon: Calendar };
      case '/gelisim': return { title: t('menuDev'), icon: TrendingUp };
      case '/resume': return { title: t('menuResume'), icon: FileText };
      case '/profile': return { title: language === 'tr' ? 'Profilim' : 'My Profile', icon: User };
      default: return { title: 'Pebble', icon: LayoutDashboard };
    }
  };

  const PageIcon = getPageInfo().icon || LayoutDashboard;

  // Boş gelme ihtimaline karşı her zaman güvenli bir kapak kullan
  const activeCover = coverPhoto || DEFAULT_COVER;
  const isCustomCover = activeCover && !activeCover.startsWith('bg-');

  return (
    <header className={`relative shadow-lg h-20 px-8 flex justify-between items-center transition-all duration-700 z-40 shrink-0 ${!isCustomCover ? activeCover : 'bg-gray-800'}`}>
      
      {isCustomCover && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute inset-0 opacity-80 scale-125" 
            style={{ backgroundImage: `url(${activeCover})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(30px)' }}
          ></div>
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50"></div>
        </div>
      )}

      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-sm">
          <PageIcon size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{getPageInfo().title}</h1>
      </div>
      
      <div className="relative z-10 flex items-center gap-4">
        <button onClick={toggleTheme} className={`relative w-14 h-7 rounded-full transition-colors duration-300 ease-in-out flex items-center px-1 shadow-inner ${isDarkMode ? 'bg-black/40' : 'bg-white/30'}`}>
          <div className={`w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out flex items-center justify-center ${isDarkMode ? 'translate-x-7 bg-starlight text-peach' : 'translate-x-0 bg-white text-orange-400'}`}>
            {isDarkMode ? <Moon size={12} strokeWidth={3} /> : <Sun size={12} strokeWidth={3} />}
          </div>
        </button>

        <button onClick={toggleLanguage} className="group flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-[1.25rem] transition-all duration-300 border border-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm">
          <Globe size={14} strokeWidth={2.5} className="transition-transform duration-500 group-hover:rotate-180" />
          <span className="text-[10px] font-black tracking-widest">{language === 'tr' ? 'EN' : 'TR'}</span> 
        </button>

        <div className="relative">
          <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 p-1.5 pr-4 bg-white/10 hover:bg-white/20 rounded-[1.25rem] transition-all border border-white/10 hover:border-white/30 backdrop-blur-sm">
            {userData.photo ? (
              <img src={userData.photo} alt="Profile" className="w-10 h-10 rounded-xl object-cover shadow-sm border border-white/20" />
            ) : (
              <div className="w-10 h-10 bg-white text-gray-800 rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
                {userData.name ? userData.name.charAt(0).toUpperCase() : (userData.email ? userData.email.charAt(0).toUpperCase() : 'U')}
              </div>
            )}
            <div className="text-left hidden md:block">
              <span className="block text-xs font-black text-white drop-shadow-md">{userData.name || (userData.email ? userData.email.split('@')[0] : t('defaultUser'))}</span>
              <span className="block text-[9px] font-bold text-white/90 uppercase tracking-widest mt-0.5">{t('myAccount')}</span>
            </div>
          </button>

          {isProfileMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>}

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-twilight rounded-2xl shadow-2xl border border-gray-100 dark:border-starlight/50 py-2 z-50 animate-fade-in">
              <div className="px-5 py-3 border-b border-gray-100 dark:border-starlight/30 mb-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loggedInAs')}</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{userData.email}</p>
              </div>
              <button onClick={handleProfileClick} className="w-full text-left px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night hover:text-pink-500 transition-all">{t('profile')}</button>
              <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-xs font-black text-cherry hover:bg-cherry/10 dark:hover:bg-cherry/20 transition-all">
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}