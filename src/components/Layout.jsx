import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-cambridge/15 dark:bg-night overflow-hidden transition-colors duration-500 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        {/* Çizdiğin yeşil arka planlı alan */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-[1400px] mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}