import { BookOpen, Calendar, FileText, LayoutDashboard, ListTodo, Sparkles, TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

export default function Sidebar() {
  const { t } = useLanguage();

  const menuItems = [
    { path: '/dashboard', name: t('menuDashboard'), icon: LayoutDashboard },
    { path: '/tracker', name: t('menuTracker'), icon: ListTodo },
    { path: '/ajanda', name: t('menuAgenda'), icon: BookOpen },
    { path: '/takvim', name: t('menuCalendar'), icon: Calendar },
    { path: '/gelisim', name: t('menuDev'), icon: TrendingUp },
    { path: '/resume', name: t('menuResume'), icon: FileText },
  ];

  return (
    <aside className="pebble-sidebar w-64 flex-shrink-0 bg-white dark:bg-twilight border-r border-gray-100 dark:border-starlight/20 flex flex-col transition-colors duration-500 z-50">
      <div className="pebble-sidebar-brand h-20 flex items-center gap-3 px-6 border-b border-gray-100 dark:border-starlight/20 shrink-0">
        <div className="pebble-sidebar-logo"><Logo className="w-auto h-8" /></div>
        <div className="min-w-0">
          <span className="pebble-sidebar-wordmark">Pebble<span className="pebble-sidebar-period">.</span></span>
          <span className="pebble-sidebar-tagline">MAKE IT HAPPEN</span>
        </div>
      </div>

      <div className="pebble-sidebar-section-label"><span>WORKSPACE</span></div>
      <nav className="pebble-sidebar-nav flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar" aria-label="Main navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `pebble-nav-link flex items-center gap-3.5 px-4 py-3 rounded-[1.1rem] font-bold transition-all duration-300 ${isActive ? 'is-active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <span className="pebble-nav-icon"><item.icon size={18} strokeWidth={isActive ? 2.4 : 2} /></span>
                <span className="pebble-nav-name text-[13px] tracking-wide">{item.name}</span>
                {isActive && <span className="pebble-nav-active-mark" aria-hidden="true" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="pebble-sidebar-footer">
        <div className="pebble-sidebar-note">
          <span className="pebble-sidebar-note-icon"><Sparkles size={15} /></span>
          <div><p>Small steps.</p><p>Real progress.</p></div>
          <span className="pebble-sidebar-note-spark" aria-hidden="true">✳</span>
        </div>
      </div>
    </aside>
  );
}
