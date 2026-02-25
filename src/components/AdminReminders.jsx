import React, { useState } from 'react';

const AdminReminders = ({ absentees, onSendMessage, template, setTemplate, history }) => {
  const [activeTab, setActiveTab] = useState('toSend'); // 'toSend', 'history'
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [tempTemplate, setTempTemplate] = useState(template);

  const handleSaveTemplate = () => {
    setTemplate(tempTemplate);
    setIsEditingTemplate(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rappels d'Absence</h1>
          <p className="text-slate-500 font-medium">Envoyez des notifications aux parents des élèves absents</p>
        </div>
        <button 
          onClick={() => setIsEditingTemplate(!isEditingTemplate)}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-gear text-blue-600"></i> {isEditingTemplate ? 'Fermer les réglages' : 'Modifier le modèle'}
        </button>
      </div>

      <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('toSend')}
          className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'toSend' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          À envoyer ({absentees.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Historique ({history?.length || 0})
        </button>
      </div>

      {isEditingTemplate && (
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl animate-in slide-in-from-top duration-300">
          <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Modèle de message WhatsApp/SMS</label>
          <p className="text-xs text-blue-500 mb-4 font-medium italic">Utilisez [NOM] pour insérer automatiquement le nom de l'élève.</p>
          <textarea 
            className="w-full bg-white border border-blue-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700 mb-4"
            rows="4"
            value={tempTemplate}
            onChange={(e) => setTempTemplate(e.target.value)}
          />
          <div className="flex justify-end">
            <button 
              onClick={handleSaveTemplate}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              Enregistrer le modèle
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {activeTab === 'toSend' ? (
          <div className="bg-white rounded-2xl shadow-light border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Élève</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classe</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {absentees.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 uppercase">
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-bold text-slate-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-tighter border border-blue-100">{s.class}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{s.parent}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onSendMessage(s)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 active:scale-95 transition-all flex items-center gap-2 ml-auto"
                      >
                        <i className="fa-brands fa-whatsapp text-sm"></i> Relancer
                      </button>
                    </td>
                  </tr>
                ))}
                {absentees.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                      Aucune absence signalée pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            {history && history.length > 0 ? history.map((msg) => (
              <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-light border border-slate-100 hover:border-blue-200 transition-all group animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-lg shadow-slate-200">
                      {msg.recipient.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Destinataire</p>
                      <h4 className="font-bold text-slate-800 text-sm">{msg.recipient}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{msg.date}</p>
                    <p className="text-xs font-bold text-slate-900">{msg.time}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                  <i className="fa-solid fa-quote-left text-slate-200 absolute top-2 left-2 text-lg"></i>
                  <p className="text-xs text-slate-600 leading-relaxed relative z-10 pl-4 italic font-medium">
                    {msg.content}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 border border-emerald-100 shadow-sm">
                    <i className="fa-solid fa-check-double"></i> WhatsApp
                  </span>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-2xl shadow-light border border-slate-100 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-dashed border-slate-200">
                  <i className="fa-solid fa-message"></i>
                </div>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucun message envoyé</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReminders;
