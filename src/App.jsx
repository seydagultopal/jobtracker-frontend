import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Agenda from './pages/Agenda';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import Development from './pages/Development';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Resume from './pages/Resume';
import Tracker from './pages/Tracker';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/ajanda" element={<Agenda />} />
            <Route path="/takvim" element={<Calendar />} />
            <Route path="/gelisim" element={<Development />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
