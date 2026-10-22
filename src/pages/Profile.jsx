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
  const isTr = language === 'tr';
  const fullName = [profileData.firstName, profileData.lastName].filter(Boolean).join(' ') || (isTr ? 'Adını ekle' : 'Add your name');
  const initials = [profileData.firstName, profileData.lastName].filter(Boolean).map(part => part[0]).join('').toUpperCase() || 'P';
  const filledFields = [profileData.firstName, profileData.lastName, profileData.email, profileData.title, profileData.bio, profileData.phone, profileData.location, profileData.linkedin, profileData.github].filter(Boolean).length;
  const completion = Math.round((filledFields / 9) * 100);
  const tabItems = [
    { id: 'personal', icon: User, label: isTr ? 'Kişisel bilgiler' : 'Personal details' },
    { id: 'resume', icon: Briefcase, label: isTr ? 'Eğitim & deneyim' : 'Education & experience' },
    { id: 'security', icon: Shield, label: isTr ? 'Güvenlik' : 'Security' }
  ];

  const fieldClass = 'profile-field w-full rounded-2xl px-4 py-3.5 text-sm transition-all';
  const fieldLabel = 'mb-2 block text-xs font-bold tracking-wide';

  return (
    <div className="pebble-profile min-h-full space-y-5 pb-8 animate-fade-in">
      {toast.show && (
        <div className={\`profile-toast \${toast.type === 'success' ? 'profile-toast-success' : 'profile-toast-error'}\`} role="status">
          {toast.type === 'success' ? <CheckCircle2 size={19} /> : <AlertCircle size={19} />}
          <span>{toast.message}</span>
        </div>
      )}

      <section className="profile-cover">
        <div className="profile-cover-art" />
        <div className="profile-cover-orbit profile-cover-orbit-one" />
        <div className="profile-cover-orbit profile-cover-orbit-two" />
        <div className="profile-cover-leaf profile-cover-leaf-one">✳</div>
        <div className="profile-cover-leaf profile-cover-leaf-two">✿</div>

        <div className="profile-cover-tools">
          <span>{isTr ? 'KAPAK GÖRÜNÜMÜ' : 'COVER STYLE'}</span>
          {COVER_OPTIONS.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={isTr ? \`Kapak rengi \${idx + 1}\` : \`Cover color \${idx + 1}\`}
              onClick={() => {
                setProfileData(prev => ({ ...prev, coverPhoto: opt }));
                window.dispatchEvent(new CustomEvent('coverPreview', { detail: opt }));
              }}
              className={\`profile-cover-swatch profile-cover-swatch-\${idx} \${profileData.coverPhoto === opt ? 'is-selected' : ''}\`}
            />
          ))}
          <label className="profile-cover-upload" title={isTr ? 'Kapak fotoğrafı yükle' : 'Upload cover photo'}>
            <ImageIcon size={15} />
            <input type="file" accept="image/*" onChange={handleCoverUpload} />
          </label>
        </div>

        <div className="profile-cover-content">
          <label className="profile-avatar">
            {profileData.photo ? <img src={profileData.photo} alt={isTr ? 'Profil fotoğrafı' : 'Profile'} /> : <span>{initials}</span>}
            <span className="profile-avatar-edit"><Camera size={17} /></span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          </label>
          <div className="profile-identity">
            <div className="profile-identity-eyebrow"><span className="profile-status-dot" />{isTr ? 'KARİYER ALANIN' : 'YOUR CAREER SPACE'}</div>
            <h1>{fullName}</h1>
            <p>{profileData.title || (isTr ? 'Kariyer unvanını ekle' : 'Add your professional title')}</p>
            {profileData.location && <span className="profile-location"><MapPin size={14} />{profileData.location}</span>}
          </div>
          <div className="profile-cover-note">
            <Sparkles size={17} />
            <span>{isTr ? 'Küçük adımlar, büyük hayaller.' : 'Small steps, big dreams.'}</span>
          </div>
        </div>
      </section>

      <div className="profile-topline">
        <div>
          <p className="profile-eyebrow">{isTr ? 'KİŞİSEL ALANIN' : 'YOUR PERSONAL SPACE'}</p>
          <h2>{isTr ? 'Profilini şekillendir' : 'Shape your profile'}</h2>
          <p className="profile-subtitle">{isTr ? 'Hikâyeni, deneyimini ve hedeflerini tek bir yerde bir araya getir.' : 'Bring your story, experience and goals together in one place.'}</p>
        </div>
        <div className="profile-completion">
          <div className="profile-completion-ring" style={{ '--profile-progress': \`\${completion}%\` }}><span>{completion}%</span></div>
          <div><strong>{isTr ? 'Profil tamamlandı' : 'Profile complete'}</strong><small>{isTr ? 'Her küçük detay fark yaratır.' : 'Every little detail matters.'}</small></div>
        </div>
      </div>

      <nav className="profile-tabs" aria-label={isTr ? 'Profil bölümleri' : 'Profile sections'}>
        {tabItems.map(({ id, icon: Icon, label }) => (
          <button key={id} type="button" onClick={() => setActiveTab(id)} className={\`profile-tab \${activeTab === id ? 'is-active' : ''}\`}>
            <span className="profile-tab-icon"><Icon size={17} /></span>
            <span>{label}</span>
            {activeTab === id && <span className="profile-tab-indicator" />}
          </button>
        ))}
      </nav>

      <div className="profile-content-grid">
        <aside className="profile-side-column">
          <section className="profile-side-card profile-tip-card">
            <div className="profile-card-icon profile-icon-lilac"><Sparkles size={19} /></div>
            <p className="profile-card-eyebrow">{isTr ? 'KÜÇÜK BİR HATIRLATMA' : 'A LITTLE REMINDER'}</p>
            <h3>{isTr ? 'Bu hikâye sana ait.' : 'This story is yours.'}</h3>
            <p>{isTr ? 'Güçlü bir profil; becerilerini, yolculuğunu ve sıradaki hedefini görünür kılar.' : 'A thoughtful profile makes your skills, journey and next goal easier to see.'}</p>
            <div className="profile-tip-decoration">✳</div>
          </section>

          <section className="profile-side-card profile-quick-card">
            <div className="profile-card-heading"><span className="profile-card-icon profile-icon-sage"><CheckCircle2 size={18} /></span><h3>{isTr ? 'Profil özeti' : 'Profile snapshot'}</h3></div>
            <div className="profile-quick-row"><span>{isTr ? 'İletişim bilgileri' : 'Contact details'}</span><strong>{[profileData.email, profileData.phone, profileData.location].filter(Boolean).length}/3</strong></div>
            <div className="profile-mini-track"><span style={{ width: \`\${Math.round(([profileData.email, profileData.phone, profileData.location].filter(Boolean).length / 3) * 100)}%\` }} /></div>
            <div className="profile-quick-row"><span>{isTr ? 'Deneyim' : 'Experience'}</span><strong>{experience.length}</strong></div>
            <div className="profile-quick-row"><span>{isTr ? 'Eğitim' : 'Education'}</span><strong>{education.length}</strong></div>
            <div className="profile-quick-footer"><Shield size={15} />{isTr ? 'Bilgilerin hesabına özeldir.' : 'Your details stay in your account.'}</div>
          </section>
        </aside>

        <section className="profile-main-card">
          {activeTab === 'personal' && (
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="profile-panel-heading">
                <div><p className="profile-eyebrow">{isTr ? 'SENİ TANIYALIM' : 'GET TO KNOW YOU'}</p><h2>{isTr ? 'Kişisel bilgiler' : 'Personal details'}</h2><p>{isTr ? 'Kariyer profilinde görünmesini istediğin bilgileri düzenle.' : 'Edit the details you want to show on your career profile.'}</p></div>
                <span className="profile-panel-illustration"><User size={23} /></span>
              </div>

              <div className="profile-form-section">
                <h3><span>01</span>{isTr ? 'Temel bilgiler' : 'Basic information'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={fieldLabel}>{isTr ? 'Ad' : 'First name'}</label><input className={fieldClass} type="text" value={profileData.firstName} onChange={e => setProfileData({ ...profileData, firstName: e.target.value })} placeholder={isTr ? 'Adın' : 'Your first name'} /></div>
                  <div><label className={fieldLabel}>{isTr ? 'Soyad' : 'Last name'}</label><input className={fieldClass} type="text" value={profileData.lastName} onChange={e => setProfileData({ ...profileData, lastName: e.target.value })} placeholder={isTr ? 'Soyadın' : 'Your last name'} /></div>
                  <div className="md:col-span-2"><label className={fieldLabel}>{isTr ? 'E-posta adresi' : 'Email address'} <span className="profile-readonly-label"><Lock size={11} />{isTr ? 'Değiştirmek için Güvenlik sekmesi' : 'Change via Security tab'}</span></label><input className={\`\${fieldClass} profile-field-locked\`} type="email" value={profileData.email} disabled /></div>
                  <div><label className={fieldLabel}>{isTr ? 'Telefon' : 'Phone'}</label><div className="profile-input-wrap"><Phone size={16} /><input className={fieldClass} type="text" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+90 ..." /></div></div>
                  <div><label className={fieldLabel}>{isTr ? 'Konum' : 'Location'}</label><div className="profile-input-wrap"><MapPin size={16} /><input className={fieldClass} type="text" value={profileData.location} onChange={e => setProfileData({ ...profileData, location: e.target.value })} placeholder={isTr ? 'Şehir, ülke' : 'City, country'} /></div></div>
                </div>
              </div>

              <div className="profile-form-section">
                <h3><span>02</span>{isTr ? 'Profesyonel kimlik' : 'Professional identity'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2"><label className={fieldLabel}>{isTr ? 'Mesleki unvan' : 'Professional title'}</label><div className="profile-input-wrap"><Briefcase size={16} /><input className={fieldClass} type="text" value={profileData.title} onChange={e => setProfileData({ ...profileData, title: e.target.value })} placeholder={isTr ? 'Örn. Java Backend Developer' : 'e.g. Java Backend Developer'} /></div></div>
                  <div><label className={fieldLabel}>LinkedIn</label><div className="profile-input-wrap"><Linkedin size={16} /><input className={fieldClass} type="text" value={profileData.linkedin} onChange={e => setProfileData({ ...profileData, linkedin: e.target.value })} placeholder="linkedin.com/in/..." /></div></div>
                  <div><label className={fieldLabel}>GitHub</label><div className="profile-input-wrap"><Github size={16} /><input className={fieldClass} type="text" value={profileData.github} onChange={e => setProfileData({ ...profileData, github: e.target.value })} placeholder="github.com/..." /></div></div>
                  <div className="md:col-span-2"><label className={fieldLabel}>{isTr ? 'Hakkımda' : 'About me'}</label><textarea className={\`\${fieldClass} profile-bio-field\`} value={profileData.bio} onChange={e => setProfileData({ ...profileData, bio: e.target.value })} placeholder={isTr ? 'Kendinden, ilgi alanlarından ve kariyer hedeflerinden bahset...' : 'Tell us about yourself, your interests and career goals...'} rows={5} /><small className="profile-field-hint">{isTr ? 'Kısa ve samimi bir özet yeterli. Neyi öğrenmekte olduğunu da anlatabilirsin.' : 'A short, authentic summary is enough. You can mention what you are learning too.'}</small></div>
                </div>
              </div>

              <div className="profile-form-footer"><span><Shield size={15} />{isTr ? 'Değişikliklerin yalnızca sen Kaydet dediğinde uygulanır.' : 'Changes apply when you select Save.'}</span><button type="submit" disabled={saving} className="profile-save-button"><Save size={17} />{saving ? (isTr ? 'Kaydediliyor…' : 'Saving…') : (isTr ? 'Değişiklikleri kaydet' : 'Save changes')}</button></div>
            </form>
          )}

          {activeTab === 'resume' && (
            <div className="profile-form">
              <div className="profile-panel-heading">
                <div><p className="profile-eyebrow">{isTr ? 'KARİYER YOLCULUĞUN' : 'YOUR CAREER JOURNEY'}</p><h2>{isTr ? 'Eğitim & deneyim' : 'Education & experience'}</h2><p>{isTr ? 'Buradaki bilgiler CV oluşturucunda kullanılacak.' : 'These details will be used by your resume builder.'}</p></div>
                <span className="profile-panel-illustration profile-illustration-peach"><GraduationCap size={24} /></span>
              </div>

              <div className="profile-form-section">
                <div className="profile-section-title-row"><h3><span>01</span>{isTr ? 'İş deneyimi' : 'Work experience'}</h3><button type="button" onClick={addExperience} className="profile-add-button"><Plus size={16} />{isTr ? 'Deneyim ekle' : 'Add experience'}</button></div>
                {experience.length === 0 && <div className="profile-empty-state"><span><Briefcase size={23} /></span><strong>{isTr ? 'İlk deneyimini ekle' : 'Add your first experience'}</strong><p>{isTr ? 'Stajlar, yarı zamanlı işler ve projelerdeki rollerin de burada yer alabilir.' : 'Internships, part-time jobs and project roles can go here too.'}</p></div>}
                <div className="space-y-4">{experience.map((exp, index) => (
                  <div key={exp.id} className="profile-entry-card"><div className="profile-entry-number">{String(index + 1).padStart(2, '0')}</div><button type="button" onClick={() => removeExperience(exp.id)} className="profile-remove-button" aria-label={isTr ? 'Deneyimi sil' : 'Remove experience'}><Trash2 size={15} /></button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input className={fieldClass} type="text" placeholder={isTr ? 'Şirket / kurum' : 'Company / organization'} value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                      <input className={fieldClass} type="text" placeholder={isTr ? 'Pozisyon' : 'Role'} value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} />
                      <input className={fieldClass} type="text" placeholder={isTr ? 'Başlangıç (Oca 2024)' : 'Start (Jan 2024)'} value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
                      <input className={fieldClass} type="text" placeholder={isTr ? 'Bitiş (Devam ediyor)' : 'End (Present)'} value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} />
                      <textarea className={\`\${fieldClass} sm:col-span-2\`} rows={3} placeholder={isTr ? 'Sorumlulukların ve katkıların' : 'Your responsibilities and contributions'} value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} />
                    </div>
                  </div>
                ))}</div>
              </div>

              <div className="profile-form-section">
                <div className="profile-section-title-row"><h3><span>02</span>{isTr ? 'Eğitim' : 'Education'}</h3><button type="button" onClick={addEducation} className="profile-add-button"><Plus size={16} />{isTr ? 'Eğitim ekle' : 'Add education'}</button></div>
                {education.length === 0 && <div className="profile-empty-state profile-empty-sage"><span><GraduationCap size={23} /></span><strong>{isTr ? 'Eğitim geçmişini ekle' : 'Add your education'}</strong><p>{isTr ? 'Üniversite, bölüm ve mezuniyet bilgilerini ekleyebilirsin.' : 'Add your university, degree and graduation details.'}</p></div>}
                <div className="space-y-4">{education.map((edu, index) => (
                  <div key={edu.id} className="profile-entry-card"><div className="profile-entry-number profile-number-sage">{String(index + 1).padStart(2, '0')}</div><button type="button" onClick={() => removeEducation(edu.id)} className="profile-remove-button" aria-label={isTr ? 'Eğitimi sil' : 'Remove education'}><Trash2 size={15} /></button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input className={\`\${fieldClass} sm:col-span-2\`} type="text" placeholder={isTr ? 'Okul / üniversite' : 'School / university'} value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} />
                      <input className={fieldClass} type="text" placeholder={isTr ? 'Bölüm / derece' : 'Degree / field of study'} value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                      <input className={fieldClass} type="text" placeholder="GPA (opsiyonel)" value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} />
                      <input className={fieldClass} type="text" placeholder={isTr ? 'Başlangıç yılı' : 'Start year'} value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
                      <input className={fieldClass} type="text" placeholder={isTr ? 'Bitiş yılı' : 'End year'} value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} />
                    </div>
                  </div>
                ))}</div>
              </div>
              <div className="profile-form-footer"><span><FileText size={15} />{isTr ? 'CV bilgilerin burada saklanır.' : 'Your resume details are saved here.'}</span><button type="button" onClick={handleSaveProfile} disabled={saving} className="profile-save-button"><Save size={17} />{saving ? (isTr ? 'Kaydediliyor…' : 'Saving…') : (isTr ? 'Bilgileri kaydet' : 'Save details')}</button></div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-form">
              <div className="profile-panel-heading">
                <div><p className="profile-eyebrow">{isTr ? 'HESABININ KONTROLÜ SENDE' : 'YOU ARE IN CONTROL'}</p><h2>{isTr ? 'Güvenlik ayarları' : 'Security settings'}</h2><p>{isTr ? 'E-posta ve şifre değişikliklerini buradan yönet.' : 'Manage your email and password here.'}</p></div>
                <span className="profile-panel-illustration profile-illustration-sage"><Shield size={24} /></span>
              </div>
              <form onSubmit={handleUpdateEmail} className="profile-security-block">
                <div className="profile-security-heading"><span className="profile-card-icon profile-icon-lilac"><Mail size={18} /></span><div><h3>{isTr ? 'E-posta adresini değiştir' : 'Change email address'}</h3><p>{isTr ? 'Yeni adresi doğrulamak için mevcut şifren gerekir.' : 'Your current password is required to confirm the change.'}</p></div></div>
                <label className={fieldLabel}>{isTr ? 'Yeni e-posta' : 'New email'}</label><input required className={fieldClass} type="email" value={emailUpdate.newEmail} onChange={e => setEmailUpdate({ ...emailUpdate, newEmail: e.target.value })} placeholder="name@example.com" />
                <label className={\`\${fieldLabel} mt-4\`}>{isTr ? 'Mevcut şifre' : 'Current password'}</label>
                <div className="profile-password-wrap"><input required className={fieldClass} type={showEmailPassword ? 'text' : 'password'} value={emailUpdate.currentPassword} onChange={e => setEmailUpdate({ ...emailUpdate, currentPassword: e.target.value })} /><button type="button" onClick={() => setShowEmailPassword(!showEmailPassword)} aria-label={showEmailPassword ? 'Hide password' : 'Show password'}>{showEmailPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
                <button type="submit" disabled={saving} className="profile-save-button mt-5"><Mail size={16} />{saving ? '…' : (isTr ? 'E-postayı güncelle' : 'Update email')}</button>
              </form>

              <form onSubmit={handleUpdatePassword} className="profile-security-block">
                <div className="profile-security-heading"><span className="profile-card-icon profile-icon-peach"><Key size={18} /></span><div><h3>{isTr ? 'Şifreni yenile' : 'Update your password'}</h3><p>{isTr ? 'Hesabını korumak için güçlü ve benzersiz bir şifre kullan.' : 'Use a strong, unique password to protect your account.'}</p></div></div>
                {[
                  { key: 'current', label: isTr ? 'Mevcut şifre' : 'Current password', show: showCurrentPassword, setShow: setShowCurrentPassword },
                  { key: 'new', label: isTr ? 'Yeni şifre' : 'New password', show: showNewPassword, setShow: setShowNewPassword },
                  { key: 'confirm', label: isTr ? 'Yeni şifreyi doğrula' : 'Confirm new password', show: showConfirmPassword, setShow: setShowConfirmPassword }
                ].map(item => (
                  <div key={item.key} className="mt-4"><label className={fieldLabel}>{item.label}</label><div className="profile-password-wrap"><input required className={fieldClass} type={item.show ? 'text' : 'password'} value={passwords[item.key]} onChange={e => setPasswords({ ...passwords, [item.key]: e.target.value })} /><button type="button" onClick={() => item.setShow(!item.show)} aria-label={item.show ? 'Hide password' : 'Show password'}>{item.show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
                ))}
                <button type="submit" disabled={saving} className="profile-save-button mt-5"><Shield size={16} />{saving ? '…' : (isTr ? 'Şifreyi güncelle' : 'Update password')}</button>
              </form>
              <div className="profile-security-note"><Lock size={16} /><p>{isTr ? 'Güvenliğin için şifreni kimseyle paylaşma ve farklı sitelerde aynı şifreyi kullanmamaya çalış.' : 'For your security, never share your password or reuse it across websites.'}</p></div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
