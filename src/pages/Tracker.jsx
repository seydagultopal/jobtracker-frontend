import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const { t } = useLanguage(); 
  const navigate = useNavigate();

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

  // YENİ: Dashboard ile uyumlu, Dengeli Kontrast Rozet Renkleri
  const getStatusBadge = (status) => {
    const safeStatus = status ? status.toUpperCase() : 'APPLIED';
    const styles = {
      'APPLIED': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50',
      'INTERVIEW': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50',
      'ASSESSMENT': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50',
      'VIDEO_INTERVIEW': 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/50',
      'OFFER': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50',
      'REJECTED': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50'
    };
    return styles[safeStatus] || 'bg-gray-100 dark:bg-starlight/50 text-gray-500 dark:text-gray-300';
  };

  return (
    <>
      <div className="bg-white dark:bg-twilight rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none overflow-hidden border border-cambridge/20 dark:border-starlight/30 transition-colors duration-500">
        
        <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">{t('dashTitle')}</h2>
            <p className="text-gray-400 dark:text-gray-400 font-medium mt-2">{t('dashSubtitle')}</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="shrink-0 px-8 py-4 bg-cherry text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cherry/20 dark:shadow-none uppercase tracking-widest text-xs">
            {t('addNew')}
          </button>
        </div>

        <div>
          {loading ? (
            <div className="p-20 text-center text-columbia font-black animate-pulse tracking-widest uppercase">{t('loading')}</div>
          ) : errorMsg ? (
            <div className="p-20 text-center text-cherry font-bold italic border-t border-cherry/10 bg-cherry/5">
              ⚠️ {errorMsg}
            </div>
          ) : applications.length === 0 ? (
            <div className="p-20 text-center text-gray-300 dark:text-gray-500 font-medium italic">{t('emptyList')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-columbia/5 dark:bg-night/50 border-y border-columbia/10 dark:border-starlight/30">
                    <th className="px-8 py-6 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">{t('colCompany')}</th>
                    <th className="px-8 py-6 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">{t('colPosition')}</th>
                    <th className="px-8 py-6 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">{t('colLocMode')}</th>
                    <th className="px-8 py-6 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">{t('colSalary')}</th>
                    <th className="px-8 py-6 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">{t('colStage')}</th>
                    <th className="px-8 py-6 text-[10px] font-black text-cherry uppercase tracking-[0.2em] text-center">{t('colAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-columbia/10 dark:divide-starlight/30">
                  {applications.map((app) => {
                    const appId = app.id || app.job_application_id;
                    const compName = app.companyName || app.company_name || 'Bilinmeyen Kurum';
                    const pos = app.position || 'Bilinmeyen Pozisyon';
                    const loc = app.location || t('unspecified');
                    const mode = app.workMode || app.work_mode || '-';
                    const sal = app.salary && app.salary !== 'Bilinmiyor' ? app.salary : null;
                    const stat = app.status || 'APPLIED';

                    return (
                      <tr key={appId} className="hover:bg-columbia/5 dark:hover:bg-night/40 transition-all group">
                        <td className="px-8 py-6 font-bold text-gray-700 dark:text-gray-200">{compName}</td>
                        <td className="px-8 py-6 text-gray-500 dark:text-gray-400 font-medium">{pos}</td>
                        <td className="px-8 py-6">
                          <span className="block text-sm font-bold text-gray-600 dark:text-gray-300">{loc}</span>
                          <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{mode}</span>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-600 dark:text-gray-300">
                          {sal ? sal : <span className="text-gray-300 dark:text-gray-600 font-medium">-</span>}
                        </td>
                        <td className="px-8 py-6">
                          <select 
                            value={stat}
                            onChange={(e) => onStatusDropdownChange(app, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm dark:shadow-none outline-none cursor-pointer transition-all ${getStatusBadge(stat)}`}
                          >
                            <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200 font-medium" value="APPLIED">{t('statusApplied')}</option>
                            <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200 font-medium" value="ASSESSMENT">{t('statusAssessment')}</option>
                            <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200 font-medium" value="VIDEO_INTERVIEW">{t('statusVideo')}</option>
                            <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200 font-medium" value="INTERVIEW">{t('statusInterview')}</option>
                            <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200 font-medium" value="OFFER">{t('statusOffer')}</option>
                            <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200 font-medium" value="REJECTED">{t('statusRejected')}</option>
                          </select>
                        </td>
                        <td className="px-8 py-6 flex items-center justify-center gap-4">
                          <button 
                            onClick={() => setSelectedApp(app)} 
                            className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-cambridge bg-cambridge/10 dark:bg-cambridge/20 border border-cambridge/20 dark:border-cambridge/30 rounded-xl hover:bg-cambridge hover:text-white transition-all"
                          >
                            {t('btnView')}
                          </button>
                          <button onClick={() => handleDelete(appId)} className="text-gray-300 dark:text-gray-500 hover:text-cherry transition-all font-bold text-xl hover:scale-110 active:scale-95">×</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ApplicationFormModal show={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddSubmit} />
      <ApplicationDetailsModal app={selectedApp} onClose={() => setSelectedApp(null)} onUpdate={fetchApplications} />
      <StatusUpdateModal show={!!pendingUpdate} newStatus={pendingUpdate?.newStatus} onClose={() => setPendingUpdate(null)} onConfirm={handleFinalStatusUpdate} />
    </>
  );
}