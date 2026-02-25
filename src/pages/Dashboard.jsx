import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';
import ApplicationFormModal from '../components/ApplicationFormModal';
import Logo from '../components/Logo';
import StatusUpdateModal from '../components/StatusUpdateModal';
import api from '../services/api';

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Statü güncelleme akışı için yeni state'ler
  const [pendingUpdate, setPendingUpdate] = useState(null); // { app, newStatus }

  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('auth_token');
        navigate('/login');
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
      console.error("Hata:", error);
    }
  };

  // Dropdown değiştiğinde modalı açar
  const onStatusDropdownChange = (app, newStatus) => {
    if (app.status === newStatus) return;
    setPendingUpdate({ app, newStatus });
  };

  // Modaldan onay geldiğinde (notlu veya notsuz) çalışan fonksiyon
  const handleFinalStatusUpdate = async (noteText) => {
    const { app, newStatus } = pendingUpdate;
    let updatedNotes = app.notes;

    // Eğer not eklendiyse, JSON listesinin en başına ekle
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
      console.error("Güncelleme hatası:", error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Bu kaydı silmek istediğine emin misin?")) {
      try {
        await api.delete(`/applications/${id}`);
        fetchApplications(); 
      } catch (error) {
        console.error("Hata:", error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'APPLIED': 'bg-columbia/40 text-gray-700',
      'ASSESSMENT': 'bg-peach/60 text-gray-800',
      'VIDEO_INTERVIEW': 'bg-peach text-gray-800',
      'INTERVIEW': 'bg-columbia text-gray-800',
      'OFFER': 'bg-cambridge text-white',
      'REJECTED': 'bg-cherry text-white'
    };
    return styles[status] || 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="min-h-screen bg-alabaster font-sans selection:bg-cherry/20">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 py-5 flex justify-between items-center border-b border-columbia/10">
        <div className="flex items-center gap-4">
          <Logo className="w-10 h-10 shadow-sm rounded-2xl" />
          <h1 className="text-2xl font-black text-cherry tracking-tighter">Job Tracker</h1>
        </div>
        <button onClick={() => {localStorage.removeItem('auth_token'); navigate('/login');}} className="px-5 py-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-cherry transition-all">Çıkış</button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">Başvurularım</h2>
            <p className="text-gray-400 font-medium">Kariyer yolculuğundaki tüm adımların burada ✨</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-8 py-4 bg-cherry text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cherry/20">
            + Yeni Ekle
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden border border-columbia/10">
          {loading ? (
            <div className="p-20 text-center text-columbia font-black animate-pulse tracking-widest uppercase">Yükleniyor...</div>
          ) : applications.length === 0 ? (
            <div className="p-20 text-center text-gray-300 font-medium italic">Henüz bir kayıt yok. Kariyer serüvenine başla!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-alabaster/30 border-b border-columbia/5">
                    <th className="px-8 py-6 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">Kurum</th>
                    <th className="px-8 py-6 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">Pozisyon</th>
                    <th className="px-8 py-6 text-[10px] font-black text-cherry uppercase tracking-[0.2em]">Aşama</th>
                    <th className="px-8 py-6 text-[10px] font-black text-cherry uppercase tracking-[0.2em] text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-columbia/5">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-alabaster/20 transition-all group">
                      <td className="px-8 py-6 font-bold text-gray-700">{app.companyName}</td>
                      <td className="px-8 py-6 text-gray-500 font-medium">{app.position}</td>
                      <td className="px-8 py-6">
                        <select 
                          value={app.status}
                          onChange={(e) => onStatusDropdownChange(app, e.target.value)}
                          className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-sm outline-none cursor-pointer transition-all ${getStatusBadge(app.status)}`}
                        >
                          <option value="APPLIED">Başvuruldu</option>
                          <option value="ASSESSMENT">Teknik Sınav</option>
                          <option value="VIDEO_INTERVIEW">Video Mülakat</option>
                          <option value="INTERVIEW">Görüşme</option>
                          <option value="OFFER">Kabul</option>
                          <option value="REJECTED">Red</option>
                        </select>
                      </td>
                      <td className="px-8 py-6 flex items-center justify-center gap-4">
                        <button 
                          onClick={() => setSelectedApp(app)} 
                          className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-columbia bg-columbia/5 border border-columbia/20 rounded-xl hover:bg-columbia hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          Görüntüle
                        </button>
                        <button onClick={() => handleDelete(app.id)} className="text-gray-300 hover:text-cherry transition-all font-bold text-xl opacity-0 group-hover:opacity-100">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tüm Modallar */}
        <ApplicationFormModal show={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddSubmit} />
        <ApplicationDetailsModal app={selectedApp} onClose={() => setSelectedApp(null)} onUpdate={fetchApplications} />
        
        {/* Statü Güncelleme Modalı */}
        <StatusUpdateModal 
          show={!!pendingUpdate} 
          newStatus={pendingUpdate?.newStatus} 
          onClose={() => setPendingUpdate(null)} 
          onConfirm={handleFinalStatusUpdate} 
        />

      </main>
    </div>
  );
}