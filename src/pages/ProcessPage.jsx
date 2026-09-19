import { useState, useEffect } from 'react';
import { useStudioData } from '../context/StudioDataContext';

export default function ProcessPage({ onNavigate, onInquire }) {
  const { processSteps: steps } = useStudioData();
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      q: 'Where does your studio build residences?',
      a: 'We design and oversee private residences worldwide. Our active commissions currently span North America (California, New York, Colorado, Florida), Europe (Switzerland, Italy, UK), and Asia (Japan).',
    },
    {
      q: 'How long does a full custom home project take?',
      a: 'A typical ground-up bespoke residence takes between 18 to 26 months from initial site survey to final turnkey handover, depending on site complexity, local permitting, and construction scale.',
    },
    {
      q: 'Do you collaborate with local general contractors?',
      a: 'Yes. While our atelier provides complete architectural design, interior architecture, and direct material sourcing, we partner with premier local licensed builders and station an on-site project architect for quality control.',
    },
    {
      q: 'How do you handle material sourcing from Europe and Japan?',
      a: 'Our studio coordinates the entire logistics chain directly with generational quarries and joinery ateliers, handling custom fabrication, export documentation, and safe on-site delivery.',
    },
  ];

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
              Process & Methodology
            </span>
          </div>

          <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-mocha/70 block mb-3">
            Design Methodology
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha font-normal leading-[1.05] tracking-tight">
            The Journey of <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha font-normal">Creation.</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-mocha/80 max-w-2xl font-light leading-relaxed mt-6">
            From the initial walk across your empty land to the evening you turn the key in your new front door, our 4-phase architectural process guarantees clarity, transparency, and exquisite quality.
          </p>
        </div>

        {/* 4 Deep Process Steps */}
        <div className="space-y-16 pt-16">
          {steps.map((step, idx) => {
            const deliverableItems = Array.isArray(step.deliverables)
              ? step.deliverables
              : (step.deliverable || '')
                  .split('·')
                  .map((s) => s.trim())
                  .filter(Boolean);

            return (
              <div
                key={step.id || step.num}
                style={{ animationDelay: `${idx * 0.12}s` }}
                className="group p-8 sm:p-12 rounded-3xl bg-latte-warm border border-mocha/15 hover:border-mocha/40 transition-all duration-700 flex flex-col lg:flex-row justify-between gap-12 hover:shadow-2xl animate-editorial-fade"
              >
                {/* Left Column: Story & Numeral */}
                <div className="lg:w-7/12">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-display text-4xl sm:text-5xl text-mocha font-normal">
                      {step.num}
                    </span>
                    <div className="h-6 w-[1px] bg-mocha/20" />
                    <span className="font-body text-xs uppercase tracking-widest text-mocha/60 font-semibold">
                      {step.phase || `Phase 0${step.num}`} · {step.timeline}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-mocha font-normal mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    {step.title}
                  </h2>
                  <p className="font-script text-2xl text-mocha/80 mb-6">
                    {step.scriptSubtitle}
                  </p>

                  <p className="font-body text-sm sm:text-base text-mocha/80 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Right Column: Deliverables Box */}
                <div className="lg:w-5/12 bg-latte-cream p-8 rounded-2xl border border-mocha/10 flex flex-col justify-between">
                  <div>
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-mocha/60 block mb-4 font-semibold">
                      Phase Deliverables
                    </span>
                    <div className="space-y-3">
                      {deliverableItems.length > 0 ? (
                        deliverableItems.map((item, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2.5 text-xs text-mocha/80">
                            <span className="text-mocha font-bold">✓</span>
                            <span className="font-light">{item}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-mocha/70 font-light">Custom tailored phase specifications.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-mocha/10 flex items-center justify-between text-xs text-mocha/60">
                    <span className="font-body text-[10px] uppercase tracking-wider">
                      Client Sign-Off Milestone
                    </span>
                    <span className="font-script text-base text-mocha">
                      Atelier Quality Gate
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client FAQ Section */}
        <div className="pt-24 border-t border-mocha/15 mt-24">
          <div className="pb-12">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-mocha/60 block mb-2">
              Common Inquiries
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-mocha font-normal">
              Frequently Asked <span className="font-script text-3xl sm:text-4xl md:text-5xl text-mocha">Questions.</span>
            </h2>
          </div>

          <div className="divide-y divide-mocha/15 border-t border-mocha/15">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="py-6 cursor-pointer group"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-xl sm:text-2xl text-mocha font-normal group-hover:text-mocha-light transition-colors">
                    {faq.q}
                  </h3>
                  <span className="font-display text-2xl text-mocha/60 group-hover:text-mocha transition-colors">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </div>
                {activeFaq === idx && (
                  <p className="font-body text-sm sm:text-base text-mocha/80 font-light leading-relaxed pt-4 max-w-3xl animate-editorial-fade">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 p-10 sm:p-16 rounded-3xl bg-mocha text-latte-warm text-center flex flex-col items-center justify-center shadow-2xl">
          <span className="font-body text-xs uppercase tracking-[0.25em] text-latte/70 mb-3 block">
            Start Your Journey
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal leading-tight mb-4">
            Schedule a Private <span className="font-script text-4xl sm:text-5xl md:text-6xl text-latte">Consultation.</span>
          </h2>
          <p className="font-body text-xs sm:text-sm text-latte/80 max-w-md font-light leading-relaxed mb-8">
            Speak directly with our managing partners about your land, vision, and timeline.
          </p>
          <button
            onClick={() => onInquire('Process Consultation')}
            className="px-8 py-4 rounded-full bg-latte text-mocha font-body text-xs uppercase tracking-[0.2em] font-semibold hover:bg-latte-warm transition-all duration-300 luxury-pill-btn cursor-pointer shadow-lg"
          >
            Request Architectural Consultation →
          </button>
        </div>
      </div>
    </div>
  );
}
