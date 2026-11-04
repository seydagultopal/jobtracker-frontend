import { Globe, LogOut, Menu, Moon, Sun, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function Topbar({ onMenuClick = () => {}, isMobileNavOpen = false }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', photo: null });
  const { t, language, toggleLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const pageNames = {
    '/dashboard': t('menuDashboard'), '/tracker': t('menuTracker'),
    '/ajanda': t('menuAgenda'), '/takvim': t('menuCalendar'),
    '/gelisim': t('menuDev'), '/resume': t('menuResume'),
    '/profile': language === 'tr' ? 'Profilim' : 'My profile'
  };
  const pageTitle = pageNames[location.pathname] || 'Pebble';

  useEffect(() => {
    let active = true;
    const fetchUserData = async () => {
      try {
        const { data } = await api.get('/api/users/me');
        if (active && data) setUserData({
          name: [data.firstName, data.lastName].filter(Boolean).join(' '),
          email: data.email || '', photo: data.photo || null
        });
      } catch (error) {
        console.error('User info error', error);
      }
    };
    fetchUserData();
    window.addEventListener('profileUpdated', fetchUserData);
    return () => {
      active = false;
      window.removeEventListener('profileUpdated', fetchUserData);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      // Keep a tab-scoped logout marker so browser history cannot revive a cached workspace.
      sessionStorage.setItem('pebble_logged_out', 'true');
      setUserData({ name: '', email: '', photo: null });
      setIsProfileMenuOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Do not pretend the session ended if the server did not confirm logout.
    }
  };

  return (
    <header className="pebble-topbar">
      <div className="pebble-topbar-left">
        <button type="button" className="pebble-mobile-menu-button" onClick={onMenuClick}
          aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMobileNavOpen}
          aria-controls="pebble-primary-navigation">
          {isMobileNavOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
        <span className="pebble-breadcrumb-muted">{language === 'tr' ? 'Çalışma alanı' : 'Workspace'}</span>
        <span className="pebble-breadcrumb-divider">/</span>
        <h1 className="pebble-topbar-title">{pageTitle}</h1>
      </div>
      <div className="pebble-topbar-actions">
        <button type="button" className="pebble-icon-button" onClick={toggleLanguage} aria-label="Change language">
          <Globe size={16} /><span>{language === 'tr' ? 'EN' : 'TR'}</span>
        </button>
        <button type="button" className="pebble-icon-button pebble-theme-button" onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}>
          {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <div className="pebble-account-menu">
          <button type="button" className="pebble-account-trigger" onClick={() => setIsProfileMenuOpen(v => !v)}
            aria-expanded={isProfileMenuOpen}>
            {userData.photo ? <img src={userData.photo} alt="" /> :
              <span className="pebble-account-avatar">{(userData.name || userData.email || 'P').charAt(0).toUpperCase()}</span>}
            <span className="pebble-account-name">{userData.name || userData.email?.split('@')[0] || t('defaultUser')}</span>
            <span className="pebble-account-chevron">⌄</span>
          </button>
          {isProfileMenuOpen && <>
            <button className="pebble-menu-dismiss" aria-label="Close menu" onClick={() => setIsProfileMenuOpen(false)} />
            <div className="pebble-account-dropdown">
              <div className="pebble-account-details"><strong>{userData.name || t('defaultUser')}</strong><span>{userData.email}</span></div>
              <button onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}><UserRound size={15} />{t('profile')}</button>
              <button className="is-danger" onClick={handleLogout}><LogOut size={15} />{t('logout')}</button>
            </div>
          </>}
        </div>
      </div>
    </header>
  );
}
