import React, { useState } from 'react';
import AttendanceCalendar from './AttendanceCalendar';

const TeacherAttendance = ({ students, setStudents, updateStudentStatus }) => {
  const [selectedClass, setSelectedClass] = useState('CM2-A');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pendingAbsence, setPendingAbsence] = useState(null); // { id, name }

  const classes = ['CM2-A', 'CM2-B', 'CM1-A', 'CM1-B'];

  const filteredStudents = students.filter(s => 
    s.class === selectedClass && 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (student) => {
    if (student.status === 'present') {
      setPendingAbsence(student); // Prompt before marking absent
    } else {
      updateStudentStatus(student.id, 'present');
    }
  };

  const handleUpdateStatus = (id, status, notifyParent = false) => {
    updateStudentStatus(id, status);
    if (notifyParent) {
      const student = students.find(s => s.id === id);
      alert(`Message WhatsApp envoyé : "SchoolTracking : Cher parent, votre enfant ${student.name} est absent ce jour. Merci de régulariser cette situation via votre espace parent."`);
    }
    setPendingAbsence(null);
  };

  const absentCount = filteredStudents.filter(s => s.status === 'absent').length;


  return (
    <div className="space-y-8 animate-slide-up">
      {/* Configuration & Search */}
      <div className="glass p-6 rounded-[2rem] shadow-light flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classe</label>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 font-bold text-slate-800 focus:ring-4 focus:ring-blue-50 outline-none transition-all cursor-pointer"
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-[2] space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recherche</label>
          <input 
            type="text"
            placeholder="Nom de l'élève..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 font-bold text-slate-800 placeholder:text-slate-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Appel : {selectedClass}</h1>
          <p className="text-slate-500 font-medium capitalize">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
          <div className="flex items-center gap-3 bg-rose-50 px-6 py-2.5 rounded-2xl border border-rose-100 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">{absentCount} {absentCount > 1 ? 'Absents' : 'Absent'}</span>
          </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-light border border-slate-200 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Éléve</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</span>
        </div>
        <div className="divide-y divide-slate-100 text-slate-600">
          {filteredStudents.map((student) => (
            <div 
              key={student.id} 
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-xs">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{student.name}</span>
                  <p className="text-[10px] text-slate-400 capitalize">Cliquez pour les détails</p>
                </div>
              </div>
              
              <button
                onClick={() => toggleStatus(student)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all active:scale-95 ${
                  student.status === 'present'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  student.status === 'present' ? 'bg-emerald-500' : 'bg-rose-500'
                }`} />
                <span className="text-[10px] font-black uppercase tracking-wide">
                  {student.status === 'present' ? 'Présent' : 'Absent'}
                </span>
              </button>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <div className="p-10 text-center text-slate-400">
              Aucun élève trouvé pour cette classe ou recherche.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Absence Modal */}
      {pendingAbsence && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Marquer {pendingAbsence.name} absent ?</h3>
            <p className="text-slate-500 text-sm mb-6">Souhaitez-vous envoyer une notification immédiate au parent ?</p>
            <div className="space-y-3">
              <button 
                onClick={() => handleUpdateStatus(pendingAbsence.id, 'absent', true)}
                className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold active:scale-95 transition-all"
              >
                Oui, notifier le parent
              </button>
              <button 
                onClick={() => handleUpdateStatus(pendingAbsence.id, 'absent', false)}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold active:scale-95 transition-all"
              >
                Marquer absent sans SMS
              </button>
              <button 
                onClick={() => setPendingAbsence(null)}
                className="w-full text-slate-400 py-2 text-sm font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedStudent.name}</h3>
                  <p className="text-sm opacity-80">{selectedStudent.class}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-white/80 hover:text-white font-bold p-2 transition-all">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Assiduité</p>
                  <p className="text-2xl font-bold text-slate-800">{selectedStudent.attendance}%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Moyenne</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedStudent.grades ? (selectedStudent.grades.reduce((a, b) => a + b, 0) / selectedStudent.grades.length).toFixed(1) : '15.5'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Notes récentes
                </h4>
                <div className="space-y-2">
                  {(selectedStudent.grades || [12, 14, 16]).map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                      <span className="text-sm text-slate-600">Évaluation {i + 1}</span>
                      <span className="font-bold text-slate-800">{g}/20</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Pointage Calendaire
                </h4>
                <AttendanceCalendar studentName={selectedStudent.name} />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold active:scale-95 transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherAttendance;
