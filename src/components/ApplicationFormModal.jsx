import { useState } from 'react';

export default function ApplicationFormModal({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    applicationType: 'JOB',
    workMode: 'REMOTE',
    location: '',
    platform: 'LinkedIn',
    otherPlatformUrl: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'APPLIED',
    salary: 'Bilinmiyor',
    description: '',
    applicationQuestions: '',
    notes: '[]'
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPlatform = formData.platform === 'Diğer' ? formData.otherPlatformUrl : formData.platform;
    onSubmit({ ...formData, platform: finalPlatform });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-columbia/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-500 ease-out">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/50">
        
        {/* SABİT BAŞLIK VE ÇARPI BUTONU KISMI */}
        <div className="flex justify-between items-center mb-6 shrink-0 border-b border-columbia/10 pb-6">
          <h3 className="text-2xl font-black text-cherry tracking-tight uppercase">Yeni Başvuru Kaydı</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-alabaster rounded-full text-gray-400 hover:text-cherry transition-all text-2xl font-bold">×</button>
        </div>
        
        {/* KAYDIRILABİLİR FORM İÇERİĞİ */}
        <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
            <div>
              <label className="block mb-1.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Kurum / Şirket Adı</label>
              <input type="text" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 border-2 border-transparent rounded-2xl focus:border-columbia/30 focus:bg-white outline-none transition-all text-gray-700 font-bold" />
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Pozisyon / Program Adı</label>
              <input type="text" required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 border-2 border-transparent rounded-2xl focus:border-columbia/30 focus:bg-white outline-none transition-all text-gray-700 font-bold" />
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Kategori</label>
              <select 
                value={formData.applicationType} 
                onChange={e => {
                  const newType = e.target.value;
                  let newSalary = formData.salary;
                  if (newType !== 'INTERNSHIP' && newSalary === 'Gönüllü') newSalary = 'Bilinmiyor';
                  setFormData({...formData, applicationType: newType, salary: newSalary});
                }}
                className="w-full px-5 py-4 bg-alabaster/50 border-2 border-transparent rounded-2xl focus:border-columbia/30 focus:bg-white outline-none transition-all text-gray-700 font-bold"
              >
                <option value="JOB">İş Başvurusu</option>
                <option value="INTERNSHIP">Staj</option>
                <option value="BOOTCAMP">Bootcamp</option>
                <option value="WEBINAR">Webinar</option>
                <option value="OTHER">Diğer</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Platform</label>
              <div className="space-y-3">
                <select 
                  value={['LinkedIn', 'Kariyer.net', 'Indeed', 'Şirket Sitesi'].includes(formData.platform) ? formData.platform : 'Diğer'} 
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                  className="w-full px-5 py-4 bg-alabaster/50 border-2 border-transparent rounded-2xl focus:border-columbia/30 focus:bg-white outline-none transition-all text-gray-700 font-bold"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Kariyer.net">Kariyer.net</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Şirket Sitesi">Şirket Sitesi</option>
                  <option value="Diğer">Diğer (URL/Ad Belirt)</option>
                </select>
                {(formData.platform === 'Diğer' || !['LinkedIn', 'Kariyer.net', 'Indeed', 'Şirket Sitesi'].includes(formData.platform)) && (
                  <input 
                    type="text" required placeholder="Site adı veya URL..." 
                    value={formData.otherPlatformUrl} onChange={e => setFormData({...formData, otherPlatformUrl: e.target.value})}
                    className="w-full px-5 py-3 bg-cherry/5 border border-cherry/20 rounded-xl focus:border-cherry/40 outline-none text-sm" 
                  />
                )}
              </div>
            </div>

            {(formData.applicationType === 'JOB' || formData.applicationType === 'INTERNSHIP') && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-peach/5 p-6 rounded-[2rem] border border-peach/10 animate-fade-in">
                <div>
                  <label className="block mb-1.5 text-[10px] font-black text-peach tracking-[0.2em] uppercase px-1">Maaş / Ücret Durumu</label>
                  <select 
                    value={['Bilinmiyor', 'Gönüllü'].includes(formData.salary) ? formData.salary : 'SPECIFIC'}
                    onChange={e => setFormData({...formData, salary: e.target.value === 'SPECIFIC' ? '' : e.target.value})}
                    className="w-full px-5 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-peach/30 outline-none transition-all text-gray-700 font-bold"
                  >
                    <option value="Bilinmiyor">Bilinmiyor</option>
                    {formData.applicationType === 'INTERNSHIP' && <option value="Gönüllü">Gönüllü (Ücretsiz)</option>}
                    <option value="SPECIFIC">Tutar Belirt...</option>
                  </select>
                </div>
                {!['Bilinmiyor', 'Gönüllü'].includes(formData.salary) && (
                  <div className="animate-fade-in">
                    <label className="block mb-1.5 text-[10px] font-black text-peach tracking-[0.2em] uppercase px-1">Miktar</label>
                    <input 
                      type="text" placeholder="Örn: 45.000 TL" 
                      value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})}
                      className="w-full px-5 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-peach/30 outline-none transition-all text-gray-700 font-bold" 
                    />
                  </div>
                )}
              </div>
            )}

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block mb-1.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Çalışma Modeli</label>
                <select value={formData.workMode} onChange={e => setFormData({...formData, workMode: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 border-2 border-transparent rounded-2xl focus:border-columbia/30 focus:bg-white outline-none transition-all text-gray-700 font-bold">
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">Ofis</option>
                </select>
              </div>
              <div>
                <label className="block mb-1.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Lokasyon</label>
                <input type="text" placeholder="Şehir/Ülke" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 border-2 border-transparent rounded-2xl focus:border-columbia/30 outline-none transition-all text-gray-700 font-bold" />
              </div>
              <div>
                <label className="block mb-1.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Tarih</label>
                <input type="date" value={formData.applicationDate} onChange={e => setFormData({...formData, applicationDate: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 border-2 border-transparent rounded-2xl focus:border-columbia/30 outline-none transition-all text-gray-700 font-bold" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1.5 text-[10px] font-black text-cherry/60 uppercase tracking-[0.2em] px-1">Başvuru Formu Soruları & Cevaplarım</label>
              <textarea rows="3" value={formData.applicationQuestions} onChange={e => setFormData({...formData, applicationQuestions: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 border-2 border-transparent rounded-3xl focus:border-cherry/30 focus:bg-white outline-none transition-all text-gray-700 text-sm" placeholder="Deneyim yılı, teknik sorular vb. formda ne cevap verdiğini buraya not et..." />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">İlan Detayları</label>
              <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 bg-alabaster/50 border-2 border-transparent rounded-3xl focus:border-columbia/30 focus:bg-white outline-none transition-all text-gray-700 text-sm" placeholder="İş tanımını buraya yapıştırabilirsin..." />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button type="button" onClick={onClose} className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-all">İptal</button>
              <button type="submit" className="px-12 py-4 bg-cherry text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cherry/20 uppercase tracking-widest text-xs">Kaydet</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}