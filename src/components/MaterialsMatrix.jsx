import { useState } from 'react';
import { useStudioData } from '../context/StudioDataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function MaterialsMatrix({ onSelectSpace }) {
  const { spaces } = useStudioData();
  const [activeSpace, setActiveSpace] = useState(0);
  const current = spaces[activeSpace] || spaces[0] || {};
  useScrollReveal([spaces, activeSpace]);

  const handleSpaceClick = () => {
    if (onSelectSpace && current) {
      onSelectSpace(current);
    }
  };

  return (
    <section
      className="relative bg-latte-cream py-24 md:py-36 border-b border-mocha/10 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <div className="reveal-init flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-16 border-b border-mocha/15">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-mocha/70 block mb-3">
              Spaces We Design
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-mocha leading-[1.08] tracking-tight">
              Curated <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha block sm:inline font-normal">Living Spaces.</span>
            </h2>
          </div>
          <p className="font-body text-sm text-mocha/75 max-w-md font-light leading-relaxed">
            Every room is designed with care, combining open layouts, natural daylight, and quiet comfort. Click on any room to examine its specifications.
          </p>
        </div>

        {/* Architectural Space Index */}
        <div className="flex items-center gap-8 md:gap-12 overflow-x-auto pt-10 pb-8 border-b border-mocha/10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {spaces.map((space, idx) => (
            <button
              key={space.id}
              onClick={() => setActiveSpace(idx)}
              className={`pb-4 text-left transition-all duration-300 relative shrink-0 cursor-pointer ${
                activeSpace === idx
                  ? 'text-mocha font-semibold'
                  : 'text-mocha/50 hover:text-mocha/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-sm opacity-70">
                  {space.num}
                </span>
                <span className="font-body text-xs uppercase tracking-[0.18em]">
                  {space.name}
                </span>
              </div>
              {activeSpace === idx && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-mocha animate-line-wipe" />
              )}
            </button>
          ))}
        </div>

        {/* Display Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-12">
          {/* Visual Showcase with Clickable Zoom / Modal */}
          <div
            className="reveal-scale lg:col-span-7 cursor-pointer"
            onClick={handleSpaceClick}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-mocha/15 group bg-mocha-deep">
              <img
                key={current.image}
                src={current.image}
                alt={current.name}
                className="w-full h-[420px] sm:h-[500px] object-cover luxury-image-zoom animate-editorial-fade"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mocha-deep/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-latte-warm">
                <div>
                  <span className="font-script text-2xl text-latte">
                    {current.scriptTag}
                  </span>
                  <p className="font-display text-2xl sm:text-3xl font-normal">{current.name}</p>
                </div>
                <span className="px-4 py-2 rounded-full bg-latte text-mocha font-body text-xs uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-lg">
                  Explore Room ↗
                </span>
              </div>
            </div>
          </div>

          {/* Architectural Specs & Description */}
          <div className="reveal-init lg:col-span-5 flex flex-col justify-between space-y-8 animate-editorial-fade" key={`text-${current.id}`}>
            <div>
              <span className="font-body text-[11px] uppercase tracking-[0.2em] text-mocha/60 block mb-2 font-semibold">
                Room Portfolio · Space {current.num}
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-mocha font-normal mb-3">
                {current.name}
              </h3>
              <p className="font-body text-sm text-mocha/80 font-light leading-relaxed mb-8">
                {current.description}
              </p>

              {/* Specifications List */}
              <div className="space-y-4 pt-6 border-t border-mocha/15">
                {current.specs?.map((spec, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-mocha/10">
                    <span className="text-mocha/70 font-light">{spec.label}</span>
                    <strong className="text-mocha font-medium">{spec.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSpaceClick}
              className="self-start px-6 py-3 rounded-full bg-mocha text-latte-warm font-body text-xs uppercase tracking-widest font-semibold hover:bg-mocha-deep transition-all duration-300 luxury-pill-btn cursor-pointer shadow-md flex items-center gap-2 group"
            >
              <span>View Full Room Dossier</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
