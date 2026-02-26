import { useEffect, useState } from 'react';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';
import ApplicationFormModal from '../components/ApplicationFormModal';
import StatusUpdateModal from '../components/StatusUpdateModal';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function Tracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null); 

  const { t } = useLanguage(); 

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (error) {
      console.error(error);
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
      console.error(error); 
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
      await api.put(`/applications/${app.id}`, { ...app, status: newStatus, notes: updatedNotes });
      setPendingUpdate(null);
      fetchApplications(); 
    } catch (error) {
      console.error(error); 
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm(t('confirmDelete'))) { 
      try {
        await api.delete(`/applications/${id}`);
        fetchApplications(); 
      } catch (error) {
        console.error(error); 
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'APPLIED': 'bg-columbia/40 dark:bg-columbia/20 text-gray-700 dark:text-columbia',
      'ASSESSMENT': 'bg-peach/60 dark:bg-peach/20 text-gray-800 dark:text-peach',
      'VIDEO_INTERVIEW': 'bg-peach dark:bg-peach/30 text-gray-800 dark:text-peach',
      'INTERVIEW': 'bg-columbia dark:bg-columbia/30 text-gray-800 dark:text-columbia',
      'OFFER': 'bg-cambridge dark:bg-cambridge/40 text-white',
      'REJECTED': 'bg-cherry dark:bg-cherry/40 text-white'
    };
    return styles[status] || 'bg-gray-100 dark:bg-starlight/50 text-gray-500 dark:text-gray-300';
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
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-columbia/5 dark:hover:bg-night/40 transition-all group">
                      <td className="px-8 py-6 font-bold text-gray-700 dark:text-gray-200">{app.companyName}</td>
                      <td className="px-8 py-6 text-gray-500 dark:text-gray-400 font-medium">{app.position}</td>
                      <td className="px-8 py-6">
                        <span className="block text-sm font-bold text-gray-600 dark:text-gray-300">{app.location || t('unspecified')}</span>
                        <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{app.workMode || '-'}</span>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-gray-600 dark:text-gray-300">
                        {app.salary && app.salary !== 'Bilinmiyor' ? app.salary : <span className="text-gray-300 dark:text-gray-600 font-medium">-</span>}
                      </td>
                      <td className="px-8 py-6">
                        <select 
                          value={app.status}
                          onChange={(e) => onStatusDropdownChange(app, e.target.value)}
                          className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-sm dark:shadow-none outline-none cursor-pointer transition-all ${getStatusBadge(app.status)}`}
                        >
                          <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200" value="APPLIED">{t('statusApplied')}</option>
                          <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200" value="ASSESSMENT">{t('statusAssessment')}</option>
                          <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200" value="VIDEO_INTERVIEW">{t('statusVideo')}</option>
                          <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200" value="INTERVIEW">{t('statusInterview')}</option>
                          <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200" value="OFFER">{t('statusOffer')}</option>
                          <option className="bg-white dark:bg-twilight text-gray-800 dark:text-gray-200" value="REJECTED">{t('statusRejected')}</option>
                        </select>
                      </td>
                      <td className="px-8 py-6 flex items-center justify-center gap-4">
                        <button 
                          onClick={() => setSelectedApp(app)} 
                          className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-cambridge bg-cambridge/10 dark:bg-cambridge/20 border border-cambridge/20 dark:border-cambridge/30 rounded-xl hover:bg-cambridge hover:text-white transition-all"
                        >
                          {t('btnView')}
                        </button>
                        <button onClick={() => handleDelete(app.id)} className="text-gray-300 dark:text-gray-500 hover:text-cherry transition-all font-bold text-xl">×</button>
                      </td>
                    </tr>
                  ))}
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