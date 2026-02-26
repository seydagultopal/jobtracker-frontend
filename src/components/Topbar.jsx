import { BookOpen, Calendar, FileText, Globe, LayoutDashboard, ListTodo, Moon, Sun, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Topbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const { t, language, toggleLanguage } = useLanguage(); 
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.sub); 
      } catch (error) {
        console.error('User info error'); 
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const handleComingSoon = () => {
    alert(t('comingSoon'));
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
      default: return { title: 'Pebble', icon: LayoutDashboard };
    }
  };

  const PageIcon = getPageInfo().icon;

  return (
    <header className="bg-white/80 dark:bg-twilight/80 backdrop-blur-md h-20 px-8 flex justify-between items-center border-b border-columbia/10 dark:border-starlight/50 transition-colors duration-500 z-40 shrink-0">
      
      {/* Sol Kısım: Dinamik Sayfa Başlığı */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-columbia/10 dark:bg-night rounded-xl flex items-center justify-center border border-columbia/20 dark:border-starlight/30 shadow-sm">
          <PageIcon size={20} className="text-columbia dark:text-columbia" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{getPageInfo().title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        
        {/* TEMA BUTONU */}
        <button
          onClick={toggleTheme}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ease-in-out flex items-center px-1 shadow-inner ${
            isDarkMode ? 'bg-night' : 'bg-peach'
          }`}
        >
          <div 
            className={`w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
              isDarkMode ? 'translate-x-7 bg-starlight text-peach' : 'translate-x-0 bg-white text-orange-400'
            }`}
          >
            {isDarkMode ? <Moon size={12} strokeWidth={3} /> : <Sun size={12} strokeWidth={3} />}
          </div>
        </button>

        {/* DİL BUTONU */}
        <button 
          onClick={toggleLanguage} 
          className="group flex items-center gap-1.5 px-3 py-1.5 bg-columbia/15 dark:bg-columbia/10 text-columbia dark:text-columbia rounded-[1.25rem] hover:bg-columbia dark:hover:bg-columbia hover:text-white dark:hover:text-white transition-all duration-300 border border-transparent hover:scale-105 active:scale-95"
        >
          <Globe size={14} strokeWidth={2.5} className="transition-transform duration-500 group-hover:rotate-180" />
          <span className="text-[10px] font-black tracking-widest">{language === 'tr' ? 'EN' : 'TR'}</span> 
        </button>

        {/* PROFİL MENÜSÜ */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
            className="flex items-center gap-3 p-1.5 pr-4 bg-alabaster/50 dark:bg-night hover:bg-columbia/10 dark:hover:bg-starlight/50 rounded-[1.25rem] transition-all border border-transparent hover:border-columbia/20 dark:hover:border-starlight"
          >
            <div className="w-10 h-10 bg-cherry text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <span className="block text-xs font-black text-gray-700 dark:text-gray-200">{userEmail ? userEmail.split('@')[0] : t('defaultUser')}</span>
              <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest mt-0.5">{t('myAccount')}</span>
            </div>
          </button>

          {isProfileMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>}

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-twilight rounded-2xl shadow-xl border border-columbia/10 dark:border-starlight/50 py-2 z-50 animate-fade-in">
              <div className="px-5 py-3 border-b border-columbia/5 dark:border-starlight/30 mb-2">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest">{t('loggedInAs')}</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{userEmail}</p>
              </div>
              <button onClick={handleComingSoon} className="w-full text-left px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-alabaster dark:hover:bg-night hover:text-cherry dark:hover:text-cherry transition-all">{t('profile')}</button>
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