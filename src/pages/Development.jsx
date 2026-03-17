import { BookOpen, Code2, Cpu, Database, FolderGit2, LayoutTemplate, Plus, Server, Target, TrendingUp } from 'lucide-react';
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

  // Çizelge State'leri
  const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0]); 
  const [chartLabels, setChartLabels] = useState(['', '', '', '', '', '', '']);

  // Modal görünürlük state'leri
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);

  useEffect(() => {
    fetchDevelopmentData();
    fetchChartData();
  }, [language]); // Dil değiştiğinde grafik gün isimleri de güncellenmeli

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
    
    // Son 7 günü oluştur (bugün dahil, geriye doğru)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(formatDateForApi(d));
      
      // Etiket için kısa gün adını al (Pzt, Sal, Wed vb.)
      const dayName = d.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short' });
      labels.push(dayName);
    }
    
    setChartLabels(labels);

    try {
      // Backend'den son 7 günün ajanda verilerini eşzamanlı çekiyoruz
      const requests = dates.map(date => api.get(`/api/agenda/${date}`).catch(() => null));
      const responses = await Promise.all(requests);
      
      const scores = responses.map(res => {
        if (!res || !res.data) return 0; // O güne ait kayıt yoksa 0 puan
        
        const data = res.data;
        let score = 0;
        
        // 1. To-do Puanı (Her tamamlanan görev +10 puan)
        if (data.todos && Array.isArray(data.todos)) {
          const completedTodos = data.todos.filter(t => t.completed).length;
          score += completedTodos * 10;
        }
        
        // 2. Not Puanı (20 karakterden uzunsa +20 puan)
        if (data.notes && data.notes.trim().length > 20) {
          score += 20;
        }
        
        // 3. Ruh Hali Puanı
        if (data.mood === 'GOOD') score += 20;
        else if (data.mood === 'NEUTRAL') score += 10;
        
        return Math.min(score, 100); // Maksimum 100 puanda sabitliyoruz
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

    // Örnek: Her tamamlanan görev 10 puan ekler
    const totalScore = (completedCourses + completedProjects + completedSkills) * 10;

    // Çizelge verisini güncelle
    setChartData((prevData) => {
      const newData = [...prevData];
      newData[newData.length - 1] = Math.min(totalScore, 100); // Maksimum 100 puan
      return newData;
    });
  };

  // POST İşlemleri
  const handleAddCourse = async (data) => {
    try {
      await api.post('/api/development/courses', data);
      setShowCourseModal(false);
      fetchDevelopmentData();
      updateChartData(); // Çizelgeyi güncelle
    } catch (error) {
      console.error("Eğitim eklenirken hata:", error);
    }
  };

  const handleAddProject = async (data) => {
    try {
      await api.post('/api/development/projects', data);
      setShowProjectModal(false);
      fetchDevelopmentData();
      updateChartData(); // Çizelgeyi güncelle
    } catch (error) {
      console.error("Proje eklenirken hata:", error);
    }
  };

  const handleAddSkill = async (data) => {
    try {
      await api.post('/api/development/skills', data);
      setShowSkillModal(false);
      fetchDevelopmentData();
      updateChartData(); // Çizelgeyi güncelle
    } catch (error) {
      console.error("Yetenek eklenirken hata:", error);
    }
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

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white dark:bg-twilight rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none p-6 md:p-8 lg:p-10 border border-gray-100 dark:border-starlight/20 transition-colors duration-500 space-y-8">
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            
            {/* TABLO 1: Eğitimler (Elektrik Mavisi Konsepti) */}
            <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-starlight/20">
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                    <BookOpen size={20} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-black text-gray-800 dark:text-white tracking-tight">{t('devInProgress')}</h3>
                </div>
                <button 
                  onClick={() => setShowCourseModal(true)}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 font-black rounded-xl hover:bg-blue-500 hover:text-white transition-all text-[10px] uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Plus size={14} strokeWidth={3} /> {t('devAddCourse')}
                </button>
              </div>
              
              <div className="overflow-x-auto min-h-[200px]">
                {loading ? (
                  <div className="p-10 text-center text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">Yükleniyor...</div>
                ) : courses.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 dark:text-gray-500 italic text-sm">Henüz eğitim eklenmemiş.</div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100/50 dark:bg-night/40 border-y border-gray-100 dark:border-starlight/20">
                        <th className="px-6 py-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Eğitim</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">İlerleme</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-starlight/20">
                      {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-100/50 dark:hover:bg-night/30 transition-all group">
                          <td className="px-6 py-5">
                            <span className="block font-bold text-sm text-gray-700 dark:text-gray-200">{course.title}</span>
                            <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{course.platform}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-gray-200 dark:bg-starlight/30 rounded-full overflow-hidden min-w-[60px]">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${course.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                  style={{ width: `${course.progress || 0}%` }}
                                />
                              </div>
                              <span className={`text-xs font-black ${course.progress === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                %{course.progress || 0}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* TABLO 2: Projeler (Derin Mor Konsepti) */}
            <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-starlight/20">
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
                    <FolderGit2 size={20} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-black text-gray-800 dark:text-white tracking-tight">{t('devProjects')}</h3>
                </div>
                <button 
                  onClick={() => setShowProjectModal(true)}
                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 font-black rounded-xl hover:bg-purple-500 hover:text-white transition-all text-[10px] uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Plus size={14} strokeWidth={3} /> {t('devAddProject')}
                </button>
              </div>
              
              <div className="overflow-x-auto min-h-[200px]">
                {loading ? (
                  <div className="p-10 text-center text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">Yükleniyor...</div>
                ) : projects.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 dark:text-gray-500 italic text-sm">Henüz proje eklenmemiş.</div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100/50 dark:bg-night/40 border-y border-gray-100 dark:border-starlight/20">
                        <th className="px-6 py-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Proje</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-starlight/20">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-100/50 dark:hover:bg-night/30 transition-all group">
                          <td className="px-6 py-5">
                            <span className="block font-bold text-sm text-gray-700 dark:text-gray-200">{project.title}</span>
                            <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{project.tech}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center ${
                              project.status === 'Tamamlandı' || project.status === 'COMPLETED'
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50' 
                                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50'
                            }`}>
                              {project.status || 'Devam Ediyor'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* TABLO 3: Yetenekler (Canlı Turuncu Konsepti) */}
            <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-starlight/20">
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-orange-100 dark:bg-orange-900/40 rounded-xl text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">
                    <Target size={20} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-black text-gray-800 dark:text-white tracking-tight">{t('devTargetSkills')}</h3>
                </div>
                <button 
                  onClick={() => setShowSkillModal(true)}
                  className="px-4 py-2 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 font-black rounded-xl hover:bg-orange-500 hover:text-white transition-all text-[10px] uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Plus size={14} strokeWidth={3} /> {t('devAddSkill')}
                </button>
              </div>
              
              <div className="overflow-x-auto min-h-[200px]">
                {loading ? (
                  <div className="p-10 text-center text-gray-400 font-bold text-xs uppercase tracking-widest animate-pulse">Yükleniyor...</div>
                ) : skills.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 dark:text-gray-500 italic text-sm">Henüz yetenek eklenmemiş.</div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100/50 dark:bg-night/40 border-y border-gray-100 dark:border-starlight/20">
                        <th className="px-6 py-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Yetenek</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Seviye</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-starlight/20">
                      {skills.map((skill) => {
                        const IconComponent = getSkillIcon(skill.name);
                        const colorClass = getSkillColor(skill.level);
                        return (
                          <tr key={skill.id} className="hover:bg-gray-100/50 dark:hover:bg-night/30 transition-all group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-white dark:bg-night/50 border border-gray-100 dark:border-starlight/30 ${colorClass}`}>
                                  <IconComponent size={16} strokeWidth={2.5} />
                                </div>
                                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{skill.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-starlight/30 rounded-full overflow-hidden min-w-[60px]">
                                  <div 
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ 
                                      width: `${skill.level || 0}%`, 
                                      backgroundColor: skill.level > 75 ? '#10b981' : skill.level > 40 ? '#3b82f6' : '#f97316'
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-black text-gray-500 dark:text-gray-400">%{skill.level || 0}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>

          {/* GELİŞİM ÇİZELGESİ (Zümrüt Yeşili Konsepti) */}
          <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] p-6 md:p-8 border border-gray-100 dark:border-starlight/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                <TrendingUp size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">{t('devChartTitle')}</h3>
                <p className="text-sm font-medium text-gray-400 mt-1">{t('devChartSubtitle')}</p>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-2 md:gap-4 pt-10 border-b border-gray-200 dark:border-starlight/30 pb-4">
              {chartData.map((val, i) => (
                <div key={i} className="relative flex-1 flex justify-center group h-full items-end">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 dark:bg-black text-white text-xs font-bold py-1.5 px-3 rounded-xl z-10 pointer-events-none shadow-lg">
                    % {val}
                  </div>
                  <div className="w-full max-w-[3rem] bg-emerald-100 dark:bg-emerald-900/20 rounded-t-xl relative overflow-hidden h-full group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/40 transition-colors">
                    <div 
                      className="absolute bottom-0 w-full bg-emerald-500 rounded-t-xl transition-all duration-1000" 
                      style={{ height: `${val}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between gap-2 md:gap-4 mt-4 px-2">
              {chartLabels.map((day, idx) => (
                <div key={idx} className="flex-1 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modallar */}
      <CourseFormModal 
        show={showCourseModal} 
        onClose={() => setShowCourseModal(false)} 
        onSubmit={handleAddCourse} 
      />
      
      <ProjectFormModal 
        show={showProjectModal} 
        onClose={() => setShowProjectModal(false)} 
        onSubmit={handleAddProject} 
      />
      
      <SkillFormModal 
        show={showSkillModal} 
        onClose={() => setShowSkillModal(false)} 
        onSubmit={handleAddSkill} 
      />
    </>
  );
}