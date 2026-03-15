import { BookOpen, Code2, Database, FolderGit2, LayoutTemplate, Plus, Server, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Development() {
  const { t } = useLanguage();

  const [inProgressCourses] = useState([
    { id: 1, title: 'React ile İleri Seviye Frontend', platform: 'Udemy', progress: 75 },
    { id: 2, title: 'Spring Boot 3 & Microservices', platform: 'YouTube', progress: 30 },
  ]);

  const [projects] = useState([
    { id: 1, title: 'Job Tracker Dashboard', tech: 'React, Spring Boot', status: 'Devam Ediyor' },
    { id: 2, title: 'E-Ticaret Rest API', tech: 'Java, PostgreSQL', status: 'Tamamlandı' },
  ]);

  const [skills] = useState([
    { name: 'React', level: 80, icon: LayoutTemplate, color: 'text-columbia' },
    { name: 'Spring Boot', level: 65, icon: Code2, color: 'text-cambridge' },
    { name: 'PostgreSQL', level: 70, icon: Database, color: 'text-columbia' },
    { name: 'Docker', level: 40, icon: Server, color: 'text-columbia' },
  ]);

  const chartData = [40, 65, 45, 80, 55, 90, 100]; // Temsili grafik verisi

  return (
    <div className="space-y-6">

      {/* BÜTÜNLÜK SAĞLAYAN BÜYÜK ANA CONTAINER */}
      <div className="bg-white dark:bg-twilight rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none p-6 md:p-8 lg:p-10 border border-cambridge/20 dark:border-starlight/30 transition-colors duration-500 space-y-8">

        {/* YAN YANA 3 TABLO GRID YAPISI */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* TABLO 1: Eğitimler */}
          <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] overflow-hidden border border-columbia/10 dark:border-starlight/20">
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-peach/10 dark:bg-peach/20 rounded-xl text-peach">
                  <BookOpen size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black text-gray-800 dark:text-white tracking-tight">{t('devInProgress')}</h3>
              </div>
              <button className="px-4 py-2 bg-cherry/10 dark:bg-cherry/20 text-cherry font-black rounded-xl hover:bg-cherry hover:text-white transition-all text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Plus size={14} strokeWidth={3} /> {t('devAddCourse')}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-columbia/5 dark:bg-night/40 border-y border-columbia/10 dark:border-starlight/20">
                    <th className="px-6 py-4 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">Eğitim</th>
                    <th className="px-6 py-4 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">İlerleme</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-columbia/10 dark:divide-starlight/20">
                  {inProgressCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-columbia/5 dark:hover:bg-night/30 transition-all group">
                      <td className="px-6 py-5">
                        <span className="block font-bold text-sm text-gray-700 dark:text-gray-200">{course.title}</span>
                        <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{course.platform}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-starlight/30 rounded-full overflow-hidden min-w-[60px]">
                            <div 
                              className="h-full rounded-full bg-peach transition-all duration-1000" 
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-peach">%{course.progress}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLO 2: Projeler */}
          <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] overflow-hidden border border-columbia/10 dark:border-starlight/20">
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-cambridge/10 dark:bg-cambridge/20 rounded-xl text-cambridge">
                  <FolderGit2 size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black text-gray-800 dark:text-white tracking-tight">{t('devProjects')}</h3>
              </div>
              <button className="px-4 py-2 bg-cherry/10 dark:bg-cherry/20 text-cherry font-black rounded-xl hover:bg-cherry hover:text-white transition-all text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Plus size={14} strokeWidth={3} /> {t('devAddProject')}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-columbia/5 dark:bg-night/40 border-y border-columbia/10 dark:border-starlight/20">
                    <th className="px-6 py-4 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">Proje</th>
                    <th className="px-6 py-4 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-columbia/10 dark:divide-starlight/20">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-columbia/5 dark:hover:bg-night/30 transition-all group">
                      <td className="px-6 py-5">
                        <span className="block font-bold text-sm text-gray-700 dark:text-gray-200">{project.title}</span>
                        <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{project.tech}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center ${
                          project.status === 'Tamamlandı' 
                            ? 'bg-cambridge dark:bg-cambridge/40 text-white' 
                            : 'bg-peach/60 dark:bg-peach/20 text-gray-800 dark:text-peach'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLO 3: Yetenekler */}
          <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] overflow-hidden border border-columbia/10 dark:border-starlight/20">
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-columbia/10 dark:bg-columbia/20 rounded-xl text-columbia">
                  <Target size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black text-gray-800 dark:text-white tracking-tight">{t('devTargetSkills')}</h3>
              </div>
              <button className="px-4 py-2 bg-cherry/10 dark:bg-cherry/20 text-cherry font-black rounded-xl hover:bg-cherry hover:text-white transition-all text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Plus size={14} strokeWidth={3} /> {t('devAddSkill')}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-columbia/5 dark:bg-night/40 border-y border-columbia/10 dark:border-starlight/20">
                    <th className="px-6 py-4 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">Yetenek</th>
                    <th className="px-6 py-4 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">Seviye</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-columbia/10 dark:divide-starlight/20">
                  {skills.map((skill, idx) => (
                    <tr key={idx} className="hover:bg-columbia/5 dark:hover:bg-night/30 transition-all group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-white dark:bg-night/50 border border-gray-100 dark:border-starlight/30 ${skill.color}`}>
                            <skill.icon size={16} strokeWidth={2.5} />
                          </div>
                          <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{skill.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-starlight/30 rounded-full overflow-hidden min-w-[60px]">
                            <div 
                              className="h-full rounded-full transition-all duration-1000"
                              style={{ 
                                width: `${skill.level}%`, 
                                backgroundColor: skill.level > 70 ? 'var(--cambridge)' : skill.level > 50 ? 'var(--columbia)' : 'var(--peach)'
                              }}
                            />
                          </div>
                          <span className="text-xs font-black text-gray-500 dark:text-gray-400">%{skill.level}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* GELİŞİM ÇİZELGESİ (CHART MOCKUP) */}
        <div className="bg-gray-50/50 dark:bg-night/20 rounded-[2rem] p-6 md:p-8 border border-columbia/10 dark:border-starlight/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-columbia/10 dark:bg-columbia/20 rounded-2xl text-columbia">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 dark:text-white tracking-tight">{t('devChartTitle')}</h3>
              <p className="text-sm font-medium text-gray-400 mt-1">{t('devChartSubtitle')}</p>
            </div>
          </div>

          {/* Fake Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 md:gap-4 pt-10 border-b border-gray-200 dark:border-starlight/30 pb-4">
            {chartData.map((val, i) => (
              <div key={i} className="relative flex-1 flex justify-center group h-full items-end">
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 dark:bg-black text-white text-xs font-bold py-1.5 px-3 rounded-xl z-10 pointer-events-none shadow-lg">
                  % {val}
                </div>
                <div className="w-full max-w-[3rem] bg-columbia/10 dark:bg-columbia/5 rounded-t-xl relative overflow-hidden h-full group-hover:bg-columbia/20 dark:group-hover:bg-columbia/10 transition-colors">
                  <div 
                    className="absolute bottom-0 w-full bg-columbia rounded-t-xl transition-all duration-1000" 
                    style={{ height: `${val}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* X Axis Labels Mockup */}
          <div className="flex justify-between gap-2 md:gap-4 mt-4 px-2">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, idx) => (
              <div key={idx} className="flex-1 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}