import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Agenda from './pages/Agenda'; // <-- YENİ EKLENDİ
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import Development from './pages/Development'; // <-- YENİ EKLENDİ
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Tracker from './pages/Tracker';

const Placeholder = () => <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest mt-20">Bu sayfa yakında eklenecek 🛠️</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/ajanda" element={<Agenda />} /> {/* <-- BURASI GÜNCELLENDİ (Placeholder yerine Agenda geldi) */}
            <Route path="/takvim" element={<Calendar />} /> 
            <Route path="/gelisim" element={<Development />} /> {/* <-- BURASI GÜNCELLENDİ */}
            <Route path="/resume" element={<Placeholder />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;