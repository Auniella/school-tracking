import React, { useState } from 'react';

const AdminJustifications = () => {
  const [justifications, setJustifications] = useState([
    { id: 1, student: 'Lucas Dupont', date: '25 Fév 2026', reason: 'Rendez-vous médical (certificat joint)', status: 'pending', phone: '06 12 34 56 78' },
    { id: 2, student: 'Emma Bernard', date: '22 Fév 2026', reason: 'Panne de réveil', status: 'pending', phone: '06 87 65 43 21' },
    { id: 3, student: 'Julie Martin', date: '20 Fév 2026', reason: 'Grosse grippe', status: 'accepted', phone: '06 11 22 33 44' },
  ]);

  const handleAction = (id, newStatus) => {
    const statusText = newStatus === 'accepted' ? 'acceptée' : 'refusée';
    if (!window.confirm(`Êtes-vous sûr de vouloir marquer cette justification comme ${statusText} ?`)) return;
    
    setJustifications(justifications.map(j => j.id === id ? { ...j, status: newStatus } : j));
    
    // In a real app, this would trigger a notification to the parent
    const j = justifications.find(item => item.id === id);
    alert(`Notification envoyée au parent de l'élève "${j.student}" : Votre justification pour le ${j.date} a été ${statusText}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Approbation des Justifications</h1>
          <p className="text-slate-500">Gérez les demandes de justifications d'absences envoyées par les parents.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-light border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-12"><i className="fa-solid fa-hashtag"></i></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Élève & Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Motif de l'absence</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {justifications.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-center">
                    <span className="text-slate-300 font-mono text-xs">#{j.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{j.student}</span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{j.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                      "{j.reason}"
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      j.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      j.status === 'refused' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {j.status === 'accepted' ? 'Approuvé' : j.status === 'refused' ? 'Refusé' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {j.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleAction(j.id, 'accepted')}
                          className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          title="Accepter"
                        >
                          <i className="fa-solid fa-check text-lg"></i>
                        </button>
                        <button 
                          onClick={() => handleAction(j.id, 'refused')}
                          className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          title="Refuser"
                        >
                          <i className="fa-solid fa-xmark text-lg"></i>
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAction(j.id, 'pending')}
                        className="text-[10px] font-bold text-slate-400 hover:text-blue-600 hover:underline underline-offset-4 uppercase tracking-wider"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminJustifications;
