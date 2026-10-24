import html2pdf from 'html2pdf.js';
import { BookOpen, BriefcaseBusiness, Code2, Download, Github, Globe, GraduationCap, Linkedin, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const safeJSONParse = (data) => {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function Resume() {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const [cvLang, setCvLang] = useState('tr');
  const [devData, setDevData] = useState({ projects: [], courses: [], skills: [] });
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({ showProjects: true, showCourses: true, showSkills: true });
  const [selectedDevItems, setSelectedDevItems] = useState({ projects: [], courses: [], skills: [] });
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '', lastName: '', title: '', email: '', phone: '', location: '',
    summary: '', photo: null, linkedin: '', github: '', website: ''
  });
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [coursesRes, projectsRes, skillsRes, profileRes] = await Promise.all([
          api.get('/api/development/courses').catch(() => ({ data: [] })),
          api.get('/api/development/projects').catch(() => ({ data: [] })),
          api.get('/api/development/skills').catch(() => ({ data: [] })),
          api.get('/api/users/me').catch(() => ({ data: null }))
        ]);
        if (!active) return;
        const courses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
        const skills = Array.isArray(skillsRes.data) ? skillsRes.data : [];
        setDevData({ courses, projects, skills });
        setSelectedDevItems({
          courses: courses.map(item => item.id),
          projects: projects.map(item => item.id),
          skills: skills.map(item => item.id)
        });
        const profile = profileRes.data;
        if (profile) {
          setPersonalInfo(prev => ({
            ...prev,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            title: profile.title || '',
            email: profile.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            summary: profile.bio || '',
            photo: profile.photo || null,
            linkedin: profile.linkedin || '',
            github: profile.github || ''
          }));
          setExperience(safeJSONParse(profile.experiences));
          setEducation(safeJSONParse(profile.educations));
        }
      } catch (error) {
        console.error('Resume data could not be loaded:', error);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const toggleDevItem = (category, id) => {
    setSelectedDevItems(prev => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter(itemId => itemId !== id)
        : [...prev[category], id]
    }));
  };

  const downloadPDF = () => {
    const element = document.getElementById('cv-preview');
    if (!element) return;
    const opt = {
      margin: 0,
      filename: `${personalInfo.firstName || 'Resume'}_${personalInfo.lastName || ''}_CV.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: 800 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'css', avoid: '.break-inside-avoid' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const cvT = (key) => {
    const dict = {
      tr: { summary: 'Profil Özeti', exp: 'Deneyim', edu: 'Eğitim', skills: 'Yetenekler', pro: 'Öne Çıkan Projeler', cert: 'Sertifikalar', present: 'Devam Ediyor', gpa: 'GNO' },
      en: { summary: 'Profile Summary', exp: 'Experience', edu: 'Education', skills: 'Skills', pro: 'Featured Projects', cert: 'Certificates', present: 'Present', gpa: 'GPA' }
    };
    return dict[cvLang][key] || key;
  };

  const labels = isTr
    ? { eyebrow: 'KARİYER ARAÇLARI', title: 'Özgeçmiş stüdyosu', subtitle: 'Profilini, gelişim kayıtlarını ve projelerini tek bir düzenli CV’de bir araya getir.', settings: 'CV içeriği', settingsHint: 'Önizlemede hangi bölümlerin yer alacağını seç.', profileNote: 'Kişisel bilgiler, eğitim ve deneyim Profil sayfandan alınır.', projects: 'Projeler', courses: 'Tamamlanan eğitimler', skills: 'Yetenekler', include: 'CV’ye dahil et', download: 'PDF olarak indir', language: 'CV dili', preview: 'Canlı önizleme', previewHint: 'İndirdiğin PDF bu sayfanın düzenini kullanır.', loading: 'Özgeçmişin hazırlanıyor…', empty: 'Henüz profil bilgisi eklenmemiş', emptyHint: 'Profil sayfasına bilgilerini eklediğinde burada görünecek.', present: 'Devam ediyor' }
    : { eyebrow: 'CAREER TOOLS', title: 'Resume studio', subtitle: 'Bring your profile, learning progress and projects together in one polished CV.', settings: 'Resume content', settingsHint: 'Choose which sections appear in the preview.', profileNote: 'Personal details, education and experience come from your Profile page.', projects: 'Projects', courses: 'Completed learning', skills: 'Skills', include: 'Include in resume', download: 'Download PDF', language: 'Resume language', preview: 'Live preview', previewHint: 'Your downloaded PDF uses this layout.', loading: 'Preparing your resume…', empty: 'Your profile is waiting for details', emptyHint: 'Add your information on the Profile page to see it here.', present: 'Present' };

  if (loading) {
    return <div className="resume-loading"><span className="resume-loading-mark"><Sparkles size={20} /></span><p>{labels.loading}</p></div>;
  }

  const completedCourses = devData.courses.filter(course =>
    selectedDevItems.courses.includes(course.id) && (course.status === 'COMPLETED' || course.progress === 100)
  );
  const selectedProjects = devData.projects.filter(project => selectedDevItems.projects.includes(project.id));
  const selectedSkills = devData.skills.filter(skill => selectedDevItems.skills.includes(skill.id));

  const sectionToggle = (key, title, count) => (
    <div className="resume-option-group" key={key}>
      <label className="resume-option-row">
        <span className="resume-option-icon">{key === 'projects' ? <Code2 size={17} /> : key === 'courses' ? <BookOpen size={17} /> : <Sparkles size={17} />}</span>
        <span className="resume-option-copy"><strong>{title}</strong><small>{count} {isTr ? 'kayıt' : 'items'}</small></span>
        <input type="checkbox" checked={options[key === 'projects' ? 'showProjects' : key === 'courses' ? 'showCourses' : 'showSkills']} onChange={e => setOptions(prev => ({ ...prev, [key === 'projects' ? 'showProjects' : key === 'courses' ? 'showCourses' : 'showSkills']: e.target.checked }))} />
      </label>
      {options[key === 'projects' ? 'showProjects' : key === 'courses' ? 'showCourses' : 'showSkills'] && count > 0 && (
        <div className="resume-item-list">
          {(key === 'projects' ? devData.projects : key === 'courses' ? devData.courses : devData.skills).map(item => {
            const id = item.id;
            const checked = selectedDevItems[key].includes(id);
            return <label className="resume-item-choice" key={id}>
              <input type="checkbox" checked={checked} onChange={() => toggleDevItem(key, id)} />
              <span>{key === 'skills' ? item.name : item.title}</span>
            </label>;
          })}
        </div>
      )}
    </div>
  );

  return (
    <main className="resume-page">
      <header className="resume-page-heading resume-page-heading-compact">
        <button type="button" className="resume-download-button" onClick={downloadPDF}><Download size={17} />{labels.download}</button>
      </header>

      <div className="resume-workspace">
        <aside className="resume-sidebar">
          <section className="resume-panel resume-settings-panel">
            <div className="resume-panel-heading">
              <div><span className="resume-panel-kicker">01 / {isTr ? 'DÜZENLE' : 'CUSTOMIZE'}</span><h2>{labels.settings}</h2></div>
              <span className="resume-panel-heading-icon"><SlidersHorizontalIcon /></span>
            </div>
            <p className="resume-panel-description">{labels.settingsHint}</p>
            <div className="resume-language-control">
              <span>{labels.language}</span>
              <div role="group" aria-label={labels.language}>
                <button type="button" className={cvLang === 'tr' ? 'active' : ''} onClick={() => setCvLang('tr')}>TR</button>
                <button type="button" className={cvLang === 'en' ? 'active' : ''} onClick={() => setCvLang('en')}>EN</button>
              </div>
            </div>
            <div className="resume-options">
              {sectionToggle('projects', labels.projects, devData.projects.length)}
              {sectionToggle('courses', labels.courses, devData.courses.length)}
              {sectionToggle('skills', labels.skills, devData.skills.length)}
            </div>
            <div className="resume-profile-note"><Sparkles size={17} /><p>{labels.profileNote}</p></div>
          </section>
          <section className="resume-panel resume-progress-panel">
            <span className="resume-panel-kicker">02 / {isTr ? 'KONTROL' : 'CHECK'}</span>
            <h3>{isTr ? 'CV içeriğin' : 'Your resume at a glance'}</h3>
            <div className="resume-count-row"><span>{isTr ? 'Deneyim' : 'Experience'}</span><strong>{experience.length}</strong></div>
            <div className="resume-count-row"><span>{isTr ? 'Eğitim' : 'Education'}</span><strong>{education.length}</strong></div>
            <div className="resume-count-row"><span>{labels.projects}</span><strong>{options.showProjects ? selectedProjects.length : 0}</strong></div>
            <div className="resume-count-row"><span>{labels.skills}</span><strong>{options.showSkills ? selectedSkills.length : 0}</strong></div>
          </section>
        </aside>

        <section className="resume-preview-column">
          <div className="resume-preview-heading"><div><span className="resume-panel-kicker">03 / {isTr ? 'ÖNİZLEME' : 'PREVIEW'}</span><h2>{labels.preview}</h2></div><span className="resume-a4-tag">A4 · PDF</span></div>
          <p className="resume-preview-hint">{labels.previewHint}</p>
          <div className="resume-paper-wrap">
            <article id="cv-preview" className="resume-paper">
              {(personalInfo.firstName || personalInfo.lastName || personalInfo.title || personalInfo.email) ? (
                <>
                  <header className="cv-paper-header">
                    {personalInfo.photo && <img src={personalInfo.photo} alt="Profile" className="cv-paper-photo" />}
                    <div className="cv-paper-identity">
                      <h1>{personalInfo.firstName} <span>{personalInfo.lastName}</span></h1>
                      {personalInfo.title && <h2>{personalInfo.title}</h2>}
                      <div className="cv-paper-contact">
                        {personalInfo.email && <span><Mail size={11} />{personalInfo.email}</span>}
                        {personalInfo.phone && <span><Phone size={11} />{personalInfo.phone}</span>}
                        {personalInfo.location && <span><MapPin size={11} />{personalInfo.location}</span>}
                        {personalInfo.linkedin && <span><Linkedin size={11} />{personalInfo.linkedin}</span>}
                        {personalInfo.github && <span><Github size={11} />{personalInfo.github}</span>}
                        {personalInfo.website && <span><Globe size={11} />{personalInfo.website}</span>}
                      </div>
                    </div>
                  </header>
                  <div className="cv-paper-grid">
                    <aside className="cv-paper-aside">
                      {education.length > 0 && <section className="cv-paper-section break-inside-avoid"><h3><GraduationCap size={14} />{cvT('edu')}</h3>{education.map((edu, index) => <div className="cv-paper-entry" key={edu.id || index}><small>{edu.startDate} – {edu.endDate || cvT('present')}</small><strong>{edu.degree}{edu.gpa ? ` · ${cvT('gpa')}: ${edu.gpa}` : ''}</strong><span>{edu.school}</span></div>)}</section>}
                      {options.showSkills && selectedSkills.length > 0 && <section className="cv-paper-section break-inside-avoid"><h3><Code2 size={14} />{cvT('skills')}</h3><div className="cv-paper-skills">{selectedSkills.map(skill => <span key={skill.id}>{skill.name}</span>)}</div></section>}
                      {options.showCourses && completedCourses.length > 0 && <section className="cv-paper-section break-inside-avoid"><h3><BookOpen size={14} />{cvT('cert')}</h3>{completedCourses.map((course, index) => <div className="cv-paper-entry" key={course.id || index}><strong>{course.title}</strong>{course.platform && <span>{course.platform}</span>}</div>)}</section>}
                    </aside>
                    <div className="cv-paper-main">
                      {personalInfo.summary && <section className="cv-paper-section break-inside-avoid"><h3>{cvT('summary')}</h3><p className="cv-paper-summary">{personalInfo.summary}</p></section>}
                      {experience.length > 0 && <section className="cv-paper-section"><h3><BriefcaseBusiness size={14} />{cvT('exp')}</h3>{experience.map((exp, index) => <div className="cv-paper-entry cv-experience-entry break-inside-avoid" key={exp.id || index}><div className="cv-entry-heading"><strong>{exp.role}</strong><small>{exp.startDate} – {exp.endDate || cvT('present')}</small></div><span className="cv-entry-company">{exp.company}</span>{exp.description && <p>{exp.description}</p>}</div>)}</section>}
                      {options.showProjects && selectedProjects.length > 0 && <section className="cv-paper-section"><h3>{cvT('pro')}</h3>{selectedProjects.map((project, index) => <div className="cv-paper-entry break-inside-avoid" key={project.id || index}><strong>{project.title}</strong>{project.status && <small>{project.status}</small>}{project.tech && <span>{project.tech}</span>}</div>)}</section>}
                    </div>
                  </div>
                </>
              ) : (
                <div className="cv-paper-empty"><span><Sparkles size={24} /></span><h2>{labels.empty}</h2><p>{labels.emptyHint}</p></div>
              )}
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

function SlidersHorizontalIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 6h4" /></svg>;
}
