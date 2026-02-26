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
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-twilight border-r border-columbia/10 dark:border-starlight/50 flex flex-col transition-colors duration-500 z-50">
      <div className="h-20 flex items-center px-8 border-b border-columbia/5 dark:border-starlight/30 shrink-0">
        <Logo className="w-auto h-10" />
      </div>
      
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3.5 px-5 py-3.5 rounded-[1.25rem] font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-peach/30 text-orange-600 dark:bg-peach/10 dark:text-peach' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-alabaster dark:hover:bg-night hover:text-gray-700 dark:hover:text-gray-200 hover:scale-[1.02]'
              }`
            }
          >
            <item.icon size={20} strokeWidth={2.5} />
            <span className="text-[13px] tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}