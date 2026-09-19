import { useState, useEffect } from 'react';
import { useStudioData } from '../context/StudioDataContext';
import { sanitizeString, checkSubmissionRateLimit } from '../utils/security';

const COMMISSIONS = [
  'New Ground-Up Custom Home',
  'Waterfront Residence',
  'Alpine / Mountain Estate',
  'Full Historical Remodel',
  'Hillside Modern Villa',
];

const TIMELINES = [
  'Immediate (Ready to begin)',
  'Within 3 to 6 Months',
  'Within 6 to 12 Months',
  'Long-Term Site Planning',
];

export default function ContactPage({ onNavigate, inquirySubject }) {
  const { studios, addInquiry } = useStudioData();
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedType, setSelectedType] = useState(COMMISSIONS[0]);
  const [selectedTimeline, setSelectedTimeline] = useState(TIMELINES[0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: '',
    website_trap: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (inquirySubject) {
      setFormData((prev) => ({
        ...prev,
        message: `I would like to discuss a project commission related to: ${inquirySubject}`,
      }));
    }
  }, [inquirySubject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Anti-bot honeypot check
    if (formData.website_trap) {
      setSubmitted(true);
      return;
    }

    // Rate limiting check
    const rateCheck = checkSubmissionRateLimit('contact_page');
    if (!rateCheck.allowed) {
      setErrorMessage(rateCheck.error);
      return;
    }

    const cleanName = sanitizeString(formData.name);
    const cleanEmail = sanitizeString(formData.email);
    const cleanPhone = sanitizeString(formData.phone);
    const cleanLocation = sanitizeString(formData.location);
    const cleanMessage = sanitizeString(formData.message);

    if (!cleanName || !cleanEmail) {
      setErrorMessage('Please provide a valid name and email address.');
      return;
    }

    addInquiry({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      location: cleanLocation || 'Not specified',
      type: selectedType,
      timeline: selectedTimeline,
      message: cleanMessage,
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-latte-cream text-mocha selection:bg-mocha selection:text-latte-warm pt-28 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Breadcrumb Header */}
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
              Contact & Inquiries
            </span>
          </div>

          <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-mocha/70 block mb-3">
            Private Commissions
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha font-normal leading-[1.05] tracking-tight">
            Start Your <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha font-normal">Project.</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-mocha/80 max-w-2xl font-light leading-relaxed mt-6">
            We welcome conversations with discerning clients worldwide. Complete the brief below or contact our global ateliers in New York, Zurich, or London directly.
          </p>
        </div>

        {/* 2-Column Main Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-16">
          {/* Left: Private Commission Form */}
          <div className="lg:col-span-7 bg-mocha text-latte-warm p-8 sm:p-12 rounded-3xl border border-latte/20 shadow-2xl animate-editorial-fade">
            <span className="font-body text-xs uppercase tracking-[0.2em] text-latte/70 block mb-2 font-semibold">
              Confidential Site Brief
            </span>
            <h2 className="font-display text-3xl text-latte-warm font-normal mb-1">
              Private Commission Application
            </h2>
            <p className="font-script text-2xl text-latte mb-8">
              All inquiries are kept strictly confidential
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-mocha-deep border border-latte/30 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-latte/20 flex items-center justify-center text-latte text-2xl">
                  ✓
                </div>
                <h3 className="font-display text-3xl text-latte-warm font-normal">
                  Brief Received
                </h3>
                <p className="font-script text-2xl text-latte">
                  Thank you for entrusting us with your vision
                </p>
                <p className="font-body text-xs sm:text-sm text-latte/80 leading-relaxed font-light max-w-md mx-auto">
                  A managing partner from our studio will review your site details and contact you within 24 hours to arrange an initial architectural consultation.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-full border border-latte/30 text-xs uppercase tracking-widest text-latte hover:bg-latte hover:text-mocha transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-body leading-relaxed">
                    {errorMessage}
                  </div>
                )}
                {/* Project Type */}
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/70 block mb-3 font-semibold">
                    1. Project Classification
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
                            : 'bg-mocha-deep text-latte/70 hover:text-latte hover:bg-mocha-deep/80 border border-latte/20'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Timeline */}
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/70 block mb-3 font-semibold">
                    2. Desired Timeline
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {TIMELINES.map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setSelectedTimeline(time)}
                        className={`px-4 py-2 rounded-full text-xs font-body tracking-wider transition-all duration-300 cursor-pointer ${
                          selectedTimeline === time
                            ? 'bg-latte text-mocha font-semibold shadow-md'
                            : 'bg-mocha-deep text-latte/70 hover:text-latte hover:bg-mocha-deep/80 border border-latte/20'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-2 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Jenkins"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-latte/30 py-2.5 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-2 font-semibold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. david@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-latte/30 py-2.5 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-2 font-semibold">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (310) 555-0199"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-latte/30 py-2.5 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-2 font-semibold">
                      Property City / Country *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aspen, CO / Zurich, CH"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-latte/30 py-2.5 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-2 font-semibold">
                    Tell Us About Your Vision & Site *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your site, acreage, desired square footage, lifestyle requirements, or any particular architectural goals..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-latte/30 py-2.5 text-sm text-latte-warm placeholder-latte/30 focus:outline-none focus:border-latte transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-latte text-mocha font-body text-xs uppercase tracking-[0.2em] font-semibold hover:bg-latte-warm transition-all duration-300 shadow-xl cursor-pointer"
                >
                  Submit Commission Application →
                </button>
              </form>
            )}
          </div>

          {/* Right: Global Studios Directory */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <span className="font-body text-xs uppercase tracking-[0.2em] text-mocha/60 block mb-6 font-semibold">
                Global Ateliers
              </span>

              <div className="space-y-8">
                {studios.map((s) => (
                  <div
                    key={s.city}
                    className="p-8 rounded-2xl bg-latte-warm border border-mocha/10 flex flex-col justify-between group hover:border-mocha/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-2xl text-mocha font-normal">
                          {s.city}
                        </h3>
                        <span className="font-body text-[9px] uppercase tracking-widest text-mocha/50 font-semibold bg-latte-cream px-2 py-0.5 rounded-full border border-mocha/10">
                          Atelier
                        </span>
                      </div>
                      <p className="font-script text-lg text-mocha/80 mb-2">
                        {s.partner}
                      </p>
                      <p className="font-body text-xs text-mocha/70 font-light leading-relaxed mb-4">
                        {s.address}<br />
                        {s.postal}
                      </p>

                      <div className="space-y-1.5 text-xs text-mocha/80 font-light pt-4 border-t border-mocha/10">
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-mocha">Phone:</span>
                          <a href={`tel:${s.phone}`} className="hover:text-mocha transition-colors">
                            {s.phone}
                          </a>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-mocha">Email:</span>
                          <a href={`mailto:${s.email}`} className="hover:text-mocha transition-colors">
                            {s.email}
                          </a>
                        </p>
                        <p className="text-[11px] text-mocha/60 pt-1">
                          {s.hours}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Press / Concierge Desk */}
            <div className="p-8 rounded-2xl bg-latte-warm border border-mocha/15">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-mocha/60 block mb-1 font-semibold">
                Direct Private Concierge
              </span>
              <p className="font-display text-2xl text-mocha font-normal mb-1">
                concierge@homedesigners.com
              </p>
              <p className="font-body text-xs text-mocha/70 font-light">
                For confidential inquiries, land acquisitions, or private press matters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
