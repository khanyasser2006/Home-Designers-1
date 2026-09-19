export default function Footer({ onNavigate, currentUser }) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e, pageKey) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(pageKey);
    }
  };

  return (
    <footer className="bg-mocha-deep text-latte-warm pt-20 pb-12 border-t border-latte/15">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-latte/10">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <button
              onClick={(e) => handleLinkClick(e, 'home')}
              className="text-left group cursor-pointer block mb-4"
            >
              <span className="font-display text-2xl tracking-[0.2em] uppercase text-latte-warm font-normal block">
                Home Designers
              </span>
              <span className="font-script text-xl text-latte/80 leading-none">
                Modern Architecture & Interior Design Studio
              </span>
            </button>
            <p className="font-body text-xs text-latte/70 font-light max-w-sm leading-relaxed mb-6">
              Sculpting bespoke residential sanctuaries worldwide. Rooted in natural daylight, authentic geological materials, and acoustic stillness.
            </p>
            <div className="flex items-center gap-4 text-xs text-latte/60 font-light">
              <span>New York</span>
              <span>·</span>
              <span>Zurich</span>
              <span>·</span>
              <span>London</span>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="md:col-span-3">
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/50 block mb-4 font-semibold">
              Architecture
            </span>
            <div className="flex flex-col gap-3 text-xs font-body uppercase tracking-[0.14em] text-latte/75">
              <button
                onClick={(e) => handleLinkClick(e, 'homes')}
                className="text-left hover:text-latte-warm transition-colors cursor-pointer"
              >
                All Residences
              </button>
              <button
                onClick={(e) => handleLinkClick(e, 'process')}
                className="text-left hover:text-latte-warm transition-colors cursor-pointer"
              >
                Design Process
              </button>
              <button
                onClick={(e) => handleLinkClick(e, 'studios')}
                className="text-left hover:text-latte-warm transition-colors cursor-pointer"
              >
                Global Studio Ateliers
              </button>
            </div>
          </div>

          {/* Nav Column 2 */}
          <div className="md:col-span-4">
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/50 block mb-4 font-semibold">
              Client Atelier & Press
            </span>
            <div className="flex flex-col gap-3 text-xs font-body uppercase tracking-[0.14em] text-latte/75">
              <button
                onClick={(e) => handleLinkClick(e, 'auth')}
                className="text-left hover:text-latte-warm transition-colors cursor-pointer font-medium text-latte"
              >
                {currentUser ? `Client Portal (${currentUser.name})` : 'Client Portal Sign In / Register'}
              </button>
              <button
                onClick={(e) => handleLinkClick(e, 'press')}
                className="text-left hover:text-latte-warm transition-colors cursor-pointer"
              >
                Press & Monograph
              </button>
              <button
                onClick={(e) => handleLinkClick(e, 'contact')}
                className="text-left hover:text-latte-warm transition-colors cursor-pointer"
              >
                Private Inquiries
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-latte/10 text-xs text-latte/60 font-light">
              <p>Direct Concierge: <a href="mailto:concierge@homedesigners.com" className="hover:text-latte-warm underline">concierge@homedesigners.com</a></p>
            </div>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] font-body text-latte/50 font-light">
          <p>© {currentYear} Home Designers Architecture & Design Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={(e) => handleLinkClick(e, 'auth')} className="hover:text-latte-warm cursor-pointer">
              Client Portal
            </button>
            <span>·</span>
            <button onClick={(e) => handleLinkClick(e, 'studios')} className="hover:text-latte-warm cursor-pointer">
              Studio Locations
            </button>
            <span>·</span>
            <button onClick={(e) => handleLinkClick(e, 'contact')} className="hover:text-latte-warm cursor-pointer">
              Inquire
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
