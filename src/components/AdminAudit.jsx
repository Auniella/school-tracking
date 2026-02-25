import React, { useState } from 'react';

const AdminAudit = ({ students: sharedStudents, absences: sharedAbsences }) => {
  // Use shared state to build current records, merging with some mock history
  const [records, setRecords] = useState(() => {
    return sharedStudents.map(s => ({
      id: s.id,
      student: s.name,
      class: s.class,
      status: s.status || 'present',
      date: '25 Fév 2026',
      modifiedBy: s.status === 'absent' ? 'M. Petit (Prof)' : 'Admin (System)',
      lastEditTime: s.status === 'absent' ? '08:45' : '09:00',
      justificationStatus: s.id === 1 ? 'pending' : 'none', // Hardcoded Lucas pending for demo
      justificationText: s.id === 1 ? 'Rendez-vous dentiste' : ''
    }));
  });

  const [filter, setFilter] = useState('all'); // 'all', 'absent', 'pending'

  const updateJustification = (id, status) => {
    setRecords(records.map(r => {
      if (r.id === id) {
        return { 
          ...r, 
          justificationStatus: status, 
          modifiedBy: `Admin (${status === 'accepted' ? 'Acceptation' : 'Refus'})`,
          lastEditTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
      }
      return r;
    }));
    alert(`La justification a été ${status === 'accepted' ? 'acceptée' : 'refusée'}. Une alerte a été envoyée au parent.`);
  };

  const toggleStatus = (id) => {
    setRecords(records.map(r => {
      if (r.id === id) {
        const newStatus = r.status === 'present' ? 'absent' : 'present';
        return { ...r, status: newStatus, modifiedBy: 'Admin (Override)', lastEditTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      }
      return r;
    }));
  };

  const filteredRecords = records.filter(r => {
    if (filter === 'absent') return r.status === 'absent';
    if (filter === 'pending') return r.justificationStatus === 'pending';
    return true;
  });

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase tabular-nums">Suivi Global & Audit</h1>
          <p className="text-slate-500 font-medium">Contrôle interne et validation des présences</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem] shadow-inner border border-slate-200 w-fit">
          {['all', 'absent', 'pending'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {f === 'all' ? 'Tous' : f === 'absent' ? 'Absents' : 'Justifs en attente'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-light border border-slate-200 overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Élève</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Audit Modif</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Justification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm">
                  <p className="font-bold text-slate-800">{r.student}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{r.class} • {r.date}</p>
                </td>
                 <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleStatus(r.id)} 
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      r.status === 'present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}
                  >
                    {r.status === 'present' ? 'Présent' : 'Absent'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-semibold text-slate-700">{r.modifiedBy}</p>
                  <p className="text-[10px] text-slate-400">Dernière modif : {r.lastEditTime}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  {r.justificationStatus === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => updateJustification(r.id, 'accepted')} className="px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-600 text-[10px] font-bold hover:bg-emerald-50">ACCEPTER</button>
                      <button onClick={() => updateJustification(r.id, 'refused')} className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-[10px] font-bold hover:bg-rose-50">REFUSER</button>
                    </div>
                  )}
                  {r.justificationStatus === 'accepted' && (
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1 w-fit ml-auto">
                      Acceptée <i className="fa-solid fa-circle-check"></i>
                    </span>
                  )}
                  {r.justificationStatus === 'refused' && (
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-md border border-rose-100 flex items-center gap-1 w-fit ml-auto">
                      Refusée <i className="fa-solid fa-circle-xmark"></i>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAudit;
