import { useState } from 'react';
import { useStudioData } from '../context/StudioDataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function FeaturedProjects({ onSelectProject }) {
  const { projects } = useStudioData();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  useScrollReveal([projects]);

  const handleCardClick = (project) => {
    if (onSelectProject) {
      onSelectProject(project);
    }
  };

  return (
    <section
      id="projects"
      className="relative bg-mocha text-latte-warm py-24 md:py-36 border-b border-latte/15 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header */}
        <div className="reveal-init flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 border-b border-latte/15">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-latte block mb-3">
              Our Work
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-latte-warm">
              Featured <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-latte block sm:inline font-normal">Homes.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-body text-xs sm:text-sm text-latte/80 max-w-sm font-light leading-relaxed">
              Explore our portfolio of custom private residences. Click on any residence to open its full architectural dossier and photo gallery.
            </p>
          </div>
        </div>

        {/* Asymmetric Monograph Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-16">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => handleCardClick(project)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ transitionDelay: `${idx * 140}ms` }}
              className={`reveal-init project-card ${project.width || 'lg:col-span-6'} group relative rounded-2xl overflow-hidden border transition-all duration-700 cursor-pointer bg-mocha-deep flex flex-col justify-between border-latte/20 hover:border-latte/70 hover:shadow-2xl hover:-translate-y-1.5`}
            >
              {/* Image Container */}
              <div className={`relative ${project.aspect || 'aspect-[16/10]'} overflow-hidden min-h-[300px] bg-mocha-deep`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover luxury-image-zoom"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mocha-deep via-mocha-deep/30 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                  <span className="font-body text-[11px] uppercase tracking-[0.2em] text-latte font-semibold bg-mocha-deep/80 backdrop-blur-md px-3 py-1 rounded-full border border-latte/20">
                    {project.id}
                  </span>
                  <span className="font-body text-[11px] uppercase tracking-[0.2em] text-latte font-semibold bg-mocha-deep/80 backdrop-blur-md px-3 py-1 rounded-full border border-latte/20">
                    {project.category}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-latte-warm pointer-events-none">
                  <div>
                    <span className="font-script text-2xl sm:text-3xl text-latte block mb-1 drop-shadow-md">
                      {project.scriptSubtitle}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-latte-warm font-normal">
                      {project.title}
                    </h3>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-latte text-mocha font-body text-xs uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                    <span>Open Dossier</span>
                    <span>↗</span>
                  </span>
                </div>
              </div>

              {/* Monograph Meta Strip */}
              <div className="p-5 sm:p-6 md:p-8 bg-mocha-deep/95 border-t border-latte/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-latte/80 font-light">
                  <span>Location: <strong className="text-latte font-medium">{project.location}</strong></span>
                  <span>Footprint: <strong className="text-latte font-medium">{project.area}</strong></span>
                  <span>Year: <strong className="text-latte font-medium">{project.year}</strong></span>
                </div>

                <span className="text-xs uppercase tracking-wider text-latte/90 font-medium group-hover:text-latte-warm transition-colors self-start sm:self-auto">
                  Examine Architecture →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
