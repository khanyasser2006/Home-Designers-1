import { useState, useEffect } from 'react';

export default function Navbar({ currentPage, onNavigate, currentUser }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (currentPage === 'home') {
        // Hero sequence is 500vh (400vh of scroll). Hide navbar until the video sequence is completed!
        const heroCompleteThreshold = window.innerHeight * 3.8;
        setScrolled(window.scrollY >= heroCompleteThreshold);
      } else {
        setScrolled(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // On home page: only visible after the full 500vh hero scroll animation completes
  // On all subpages: always visible immediately
  const visible = currentPage === 'home' ? scrolled : true;

  // Clean Nav Links
  const navLinks = [
    { label: 'Main', page: 'home' },
    { label: 'Homes', page: 'homes' },
    { label: 'Process', page: 'process' },
    { label: 'Studios', page: 'studios' },
    { label: 'Contact', page: 'contact' },
  ];

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [currentPage]);

  const handleLinkClick = (e, pageKey) => {
    e.preventDefault();
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate(pageKey);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-mocha-deep text-latte-warm transition-all duration-500 ease-expo-out ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto py-4 border-b border-latte/15 shadow-2xl backdrop-blur-md'
          : 'opacity-0 -translate-y-full pointer-events-none py-4'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Mark */}
        <button
          onClick={(e) => handleLinkClick(e, 'home')}
          className="flex flex-col text-left group cursor-pointer"
        >
          <span
            className="font-display text-lg sm:text-xl tracking-[0.2em] uppercase text-latte-warm font-normal transition-opacity group-hover:opacity-80"
          >
            Home Designers
          </span>
          <span
            className="font-script text-base text-latte/80 leading-none -mt-0.5"
          >
            Architecture & Design
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={(e) => handleLinkClick(e, link.page)}
              className={`font-body text-xs uppercase transition-colors font-medium tracking-[0.16em] cursor-pointer py-1 relative ${
                currentPage === link.page
                  ? 'text-latte-warm font-semibold'
                  : 'text-latte/75 hover:text-latte-warm'
              }`}
            >
              {link.label}
              {currentPage === link.page && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-latte" />
              )}
            </button>
          ))}

          {/* Account / Admin Atelier Button */}
          <button
            onClick={(e) => handleLinkClick(e, currentUser?.isAdmin ? 'admin' : 'auth')}
            className={`px-5 py-2 rounded-full font-body text-[11px] uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer font-medium ${
              currentUser?.isAdmin
                ? currentPage === 'admin'
                  ? 'bg-latte text-mocha font-semibold shadow-md'
                  : 'border border-latte/40 text-latte-warm hover:bg-latte hover:text-mocha'
                : currentUser
                ? 'bg-latte text-mocha hover:bg-latte-warm'
                : 'border border-latte/40 text-latte-warm hover:bg-latte hover:text-mocha'
            }`}
          >
            {currentUser?.isAdmin ? (
              <span>Admin Atelier</span>
            ) : currentUser ? (
              <span>{currentUser.name.split(' ')[0]} (Portal)</span>
            ) : (
              <span>Sign In / Register</span>
            )}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 text-latte-warm hover:text-latte transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#2D211B] border-b border-latte/20 px-6 py-8 flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 animate-fade-in max-h-[85vh] overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={(e) => handleLinkClick(e, link.page)}
              className={`font-body text-base uppercase tracking-[0.2em] text-left transition-colors font-medium py-2 ${
                currentPage === link.page ? 'text-latte font-bold pl-2 border-l-2 border-latte' : 'text-latte/80 hover:text-latte-warm'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-4 border-t border-latte/15 flex flex-col gap-3">
            <button
              onClick={(e) => handleLinkClick(e, currentUser?.isAdmin ? 'admin' : 'auth')}
              className={`w-full py-3.5 rounded-full text-center font-body text-xs uppercase tracking-widest transition-all font-semibold ${
                currentUser?.isAdmin
                  ? 'bg-latte text-mocha'
                  : currentUser
                  ? 'bg-latte text-mocha'
                  : 'border border-latte/40 text-latte-warm hover:bg-latte hover:text-mocha'
              }`}
            >
              {currentUser?.isAdmin ? 'Admin Atelier' : currentUser ? `${currentUser.name} (Client Portal)` : 'Sign In / Register'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
