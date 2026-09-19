import { useStudioData } from '../context/StudioDataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Process() {
  const { processSteps } = useStudioData();
  useScrollReveal([processSteps]);

  return (
    <section
      id="process"
      className="relative bg-mocha text-latte-warm py-24 md:py-36 border-b border-latte/15 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <div className="reveal-init flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-16 border-b border-latte/15">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-latte block mb-3">
              How We Work
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-latte-warm leading-[1.08] tracking-tight">
              Our Simple <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-latte block sm:inline font-normal">Design Process.</span>
            </h2>
          </div>
          <p className="font-body text-xs sm:text-sm text-latte/80 max-w-md font-light leading-relaxed">
            A clear, step-by-step journey from your first ideas to the day you move into your new home.
          </p>
        </div>

        {/* Editorial Process Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-x-10 pt-16">
          {processSteps.map((phase, i) => (
            <div
              key={phase.num}
              style={{ transitionDelay: `${i * 120}ms` }}
              className="reveal-init flex flex-col justify-between pt-6 border-t border-latte/20 group hover:border-latte transition-all duration-500 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-3xl text-latte/60 group-hover:text-latte transition-colors">
                    {phase.num}
                  </span>
                  <span className="font-body text-[10px] uppercase tracking-widest text-latte/70 font-medium">
                    {phase.timeline}
                  </span>
                </div>

                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-1 font-semibold">
                  {phase.step}
                </span>

                <h3 className="font-display text-2xl text-latte-warm font-normal mb-1 group-hover:translate-x-1 transition-transform duration-300">
                  {phase.title}
                </h3>

                <p className="font-script text-xl text-latte mb-4">
                  {phase.scriptSubtitle}
                </p>

                <p className="font-body text-xs text-latte/75 leading-relaxed font-light mb-8">
                  {phase.desc}
                </p>
              </div>

              {/* Deliverable Note */}
              <div className="pt-4 border-t border-latte/10">
                <span className="font-body text-[9px] uppercase tracking-widest text-latte/50 block mb-1 font-semibold">
                  What You Receive
                </span>
                <p className="font-body text-xs text-latte/90 font-light">
                  {phase.deliverable}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
