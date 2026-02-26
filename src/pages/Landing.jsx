import { Globe, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Landing() {
  const { t, language, toggleLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['hero', 'about', 'blog', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const GlassContainer = ({ children, className = "" }) => (
    <div className={`max-w-5xl w-[95%] bg-white/60 dark:bg-twilight/60 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-none border border-white/80 dark:border-starlight/30 p-10 md:p-20 flex flex-col items-center text-center transition-colors duration-500 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-alabaster dark:bg-night selection:bg-cherry/20 transition-colors duration-500 font-sans overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-peach/40 dark:bg-peach/10 rounded-full blur-[100px] md:blur-[150px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-columbia/50 dark:bg-columbia/10 rounded-full blur-[100px] md:blur-[150px] opacity-70"></div>
        <div className="absolute top-[30%] left-[60%] w-[30vw] h-[30vw] bg-cherry/30 dark:bg-cherry/10 rounded-full blur-[100px] md:blur-[120px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[35vw] h-[35vw] bg-cambridge/30 dark:bg-cambridge/10 rounded-full blur-[100px] md:blur-[120px] opacity-50"></div>
      </div>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 dark:bg-twilight/80 backdrop-blur-md border-b border-columbia/10 dark:border-starlight/30 ${
        scrolled ? 'py-4 shadow-sm' : 'py-6'
      }`}>
        <div className="max-w-[1200px] w-[90%] mx-auto flex justify-between items-center">
          
          <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="flex items-center gap-3 group cursor-pointer">
            <Logo className="w-10 h-10 shadow-sm rounded-2xl group-hover:scale-105 transition-transform" />
            <h1 className="text-3xl font-black text-cherry tracking-tighter">Pebble</h1>
          </a>

          <div className="hidden md:flex items-center gap-2 bg-white/50 dark:bg-night/50 px-3 py-2 rounded-full border border-columbia/20 dark:border-starlight/30 backdrop-blur-sm shadow-sm">
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeSection === 'about' ? 'bg-cambridge/20 text-cambridge' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'}`}>{t('navAbout')}</a>
            <a href="#blog" onClick={(e) => scrollToSection(e, 'blog')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeSection === 'blog' ? 'bg-peach/30 text-orange-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'}`}>{t('navBlog')}</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeSection === 'contact' ? 'bg-columbia/30 text-columbia' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'}`}>{t('navContact')}</a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className={`relative hidden sm:flex w-12 h-6 rounded-full transition-colors duration-300 ease-in-out items-center px-1 shadow-inner ${isDarkMode ? 'bg-night border border-starlight/50' : 'bg-peach'}`}>
              <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out flex items-center justify-center ${isDarkMode ? 'translate-x-6 bg-starlight text-peach' : 'translate-x-0 bg-white text-orange-400'}`}>
                {isDarkMode ? <Moon size={10} strokeWidth={3} /> : <Sun size={10} strokeWidth={3} />}
              </div>
            </button>

            <button onClick={toggleLanguage} className="group hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-columbia/15 dark:bg-columbia/10 text-columbia rounded-[1.25rem] hover:bg-columbia hover:text-white transition-all duration-300">
              <Globe size={14} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-[10px] font-black tracking-widest">{language === 'tr' ? 'EN' : 'TR'}</span> 
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-columbia/20 dark:border-starlight/30">
              {/* DEĞİŞİKLİK BURADA: Buton artık /register rotasına gidiyor */}
              <button onClick={() => navigate('/register')} className="px-4 py-2 text-xs font-black text-gray-500 dark:text-gray-400 hover:text-cherry dark:hover:text-cherry transition-colors uppercase tracking-widest">
                {t('navRegister')}
              </button>
              <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-cherry text-white text-xs font-black rounded-xl hover:scale-105 active:scale-95 shadow-lg shadow-cherry/20 dark:shadow-none transition-all uppercase tracking-widest">
                {t('navLogin')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center w-full pb-20 pt-32 gap-12">
        
        <section id="hero" className="min-h-[80vh] flex items-center justify-center w-full px-4 animate-fade-in">
          <GlassContainer>
            <h2 className="text-5xl md:text-7xl font-black text-gray-800 dark:text-white tracking-tighter leading-tight mb-8">
              {t('heroTitlePart1')}
              <span className="text-cherry">{t('heroTitleHighlight')}</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium mb-12 max-w-2xl leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <button onClick={() => navigate('/register')} className="px-10 py-5 bg-cherry text-white text-sm font-black rounded-2xl hover:scale-105 active:scale-95 shadow-xl shadow-cherry/30 dark:shadow-none transition-all uppercase tracking-widest">
                {t('getStartedBtn')}
              </button>
              <button onClick={(e) => scrollToSection(e, 'about')} className="px-10 py-5 bg-white/80 dark:bg-twilight text-gray-600 dark:text-gray-300 text-sm font-black rounded-2xl hover:bg-white dark:hover:bg-night shadow-sm border border-columbia/10 dark:border-starlight/30 transition-all uppercase tracking-widest">
                Daha Fazla Bilgi ↓
              </button>
            </div>
          </GlassContainer>
        </section>

        <section id="about" className="min-h-[70vh] flex items-center justify-center w-full px-4">
          <GlassContainer>
            <div className="inline-block p-4 bg-cambridge/10 rounded-full mb-6">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white tracking-tight mb-8">{t('aboutTitle')}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              {t('aboutText')}
            </p>
          </GlassContainer>
        </section>

        <section id="blog" className="min-h-[70vh] flex items-center justify-center w-full px-4">
          <GlassContainer>
            <div className="inline-block p-4 bg-peach/20 rounded-full mb-6">
              <span className="text-4xl">✍️</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white tracking-tight mb-8">{t('blogTitle')}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
              {t('blogText')}
            </p>
            <div className="inline-block px-6 py-3 bg-white dark:bg-twilight rounded-2xl shadow-sm border border-peach/20 text-orange-500 font-black uppercase tracking-widest text-xs animate-pulse">
              Çok Yakında
            </div>
          </GlassContainer>
        </section>

        <section id="contact" className="min-h-[70vh] flex items-center justify-center w-full px-4">
          <GlassContainer>
            <div className="inline-block p-4 bg-columbia/20 rounded-full mb-6">
              <span className="text-4xl">👋</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white tracking-tight mb-8">{t('contactTitle')}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
              {t('contactText')}
            </p>
            <a href="mailto:hello@pebble.com" className="inline-block px-10 py-5 bg-columbia text-white text-sm font-black rounded-2xl hover:scale-105 active:scale-95 shadow-xl shadow-columbia/30 transition-all uppercase tracking-widest">
              Mesaj Gönder
            </a>
          </GlassContainer>
        </section>

      </div>

      <footer className="relative z-10 bg-white/80 dark:bg-twilight/80 backdrop-blur-md py-8 text-center border-t border-columbia/10 dark:border-starlight/30 transition-colors duration-500">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">© {new Date().getFullYear()} Pebble. Tüm Hakları Saklıdır.</p>
      </footer>

    </div>
  );
}