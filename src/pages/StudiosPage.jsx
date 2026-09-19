import { useEffect } from 'react';
import { useStudioData } from '../context/StudioDataContext';

export default function StudiosPage({ onNavigate, onInquire }) {
  const { studios: ateliers } = useStudioData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-latte-cream text-mocha selection:bg-mocha selection:text-latte-warm pt-28 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Page Header */}
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
              Global Ateliers
            </span>
          </div>

          <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-mocha/70 block mb-3">
            Global Presence
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha font-normal leading-[1.05] tracking-tight">
            Our Studio <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha font-normal">Ateliers.</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-mocha/80 max-w-2xl font-light leading-relaxed mt-6">
            With dedicated studios in New York, Zurich, and London, our architects and interior specialists collaborate seamlessly across time zones to bring exceptional residences to life worldwide.
          </p>
        </div>

        {/* Studio Cards */}
        <div className="space-y-16 pt-16">
          {ateliers.map((atelier, idx) => (
            <div
              key={atelier.city}
              style={{ animationDelay: `${idx * 0.12}s` }}
              className="group p-8 sm:p-12 rounded-3xl bg-latte-warm border border-mocha/15 hover:border-mocha/40 transition-all duration-700 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center hover:shadow-2xl animate-editorial-fade"
            >
              {/* Left Photo */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-xl border border-mocha/15 aspect-[16/10] bg-mocha">
                <img
                  src={atelier.image}
                  alt={atelier.city}
                  className="w-full h-full object-cover luxury-image-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mocha-deep/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-latte-warm">
                  <span className="font-script text-xl text-latte">{atelier.neighborhood}</span>
                  <p className="font-display text-2xl font-normal">{atelier.city}</p>
                </div>
              </div>

              {/* Right Details */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h2 className="font-display text-3xl text-mocha font-normal">
                      {atelier.city}
                    </h2>
                    <span className="font-body text-xs text-mocha/60 uppercase tracking-widest font-semibold">
                      {atelier.neighborhood}
                    </span>
                  </div>

                  <p className="font-script text-xl text-mocha/80 mb-4">
                    Led by {atelier.lead}
                  </p>

                  <p className="font-body text-sm text-mocha/80 font-light leading-relaxed mb-6">
                    {atelier.desc}
                  </p>

                  <div className="space-y-2 mb-8">
                    {atelier.highlights?.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-mocha/80 font-light">
                        <span className="text-mocha font-semibold">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-mocha/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 font-light text-mocha/80">
                    <p className="font-medium text-mocha">{atelier.address}, {atelier.postal}</p>
                    <p>Phone: <a href={`tel:${atelier.contact?.phone || atelier.phone || '+1 (212) 555-0190'}`} className="hover:underline">{atelier.contact?.phone || atelier.phone || '+1 (212) 555-0190'}</a> · Email: <a href={`mailto:${atelier.contact?.email || atelier.email || 'studio@homedesigners.com'}`} className="hover:underline">{atelier.contact?.email || atelier.email || 'studio@homedesigners.com'}</a></p>
                  </div>

                  <button
                    onClick={() => onInquire(`Visiting ${atelier.city}`)}
                    className="px-6 py-2.5 rounded-full bg-mocha text-latte-warm font-body text-[11px] uppercase tracking-widest font-semibold hover:bg-mocha-deep transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    Book Atelier Visit →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
