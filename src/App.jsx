import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Calendar from './pages/Calendar'; // YENİ EKLENDİ
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Tracker from './pages/Tracker';

const Placeholder = () => <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest mt-20">Bu sayfa yakında eklenecek 🛠️</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/ajanda" element={<Placeholder />} />
            {/* Takvim sayfasını aktifleştirdik */}
            <Route path="/takvim" element={<Calendar />} /> 
            <Route path="/gelisim" element={<Placeholder />} />
            <Route path="/resume" element={<Placeholder />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;