import React, { useState } from 'react';

const AttendanceCalendar = ({ studentName = 'Lucas Dupont' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Mock attendance data for the month
  const attendanceData = {
    1: 'present', 2: 'present', 3: 'absent', 4: 'present', 5: 'present',
    8: 'present', 9: 'late', 10: 'present', 11: 'present', 12: 'present',
    15: 'present', 16: 'present', 17: 'present', 18: 'present', 19: 'absent'
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(year, month);
    const startOffset = firstDayOfMonth(year, month);

    // Empty cells for offset
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 border border-slate-50"></div>);
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const status = attendanceData[d];
      let statusColor = 'bg-white';
      if (status === 'present') statusColor = 'bg-emerald-50 text-emerald-600';
      else if (status === 'absent') statusColor = 'bg-rose-50 text-rose-600';
      else if (status === 'late') statusColor = 'bg-amber-50 text-amber-600';

      days.push(
        <div 
          key={d} 
          className={`h-14 border border-slate-100 flex flex-col items-center justify-center relative transition-all hover:z-10 hover:shadow-md cursor-default ${statusColor}`}
        >
          <span className="text-xs font-bold mb-1 opacity-60">{d}</span>
          {status && <div className={`w-1.5 h-1.5 rounded-full ${status === 'present' ? 'bg-emerald-500' : status === 'absent' ? 'bg-rose-500' : 'bg-amber-500'}`} />}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-light border border-slate-100 overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
        <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">❮</button>
        <div className="text-center">
          <h4 className="font-bold text-sm uppercase tracking-widest">{monthNames[month]} {year}</h4>
          <p className="text-[10px] opacity-60 font-medium">Pointage de {studentName}</p>
        </div>
        <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">❯</button>
      </div>
      
      <div className="grid grid-cols-7 text-center bg-slate-50 border-b border-slate-100">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="py-2 text-[10px] font-bold text-slate-400 uppercase">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {renderDays()}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Présent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Retard</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
