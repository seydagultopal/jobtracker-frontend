import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Agenda from './pages/Agenda';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import Development from './pages/Development';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Resume from './pages/Resume'; // <-- YENİ EKLENDİ
import Tracker from './pages/Tracker';

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
            <Route path="/ajanda" element={<Agenda />} /> 
            <Route path="/takvim" element={<Calendar />} /> 
            <Route path="/gelisim" element={<Development />} /> 
            <Route path="/resume" element={<Resume />} /> {/* <-- BURASI GÜNCELLENDİ (Placeholder yerine Resume geldi) */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;