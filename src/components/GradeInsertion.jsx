import React, { useState } from 'react';

const GradeInsertion = ({ students: sharedStudents, onSaveGrades, initialClass = 'CM2-A' }) => {
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedSubject, setSelectedSubject] = useState('Mathématiques');
  const [theme, setTheme] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filter students by class and initialize their grades to empty
  const [gradeData, setGradeData] = useState(
    sharedStudents.reduce((acc, s) => ({ ...acc, [s.id]: '' }), {})
  );

  const subjects = ['Mathématiques', 'Français', 'Histoire-Géo', 'Sciences', 'Anglais'];
  const classes = ['CM2-A', 'CM2-B', 'CM1-A', 'CM1-B'];

  const filteredStudents = sharedStudents.filter(s => s.class === selectedClass);

  const handleGradeChange = (id, value) => {
    // Basic validation for 0-20
    if (value !== '' && (isNaN(value) || value < 0 || value > 20)) return;
    setGradeData({ ...gradeData, [id]: value });
  };

  const handleSaveGrades = () => {
    const gradesToSave = filteredStudents
      .filter(s => gradeData[s.id] !== '')
      .map(s => ({
        id: Date.now() + s.id,
        studentId: s.id,
        subject: selectedSubject,
        value: parseFloat(gradeData[s.id]),
        theme: theme || 'Évaluation',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        teacher: 'M. Petit' // Hardcoded for this demo
      }));

    if (gradesToSave.length === 0) {
      alert("Veuillez saisir au moins une note.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      onSaveGrades(gradesToSave);
      setIsSaving(false);
      alert(`Notes enregistrées pour la classe ${selectedClass} en ${selectedSubject}.`);
      setTheme('');
      // Reset after save
      setGradeData(sharedStudents.reduce((acc, s) => ({ ...acc, [s.id]: '' }), {}));
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insertion des Notes</h1>
          <p className="text-slate-500">Saisie par matière et par classe</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-light border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Classe</label>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Matière</label>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Thème du devoir (Ex: Fractions, Dictée...)</label>
          <input 
            type="text"
            placeholder="Entrez le thème..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-light border border-slate-100 overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Élève</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Note / 20</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-slate-700">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <input 
                    type="number"
                    max="20"
                    min="0"
                    placeholder="--"
                    value={gradeData[student.id] || ''}
                    onChange={(e) => handleGradeChange(student.id, e.target.value)}
                    className="w-20 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-right font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all">
          Annuler
        </button>
        <button 
          onClick={handleSaveGrades}
          disabled={isSaving}
          className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les notes'}
        </button>
      </div>
    </div>
  );
};

export default GradeInsertion;
