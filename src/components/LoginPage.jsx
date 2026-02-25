import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('login'); // 'login' or 'forgot'

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Strict Identifier Validation (Email or Phone)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    
    if (!emailRegex.test(email) && !phoneRegex.test(email)) {
      alert("Erreur : Veuillez entrer un email valide ou un numéro de téléphone au format international.");
      return;
    }

    // Simplified Password Validation for MVP: 8+ characters
    if (password.length < 8) {
      alert("Erreur : Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin({ email, role });
    }, 1000);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Si ce compte existe, un lien de réinitialisation a été envoyé.");
      setView('login');
    }, 1000);
  };

  if (view === 'forgot') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-20 px-6 lg:px-8 animate-fade-in">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="mx-auto w-16 h-16 bg-slate-900 border-4 border-white shadow-premium rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl">E</div>
          <h2 className="mt-8 text-4xl font-black text-slate-900 uppercase tracking-tighter">Mot de passe oublié</h2>
          <p className="mt-3 text-sm text-slate-500 font-medium">Réinitialisation sécurisée de votre compte.</p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="glass py-10 px-8 shadow-premium rounded-[2.5rem] border border-white">
            <form className="space-y-8" onSubmit={handleForgotSubmit}>
              <div className="space-y-2">
                <label htmlFor="email-forgot" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Email</label>
                <input
                  id="email-forgot"
                  type="email"
                  required
                  className="block w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-[1.25rem] shadow-xl text-[11px] font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 active-scale disabled:opacity-50"
              >
                {isLoading ? "Envoi..." : "Envoyer le lien"}
              </button>

              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => setView('login')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-20 px-6 lg:px-8 animate-fade-in relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full -ml-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-900/5 rounded-full -mr-48 -mb-48 blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="mx-auto w-16 h-16 bg-slate-900 border-4 border-white shadow-premium rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl">E</div>
        <h2 className="mt-8 text-4xl font-black text-slate-900 uppercase tracking-tighter">Bienvenue sur SchoolTracking</h2>
        <p className="mt-3 text-sm text-slate-500 font-medium h-5">
          {role === 'admin' ? "Gérez votre établissement en toute simplicité." : 
           role === 'teacher' ? "Préparez vos cours et suivez vos élèves sereinement." : 
           "Suivez la scolarité de votre enfant en temps réel."}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass py-10 px-8 shadow-premium rounded-[2.5rem] border border-white">
          <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem] shadow-inner mb-10 border border-slate-200">
            {['parent', 'teacher', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  role === r ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r === 'parent' ? 'Parent' : r === 'teacher' ? 'Prof' : 'Admin'}
              </button>
            ))}
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email ou Téléphone</label>
              <input
                id="email"
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: +33 6..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Mot de passe</label>
                <button 
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-xs font-medium text-blue-600 hover:text-blue-500"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? "Vérification..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
