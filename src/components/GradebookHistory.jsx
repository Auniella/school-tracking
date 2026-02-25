import React, { useState } from 'react';

const GradebookHistory = ({ grades: sharedGrades, students: sharedStudents }) => {
  const [selectedClass, setSelectedClass] = useState('CM2-A');
  const [selectedSubject, setSelectedSubject] = useState('Mathématiques');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);

  // Group grades by theme and date to form "Assessments"
  const assessments = sharedGrades
    .filter(g => g.subject === selectedSubject)
    .reduce((acc, g) => {
      const key = `${g.theme}-${g.date}`;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          theme: g.theme,
          date: g.date,
          subject: g.subject,
          count: 0,
          total: 0,
          studentGrades: []
        };
      }
      acc[key].count += 1;
      acc[key].total += g.value;
      acc[key].studentGrades.push({
        name: sharedStudents.find(s => s.id === g.studentId)?.name || 'Élève inconnu',
        value: g.value
      });
      return acc;
    }, {});

  const historyList = Object.values(assessments).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (selectedAssessmentId) {
    const assessment = assessments[selectedAssessmentId];
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedAssessmentId(null)}
          className="text-sm font-bold text-blue-600 flex items-center gap-2 hover:underline active:scale-95 transition-all"
        >
          <i className="fa-solid fa-arrow-left"></i> Retour à l'historique
        </button>

        <div className="bg-white p-8 rounded-3xl shadow-light border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{assessment.date} • {assessment.subject}</p>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{assessment.theme}</h1>
              <p className="text-slate-500 text-sm mt-1">{assessment.count} élèves évalués</p>
            </div>
            <div className="bg-slate-900 text-white p-6 rounded-2xl text-center shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Moyenne Classe</p>
              <p className="text-3xl font-black">{(assessment.total / assessment.count).toFixed(1)}<span className="text-sm text-slate-500 ml-1">/20</span></p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Élève</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assessment.studentGrades.map((s, idx) => (
                  <tr key={idx} className="hover:bg-white transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[10px] font-black text-slate-600 uppercase">
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-bold text-slate-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-black ${s.value >= 10 ? 'text-blue-600' : 'text-rose-600'}`}>
                        {s.value.toFixed(1)}<span className="text-[10px] text-slate-400 font-bold ml-0.5">/20</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Historique des Notes</h1>
          <p className="text-slate-500 font-medium">Archive complète des évaluations</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-light border border-slate-100 flex gap-4">
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none font-bold text-sm text-slate-700">
          <option>CM2-A</option>
          <option>CM2-B</option>
        </select>
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none font-bold text-sm text-slate-700">
          <option value="Mathématiques">Mathématiques</option>
          <option value="Français">Français</option>
          <option value="Sciences">Sciences</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {historyList.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedAssessmentId(item.id)}
            className="bg-white p-6 rounded-2xl shadow-light border border-slate-100 flex items-center justify-between hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">
                  {item.date.split(' ')[1]}
                </span>
                <span className="text-lg font-black leading-none">{item.date.split(' ')[0]}</span>
              </div>
              <div>
                <h4 className="font-black text-slate-800 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{item.theme}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.count} copies corrigées</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Moyenne</p>
                <div className="flex items-baseline gap-0.5 justify-end">
                  <span className="text-xl font-black text-slate-800">{(item.total / item.count).toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400 font-bold">/20</span>
                </div>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
            </div>
          </div>
        ))}
        {historyList.length === 0 && (
          <div className="py-20 text-center text-slate-400 italic">
            Aucun historique d'évaluation pour cette matière.
          </div>
        )}
      </div>
    </div>
  );
};

export default GradebookHistory;
