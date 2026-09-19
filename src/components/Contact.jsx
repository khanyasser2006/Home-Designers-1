import { useState, useEffect } from 'react';
import { useStudioData } from '../context/StudioDataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { sanitizeString, checkSubmissionRateLimit } from '../utils/security';

const COMMISSIONS = [
  'New Custom Home',
  'Waterfront Property',
  'Full Home Remodel',
  'Hillside Estate',
];

export default function Contact({ inquirySubject }) {
  const { studios, addInquiry } = useStudioData();
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedType, setSelectedType] = useState(COMMISSIONS[0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    message: '',
    website_trap: '', // Anti-bot honeypot field
  });
  useScrollReveal([]);

  // Pre-fill message if inquiry subject is provided
  useEffect(() => {
    if (inquirySubject) {
      setFormData((prev) => ({
        ...prev,
        message: `I would like to inquire about: ${inquirySubject}`,
      }));
    }
  }, [inquirySubject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Anti-bot honeypot check: If bot filled out invisible trap, silently drop
    if (formData.website_trap) {
      setSubmitted(true);
      return;
    }

    // 2. Client-side Rate Limit check (30s cooldown between submissions)
    const rateCheck = checkSubmissionRateLimit('inquiry_form');
    if (!rateCheck.allowed) {
      setErrorMessage(rateCheck.error);
      return;
    }

    const cleanName = sanitizeString(formData.name);
    const cleanEmail = sanitizeString(formData.email);
    const cleanLocation = sanitizeString(formData.location);
    const cleanMessage = sanitizeString(formData.message);

    if (!cleanName || !cleanEmail) {
      setErrorMessage('Please provide a valid name and email address.');
      return;
    }

    addInquiry({
      name: cleanName,
      email: cleanEmail,
      location: cleanLocation || 'Not specified',
      type: selectedType,
      message: cleanMessage,
    });

    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative bg-mocha text-latte-warm py-24 md:py-36 border-t border-latte/15 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <div className="reveal-init flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-16 border-b border-latte/15">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-latte block mb-3">
              Start Your Project
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-latte-warm leading-[1.08] tracking-tight">
              Build Your <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-latte block sm:inline font-normal">Dream Home.</span>
            </h2>
          </div>
          <p className="font-body text-xs sm:text-sm text-latte/80 max-w-md font-light leading-relaxed">
            Tell us about your property and vision. Our architects will get back to you within 24 hours to schedule a consultation.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-16">
          {/* Left: Inquiry Form */}
          <div className="reveal-init lg:col-span-7 bg-mocha-deep/95 p-8 sm:p-12 rounded-2xl border border-latte/20 shadow-2xl">
            <h3 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal mb-1">
              Project Inquiry
            </h3>
            <p className="font-script text-xl text-latte mb-8">
              Confidential · We respond within 1 business day
            </p>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-body">
                {errorMessage}
              </div>
            )}

            {submitted ? (
              <div className="p-8 rounded-xl bg-mocha border border-latte/30 text-center">
                <p className="font-display text-2xl text-latte-warm mb-2">
                  Message Received!
                </p>
                <p className="font-script text-2xl text-latte mb-3">
                  Thank you for reaching out
                </p>
                <p className="font-body text-xs text-latte/80 leading-relaxed font-light">
                  Our principal architect will review your project details and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Anti-Bot Invisible Honeypot */}
                <input
                  type="text"
                  name="website_trap"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_trap}
                  onChange={(e) => setFormData({ ...formData, website_trap: e.target.value })}
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                  aria-hidden="true"
                />

                {/* Pill Selectors */}
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/70 block mb-3 font-semibold">
                    Project Type
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {COMMISSIONS.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-full text-xs font-body tracking-wider transition-all duration-300 cursor-pointer ${
                          selectedType === type
                            ? 'bg-latte text-mocha font-semibold shadow-md'
                            : 'bg-mocha text-latte/70 hover:text-latte hover:bg-mocha/80 border border-latte/20'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minimalist Underline Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-2 font-semibold">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-latte/30 pb-2 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors font-light"
                    />
                  </div>

                  <div>
                    <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-2 font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={100}
                      placeholder="jane@domain.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-latte/30 pb-2 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-2 font-semibold">
                    Property Location / City
                  </label>
                  <input
                    type="text"
                    maxLength={120}
                    placeholder="e.g. Bel Air, CA or Lake Zurich, Switzerland"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-latte/30 pb-2 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors font-light"
                  />
                </div>

                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-2 font-semibold">
                    Tell Us About Your Vision
                  </label>
                  <textarea
                    rows={4}
                    maxLength={1500}
                    placeholder="Lot details, target timeline, architectural preferences..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-transparent border border-latte/20 rounded-xl p-4 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors font-light resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-latte text-mocha font-body text-xs uppercase tracking-[0.2em] font-semibold hover:bg-latte-warm transition-all duration-300 luxury-pill-btn cursor-pointer shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span>Submit Project Inquiry</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Studio Addresses & Direct Contact */}
          <div className="reveal-init delay-200 lg:col-span-5 flex flex-col justify-between space-y-12">
            <div>
              <span className="font-body text-xs uppercase tracking-[0.2em] text-latte/60 block mb-3 font-semibold">
                Direct Contact
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-latte-warm font-normal mb-6">
                Global Ateliers
              </h3>

              <div className="space-y-8">
                {studios.map((atelier) => (
                  <div key={atelier.city} className="pb-6 border-b border-latte/15">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-display text-xl text-latte-warm font-normal">
                        {atelier.city}
                      </p>
                      <span className="text-[10px] font-body uppercase tracking-widest text-latte/60 font-semibold">
                        {atelier.neighborhood}
                      </span>
                    </div>
                    <p className="font-body text-xs text-latte/70 font-light mb-2">
                      {atelier.address}, {atelier.postal}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-latte/80 font-light">
                      <span>Phone: <strong className="text-latte font-medium">{atelier.contact?.phone || atelier.phone || '+1 (212) 555-0190'}</strong></span>
                      <span>·</span>
                      <span>Email: <strong className="text-latte font-medium">{atelier.contact?.email || atelier.email || 'studio@homedesigners.com'}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-mocha-deep border border-latte/15 flex items-center justify-between">
              <div>
                <span className="font-body text-[10px] uppercase tracking-widest text-latte/60 block mb-1">
                  Confidentiality
                </span>
                <p className="font-body text-xs text-latte/90 font-light">
                  All client blueprints and site locations are protected under NDA.
                </p>
              </div>
              <span className="text-2xl opacity-60">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
