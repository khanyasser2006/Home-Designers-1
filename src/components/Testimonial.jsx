import { useStudioData } from '../context/StudioDataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Testimonial() {
  const { testimonialSettings } = useStudioData();
  useScrollReveal([testimonialSettings]);

  return (
    <section
      className="relative bg-latte-cream py-28 md:py-40 border-b border-mocha/10 overflow-hidden"
    >
      <div className="reveal-scale max-w-[1200px] mx-auto px-8 text-center">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-mocha/60 block mb-8">
          {testimonialSettings.tagline || 'Client Story'}
        </span>

        {/* Editorial Quote */}
        <blockquote className="my-8 max-w-4xl mx-auto">
          <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-mocha font-normal leading-[1.3] tracking-tight">
            "{testimonialSettings.quote}" <span className="font-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-mocha block sm:inline mt-1 sm:mt-0 font-normal">{testimonialSettings.scriptSubtitle}</span>
          </p>
        </blockquote>

        {/* Attribution & Provenance */}
        <div className="mt-12 flex flex-col items-center">
          <div className="w-12 h-[1px] bg-mocha/20 mb-6" />
          <p className="font-script text-3xl text-mocha font-normal">
            {testimonialSettings.author}
          </p>
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-mocha/60 mt-1">
            Bel Air Hillside Residence · Monograph Edition
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-mocha/15 bg-latte-warm text-[10px] font-body uppercase tracking-widest text-mocha/70 hover:border-mocha/40 transition-colors shadow-sm">
            <span>{testimonialSettings.badge || 'Verified Monograph Review'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
