import { AlertCircle, Briefcase, Camera, CheckCircle2, Eye, EyeOff, FileText, Github, GraduationCap, Image as ImageIcon, Key, Linkedin, Lock, Mail, MapPin, Phone, Plus, Save, Shield, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const COVER_OPTIONS = [
  'bg-gradient-to-r from-rose-300 to-orange-200 dark:from-rose-800 dark:to-orange-800',
  'bg-gradient-to-r from-sky-300 to-indigo-200 dark:from-sky-800 dark:to-indigo-800',
  'bg-gradient-to-r from-emerald-300 to-teal-200 dark:from-emerald-800 dark:to-teal-800',
  'bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-800 dark:to-pink-800'
];

// JSON Çökmesini Önleyen Güvenli Çevirici
const safeJSONParse = (data) => {
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export default function Profile() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('personal'); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    linkedin: '',
    github: '',
    bio: '',
    photo: null,
    coverPhoto: COVER_OPTIONS[0]
  });

  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [emailUpdate, setEmailUpdate] = useState({ newEmail: '', currentPassword: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/users/me');
        if (response.data) {
          setProfileData({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            location: response.data.location || '',
            title: response.data.title || '',
            linkedin: response.data.linkedin || '',
            github: response.data.github || '',
            bio: response.data.bio || '',
            photo: response.data.photo || null,
            coverPhoto: response.data.coverPhoto || COVER_OPTIONS[0]
          });
          
          // Güvenli JSON Çevirici Kullanıldı
          setExperience(safeJSONParse(response.data.experiences));
          setEducation(safeJSONParse(response.data.educations));
        }
      } catch (error) {
        console.error('Profil çekilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

const handlePhotoUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) { // 2MB kontrolü
    showToast(language === 'tr' ? 'Fotoğraf boyutu 2MB\'dan küçük olmalı!' : 'Photo must be under 2MB!', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => setProfileData({ ...profileData, photo: reader.result });
  reader.readAsDataURL(file);
};

const handleCoverUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) { // 2MB kontrolü
    showToast(language === 'tr' ? 'Kapak boyutu 2MB\'dan küçük olmalı!' : 'Cover must be under 2MB!', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setProfileData({ ...profileData, coverPhoto: reader.result });
    window.dispatchEvent(new CustomEvent('coverPreview', { detail: reader.result }));
  };
  reader.readAsDataURL(file);
};

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...profileData,
        experiences: JSON.stringify(experience),
        educations: JSON.stringify(education)
      };
      await api.put('/api/users/me', payload);
      showToast(language === 'tr' ? 'Profil başarıyla güncellendi!' : 'Profile updated successfully!', 'success');
      window.dispatchEvent(new Event('profileUpdated')); 
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Hata oluştu';
      showToast(language === 'tr' ? `Profil kaydedilemedi: ${errorMsg}` : `Failed: ${errorMsg}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm(
      language === 'tr' 
        ? 'E-posta adresinizi değiştirmek istediğinize emin misiniz?' 
        : 'Are you sure you want to change your email address?'
    );
    if (!isConfirmed) return;

    setSaving(true);
    try {
      await api.put('/api/users/me/email', {
        newEmail: emailUpdate.newEmail,
        currentPassword: emailUpdate.currentPassword
      });
      setProfileData(prev => ({ ...prev, email: emailUpdate.newEmail }));
      setEmailUpdate({ newEmail: '', currentPassword: '' });
      showToast(language === 'tr' ? 'E-posta başarıyla değiştirildi!' : 'Email changed successfully!', 'success');
    } catch (error) {
      const errorMsg = error.response?.data?.error || (language === 'tr' ? 'Bir hata oluştu' : 'An error occurred');
      showToast(language === 'tr' ? `Hata: ${errorMsg}` : `Error: ${errorMsg}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast(language === 'tr' ? 'Yeni şifreler eşleşmiyor!' : 'New passwords do not match!', 'error');
      return;
    }
    
    setSaving(true);
    try {
      await api.put('/api/users/me/password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setPasswords({ current: '', new: '', confirm: '' });
      showToast(language === 'tr' ? 'Şifre başarıyla değiştirildi!' : 'Password changed successfully!', 'success');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Hata oluştu';
      showToast(language === 'tr' ? `Hata: ${errorMsg}` : `Failed: ${errorMsg}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => setExperience([...experience, { id: Date.now(), company: '', role: '', startDate: '', endDate: '', description: '' }]);
  const updateExperience = (id, field, value) => setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  const removeExperience = (id) => setExperience(experience.filter(exp => exp.id !== id));

  const addEducation = () => setEducation([...education, { id: Date.now(), school: '', degree: '', startDate: '', endDate: '', gpa: '' }]);
  const updateEducation = (id, field, value) => setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  const removeEducation = (id) => setEducation(education.filter(edu => edu.id !== id));

  if (loading) {
    return <div className="min-h-full flex items-center justify-center text-gray-500 font-bold animate-pulse">Yükleniyor...</div>;
  }

  const isCustomCover = profileData.coverPhoto && !profileData.coverPhoto.startsWith('bg-');

  return (
    <div className="bg-white dark:bg-twilight rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-100 dark:border-starlight/20 transition-colors duration-500 min-h-full flex flex-col animate-fade-in overflow-hidden relative">
      
      {toast.show && (
        <div className={`absolute top-6 right-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl z-50 animate-fade-in border ${
          toast.type === 'success' 
            ? 'bg-white dark:bg-twilight border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
            : 'bg-white dark:bg-twilight border-cherry/20 text-cherry'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* COVER & HEADER ALANI */}
      <div 
        className={`h-36 md:h-48 relative shrink-0 transition-all duration-700 ease-in-out ${!isCustomCover ? profileData.coverPhoto : 'bg-gray-200 dark:bg-night'}`}
        style={isCustomCover ? { backgroundImage: `url(${profileData.coverPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none"></div>

        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 shadow-sm z-10">
          {COVER_OPTIONS.map((opt, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                setProfileData({ ...profileData, coverPhoto: opt });
                window.dispatchEvent(new CustomEvent('coverPreview', { detail: opt }));
              }}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${profileData.coverPhoto === opt ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'} ${opt.split(' ')[0]} ${opt.split(' ')[1]} ${opt.split(' ')[2]}`}
            />
          ))}
          <div className="w-px h-6 bg-white/30 mx-1"></div>
          <label className="cursor-pointer w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors">
            <ImageIcon size={14} />
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </label>
        </div>

        <div className="absolute -bottom-12 left-6 md:-bottom-16 md:left-10 flex items-end gap-5 z-10">
          <label className="relative w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-white dark:bg-night border-[5px] border-white dark:border-twilight flex flex-col items-center justify-center cursor-pointer hover:border-gray-100 dark:hover:border-starlight transition-colors overflow-hidden group shadow-lg shrink-0">
            {profileData.photo ? (
              <img src={profileData.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={28} />
            </div>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
          <div className="mb-4 hidden sm:block">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {profileData.firstName || 'Adınız'} {profileData.lastName || 'Soyadınız'}
            </h1>
            <p className="text-gray-100 font-bold tracking-widest uppercase text-xs mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {profileData.title || 'Ünvan Belirtilmedi'}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-20 md:pt-24 px-6 md:px-12 pb-8 flex-1 flex flex-col lg:flex-row gap-10">
        
        {/* SOL MENU */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'personal' 
                ? 'bg-gray-100 dark:bg-starlight/20 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-night/50 hover:text-gray-800 dark:hover:text-gray-200 border border-transparent'
            }`}
          >
            <User size={18} strokeWidth={2.5} />
            {language === 'tr' ? 'Kişisel Bilgiler' : 'Personal Info'}
          </button>
          
          <button 
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'resume' 
                ? 'bg-gray-100 dark:bg-starlight/20 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-night/50 hover:text-gray-800 dark:hover:text-gray-200 border border-transparent'
            }`}
          >
            <FileText size={18} strokeWidth={2.5} />
            {language === 'tr' ? 'Eğitim & Deneyim' : 'Resume Data'}
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'security' 
                ? 'bg-gray-100 dark:bg-starlight/20 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-night/50 hover:text-gray-800 dark:hover:text-gray-200 border border-transparent'
            }`}
          >
            <Shield size={18} strokeWidth={2.5} />
            {language === 'tr' ? 'Güvenlik & Şifre' : 'Security & Password'}
          </button>
        </div>

        {/* SAĞ İÇERİK ALANI */}
        <div className="flex-1 max-w-3xl">
          
          {/* KİŞİSEL BİLGİLER */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade-in bg-gray-50/50 dark:bg-night/20 p-8 rounded-[2rem] border border-gray-100 dark:border-starlight/20">
              <h2 className="text-xl font-black text-gray-800 dark:text-white tracking-tight mb-6">{language === 'tr' ? 'Profil Detayları' : 'Profile Details'}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{language === 'tr' ? 'Ad' : 'First Name'}</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-3.5 text-gray-400" />
                    <input type="text" value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{language === 'tr' ? 'Soyad' : 'Last Name'}</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-3.5 text-gray-400" />
                    <input type="text" value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1">{language === 'tr' ? 'E-Posta (Salt Okunur)' : 'Email (Read Only)'} <Lock size={12} /></label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-3.5 text-gray-400" />
                    <input type="email" value={profileData.email} disabled className="w-full bg-gray-100 dark:bg-night border border-gray-200 dark:border-starlight/30 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{language === 'tr' ? 'Telefon' : 'Phone'}</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-3.5 text-gray-400" />
                    <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{language === 'tr' ? 'Konum' : 'Location'}</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-3.5 text-gray-400" />
                    <input type="text" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">LinkedIn</label>
                  <div className="relative">
                    <Linkedin size={16} className="absolute left-4 top-3.5 text-gray-400" />
                    <input type="text" value={profileData.linkedin} onChange={e => setProfileData({...profileData, linkedin: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">GitHub</label>
                  <div className="relative">
                    <Github size={16} className="absolute left-4 top-3.5 text-gray-400" />
                    <input type="text" value={profileData.github} onChange={e => setProfileData({...profileData, github: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{language === 'tr' ? 'Ünvan' : 'Title'}</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-4 top-3.5 text-gray-400" />
                    <input type="text" value={profileData.title} onChange={e => setProfileData({...profileData, title: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{language === 'tr' ? 'Hakkımda' : 'Bio'}</label>
                  <textarea value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl p-4 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 h-24 resize-none custom-scrollbar" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={saving} className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-wider flex items-center gap-2">
                  <Save size={18} /> {saving ? '...' : t('btnSave')}
                </button>
              </div>
            </form>
          )}

          {/* CV EĞİTİM VE DENEYİM TABI */}
          {activeTab === 'resume' && (
            <div className="space-y-8 animate-fade-in bg-gray-50/50 dark:bg-night/20 p-8 rounded-[2rem] border border-gray-100 dark:border-starlight/20">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">{language === 'tr' ? 'CV Bilgileri' : 'Resume Data'}</h2>
                <button onClick={handleSaveProfile} disabled={saving} className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center gap-2">
                  <Save size={14} /> {saving ? '...' : t('btnSave')}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {language === 'tr' ? 'Buraya eklediğiniz eğitim ve deneyim bilgileri, CV oluşturucuda otomatik olarak yer alacaktır.' : 'Education and experience added here will automatically appear in your resume.'}
              </p>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={16} /> Deneyim
                  </h3>
                  <button onClick={addExperience} className="p-1.5 bg-white dark:bg-twilight shadow-sm hover:text-columbia rounded-lg transition-colors text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-starlight/30">
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="p-5 bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl relative group">
                      <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-gray-400 hover:text-cherry transition-colors bg-gray-50 dark:bg-twilight p-1.5 rounded-lg z-10">
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pr-10">
                        <input type="text" placeholder="Şirket" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-columbia" />
                        <input type="text" placeholder="Pozisyon" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-columbia" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <input type="text" placeholder="Başlangıç (Örn: Oca 2024)" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-columbia" />
                        <input type="text" placeholder="Bitiş (Örn: Devam Ediyor)" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-columbia" />
                      </div>
                      <textarea placeholder="Açıklama (Ne yaptınız?)" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-columbia resize-none h-20 custom-scrollbar" />
                    </div>
                  ))}
                  {experience.length === 0 && <p className="text-xs text-gray-400 font-medium text-center italic">Henüz deneyim eklenmedi.</p>}
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap size={16} /> Eğitim
                  </h3>
                  <button onClick={addEducation} className="p-1.5 bg-white dark:bg-twilight shadow-sm hover:text-columbia rounded-lg transition-colors text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-starlight/30">
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-5 bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl relative group">
                      <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-gray-400 hover:text-cherry transition-colors bg-gray-50 dark:bg-twilight p-1.5 rounded-lg z-10">
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-1 gap-3 mb-3 pr-10">
                        <input type="text" placeholder="Okul / Üniversite" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-columbia" />
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <input type="text" placeholder="Bölüm / Derece" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="sm:col-span-3 w-full bg-gray-50 dark:bg-twilight border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-columbia" />
                          <input type="text" placeholder="GPA (Ops)" value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} className="sm:col-span-1 w-full bg-gray-50 dark:bg-twilight border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-columbia" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" placeholder="Başlangıç (Yıl)" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-columbia" />
                        <input type="text" placeholder="Bitiş (Yıl)" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-columbia" />
                      </div>
                    </div>
                  ))}
                  {education.length === 0 && <p className="text-xs text-gray-400 font-medium text-center italic">Henüz eğitim eklenmedi.</p>}
                </div>
              </div>
            </div>
          )}

          {/* GÜVENLİK TABI */}
          {activeTab === 'security' && (
            <div className="space-y-10 animate-fade-in max-w-xl">
              
              <form onSubmit={handleUpdateEmail} className="border-b border-gray-200 dark:border-starlight/20 pb-10">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-gray-800 dark:text-white tracking-tight mb-4">
                    {language === 'tr' ? 'E-Posta Değiştir' : 'Change Email'}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{language === 'tr' ? 'Yeni E-Posta' : 'New Email'}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={16} className="text-gray-400" /></div>
                      <input required type="email" value={emailUpdate.newEmail} onChange={e => setEmailUpdate({...emailUpdate, newEmail: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm font-medium shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{language === 'tr' ? 'Mevcut Şifre (Onay İçin)' : 'Current Password (To Confirm)'}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Key size={16} className="text-gray-400" /></div>
                      <input required type={showEmailPassword ? "text" : "password"} value={emailUpdate.currentPassword} onChange={e => setEmailUpdate({...emailUpdate, currentPassword: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-2xl pl-11 pr-12 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm font-medium shadow-sm" />
                      <button type="button" onClick={() => setShowEmailPassword(!showEmailPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        {showEmailPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button type="submit" disabled={saving} className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-gray-500/20 text-sm uppercase tracking-wider flex items-center gap-2 disabled:opacity-70 w-full md:w-auto justify-center">
                    <Mail size={18} strokeWidth={2.5} />
                    {saving ? (language === 'tr' ? 'Güncelleniyor...' : 'Updating...') : (language === 'tr' ? 'E-Postayı Güncelle' : 'Update Email')}
                  </button>
                </div>
              </form>

              <form onSubmit={handleUpdatePassword}>
                <div className="mb-6">
                  <h2 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">
                    {language === 'tr' ? 'Şifre Değiştir' : 'Change Password'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {language === 'tr' ? 'Hesap güvenliğiniz için güçlü bir şifre seçin.' : 'Choose a strong password for your account security.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{language === 'tr' ? 'Mevcut Şifre' : 'Current Password'}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Key size={16} className="text-gray-400" /></div>
                      <input required type={showCurrentPassword ? "text" : "password"} value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-2xl pl-11 pr-12 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm font-medium shadow-sm" />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{language === 'tr' ? 'Yeni Şifre' : 'New Password'}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock size={16} className="text-gray-400" /></div>
                      <input required type={showNewPassword ? "text" : "password"} value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-2xl pl-11 pr-12 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm font-medium shadow-sm" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{language === 'tr' ? 'Yeni Şifre (Tekrar)' : 'Confirm New Password'}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock size={16} className="text-gray-400" /></div>
                      <input required type={showConfirmPassword ? "text" : "password"} value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 text-gray-800 dark:text-gray-200 rounded-2xl pl-11 pr-12 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm font-medium shadow-sm" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={saving} className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-gray-500/20 text-sm uppercase tracking-wider flex items-center gap-2 disabled:opacity-70 w-full md:w-auto justify-center">
                    <Shield size={18} strokeWidth={2.5} />
                    {saving ? (language === 'tr' ? 'Güncelleniyor...' : 'Updating...') : (language === 'tr' ? 'Şifreyi Güncelle' : 'Update Password')}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}