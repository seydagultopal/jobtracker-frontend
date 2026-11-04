import html2pdf from 'html2pdf.js';
import { BookOpen, BriefcaseBusiness, Code2, Download, Github, Globe, GraduationCap, Linkedin, Mail, MapPin, Phone, Sparkles, Upload, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './ResumePhoto.css';

const safeJSONParse = (data) => {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export default function Resume() {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const [cvLang, setCvLang] = useState('tr');
  const [devData, setDevData] = useState({ projects: [], courses: [], skills: [] });
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const photoInputRef = useRef(null);
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

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoError('');
    if (!file.type.startsWith('image/')) {
      setPhotoError(isTr ? 'Lütfen bir görsel dosyası seç.' : 'Please choose an image file.');
      event.target.value = '';
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setPhotoError(isTr ? 'Fotoğraf en fazla 3 MB olabilir.' : 'The photo must be 3 MB or smaller.');
      event.target.value = '';
      return;
    }
    try {
      const image = await readImage(file);
      setPersonalInfo(prev => ({ ...prev, photo: image }));
      setShowPhoto(true);
    } catch {
      setPhotoError(isTr ? 'Fotoğraf okunamadı. Başka bir dosya dene.' : 'The image could not be read. Try another file.');
    }
    event.target.value = '';
  };

  const downloadPDF = async () => {
    const element = document.getElementById('cv-preview');
    if (!element || isDownloading) return;
    setIsDownloading(true);
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const images = Array.from(element.querySelectorAll('img'));
      await Promise.all(images.map(img => img.decode?.().catch(() => undefined)));
      const opt = {
        margin: 0,
        filename: `${[personalInfo.firstName, personalInfo.lastName].filter(Boolean).join('_') || 'Resume'}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          windowWidth: 794,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['.cv-entry', '.cv-section-heading'] }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF export failed:', error);
      window.alert(isTr ? 'PDF oluşturulamadı. Lütfen tekrar dene.' : 'The PDF could not be created. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const cvT = (key) => {
    const dict = {
      tr: { summary: 'Profil Özeti', exp: 'İş Deneyimi', edu: 'Eğitim', skills: 'Teknik Yetkinlikler', pro: 'Projeler', cert: 'Sertifikalar', present: 'Devam Ediyor', gpa: 'GNO' },
      en: { summary: 'Professional Summary', exp: 'Experience', edu: 'Education', skills: 'Technical Skills', pro: 'Projects', cert: 'Certifications', present: 'Present', gpa: 'GPA' }
    };
    return dict[cvLang][key] || key;
  };

  const labels = isTr
    ? {
      settings: 'CV düzeni', settingsHint: 'Başvurduğun role göre CV içeriğini ve görünümünü düzenle.',
      profileNote: 'Kişisel bilgiler, eğitim ve deneyim Profil sayfandan alınır.',
      projects: 'Projeler', courses: 'Sertifikalar ve eğitimler', skills: 'Teknik yetkinlikler',
      download: 'PDF olarak indir', downloading: 'PDF hazırlanıyor…', language: 'CV dili',
      preview: 'Belge önizlemesi', previewHint: 'Sade, tek sütunlu ve ATS dostu A4 düzeni.',
      loading: 'CV hazırlanıyor…', empty: 'CV bilgilerin henüz hazır değil',
      emptyHint: 'Önce Profil sayfasından kişisel bilgilerini, eğitimini ve deneyimini ekle.',
      photo: 'CV’de fotoğraf kullan', addPhoto: 'Fotoğraf ekle', changePhoto: 'Fotoğrafı değiştir',
      removePhoto: 'Fotoğrafı kaldır', photoHint: 'Fotoğraf isteğe bağlıdır. ATS odaklı başvurular için kapalı bırakabilirsin.',
      counts: 'İçerik kontrolü'
    }
    : {
      settings: 'Resume layout', settingsHint: 'Adjust the content and appearance for the role you are applying to.',
      profileNote: 'Personal details, education and experience come from your Profile page.',
      projects: 'Projects', courses: 'Certifications & courses', skills: 'Technical skills',
      download: 'Download PDF', downloading: 'Preparing PDF…', language: 'Resume language',
      preview: 'Document preview', previewHint: 'A clean, single-column, ATS-friendly A4 layout.',
      loading: 'Preparing your resume…', empty: 'Your resume is not ready yet',
      emptyHint: 'Add your personal details, education and experience on the Profile page first.',
      photo: 'Include a photo', addPhoto: 'Add photo', changePhoto: 'Change photo',
      removePhoto: 'Remove photo', photoHint: 'Photo is optional. Keep it off for ATS-focused applications.',
      counts: 'Content overview'
    };

  if (loading) {
    return <div className="resume-loading"><span className="resume-loading-mark"><Sparkles size={20} /></span><p>{labels.loading}</p></div>;
  }

  const completedCourses = devData.courses.filter(course =>
    selectedDevItems.courses.includes(course.id) && (course.status === 'COMPLETED' || course.progress === 100)
  );
  const selectedProjects = devData.projects.filter(project => selectedDevItems.projects.includes(project.id));
  const selectedSkills = devData.skills.filter(skill => selectedDevItems.skills.includes(skill.id));

  const sectionToggle = (key, title, count) => {
    const optionKey = key === 'projects' ? 'showProjects' : key === 'courses' ? 'showCourses' : 'showSkills';
    return (
      <div className="resume-option-group" key={key}>
        <label className="resume-option-row">
          <span className="resume-option-icon">{key === 'projects' ? <Code2 size={17} /> : key === 'courses' ? <BookOpen size={17} /> : <Sparkles size={17} />}</span>
          <span className="resume-option-copy"><strong>{title}</strong><small>{count} {isTr ? 'kayıt' : 'items'}</small></span>
          <input type="checkbox" checked={options[optionKey]} onChange={e => setOptions(prev => ({ ...prev, [optionKey]: e.target.checked }))} />
        </label>
        {options[optionKey] && count > 0 && (
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
  };

  return (
    <main className="resume-page">
      <header className="resume-page-heading resume-page-heading-compact">
        <button type="button" className="resume-download-button" onClick={downloadPDF} disabled={isDownloading}>
          <Download size={17} />{isDownloading ? labels.downloading : labels.download}
        </button>
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

            <div className="resume-photo-settings">
              <div className="resume-photo-setting-copy">
                <strong>{labels.photo}</strong>
                <small>{labels.photoHint}</small>
              </div>
              <label className="resume-photo-switch">
                <input type="checkbox" checked={showPhoto} onChange={e => setShowPhoto(e.target.checked)} />
                <span aria-hidden="true" />
              </label>
              {showPhoto && (
                <div className="resume-photo-actions">
                  {personalInfo.photo ? <img src={personalInfo.photo} alt="" className="resume-photo-thumb resume-photo-thumb-contain" /> : <span className="resume-photo-placeholder"><UserRound size={19} /></span>}
                  <div className="resume-photo-buttons">
                    <button type="button" onClick={() => photoInputRef.current?.click()}><Upload size={14} />{personalInfo.photo ? labels.changePhoto : labels.addPhoto}</button>
                    {personalInfo.photo && <button type="button" className="resume-photo-remove" onClick={() => setPersonalInfo(prev => ({ ...prev, photo: null }))}><X size={14} />{labels.removePhoto}</button>}
                  </div>
                  <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
                </div>
              )}
              {photoError && <p className="resume-photo-error" role="alert">{photoError}</p>}
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
            <h3>{labels.counts}</h3>
            <div className="resume-count-row"><span>{cvT('exp')}</span><strong>{experience.length}</strong></div>
            <div className="resume-count-row"><span>{cvT('edu')}</span><strong>{education.length}</strong></div>
            <div className="resume-count-row"><span>{labels.projects}</span><strong>{options.showProjects ? selectedProjects.length : 0}</strong></div>
            <div className="resume-count-row"><span>{labels.skills}</span><strong>{options.showSkills ? selectedSkills.length : 0}</strong></div>
          </section>
        </aside>

        <section className="resume-preview-column">
          <div className="resume-preview-heading"><div><span className="resume-panel-kicker">03 / {isTr ? 'ÖNİZLEME' : 'PREVIEW'}</span><h2>{labels.preview}</h2></div><span className="resume-a4-tag">A4 · PDF</span></div>
          <p className="resume-preview-hint">{labels.previewHint}</p>
          <div className="resume-paper-wrap">
            <article id="cv-preview" className={`resume-paper${showPhoto && personalInfo.photo ? ' has-photo' : ''}`}>
              {(personalInfo.firstName || personalInfo.lastName || personalInfo.title || personalInfo.email) ? (
                <>
                  <header className="cv-paper-header">
                    <div className="cv-paper-identity">
                      <h1>{personalInfo.firstName} {personalInfo.lastName}</h1>
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
                    {showPhoto && personalInfo.photo && <img src={personalInfo.photo} alt="" className="cv-paper-photo cv-paper-photo-contain" />}
                  </header>

                  {personalInfo.summary && <section className="cv-paper-section cv-section">
                    <h3 className="cv-section-heading">{cvT('summary')}</h3>
                    <p className="cv-paper-summary">{personalInfo.summary}</p>
                  </section>}

                  {education.length > 0 && <section className="cv-paper-section cv-section">
                    <h3 className="cv-section-heading">{cvT('edu')}</h3>
                    {education.map((edu, index) => <div className="cv-paper-entry cv-entry" key={edu.id || index}>
                      <div className="cv-entry-heading"><strong>{edu.degree}</strong><small>{edu.startDate} – {edu.endDate || cvT('present')}</small></div>
                      <span>{edu.school}{edu.gpa ? ` · ${cvT('gpa')}: ${edu.gpa}` : ''}</span>
                    </div>)}
                  </section>}


                  {experience.length > 0 && <section className="cv-paper-section cv-section">
                    <h3 className="cv-section-heading">{cvT('exp')}</h3>
                    {experience.map((exp, index) => <div className="cv-paper-entry cv-entry" key={exp.id || index}>
                      <div className="cv-entry-heading"><strong>{exp.role}</strong><small>{exp.startDate} – {exp.endDate || cvT('present')}</small></div>
                      <span className="cv-entry-company">{exp.company}</span>
                      {exp.description && <p>{exp.description}</p>}
                    </div>)}
                  </section>}

                  {options.showProjects && selectedProjects.length > 0 && <section className="cv-paper-section cv-section">
                    <h3 className="cv-section-heading">{cvT('pro')}</h3>
                    {selectedProjects.map((project, index) => <div className="cv-paper-entry cv-entry" key={project.id || index}>
                      <div className="cv-entry-heading"><strong>{project.title}</strong>{project.status && <small>{project.status}</small>}</div>
                      {project.tech && <span>{project.tech}</span>}
                    </div>)}
                  </section>}

                  {options.showSkills && selectedSkills.length > 0 && <section className="cv-paper-section cv-section">
                    <h3 className="cv-section-heading">{cvT('skills')}</h3>
                    <p className="cv-paper-summary">{selectedSkills.map(skill => skill.name).join(' · ')}</p>
                  </section>}

                  {options.showCourses && completedCourses.length > 0 && <section className="cv-paper-section cv-section">
                    <h3 className="cv-section-heading">{cvT('cert')}</h3>
                    {completedCourses.map((course, index) => <div className="cv-paper-entry cv-entry" key={course.id || index}>
                      <strong>{course.title}</strong>{course.platform && <span>{course.platform}</span>}
                    </div>)}
                  </section>}
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
