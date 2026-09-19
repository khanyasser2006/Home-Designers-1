import { useStudioData } from '../context/StudioDataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Philosophy() {
  const { manifestoSettings } = useStudioData();
  const tenets = manifestoSettings.pillars || [];
  useScrollReveal([manifestoSettings]);

  return (
    <section
      id="philosophy"
      className="relative bg-latte-cream py-24 md:py-36 border-b border-mocha/10 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header */}
        <div className="reveal-init flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-mocha/15">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-mocha/70 block mb-3">
              {manifestoSettings.tagline}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-mocha font-normal leading-[1.08] tracking-tight">
              {manifestoSettings.title} <br className="hidden sm:block" />
              <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha block sm:inline mt-1 sm:mt-0 font-normal">
                {manifestoSettings.scriptSubtitle}
              </span>
            </h2>
          </div>
          <p className="font-body text-sm md:text-base text-mocha/80 max-w-md leading-relaxed font-light">
            {manifestoSettings.description}
          </p>
        </div>

        {/* Core Layout: Visual + Editorial Tenets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-16 items-center">
          {/* Left: Architectural Interior Photography Plate */}
          <div className="reveal-left lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-mocha/15 group bg-mocha-deep">
              <img
                src="/cabinet_frames_600fps/frame_180.jpg"
                alt="Grand interior living room with double height glass windows and stone floors"
                className="w-full h-[440px] sm:h-[520px] object-cover luxury-image-zoom"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mocha-deep/85 via-mocha-deep/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-latte-warm">
                <div>
                  <p className="font-script text-xl text-latte">
                    Living Architecture
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-normal text-latte-warm">
                    The Bel Air Hillside Villa
                  </p>
                </div>
                <div className="border border-latte/30 px-3 py-1.5 rounded-full backdrop-blur-sm bg-mocha/40">
                  <span className="font-body text-[10px] uppercase tracking-widest text-latte-warm">
                    Completed 2025
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Typographic Tenets */}
          <div className="lg:col-span-6 flex flex-col justify-between divide-y divide-mocha/15">
            {tenets.map((tenet, i) => (
              <div
                key={tenet.num}
                style={{ transitionDelay: `${i * 120}ms` }}
                className="reveal-init py-8 first:pt-0 last:pb-0 group transition-all duration-300"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-lg text-mocha/50 group-hover:text-mocha transition-colors">
                      {tenet.num}
                    </span>
                    <h3 className="font-display text-2xl text-mocha font-normal group-hover:translate-x-1 transition-transform duration-300">
                      {tenet.title}
                    </h3>
                  </div>
                </div>
                <p className="font-script text-xl text-mocha/80 mb-2 pl-8">
                  {tenet.tag || tenet.scriptSubtitle}
                </p>
                <p className="font-body text-xs md:text-sm text-mocha/75 leading-relaxed font-light pl-8">
                  {tenet.desc || tenet.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
