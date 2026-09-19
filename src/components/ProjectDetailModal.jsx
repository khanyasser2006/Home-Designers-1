import { useEffect, useState, useRef } from 'react';
import { PROJECTS } from '../data/projectsData';

export default function ProjectDetailModal({ project, onClose, onSelectProject, onInquire }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const modalContainerRef = useRef(null);

  // Reset active image and scroll to top when project changes
  useEffect(() => {
    setActiveImageIndex(0);
    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTop = 0;
    }
  }, [project]);

  // Lock body scroll and handle keyboard shortcuts
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  const handlePrev = () => {
    onSelectProject(prevProject);
  };

  const handleNext = () => {
    onSelectProject(nextProject);
  };

  const handleInquireClick = () => {
    onClose();
    if (onInquire) {
      onInquire(project.title);
    }
  };

  return (
    <div
      ref={modalContainerRef}
      data-lenis-prevent="true"
      className="fixed inset-0 z-[100] bg-mocha-deep/95 backdrop-blur-xl overflow-y-auto overflow-x-hidden"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Full Page Content Wrapper */}
      <div className="relative w-full min-h-full bg-latte-cream text-mocha selection:bg-mocha selection:text-latte-warm pb-24">
        {/* Floating Luxury Top Nav */}
        <header className="sticky top-0 z-50 bg-mocha-deep/98 backdrop-blur-md text-latte-warm border-b border-latte/15 px-6 sm:px-12 py-4 flex items-center justify-between shadow-2xl">
          <button
            onClick={onClose}
            className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-latte/80 hover:text-latte-warm transition-colors cursor-pointer group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Back to Atelier</span>
          </button>

          <div className="hidden md:flex items-center gap-3">
            <span className="font-body text-[11px] uppercase tracking-widest text-latte/60">
              {project.id}
            </span>
            <span className="text-latte/30">·</span>
            <span className="font-display text-sm text-latte-warm">
              {project.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleInquireClick}
              className="px-4 py-1.5 rounded-full bg-latte text-mocha font-body text-[11px] uppercase tracking-widest font-semibold hover:bg-latte-warm transition-colors cursor-pointer"
            >
              Inquire on Project
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-full border border-latte/30 flex items-center justify-center text-latte hover:text-latte-warm hover:border-latte transition-colors cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Main Monograph Content */}
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-8 md:pt-12">
          {/* Project Title Header */}
          <div className="pb-8 border-b border-mocha/15">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-mocha/70">
                {project.id} · {project.category}
              </span>
              <span className="font-body text-xs uppercase tracking-widest text-mocha/60">
                Completed {project.year} · {project.location}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-mocha font-normal leading-[1.08] tracking-tight">
              {project.title}
            </h1>
            <p className="font-script text-2xl sm:text-3xl md:text-4xl text-mocha/80 mt-1">
              {project.scriptSubtitle}
            </p>
          </div>

          {/* Featured Large Viewport Image — Fully Clear & Balanced */}
          <div className="pt-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-mocha/15 w-full h-[380px] sm:h-[480px] md:h-[580px] lg:h-[640px] bg-mocha">
              <img
                src={project.gallery[activeImageIndex]?.src || project.image}
                alt={project.gallery[activeImageIndex]?.caption || project.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mocha-deep/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-latte-warm">
                <p className="font-body text-xs sm:text-sm tracking-wide font-light drop-shadow-md">
                  {project.gallery[activeImageIndex]?.caption || project.title}
                </p>
                <span className="font-body text-xs text-latte/90 font-light drop-shadow-md">
                  {activeImageIndex + 1} / {project.gallery.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="flex items-center gap-3 sm:gap-4 mt-4 overflow-x-auto pb-4 pt-2 no-scrollbar">
              {project.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 sm:w-32 aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-mocha shadow-md scale-105 opacity-100'
                      : 'border-mocha/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Architectural Story & Specifications */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-12 border-t border-mocha/15 mt-8">
            {/* Left: Design Narrative */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-mocha/60 block mb-2">
                  Architectural Narrative
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-mocha font-normal mb-4">
                  Spatial Harmony & Topography
                </h2>
                <p className="font-body text-base text-mocha/80 leading-relaxed font-light mb-6">
                  {project.narrative}
                </p>
                <blockquote className="p-6 rounded-xl bg-latte-warm border-l-2 border-mocha italic font-serif text-lg text-mocha">
                  "{project.quote}"
                </blockquote>
              </div>

              {/* Key Features List */}
              <div className="pt-6">
                <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-mocha/60 block mb-4">
                  Signature Architectural Elements
                </span>
                <div className="space-y-3">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="font-script text-2xl text-mocha leading-none">•</span>
                      <p className="font-body text-sm text-mocha/80 font-light leading-relaxed">
                        {feat}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Detailed Specifications Matrix */}
            <div className="lg:col-span-5 bg-latte-warm p-8 rounded-2xl border border-mocha/15 flex flex-col justify-between">
              <div>
                <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-mocha/60 block mb-6">
                  Spatial Specifications
                </span>
                <div className="divide-y divide-mocha/15">
                  {project.specs.map((spec) => (
                    <div key={spec.label} className="py-3.5 flex items-center justify-between text-xs">
                      <span className="font-body text-mocha/60 uppercase tracking-wider font-medium">
                        {spec.label}
                      </span>
                      <span className="font-display text-sm text-mocha font-normal text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-mocha/15">
                <button
                  onClick={handleInquireClick}
                  className="w-full py-4 rounded-xl bg-mocha text-latte-warm font-body text-xs uppercase tracking-[0.2em] font-semibold hover:bg-mocha-deep transition-all duration-300 shadow-md cursor-pointer text-center"
                >
                  Commission Similar Residence →
                </button>
              </div>
            </div>
          </div>

          {/* Material Provenance Breakdown */}
          <div className="pt-16 mt-16 border-t border-mocha/15">
            <div className="pb-8">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-mocha/60 block mb-2">
                Material Palette
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-mocha font-normal">
                Authentic Material Provenance
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.materialsList.map((mat, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-latte-warm border border-mocha/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-mocha/10">
                      <span className="font-body text-[10px] uppercase tracking-widest text-mocha/50 font-semibold">
                        SPEC 0{idx + 1}
                      </span>
                      <span className="font-body text-[10px] uppercase tracking-wider text-mocha/70">
                        {mat.origin}
                      </span>
                    </div>
                    <h3 className="font-display text-lg text-mocha font-normal mb-1">
                      {mat.name}
                    </h3>
                    <p className="font-body text-xs text-mocha/75 font-light leading-relaxed">
                      {mat.use}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next / Previous Project Navigation Bar */}
          <div className="pt-16 mt-16 border-t border-mocha/15 flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={handlePrev}
              className="flex items-center gap-4 text-left group cursor-pointer"
            >
              <span className="font-display text-2xl text-mocha/40 group-hover:text-mocha group-hover:-translate-x-2 transition-all duration-300">
                ←
              </span>
              <div>
                <span className="font-body text-[10px] uppercase tracking-widest text-mocha/50 block">
                  Previous Project
                </span>
                <span className="font-display text-lg text-mocha font-normal group-hover:underline">
                  {prevProject.title}
                </span>
              </div>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-4 text-right group cursor-pointer"
            >
              <div>
                <span className="font-body text-[10px] uppercase tracking-widest text-mocha/50 block">
                  Next Project
                </span>
                <span className="font-display text-lg text-mocha font-normal group-hover:underline">
                  {nextProject.title}
                </span>
              </div>
              <span className="font-display text-2xl text-mocha/40 group-hover:text-mocha group-hover:translate-x-2 transition-all duration-300">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
