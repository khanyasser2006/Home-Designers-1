import { useEffect } from 'react';
import { useStudioData } from '../context/StudioDataContext';

export default function PressPage({ onNavigate, onInquire }) {
  const { pressArticles: articles } = useStudioData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-latte-cream text-mocha selection:bg-mocha selection:text-latte-warm pt-28 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Breadcrumbs Header */}
        <div className="pb-16 border-b border-mocha/15">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="font-body text-xs uppercase tracking-[0.2em] text-mocha/60 hover:text-mocha transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-mocha/30">/</span>
            <span className="font-body text-xs uppercase tracking-[0.2em] text-mocha font-semibold">
              Press & Publications
            </span>
          </div>

          <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-mocha/70 block mb-3">
            Monograph & Media
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha font-normal leading-[1.05] tracking-tight">
            Press & <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha font-normal">Publications.</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-mocha/80 max-w-2xl font-light leading-relaxed mt-6">
            Explore editorial features, monograph publications, and design awards honoring our studio’s residential commissions.
          </p>
        </div>

        {/* Press Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16">
          {articles.map((art) => (
            <div
              key={art.title}
              className="p-8 sm:p-10 rounded-3xl bg-latte-warm border border-mocha/15 flex flex-col justify-between group hover:border-mocha transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-mocha/10">
                  <span className="font-body text-xs uppercase tracking-widest text-mocha font-semibold">
                    {art.pub}
                  </span>
                  <span className="font-body text-[10px] uppercase tracking-wider text-mocha/60">
                    {art.issue}
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl text-mocha font-normal mb-4 leading-snug">
                  {art.title}
                </h2>

                <blockquote className="p-6 rounded-2xl bg-latte-cream border-l-2 border-mocha italic font-serif text-base text-mocha/90 mb-6">
                  "{art.quote}"
                </blockquote>
              </div>

              <div className="flex items-center justify-between text-xs text-mocha/60 pt-4 border-t border-mocha/10">
                <span className="font-light">{art.author}</span>
                <span className="font-script text-lg text-mocha">Archival Feature</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Press Inquiry Box */}
        <div className="mt-24 p-10 sm:p-16 rounded-3xl bg-mocha text-latte-warm text-center flex flex-col items-center justify-center">
          <span className="font-body text-xs uppercase tracking-[0.25em] text-latte/70 mb-3 block">
            Media & Monograph Relations
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal leading-tight mb-4">
            Press & Editorial <span className="font-script text-4xl sm:text-5xl md:text-6xl text-latte">Inquiries.</span>
          </h2>
          <p className="font-body text-xs sm:text-sm text-latte/80 max-w-md font-light leading-relaxed mb-8">
            For high-resolution photography requests, monograph copies, or interview inquiries with our principals.
          </p>
          <button
            onClick={() => onInquire('Press & Editorial Inquiry')}
            className="px-8 py-4 rounded-xl bg-latte text-mocha font-body text-xs uppercase tracking-[0.2em] font-semibold hover:bg-latte-warm transition-colors cursor-pointer shadow-lg"
          >
            Contact Press Desk →
          </button>
        </div>
      </div>
    </div>
  );
}
