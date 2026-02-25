import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

export default function Topbar({ userEmail, handleLogout }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { t, language, toggleLanguage } = useLanguage(); 

  const handleComingSoon = () => {
    alert(t('comingSoon'));
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 py-4 flex justify-between items-center border-b border-columbia/10">
      <div className="flex items-center gap-4">
        <Logo className="w-10 h-10 shadow-sm rounded-2xl" />
        <h1 className="text-2xl font-black text-cherry tracking-tighter">Job Tracker</h1>
      </div>
      
      <div className="flex items-center gap-4">
        
        {/* LİLA DİL DEĞİŞTİRME BUTONU */}
        <button 
          onClick={toggleLanguage} 
          className="px-3 py-1.5 bg-purple-100 text-purple-500 text-xs font-black rounded-xl hover:bg-purple-400 hover:text-white transition-all tracking-widest"
        >
          {language === 'tr' ? 'EN' : 'TR'}
        </button>

        {/* Kullanıcı Profil Menüsü */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
            className="flex items-center gap-3 p-1.5 pr-4 bg-alabaster/50 hover:bg-columbia/10 rounded-[1.25rem] transition-all border border-transparent hover:border-columbia/20"
          >
            <div className="w-10 h-10 bg-cherry text-white rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden md:block">
              {/* SABİT YAZI YERİNE t('defaultUser') KULLANILDI */}
              <span className="block text-xs font-black text-gray-700">{userEmail ? userEmail.split('@')[0] : t('defaultUser')}</span>
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{t('myAccount')}</span>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {isProfileMenuOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
          )}

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-columbia/10 py-2 z-50 animate-fade-in">
              <div className="px-5 py-3 border-b border-columbia/5 mb-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loggedInAs')}</p>
                <p className="text-sm font-bold text-gray-700 truncate">{userEmail}</p>
              </div>
              <button onClick={handleComingSoon} className="w-full text-left px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-alabaster hover:text-cherry transition-all">{t('profile')}</button>
              <button onClick={handleComingSoon} className="w-full text-left px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-alabaster hover:text-cherry transition-all">{t('settings')}</button>
              <div className="h-[1px] bg-columbia/10 my-2"></div>
              <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-xs font-black text-cherry hover:bg-cherry/10 transition-all flex items-center justify-between">
                <span>{t('logout')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}