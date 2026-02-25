import React, { useState, useEffect } from 'react';

const Card = ({ title, children, actionLabel, onAction }) => (
  <div className="bg-white rounded-2xl p-6 shadow-light border border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 active:scale-95 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
    {children}
  </div>
);

const AttendanceBadge = ({ status }) => {
  const configs = {
    present: { label: 'Présent', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: 'fa-circle-check' },
    absent: { label: 'Absent', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: 'fa-circle-xmark' },
  };
  const config = configs[status] || configs.present;
  
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${config.color}`}>
      <i className={`fa-solid ${config.icon}`}></i>
      {config.label}
    </span>
  );
};

const ParentDashboard = ({ forceOpenModal = false, initialView = 'summary', notifications: sharedNotifications, students: sharedStudents, grades: sharedGrades }) => {
  const [activeView, setActiveView] = useState(initialView);
  const [isModalOpen, setIsModalOpen] = useState(forceOpenModal);
  const [isPlannedModalOpen, setIsPlannedModalOpen] = useState(false);
  const [plannedDate, setPlannedDate] = useState('');
  const [plannedStartTime, setPlannedStartTime] = useState('');
  const [plannedEndTime, setPlannedEndTime] = useState('');
  const [isWholeDay, setIsWholeDay] = useState(true);
  const [justification, setJustification] = useState('');
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [notifsAvailable, setNotifsAvailable] = useState(true);

  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  useEffect(() => {
    if (forceOpenModal) setIsModalOpen(true);
  }, [forceOpenModal]);

  // Use shared state if provided, otherwise fallback to internal mock (safety)
  const notifications = sharedNotifications || [
    { id: 1, title: 'Absence signalée', content: 'Lucas a été marqué absent ce matin (24/02).', time: '08:45', type: 'absence', read: false },
    { id: 2, title: 'Nouvelle note', content: 'Une nouvelle note en Mathématiques est disponible.', time: 'Hier', type: 'grade', read: true },
  ];

  const students = sharedStudents || [
    { 
      id: 1, 
      name: 'Lucas Dupont', 
      class: 'CM2-A', 
      rank: 4, 
      absences: 2
    }
  ];

  const student = students[0] || { name: 'Élève', class: 'N/A' }; 
  
  // Dynamic grades calculation
  const studentGrades = sharedGrades ? sharedGrades.filter(g => g.studentId === student.id) : [];
  const average = studentGrades.length > 0 
    ? (studentGrades.reduce((acc, g) => acc + g.value, 0) / studentGrades.length).toFixed(1)
    : 'N/A';
  
  const lastGrade = studentGrades.length > 0
    ? studentGrades[0] // Assuming sorted by date descending in App.jsx or here
    : { subject: 'N/A', value: '--', max: 20, date: 'Aucune note' };

  // Update student object for stats
  const studentWithStats = { ...student, average };

  // Past absences
  const pastAbsences = [
    { id: 101, date: '20 Fév 2026', status: 'accepted', reason: 'Rendez-vous médical (Dentiste)', message: 'Justification acceptée avec succès.' },
    { id: 102, date: '22 Fév 2026', status: 'pending', reason: 'Grippe saisonnière' },
    { id: 103, date: '25 Fév 2026', status: 'unjustified' },
  ];

  const handlePlannedAbsence = (e) => {
    e.preventDefault();
    const timeInfo = isWholeDay ? 'toute la journée' : `de ${plannedStartTime} à ${plannedEndTime}`;
    alert(`Absence prévue signalée pour le ${plannedDate} (${timeInfo}). Merci.`);
    setIsPlannedModalOpen(false);
    setPlannedDate('');
    setPlannedStartTime('');
    setPlannedEndTime('');
    setIsWholeDay(true);
  };

  const handleJustify = (e) => {
    e.preventDefault();
    alert(`Justification envoyée pour l'absence du ${selectedAbsence.date}. Vous recevrez une notification après validation par l'administration.`);
    setIsModalOpen(false);
    setJustification('');
    setSelectedAbsence(null);
  };

  const openJustifyModal = (absence) => {
    setSelectedAbsence(absence);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 text-slate-900 animate-slide-up">

      {/* Only show tabs if we are on the main summary/dashboard view */}
      {initialView === 'summary' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase tabular-nums text-slate-900">Bonjour, Jean</h1>
            <p className="text-slate-500 font-medium tracking-tight">Suivi de {studentWithStats.name} • <span className="text-blue-600 font-bold">{studentWithStats.class}</span></p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem] shadow-inner border border-slate-200 w-fit">
            <button 
              onClick={() => setActiveView('summary')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'summary' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Tableau de bord
            </button>
            <button 
              onClick={() => {
                setActiveView('notifs');
                setNotifsAvailable(false);
              }}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'notifs' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Notifications
              {notifsAvailable && <span className="w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] animate-pulse">2</span>}
            </button>
          </div>
        </div>
      )}

      {activeView === 'summary' ? (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[2rem] shadow-light flex items-center gap-6 group hover:border-blue-400/50 transition-all hover:shadow-premium active-scale">
              <div className="w-16 h-16 rounded-[1.25rem] bg-blue-50 text-blue-600 flex items-center justify-center text-3xl transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 shadow-sm">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">Moyenne</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{studentWithStats.average}</span>
                  <span className="text-sm text-slate-400 font-black">/20</span>
                </div>
              </div>
            </div>
            <div className="glass p-8 rounded-[2rem] shadow-light flex items-center gap-6 group hover:border-rose-400/50 transition-all hover:shadow-premium active-scale">
              <div className="w-16 h-16 rounded-[1.25rem] bg-rose-50 text-rose-600 flex items-center justify-center text-3xl transition-all group-hover:bg-rose-600 group-hover:text-white group-hover:-rotate-6 shadow-sm">
                <i className="fa-solid fa-user-xmark"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">
                  {studentWithStats.absences > 1 ? 'Absents' : 'Absent'}
                </p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{studentWithStats.absences}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* List of absences */}
              <div className="bg-white rounded-3xl shadow-light border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter text-sm">
                    <i className="fa-solid fa-calendar-day text-blue-600"></i> Historique Présence
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {pastAbsences.map(a => (
                    <div key={a.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-transform group-hover:scale-110 shadow-sm border ${
                          a.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          a.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          <i className={`fa-solid ${a.status === 'accepted' ? 'fa-check' : a.status === 'pending' ? 'fa-hourglass' : 'fa-xmark'}`}></i>
                        </div>
                        <div>
                          <p className="font-black text-slate-800 tabular-nums">{a.date}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {a.status === 'accepted' ? 'Justifiée' : a.status === 'pending' ? 'En traitement' : 'Justification requise'}
                          </p>
                        </div>
                      </div>
                      {a.status === 'unjustified' && (
                        <button 
                          onClick={() => openJustifyModal(a)}
                          className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-200 hover:bg-slate-800"
                        >
                          Justifier <i className="fa-solid fa-arrow-right ml-2 opacity-50"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed style update */}
              <div className="bg-white rounded-3xl p-8 shadow-light border border-slate-200">
                <h3 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tighter text-sm">
                  <i className="fa-brands fa-whatsapp text-emerald-500 text-xl"></i> Échanges récents
                </h3>
                <div className="space-y-6">
                  {notifications.slice(0, 1).map(notif => (
                    <div key={notif.id} className="flex gap-4 animate-in slide-in-from-left duration-300">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 flex-shrink-0 flex items-center justify-center text-lg font-black text-blue-600 shadow-sm border-2 border-white uppercase">
                        {notif.sender?.charAt(0) || 'A'}
                      </div>
                      <div className="bg-slate-50 rounded-3xl rounded-tl-none p-5 max-w-lg border border-slate-100 shadow-sm relative">
                        <p className="text-xs text-slate-800 font-black mb-1">
                          {notif.sender || 'Admin'} 
                          <span className="text-[9px] text-slate-400 font-bold ml-2 uppercase tracking-widest">Via WhatsApp</span>
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed italic font-medium">"{notif.content}"</p>
                        <p className="text-[10px] text-slate-400 mt-4 text-right font-black uppercase tracking-widest">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-light border border-slate-200 overflow-hidden relative group">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Dernière note</h3>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="max-w-[120px]">
                    <p className="text-sm font-black text-slate-900 truncate leading-none mb-1">{lastGrade.subject}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{lastGrade.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-blue-600 tabular-nums tracking-tighter">{lastGrade.value}</span>
                    <span className="text-sm text-slate-400 font-bold">/20</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Thème : <span className="text-slate-800 font-black">{lastGrade.theme || 'Évaluation'}</span></p>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl shadow-slate-200 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-[10px] uppercase tracking-widest opacity-60">Status Actuel</h3>
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black mb-1">Aujourd'hui, 08:30</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Arrivée enregistrée</p>
                    </div>
                    <AttendanceBadge status="present" />
                  </div>
                  <button 
                    onClick={() => setIsPlannedModalOpen(true)}
                    className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/10 backdrop-blur-sm"
                  >
                    Anticiper une absence
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : activeView === 'notifs' ? (
        <div className="bg-white rounded-3xl shadow-light border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
              <i className="fa-solid fa-bell text-rose-500"></i> Centre d'alertes
            </h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Échanges administratifs et pédagogiques.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {notifications.length > 0 ? notifications.map(notif => (
              <div key={notif.id} className="p-6 flex gap-5 hover:bg-slate-50 transition-all group cursor-pointer relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all group-hover:scale-105 border ${
                  notif.type === 'absence' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-blue-50 text-blue-500 border-blue-100'
                }`}>
                  <i className={`fa-solid ${notif.type === 'absence' ? 'fa-user-xmark' : 'fa-file-signature'}`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${notif.type === 'absence' ? 'text-rose-500' : 'text-blue-500'}`}>
                      {notif.type === 'absence' ? 'Absence' : 'Information'}
                    </p>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{notif.date}, {notif.time}</span>
                  </div>
                  <p className="text-sm text-slate-800 font-black leading-snug mb-1">{notif.content}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Source: {notif.sender || 'Système SchoolTracking'}</p>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center">
                <i className="fa-solid fa-inbox text-5xl text-slate-100 mb-4 block"></i>
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Boîte de réception vide</p>
              </div>
            )}
          </div>
        </div>
      ) : activeView === 'notes' ? (
        <div className="bg-white rounded-3xl shadow-light border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tighter">
              <i className="fa-solid fa-award text-blue-600"></i> Dossier Scolaire
            </h2>
            <div className="px-4 py-2 bg-slate-900 text-white rounded-2xl">
              <span className="text-xs font-black uppercase tracking-widest opacity-60 mr-2">Moyenne</span>
              <span className="text-lg font-black">{studentWithStats.average}<span className="text-xs opacity-60">/20</span></span>
            </div>
          </div>
          
          <div className="space-y-4">
            {studentGrades.length > 0 ? studentGrades.map(grade => (
              <div key={grade.id} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all group active:scale-[0.98]">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-100">
                    <i className="fa-solid fa-file-invoice"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm group-hover:text-blue-600 transition-colors">{grade.theme}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{grade.subject} • {grade.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black tabular-nums ${grade.value >= 10 ? 'text-blue-600' : 'text-rose-600'}`}>
                    {grade.value}
                  </span>
                  <span className="text-xs text-slate-400 font-bold ml-1">/20</span>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">
                Aucune note enregistrée pour le moment.
              </div>
            )}
          </div>
        </div>
      ) : activeView === 'absences' ? (
        <div className="bg-white rounded-3xl shadow-light border border-slate-200">
           <div className="p-8 border-b border-slate-100 items-center flex justify-between">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
                <i className="fa-solid fa-clipboard-list text-blue-500"></i> Justifications Apportées
              </h2>
           </div>
           <div className="divide-y divide-slate-100">
              {pastAbsences.filter(a => a.status !== 'unjustified').map(a => (
                <div key={a.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm border ${
                      a.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      <i className={`fa-solid ${a.status === 'accepted' ? 'fa-check' : 'fa-hourglass'}`}></i>
                    </div>
                    <div>
                      <p className="font-black text-slate-800">{a.date}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                        {a.status === 'accepted' ? 'Justifiée' : 'En cours de traitement'}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 sm:max-w-xs">
                    <p className="text-sm text-slate-600 italic">"{a.reason || 'Aucun motif renseigné'}"</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      a.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {a.status === 'accepted' ? 'Approuvé' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
              {pastAbsences.filter(a => a.status !== 'unjustified').length === 0 && (
                <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  Aucune justification apportée pour le moment.
                </div>
              )}
           </div>
        </div>
      ) : activeView === 'messages' ? (
        <div className="bg-white rounded-3xl shadow-light border border-slate-200 p-8">
           <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-6 uppercase tracking-tighter">
             <i className="fa-brands fa-whatsapp text-emerald-500"></i> Messages de Classe
           </h2>
            <div className="space-y-6">
               {notifications.length > 0 ? notifications.map((notif) => (
                 <div key={notif.id} className="flex gap-4 animate-in slide-in-from-left duration-300">
                   <div className="w-12 h-12 rounded-2xl bg-blue-100 flex-shrink-0 flex items-center justify-center text-lg font-black text-blue-600 shadow-sm border-2 border-white uppercase">
                     {notif.sender?.charAt(0) || 'A'}
                   </div>
                   <div className="bg-slate-50 rounded-3xl rounded-tl-none p-5 max-w-lg border border-slate-100 shadow-sm">
                     <p className="text-xs text-slate-800 font-bold mb-1">
                       {notif.sender || 'Administrateur'} 
                       <span className="text-[9px] text-slate-400 font-normal ml-2 uppercase tracking-widest">Notification</span>
                     </p>
                     <p className="text-sm text-slate-600 leading-relaxed italic">"{notif.content}"</p>
                     <p className="text-[10px] text-slate-400 mt-3 text-right font-black uppercase tracking-widest">{notif.date}, {notif.time}</p>
                   </div>
                 </div>
               )) : (
                 <div className="py-12 text-center text-slate-400 font-medium italic">
                   Aucun message pour le moment.
                 </div>
               )}
            </div>
        </div>
      ) : null}

      {/* Modal planned absence */}
      {isPlannedModalOpen && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Absence prévue</h3>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Date et Heure à venir</p>
              </div>
              <button onClick={() => setIsPlannedModalOpen(false)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 transition-all shadow-sm">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handlePlannedAbsence} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-medium" 
                  value={plannedDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                />
              </div>

              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all">
                <input 
                  type="checkbox" 
                  checked={isWholeDay}
                  onChange={(e) => setIsWholeDay(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-700">Toute la journée</span>
              </label>

              {!isWholeDay && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Heure de début</label>
                    <input 
                      type="time" 
                      required={!isWholeDay}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-medium" 
                      value={plannedStartTime}
                      onChange={(e) => setPlannedStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Heure de fin</label>
                    <input 
                      type="time" 
                      required={!isWholeDay}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-medium" 
                      value={plannedEndTime}
                      onChange={(e) => setPlannedEndTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl hover:bg-slate-800 mt-4">
                Confirmer l'absence <i className="fa-solid fa-clock ml-2"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal justification */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Justifier l'absence</h3>
                {selectedAbsence && <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Date : {selectedAbsence.date}</p>}
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleJustify} className="p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Motif de l'absence</label>
                <textarea 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all resize-none font-medium"
                  rows="4"
                  placeholder="Ex: Raisons médicales, certificat joint..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pièce Jointe (Image ou PDF)</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*,application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center group-hover:bg-slate-100 group-hover:border-blue-300 transition-all">
                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-300 mb-2 group-hover:text-blue-400"></i>
                    <p className="text-xs text-slate-500 font-bold">Cliquez ou glissez un fichier ici</p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase">MAX 5MB • JPG, PNG, PDF</p>
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-blue-200 hover:bg-blue-700"
              >
                Envoyer <i className="fa-solid fa-paper-plane ml-2"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
