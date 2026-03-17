import { BookOpen, Calendar, FileText, LayoutDashboard, ListTodo, TrendingUp } from 'lucide-react';
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
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-twilight border-r border-gray-100 dark:border-starlight/20 flex flex-col transition-colors duration-500 z-50">
      {/* LOGO VE YAZI KISMI BURADA GÜNCELLENDİ (gap-3 eklendi, Pebble yazısı eklendi) */}
      <div className="h-20 flex items-center gap-3 px-8 border-b border-gray-100 dark:border-starlight/20 shrink-0">
        <Logo className="w-auto h-8" />
        <span className="text-2xl font-black tracking-tight text-gray-800 dark:text-white">Pebble</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3.5 px-5 py-3.5 rounded-[1.25rem] font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-columbia to-blue-500 text-white shadow-lg shadow-columbia/40 scale-[1.02]' 
                  : 'text-gray-500 dark:text-gray-400 border border-transparent hover:bg-columbia/10 hover:text-columbia dark:hover:bg-columbia/20 dark:hover:text-white hover:scale-[1.02]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 3 : 2.5} />
                <span className="text-[13px] tracking-wide">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}