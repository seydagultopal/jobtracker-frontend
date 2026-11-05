import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BookOpen, BriefcaseBusiness, Code2, Download, Github, Globe, GraduationCap, Linkedin, Mail, MapPin, Phone, Sparkles, Upload, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import './ResumePhoto.css';
import '../styles/resume-layout-fit.css';

const safeJSONParse = (data) => {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getExternalUrl = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return null;
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
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
  const [pageLayout, setPageLayout] = useState(null);
  const previewRef = useRef(null);
  const previewViewportRef = useRef(null);
  const pointerDragRef = useRef(null);
  const [draggingSection, setDraggingSection] = useState(null);
  const [dropTargetPage, setDropTargetPage] = useState(null);
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

  useEffect(() => () => {
    const activeDrag = pointerDragRef.current;
    if (activeDrag?.cleanup) activeDrag.cleanup();
  }, []);

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
            github: profile.github || '',
            website: profile.website || profile.portfolio || ''
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
    const element = previewRef.current;
    if (!element || isDownloading) return;
    setIsDownloading(true);
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const pagesToExport = Array.from(element.querySelectorAll('.cv-page'));
      if (!pagesToExport.length) throw new Error('No resume pages to export');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      element.classList.add('is-pdf-export');
      try {
        for (let index = 0; index < pagesToExport.length; index += 1) {
          const page = pagesToExport[index];
          const canvas = await html2canvas(page, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            width: 794,
            height: Math.max(1123, page.scrollHeight),
            windowWidth: 794,
            scrollX: 0,
            scrollY: 0,
            logging: false
          });
          const image = canvas.toDataURL('image/jpeg', 0.98);
          const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
          const renderedWidth = canvas.width * ratio;
          const renderedHeight = canvas.height * ratio;
          const offsetX = (pageWidth - renderedWidth) / 2;
          const offsetY = (pageHeight - renderedHeight) / 2;

          if (index > 0) pdf.addPage('a4', 'portrait');
          pdf.addImage(image, 'JPEG', offsetX, offsetY, renderedWidth, renderedHeight, undefined, 'FAST');

          // Keep external profile links clickable even though each sheet is rendered as a page image.
          const pageBounds = page.getBoundingClientRect();
          page.querySelectorAll('a[href]').forEach(anchor => {
            const href = getExternalUrl(anchor.getAttribute('href'));
            if (!href) return;
            const bounds = anchor.getBoundingClientRect();
            const x = offsetX + ((bounds.left - pageBounds.left) / pageBounds.width) * renderedWidth;
            const y = offsetY + ((bounds.top - pageBounds.top) / pageBounds.height) * renderedHeight;
            const w = (bounds.width / pageBounds.width) * renderedWidth;
            const h = (bounds.height / pageBounds.height) * renderedHeight;
            if (w > 0 && h > 0) pdf.link(x, y, w, h, { url: href });
          });
        }
      } finally {
        element.classList.remove('is-pdf-export');
      }

      const filename = `${[personalInfo.firstName, personalInfo.lastName].filter(Boolean).join('_') || 'Resume'}_CV.pdf`;
      pdf.save(filename);
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
      preview: 'Belge önizlemesi', previewHint: 'Bölümleri sürükleyerek sayfalar arasında taşı. Her sayfa A4 ölçüsündedir.',
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
      preview: 'Document preview', previewHint: 'Drag sections between pages. Each page uses the A4 document dimensions.',
      loading: 'Preparing your resume…', empty: 'Your resume is not ready yet',
      emptyHint: 'Add your personal details, education and experience on the Profile page first.',
      photo: 'Include a photo', addPhoto: 'Add photo', changePhoto: 'Change photo',
      removePhoto: 'Remove photo', photoHint: 'Photo is optional. Keep it off for ATS-focused applications.',
      counts: 'Content overview'
    };

  const completedCourses = devData.courses.filter(course =>
    selectedDevItems.courses.includes(course.id) && (course.status === 'COMPLETED' || course.progress === 100)
  );
  const selectedProjects = devData.projects.filter(project => selectedDevItems.projects.includes(project.id));
  const selectedSkills = devData.skills.filter(skill => selectedDevItems.skills.includes(skill.id));

  const sectionBlocks = [
    personalInfo.summary ? { id: 'summary', estimate: 75 + Math.ceil(personalInfo.summary.length / 105) * 17, content: <section className="cv-paper-section cv-section"><h3 className="cv-section-heading">{cvT('summary')}</h3><p className="cv-paper-summary">{personalInfo.summary}</p></section> } : null,
    education.length ? { id: 'education', estimate: 65 + education.length * 58, content: <section className="cv-paper-section cv-section"><h3 className="cv-section-heading">{cvT('edu')}</h3>{education.map((edu, index) => <div className="cv-paper-entry cv-entry" key={edu.id || index}><div className="cv-entry-heading"><strong>{edu.degree}</strong><small>{edu.startDate} – {edu.endDate || cvT('present')}</small></div><span>{edu.school}{edu.gpa ? ` · ${cvT('gpa')}: ${edu.gpa}` : ''}</span></div>)}</section> } : null,
    experience.length ? { id: 'experience', estimate: 65 + experience.reduce((sum, exp) => sum + 58 + Math.ceil(String(exp.description || '').length / 100) * 15, 0), content: <section className="cv-paper-section cv-section"><h3 className="cv-section-heading">{cvT('exp')}</h3>{experience.map((exp, index) => <div className="cv-paper-entry cv-entry" key={exp.id || index}><div className="cv-entry-heading"><strong>{exp.role}</strong><small>{exp.startDate} – {exp.endDate || cvT('present')}</small></div><span className="cv-entry-company">{exp.company}</span>{exp.description && <p>{exp.description}</p>}</div>)}</section> } : null,
    options.showProjects && selectedProjects.length ? { id: 'projects', estimate: 65 + selectedProjects.length * 65, content: <section className="cv-paper-section cv-section"><h3 className="cv-section-heading">{cvT('pro')}</h3>{selectedProjects.map((project, index) => <div className="cv-paper-entry cv-entry" key={project.id || index}><div className="cv-entry-heading"><strong>{project.title}</strong>{project.status && <small>{project.status}</small>}</div>{project.tech && <span>{project.tech}</span>}</div>)}</section> } : null,
    options.showSkills && selectedSkills.length ? { id: 'skills', estimate: 65 + Math.ceil(selectedSkills.map(skill => skill.name).join(' · ').length / 95) * 17, content: <section className="cv-paper-section cv-section"><h3 className="cv-section-heading">{cvT('skills')}</h3><p className="cv-paper-summary">{selectedSkills.map(skill => skill.name).join(' · ')}</p></section> } : null,
    options.showCourses && completedCourses.length ? { id: 'certifications', estimate: 65 + completedCourses.length * 52, content: <section className="cv-paper-section cv-section"><h3 className="cv-section-heading">{cvT('cert')}</h3>{completedCourses.map((course, index) => <div className="cv-paper-entry cv-entry" key={course.id || index}><strong>{course.title}</strong>{course.platform && <span>{course.platform}</span>}</div>)}</section> } : null
  ].filter(Boolean);

  const headerExists = Boolean(personalInfo.firstName || personalInfo.lastName || personalInfo.title || personalInfo.email);
  const autoPages = (() => {
    const result = [[]];
    let used = headerExists ? 245 : 90;
    sectionBlocks.forEach(section => {
      if (used + section.estimate > 900 && result[result.length - 1].length) {
        result.push([]);
        used = 90;
      }
      result[result.length - 1].push(section.id);
      used += section.estimate;
    });
    return result;
  })();
  const pages = (() => {
    const result = (pageLayout || autoPages).map(ids => ids.filter(id => sectionBlocks.some(section => section.id === id)));
    const assigned = new Set(result.flat());
    const unassigned = sectionBlocks.filter(section => !assigned.has(section.id)).map(section => section.id);
    if (unassigned.length) result[result.length - 1].push(...unassigned);
    return result.length ? result : [[]];
  })();
  const currentPageCount = Math.max(1, pages.length);
  const pageLayoutKey = pages.map(page => page.join(',')).join('|');
  const sectionById = Object.fromEntries(sectionBlocks.map(section => [section.id, section]));

  // Measure the rendered A4 content, not estimated character counts. Move the last
  // whole section forward when a manually arranged page exceeds its printable area.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const preview = previewRef.current;
      if (!preview) return;
      const renderedPages = Array.from(preview.querySelectorAll('.cv-page'));
      for (let pageIndex = 0; pageIndex < renderedPages.length; pageIndex += 1) {
        const page = renderedPages[pageIndex];
        const content = page.querySelector('.cv-page-content');
        const sections = Array.from(content?.querySelectorAll(':scope > [data-section-id]') || []);
        if (!content || sections.length < 2 || content.scrollHeight <= content.clientHeight + 2) continue;
        const lastSectionId = sections[sections.length - 1].dataset.sectionId;
        setPageLayout(current => {
          const next = (current || autoPages).map(items => [...items]);
          while (next.length <= pageIndex + 1) next.push([]);
          next[pageIndex] = next[pageIndex].filter(id => id !== lastSectionId);
          next[pageIndex + 1] = [lastSectionId, ...next[pageIndex + 1].filter(id => id !== lastSectionId)];
          return next;
        });
        break;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pageLayoutKey, headerExists, personalInfo.summary, experience, education, selectedProjects.length, selectedSkills.length, completedCourses.length, showPhoto]);

  if (loading) {
    return <div className="resume-loading"><span className="resume-loading-mark"><Sparkles size={20} /></span><p>{labels.loading}</p></div>;
  }

  const moveSection = (sectionId, targetPage, beforeSectionId = null) => {
    setPageLayout(current => {
      const base = (current || autoPages).map(page => [...page]);
      const next = base.map(page => page.filter(id => id !== sectionId));
      while (next.length <= targetPage) next.push([]);
      const target = next[targetPage];
      const beforeIndex = beforeSectionId ? target.indexOf(beforeSectionId) : -1;
      if (beforeIndex >= 0) target.splice(beforeIndex, 0, sectionId);
      else target.push(sectionId);
      return next;
    });
  };

  const beginSectionPointerDrag = (event, sectionId) => {
    if (event.button !== 0 || pointerDragRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Window-level listeners remain as a fallback if pointer capture is unavailable.
    }

    const viewport = previewViewportRef.current;
    if (!viewport) return;

    const drag = {
      sectionId,
      viewport,
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      frame: 0,
      cleanup: null
    };
    pointerDragRef.current = drag;

    const findDropPage = (active) => {
      const target = document.elementFromPoint(active.pointerX, active.pointerY);
      const page = target?.closest('.cv-page');
      if (!page || !active.viewport.contains(page)) return null;
      const index = Number(page.dataset.page) - 1;
      return Number.isInteger(index) && index >= 0 ? index : null;
    };

    const stop = (pointerEvent, shouldDrop) => {
      const current = pointerDragRef.current;
      if (!current || pointerEvent.pointerId !== current.pointerId) return;
      current.pointerX = pointerEvent.clientX;
      current.pointerY = pointerEvent.clientY;
      const targetPageIndex = findDropPage(current);
      if (shouldDrop && current.moved && targetPageIndex !== null) {
        const page = current.viewport.querySelector(`.cv-page[data-page="${targetPageIndex + 1}"]`);
        const hoveredSection = document.elementFromPoint(current.pointerX, current.pointerY)?.closest('[data-section-id]');
        let beforeSectionId = null;
        if (page && hoveredSection && page.contains(hoveredSection) && hoveredSection.dataset.sectionId !== current.sectionId) {
          const hoveredBounds = hoveredSection.getBoundingClientRect();
          const insertAfter = current.pointerY >= hoveredBounds.top + hoveredBounds.height / 2;
          if (!insertAfter) {
            beforeSectionId = hoveredSection.dataset.sectionId;
          } else {
            const siblings = Array.from(page.querySelectorAll('[data-section-id]'));
            const hoveredIndex = siblings.indexOf(hoveredSection);
            const nextSibling = siblings.slice(hoveredIndex + 1).find(item => item.dataset.sectionId !== current.sectionId);
            beforeSectionId = nextSibling?.dataset.sectionId || null;
          }
        }
        moveSection(current.sectionId, targetPageIndex, beforeSectionId);
      }

      current.cleanup?.();
      pointerDragRef.current = null;
      setDraggingSection(null);
      setDropTargetPage(null);
    };

    const move = (pointerEvent) => {
      const current = pointerDragRef.current;
      if (!current || pointerEvent.pointerId !== current.pointerId) return;
      current.pointerX = pointerEvent.clientX;
      current.pointerY = pointerEvent.clientY;
      if (!current.moved && Math.hypot(current.pointerX - current.startX, current.pointerY - current.startY) > 5) {
        current.moved = true;
        setDraggingSection(current.sectionId);
      }
      if (!current.moved) return;

      const nextTarget = findDropPage(current);
      setDropTargetPage(previous => previous === nextTarget ? previous : nextTarget);
      if (current.frame) return;

      const tick = () => {
        const active = pointerDragRef.current;
        if (!active) return;
        const bounds = active.viewport.getBoundingClientRect();
        const edge = Math.min(160, Math.max(90, bounds.width * 0.2));
        const relativeX = active.pointerX - bounds.left;
        const maxScroll = Math.max(0, active.viewport.scrollWidth - active.viewport.clientWidth);
        let direction = 0;
        let intensity = 0;

        if (relativeX >= bounds.width - edge && active.viewport.scrollLeft < maxScroll - 1) {
          direction = 1;
          intensity = Math.min(1, (relativeX - (bounds.width - edge)) / edge);
        } else if (relativeX <= edge && active.viewport.scrollLeft > 1) {
          direction = -1;
          intensity = Math.min(1, (edge - relativeX) / edge);
        }

        const targetIndex = findDropPage(active);
        setDropTargetPage(previous => previous === targetIndex ? previous : targetIndex);
        if (!direction) {
          active.frame = 0;
          return;
        }

        const speed = 4 + intensity * 16;
        active.viewport.scrollLeft = Math.max(0, Math.min(
          maxScroll,
          active.viewport.scrollLeft + direction * speed
        ));
        active.frame = requestAnimationFrame(tick);
      };

      current.frame = requestAnimationFrame(tick);
    };

    const finish = (pointerEvent) => stop(pointerEvent, true);
    const cancel = (pointerEvent) => stop(pointerEvent, false);
    drag.cleanup = () => {
      if (drag.frame) cancelAnimationFrame(drag.frame);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', cancel);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', cancel);
  };

  const handleSectionKeyDown = (event, sectionId) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const currentPage = pages.findIndex(page => page.includes(sectionId));
    if (currentPage < 0) return;
    const nextPage = Math.max(0, currentPage + (event.key === 'ArrowRight' ? 1 : -1));
    if (nextPage !== currentPage) moveSection(sectionId, nextPage);
  };

  const removeEmptyPage = (pageIndex) => {
    setPageLayout(current => (current || autoPages).filter((page, index) => index !== pageIndex));
  };

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
          <div className="resume-preview-heading"><div><span className="resume-panel-kicker">03 / {isTr ? 'ÖNİZLEME' : 'PREVIEW'}</span><h2>{labels.preview}</h2></div><span className="resume-a4-tag">A4 · {currentPageCount} {isTr ? "sayfa" : currentPageCount === 1 ? "page" : "pages"}</span></div>
          <div className="resume-preview-tools"><p className="resume-preview-hint">{labels.previewHint}</p><button type="button" className="resume-add-page" onClick={() => setPageLayout(current => [...(current || autoPages), []])}>{isTr ? '+ Sayfa ekle' : '+ Add page'}</button></div>
          <div ref={previewViewportRef} className={"resume-paper-wrap" + (draggingSection ? " is-dragging-section" : "")}>
            <div ref={previewRef} id="cv-preview" className="resume-pages" data-page-count={currentPageCount}>
              {pages.map((pageSectionIds, pageIndex) => (
                <article
                  className={"resume-paper cv-page" + (showPhoto && personalInfo.photo ? " has-photo" : "") + (dropTargetPage === pageIndex ? " is-drop-target" : "") + (!pageSectionIds.length ? " is-empty-page" : "")}
                  data-page={pageIndex + 1}
                  key={pageIndex}
                >
                  {pageIndex === 0 && headerExists && (
                    <header className="cv-paper-header">
                      <div className="cv-paper-identity">
                        <h1>{personalInfo.firstName} {personalInfo.lastName}</h1>
                        {personalInfo.title && <h2>{personalInfo.title}</h2>}
                        <div className="cv-paper-contact">
                          {personalInfo.email && <span><Mail size={11} />{personalInfo.email}</span>}
                          {personalInfo.phone && <span><Phone size={11} />{personalInfo.phone}</span>}
                          {personalInfo.location && <span><MapPin size={11} />{personalInfo.location}</span>}
                          {personalInfo.linkedin && getExternalUrl(personalInfo.linkedin) && <a className="cv-contact-link" href={getExternalUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><Linkedin size={11} /><span>LinkedIn</span></a>}
                          {personalInfo.github && getExternalUrl(personalInfo.github) && <a className="cv-contact-link" href={getExternalUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><Github size={11} /><span>GitHub</span></a>}
                          {personalInfo.website && getExternalUrl(personalInfo.website) && <a className="cv-contact-link" href={getExternalUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" aria-label="Portfolio website"><Globe size={11} /><span>Portfolio</span></a>}
                        </div>
                      </div>
                      {showPhoto && personalInfo.photo && <img src={personalInfo.photo} alt="" className="cv-paper-photo cv-paper-photo-contain" />}
                    </header>
                  )}
                  {!headerExists && pageIndex === 0 && <div className="cv-paper-empty"><span><Sparkles size={24} /></span><h2>{labels.empty}</h2><p>{labels.emptyHint}</p></div>}
                  {pageIndex > 0 && !pageSectionIds.length && (
                    <button type="button" className="cv-remove-empty-page" onClick={() => removeEmptyPage(pageIndex)}>
                      {isTr ? 'Boş sayfayı kaldır' : 'Remove empty page'}
                    </button>
                  )}
                  <div className="cv-page-content">
                    {!pageSectionIds.length && pageIndex > 0 && (
                      <div className="cv-empty-page-hint">{isTr ? 'Boş sayfa · bölümü buraya sürükle' : 'Empty page · drop a section here'}</div>
                    )}
                    {pageSectionIds.map(sectionId => {
                      const section = sectionById[sectionId];
                      if (!section) return null;
                      return (
                        <div
                          className={`cv-draggable-section${draggingSection === section.id ? ' is-dragging' : ''}`}
                          data-section-id={section.id}
                          key={section.id}
                        >
                          <button
                            type="button"
                            className="cv-section-drag-handle"
                            aria-label={isTr ? 'Bölümü taşımak için sürükle. Ok tuşlarıyla sayfalar arasında taşı.' : 'Drag to move section. Use arrow keys to move between pages.'}
                            aria-grabbed={draggingSection === section.id}
                            onPointerDown={event => beginSectionPointerDrag(event, section.id)}
                            onKeyDown={event => handleSectionKeyDown(event, section.id)}
                          ><span aria-hidden="true">⠿</span><small>{isTr ? 'Taşımak için sürükle' : 'Drag to move'}</small></button>
                          {section.content}
                        </div>
                      );
                    })}
                  </div>
                  <footer className="cv-page-footer"><span>PEBBLE</span><span>{pageIndex + 1} / {currentPageCount}</span></footer>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SlidersHorizontalIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 6h4" /></svg>;
}
