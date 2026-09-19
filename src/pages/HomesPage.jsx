import { useState, useEffect } from 'react';
import { useStudioData } from '../context/StudioDataContext';

export default function HomesPage({ onNavigate, onSelectProject, onInquire }) {
  const { projects } = useStudioData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ['All', 'Hillside Estate', 'Lakeside Home', 'Coastal Villa', 'Alpine Lodge', 'Waterfront Villa'];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    return (p.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
  }).sort((a, b) => {
    if (sortBy === 'size-desc') {
      return parseInt((b.area || '0').replace(/[^0-9]/g, '')) - parseInt((a.area || '0').replace(/[^0-9]/g, ''));
    }
    if (sortBy === 'size-asc') {
      return parseInt((a.area || '0').replace(/[^0-9]/g, '')) - parseInt((b.area || '0').replace(/[^0-9]/g, ''));
    }
    if (sortBy === 'year') {
      return parseInt(b.year || '0') - parseInt(a.year || '0');
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-latte-cream text-mocha selection:bg-mocha selection:text-latte-warm pt-28 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Page Header / Breadcrumbs */}
        <div className="pb-12 border-b border-mocha/15">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="font-body text-xs uppercase tracking-[0.2em] text-mocha/60 hover:text-mocha transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-mocha/30">/</span>
            <span className="font-body text-xs uppercase tracking-[0.2em] text-mocha font-semibold">
              Homes & Residences
            </span>
          </div>

          <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-mocha/70 block mb-3">
            Monograph Portfolio
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha font-normal leading-[1.05] tracking-tight">
            Selected <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-mocha font-normal">Residences.</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-mocha/80 max-w-2xl font-light leading-relaxed mt-6">
            A comprehensive catalog of custom residential estates conceived across North America, Europe, and Asia. Click on any project to explore its full architectural dossier, room layouts, and high-resolution photography.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-b border-mocha/10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-body tracking-wider transition-all duration-300 shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-mocha text-latte-warm font-semibold shadow-md'
                    : 'bg-latte-warm text-mocha/70 hover:text-mocha hover:bg-latte-warm/80 border border-mocha/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3">
            <span className="font-body text-[11px] uppercase tracking-wider text-mocha/60 font-medium">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-latte-warm border border-mocha/20 rounded-lg px-3 py-1.5 text-xs text-mocha focus:outline-none focus:border-mocha cursor-pointer"
            >
              <option value="featured">Featured Sequence</option>
              <option value="size-desc">Largest Area First</option>
              <option value="size-asc">Smallest Area First</option>
              <option value="year">Most Recent (Year)</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              style={{ animationDelay: `${idx * 0.08}s` }}
              className="group bg-mocha text-latte-warm rounded-2xl overflow-hidden border border-latte/15 hover:border-latte/70 transition-all duration-700 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl animate-editorial-fade"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-mocha-deep">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover luxury-image-zoom"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mocha-deep/80 via-transparent to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="font-body text-[10px] uppercase tracking-widest text-latte bg-mocha-deep/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-latte/20">
                    {project.id}
                  </span>
                  <span className="font-body text-[10px] uppercase tracking-widest text-latte bg-mocha-deep/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-latte/20">
                    {project.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-latte-warm">
                  <span className="font-script text-xl text-latte drop-shadow-md">
                    {project.scriptSubtitle}
                  </span>
                  <span className="font-body text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-latte text-mocha font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    Open Dossier ↗
                  </span>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-6 bg-mocha-deep flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-display text-2xl text-latte-warm font-normal group-hover:text-latte transition-colors">
                      {project.title}
                    </h3>
                    <span className="font-body text-xs text-latte/60">
                      {project.year}
                    </span>
                  </div>

                  <p className="font-body text-xs text-latte/70 font-light mb-4">
                    {project.location} · {project.area}
                  </p>

                  <p className="font-body text-xs text-latte/80 font-light leading-relaxed mb-6 line-clamp-2">
                    {project.narrative}
                  </p>
                </div>

                <div className="pt-4 border-t border-latte/10 flex items-center justify-between text-xs text-latte/60">
                  <span className="truncate max-w-[80%] font-light">
                    {project.materials}
                  </span>
                  <span className="text-latte group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Commission Box */}
        <div className="mt-24 p-10 sm:p-16 rounded-3xl bg-latte-warm border border-mocha/15 text-center flex flex-col items-center justify-center">
          <span className="font-body text-xs uppercase tracking-[0.25em] text-mocha/60 mb-3 block font-semibold">
            Custom Commission Inquiries
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-mocha font-normal leading-tight mb-4">
            Have a Specific Site in <span className="font-script text-4xl sm:text-5xl md:text-6xl text-mocha">Mind?</span>
          </h2>
          <p className="font-body text-xs sm:text-sm text-mocha/80 max-w-md font-light leading-relaxed mb-8">
            Whether you own a hillside property in California, a lakefront lot in Switzerland, or an alpine plot in Colorado, we invite your architectural brief.
          </p>
          <button
            onClick={() => onInquire('New Residence Commission')}
            className="px-8 py-4 rounded-xl bg-mocha text-latte-warm font-body text-xs uppercase tracking-[0.2em] font-semibold hover:bg-mocha-deep transition-colors cursor-pointer shadow-lg"
          >
            Submit Confidential Site Brief →
          </button>
        </div>
      </div>
    </div>
  );
}
