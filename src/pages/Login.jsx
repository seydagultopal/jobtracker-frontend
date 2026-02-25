import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = btoa(`${email}:${password}`);
      await api.get('/applications', {
         headers: { Authorization: `Basic ${token}` }
      });
      
      localStorage.setItem('auth_token', token);
      navigate('/dashboard');
    } catch (err) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-alabaster">
      <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-columbia/30">
        
        {/* Logo ve Başlık Alanı */}
        <div className="text-center flex flex-col items-center">
          <Logo className="w-20 h-20 mb-5 shadow-sm rounded-3xl" />
          <h2 className="text-4xl font-extrabold text-cherry mb-2 tracking-tight">Job Tracker</h2>
          <p className="text-gray-400 font-medium">Hayalindeki işi bulma serüveni</p>
        </div>
        
        {error && (
          <div className="p-4 text-sm text-cherry bg-cherry/10 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-500 pl-1">E-Posta</label>
            <input
              type="email"
              className="w-full px-5 py-3 bg-alabaster/50 border border-columbia/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-columbia/30 transition-all duration-500 ease-out text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Mail adresin..."
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-500 pl-1">Şifre</label>
            <input
              type="password"
              className="w-full px-5 py-3 bg-alabaster/50 border border-columbia/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-columbia/30 transition-all duration-500 ease-out text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Gizli şifren..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 mt-2 text-white font-bold bg-cherry rounded-2xl hover:bg-opacity-90 hover:scale-[1.02] transition-all duration-500 ease-out shadow-md focus:outline-none focus:ring-4 focus:ring-cherry/30"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}