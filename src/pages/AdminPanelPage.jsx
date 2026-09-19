import { useState, useEffect, useRef } from 'react';
import { useStudioData } from '../context/StudioDataContext';

export default function AdminPanelPage({ onNavigate, onLogoutAdmin }) {
  const {
    heroSettings,
    setHeroSettings,
    manifestoSettings,
    setManifestoSettings,
    materials,
    updateMaterial,
    testimonialSettings,
    setTestimonialSettings,
    projects,
    spaces,
    processSteps,
    studios,
    inquiries,
    addProject,
    updateProject,
    deleteProject,
    addSpace,
    updateSpace,
    deleteSpace,
    addProcessStep,
    updateProcessStep,
    deleteProcessStep,
    addStudio,
    updateStudio,
    deleteStudio,
    updateInquiryStatus,
    deleteInquiry,
    resetToDefaults,
  } = useStudioData();

  const [activeTab, setActiveTab] = useState('projects');
  const [notification, setNotification] = useState('');

  // Local Form Buffers for explicitly saving
  const [localHero, setLocalHero] = useState(heroSettings);
  const [localManifesto, setLocalManifesto] = useState(manifestoSettings);
  const [localTestimonial, setLocalTestimonial] = useState(testimonialSettings);
  const [editingProcessId, setEditingProcessId] = useState(null);
  const [editingProcessForm, setEditingProcessForm] = useState({});
  const [editingStudioId, setEditingStudioId] = useState(null);
  const [editingStudioForm, setEditingStudioForm] = useState({});
  const [editingMaterialNum, setEditingMaterialNum] = useState(null);
  const [editingMaterialForm, setEditingMaterialForm] = useState({});

  useEffect(() => {
    setLocalHero(heroSettings);
  }, [heroSettings]);

  useEffect(() => {
    setLocalManifesto(manifestoSettings);
  }, [manifestoSettings]);

  useEffect(() => {
    setLocalTestimonial(testimonialSettings);
  }, [testimonialSettings]);

  // Modals for CRUD
  const [editingProject, setEditingProject] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [isAddingSpace, setIsAddingSpace] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const notificationTimerRef = useRef(null);

  const triggerNotification = (msg) => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }
    setNotification(msg);
    notificationTimerRef.current = setTimeout(() => {
      setNotification('');
    }, 2400);
  };

  // Helper for Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    scriptSubtitle: '',
    location: '',
    area: '',
    year: '2025',
    category: 'Hillside Estate',
    image: '/cabinet_frames_600fps/frame_180.jpg',
    materials: 'Roman Travertine · Smoked Oak',
    quote: '',
    narrative: '',
  });

  const openAddProject = () => {
    setProjectForm({
      title: '',
      scriptSubtitle: '',
      location: 'Aspen, Colorado',
      area: '8,500 sq.ft.',
      year: '2025',
      category: 'Hillside Estate',
      image: '/cabinet_frames_600fps/frame_180.jpg',
      materials: 'Roman Travertine · European Smoked Oak',
      quote: 'A modern sanctuary designed around natural daylight and quiet comfort.',
      narrative: 'Designed around the natural path of mountain sunlight, panoramic horizons, and monolithic stone massing.',
    });
    setIsAddingProject(true);
  };

  const openEditProject = (proj) => {
    setProjectForm({ ...proj });
    setEditingProject(proj);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, projectForm);
      triggerNotification(`✓ Residence "${projectForm.title}" saved & published to live website!`);
      setEditingProject(null);
    } else {
      addProject(projectForm);
      triggerNotification(`✓ New residence "${projectForm.title}" saved & published to live website!`);
      setIsAddingProject(false);
    }
  };

  // Space Form State
  const [spaceForm, setSpaceForm] = useState({
    name: '',
    subtitle: '',
    scriptTag: '',
    image: '/cabinet_frames_600fps/frame_180.jpg',
    description: '',
  });

  const openAddSpace = () => {
    setSpaceForm({
      name: '',
      subtitle: 'Open layout with natural daylight',
      scriptTag: 'High ceilings & garden views',
      image: '/cabinet_frames_600fps/frame_280.jpg',
      description: 'A serene architectural room combining raw stone and textured oak.',
    });
    setIsAddingSpace(true);
  };

  const openEditSpace = (space) => {
    setSpaceForm({ ...space });
    setEditingSpace(space);
  };

  const handleSaveSpace = (e) => {
    e.preventDefault();
    if (editingSpace) {
      updateSpace(editingSpace.id, spaceForm);
      triggerNotification(`✓ Living space "${spaceForm.name}" saved to live website!`);
      setEditingSpace(null);
    } else {
      addSpace(spaceForm);
      triggerNotification(`✓ New living space "${spaceForm.name}" saved to live website!`);
      setIsAddingSpace(false);
    }
  };

  // Calculate Atelier Metrics
  const totalSqFt = projects.reduce((acc, p) => {
    const num = parseInt((p.area || '0').replace(/[^0-9]/g, '')) || 0;
    return acc + num;
  }, 0);

  // Real-time Registered Clients Count
  const [registeredUsersCount, setRegisteredUsersCount] = useState(1);

  useEffect(() => {
    const updateUsersCount = () => {
      try {
        const stored = localStorage.getItem('home_designers_users');
        if (stored) {
          setRegisteredUsersCount(JSON.parse(stored).length);
        }
      } catch (e) {
        console.warn(e);
      }
    };
    updateUsersCount();
    window.addEventListener('storage', updateUsersCount);
    return () => window.removeEventListener('storage', updateUsersCount);
  }, []);

  // ─── Drag-to-Slide Tabs Physics & Controls ───
  const tabsRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeftPos(tabsRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    const x = e.pageX - tabsRef.current.offsetLeft;
    const distance = Math.abs(x - startX);
    if (distance > 4) {
      setIsDragging(true);
      e.preventDefault();
      const walk = (x - startX) * 1.5;
      tabsRef.current.scrollLeft = scrollLeftPos - walk;
    }
  };

  const slideTabs = (dir) => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: dir === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  const tabs = [
    { id: 'projects', num: '01', label: 'Residences Portfolio', count: projects.length },
    { id: 'spaces', num: '02', label: 'Living Spaces', count: spaces.length },
    { id: 'process', num: '03', label: 'Design Methodology', count: processSteps.length },
    { id: 'studios', num: '04', label: 'Global Ateliers', count: studios.length },
    { id: 'hero', num: '05', label: 'Hero Headlines' },
    { id: 'manifesto', num: '06', label: 'Manifesto & Pillars' },
    { id: 'materials', num: '07', label: 'Noble Materials', count: materials.length },
    { id: 'testimonial', num: '08', label: 'Monograph Reviews' },
    { id: 'inquiries', num: '09', label: 'Client Inquiries', count: inquiries.length, alert: inquiries.length > 0 },
  ];

  return (
    <div className="min-h-screen bg-mocha-deep text-latte-warm selection:bg-latte selection:text-mocha pt-24 pb-32">
      {/* Archival Paper / Film Grain Overlay */}
      <div className="grain-overlay" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 relative z-10">
        
        {/* ─── Atelier Master Header & Status Bar ─── */}
        <div className="border-b border-latte/15 pb-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
            <div>
              <span className="font-body text-[11px] uppercase tracking-[0.25em] text-latte/70 block mb-2 font-medium">
                Studio Management & Live CMS
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-latte-warm tracking-tight">
                Architectural <span className="font-script text-5xl sm:text-6xl lg:text-7xl text-latte">Control Atelier.</span>
              </h1>
            </div>

            {/* Quick Header Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Save All / Live Sync Confirmation Button */}
              <button
                onClick={() => {
                  if (localHero) setHeroSettings(localHero);
                  if (localManifesto) setManifestoSettings(localManifesto);
                  if (localTestimonial) setTestimonialSettings(localTestimonial);
                  triggerNotification('✓ All studio data & changes saved and live across all devices!');
                }}
                className="px-6 py-2.5 rounded-full bg-latte text-mocha font-body text-xs uppercase tracking-widest font-semibold hover:bg-latte-warm transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <span>💾</span>
                <span>Save All Changes</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="px-5 py-2.5 rounded-full border border-latte/40 text-latte-warm font-body text-xs uppercase tracking-widest font-semibold hover:bg-latte hover:text-mocha transition-all duration-300 cursor-pointer"
              >
                View Live Website →
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset all website data to original studio factory defaults?')) {
                    resetToDefaults();
                    triggerNotification('All website data reset to factory defaults.');
                  }
                }}
                className="px-4 py-2.5 rounded-full border border-latte/25 text-xs font-body uppercase tracking-wider text-latte/75 hover:bg-latte/10 hover:text-latte-warm transition-colors cursor-pointer"
              >
                Reset Defaults
              </button>

              <button
                onClick={onLogoutAdmin}
                className="px-4 py-2.5 rounded-full border border-red-400/30 text-xs font-body uppercase tracking-wider text-red-200 hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* ─── 4 Real-Time Live Studio KPI Metrics (Increases Automatically) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-latte/10">
            {/* Block 1: Real Total Residences Live */}
            <div className="p-5 rounded-2xl bg-mocha/60 border border-latte/15 backdrop-blur-sm group hover:border-latte/40 transition-colors">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-1">
                Total Residences Live
              </span>
              <p className="font-display text-2xl sm:text-3xl text-latte-warm">
                {projects.length < 10 ? `0${projects.length}` : projects.length} <span className="text-xs font-body text-latte/60 font-light">Estates Published</span>
              </p>
              <span className="text-[10px] text-latte/50 font-body block mt-1">
                Increases on adding homes
              </span>
            </div>

            {/* Block 2: Real Curated Living Spaces */}
            <div className="p-5 rounded-2xl bg-mocha/60 border border-latte/15 backdrop-blur-sm group hover:border-latte/40 transition-colors">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-1">
                Curated Living Spaces
              </span>
              <p className="font-display text-2xl sm:text-3xl text-latte-warm">
                {spaces.length < 10 ? `0${spaces.length}` : spaces.length} <span className="text-xs font-body text-latte/60 font-light">Environments</span>
              </p>
              <span className="text-[10px] text-latte/50 font-body block mt-1">
                Active on landing matrix
              </span>
            </div>

            {/* Block 3: Real Incoming Client Briefs */}
            <div className="p-5 rounded-2xl bg-mocha/60 border border-latte/15 backdrop-blur-sm group hover:border-latte/40 transition-colors">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-1">
                Client Inquiries Inbox
              </span>
              <p className="font-display text-2xl sm:text-3xl text-latte-warm">
                {inquiries.length < 10 ? `0${inquiries.length}` : inquiries.length} <span className="text-xs font-body text-latte/60 font-light">Briefs Received</span>
              </p>
              <span className="text-[10px] text-latte/50 font-body block mt-1">
                Live from website contact forms
              </span>
            </div>

            {/* Block 4: Real Registered Client Dossiers */}
            <div className="p-5 rounded-2xl bg-mocha/60 border border-latte/15 backdrop-blur-sm group hover:border-latte/40 transition-colors">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-1">
                Registered VIP Clients
              </span>
              <p className="font-display text-2xl sm:text-3xl text-latte-warm">
                {registeredUsersCount < 10 ? `0${registeredUsersCount}` : registeredUsersCount} <span className="text-xs font-body text-latte/60 font-light">Client Portals</span>
              </p>
              <span className="text-[10px] text-latte/50 font-body block mt-1">
                Live registered portal users
              </span>
            </div>
          </div>
        </div>

        {/* Global Toast Notification */}
        {notification && (
          <div className="mb-6 p-4 rounded-2xl bg-mocha border border-latte/30 text-latte-warm text-xs font-body flex items-center justify-between shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-latte font-bold">✓</span>
              <span className="font-medium">{notification}</span>
            </div>
            <span className="text-[10px] text-latte/60 uppercase tracking-widest font-semibold">Real-Time Sync</span>
          </div>
        )}

        {/* ─── Drag-to-Slide Architectural Index Toolbar ─── */}
        <div className="relative pb-4 mb-8 border-b border-latte/15">
          {/* Left / Right Quick Slide Chevron Controls */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/50">
              Drag left or right to slide sections ‹ ›
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => slideTabs('left')}
                className="w-7 h-7 rounded-full bg-mocha border border-latte/20 flex items-center justify-center text-xs text-latte-warm hover:bg-latte hover:text-mocha transition-all cursor-pointer shadow-sm"
                title="Slide left"
              >
                ‹
              </button>
              <button
                onClick={() => slideTabs('right')}
                className="w-7 h-7 rounded-full bg-mocha border border-latte/20 flex items-center justify-center text-xs text-latte-warm hover:bg-latte hover:text-mocha transition-all cursor-pointer shadow-sm"
                title="Slide right"
              >
                ›
              </button>
            </div>
          </div>

          <div
            ref={tabsRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex items-center gap-2 overflow-x-auto select-none py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
              isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (!isDragging) {
                    setActiveTab(tab.id);
                  }
                }}
                className={`px-5 py-3 rounded-xl font-body text-xs uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer flex items-center gap-2 relative ${
                  activeTab === tab.id
                    ? 'bg-latte text-mocha font-semibold shadow-lg scale-102'
                    : 'bg-mocha/70 text-latte/70 hover:text-latte-warm hover:bg-mocha border border-latte/10'
                }`}
              >
                <span className="font-display text-xs opacity-60">{tab.num}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? 'bg-mocha text-latte font-bold'
                        : 'bg-latte/10 text-latte/70'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ─── TAB 1: RESIDENCES & PORTFOLIO ─── */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-latte/10">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal">
                  Residences Portfolio Catalog
                </h2>
                <p className="font-body text-xs text-latte/70 font-light mt-1">
                  Full CRUD management for private estates on the Home & Homes pages.
                </p>
              </div>
              <button
                onClick={openAddProject}
                className="px-6 py-3 rounded-full bg-latte text-mocha font-body text-xs uppercase tracking-widest font-semibold hover:bg-latte-warm transition-all duration-300 cursor-pointer shadow-lg self-start sm:self-auto flex items-center gap-2 hover:scale-105"
              >
                <span>+</span>
                <span>Commission New Residence</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-3xl bg-mocha/90 border border-latte/20 overflow-hidden flex flex-col justify-between group hover:border-latte/70 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-mocha-deep">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-mocha-deep/90 via-transparent to-transparent pointer-events-none" />
                      
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-mocha-deep/90 backdrop-blur-md text-[10px] uppercase tracking-widest font-semibold text-latte border border-latte/20">
                          {p.id}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-mocha-deep/90 backdrop-blur-md text-[10px] uppercase tracking-widest text-latte border border-latte/20">
                          {p.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 text-latte-warm">
                        <p className="font-script text-xl text-latte">{p.scriptSubtitle}</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h3 className="font-display text-2xl text-latte-warm font-normal">
                          {p.title}
                        </h3>
                        <span className="font-body text-xs text-latte/60">{p.year}</span>
                      </div>

                      <p className="font-body text-xs text-latte/70 font-light mb-3">
                        {p.location} · {p.area}
                      </p>

                      <p className="font-body text-xs text-latte/60 font-light line-clamp-2 leading-relaxed mb-4">
                        {p.narrative}
                      </p>

                      <div className="pt-3 border-t border-latte/10 text-[11px] text-latte/70 font-light">
                        <span className="text-latte font-medium">Materials: </span>
                        <span>{p.materials}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between gap-3">
                    <button
                      onClick={() => openEditProject(p)}
                      className="flex-1 py-2.5 rounded-xl bg-latte text-mocha text-xs font-body font-semibold uppercase tracking-wider hover:bg-latte-warm transition-colors cursor-pointer text-center"
                    >
                      Edit Monograph
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete residence "${p.title}"?`)) {
                          deleteProject(p.id);
                          triggerNotification(`Deleted ${p.title}`);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl border border-red-400/30 text-red-300 text-xs font-body uppercase tracking-wider hover:bg-red-950/40 cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 2: CURATED LIVING SPACES ─── */}
        {activeTab === 'spaces' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-latte/10">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal">
                  Curated Living Environments Matrix
                </h2>
                <p className="font-body text-xs text-latte/70 font-light mt-1">
                  Manage the interactive room tabs on the main landing page.
                </p>
              </div>
              <button
                onClick={openAddSpace}
                className="px-6 py-3 rounded-full bg-latte text-mocha font-body text-xs uppercase tracking-widest font-semibold hover:bg-latte-warm transition-all duration-300 cursor-pointer shadow-lg self-start sm:self-auto flex items-center gap-2"
              >
                <span>+</span>
                <span>Add Living Space</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {spaces.map((s) => (
                <div
                  key={s.id}
                  className="rounded-3xl bg-mocha/90 border border-latte/20 overflow-hidden flex flex-col justify-between group hover:border-latte/60 transition-all duration-500"
                >
                  <div>
                    <div className="relative aspect-[16/9] overflow-hidden bg-mocha-deep">
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-mocha-deep/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-mocha-deep/80 text-[10px] uppercase tracking-widest font-semibold text-latte border border-latte/20">
                        SPACE {s.num}
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="font-display text-2xl text-latte-warm font-normal mb-1">
                        {s.name}
                      </h3>
                      <p className="font-script text-2xl text-latte mb-3">
                        {s.scriptTag}
                      </p>
                      <p className="font-body text-xs text-latte/80 font-light leading-relaxed mb-6">
                        {s.description}
                      </p>

                      {s.specs && (
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-latte/10">
                          {s.specs.map((sp, i) => (
                            <div key={i} className="text-xs">
                              <span className="font-body text-[10px] uppercase tracking-wider text-latte/50 block">
                                {sp.label}
                              </span>
                              <span className="font-body text-latte-warm">{sp.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 pt-0 flex items-center justify-between gap-3">
                    <button
                      onClick={() => openEditSpace(s)}
                      className="flex-1 py-2.5 rounded-xl bg-latte text-mocha text-xs font-body font-semibold uppercase tracking-wider hover:bg-latte-warm cursor-pointer transition-colors"
                    >
                      Edit Space
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete living space "${s.name}"?`)) {
                          deleteSpace(s.id);
                          triggerNotification(`Deleted ${s.name}`);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl border border-red-400/30 text-red-300 text-xs font-body uppercase tracking-wider hover:bg-red-950/40 cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 3: DESIGN METHODOLOGY ─── */}
        {activeTab === 'process' && (
          <div className="space-y-8">
            <div className="pb-4 border-b border-latte/10">
              <h2 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal">
                Architectural 4-Phase Roadmap
              </h2>
              <p className="font-body text-xs text-latte/70 font-light mt-1">
                Update phases, milestone deliverables, and timelines across Home & Process pages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {processSteps.map((step) => {
                const isEditing = editingProcessId === step.id;
                return (
                  <div
                    key={step.id}
                    className="p-8 rounded-3xl bg-mocha/90 border border-latte/20 flex flex-col justify-between group hover:border-latte/60 transition-all duration-300"
                  >
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-latte/10">
                          <span className="font-display text-2xl text-latte">Phase {step.num} Editor</span>
                          <span className="text-xs text-latte/60">Editing</span>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Phase Title</label>
                          <input
                            type="text"
                            value={editingProcessForm.title || ''}
                            onChange={(e) => setEditingProcessForm({ ...editingProcessForm, title: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Cursive Subtitle</label>
                          <input
                            type="text"
                            value={editingProcessForm.scriptSubtitle || ''}
                            onChange={(e) => setEditingProcessForm({ ...editingProcessForm, scriptSubtitle: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Timeline</label>
                          <input
                            type="text"
                            value={editingProcessForm.timeline || ''}
                            onChange={(e) => setEditingProcessForm({ ...editingProcessForm, timeline: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={editingProcessForm.desc || ''}
                            onChange={(e) => setEditingProcessForm({ ...editingProcessForm, desc: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm resize-none"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              updateProcessStep(step.id, editingProcessForm);
                              setEditingProcessId(null);
                              triggerNotification(`✓ Phase "${editingProcessForm.title}" saved & published live!`);
                            }}
                            className="px-5 py-2 rounded-xl bg-latte text-mocha text-xs font-body font-semibold uppercase tracking-wider hover:bg-latte-warm cursor-pointer shadow-md"
                          >
                            💾 Save Phase Changes →
                          </button>
                          <button
                            onClick={() => setEditingProcessId(null)}
                            className="px-4 py-2 rounded-xl border border-latte/20 text-xs font-body uppercase text-latte/70 hover:bg-latte/10 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-latte/10">
                            <span className="font-display text-3xl text-latte">
                              {step.num}
                            </span>
                            <span className="font-body text-[11px] uppercase tracking-widest text-latte/80 bg-mocha-deep px-3 py-1 rounded-full border border-latte/20">
                              {step.timeline}
                            </span>
                          </div>

                          <h3 className="font-display text-2xl text-latte-warm font-normal mb-1">
                            {step.title}
                          </h3>
                          <p className="font-script text-2xl text-latte mb-4">
                            {step.scriptSubtitle}
                          </p>
                          <p className="font-body text-xs text-latte/80 font-light leading-relaxed mb-6">
                            {step.desc}
                          </p>

                          <div className="p-4 rounded-xl bg-mocha-deep/80 border border-latte/10 text-xs text-latte/80">
                            <span className="font-semibold text-latte block mb-1 uppercase tracking-wider text-[10px]">
                              Deliverable Matrix:
                            </span>
                            <span>{step.deliverable}</span>
                          </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-latte/10 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setEditingProcessId(step.id);
                              setEditingProcessForm({ ...step });
                            }}
                            className="px-5 py-2 rounded-xl bg-latte text-mocha text-xs font-body font-semibold uppercase tracking-wider hover:bg-latte-warm cursor-pointer"
                          >
                            Edit Phase Details
                          </button>
                          <span className="font-script text-lg text-latte/60">Milestone Validated</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB 4: GLOBAL ATELIERS ─── */}
        {activeTab === 'studios' && (
          <div className="space-y-8">
            <div className="pb-4 border-b border-latte/10">
              <h2 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal">
                Global Studio Ateliers
              </h2>
              <p className="font-body text-xs text-latte/70 font-light mt-1">
                Physical flagship locations, managing partners, and client visiting lines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {studios.map((s) => {
                const isEditing = editingStudioId === s.id;
                return (
                  <div
                    key={s.id}
                    className="rounded-3xl bg-mocha/90 border border-latte/20 overflow-hidden flex flex-col justify-between group hover:border-latte/60 transition-all duration-300"
                  >
                    {isEditing ? (
                      <div className="p-8 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-latte/10">
                          <span className="font-display text-xl text-latte">Edit {s.city}</span>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Managing Lead</label>
                          <input
                            type="text"
                            value={editingStudioForm.lead || editingStudioForm.partner || ''}
                            onChange={(e) => setEditingStudioForm({ ...editingStudioForm, lead: e.target.value, partner: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Address</label>
                          <input
                            type="text"
                            value={editingStudioForm.address || ''}
                            onChange={(e) => setEditingStudioForm({ ...editingStudioForm, address: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={editingStudioForm.phone || ''}
                            onChange={(e) => setEditingStudioForm({ ...editingStudioForm, phone: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Email</label>
                          <input
                            type="text"
                            value={editingStudioForm.email || ''}
                            onChange={(e) => setEditingStudioForm({ ...editingStudioForm, email: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => {
                              updateStudio(s.id, editingStudioForm);
                              setEditingStudioId(null);
                              triggerNotification(`✓ Atelier "${s.city}" contact details saved!`);
                            }}
                            className="px-4 py-2 rounded-xl bg-latte text-mocha text-xs font-body font-semibold uppercase tracking-wider hover:bg-latte-warm cursor-pointer shadow-md"
                          >
                            💾 Save Atelier Details →
                          </button>
                          <button
                            onClick={() => setEditingStudioId(null)}
                            className="px-3 py-2 rounded-xl border border-latte/20 text-xs font-body uppercase text-latte/70 hover:bg-latte/10 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="p-8">
                          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-latte/60 block mb-2 font-semibold">
                            Flagship Atelier
                          </span>
                          <h3 className="font-display text-3xl text-latte-warm font-normal mb-1">
                            {s.city}
                          </h3>
                          <p className="font-script text-2xl text-latte mb-4">
                            {s.lead || s.partner}
                          </p>

                          <div className="space-y-2 text-xs text-latte/80 font-light mb-6">
                            <p className="font-medium text-latte-warm">{s.address}</p>
                            <p>{s.postal}</p>
                            <p className="pt-2">Phone: <span className="text-latte">{s.phone}</span></p>
                            <p>Email: <span className="text-latte">{s.email}</span></p>
                          </div>

                          {s.highlights && (
                            <div className="space-y-1.5 pt-4 border-t border-latte/10 text-[11px] text-latte/70 font-light">
                              {s.highlights.map((h, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                  <span className="text-latte font-bold">•</span>
                                  <span>{h}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="p-8 pt-0 border-t border-latte/10 mt-4">
                          <button
                            onClick={() => {
                              setEditingStudioId(s.id);
                              setEditingStudioForm({ ...s });
                            }}
                            className="w-full py-2.5 rounded-xl bg-latte text-mocha text-xs font-body font-semibold uppercase tracking-wider hover:bg-latte-warm cursor-pointer transition-colors"
                          >
                            Edit Atelier Details
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB 5: HERO HEADLINES ─── */}
        {activeTab === 'hero' && (
          <div className="max-w-3xl space-y-6">
            <div className="pb-4 border-b border-latte/10">
              <h2 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal">
                Hero Video Sequence Typography
              </h2>
              <p className="font-body text-xs text-latte/70 font-light mt-1">
                Customize the titles, slogans, and stats overlaid on the 600-frame video hero.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setHeroSettings(localHero);
                triggerNotification('✓ Hero typography saved & published to live website!');
              }}
              className="p-8 rounded-3xl bg-mocha/90 border border-latte/20 space-y-6 shadow-2xl"
            >
              {/* Phrase 1 (0% -> 22% Scroll) */}
              <div className="space-y-4 pb-6 border-b border-latte/15">
                <span className="font-body text-[11px] uppercase tracking-widest text-latte font-semibold block">
                  Phrase 1 · Initial Hero Opening (0% Scroll)
                </span>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-medium">
                    Tagline Label
                  </label>
                  <input
                    type="text"
                    value={localHero.tagline || ''}
                    onChange={(e) => setLocalHero({ ...localHero, tagline: e.target.value })}
                    className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                  />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-medium">
                    Main Headline (Bodoni Moda)
                  </label>
                  <input
                    type="text"
                    value={localHero.title || ''}
                    onChange={(e) => setLocalHero({ ...localHero, title: e.target.value })}
                    className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                  />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-medium">
                    Cursive Slogan (Pinyon Script)
                  </label>
                  <input
                    type="text"
                    value={localHero.scriptSubtitle || ''}
                    onChange={(e) => setLocalHero({ ...localHero, scriptSubtitle: e.target.value })}
                    className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                  />
                </div>
              </div>

              {/* Phrase 2 (28% -> 54% Scroll) */}
              <div className="space-y-4 pb-6 border-b border-latte/15">
                <span className="font-body text-[11px] uppercase tracking-widest text-latte font-semibold block">
                  Phrase 2 · Mid-Sequence Transition (30% Scroll)
                </span>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-medium">
                    Tagline Label
                  </label>
                  <input
                    type="text"
                    value={localHero.tagline2 || '02 / Natural Materials'}
                    onChange={(e) => setLocalHero({ ...localHero, tagline2: e.target.value })}
                    className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                  />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-medium">
                    Main Headline (Bodoni Moda)
                  </label>
                  <input
                    type="text"
                    value={localHero.title2 || 'Real wood and stone,'}
                    onChange={(e) => setLocalHero({ ...localHero, title2: e.target.value })}
                    className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                  />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-medium">
                    Cursive Slogan (Pinyon Script)
                  </label>
                  <input
                    type="text"
                    value={localHero.scriptSubtitle2 || 'crafted to last.'}
                    onChange={(e) => setLocalHero({ ...localHero, scriptSubtitle2: e.target.value })}
                    className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                  />
                </div>
              </div>

              {/* Phrase 3 (62% -> 90% Scroll) */}
              <div className="space-y-4 pb-6 border-b border-latte/15">
                <span className="font-body text-[11px] uppercase tracking-widest text-latte font-semibold block">
                  Phrase 3 · Final Hero Climax (65% Scroll)
                </span>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-medium">
                    Tagline Label
                  </label>
                  <input
                    type="text"
                    value={localHero.tagline3 || '03 / Timeless Living'}
                    onChange={(e) => setLocalHero({ ...localHero, tagline3: e.target.value })}
                    className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                  />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-medium">
                    Main Headline (Bodoni Moda)
                  </label>
                  <input
                    type="text"
                    value={localHero.title3 || 'Comfortable spaces,'}
                    onChange={(e) => setLocalHero({ ...localHero, title3: e.target.value })}
                    className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                  />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-medium">
                    Cursive Slogan (Pinyon Script)
                  </label>
                  <input
                    type="text"
                    value={localHero.scriptSubtitle3 || 'made for your life.'}
                    onChange={(e) => setLocalHero({ ...localHero, scriptSubtitle3: e.target.value })}
                    className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                  />
                </div>
              </div>

              {/* Dedicated Save Hero Button */}
              <div className="pt-4 border-t border-latte/10 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-latte text-mocha text-xs font-body uppercase tracking-widest font-semibold hover:bg-latte-warm transition-all duration-300 cursor-pointer shadow-lg hover:scale-102 flex items-center gap-2"
                >
                  <span>💾</span>
                  <span>Save Hero Typography →</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── TAB 6: MANIFESTO & PILLARS ─── */}
        {activeTab === 'manifesto' && (
          <div className="max-w-3xl space-y-6">
            <div className="pb-4 border-b border-latte/10">
              <h2 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal">
                Studio Manifesto & Architectural Pillars
              </h2>
              <p className="font-body text-xs text-latte/70 font-light mt-1">
                Edit the studio philosophy copy and 3 core principles displayed on the Home page.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setManifestoSettings(localManifesto);
                triggerNotification('✓ Manifesto & principles saved & published live!');
              }}
              className="p-8 rounded-3xl bg-mocha/90 border border-latte/20 space-y-6 shadow-2xl"
            >
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-semibold">
                  Manifesto Title
                </label>
                <input
                  type="text"
                  value={localManifesto.title || ''}
                  onChange={(e) => setLocalManifesto({ ...localManifesto, title: e.target.value })}
                  className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-semibold">
                  Cursive Accent
                </label>
                <input
                  type="text"
                  value={localManifesto.scriptSubtitle || ''}
                  onChange={(e) => setLocalManifesto({ ...localManifesto, scriptSubtitle: e.target.value })}
                  className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-semibold">
                  Editorial Paragraph
                </label>
                <textarea
                  rows={3}
                  value={localManifesto.description || ''}
                  onChange={(e) => setLocalManifesto({ ...localManifesto, description: e.target.value })}
                  className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte resize-none"
                />
              </div>

              {/* Dedicated Save Manifesto Button */}
              <div className="pt-4 border-t border-latte/10 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-latte text-mocha text-xs font-body uppercase tracking-widest font-semibold hover:bg-latte-warm transition-all duration-300 cursor-pointer shadow-lg hover:scale-102 flex items-center gap-2"
                >
                  <span>💾</span>
                  <span>Save Manifesto Settings →</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── TAB 7: NOBLE MATERIALS ─── */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-latte/10">
              <h2 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal">
                Noble Materials Provenance Matrix
              </h2>
              <p className="font-body text-xs text-latte/70 font-light mt-1">
                Edit the 4 geological and timber specifications on the Home page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {materials.map((m) => {
                const isEditing = editingMaterialNum === m.num;
                return (
                  <div key={m.num} className="p-8 rounded-3xl bg-mocha/90 border border-latte/20 space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-2xl text-latte">Edit {m.name}</span>
                          <span className="text-xs text-latte/60">Specification {m.num}</span>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Origin City / Region</label>
                          <input
                            type="text"
                            value={editingMaterialForm.origin || ''}
                            onChange={(e) => setEditingMaterialForm({ ...editingMaterialForm, origin: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Geological Spec</label>
                          <input
                            type="text"
                            value={editingMaterialForm.spec || ''}
                            onChange={(e) => setEditingMaterialForm({ ...editingMaterialForm, spec: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-latte/60 block mb-1">Architectural Description</label>
                          <textarea
                            rows={3}
                            value={editingMaterialForm.description || ''}
                            onChange={(e) => setEditingMaterialForm({ ...editingMaterialForm, description: e.target.value })}
                            className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-3 py-2 text-sm text-latte-warm resize-none"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              updateMaterial(m.num, editingMaterialForm);
                              setEditingMaterialNum(null);
                              triggerNotification(`✓ Material "${m.name}" specification saved!`);
                            }}
                            className="px-5 py-2 rounded-xl bg-latte text-mocha text-xs font-body font-semibold uppercase tracking-wider hover:bg-latte-warm cursor-pointer shadow-md"
                          >
                            💾 Save Material Spec →
                          </button>
                          <button
                            onClick={() => setEditingMaterialNum(null)}
                            className="px-3 py-2 rounded-xl border border-latte/20 text-xs font-body uppercase text-latte/70 hover:bg-latte/10 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-3xl text-latte">{m.num}</span>
                          <span className="text-xs text-latte/60 uppercase tracking-widest">{m.origin}</span>
                        </div>
                        <h3 className="font-display text-2xl text-latte-warm">{m.name}</h3>
                        <p className="text-xs font-semibold text-latte/80 uppercase tracking-wider">{m.spec}</p>
                        <p className="text-xs text-latte/75 font-light leading-relaxed">{m.description}</p>
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setEditingMaterialNum(m.num);
                              setEditingMaterialForm({ ...m });
                            }}
                            className="px-5 py-2 rounded-xl bg-latte text-mocha text-xs font-body font-semibold uppercase tracking-wider hover:bg-latte-warm cursor-pointer transition-colors"
                          >
                            Edit Material Details
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB 8: MONOGRAPH REVIEWS ─── */}
        {activeTab === 'testimonial' && (
          <div className="max-w-3xl space-y-6">
            <div className="pb-4 border-b border-latte/10">
              <h2 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal">
                Editorial Review & Citations
              </h2>
              <p className="font-body text-xs text-latte/70 font-light mt-1">
                Manage the Architectural Digest testimonial on the landing page.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTestimonialSettings(localTestimonial);
                triggerNotification('✓ Editorial review saved & published live!');
              }}
              className="p-8 rounded-3xl bg-mocha/90 border border-latte/20 space-y-6 shadow-2xl"
            >
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-semibold">
                  Review Quote
                </label>
                <textarea
                  rows={3}
                  value={localTestimonial.quote || ''}
                  onChange={(e) => setLocalTestimonial({ ...localTestimonial, quote: e.target.value })}
                  className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte resize-none"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider text-latte/70 block mb-2 font-semibold">
                  Author / Publication
                </label>
                <input
                  type="text"
                  value={localTestimonial.author || ''}
                  onChange={(e) => setLocalTestimonial({ ...localTestimonial, author: e.target.value })}
                  className="w-full bg-mocha-deep border border-latte/20 rounded-xl px-4 py-3 text-sm text-latte-warm focus:outline-none focus:border-latte"
                />
              </div>

              {/* Dedicated Save Review Button */}
              <div className="pt-4 border-t border-latte/10 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-latte text-mocha text-xs font-body uppercase tracking-widest font-semibold hover:bg-latte-warm transition-all duration-300 cursor-pointer shadow-lg hover:scale-102 flex items-center gap-2"
                >
                  <span>💾</span>
                  <span>Save Editorial Review →</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── TAB 9: CLIENT INQUIRIES INBOX ─── */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-latte/10 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-latte-warm font-normal">
                  Live Client Commission Inquiries ({inquiries.length})
                </h2>
                <p className="font-body text-xs text-latte/70 font-light mt-1">
                  Real-time briefs submitted by visitors through the contact forms.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-8 rounded-3xl bg-mocha/90 border border-latte/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-latte/50 transition-all duration-300 shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-3xl text-latte-warm font-normal">
                        {inq.name}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-mocha-deep text-latte border border-latte/20">
                        {inq.type}
                      </span>
                      <span className="text-xs text-latte/50">
                        {new Date(inq.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-latte/75 font-light">
                      <span>Email: <a href={`mailto:${inq.email}`} className="underline text-latte font-medium">{inq.email}</a></span>
                      <span>·</span>
                      <span>Phone: {inq.phone || 'N/A'}</span>
                      <span>·</span>
                      <span>Site: {inq.location}</span>
                      <span>·</span>
                      <span>Timeline: {inq.timeline || 'Immediate'}</span>
                    </div>

                    <p className="font-body text-xs sm:text-sm text-latte/90 font-light leading-relaxed bg-mocha-deep/80 p-5 rounded-2xl border border-latte/10 max-w-4xl">
                      "{inq.message}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <select
                      value={inq.status}
                      onChange={(e) => {
                        updateInquiryStatus(inq.id, e.target.value);
                        triggerNotification(`✓ Inquiry status updated to ${e.target.value}`);
                      }}
                      className="bg-mocha-deep border border-latte/30 text-latte text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-latte cursor-pointer"
                    >
                      <option value="New Inquiry">New Inquiry</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Scheduled Consultation">Scheduled Consultation</option>
                      <option value="Archived">Archived</option>
                    </select>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete inquiry from ${inq.name}?`)) {
                          deleteInquiry(inq.id);
                          triggerNotification('Inquiry removed');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl border border-red-400/30 text-red-300 text-xs font-body uppercase tracking-wider hover:bg-red-950/40 cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ADD / EDIT PROJECT MODAL WITH LIVE SPLIT PREVIEW ─── */}
        {(isAddingProject || editingProject) && (
          <div className="fixed inset-0 z-[200] bg-mocha-deep/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
            <div className="bg-latte-cream text-mocha p-8 sm:p-12 rounded-3xl w-full max-w-5xl border border-mocha/20 shadow-2xl my-auto">
              <div className="flex items-center justify-between pb-6 border-b border-mocha/15 mb-6">
                <div>
                  <span className="font-body text-[10px] uppercase tracking-widest text-mocha/60 font-semibold block mb-1">
                    Architectural Monograph Drafter
                  </span>
                  <h3 className="font-display text-3xl text-mocha font-normal">
                    {editingProject ? 'Edit Residence Monograph' : 'Commission New Residence'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddingProject(false);
                    setEditingProject(null);
                  }}
                  className="w-9 h-9 rounded-full border border-mocha/30 flex items-center justify-center text-mocha hover:bg-mocha hover:text-latte-warm cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Form Controls */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                        Residence Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. The Aspen Ridge Compound"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha"
                      />
                    </div>

                    <div>
                      <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                        Cursive Subtitle *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alpine timber and heated granite"
                        value={projectForm.scriptSubtitle}
                        onChange={(e) => setProjectForm({ ...projectForm, scriptSubtitle: e.target.value })}
                        className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aspen, Colorado"
                        value={projectForm.location}
                        onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                        className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha"
                      />
                    </div>

                    <div>
                      <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                        Total Area
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 10,200 sq.ft."
                        value={projectForm.area}
                        onChange={(e) => setProjectForm({ ...projectForm, area: e.target.value })}
                        className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha"
                      />
                    </div>

                    <div>
                      <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                        Category
                      </label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha cursor-pointer"
                      >
                        <option value="Hillside Estate">Hillside Estate</option>
                        <option value="Lakeside Home">Lakeside Home</option>
                        <option value="Coastal Villa">Coastal Villa</option>
                        <option value="Alpine Lodge">Alpine Lodge</option>
                        <option value="Garden Home">Garden Home</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                      Image Frame URL *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/cabinet_frames_600fps/frame_180.jpg"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha"
                    />
                  </div>

                  <div>
                    <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                      Material Provenance Line
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Roman Travertine · European Smoked Oak"
                      value={projectForm.materials}
                      onChange={(e) => setProjectForm({ ...projectForm, materials: e.target.value })}
                      className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha"
                    />
                  </div>

                  <div>
                    <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                      Architectural Narrative
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe the architectural concept, solar orientation, materials..."
                      value={projectForm.narrative}
                      onChange={(e) => setProjectForm({ ...projectForm, narrative: e.target.value })}
                      className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha resize-none"
                    />
                  </div>
                </div>

                {/* Right Live Monograph Preview Card */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <span className="font-body text-[10px] uppercase tracking-widest text-mocha/60 font-semibold block mb-2">
                      Live Monograph Card Preview
                    </span>
                    <div className="rounded-2xl bg-mocha text-latte-warm overflow-hidden border border-mocha/20 shadow-xl p-5">
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-mocha-deep">
                        <img
                          src={projectForm.image || '/cabinet_frames_600fps/frame_180.jpg'}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-display text-xl text-latte-warm font-normal">
                        {projectForm.title || 'Untitled Residence'}
                      </h4>
                      <p className="font-script text-lg text-latte">
                        {projectForm.scriptSubtitle || 'Bespoke Architectural Villa'}
                      </p>
                      <p className="text-xs text-latte/70 font-light mt-1">
                        {projectForm.location || 'Location'} · {projectForm.area || 'Area'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="px-6 py-3 rounded-xl border border-mocha/20 text-xs font-body uppercase tracking-wider text-mocha hover:bg-mocha/10 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-xl bg-mocha text-latte-warm text-xs font-body uppercase tracking-widest font-semibold hover:bg-mocha-deep transition-all duration-300 cursor-pointer shadow-lg hover:scale-102 flex items-center gap-2"
                    >
                      <span>💾</span>
                      <span>Save Residence to Live Website →</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── ADD / EDIT SPACE MODAL ─── */}
        {(isAddingSpace || editingSpace) && (
          <div className="fixed inset-0 z-[200] bg-mocha-deep/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
            <div className="bg-latte-cream text-mocha p-8 sm:p-12 rounded-3xl w-full max-w-2xl border border-mocha/20 shadow-2xl my-auto">
              <div className="flex items-center justify-between pb-6 border-b border-mocha/15 mb-6">
                <h3 className="font-display text-3xl text-mocha font-normal">
                  {editingSpace ? 'Edit Living Environment' : 'Add New Living Environment'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingSpace(false);
                    setEditingSpace(null);
                  }}
                  className="w-9 h-9 rounded-full border border-mocha/30 flex items-center justify-center text-mocha hover:bg-mocha hover:text-latte-warm cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveSpace} className="space-y-6">
                <div>
                  <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Master Spa Suite"
                    value={spaceForm.name}
                    onChange={(e) => setSpaceForm({ ...spaceForm, name: e.target.value })}
                    className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha"
                  />
                </div>

                <div>
                  <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                    Cursive Tag
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deep soaking tub & garden deck"
                    value={spaceForm.scriptTag}
                    onChange={(e) => setSpaceForm({ ...spaceForm, scriptTag: e.target.value })}
                    className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha"
                  />
                </div>

                <div>
                  <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/cabinet_frames_600fps/frame_420.jpg"
                    value={spaceForm.image}
                    onChange={(e) => setSpaceForm({ ...spaceForm, image: e.target.value })}
                    className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha"
                  />
                </div>

                <div>
                  <label className="font-body text-xs font-semibold uppercase tracking-wider text-mocha/70 block mb-1">
                    Room Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe materials, lighting, layout..."
                    value={spaceForm.description}
                    onChange={(e) => setSpaceForm({ ...spaceForm, description: e.target.value })}
                    className="w-full bg-latte-warm border border-mocha/20 rounded-xl px-4 py-2.5 text-sm text-mocha focus:outline-none focus:border-mocha resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSpace(false);
                      setEditingSpace(null);
                    }}
                    className="px-6 py-2.5 rounded-xl border border-mocha/20 text-xs font-body uppercase tracking-wider text-mocha hover:bg-mocha/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-xl bg-mocha text-latte-warm text-xs font-body uppercase tracking-widest font-semibold hover:bg-mocha-deep transition-all duration-300 cursor-pointer shadow-lg hover:scale-102 flex items-center gap-2"
                  >
                    <span>💾</span>
                    <span>Save Living Space →</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
