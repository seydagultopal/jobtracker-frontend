import { BookOpen, Code2, Cpu, Database, Edit2, FolderGit2, LayoutTemplate, Plus, Search, Server, Target, Trash2, TrendingUp, GraduationCap, CircleCheck, ArrowUpRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import CourseFormModal from '../components/CourseFormModal';
import ProjectFormModal from '../components/ProjectFormModal';
import SkillFormModal from '../components/SkillFormModal';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function Development() {
  const { t, language } = useLanguage();

  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Çizelge State'leri
  const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0]); 
  const [chartLabels, setChartLabels] = useState(['', '', '', '', '', '', '']);

  // Modal görünürlük state'leri
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);

  // Düzenleme state'leri (Düzenlenecek veriyi tutar)
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);

  // Silme İşlemi Onay State'i
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, type: null });

  useEffect(() => {
    fetchDevelopmentData();
    fetchChartData();
  }, [language]);

  const fetchDevelopmentData = async () => {
    try {
      setLoading(true);
      const [coursesRes, projectsRes, skillsRes] = await Promise.all([
        api.get('/api/development/courses'),
        api.get('/api/development/projects'),
        api.get('/api/development/skills')
      ]);

      setCourses(coursesRes.data || []);
      setProjects(projectsRes.data || []);
      setSkills(skillsRes.data || []);
    } catch (error) {
      console.error("Gelişim verileri çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForApi = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const fetchChartData = async () => {
    const labels = [];
    const dates = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(formatDateForApi(d));
      
      const dayName = d.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short' });
      labels.push(dayName);
    }
    
    setChartLabels(labels);

    try {
      const requests = dates.map(date => api.get(`/api/agenda/${date}`).catch(() => null));
      const responses = await Promise.all(requests);
      
      const scores = responses.map(res => {
        if (!res || !res.data) return 0;
        
        const data = res.data;
        let score = 0;
        
        if (data.todos && Array.isArray(data.todos)) {
          const completedTodos = data.todos.filter(t => t.completed).length;
          score += completedTodos * 10;
        }
        
        if (data.notes && data.notes.trim().length > 20) {
          score += 20;
        }
        
        if (data.mood === 'GOOD') score += 20;
        else if (data.mood === 'NEUTRAL') score += 10;
        
        return Math.min(score, 100);
      });
      
      setChartData(scores);
    } catch (error) {
      console.error("Çizelge verisi hesaplanırken hata oluştu:", error);
    }
  };

  const updateChartData = () => {
    const completedCourses = courses.length;
    const completedProjects = projects.length;
    const completedSkills = skills.length;

    const totalScore = (completedCourses + completedProjects + completedSkills) * 10;

    setChartData((prevData) => {
      const newData = [...prevData];
      newData[newData.length - 1] = Math.min(totalScore, 100); 
      return newData;
    });
  };

  // --- EKLEME VE DÜZENLEME (POST/PUT) İŞLEMLERİ ---
  const handleAddCourse = async (data) => {
    try {
      if (editingCourse) {
        await api.put(`/api/development/courses/${editingCourse.id}`, data);
      } else {
        await api.post('/api/development/courses', data);
      }
      setShowCourseModal(false);
      setEditingCourse(null);
      fetchDevelopmentData();
      updateChartData(); 
    } catch (error) {
      console.error("Eğitim eklenirken/güncellenirken hata:", error);
    }
  };

  const handleAddProject = async (data) => {
    try {
      if (editingProject) {
        await api.put(`/api/development/projects/${editingProject.id}`, data);
      } else {
        await api.post('/api/development/projects', data);
      }
      setShowProjectModal(false);
      setEditingProject(null);
      fetchDevelopmentData();
      updateChartData(); 
    } catch (error) {
      console.error("Proje eklenirken/güncellenirken hata:", error);
    }
  };

  const handleAddSkill = async (data) => {
    try {
      if (editingSkill) {
        await api.put(`/api/development/skills/${editingSkill.id}`, data);
      } else {
        await api.post('/api/development/skills', data);
      }
      setShowSkillModal(false);
      setEditingSkill(null);
      fetchDevelopmentData();
      updateChartData(); 
    } catch (error) {
      console.error("Yetenek eklenirken/güncellenirken hata:", error);
    }
  };

  // --- SİLME (DELETE) İŞLEMLERİ VE ÖZEL MODAL ---
  const handleDeleteCourse = (id) => setDeleteConfirm({ show: true, id, type: 'course' });
  const handleDeleteProject = (id) => setDeleteConfirm({ show: true, id, type: 'project' });
  const handleDeleteSkill = (id) => setDeleteConfirm({ show: true, id, type: 'skill' });

  const executeDelete = async () => {
    const { id, type } = deleteConfirm;
    try {
      if (type === 'course') await api.delete(`/api/development/courses/${id}`);
      if (type === 'project') await api.delete(`/api/development/projects/${id}`);
      if (type === 'skill') await api.delete(`/api/development/skills/${id}`);
      
      fetchDevelopmentData();
      updateChartData();
    } catch (error) {
      console.error("Silinirken hata:", error);
    }
    setDeleteConfirm({ show: false, id: null, type: null });
  };

  const getSkillIcon = (name) => {
    if (!name) return Cpu;
    const n = name.toLowerCase();
    if (n.includes('react') || n.includes('vue') || n.includes('angular') || n.includes('html') || n.includes('css')) return LayoutTemplate;
    if (n.includes('spring') || n.includes('java') || n.includes('node') || n.includes('c#') || n.includes('python')) return Code2;
    if (n.includes('sql') || n.includes('mongo') || n.includes('data') || n.includes('postgre')) return Database;
    if (n.includes('docker') || n.includes('kubernetes') || n.includes('aws') || n.includes('cloud')) return Server;
    return Cpu; 
  };

  const getSkillColor = (level) => {
    if (level > 75) return 'text-emerald-600 dark:text-emerald-400';
    if (level > 40) return 'text-blue-600 dark:text-blue-400';
    return 'text-orange-500 dark:text-orange-400';
  };

  const locale = language === 'tr' ? 'tr-TR' : 'en-US';
  const query = searchTerm.trim().toLocaleLowerCase(locale);
  const filteredCourses = courses.filter((item) => `${item.title || ''} ${item.platform || ''}`.toLocaleLowerCase(locale).includes(query));
  const filteredProjects = projects.filter((item) => `${item.title || ''} ${item.tech || ''} ${item.status || ''}`.toLocaleLowerCase(locale).includes(query));
  const filteredSkills = skills.filter((item) => `${item.name || ''}`.toLocaleLowerCase(locale).includes(query));
  const completedCourses = courses.filter((item) => item.status === 'COMPLETED' || Number(item.progress) >= 100).length;
  const completedProjects = projects.filter((item) => ['COMPLETED', 'Tamamlandı'].includes(item.status)).length;
  const averageSkillLevel = skills.length ? Math.round(skills.reduce((sum, item) => sum + (Number(item.level) || 0), 0) / skills.length) : 0;
  const weeklyAverage = chartData.length ? Math.round(chartData.reduce((sum, value) => sum + value, 0) / chartData.length) : 0;
  const tr = language === 'tr';

  return (
    <>
      <main className="development-page">
        <section className="development-stats">
          <article className="development-stat-card"><span className="development-stat-icon"><BookOpen size={19} /></span><div><span>{tr ? 'EĞİTİMLER' : 'COURSES'}</span><strong>{courses.length}</strong><small>{tr ? `${completedCourses} tamamlandı` : `${completedCourses} completed`}</small></div><span className="development-stat-decoration">01</span></article>
          <article className="development-stat-card"><span className="development-stat-icon project"><FolderGit2 size={19} /></span><div><span>{tr ? 'PROJELER' : 'PROJECTS'}</span><strong>{projects.length}</strong><small>{tr ? `${completedProjects} tamamlandı` : `${completedProjects} completed`}</small></div><span className="development-stat-decoration">02</span></article>
          <article className="development-stat-card"><span className="development-stat-icon skill"><Target size={19} /></span><div><span>{tr ? 'YETENEKLER' : 'SKILLS'}</span><strong>{skills.length}</strong><small>{tr ? 'Takip edilen beceri' : 'Tracked skills'}</small></div><span className="development-stat-decoration">03</span></article>
          <article className="development-stat-card"><span className="development-stat-icon activity"><TrendingUp size={19} /></span><div><span>{tr ? 'HAFTALIK ORTALAMA' : 'WEEKLY AVERAGE'}</span><strong>{weeklyAverage}<small>%</small></strong><small>{tr ? 'Ajanda etkinliklerinden' : 'From agenda activity'}</small></div><span className="development-stat-decoration">04</span></article>
        </section>

        <section className="development-toolbar">
          <div><span className="development-section-kicker">{tr ? 'KİŞİSEL TAKİP' : 'PERSONAL TRACKING'}</span><h2>{tr ? 'Neler üzerinde çalışıyorsun?' : 'What are you working on?'}</h2></div>
          <label className="development-search"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={tr ? 'Eğitim, proje veya yetenek ara...' : 'Search courses, projects or skills...'} /><span>{filteredCourses.length + filteredProjects.length + filteredSkills.length}</span>{searchTerm && <button type="button" aria-label={tr ? 'Aramayı temizle' : 'Clear search'} onClick={() => setSearchTerm('')}><X size={14} /></button>}</label>
        </section>

        <section className="development-content-grid">
          <article className="development-collection">
            <header className="development-collection-head"><span className="development-collection-icon course"><BookOpen size={19} /></span><div className="development-collection-title"><h3>{t('devInProgress')}</h3><p>{tr ? 'Öğrenme yolculuğundaki eğitimler' : 'Courses on your learning path'}</p></div><span className="development-count">{courses.length}</span><button type="button" className="development-add-button" onClick={() => { setEditingCourse(null); setShowCourseModal(true); }}><Plus size={15} />{t('devAddCourse')}</button></header>
            <div className="development-collection-body">
              {loading ? <div className="development-loading">{tr ? 'Gelişim verileri yükleniyor...' : 'Loading development data...'}</div> : filteredCourses.length === 0 ? <div className="development-empty"><BookOpen size={24} /><strong>{searchTerm ? (tr ? 'Eşleşen eğitim yok' : 'No matching courses') : (tr ? 'Öğrenmeye yer aç' : 'Make room to learn')}</strong><p>{searchTerm ? (tr ? 'Arama kelimeni değiştirebilirsin.' : 'Try another search term.') : (tr ? 'Takip etmek istediğin bir eğitimi ekleyerek başla.' : 'Add a course to start tracking your progress.')}</p>{!searchTerm && <button type="button" onClick={() => { setEditingCourse(null); setShowCourseModal(true); }}><Plus size={14} />{t('devAddCourse')}</button>}</div> : filteredCourses.map((course) => { const progress = Math.max(0, Math.min(100, Number(course.progress) || 0)); const done = course.status === 'COMPLETED' || progress >= 100; return <div key={course.id} className="development-item"><div className="development-item-symbol course"><BookOpen size={17} /></div><div className="development-item-main"><div className="development-item-title-row"><h4>{course.title}</h4><span className={`development-status ${done ? 'completed' : 'in-progress'}`}>{done ? (tr ? 'Tamamlandı' : 'Completed') : (tr ? 'Devam ediyor' : 'In progress')}</span></div><p>{course.platform || (tr ? 'Platform belirtilmedi' : 'Platform not specified')}</p><div className="development-progress-row"><div className="development-progress-track"><span style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div></div><div className="development-item-actions"><button type="button" aria-label={tr ? 'Eğitimi düzenle' : 'Edit course'} onClick={() => { setEditingCourse(course); setShowCourseModal(true); }}><Edit2 size={15} /></button><button type="button" aria-label={tr ? 'Eğitimi sil' : 'Delete course'} onClick={() => handleDeleteCourse(course.id)}><Trash2 size={15} /></button></div></div>; })}
            </div>
          </article>

          <article className="development-collection">
            <header className="development-collection-head"><span className="development-collection-icon project"><FolderGit2 size={19} /></span><div className="development-collection-title"><h3>{t('devProjects')}</h3><p>{tr ? 'Fikirden çalışan ürüne' : 'From idea to working product'}</p></div><span className="development-count">{projects.length}</span><button type="button" className="development-add-button" onClick={() => { setEditingProject(null); setShowProjectModal(true); }}><Plus size={15} />{t('devAddProject')}</button></header>
            <div className="development-collection-body">
              {loading ? <div className="development-loading">{tr ? 'Projeler yükleniyor...' : 'Loading projects...'}</div> : filteredProjects.length === 0 ? <div className="development-empty"><FolderGit2 size={24} /><strong>{searchTerm ? (tr ? 'Eşleşen proje yok' : 'No matching projects') : (tr ? 'Bir fikirle başla' : 'Start with an idea')}</strong><p>{searchTerm ? (tr ? 'Arama kelimeni değiştirebilirsin.' : 'Try another search term.') : (tr ? 'Üzerinde çalıştığın projeleri burada takip et.' : 'Track the projects you are building here.')}</p>{!searchTerm && <button type="button" onClick={() => { setEditingProject(null); setShowProjectModal(true); }}><Plus size={14} />{t('devAddProject')}</button>}</div> : filteredProjects.map((project) => { const done = ['COMPLETED', 'Tamamlandı'].includes(project.status); return <div key={project.id} className="development-item"><div className="development-item-symbol project"><Code2 size={17} /></div><div className="development-item-main"><div className="development-item-title-row"><h4>{project.title}</h4><span className={`development-status ${done ? 'completed' : 'in-progress'}`}>{done ? (tr ? 'Tamamlandı' : 'Completed') : (project.status || (tr ? 'Devam ediyor' : 'In progress'))}</span></div><p>{project.tech || (tr ? 'Teknoloji belirtilmedi' : 'Tech stack not specified')}</p></div><div className="development-item-actions"><button type="button" aria-label={tr ? 'Projeyi düzenle' : 'Edit project'} onClick={() => { setEditingProject(project); setShowProjectModal(true); }}><Edit2 size={15} /></button><button type="button" aria-label={tr ? 'Projeyi sil' : 'Delete project'} onClick={() => handleDeleteProject(project.id)}><Trash2 size={15} /></button></div></div>; })}
            </div>
          </article>

          <article className="development-collection development-skills-collection">
            <header className="development-collection-head"><span className="development-collection-icon skill"><Target size={19} /></span><div className="development-collection-title"><h3>{t('devTargetSkills')}</h3><p>{tr ? 'Becerilerini zamanla güçlendir' : 'Strengthen your skills over time'}</p></div><span className="development-count">{skills.length}</span><button type="button" className="development-add-button" onClick={() => { setEditingSkill(null); setShowSkillModal(true); }}><Plus size={15} />{t('devAddSkill')}</button></header>
            <div className="development-collection-body development-skills-body">
              {loading ? <div className="development-loading">{tr ? 'Yetenekler yükleniyor...' : 'Loading skills...'}</div> : filteredSkills.length === 0 ? <div className="development-empty"><Target size={24} /><strong>{searchTerm ? (tr ? 'Eşleşen yetenek yok' : 'No matching skills') : (tr ? 'Becerilerini görünür kıl' : 'Make your skills visible')}</strong><p>{searchTerm ? (tr ? 'Arama kelimeni değiştirebilirsin.' : 'Try another search term.') : (tr ? 'Seviyesini takip etmek istediğin bir yetenek ekle.' : 'Add a skill to track your current level.')}</p>{!searchTerm && <button type="button" onClick={() => { setEditingSkill(null); setShowSkillModal(true); }}><Plus size={14} />{t('devAddSkill')}</button>}</div> : filteredSkills.map((skill) => { const IconComponent = getSkillIcon(skill.name); const level = Math.max(0, Math.min(100, Number(skill.level) || 0)); return <div key={skill.id} className="development-skill-item"><span className="development-item-symbol skill"><IconComponent size={17} /></span><div className="development-skill-main"><div className="development-item-title-row"><h4>{skill.name}</h4><strong>{level}%</strong></div><div className="development-progress-track"><span style={{ width: `${level}%` }} /></div><span className="development-skill-caption">{level >= 76 ? (tr ? 'İyi seviyede' : 'Strong') : level >= 41 ? (tr ? 'Gelişiyor' : 'Developing') : (tr ? 'Odak alanı' : 'Focus area')}</span></div><div className="development-item-actions"><button type="button" aria-label={tr ? 'Yeteneği düzenle' : 'Edit skill'} onClick={() => { setEditingSkill(skill); setShowSkillModal(true); }}><Edit2 size={15} /></button><button type="button" aria-label={tr ? 'Yeteneği sil' : 'Delete skill'} onClick={() => handleDeleteSkill(skill.id)}><Trash2 size={15} /></button></div></div>; })}
            </div>
            {!loading && skills.length > 0 && <footer className="development-skills-footer"><span>{tr ? 'Ortalama yetenek seviyesi' : 'Average skill level'}</span><strong>{averageSkillLevel}%</strong></footer>}
          </article>

          <article className="development-activity-panel">
            <header className="development-activity-head"><span className="development-collection-icon activity"><TrendingUp size={19} /></span><div><h3>{t('devChartTitle')}</h3><p>{t('devChartSubtitle')}</p></div><span className="development-activity-average">{weeklyAverage}% <small>{tr ? 'ortalama' : 'average'}</small></span></header>
            <div className="development-chart" role="img" aria-label={tr ? 'Son yedi günün ajanda etkinliği grafiği' : 'Agenda activity chart for the last seven days'}>{chartData.map((value, index) => <div className="development-chart-column" key={`${chartLabels[index]}-${index}`}><span className="development-chart-value">{value}%</span><div className="development-chart-track"><span style={{ height: `${Math.max(0, Math.min(100, value))}%` }} /></div><span className="development-chart-label">{chartLabels[index]}</span></div>)}</div>
            <div className="development-chart-note"><CircleCheck size={15} />{tr ? 'Grafik, ajandandaki tamamlanan görevler, notlar ve ruh hâli kayıtlarından hesaplanır.' : 'Calculated from completed tasks, notes and mood entries in your agenda.'}<ArrowUpRight size={15} /></div>
          </article>
        </section>
      </main>
      <CourseFormModal show={showCourseModal} onClose={() => { setShowCourseModal(false); setEditingCourse(null); }} onSubmit={handleAddCourse} initialData={editingCourse} />
      <ProjectFormModal show={showProjectModal} onClose={() => { setShowProjectModal(false); setEditingProject(null); }} onSubmit={handleAddProject} initialData={editingProject} />
      <SkillFormModal show={showSkillModal} onClose={() => { setShowSkillModal(false); setEditingSkill(null); }} onSubmit={handleAddSkill} initialData={editingSkill} />
      {deleteConfirm.show && <div className="development-delete-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteConfirm({ show: false, id: null, type: null }); }}><section className="development-delete-modal" role="dialog" aria-modal="true" aria-labelledby="development-delete-title"><span className="development-delete-icon"><Trash2 size={24} /></span><h3 id="development-delete-title">{tr ? 'Silmek istediğine emin misin?' : 'Are you sure you want to delete this?'}</h3><p>{t('confirmDelete')}</p><div><button type="button" onClick={() => setDeleteConfirm({ show: false, id: null, type: null })}>{t('btnCancel')}</button><button type="button" onClick={executeDelete}>{tr ? 'Sil' : 'Delete'}</button></div></section></div>}
    </>
  );
}
