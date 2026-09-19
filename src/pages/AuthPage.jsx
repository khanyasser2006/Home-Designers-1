import { useState, useEffect } from 'react';

export default function AuthPage({ currentUser, onLogin, onRegister, onLogout, onNavigate }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [propertyInterest, setPropertyInterest] = useState('Hillside Estate');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'register') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMessage('Please complete all required fields.');
        return;
      }

      const res = await onRegister({ name, email, password, propertyInterest });
      if (res.success) {
        setSuccessMessage('Registration successful! You are now logged in to the Client Atelier Portal.');
      } else {
        setErrorMessage(res.error || 'An error occurred during registration.');
      }
    } else {
      // Login mode
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Please enter your email and password.');
        return;
      }

      const res = await onLogin({ email, password });
      if (res.success) {
        if (res.isAdmin) {
          setSuccessMessage('Welcome Master Principal Architect. Loading Studio Admin Panel...');
          setTimeout(() => {
            onNavigate('admin');
          }, 400);
        } else {
          setSuccessMessage('Welcome back. Loading your private dossier...');
        }
      } else {
        setErrorMessage(res.error || 'Invalid credentials.');
      }
    }
  };

  // Helper for 1-click Quick Login
  const handleQuickLogin = async (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setErrorMessage('');
    setSuccessMessage('');
    const res = await onLogin({ email: quickEmail, password: quickPassword });
    if (res.success && res.isAdmin) {
      setTimeout(() => onNavigate('admin'), 300);
    }
  };

  // If user is already logged in as Admin, show Admin Hub Quick Action
  if (currentUser && currentUser.isAdmin) {
    return (
      <div className="min-h-screen bg-mocha-deep text-latte-warm selection:bg-latte selection:text-mocha pt-28 pb-32">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-12 text-center">
          <div className="p-10 sm:p-16 rounded-3xl bg-mocha border border-latte/25 shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Authenticated as Master Studio Admin
            </div>

            <h1 className="font-display text-4xl sm:text-5xl text-latte-warm font-normal">
              Welcome, Principal <span className="font-script text-5xl text-latte">{currentUser.name}</span>
            </h1>

            <p className="font-body text-sm text-latte/80 font-light max-w-xl mx-auto leading-relaxed">
              You hold complete Master CRUD control over all residences, living spaces, methodology phases, studio ateliers, and incoming client briefs.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('admin')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-latte text-mocha font-body text-xs uppercase tracking-[0.2em] font-semibold hover:bg-latte-warm transition-colors cursor-pointer shadow-xl"
              >
                ⚡ Open Master Studio Admin Panel →
              </button>

              <button
                onClick={onLogout}
                className="w-full sm:w-auto px-6 py-4 rounded-xl border border-latte/30 text-latte text-xs font-body uppercase tracking-wider hover:bg-latte/10 cursor-pointer"
              >
                Sign Out Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is already logged in as Client, show VIP Client Portal Dashboard
  if (currentUser) {
    return (
      <div className="min-h-screen bg-latte-cream text-mocha selection:bg-mocha selection:text-latte-warm pt-28 pb-32">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
          {/* Breadcrumbs */}
          <div className="pb-12 border-b border-mocha/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => onNavigate('home')}
                  className="font-body text-xs uppercase tracking-[0.2em] text-mocha/60 hover:text-mocha transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span className="text-mocha/30">/</span>
                <span className="font-body text-xs uppercase tracking-[0.2em] text-mocha font-semibold">
                  Client Portal
                </span>
              </div>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-mocha/70 block mb-1">
                Private Client Atelier
              </span>
              <h1 className="font-display text-4xl sm:text-5xl text-mocha font-normal">
                Welcome, <span className="font-script text-4xl sm:text-5xl text-mocha">{currentUser.name}</span>
              </h1>
            </div>

            <button
              onClick={onLogout}
              className="px-6 py-2.5 rounded-full border border-mocha/30 text-xs font-body uppercase tracking-widest text-mocha hover:bg-mocha hover:text-latte-warm transition-colors cursor-pointer self-start sm:self-auto"
            >
              Sign Out
            </button>
          </div>

          {/* Active Commission Status Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12">
            <div className="lg:col-span-8 bg-mocha text-latte-warm p-8 sm:p-12 rounded-3xl border border-latte/20 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-latte/15">
                  <span className="font-body text-[10px] uppercase tracking-widest text-latte/80 font-semibold bg-mocha-deep px-3 py-1 rounded-full border border-latte/20">
                    Active Commission Dossier
                  </span>
                  <span className="font-body text-xs text-latte/70 uppercase tracking-widest">
                    Milestone 03 of 04
                  </span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl text-latte-warm font-normal mb-2">
                  The Bel Air Hillside Villa
                </h2>
                <p className="font-script text-2xl text-latte mb-6">
                  Phase 03 · Direct Quarry Sourcing & Joinery
                </p>

                <p className="font-body text-xs sm:text-sm text-latte/80 font-light leading-relaxed mb-8">
                  Your Italian Roman Travertine slabs have arrived from Tivoli and passed precision optical inspection. Custom smoked oak ceiling joinery is currently in final assembly in our Black Forest workshop.
                </p>

                {/* Progress Timeline Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-body text-latte/70">
                    <span>Discovery & Site Survey</span>
                    <span>3D Volumetric BIM</span>
                    <span className="text-latte font-semibold">Quarry Sourcing (Current)</span>
                    <span>Turnkey Handover</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-mocha-deep overflow-hidden border border-latte/20">
                    <div className="w-3/4 h-full bg-latte rounded-full transition-all duration-1000" />
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-latte/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-latte/70">
                <span>Lead Architect: Julian Vance, Managing Principal</span>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-latte underline hover:text-latte-warm cursor-pointer uppercase tracking-wider"
                >
                  Direct Message Studio →
                </button>
              </div>
            </div>

            {/* Private Client Services Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-3xl bg-latte-warm border border-mocha/15">
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-mocha/60 block mb-2 font-semibold">
                  Account Details
                </span>
                <p className="font-display text-xl text-mocha font-normal mb-1">
                  {currentUser.email}
                </p>
                <p className="font-body text-xs text-mocha/70 font-light mb-4">
                  Interest: {currentUser.propertyInterest || 'Bespoke Residence'}
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-latte-cream border border-mocha/10 text-[10px] uppercase tracking-widest text-mocha/70 font-semibold">
                  VIP Verified Client
                </span>
              </div>

              <div className="p-8 rounded-3xl bg-latte-warm border border-mocha/15">
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-mocha/60 block mb-3 font-semibold">
                  Quick Atelier Actions
                </span>
                <div className="space-y-3 text-xs font-body">
                  <button
                    onClick={() => onNavigate('homes')}
                    className="w-full py-3 px-4 rounded-xl bg-latte-cream border border-mocha/15 text-mocha text-left hover:bg-mocha hover:text-latte-warm transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>Browse All Selected Residences</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => onNavigate('process')}
                    className="w-full py-3 px-4 rounded-xl bg-latte-cream border border-mocha/15 text-mocha text-left hover:bg-mocha hover:text-latte-warm transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>Review 4-Phase Methodology</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => onNavigate('studios')}
                    className="w-full py-3 px-4 rounded-xl bg-latte-cream border border-mocha/15 text-mocha text-left hover:bg-mocha hover:text-latte-warm transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>Book Global Atelier Visit</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Logged In: Render Login / Register Form
  return (
    <div className="min-h-screen bg-latte-cream text-mocha selection:bg-mocha selection:text-latte-warm pt-28 pb-32">
      <div className="max-w-[720px] mx-auto px-6 sm:px-12">
        {/* Breadcrumb Header */}
        <div className="pb-12 border-b border-mocha/15 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="font-body text-xs uppercase tracking-[0.2em] text-mocha/60 hover:text-mocha transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-mocha/30">/</span>
            <span className="font-body text-xs uppercase tracking-[0.2em] text-mocha font-semibold">
              Client Portal
            </span>
          </div>

          <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-mocha/70 block mb-3">
            Private Access
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-mocha font-normal leading-[1.08] tracking-tight">
            Client <span className="font-script text-4xl sm:text-5xl text-mocha font-normal">Atelier Portal.</span>
          </h1>
          <p className="font-body text-xs sm:text-sm text-mocha/80 font-light leading-relaxed mt-4 max-w-md mx-auto">
            Access your active residential commissions, 3D architectural models, quarry material logs, or manage the studio as Master Admin.
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="pt-8 flex justify-center">
          <div className="bg-latte-warm p-1 rounded-full border border-mocha/15 inline-flex items-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`px-8 py-2.5 rounded-full text-xs font-body uppercase tracking-[0.16em] font-semibold transition-all duration-300 cursor-pointer ${
                mode === 'login'
                  ? 'bg-mocha text-latte-warm shadow-md'
                  : 'text-mocha/60 hover:text-mocha'
              }`}
            >
              Sign In (Existing / Admin)
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`px-8 py-2.5 rounded-full text-xs font-body uppercase tracking-[0.16em] font-semibold transition-all duration-300 cursor-pointer ${
                mode === 'register'
                  ? 'bg-mocha text-latte-warm shadow-md'
                  : 'text-mocha/60 hover:text-mocha'
              }`}
            >
              Register (New Client)
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="mt-8 bg-mocha text-latte-warm p-8 sm:p-12 rounded-3xl border border-latte/20 shadow-2xl animate-editorial-fade">
          <div className="mb-8">
            <h2 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal mb-1">
              {mode === 'login' ? 'Sign In to Portal / Admin Panel' : 'Register for Client Access'}
            </h2>
            <p className="font-script text-xl text-latte">
              {mode === 'login'
                ? 'If already registered, please sign in below'
                : 'Not registered yet? Create your account first, then sign in'}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/40 border border-red-400/40 text-red-200 text-xs font-body leading-relaxed flex flex-col gap-2">
              <p>{errorMessage}</p>
              {errorMessage.includes('not found') && mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className="self-start underline font-semibold text-latte-warm hover:text-latte cursor-pointer uppercase tracking-wider text-[11px]"
                >
                  Click here to Register first →
                </button>
              )}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-900/40 border border-emerald-400/40 text-emerald-200 text-xs font-body leading-relaxed">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-6">
            {mode === 'register' && (
              <>
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/70 block mb-2 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-latte/30 py-2.5 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/70 block mb-2 font-semibold">
                    Residence Classification
                  </label>
                  <select
                    value={propertyInterest}
                    onChange={(e) => setPropertyInterest(e.target.value)}
                    className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-2.5 text-xs text-latte-warm focus:outline-none focus:border-latte cursor-pointer"
                  >
                    <option value="Hillside Estate">Hillside Modern Villa</option>
                    <option value="Lakeside Home">Alpine & Lakeside Residence</option>
                    <option value="Coastal Villa">Coastal & Ocean Villa</option>
                    <option value="Garden Home">Courtyard & Garden Compound</option>
                    <option value="Historical Remodel">Historical Sanctuary Remodel</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/70 block mb-2 font-semibold">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. admin@homedesigners.com or client@homedesigners.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-latte/30 py-2.5 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors"
              />
            </div>

            <div>
              <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/70 block mb-2 font-semibold">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-latte/30 py-2.5 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-latte text-mocha font-body text-xs uppercase tracking-[0.2em] font-semibold hover:bg-latte-warm transition-all duration-300 shadow-xl cursor-pointer mt-4"
            >
              {mode === 'login' ? 'Sign In to Portal →' : 'Complete Registration & Sign In →'}
            </button>
          </form>

          {/* Toggle Helper Footer */}
          <div className="mt-8 pt-6 border-t border-latte/15 text-center text-xs text-latte/70 font-light">
            {mode === 'login' ? (
              <p>
                Not registered yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-latte underline hover:text-latte-warm font-medium cursor-pointer ml-1"
                >
                  Register your account first
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-latte underline hover:text-latte-warm font-medium cursor-pointer ml-1"
                >
                  Sign in directly
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Hardcoded Credentials Panel with 1-Click Fast Logins */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-latte-warm border border-mocha/15 space-y-4">
          <div className="text-center">
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-mocha/60 font-semibold block mb-1">
              Ready-Made Hardcoded Credentials
            </span>
            <p className="font-display text-xl text-mocha font-normal">
              Direct Instant Access
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Master Admin Card */}
            <div className="p-4 rounded-xl bg-mocha text-latte-warm border border-latte/15 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold block mb-1">
                  ⚡ Master Studio Admin
                </span>
                <p className="text-xs font-medium text-latte-warm">Email: admin@homedesigners.com</p>
                <p className="text-xs font-light text-latte/70">Password: admin123</p>
              </div>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@homedesigners.com', 'admin123')}
                className="mt-3 w-full py-2 rounded-lg bg-latte text-mocha text-[11px] font-body uppercase tracking-wider font-semibold hover:bg-latte-warm transition-colors cursor-pointer"
              >
                1-Click Admin Login →
              </button>
            </div>

            {/* VIP Client Card */}
            <div className="p-4 rounded-xl bg-latte-cream text-mocha border border-mocha/15 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-mocha/60 font-semibold block mb-1">
                  👤 VIP Client Account
                </span>
                <p className="text-xs font-medium text-mocha">Email: client@homedesigners.com</p>
                <p className="text-xs font-light text-mocha/70">Password: luxury123</p>
              </div>
              <button
                type="button"
                onClick={() => handleQuickLogin('client@homedesigners.com', 'luxury123')}
                className="mt-3 w-full py-2 rounded-lg bg-mocha text-latte-warm text-[11px] font-body uppercase tracking-wider font-semibold hover:bg-mocha-deep transition-colors cursor-pointer"
              >
                1-Click Client Login →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
