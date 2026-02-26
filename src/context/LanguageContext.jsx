import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  tr: {
    // Menü
    menuDashboard: 'Dashboard',
    menuTracker: 'Tracker',
    menuAgenda: 'Ajanda',
    menuCalendar: 'Takvim',
    menuDev: 'Gelişim',
    menuResume: 'Resume',
    
    // Dashboard (İstatistikler)
    statTotal: 'Başvurulan',
    statInterview: 'Mülakat',
    statAssessment: 'Teknik Sınav',
    statVideo: 'Video Mülakat',
    statOffer: 'Kabul',
    calendarTitle: 'Takvim',
    reminderTitle: 'Hatırlatıcı',

    // Topbar
    myAccount: 'HESABIM',
    loggedInAs: 'GİRİŞ YAPILAN HESAP',
    profile: 'Profilim',
    settings: 'Ayarlar',
    logout: 'Çıkış Yap',
    comingSoon: 'Bu özellik yakında eklenecek!',
    defaultUser: 'Kullanıcı',
    
    // Tracker Tablo
    dashTitle: 'Başvurularım',
    dashSubtitle: 'Kariyer yolculuğundaki tüm adımların burada ✨',
    addNew: '+ Yeni Ekle',
    loading: 'YÜKLENİYOR...',
    emptyList: 'Henüz bir kayıt yok. Kariyer serüvenine başla!',
    colCompany: 'KURUM',
    colPosition: 'POZİSYON',
    colLocMode: 'LOKASYON & MOD',
    colSalary: 'MAAŞ',
    colStage: 'AŞAMA',
    colAction: 'İŞLEM',
    btnView: 'Görüntüle',
    unspecified: 'Belirtilmedi',
    
    // Uyarılar ve Başvuru Durumları
    confirmDelete: 'Bu kaydı silmek istediğine emin misin?',
    errorLog: 'Hata',
    userInfoError: 'Kullanıcı bilgisi alınamadı',
    statusApplied: 'Başvuruldu',
    statusAssessment: 'Teknik Sınav',
    statusVideo: 'Video Mülakat',
    statusInterview: 'Görüşme',
    statusOffer: 'Kabul',
    statusRejected: 'Red',

    // Modallar Ortak
    btnCancel: 'İptal',
    btnSave: 'Kaydet',
    btnUpdating: 'Güncelleniyor...',

    // Form Modalı
    newAppTitle: 'Yeni Başvuru Kaydı',
    formCompany: 'Kurum / Şirket Adı',
    formPosition: 'Pozisyon / Program Adı',
    formCategory: 'Kategori',
    catJob: 'İş Başvurusu',
    catInternship: 'Staj',
    catBootcamp: 'Bootcamp',
    catWebinar: 'Webinar',
    catOther: 'Diğer',
    formPlatform: 'Platform',
    platCompanySite: 'Şirket Sitesi',
    platOther: 'Diğer (URL/Ad Belirt)',
    platPlaceholder: 'Site adı veya URL...',
    formSalaryStatus: 'Maaş / Ücret Durumu',
    salUnknown: 'Bilinmiyor',
    salVolunteer: 'Gönüllü (Ücretsiz)',
    salSpecific: 'Tutar Belirt...',
    formAmount: 'Miktar',
    salPlaceholder: 'Örn: 45.000 TL',
    formWorkMode: 'Çalışma Modeli',
    modeRemote: 'Remote',
    modeHybrid: 'Hybrid',
    modeOnsite: 'Ofis',
    formLocation: 'Lokasyon',
    locPlaceholder: 'Şehir/Ülke',
    formDate: 'Tarih',
    formQuestions: 'Başvuru Formu Soruları & Cevaplarım',
    questionsPlaceholder: 'Deneyim yılı, teknik sorular vb. formda ne cevap verdiğini buraya not et...',
    formDescription: 'İlan Detayları',
    descPlaceholder: 'İş tanımını buraya yapıştırabilirsin...',

    // Detay Modalı
    oldNote: 'Eski Not',
    detailPlatform: 'Platform',
    detailUnspecified: 'Belirsiz',
    detailSalary: 'Maaş',
    detailMode: 'Mod',
    detailLocation: 'Lokasyon',
    detailNotSpecified: 'Belirtilmedi',
    detailQuestions: 'Başvuru Formu Bilgilerim',
    detailDescription: 'İş Tanımı',
    detailJournal: 'Süreç Günlüğü',
    journalPlaceholder: 'Bu aşamada neler oldu? Notlarını ekle...',
    btnAddJournal: 'Günlüğe Ekle',
    emptyJournal: 'Henüz bir günlük girişi yapılmamış.',

    // Statü Modalı
    statusUpdating: 'Aşama Güncelleniyor',
    newStatusLabel: 'Yeni statü:',
    statusNotePrompt: 'Bu değişiklikle ilgili bir not eklemek ister misin?',
    statusNotePlaceholder: 'Örn: Teknik sınav maili geldi, haftaya Salı günü için randevulaştık...',
    btnUpdateAndNote: 'Güncelle ve Notu Ekle',
    btnContinueWithoutNote: 'Notsuz Devam Et',
  },
  en: {
    menuDashboard: 'Dashboard',
    menuTracker: 'Tracker',
    menuAgenda: 'Agenda',
    menuCalendar: 'Calendar',
    menuDev: 'Development',
    menuResume: 'Resume',
    
    statTotal: 'Applied',
    statInterview: 'Interview',
    statAssessment: 'Assessment',
    statVideo: 'Video Interview',
    statOffer: 'Offer',
    calendarTitle: 'Calendar',
    reminderTitle: 'Reminder',

    myAccount: 'MY ACCOUNT',
    loggedInAs: 'LOGGED IN AS',
    profile: 'My Profile',
    settings: 'Settings',
    logout: 'Logout',
    comingSoon: 'This feature is coming soon!',
    defaultUser: 'User',
    
    dashTitle: 'My Applications',
    dashSubtitle: 'All steps of your career journey are here ✨',
    addNew: '+ Add New',
    loading: 'LOADING...',
    emptyList: 'No records yet. Start your career journey!',
    colCompany: 'COMPANY',
    colPosition: 'POSITION',
    colLocMode: 'LOCATION & MODE',
    colSalary: 'SALARY',
    colStage: 'STAGE',
    colAction: 'ACTION',
    btnView: 'View',
    unspecified: 'Unspecified',
    
    confirmDelete: 'Are you sure you want to delete this record?',
    errorLog: 'Error',
    userInfoError: 'Could not fetch user info',
    statusApplied: 'Applied',
    statusAssessment: 'Assessment',
    statusVideo: 'Video Interview',
    statusInterview: 'Interview',
    statusOffer: 'Offer',
    statusRejected: 'Rejected',

    btnCancel: 'Cancel',
    btnSave: 'Save',
    btnUpdating: 'Updating...',

    newAppTitle: 'New Application Record',
    formCompany: 'Company / Org Name',
    formPosition: 'Position / Program Name',
    formCategory: 'Category',
    catJob: 'Job Application',
    catInternship: 'Internship',
    catBootcamp: 'Bootcamp',
    catWebinar: 'Webinar',
    catOther: 'Other',
    formPlatform: 'Platform',
    platCompanySite: 'Company Website',
    platOther: 'Other (URL/Name)',
    platPlaceholder: 'Site name or URL...',
    formSalaryStatus: 'Salary / Wage Status',
    salUnknown: 'Unknown',
    salVolunteer: 'Volunteer (Unpaid)',
    salSpecific: 'Specify Amount...',
    formAmount: 'Amount',
    salPlaceholder: 'e.g. 45.000 TL',
    formWorkMode: 'Work Mode',
    modeRemote: 'Remote',
    modeHybrid: 'Hybrid',
    modeOnsite: 'Onsite',
    formLocation: 'Location',
    locPlaceholder: 'City/Country',
    formDate: 'Date',
    formQuestions: 'Application Form Questions & Answers',
    questionsPlaceholder: 'Note your answers to form questions like years of exp, technical questions here...',
    formDescription: 'Job Description',
    descPlaceholder: 'You can paste the job description here...',

    oldNote: 'Old Note',
    detailPlatform: 'Platform',
    detailUnspecified: 'Unspecified',
    detailSalary: 'Salary',
    detailMode: 'Mode',
    detailLocation: 'Location',
    detailNotSpecified: 'Not Specified',
    detailQuestions: 'My Application Form Info',
    detailDescription: 'Job Description',
    detailJournal: 'Process Journal',
    journalPlaceholder: 'What happened at this stage? Add your notes...',
    btnAddJournal: 'Add to Journal',
    emptyJournal: 'No journal entry has been made yet.',

    statusUpdating: 'Updating Stage',
    newStatusLabel: 'New status:',
    statusNotePrompt: 'Would you like to add a note regarding this change?',
    statusNotePlaceholder: 'e.g. Received technical test email, scheduled for next Tuesday...',
    btnUpdateAndNote: 'Update and Add Note',
    btnContinueWithoutNote: 'Continue Without Note',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('app_lang') || 'tr');

  const toggleLanguage = () => {
    const newLang = language === 'tr' ? 'en' : 'tr';
    setLanguage(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);