import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-cambridge/15 dark:bg-night overflow-hidden transition-colors duration-500 font-sans">
      <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setIsMobileNavOpen((open) => !open)} isMobileNavOpen={isMobileNavOpen} />
        {/* Çizdiğin yeşil arka planlı alan */}
        <main className="pebble-main flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-[1400px] mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}