import React, { useState } from 'react';

const Sidebar = ({ isOpen, toggleSidebar, role, currentView, setView }) => {
  const menus = {
    parent: [
      { id: 'dashboard', icon: 'fa-solid fa-house', label: 'Dashboard' },
      { id: 'notes', icon: 'fa-solid fa-file-lines', label: 'Notes de l\'enfant' },
      { id: 'absences', icon: 'fa-solid fa-clipboard-check', label: 'Justifications' },
      { id: 'parent_messages', icon: 'fa-solid fa-comment-dots', label: 'Messages Reçus' },
    ],
    teacher: [
      { id: 'attendance', icon: 'fa-solid fa-square-check', label: 'Pointer l\'appel' },
      { id: 'grades', icon: 'fa-solid fa-chart-simple', label: 'Insérer des notes' },
      { id: 'history', icon: 'fa-solid fa-clock-rotate-left', label: 'Historique des Notes' },
      { id: 'teacher_messages', icon: 'fa-solid fa-message', label: 'Messages' },
    ],
    admin: [
      { id: 'management', icon: 'fa-solid fa-users-gear', label: 'Gestion Académique' },
      { id: 'justify_admin', icon: 'fa-solid fa-clipboard-check', label: 'Justifications' },
      { id: 'sms', icon: 'fa-solid fa-mobile-screen-button', label: 'Envoi SMS' },
      { id: 'reports', icon: 'fa-solid fa-chart-pie', label: 'Stats Globales' },
    ]
  };

  const activeMenu = menus[role] || menus.parent;

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-white border-r border-slate-200 w-64`}>
      <div className="flex items-center gap-2 p-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">EcoLink</span>
      </div>
      <nav className="p-4 space-y-1">
        {activeMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setView(item.id);
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-95 ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className={`${item.icon} text-lg w-5`}></i>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

const Topbar = ({ toggleSidebar, userRole = "Parent", onLogout }) => {
  const handleLogoutClick = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      onLogout();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-slate-50 active:scale-95 transition-all text-slate-600"
        >
          <i className="fa-solid fa-bars text-xl"></i>
        </button>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800">Utilisateur EcoLink</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{userRole}</p>
        </div>
        <button 
          onClick={handleLogoutClick}
          className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium text-sm"
          title="Déconnexion"
        >
          <span className="hidden sm:inline">Déconnexion</span>
          <i className="fa-solid fa-right-from-bracket text-lg"></i>
        </button>
      </div>
    </header>
  );
};

const Layout = ({ children, userRole, role, currentView, setView, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
        role={role}
        currentView={currentView}
        setView={setView}
      />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
        <Topbar 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          userRole={userRole} 
          onLogout={onLogout}
        />
        <main className="p-4 md:p-10 lg:p-12 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
