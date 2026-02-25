import React, { useState } from 'react'
import Layout from './components/Layout'
import ParentDashboard from './components/ParentDashboard'
import TeacherAttendance from './components/TeacherAttendance'
import GradeInsertion from './components/GradeInsertion'
import GradebookHistory from './components/GradebookHistory'
import AdminManagement from './components/AdminManagement'
import AdminAudit from './components/AdminAudit'
import AdminJustifications from './components/AdminJustifications'
import TeacherSentMessages from './components/TeacherSentMessages';
import AdminReminders from './components/AdminReminders';
import LoginPage from './components/LoginPage'

function App() {
  const [user, setUser] = useState(null); // { email, role }
  const [currentView, setCurrentView] = useState('dashboard');

  // SHARED STATE - CENTRALIZED DATA
  const [students, setStudents] = useState([
    { id: 1, name: 'Lucas Dupont', class: 'CM2-A', parent: 'Jean Dupont', gender: 'M', birthDate: '15/05/2015', address: '12 Rue de la Paix, Paris', age: 10, phone: '06 12 34 56 78', status: 'present' },
    { id: 2, name: 'Emma Bernard', class: 'CM2-A', parent: 'Sophie Bernard', gender: 'F', birthDate: '22/08/2015', address: '5 Avenue des Champs, Lyon', age: 10, phone: '06 98 76 54 32', status: 'present' },
    { id: 3, name: 'Thomas Petit', class: 'CM2-B', parent: 'Marc Petit', gender: 'M', birthDate: '10/02/2015', address: '8 Rue Verte, Marseille', age: 11, phone: '07 11 22 33 44', status: 'absent' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, recipient: 'Mme. Bernard', content: 'EcoLink : Cher parent, votre enfant Emma Bernard est absent ce jour. Merci de régulariser cette situation via votre espace parent.', date: '25 Féb 2026', time: '08:45', type: 'absence' },
  ]);

  const [grades, setGrades] = useState([
    { id: 101, studentId: 1, subject: 'Mathématiques', value: 17.5, theme: 'Fractions', date: '24 Féb 2026', teacher: 'M. Petit' },
    { id: 102, studentId: 2, subject: 'Français', value: 14, theme: 'Dictée', date: '24 Féb 2026', teacher: 'Mme. Durand' },
    { id: 103, studentId: 1, subject: 'Sciences', value: 15, theme: 'Système Solaire', date: '23 Féb 2026', teacher: 'M. Petit' },
  ]);

  const [messageTemplate, setMessageTemplate] = useState("EcoLink : Cher parent, votre enfant [NOM] est absent ce jour. Merci de régulariser cette situation via votre espace parent.");

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'teacher') setCurrentView('attendance');
    else if (userData.role === 'admin') setCurrentView('management');
    else setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Global Actions
  const handleSendReminder = (student) => {
    const content = messageTemplate.replace('[NOM]', student.name);
    const newNotification = {
      id: Date.now(),
      recipient: student.parent,
      content: content,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: 'absence'
    };
    setNotifications([newNotification, ...notifications]);
    alert(`Message envoyé à ${student.parent} via WhatsApp !`);
  };

  const updateStudentStatus = (id, status) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleAddGradesBatch = (newGrades) => {
    setGrades([...newGrades, ...grades]);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch(currentView) {
      // Vues Parent
      case 'dashboard': return <ParentDashboard initialView="summary" notifications={notifications} students={students} grades={grades} />;
      case 'notes': return <ParentDashboard initialView="notes" notifications={notifications} students={students} grades={grades} />;
      case 'absences': return <ParentDashboard initialView="absences" notifications={notifications} students={students} grades={grades} />;
      case 'messages': return <ParentDashboard initialView="messages" notifications={notifications} students={students} grades={grades} />;
      case 'justify': return <ParentDashboard forceOpenModal={true} initialView="summary" notifications={notifications} students={students} grades={grades} />;

      // Vues Enseignant
      case 'attendance': return <TeacherAttendance students={students} setStudents={setStudents} updateStudentStatus={updateStudentStatus} />;
      case 'grades': return <GradeInsertion students={students} onSaveGrades={handleAddGradesBatch} />;
      case 'history': return <GradebookHistory grades={grades} students={students} />;
      case 'messages': return <TeacherSentMessages messages={notifications} />;

      // Vues Admin
      case 'management': return <AdminManagement students={students} setStudents={setStudents} />;
      case 'justify_admin': return <AdminJustifications />;
      case 'sms': return (
        <AdminReminders 
          absentees={students.filter(s => s.status === 'absent')} 
          template={messageTemplate}
          setTemplate={setMessageTemplate}
          onSendMessage={handleSendReminder}
          history={notifications}
        />
      );
      case 'reports': return <AdminAudit students={students} />;
      case 'results': return <div className="p-4 bg-white rounded-2xl shadow-light border border-slate-100"> <h2 className="text-xl font-bold mb-4">Résultats des examens</h2> </div>;

      default: return <ParentDashboard notifications={notifications} students={students} />;
    }
  };

  return (
    <Layout 
      userRole={user.role === 'teacher' ? 'Enseignant' : user.role === 'admin' ? 'Administrateur' : 'Parent'}
      role={user.role}
      currentView={currentView}
      setView={setCurrentView}
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  )
}

export default App
