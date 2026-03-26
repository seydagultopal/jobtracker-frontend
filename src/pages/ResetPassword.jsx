import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus({ ...status, error: 'Şifreler eşleşmiyor!' });
      return;
    }
    
    setStatus({ loading: true, error: '', success: '' });
    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { token, newPassword: password });
      setStatus({ loading: false, error: '', success: 'Şifreniz başarıyla yenilendi! Giriş sayfasına yönlendiriliyorsunuz...' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus({ loading: false, error: err.response?.data?.error || 'Bir hata oluştu.', success: '' });
    }
  };

  if (!token) return <div className="p-10 text-center font-bold text-cherry">Geçersiz Link!</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-black text-gray-800 text-center mb-2">Yeni Şifre Belirle 🔒</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Lütfen yeni şifrenizi girin.</p>
        
        {status.error && <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{status.error}</div>}
        {status.success && <div className="p-3 mb-4 bg-green-50 text-green-600 text-sm font-bold rounded-xl">{status.success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input required type={showPassword ? "text" : "password"} placeholder="Yeni Şifre" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-columbia" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-gray-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
          </div>
          <div className="relative">
            <input required type={showPassword ? "text" : "password"} placeholder="Yeni Şifre (Tekrar)" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-columbia" />
          </div>
          
          <button type="submit" disabled={status.loading} className="w-full py-3.5 bg-columbia text-white font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-sm">
            {status.loading ? 'Güncelleniyor...' : 'Şifreyi Yenile'}
          </button>
        </form>
      </div>
    </div>
  );
}