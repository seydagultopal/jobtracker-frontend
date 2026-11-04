import { BookOpen, CalendarDays, FileText, LayoutDashboard, ListTodo, TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { t, language } = useLanguage();
  const groups = [
    { label: language === 'tr' ? 'ÇALIŞMA ALANI' : 'WORKSPACE', items: [
      { path: '/dashboard', name: t('menuDashboard'), icon: LayoutDashboard },
      { path: '/tracker', name: t('menuTracker'), icon: ListTodo },
      { path: '/ajanda', name: t('menuAgenda'), icon: BookOpen },
      { path: '/takvim', name: t('menuCalendar'), icon: CalendarDays },
    ]},
    { label: language === 'tr' ? 'KİŞİSEL' : 'PERSONAL', items: [
      { path: '/gelisim', name: t('menuDev'), icon: TrendingUp },
      { path: '/resume', name: t('menuResume'), icon: FileText },
    ]},
  ];

  return (
    <>
      {isOpen && <button type="button" className="pebble-sidebar-backdrop" aria-label={language === 'tr' ? 'Menüyü kapat' : 'Close navigation'} onClick={onClose} />}
      <aside id="pebble-primary-navigation" className={`pebble-sidebar ${isOpen ? 'is-mobile-open' : ''}`}>
        <NavLink to="/dashboard" onClick={onClose} className="pebble-sidebar-brand" aria-label="Pebble home">
          <Logo className="pebble-sidebar-logo" />
          <span className="pebble-sidebar-wordmark">pebble</span>
          <span className="pebble-sidebar-brand-mark">⌄</span>
        </NavLink>
        <div className="pebble-workspace-switcher">
          <span className="pebble-workspace-avatar">P</span>
          <span className="pebble-workspace-name">{language === 'tr' ? 'Kişisel alanım' : 'My workspace'}</span>
          <span className="pebble-workspace-chevron">⌄</span>
        </div>
        <nav className="pebble-sidebar-nav" aria-label="Main navigation">
          {groups.map(group => (
            <section className="pebble-nav-group" key={group.label}>
              <p className="pebble-nav-group-label">{group.label}</p>
              {group.items.map(item => (
                <NavLink key={item.path} to={item.path} onClick={onClose}
                  className={({ isActive }) => `pebble-nav-link ${isActive ? 'is-active' : ''}`}>
                  <item.icon size={17} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </section>
          ))}
        </nav>
        <div className="pebble-sidebar-bottom">
          <span className="pebble-sidebar-bottom-icon">✳</span>
          <span>{language === 'tr' ? 'Küçük adımlar, gerçek ilerleme.' : 'Small steps, real progress.'}</span>
        </div>
      </aside>
    </>
  );
}
