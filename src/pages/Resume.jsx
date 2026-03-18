import html2pdf from 'html2pdf.js';
import { BookOpen, Briefcase, Camera, Code, Download, Github, Globe, GraduationCap, Linkedin, Mail, MapPin, Phone, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function Resume() {
  const { t, language } = useLanguage();

  // CV Dili
  const [cvLang, setCvLang] = useState('tr');

  // Gelişim sayfasından çekilecek veriler
  const [devData, setDevData] = useState({ projects: [], courses: [], skills: [] });
  const [loading, setLoading] = useState(true);

  // Kategorilerin genel görünürlüğü
  const [options, setOptions] = useState({
    showProjects: true,
    showCourses: true,
    showSkills: true
  });

  // Kullanıcının "tek tek" seçtiği verilerin ID'lerini tutar
  const [selectedDevItems, setSelectedDevItems] = useState({
    projects: [],
    courses: [],
    skills: []
  });

  // CV Form State'leri
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Şeyda Gül',
    lastName: 'Topal',
    title: 'Software Engineer',
    email: 'seydagultopal0@gmail.com',
    phone: '',
    location: '',
    summary: '',
    photo: null,
    linkedin: '',
    github: '',
    website: ''
  });

  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    fetchDevelopmentData();
  }, []);

  const fetchDevelopmentData = async () => {
    try {
      setLoading(true);
      const [coursesRes, projectsRes, skillsRes] = await Promise.all([
        api.get('/api/development/courses').catch(() => ({ data: [] })),
        api.get('/api/development/projects').catch(() => ({ data: [] })),
        api.get('/api/development/skills').catch(() => ({ data: [] }))
      ]);

      const courses = coursesRes.data || [];
      const projects = projectsRes.data || [];
      const skills = skillsRes.data || [];

      setDevData({ courses, projects, skills });
      
      setSelectedDevItems({
        courses: courses.map(c => c.id),
        projects: projects.map(p => p.id),
        skills: skills.map(s => s.id)
      });

    } catch (error) {
      console.error("Veriler çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDevItem = (category, id) => {
    setSelectedDevItems(prev => {
      const list = prev[category];
      if (list.includes(id)) {
        return { ...prev, [category]: list.filter(itemId => itemId !== id) };
      } else {
        return { ...prev, [category]: [...list, id] };
      }
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalInfo({ ...personalInfo, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => setExperience([...experience, { id: Date.now(), company: '', role: '', startDate: '', endDate: '', description: '' }]);
  const updateExperience = (id, field, value) => setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  const removeExperience = (id) => setExperience(experience.filter(exp => exp.id !== id));

  const addEducation = () => setEducation([...education, { id: Date.now(), school: '', degree: '', startDate: '', endDate: '', gpa: '' }]);
  const updateEducation = (id, field, value) => setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  const removeEducation = (id) => setEducation(education.filter(edu => edu.id !== id));

  const downloadPDF = () => {
    const element = document.getElementById('cv-preview');
    const opt = {
      margin: 0, 
      filename: `${personalInfo.firstName}_${personalInfo.lastName}_CV.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        windowWidth: 800 // Ekranda nasıl görünürse görünsün PDF'i her zaman 800px genişliğinde çizer (kaymaları kesin engeller)
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'css', avoid: '.break-inside-avoid' } 
    };
    html2pdf().set(opt).from(element).save();
  };

  const cvT = (key) => {
    const dict = {
      'tr': { summary: 'Profil Özeti', exp: 'Deneyim', edu: 'Eğitim', skills: 'Yetenekler', pro: 'Öne Çıkan Projeler', cert: 'Sertifikalar', present: 'Devam Ediyor', gpa: 'GNO' },
      'en': { summary: 'Profile Summary', exp: 'Experience', edu: 'Education', skills: 'Skills', pro: 'Featured Projects', cert: 'Certificates', present: 'Present', gpa: 'GPA' }
    };
    return dict[cvLang][key] || key;
  };

  return (
    <div className="bg-white dark:bg-twilight rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none p-6 md:p-8 border border-gray-100 dark:border-starlight/20 transition-colors duration-500 min-h-full flex flex-col xl:flex-row gap-8 animate-fade-in">
      
      {/* SOL KISIM: FORM ALANI */}
      <div className="w-full xl:w-5/12 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10 max-h-[calc(100vh-120px)]">
        
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">CV Oluşturucu</h2>
            <button 
              onClick={() => setCvLang(cvLang === 'tr' ? 'en' : 'tr')} 
              className="px-3 py-1.5 bg-gray-100 dark:bg-night text-gray-600 dark:text-gray-300 font-black rounded-lg text-xs hover:bg-gray-200 dark:hover:bg-starlight/20 transition-all border border-gray-200 dark:border-starlight/30"
            >
              Dil: {cvLang.toUpperCase()}
            </button>
          </div>
          <button onClick={downloadPDF} className="bg-columbia text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-columbia/30">
            <Download size={16} strokeWidth={3} /> PDF İndir
          </button>
        </div>

        {/* 1. Kişisel Bilgiler */}
        <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] p-6 border border-gray-100 dark:border-starlight/20 space-y-4 shrink-0">
          <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <MapPin size={16} /> Kişisel Bilgiler
          </h3>
          
          <div className="flex gap-4 items-center">
            <label className="relative w-24 h-24 rounded-2xl bg-gray-200 dark:bg-night border-2 border-dashed border-gray-300 dark:border-starlight/50 flex flex-col items-center justify-center cursor-pointer hover:border-columbia transition-colors overflow-hidden group shrink-0">
              {personalInfo.photo ? (
                <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera size={24} className="text-gray-400 group-hover:text-columbia transition-colors" />
              )}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Ad" value={personalInfo.firstName} onChange={e => setPersonalInfo({...personalInfo, firstName: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-columbia transition-all" />
                <input type="text" placeholder="Soyad" value={personalInfo.lastName} onChange={e => setPersonalInfo({...personalInfo, lastName: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-columbia transition-all" />
              </div>
              <input type="text" placeholder="Meslek / Ünvan (Örn: Software Engineer)" value={personalInfo.title} onChange={e => setPersonalInfo({...personalInfo, title: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-columbia transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <input type="email" placeholder="E-posta" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-columbia transition-all" />
            <input type="text" placeholder="Telefon" value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-columbia transition-all" />
            <input type="text" placeholder="Konum (Örn: İstanbul, Türkiye)" value={personalInfo.location} onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-columbia transition-all sm:col-span-2" />
            
            <input type="text" placeholder="LinkedIn URL" value={personalInfo.linkedin} onChange={e => setPersonalInfo({...personalInfo, linkedin: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-columbia transition-all" />
            <input type="text" placeholder="GitHub URL" value={personalInfo.github} onChange={e => setPersonalInfo({...personalInfo, github: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-columbia transition-all" />
            <input type="text" placeholder="Kişisel Web Sitesi" value={personalInfo.website} onChange={e => setPersonalInfo({...personalInfo, website: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-columbia transition-all sm:col-span-2" />
            
            <textarea placeholder="Hakkımda (Kısa özet)" value={personalInfo.summary} onChange={e => setPersonalInfo({...personalInfo, summary: e.target.value})} className="w-full bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-columbia transition-all sm:col-span-2 resize-none h-20 custom-scrollbar" />
          </div>
        </div>

        {/* 2. Pebble Entegrasyon Opsiyonları */}
        <div className="bg-columbia/5 dark:bg-columbia/10 rounded-[2rem] p-6 border border-columbia/20 dark:border-columbia/20 shrink-0">
          <h3 className="text-sm font-black text-columbia dark:text-columbia/90 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Code size={16} /> Pebble Verilerimi Ekle
          </h3>
          <div className="space-y-4">
            
            {/* Projeler */}
            <div>
              <label className="flex items-center justify-between p-3 bg-white dark:bg-twilight rounded-xl cursor-pointer shadow-sm border border-gray-100 dark:border-starlight/20">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Projelerimi Göster ({devData.projects.length})</span>
                <input type="checkbox" checked={options.showProjects} onChange={e => setOptions({...options, showProjects: e.target.checked})} className="w-5 h-5 accent-columbia cursor-pointer" />
              </label>
              {options.showProjects && devData.projects.length > 0 && (
                <div className="pl-3 mt-2 space-y-1.5 border-l-2 border-columbia/20">
                  {devData.projects.map(p => (
                    <label key={p.id} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={selectedDevItems.projects.includes(p.id)} onChange={() => toggleDevItem('projects', p.id)} className="accent-columbia" />
                      {p.title}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Kurslar */}
            <div>
              <label className="flex items-center justify-between p-3 bg-white dark:bg-twilight rounded-xl cursor-pointer shadow-sm border border-gray-100 dark:border-starlight/20">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Sertifikalarımı Göster ({devData.courses.length})</span>
                <input type="checkbox" checked={options.showCourses} onChange={e => setOptions({...options, showCourses: e.target.checked})} className="w-5 h-5 accent-columbia cursor-pointer" />
              </label>
              {options.showCourses && devData.courses.length > 0 && (
                <div className="pl-3 mt-2 space-y-1.5 border-l-2 border-columbia/20">
                  {devData.courses.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={selectedDevItems.courses.includes(c.id)} onChange={() => toggleDevItem('courses', c.id)} className="accent-columbia" />
                      {c.title}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Yetenekler */}
            <div>
              <label className="flex items-center justify-between p-3 bg-white dark:bg-twilight rounded-xl cursor-pointer shadow-sm border border-gray-100 dark:border-starlight/20">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yeteneklerimi Göster ({devData.skills.length})</span>
                <input type="checkbox" checked={options.showSkills} onChange={e => setOptions({...options, showSkills: e.target.checked})} className="w-5 h-5 accent-columbia cursor-pointer" />
              </label>
              {options.showSkills && devData.skills.length > 0 && (
                <div className="pl-3 mt-2 space-y-1.5 border-l-2 border-columbia/20">
                  {devData.skills.map(s => (
                    <label key={s.id} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={selectedDevItems.skills.includes(s.id)} onChange={() => toggleDevItem('skills', s.id)} className="accent-columbia" />
                      {s.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 3. İş & Staj Deneyimi */}
        <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] p-6 border border-gray-100 dark:border-starlight/20 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={16} /> Deneyim
            </h3>
            <button onClick={addExperience} className="p-1.5 bg-gray-200 dark:bg-night hover:bg-columbia hover:text-white rounded-lg transition-colors text-gray-600 dark:text-gray-300">
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
          
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="p-4 bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl relative group">
                <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 text-gray-400 hover:text-cherry transition-colors opacity-0 group-hover:opacity-100 bg-gray-50 dark:bg-twilight p-1.5 rounded-lg z-10">
                  <Trash2 size={14} />
                </button>
                <div className="grid grid-cols-2 gap-2 mb-2 pr-8">
                  <input type="text" placeholder="Şirket" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-columbia" />
                  <input type="text" placeholder="Pozisyon" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-columbia" />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input type="text" placeholder="Başlangıç (Örn: Oca 2024)" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-columbia" />
                  <input type="text" placeholder="Bitiş (Örn: Devam Ediyor)" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-columbia" />
                </div>
                <textarea placeholder="Açıklama (Ne yaptınız?)" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-columbia resize-none h-16 custom-scrollbar" />
              </div>
            ))}
            {experience.length === 0 && <p className="text-xs text-gray-400 font-medium text-center italic">Henüz deneyim eklenmedi.</p>}
          </div>
        </div>

        {/* 4. Eğitim */}
        <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] p-6 border border-gray-100 dark:border-starlight/20 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <GraduationCap size={16} /> Eğitim
            </h3>
            <button onClick={addEducation} className="p-1.5 bg-gray-200 dark:bg-night hover:bg-columbia hover:text-white rounded-lg transition-colors text-gray-600 dark:text-gray-300">
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
          
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="p-4 bg-white dark:bg-night/50 border border-gray-200 dark:border-starlight/30 rounded-2xl relative group">
                <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 text-gray-400 hover:text-cherry transition-colors opacity-0 group-hover:opacity-100 bg-gray-50 dark:bg-twilight p-1.5 rounded-lg z-10">
                  <Trash2 size={14} />
                </button>
                <div className="grid grid-cols-1 gap-2 mb-2 pr-8">
                  <input type="text" placeholder="Okul / Üniversite" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-columbia" />
                  <div className="grid grid-cols-4 gap-2">
                    <input type="text" placeholder="Bölüm / Derece" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="col-span-3 w-full bg-gray-50 dark:bg-twilight border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-columbia" />
                    <input type="text" placeholder="GPA (Ops)" value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} className="col-span-1 w-full bg-gray-50 dark:bg-twilight border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-columbia" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Başlangıç (Yıl)" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-columbia" />
                  <input type="text" placeholder="Bitiş (Yıl)" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} className="w-full bg-gray-50 dark:bg-twilight border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-columbia" />
                </div>
              </div>
            ))}
            {education.length === 0 && <p className="text-xs text-gray-400 font-medium text-center italic">Henüz eğitim eklenmedi.</p>}
          </div>
        </div>

      </div>

      {/* SAĞ KISIM: CANLI ÖNİZLEME (Responsive Ekran Tasarımı) */}
      <div className="w-full xl:w-7/12 bg-gray-200/50 dark:bg-black/20 rounded-[2.5rem] p-4 sm:p-8 flex justify-center overflow-auto custom-scrollbar">
        
        {/* CV KAĞIDI: Sitede düzgün esneyecek şekilde w-full ve max-w-[800px] kullanıldı. */}
        <div 
          id="cv-preview" 
          className="bg-white !bg-white shadow-2xl shrink-0 text-left w-full max-w-[800px] mx-auto"
          style={{ 
            padding: '40px',
            minHeight: '1060px' // A4 oranına yakın güvenli yükseklik (sayfanın boş hissettirmemesi için)
          }}
        >
          {/* HEADER */}
          <div className="flex items-center gap-6 border-b-2 border-gray-800 !border-gray-800 pb-6 mb-6 break-inside-avoid">
            {personalInfo.photo && (
              <img src={personalInfo.photo} alt="CV Profile" className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 !border-gray-100 shrink-0" />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-black text-gray-900 !text-gray-900 tracking-tight uppercase leading-none mb-1">
                {personalInfo.firstName} <span className="text-blue-600 !text-blue-600">{personalInfo.lastName}</span>
              </h1>
              <h2 className="text-lg font-bold text-gray-600 !text-gray-600 uppercase tracking-widest mb-3">
                {personalInfo.title || 'Meslek Ünvanı'}
              </h2>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-gray-500 !text-gray-500">
                {personalInfo.email && <div className="flex items-center gap-1"><Mail size={12} className="shrink-0"/> {personalInfo.email}</div>}
                {personalInfo.phone && <div className="flex items-center gap-1"><Phone size={12} className="shrink-0"/> {personalInfo.phone}</div>}
                {personalInfo.location && <div className="flex items-center gap-1"><MapPin size={12} className="shrink-0"/> {personalInfo.location}</div>}
                {personalInfo.linkedin && <div className="flex items-center gap-1"><Linkedin size={12} className="shrink-0"/> {personalInfo.linkedin}</div>}
                {personalInfo.github && <div className="flex items-center gap-1"><Github size={12} className="shrink-0"/> {personalInfo.github}</div>}
                {personalInfo.website && <div className="flex items-center gap-1"><Globe size={12} className="shrink-0"/> {personalInfo.website}</div>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            
            {/* SOL KOLON (%35 Genişlik) */}
            <div className="col-span-4 space-y-6">
              
              {/* Eğitim */}
              {education.length > 0 && (
                <div className="break-inside-avoid">
                  <h3 className="text-sm font-black text-gray-900 !text-gray-900 uppercase tracking-widest border-b border-gray-300 !border-gray-300 pb-1 mb-3 flex items-center gap-1.5"><GraduationCap size={14} className="shrink-0"/> {cvT('edu')}</h3>
                  <div className="space-y-3">
                    {education.map(edu => (
                      <div key={edu.id} className="break-inside-avoid">
                        <p className="text-[10px] font-bold text-gray-400 !text-gray-400">{edu.startDate} - {edu.endDate || cvT('present')}</p>
                        <p className="text-[12px] font-bold text-gray-800 !text-gray-800 leading-tight">
                          {edu.degree} {edu.gpa && <span className="text-gray-500 !text-gray-500"> | {cvT('gpa')}: {edu.gpa}</span>}
                        </p>
                        <p className="text-[11px] text-gray-500 !text-gray-500">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pebble Yetenekleri */}
              {options.showSkills && devData.skills.filter(s => selectedDevItems.skills.includes(s.id)).length > 0 && (
                <div className="break-inside-avoid">
                  <h3 className="text-sm font-black text-gray-900 !text-gray-900 uppercase tracking-widest border-b border-gray-300 !border-gray-300 pb-1 mb-3 flex items-center gap-1.5"><Code size={14} className="shrink-0"/> {cvT('skills')}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {devData.skills.filter(s => selectedDevItems.skills.includes(s.id)).map(skill => (
                      <span key={skill.id} className="bg-gray-100 !bg-gray-100 text-gray-700 !text-gray-700 text-[10px] font-bold px-2 py-1 rounded-md">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pebble Sertifikalar/Kurslar */}
              {options.showCourses && devData.courses.filter(c => selectedDevItems.courses.includes(c.id) && (c.status === 'COMPLETED' || c.progress === 100)).length > 0 && (
                <div className="break-inside-avoid">
                  <h3 className="text-sm font-black text-gray-900 !text-gray-900 uppercase tracking-widest border-b border-gray-300 !border-gray-300 pb-1 mb-3 flex items-center gap-1.5"><BookOpen size={14} className="shrink-0"/> {cvT('cert')}</h3>
                  <ul className="list-disc list-inside text-[11px] text-gray-700 !text-gray-700 space-y-1">
                    {devData.courses.filter(c => selectedDevItems.courses.includes(c.id) && (c.status === 'COMPLETED' || c.progress === 100)).map(course => (
                      <li key={course.id} className="leading-tight break-inside-avoid">
                        <span className="font-bold">{course.title}</span> <br/>
                        <span className="text-[9px] text-gray-400 !text-gray-400 ml-3">{course.platform}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* SAĞ KOLON (%65 Genişlik) */}
            <div className="col-span-8 space-y-6">
              
              {/* Profil Özeti */}
              {personalInfo.summary && (
                <div className="break-inside-avoid">
                  <h3 className="text-sm font-black text-gray-900 !text-gray-900 uppercase tracking-widest border-b border-gray-300 !border-gray-300 pb-1 mb-2">{cvT('summary')}</h3>
                  <p className="text-[11px] text-gray-600 !text-gray-600 leading-relaxed text-justify whitespace-pre-wrap">
                    {personalInfo.summary}
                  </p>
                </div>
              )}

              {/* İş Deneyimi */}
              {experience.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-gray-900 !text-gray-900 uppercase tracking-widest border-b border-gray-300 !border-gray-300 pb-1 mb-3 flex items-center gap-1.5"><Briefcase size={14} className="shrink-0"/> {cvT('exp')}</h3>
                  <div className="space-y-4">
                    {experience.map(exp => (
                      <div key={exp.id} className="break-inside-avoid">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="text-[13px] font-bold text-gray-800 !text-gray-800">{exp.role}</h4>
                          <span className="text-[10px] font-bold text-blue-600 !text-blue-600 bg-blue-50 !bg-blue-50 px-2 py-0.5 rounded">
                            {exp.startDate} - {exp.endDate || cvT('present')}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-gray-500 !text-gray-500 mb-1.5">{exp.company}</p>
                        {exp.description && (
                          <p className="text-[11px] text-gray-600 !text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pebble Projeleri */}
              {options.showProjects && devData.projects.filter(p => selectedDevItems.projects.includes(p.id)).length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-gray-900 !text-gray-900 uppercase tracking-widest border-b border-gray-300 !border-gray-300 pb-1 mb-3">{cvT('pro')}</h3>
                  <div className="space-y-3">
                    {devData.projects.filter(p => selectedDevItems.projects.includes(p.id)).map(project => (
                      <div key={project.id} className="break-inside-avoid">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-[12px] font-bold text-gray-800 !text-gray-800">{project.title}</h4>
                          {project.status && (
                            <span className="text-[8px] font-bold text-gray-400 !text-gray-400 border border-gray-200 !border-gray-200 px-1.5 rounded uppercase">
                              {project.status}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 !text-gray-500 font-medium">{project.tech}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}