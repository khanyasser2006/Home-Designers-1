import { useEffect, useRef } from 'react';

export default function SpaceDetailModal({ space, onClose, onInquire }) {
  const modalContainerRef = useRef(null);

  useEffect(() => {
    if (!space) return;
    document.body.style.overflow = 'hidden';
    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTop = 0;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [space, onClose]);

  if (!space) return null;

  const handleInquireClick = () => {
    onClose();
    if (onInquire) {
      onInquire(space.name);
    }
  };

  return (
    <div
      ref={modalContainerRef}
      data-lenis-prevent="true"
      className="fixed inset-0 z-[100] bg-mocha-deep/95 backdrop-blur-xl overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-12 flex justify-center items-start animate-fade-in"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="relative w-full max-w-5xl bg-latte-cream text-mocha rounded-2xl overflow-hidden shadow-2xl border border-mocha/20 my-6 sm:my-10 animate-editorial-fade">
        {/* Modal Header */}
        <div className="bg-mocha-deep text-latte-warm px-8 py-5 flex items-center justify-between border-b border-latte/15 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-body text-[10px] uppercase tracking-widest text-latte/60">
              Spatial Dossier
            </span>
            <span className="text-latte/30">·</span>
            <span className="font-display text-sm text-latte-warm">
              {space.name}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full border border-latte/30 flex items-center justify-center text-latte hover:text-latte-warm hover:border-latte transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12">
          {/* Main Photo Banner — Crisp & Full */}
          <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[16/9] max-h-[460px] mb-8 bg-mocha group">
            <img
              src={space.image}
              alt={space.name}
              className="w-full h-full object-cover luxury-image-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mocha-deep/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-latte-warm">
              <span className="font-script text-2xl text-latte drop-shadow-md">
                {space.scriptTag || space.subtitle}
              </span>
              <h2 className="font-display text-3xl font-normal drop-shadow-md">{space.name}</h2>
            </div>
          </div>

          {/* Details & Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-mocha/60 block mb-2">
                Design Intent
              </span>
              <h3 className="font-display text-2xl text-mocha font-normal mb-3">
                {space.subtitle}
              </h3>
              <p className="font-body text-sm text-mocha/80 leading-relaxed font-light mb-6">
                {space.description}
              </p>
            </div>

            <div className="md:col-span-5 bg-latte-warm p-6 rounded-xl border border-mocha/10">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-mocha/60 block mb-4">
                Architectural Specifications
              </span>
              <div className="divide-y divide-mocha/10">
                {space.specs?.map((spec) => (
                  <div key={spec.label} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-body text-mocha/60 uppercase tracking-wider font-medium">
                      {spec.label}
                    </span>
                    <span className="font-display text-sm text-mocha font-normal">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleInquireClick}
                className="w-full mt-6 py-3.5 rounded-lg bg-mocha text-latte-warm font-body text-xs uppercase tracking-widest font-semibold hover:bg-mocha-deep transition-colors cursor-pointer"
              >
                Inquire on this Space →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
