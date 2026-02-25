import React from 'react';

const TeacherSentMessages = ({ messages }) => {
  const displayMessages = messages || [
    { id: 1, recipient: 'M. Dupont', content: 'Votre enfant Lucas a été marqué présent ce matin.', date: 'Hier', time: '08:45' },
    { id: 2, recipient: 'Mme. Bernard', content: 'SchoolTracking : Cher parent, votre enfant Emma est absent ce jour.', date: 'Hier', time: '09:12' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages Envoyés</h1>
          <p className="text-slate-500 font-medium">Historique des communications parents</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
          <i className="fa-solid fa-message"></i>
          <span className="text-sm font-bold">{displayMessages.length} Messages</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayMessages.map((msg) => (
          <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-light border border-slate-100 hover:border-blue-200 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  {msg.recipient.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Destinataire</p>
                  <h4 className="font-bold text-slate-800">{msg.recipient}</h4>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.date}</p>
                <p className="text-xs font-bold text-slate-900">{msg.time}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
              <i className="fa-solid fa-quote-left text-slate-200 absolute top-2 left-2 text-xl"></i>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10 pl-4 italic">
                {msg.content}
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 border border-emerald-100">
                <i className="fa-solid fa-check-double"></i> Delivré via WhatsApp
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSentMessages;
