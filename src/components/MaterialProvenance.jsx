import { useStudioData } from '../context/StudioDataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function MaterialProvenance({ onNavigate }) {
  const { materials } = useStudioData();
  useScrollReveal([materials]);

  return (
    <section
      className="relative bg-mocha-deep text-latte-warm py-24 md:py-36 border-t border-b border-latte/15 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header */}
        <div className="reveal-init flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 border-b border-latte/15">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-latte block mb-3">
              Material Sourcing
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-latte-warm">
              Natural Materials, <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-latte block sm:inline font-normal">True Quality.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-body text-xs sm:text-sm text-latte/80 max-w-sm font-light leading-relaxed">
              We travel to source raw stone, timber, and metal directly from generational quarries and master craft workshops in Europe and Japan.
            </p>
            {onNavigate && (
              <button
                onClick={() => onNavigate('homes')}
                className="hidden sm:inline-flex px-6 py-3 rounded-full border border-latte/30 text-latte text-xs font-body uppercase tracking-widest font-semibold hover:bg-latte hover:text-mocha transition-all duration-300 luxury-pill-btn cursor-pointer whitespace-nowrap"
              >
                View Built Residences →
              </button>
            )}
          </div>
        </div>

        {/* 4 Materials Monograph Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pt-16">
          {materials.map((mat, i) => (
            <div
              key={mat.id || mat.num}
              style={{ transitionDelay: `${i * 120}ms` }}
              className="reveal-init material-item group pt-8 border-t border-latte/20 flex flex-col justify-between hover:border-latte transition-all duration-500 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-2xl text-latte/60 group-hover:text-latte transition-colors">
                    {mat.num}
                  </span>
                  <span className="font-body text-[10px] uppercase tracking-widest text-latte/60">
                    {mat.origin}
                  </span>
                </div>

                <h3 className="font-display text-2xl text-latte-warm font-normal mb-1 group-hover:translate-x-1 transition-transform duration-300">
                  {mat.name}
                </h3>

                <p className="font-script text-xl text-latte mb-4">
                  {mat.spec || mat.scriptTag || 'Natural Material Spec'}
                </p>

                <p className="font-body text-xs text-latte/80 leading-relaxed font-light mb-6">
                  {mat.description || mat.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-latte/10 text-[10px] uppercase tracking-widest text-latte/50 font-semibold group-hover:text-latte transition-colors">
                Authentic Spec · Grade A
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
