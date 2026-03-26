import html2pdf from 'html2pdf.js';
import { BookOpen, Briefcase, Code, Download, Github, Globe, GraduationCap, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const safeJSONParse = (data) => {
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export default function Resume() {
  const { t, language } = useLanguage();

  const [cvLang, setCvLang] = useState('tr');
  const [devData, setDevData] = useState({ projects: [], courses: [], skills: [] });
  const [loading, setLoading] = useState(true);

  const [options, setOptions] = useState({
    showProjects: true,
    showCourses: true,
    showSkills: true
  });

  const [selectedDevItems, setSelectedDevItems] = useState({
    projects: [],
    courses: [],
    skills: []
  });

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
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
      const [coursesRes, projectsRes, skillsRes, profileRes] = await Promise.all([
        api.get('/api/development/courses').catch(() => ({ data: [] })),
        api.get('/api/development/projects').catch(() => ({ data: [] })),
        api.get('/api/development/skills').catch(() => ({ data: [] })),
        api.get('/api/users/me').catch(() => ({ data: null }))
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

      if (profileRes.data) {
        setPersonalInfo(prev => ({
          ...prev,
          firstName: profileRes.data.firstName || '',
          lastName: profileRes.data.lastName || '',
          title: profileRes.data.title || '',
          email: profileRes.data.email || '',
          phone: profileRes.data.phone || '',
          location: profileRes.data.location || '',
          summary: profileRes.data.bio || '',
          photo: profileRes.data.photo || null,
          linkedin: profileRes.data.linkedin || '',
          github: profileRes.data.github || ''
        }));

        setExperience(safeJSONParse(profileRes.data.experiences));
        setEducation(safeJSONParse(profileRes.data.educations));
      }

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
        windowWidth: 800 
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

  if (loading) {
    return <div className="min-h-full flex items-center justify-center text-gray-500 font-bold animate-pulse">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white dark:bg-twilight rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none p-6 md:p-8 border border-gray-100 dark:border-starlight/20 transition-colors duration-500 min-h-full flex flex-col xl:flex-row gap-8 animate-fade-in">
      
      {/* SOL KISIM: KONTROL PANELİ */}
      <div className="w-full xl:w-4/12 flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2 pb-10 max-h-[calc(100vh-120px)]">
        
        <div className="flex flex-col gap-3 mb-2 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">CV Kontrolü</h2>
            <button 
              onClick={() => setCvLang(cvLang === 'tr' ? 'en' : 'tr')} 
              className="px-3 py-1.5 bg-gray-100 dark:bg-night text-gray-600 dark:text-gray-300 font-black rounded-lg text-xs hover:bg-gray-200 dark:hover:bg-starlight/20 transition-all border border-gray-200 dark:border-starlight/30"
            >
              Dil: {cvLang.toUpperCase()}
            </button>
          </div>
          <button onClick={downloadPDF} className="w-full justify-center bg-columbia text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-columbia/30">
            <Download size={16} strokeWidth={3} /> PDF İndir
          </button>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 text-xs font-medium mt-2">
            Kişisel bilgileriniz, eğitim ve deneyiminiz otomatik olarak <b>Profil</b> ayarlarınızdan çekilmektedir. Değiştirmek isterseniz Profil sayfasına gidiniz.
          </div>
        </div>

        {/* Pebble Entegrasyon Opsiyonları */}
        <div className="bg-columbia/5 dark:bg-columbia/10 rounded-[2rem] p-5 border border-columbia/20 dark:border-columbia/20 shrink-0">
          <h3 className="text-sm font-black text-columbia dark:text-columbia/90 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Code size={16} /> Pebble'dan CV'ye Ekle
          </h3>
          <div className="space-y-3">
            
            {/* Projeler */}
            <div>
              <label className="flex items-center justify-between p-2.5 bg-white dark:bg-twilight rounded-xl cursor-pointer shadow-sm border border-gray-100 dark:border-starlight/20">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Projelerimi Göster ({devData.projects.length})</span>
                <input type="checkbox" checked={options.showProjects} onChange={e => setOptions({...options, showProjects: e.target.checked})} className="w-4 h-4 accent-columbia cursor-pointer" />
              </label>
              {options.showProjects && devData.projects.length > 0 && (
                <div className="pl-3 mt-2 space-y-1.5 border-l-2 border-columbia/20">
                  {devData.projects.map(p => (
                    <label key={p.id} className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={selectedDevItems.projects.includes(p.id)} onChange={() => toggleDevItem('projects', p.id)} className="accent-columbia w-3 h-3" />
                      {p.title}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Kurslar */}
            <div>
              <label className="flex items-center justify-between p-2.5 bg-white dark:bg-twilight rounded-xl cursor-pointer shadow-sm border border-gray-100 dark:border-starlight/20">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Sertifikalarımı Göster ({devData.courses.length})</span>
                <input type="checkbox" checked={options.showCourses} onChange={e => setOptions({...options, showCourses: e.target.checked})} className="w-4 h-4 accent-columbia cursor-pointer" />
              </label>
              {options.showCourses && devData.courses.length > 0 && (
                <div className="pl-3 mt-2 space-y-1.5 border-l-2 border-columbia/20">
                  {devData.courses.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={selectedDevItems.courses.includes(c.id)} onChange={() => toggleDevItem('courses', c.id)} className="accent-columbia w-3 h-3" />
                      {c.title}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Yetenekler */}
            <div>
              <label className="flex items-center justify-between p-2.5 bg-white dark:bg-twilight rounded-xl cursor-pointer shadow-sm border border-gray-100 dark:border-starlight/20">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Yeteneklerimi Göster ({devData.skills.length})</span>
                <input type="checkbox" checked={options.showSkills} onChange={e => setOptions({...options, showSkills: e.target.checked})} className="w-4 h-4 accent-columbia cursor-pointer" />
              </label>
              {options.showSkills && devData.skills.length > 0 && (
                <div className="pl-3 mt-2 space-y-1.5 border-l-2 border-columbia/20">
                  {devData.skills.map(s => (
                    <label key={s.id} className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={selectedDevItems.skills.includes(s.id)} onChange={() => toggleDevItem('skills', s.id)} className="accent-columbia w-3 h-3" />
                      {s.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* SAĞ KISIM: CANLI ÖNİZLEME (CV Kağıdı) */}
      <div className="w-full xl:w-8/12 bg-gray-200/50 dark:bg-black/20 rounded-[2.5rem] p-4 sm:p-8 flex justify-center overflow-auto custom-scrollbar">
        
        <div 
          id="cv-preview" 
          className="bg-white !bg-white shadow-2xl shrink-0 text-left w-full max-w-[800px] mx-auto"
          style={{ 
            padding: '40px',
            minHeight: '1060px' 
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
                {personalInfo.title}
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
            
            {/* CV SOL KOLON */}
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

              {/* Yetenekler */}
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

              {/* Sertifikalar */}
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

            {/* CV SAĞ KOLON */}
            <div className="col-span-8 space-y-6">
              
              {/* Özet / Hakkımda */}
              {personalInfo.summary && (
                <div className="break-inside-avoid">
                  <h3 className="text-sm font-black text-gray-900 !text-gray-900 uppercase tracking-widest border-b border-gray-300 !border-gray-300 pb-1 mb-2">{cvT('summary')}</h3>
                  <p className="text-[11px] text-gray-600 !text-gray-600 leading-relaxed text-justify whitespace-pre-wrap">
                    {personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Deneyim */}
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

              {/* Projeler */}
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