import React, { useState } from 'react';

const AdminManagement = ({ students, setStudents }) => {
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'teachers', 'classes'
  const [selectedClass, setSelectedClass] = useState(null); // When viewing a specific class
  const [selectedStudent, setSelectedStudent] = useState(null); // When viewing student details
  const [classDetailTab, setClassDetailTab] = useState('students');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Local Teachers & Classes (could be lifted too but focus is on students/messaging sync)
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'M. Petit', subjects: ['Mathématiques', 'Sciences'], classes: ['CM2-A', 'CM2-B'], gender: 'M' },
    { id: 2, name: 'Mme. Durand', subjects: ['Français'], classes: ['CM1-B', 'CM2-B'], gender: 'F' },
  ]);

  const [classes, setClasses] = useState([
    { id: 'CM2-A', principalTeacherId: 1 },
    { id: 'CM2-B', principalTeacherId: 2 },
    { id: 'CM1-B', principalTeacherId: null },
  ]);

  const ALLOWED_SUBJECTS = ['Mathématiques', 'Français', 'Sciences', 'Histoire-Géo', 'Anglais', 'EPS', 'Arts Plastiques'];
  const [subjectError, setSubjectError] = useState('');

  const [formData, setFormData] = useState({ 
    name: '', 
    extra: '', 
    classes: ['CM2-A'], 
    gender: 'M', 
    principalId: '',
    birthDate: '',
    age: '',
    address: '',
    phone: ''
  });

  const handleDelete = (type, id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    if (type === 'students') setStudents(students.filter(s => s.id !== id));
    if (type === 'teachers') setTeachers(teachers.filter(t => t.id !== id));
    if (type === 'classes') setClasses(classes.filter(c => c.id !== id));
  };

  const handleEdit = (type, item) => {
    setEditingItem({ type, ...item });
    if (type === 'students') {
      setFormData({ 
        name: item.name, 
        extra: item.parent, 
        classes: [item.class], 
        gender: item.gender,
        birthDate: item.birthDate || '',
        age: item.age || '',
        address: item.address || '',
        phone: item.phone || ''
      });
    }
    else if (type === 'teachers') setFormData({ ...formData, name: item.name, extra: item.subjects.join(', '), classes: item.classes, gender: item.gender });
    else if (type === 'classes') setFormData({ name: item.id, principalId: item.principalTeacherId || '' });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSubjectError('');

    let processedSubjects = [];
    if (activeTab === 'teachers' || editingItem?.type === 'teachers') {
      const inputSubjects = formData.extra.split(',').map(s => s.trim());
      const invalid = inputSubjects.filter(s => !ALLOWED_SUBJECTS.includes(s));
      if (invalid.length > 0) {
        setSubjectError(`Matière(s) non reconnue(s) : ${invalid.join(', ')}. Liste autorisée : ${ALLOWED_SUBJECTS.join(', ')}`);
        return;
      }
      processedSubjects = inputSubjects;
    }

    if (editingItem) {
      if (editingItem.type === 'students') {
        setStudents(students.map(s => s.id === editingItem.id ? { 
          ...s, 
          name: formData.name, 
          parent: formData.extra, 
          class: formData.classes[0], 
          gender: formData.gender,
          birthDate: formData.birthDate,
          age: parseInt(formData.age) || 0,
          address: formData.address,
          phone: formData.phone
        } : s));
      } else if (editingItem.type === 'teachers') {
        setTeachers(teachers.map(t => t.id === editingItem.id ? { ...t, name: formData.name, subjects: processedSubjects, classes: formData.classes, gender: formData.gender } : t));
      } else if (editingItem.type === 'classes') {
        setClasses(classes.map(c => c.id === editingItem.id ? { ...c, principalTeacherId: parseInt(formData.principalId) || null } : c));
      }
    } else {
      if (activeTab === 'students') {
        setStudents([...students, { 
          id: Date.now(), 
          name: formData.name, 
          class: formData.classes[0], 
          parent: formData.extra, 
          gender: formData.gender, 
          birthDate: formData.birthDate, 
          address: formData.address, 
          age: parseInt(formData.age) || 0, 
          phone: formData.phone 
        }]);
      } else if (activeTab === 'teachers') {
        setTeachers([...teachers, { id: Date.now(), name: formData.name, subjects: processedSubjects, classes: formData.classes, gender: formData.gender }]);
      } else if (activeTab === 'classes') {
        setClasses([...classes, { id: formData.name, principalTeacherId: parseInt(formData.principalId) || null }]);
      }
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ 
      name: '', 
      extra: '', 
      classes: ['CM2-A'], 
      gender: 'M', 
      principalId: '',
      birthDate: '',
      age: '',
      address: '',
      phone: ''
    });
  };

  const filteredStudents = students.filter(s => 
    (nameFilter === '' || s.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
    (genderFilter === 'all' || s.gender === genderFilter) &&
    (classFilter === 'all' || s.class === classFilter)
  );

  const filteredTeachers = teachers.filter(t => 
    (nameFilter === '' || t.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
    (genderFilter === 'all' || t.gender === genderFilter) &&
    (classFilter === 'all' || t.classes.includes(classFilter)) &&
    (subjectFilter === 'all' || t.subjects.includes(subjectFilter))
  );

  // Class Detail Logic
  const currentClassObj = classes.find(c => c.id === selectedClass);
  const classStudents = students.filter(s => s.class === selectedClass);
  const classTeachers = teachers.filter(t => t.classes.includes(selectedClass)).sort((a, b) => {
    if (a.id === currentClassObj?.principalTeacherId) return -1;
    if (b.id === currentClassObj?.principalTeacherId) return 1;
    return 0;
  });

  if (selectedStudent) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={() => setSelectedStudent(null)} className="text-sm font-bold text-blue-600 flex items-center gap-2 hover:underline active-scale">
          <i className="fa-solid fa-arrow-left"></i> Retour à la liste des élèves
        </button>
        <div className="bg-white rounded-[2rem] shadow-premium border border-slate-200 overflow-hidden max-w-2xl mx-auto">
          <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className={`relative z-10 w-24 h-24 rounded-3xl ${selectedStudent.gender === 'M' ? 'bg-blue-600' : 'bg-rose-500'} flex items-center justify-center text-4xl font-black mb-6 border-4 border-white/10 shadow-xl`}>
              {selectedStudent.name.charAt(0)}
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl font-black tracking-tighter uppercase">{selectedStudent.name}</h1>
              <p className="text-white/50 font-black uppercase tracking-[0.2em] text-[10px] mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> 
                Inscrit en {selectedStudent.class}
              </p>
            </div>
          </div>
          <div className="p-8 grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Âge</label>
              <p className="font-bold text-slate-800">{selectedStudent.age} ans</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date de Naissance</label>
              <p className="font-bold text-slate-800">{selectedStudent.birthDate}</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Parent (Tuteur)</label>
              <p className="font-bold text-slate-800">{selectedStudent.parent}</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</label>
              <p className="font-bold text-slate-800">{selectedStudent.phone}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Adresse</label>
              <p className="font-bold text-slate-800">{selectedStudent.address}</p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
             <button onClick={() => { handleEdit('students', selectedStudent); setSelectedStudent(null); }} className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100 transition-all">
                Modifier l'élève
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedClass) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedClass(null)} className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline">
          ← Retour à la liste des classes
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Classe : {selectedClass}</h1>
            <p className="text-slate-500 font-medium">Gestion détaillée de la classe</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            {['students', 'teachers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setClassDetailTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  classDetailTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'students' ? 'Élèves' : 'Professeurs'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-light border border-slate-100 overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Rôle / Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classDetailTab === 'students' ? classStudents.map(s => (
                <tr key={s.id} className="cursor-pointer hover:bg-slate-50 transition-all" onClick={() => setSelectedStudent(s)}>
                  <td className="px-6 py-4 font-semibold text-slate-800">{s.name}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">Parent : {s.parent}</td>
                  <td className="px-6 py-4 text-right"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold">ÉLÈVE</span></td>
                </tr>
              )) : classTeachers.map(t => (
                <tr key={t.id} className={t.id === currentClassObj?.principalTeacherId ? 'bg-amber-50/30' : ''}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="font-semibold text-slate-800">{t.name}</span>
                       {t.id === currentClassObj?.principalTeacherId && <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-bold border border-amber-200 uppercase tracking-wider">Principal</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs font-medium">{t.subjects.join(', ')}</td>
                  <td className="px-6 py-4 text-right"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold">PROFESSEUR</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Gestion Académique</h1>
          <p className="text-slate-500 font-medium">Administration globale de l'établissement</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-slate-200 active-scale flex items-center gap-3"
        >
          <i className="fa-solid fa-plus text-blue-400"></i> Ajouter {activeTab === 'students' ? 'un Élève' : activeTab === 'teachers' ? 'un Professeur' : 'une Classe'}
        </button>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem] shadow-inner border border-slate-200 w-fit">
        {['students', 'teachers', 'classes'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setNameFilter(''); setGenderFilter('all'); setClassFilter('all'); }}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'students' ? 'Élèves' : tab === 'teachers' ? 'Profs' : 'Classes'}
          </button>
        ))}
      </div>

      {activeTab !== 'classes' && (
        <div className="glass p-6 rounded-3xl shadow-light grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Recherche</label>
            <input 
              type="text" 
              placeholder="Nom..." 
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 outline-none font-bold text-slate-800 placeholder:text-slate-300 transition-all focus:ring-4 focus:ring-blue-50"
              value={nameFilter}
              onChange={e => setNameFilter(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Genre</label>
            <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 outline-none font-black text-[10px] text-slate-700 uppercase tracking-widest cursor-pointer hover:border-slate-300">
              <option value="all">Tous</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Classe</label>
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 outline-none font-black text-[10px] text-slate-700 uppercase tracking-widest cursor-pointer hover:border-slate-300">
              <option value="all">Toutes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
          </div>
          {activeTab === 'teachers' && (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Matière</label>
              <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 outline-none font-black text-[10px] text-slate-700 uppercase tracking-widest cursor-pointer hover:border-slate-300">
                <option value="all">Toutes</option>
                {ALLOWED_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-light border border-slate-100 overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest w-1/3">Nom</th>
              {activeTab !== 'students' && (
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">{activeTab === 'classes' ? 'Prof Principal' : 'Matières'}</th>
              )}
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">{activeTab === 'students' ? 'Classe' : 'Classes'}</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeTab === 'students' ? filteredStudents.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 cursor-pointer group" onClick={() => setSelectedStudent(s)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.gender === 'M' ? 'bg-blue-400' : 'bg-pink-400'} shadow-sm`}></span>
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{s.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">{s.class}</span>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end items-center gap-1">
                    <button onClick={() => handleEdit('students', s)} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => handleDelete('students', s.id)} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            )) : activeTab === 'teachers' ? filteredTeachers.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${t.gender === 'M' ? 'bg-blue-400' : 'bg-pink-400'} shadow-sm`}></span>
                    <span className="font-bold text-slate-800 uppercase tracking-tight">{t.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-[11px] font-bold leading-tight">
                  {t.subjects.join(', ')}
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-wrap gap-1">
                      {t.classes.map(c => (
                        <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tighter border border-slate-200">{c}</span>
                      ))}
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-1">
                    <button onClick={() => handleEdit('teachers', t)} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => handleDelete('teachers', t.id)} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            )) : classes.map(c => {
              const pp = teachers.find(t => t.id === c.principalTeacherId);
              return (
                <tr key={c.id} className="hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => setSelectedClass(c.id)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-center font-black text-sm">{c.id.charAt(0)}</div>
                      <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{c.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-500 italic">
                    {pp ? pp.name : 'Aucun'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[9px] font-black group-hover:bg-blue-600 group-hover:text-white transition-all uppercase tracking-widest shadow-sm">Détails <i className="fa-solid fa-arrow-right ml-1"></i></span>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end items-center gap-1">
                      <button onClick={() => handleEdit('classes', c)} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => handleDelete('classes', c.id)} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {editingItem ? 'Modifier' : 'Nouvel'} {editingItem?.type === 'students' || (!editingItem && activeTab === 'students') ? 'élève' : (editingItem?.type || (activeTab === 'teachers' ? 'Professeur' : 'Classe'))}
              </h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              { (editingItem?.type === 'classes' || (activeTab === 'classes' && !editingItem)) ? (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nom de la Classe (ID)</label>
                    <input required disabled={!!editingItem} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Professeur Principal</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.principalId} onChange={e => setFormData({...formData, principalId: e.target.value})}>
                      <option value="">Aucun</option>
                      {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nom complet</label>
                      <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Genre</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        { (editingItem?.type === 'students' || (activeTab === 'students' && !editingItem)) ? 'Parent (Tuteur)' : 'Matières'}
                      </label>
                      <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.extra} onChange={e => setFormData({...formData, extra: e.target.value})} />
                    </div>
                    { (editingItem?.type === 'students' || (activeTab === 'students' && !editingItem)) && (
                      <>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Âge</label>
                          <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date de Naissance</label>
                          <input required type="text" placeholder="JJ/MM/AAAA" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</label>
                          <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Adresse</label>
                          <textarea required rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      { (editingItem?.type === 'students' || (activeTab === 'students' && !editingItem)) ? 'Classe' : 'Affectations Classes'}
                    </label>
                    { (editingItem?.type === 'teachers' || (activeTab === 'teachers' && !editingItem)) ? (
                      <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-1">
                        {classes.map(c => (
                          <label key={c.id} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              checked={formData.classes.includes(c.id)}
                              onChange={(e) => {
                                const newClasses = e.target.checked 
                                  ? [...formData.classes, c.id]
                                  : formData.classes.filter(className => className !== c.id);
                                setFormData({...formData, classes: newClasses});
                              }}
                            />
                            <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{c.id}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={formData.classes[0]} 
                        onChange={e => setFormData({...formData, classes: [e.target.value]})}
                      >
                        {classes.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                      </select>
                    )}
                  </div>
                  {subjectError && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 mt-2">{subjectError}</p>}
                </>
              )}
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-200 mt-4">
                {editingItem ? 'Mettre à jour' : 'Confirmer la création'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
