import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, BriefcaseBusiness, CalendarDays, TrendingUp, CircleCheck, MapPin, Trash2, Eye, X, SlidersHorizontal } from 'lucide-react';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';
import ApplicationFormModal from '../components/ApplicationFormModal';
import StatusUpdateModal from '../components/StatusUpdateModal';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function Tracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); 

  const { t, language } = useLanguage();
  const isTr = language === 'tr'; 

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const response = await api.get(`/applications`); 
      
      let fetchedData = [];
      
      if (Array.isArray(response.data)) {
        fetchedData = response.data;
      } else if (response.data && Array.isArray(response.data.content)) {
        fetchedData = response.data.content; 
      } else if (response.data && Array.isArray(response.data.data)) {
        fetchedData = response.data.data;
      } else if (response.data && response.data._embedded) {
        const keys = Object.keys(response.data._embedded);
        if (keys.length > 0) fetchedData = response.data._embedded[keys[0]];
      }
      
      fetchedData.sort((a, b) => {
        const idA = a.id || a.job_application_id || 0;
        const idB = b.id || b.job_application_id || 0;
        return idB - idA;
      });
      
      setApplications(fetchedData);
      
    } catch (error) {
      console.error("API Veri Çekme Hatası:", error);
      if (error.response) {
        setErrorMsg(`Sunucu Hatası: ${error.response.status} - ${error.response.statusText}`);
      } else {
        setErrorMsg(`Bağlantı Hatası: ${error.message}. Backend ayakta mı veya CORS engeli mi var?`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await api.post('/applications', formData);
      setShowAddModal(false);
      fetchApplications(); 
    } catch (error) {
      console.error("Kayıt Ekleme Hatası:", error); 
      alert("Kayıt eklenirken bir hata oluştu!");
    }
  };

  const onStatusDropdownChange = (app, newStatus) => {
    if (app.status === newStatus) return;
    setPendingUpdate({ app, newStatus });
  };

  const handleFinalStatusUpdate = async (noteText) => {
    const { app, newStatus } = pendingUpdate;
    let updatedNotes = app.notes;

    if (noteText && noteText.trim()) {
      try {
        const currentNotes = app.notes && app.notes !== "[]" ? JSON.parse(app.notes) : [];
        const newNoteEntry = { date: new Date().toLocaleString('tr-TR'), text: noteText.trim() };
        updatedNotes = JSON.stringify([newNoteEntry, ...currentNotes]);
      } catch (e) {
        updatedNotes = JSON.stringify([{ date: new Date().toLocaleString('tr-TR'), text: noteText.trim() }]);
      }
    }

    try {
      const appId = app.id || app.job_application_id;
      await api.put(`/applications/${appId}`, { ...app, status: newStatus, notes: updatedNotes });
      setPendingUpdate(null);
      fetchApplications(); 
    } catch (error) {
      console.error("Güncelleme Hatası:", error); 
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm(t('confirmDelete'))) { 
      try {
        await api.delete(`/applications/${id}`);
        fetchApplications(); 
      } catch (error) {
        console.error("Silme Hatası:", error); 
      }
    }
  };

  const statusOptions = [
    { value: 'APPLIED', label: t('statusApplied') },
    { value: 'ASSESSMENT', label: t('statusAssessment') },
    { value: 'VIDEO_INTERVIEW', label: t('statusVideo') },
    { value: 'INTERVIEW', label: t('statusInterview') },
    { value: 'OFFER', label: t('statusOffer') },
    { value: 'REJECTED', label: t('statusRejected') },
  ];
  const normalizedQuery = searchTerm.trim().toLocaleLowerCase(isTr ? 'tr-TR' : 'en-US');
  const filteredApplications = useMemo(() => applications.filter((app) => {
    const company = app.companyName || app.company_name || '';
    const position = app.position || '';
    const location = app.location || '';
    const platform = app.platform || '';
    const matchesQuery = `${company} ${position} ${location} ${platform}`.toLocaleLowerCase().includes(normalizedQuery);
    return matchesQuery && (statusFilter === 'ALL' || (app.status || 'APPLIED').toUpperCase() === statusFilter);
  }), [applications, normalizedQuery, statusFilter]);
  const getStatusLabel = (status) => statusOptions.find((item) => item.value === (status || 'APPLIED').toUpperCase())?.label || status || t('statusApplied');
  const countByStatus = (status) => applications.filter((app) => (app.status || 'APPLIED').toUpperCase() === status).length;
  const formatApplicationDate = (app) => {
    const raw = app.applicationDate || app.application_date || app.createdAt || app.created_at;
    if (!raw) return '';
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <main className="tracker-page">
        <header className="tracker-hero tracker-hero-compact">
          <button type="button" className="tracker-primary-button" onClick={() => setShowAddModal(true)}><Plus size={17} />{t('addNew')}</button>
        </header>

        <section className="tracker-summary-grid" aria-label="Application overview">
          <button type="button" className={`tracker-summary-card ${statusFilter === 'ALL' ? 'is-selected' : ''}`} onClick={() => setStatusFilter('ALL')}>
            <span className="tracker-summary-icon"><BriefcaseBusiness size={19}/></span><span className="tracker-summary-copy"><small>{isTr ? 'TOPLAM BAŞVURU' : 'TOTAL APPLICATIONS'}</small><strong>{applications.length}</strong><em>{t('dashSubtitle')}</em></span><span className="tracker-summary-number">01</span>
          </button>
          <button type="button" className={`tracker-summary-card ${statusFilter === 'INTERVIEW' ? 'is-selected' : ''}`} onClick={() => setStatusFilter('INTERVIEW')}>
            <span className="tracker-summary-icon interview"><CalendarDays size={19}/></span><span className="tracker-summary-copy"><small>{isTr ? 'MÜLAKATLAR' : 'INTERVIEWS'}</small><strong>{countByStatus('INTERVIEW') + countByStatus('VIDEO_INTERVIEW')}</strong><em>{t('statusVideo')}</em></span><span className="tracker-summary-number">02</span>
          </button>
          <button type="button" className={`tracker-summary-card ${statusFilter === 'OFFER' ? 'is-selected' : ''}`} onClick={() => setStatusFilter('OFFER')}>
            <span className="tracker-summary-icon offer"><CircleCheck size={19}/></span><span className="tracker-summary-copy"><small>{isTr ? 'TEKLİFLER' : 'OFFERS'}</small><strong>{countByStatus('OFFER')}</strong><em>{t('statusOffer')}</em></span><span className="tracker-summary-number">03</span>
          </button>
          <button type="button" className={`tracker-summary-card ${statusFilter === 'APPLIED' ? 'is-selected' : ''}`} onClick={() => setStatusFilter('APPLIED')}>
            <span className="tracker-summary-icon activity"><TrendingUp size={19}/></span><span className="tracker-summary-copy"><small>{isTr ? 'BAŞVURULDU' : 'APPLIED'}</small><strong>{countByStatus('APPLIED')}</strong><em>{t('statusApplied')}</em></span><span className="tracker-summary-number">04</span>
          </button>
        </section>

        <section className="tracker-list-panel">
          <div className="tracker-list-heading tracker-list-heading-compact"><span className="tracker-result-count">{filteredApplications.length} <small>{t('colCompany')}</small></span></div>
          <div className="tracker-toolbar">
            <label className="tracker-search"><Search size={17}/><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={t('colCompany') + ', ' + t('colPosition') + '...'} />{searchTerm && <button type="button" onClick={() => setSearchTerm('')} aria-label={isTr ? "Aramayı temizle" : "Clear search"}><X size={14}/></button>}</label>
            <label className="tracker-status-filter"><SlidersHorizontal size={15}/><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="ALL">{t('colStage')} · {applications.length}</option>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label} · {countByStatus(option.value)}</option>)}</select></label>
          </div>

          {loading ? <div className="tracker-state"><span className="tracker-state-spinner"/><strong>{t('loading')}</strong></div>
          : errorMsg ? <div className="tracker-state tracker-error"><strong>⚠ {errorMsg}</strong><button type="button" onClick={fetchApplications}>{t('loading')}</button></div>
          : filteredApplications.length === 0 ? <div className="tracker-state"><span className="tracker-state-icon"><BriefcaseBusiness size={26}/></span><strong>{applications.length ? (searchTerm ? 'Aramana uygun başvuru bulunamadı' : 'Bu aşamada başvuru yok') : t('emptyList')}</strong><p>{applications.length ? (isTr ? 'Arama veya filtreyi değiştirmeyi deneyebilirsin.' : 'Try changing your search or filter.') : t('dashSubtitle')}</p>{!applications.length && <button type="button" className="tracker-primary-button" onClick={() => setShowAddModal(true)}><Plus size={16}/>{t('addNew')}</button>}</div>
          : <div className="tracker-application-list">
            {filteredApplications.map((app) => {
              const appId = app.id || app.job_application_id;
              const company = app.companyName || app.company_name || 'Bilinmeyen kurum';
              const position = app.position || 'Bilinmeyen pozisyon';
              const location = app.location || t('unspecified');
              const mode = app.workMode || app.work_mode || '';
              const salary = app.salary && app.salary !== 'Bilinmiyor' ? app.salary : '';
              const status = (app.status || 'APPLIED').toUpperCase();
              const date = formatApplicationDate(app);
              return <article key={appId} className="tracker-application-card">
                <div className="tracker-company-mark">{company.trim().charAt(0).toLocaleUpperCase()}</div>
                <div className="tracker-application-main"><div className="tracker-application-title"><h3>{company}</h3><span className={`tracker-status-pill tracker-status-${status.toLowerCase()}`}>{getStatusLabel(status)}</span></div><p>{position}</p><div className="tracker-application-meta">{location && <span><MapPin size={13}/>{location}</span>}{mode && <span>{mode}</span>}{date && <span><CalendarDays size={13}/>{date}</span>}{salary && <span className="tracker-salary">{salary}</span>}</div></div>
                <div className="tracker-application-actions"><label className="tracker-card-status"><span>{t('colStage')}</span><select value={status} onChange={(event) => onStatusDropdownChange(app, event.target.value)} aria-label={t('colStage')}>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><button type="button" className="tracker-view-button" onClick={() => setSelectedApp(app)}><Eye size={15}/>{t('btnView')}</button><button type="button" className="tracker-delete-button" onClick={() => handleDelete(appId)} aria-label={t('confirmDelete')}><Trash2 size={16}/></button></div>
              </article>;
            })}
          </div>}
        </section>
      </main>
      <ApplicationFormModal show={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddSubmit} />
      <ApplicationDetailsModal app={selectedApp} onClose={() => setSelectedApp(null)} onUpdate={fetchApplications} />
      <StatusUpdateModal show={!!pendingUpdate} newStatus={pendingUpdate?.newStatus} onClose={() => setPendingUpdate(null)} onConfirm={handleFinalStatusUpdate} />
    </>
  );
}
