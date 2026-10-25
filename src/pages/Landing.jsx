import { ArrowDownRight, ArrowRight, BookOpen, CalendarDays, Check, CircleCheck, FileText, Globe, LayoutDashboard, ListTodo, Moon, Sun, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const copy = {
  tr: {
    nav: [{ id: 'features', label: 'Özellikler' }, { id: 'workflow', label: 'Nasıl çalışır?' }, { id: 'about', label: 'Pebble hakkında' }],
    signIn: 'Giriş yap', signUp: 'Ücretsiz başla', eyebrow: 'Kariyer yolculuğun için tek bir alan',
    titleStart: 'Hedeflerini', titleAccent: ' küçük adımlarla', titleEnd: ' gerçeğe dönüştür.',
    subtitle: 'İş başvurularını takip et, gününü planla, gelişimini gör. Kariyer yolculuğundaki dağınık parçaları tek bir sakin ve düzenli çalışma alanında birleştir.',
    primary: 'Kendi alanını oluştur', secondary: 'Neler yapabilirim?', note: 'Ücretsiz kullan · İlerlemen senin kontrolünde',
    previewLabel: 'BUGÜNÜN ÖZETİ', previewGreeting: 'Güzel bir başlangıç, değil mi?', applications: 'Başvuru takibi', tasks: 'Günün görevleri', progress: 'Gelişim', upcoming: 'Sıradaki', interview: 'Teknik görüşme hazırlığı', tomorrow: 'Yarın · 10.30', done: 'tamamlandı',
    featuresEyebrow: 'Daha az dağınıklık, daha çok odak', featuresTitle: 'Kariyerinin her parçası, aynı yerde.', featuresText: 'İhtiyacın olan araçlar birbirinden kopuk değil. Birlikte çalışan sade bir sistem.',
    feature1Title: 'Başvurularını takip et', feature1Text: 'Şirketleri, pozisyonları ve süreç aşamalarını tek bir görünümde düzenle.', feature2Title: 'Gününü planla', feature2Text: 'Ajanda ve takvimle görevlerini, notlarını ve önemli tarihlerini bir arada tut.', feature3Title: 'Gelişimini görünür kıl', feature3Text: 'Projelerini, becerilerini ve CV bilgilerini güncel tut; ilerlemeni somutlaştır.',
    workflowEyebrow: 'Basit bir akış', workflowTitle: 'Nerede kaldığını bil. Sonraki adımını seç.', step1: 'Düzenle', step1Text: 'Başvurularını ve günlük önceliklerini tek yerde topla.', step2: 'Planla', step2Text: 'Takvimine gerçekçi adımlar ve hatırlatmalar ekle.', step3: 'İlerle', step3Text: 'Tamamladıklarını gör ve bir sonraki hedefe odaklan.',
    aboutEyebrow: 'Pebble yaklaşımı', aboutTitle: 'Büyük hedefler, küçük ve sürdürülebilir adımlarla.', aboutText: 'Kariyerini geliştirmek başlı başına bir iş gibi hissettirmesin. Pebble, plan yapmana, takipte kalmana ve kendi ilerlemeni fark etmene yardımcı olmak için tasarlandı.',
    ctaTitle: 'Bir sonraki küçük adımın ne olacak?', ctaText: 'Kendi çalışma alanını oluştur ve kariyer yolculuğunu daha görünür hâle getir.', ctaButton: 'Pebble’ı keşfet', footer: 'Küçük adımlar. Gerçek ilerleme.', more: 'Aşağı kaydır'
  },
  en: {
    nav: [{ id: 'features', label: 'Features' }, { id: 'workflow', label: 'How it works' }, { id: 'about', label: 'About Pebble' }],
    signIn: 'Sign in', signUp: 'Get started', eyebrow: 'One workspace for your career journey',
    titleStart: 'Turn your goals into', titleAccent: ' small steps', titleEnd: ' that move you forward.',
    subtitle: 'Track applications, plan your days, and make progress visible. Bring the moving parts of your career journey into one calm, organized workspace.',
    primary: 'Create your workspace', secondary: 'Explore features', note: 'Free to use · Your progress stays in your hands',
    previewLabel: 'TODAY AT A GLANCE', previewGreeting: 'A good place to start.', applications: 'Applications', tasks: "Today's tasks", progress: 'Growth', upcoming: 'UP NEXT', interview: 'Technical interview prep', tomorrow: 'Tomorrow · 10:30', done: 'completed',
    featuresEyebrow: 'Less scattered, more focused', featuresTitle: 'Every part of your career, in one place.', featuresText: 'Your tools should work together—not pull you in different directions.',
    feature1Title: 'Track applications', feature1Text: 'Organize companies, roles, and application stages in one clear view.', feature2Title: 'Plan your day', feature2Text: 'Keep tasks, notes, and important dates connected through your agenda and calendar.', feature3Title: 'Make growth visible', feature3Text: 'Keep projects, skills, and CV details up to date—and see your progress take shape.',
    workflowEyebrow: 'A simple rhythm', workflowTitle: 'Know where you are. Choose what comes next.', step1: 'Organize', step1Text: 'Bring applications and daily priorities together.', step2: 'Plan', step2Text: 'Add realistic steps and reminders to your calendar.', step3: 'Grow', step3Text: 'See what you have completed and focus on the next goal.',
    aboutEyebrow: 'The Pebble approach', aboutTitle: 'Big goals, built through small and sustainable steps.', aboutText: 'Growing your career should not feel like a job of its own. Pebble helps you plan, stay on track, and notice the progress you are making.',
    ctaTitle: "What's your next small step?", ctaText: 'Create your own workspace and make your career journey easier to see.', ctaButton: 'Explore Pebble', footer: 'Small steps. Real progress.', more: 'Scroll to explore'
  }
};

const featureIcons = [ListTodo, CalendarDays, TrendingUp];

export default function Landing() {
  const { language, toggleLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const text = copy[language === 'tr' ? 'tr' : 'en'];
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
      const marker = window.innerHeight * 0.32;
      const sections = ['hero', 'features', 'workflow', 'about'];
      let current = 'hero';
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= marker) current = id;
      });
      setActiveSection(current);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="pebble-landing">
      <div className="landing-ambient landing-ambient-one" aria-hidden="true" />
      <div className="landing-ambient landing-ambient-two" aria-hidden="true" />
      <header className={`landing-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="landing-header-inner">
          <a href="#hero" className="landing-brand" onClick={(event) => scrollToSection(event, 'hero')} aria-label="Pebble home">
            <Logo className="landing-logo" />
            <span>Pebble</span>
          </a>
          <nav className="landing-nav" aria-label={language === 'tr' ? 'Ana navigasyon' : 'Main navigation'}>
            {text.nav.map((item) => <a key={item.id} href={`#${item.id}`} onClick={(event) => scrollToSection(event, item.id)} className={activeSection === item.id ? 'is-active' : ''}>{item.label}</a>)}
          </nav>
          <div className="landing-header-actions">
            <button type="button" className="landing-icon-button" onClick={toggleTheme} aria-label={isDarkMode ? (language === 'tr' ? 'Açık temaya geç' : 'Switch to light theme') : (language === 'tr' ? 'Koyu temaya geç' : 'Switch to dark theme')}>{isDarkMode ? <Moon size={17} /> : <Sun size={17} />}</button>
            <button type="button" className="landing-language-button" onClick={toggleLanguage} aria-label={language === 'tr' ? 'Switch to English' : 'Türkçeye geç'}><Globe size={15} /><span>{language === 'tr' ? 'EN' : 'TR'}</span></button>
            <button type="button" className="landing-signin" onClick={() => navigate('/login')}>{text.signIn}</button>
            <button type="button" className="landing-signup" onClick={() => navigate('/register')}>{text.signUp}<ArrowRight size={15} /></button>
          </div>
        </div>
      </header>

      <section id="hero" className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow"><span className="landing-eyebrow-dot" />{text.eyebrow}</div>
          <h1>{text.titleStart}<span>{text.titleAccent}</span>{text.titleEnd}</h1>
          <p className="landing-hero-description">{text.subtitle}</p>
          <div className="landing-hero-actions">
            <button type="button" className="landing-primary-cta" onClick={() => navigate('/register')}>{text.primary}<ArrowRight size={17} /></button>
            <a href="#features" className="landing-secondary-cta" onClick={(event) => scrollToSection(event, 'features')}>{text.secondary}<ArrowDownRight size={17} /></a>
          </div>
          <div className="landing-trust-note"><span><Check size={13} /></span>{text.note}</div>
        </div>
        <div className="landing-preview-wrap" aria-label={text.previewLabel}>
          <div className="landing-preview-orbit" aria-hidden="true" />
          <div className="landing-preview-card">
            <div className="landing-preview-topline"><div className="landing-preview-brand"><Logo className="landing-preview-logo" /><span>Pebble</span></div><span className="landing-preview-date">{new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric' })}</span></div>
            <div className="landing-preview-welcome"><span>{text.previewLabel}</span><h2>{text.previewGreeting}</h2></div>
            <div className="landing-preview-stats">
              <div className="landing-preview-stat"><span className="landing-preview-stat-icon"><ListTodo size={16} /></span><span>{text.applications}</span><strong>08</strong><small>{language === 'tr' ? 'aktif süreç' : 'active processes'}</small></div>
              <div className="landing-preview-stat"><span className="landing-preview-stat-icon sage"><CircleCheck size={16} /></span><span>{text.tasks}</span><strong>04</strong><small>{text.done}</small></div>
            </div>
            <div className="landing-preview-progress"><div><span>{text.progress}</span><strong>68%</strong></div><div className="landing-progress-track"><span /></div></div>
            <div className="landing-preview-upnext"><div className="landing-upnext-icon"><CalendarDays size={17} /></div><div><small>{text.upcoming}</small><strong>{text.interview}</strong><span>{text.tomorrow}</span></div><ArrowRight size={16} /></div>
          </div>
          <div className="landing-floating-chip"><span><Check size={13} /></span>{language === 'tr' ? 'Bir adım daha tamamlandı' : 'One more step completed'}</div>
        </div>
        <a className="landing-scroll-cue" href="#features" onClick={(event) => scrollToSection(event, 'features')}><span>{text.more}</span><span className="landing-scroll-line" /></a>
      </section>

      <section id="features" className="landing-section landing-features">
        <div className="landing-section-heading"><span>{text.featuresEyebrow}</span><h2>{text.featuresTitle}</h2><p>{text.featuresText}</p></div>
        <div className="landing-feature-grid">
          {[text.feature1Title, text.feature2Title, text.feature3Title].map((title, index) => {
            const Icon = featureIcons[index];
            const descriptions = [text.feature1Text, text.feature2Text, text.feature3Text];
            return <article className="landing-feature-card" key={title}><div className={`landing-feature-icon landing-feature-icon-${index + 1}`}><Icon size={21} /></div><span className="landing-feature-number">0{index + 1}</span><h3>{title}</h3><p>{descriptions[index]}</p></article>;
          })}
        </div>
      </section>

      <section id="workflow" className="landing-section landing-workflow">
        <div className="landing-workflow-heading"><span>{text.workflowEyebrow}</span><h2>{text.workflowTitle}</h2></div>
        <div className="landing-steps">
          {[{ title: text.step1, body: text.step1Text, icon: LayoutDashboard }, { title: text.step2, body: text.step2Text, icon: CalendarDays }, { title: text.step3, body: text.step3Text, icon: TrendingUp }].map((step, index) => {
            const Icon = step.icon;
            return <article className="landing-step" key={step.title}><div className="landing-step-top"><span>0{index + 1}</span><Icon size={19} /></div><h3>{step.title}</h3><p>{step.body}</p></article>;
          })}
        </div>
      </section>

      <section id="about" className="landing-about">
        <div className="landing-about-mark"><BookOpen size={22} /></div><div><span>{text.aboutEyebrow}</span><h2>{text.aboutTitle}</h2><p>{text.aboutText}</p></div>
      </section>

      <section className="landing-final-cta"><div className="landing-final-orb" aria-hidden="true" /><span>{text.ctaTitle}</span><p>{text.ctaText}</p><button type="button" className="landing-primary-cta" onClick={() => navigate('/register')}>{text.ctaButton}<ArrowRight size={17} /></button></section>

      <footer className="landing-footer"><a href="#hero" className="landing-footer-brand" onClick={(event) => scrollToSection(event, 'hero')}><Logo className="landing-footer-logo" /><span>Pebble</span></a><p>{text.footer}</p><span>© {new Date().getFullYear()} Pebble</span></footer>
    </main>
  );
}
