import { useState } from 'react';

export default function StatusUpdateModal({ show, onClose, onConfirm, newStatus }) {
  const [note, setNote] = useState('');

  if (!show) return null;

  const getStatusLabel = (status) => {
    const labels = {
      'APPLIED': 'Başvuruldu',
      'ASSESSMENT': 'Teknik Sınav',
      'VIDEO_INTERVIEW': 'Video Mülakat',
      'INTERVIEW': 'Görüşme',
      'OFFER': 'Kabul',
      'REJECTED': 'Red'
    };
    return labels[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-columbia/20 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-white/50">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 bg-columbia/10 text-columbia text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
            Aşama Güncelleniyor
          </span>
          <h3 className="text-2xl font-black text-gray-800 tracking-tight">
            Yeni statü: <span className="text-cherry">{getStatusLabel(newStatus)}</span>
          </h3>
          <p className="text-gray-400 font-medium mt-2">Bu değişiklikle ilgili bir not eklemek ister misin?</p>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Örn: Teknik sınav maili geldi, haftaya Salı günü için randevulaştık..."
          className="w-full p-5 bg-alabaster/50 border-2 border-transparent rounded-[1.5rem] focus:border-cherry/20 focus:bg-white outline-none transition-all text-sm text-gray-700 min-h-[150px] mb-6"
        />

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onConfirm(note)}
            className="w-full py-4 bg-cherry text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cherry/20 uppercase tracking-widest text-xs"
          >
            Güncelle ve Notu Ekle
          </button>
          <button
            onClick={() => onConfirm(null)}
            className="w-full py-4 bg-gray-50 text-gray-400 font-black rounded-2xl hover:text-gray-600 transition-all uppercase tracking-widest text-[10px]"
          >
            Notsuz Devam Et
          </button>
        </div>
      </div>
    </div>
  );
}