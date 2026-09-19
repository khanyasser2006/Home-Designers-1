import { useStudioData } from '../context/StudioDataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function StudioSignatureBar() {
  const { projects, studios } = useStudioData();
  useScrollReveal([projects, studios]);

  const stats = [
    {
      value: projects.length < 10 ? `0${projects.length}` : `${projects.length}`,
      unit: 'Residences',
      label: 'Bespoke Private Estates Completed',
    },
    {
      value: '14',
      unit: 'Global Awards',
      label: 'AIA & Architectural Digest Honors',
    },
    {
      value: '100%',
      unit: 'Natural Stone',
      label: 'Directly Quarried European Materials',
    },
    {
      value: studios.length < 10 ? `0${studios.length}` : `${studios.length}`,
      unit: 'Ateliers',
      label: 'New York · Zurich · London',
    },
  ];

  return (
    <section className="relative bg-mocha-deep border-t border-b border-latte/15 py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div
              key={stat.unit}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`reveal-init flex flex-col ${
                i !== 0 ? 'sm:border-l sm:border-latte/15 sm:pl-8 lg:pl-10' : ''
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-latte-warm tracking-tight"
                >
                  {stat.value}
                </span>
                <span
                  className="font-body text-xs md:text-sm uppercase text-latte tracking-widest font-semibold"
                >
                  {stat.unit}
                </span>
              </div>
              <p
                className="font-body text-xs md:text-sm text-latte/80 mt-2 font-light leading-relaxed"
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
