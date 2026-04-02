import axios from 'axios';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

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
    if (password.length < 6) {
      setStatus({ ...status, error: 'Şifreniz en az 6 karakter olmalıdır.' });
      return;
    }
    
    setStatus({ loading: true, error: '', success: '' });
    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { token, newPassword: password });
      setStatus({ loading: false, error: '', success: 'Harika! Şifreniz başarıyla yenilendi.' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus({ loading: false, error: err.response?.data?.error || 'Bu linkin süresi dolmuş veya geçersiz.', success: '' });
    }
  };

  // Geçersiz veya eksik token durumu için özel ekran
  if (!token) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-10 bg-white rounded-[2rem] shadow-xl border border-red-50 max-w-sm w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Geçersiz Link</h2>
            <p className="text-gray-500 text-sm mb-6">Bu şifre sıfırlama linki eksik veya daha önce kullanılmış olabilir.</p>
            <Link to="/login" className="block w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-colors">
              Giriş Sayfasına Dön
            </Link>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E9ACBB]/10 via-gray-50 to-[#7B92B3]/10 p-4 relative overflow-hidden">
      
      {/* Arka plan süsleri (Bulanık renkli toplar) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#E9ACBB] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#7B92B3] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Cam Efektli (Glassmorphism) Kart */}
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white z-10 relative">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-widest text-cherry mb-4">PEBBLE</h1>
          <h2 className="text-2xl font-bold text-gray-800">Yeni Şifre Belirle 🔒</h2>
          <p className="text-sm text-gray-500 mt-2">Lütfen hesabın için güçlü bir şifre oluştur.</p>
        </div>
        
        {/* Hata Mesajı */}
        {status.error && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <p>{status.error}</p>
          </div>
        )}

        {/* Başarı Mesajı */}
        {status.success && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-green-50 text-green-600 text-sm font-bold rounded-2xl border border-green-100 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={24} className="shrink-0" />
            <p>{status.success} <br/><span className="text-xs font-normal opacity-80">Giriş sayfasına yönlendiriliyorsunuz...</span></p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400 group-focus-within:text-columbia transition-colors"/>
            </div>
            <input 
              required 
              type={showPassword ? "text" : "password"} 
              placeholder="Yeni Şifreniz" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-12 py-4 text-sm outline-none focus:ring-4 focus:ring-columbia/20 focus:border-columbia transition-all shadow-sm" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400 group-focus-within:text-columbia transition-colors"/>
            </div>
            <input 
              required 
              type={showPassword ? "text" : "password"} 
              placeholder="Yeni Şifreniz (Tekrar)" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-12 py-4 text-sm outline-none focus:ring-4 focus:ring-columbia/20 focus:border-columbia transition-all shadow-sm" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={status.loading || status.success} 
            className="w-full py-4 mt-2 bg-columbia text-white font-black rounded-2xl hover:bg-[#6a809f] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-columbia transition-all shadow-xl shadow-columbia/30 text-sm"
          >
            {status.loading ? 'Güncelleniyor...' : status.success ? 'Yönlendiriliyor...' : 'Şifreyi Yenile'}
          </button>
        </form>
      </div>
    </div>
  );
}