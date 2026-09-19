import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/projectsData';
import {
  sanitizeString,
  sanitizeUrl,
  safeLocalStorageSet,
  safeLocalStorageGet,
} from '../utils/security';

const StudioDataContext = createContext();

const DEFAULT_HERO_SETTINGS = {
  tagline: '01 / MODERN ARCHITECTURE',
  title: 'We design homes that',
  scriptSubtitle: 'feel open, and full of light.',
  stat1: '100% Bespoke Residential Architecture',
  stat2: '200+ Quarried Stone Slabs Sourced',
  stat3: '14 International Design Awards',
};

const DEFAULT_MANIFESTO_SETTINGS = {
  tagline: 'OUR PHILOSOPHY',
  title: 'We design homes around how you',
  scriptSubtitle: 'truly live.',
  description:
    'A great home is more than just beautiful walls. It should bring in natural sunlight, stay peaceful, and feel comfortable every single day.',
  photo: '/cabinet_frames_600fps/frame_180.jpg',
  pillars: [
    {
      num: '01',
      tag: 'Sunlight all day',
      title: 'Natural Light & Views',
      desc: "We position every room to follow the sun's natural path, bringing warm daylight and outdoor garden views deep into living spaces.",
    },
    {
      num: '02',
      tag: 'Built to last',
      title: 'Real, Honest Materials',
      desc: 'We use solid natural stone, hand-finished oak wood, and authentic metals that look better and richer as time goes by.',
    },
    {
      num: '03',
      tag: 'Quiet & peaceful',
      title: 'Peaceful Acoustic Comfort',
      desc: 'We design thick, sound-insulated walls and high ceilings so your home stays quiet, calming, and restful for your family.',
    },
  ],
};

const DEFAULT_MATERIALS = [
  {
    num: '01',
    name: 'Italian Travertine',
    origin: 'Tivoli, Italy',
    spec: 'Hand-Cut Natural Stone',
    description: 'Durable, warm limestone with natural texture, selected for indoor flooring and outdoor sun terraces.',
  },
  {
    num: '02',
    name: 'European Oak',
    origin: 'Black Forest, Germany',
    spec: 'Quarter-Sawn Solid Wood',
    description: 'Slow-grown alpine timber that adds natural warmth, acoustic quiet, and enduring character to every room.',
  },
  {
    num: '03',
    name: 'Italian Marble',
    origin: 'Carrara, Italy',
    spec: 'Polished Natural Stone',
    description: 'Rare white and grey marble with distinctive veining, carved into monolithic kitchen islands and bath suites.',
  },
  {
    num: '04',
    name: 'Solid Bronze',
    origin: 'Kyoto, Japan',
    spec: 'Hand-Finished Metal',
    description: 'Heavy solid architectural bronze that feels substantial in hand and naturally develops a deep patina over time.',
  },
];

const DEFAULT_TESTIMONIAL_SETTINGS = {
  tagline: 'ARCHITECTURAL MONOGRAPH',
  quote:
    'Julian Vance and his team have created a masterpiece in stone and light. The spaces feel grand yet intimate, modern yet timeless.',
  scriptSubtitle: 'A quiet, enduring sanctuary.',
  author: 'Architectural Digest · Monograph Feature',
  badge: 'Global Architecture Award Winner · 2025',
};

const DEFAULT_PRESS_ARTICLES = [
  {
    pub: 'Architectural Digest',
    issue: 'Cover Story · Fall 2025',
    title: 'The Monastic Sanctuary on the Ridge: Julian Vance’s Bel Air Villa',
    quote: 'An astonishing achievement in stone and light that redefines the modern California hillside residence.',
    author: 'Written by Samantha Reed',
  },
  {
    pub: 'Rizzoli International',
    issue: 'Monograph Publication · 2024',
    title: 'Home Designers: Selected Works & Material Provenance 2015–2025',
    quote: 'A 320-page hardcover volume exploring the studio’s direct quarry relationships and architectural discipline.',
    author: 'Foreword by Kenneth Frampton',
  },
  {
    pub: 'Elle Decor International',
    issue: 'Architecture Feature · Spring 2024',
    title: 'Quiet Architecture: The Alpine Lake House by Home Designers',
    quote: 'Heavy alpine quartzite paired with floating glass in a masterclass of restraint.',
    author: 'Written by Marc Delacroix',
  },
  {
    pub: 'Wallpaper* Magazine',
    issue: 'Design Awards Winner · 2024',
    title: 'Best Private Residence: The Kyoto Garden Compound',
    quote: 'Seamless synthesis of traditional Japanese timber joinery and contemporary spatial flow.',
    author: 'Jury Citation',
  },
];

const DEFAULT_SPACES = [
  {
    id: 'living',
    num: '01',
    name: 'The Great Living Room',
    scriptTag: 'High ceilings and garden views',
    subtitle: 'Open layout with natural light all day',
    image: '/cabinet_frames_600fps/frame_180.jpg',
    specs: [
      { label: 'Ceiling Height', value: '18 Feet' },
      { label: 'Fireplace', value: 'Natural Italian Stone' },
      { label: 'Windows', value: 'Floor-to-Ceiling Glass' },
      { label: 'Flooring', value: 'Warm European Oak' },
    ],
    description:
      'Designed to open directly to the garden. Large motorized sliding glass doors let in fresh air and sunlight from morning to evening.',
  },
  {
    id: 'culinary',
    num: '02',
    name: 'The Modern Kitchen',
    scriptTag: 'Natural marble island',
    subtitle: 'Clean layout with hidden storage and pantry',
    image: '/cabinet_frames_600fps/frame_280.jpg',
    specs: [
      { label: 'Kitchen Island', value: 'Solid White Marble' },
      { label: 'Cabinets', value: 'Custom Smoked Oak' },
      { label: 'Hardware', value: 'Solid Bronze Metal' },
      { label: 'Pantry', value: 'Walk-in Storage Room' },
    ],
    description:
      'A clean, functional kitchen where everything has its place. Modern appliances are hidden inside seamless custom wood millwork.',
  },
  {
    id: 'sanctuary',
    num: '03',
    name: 'The Master Bedroom',
    scriptTag: 'Private restful suite',
    subtitle: 'Quiet soundproofing and sunset balcony',
    image: '/cabinet_frames_600fps/frame_420.jpg',
    specs: [
      { label: 'Soundproofing', value: 'Quiet insulated walls' },
      { label: 'Private Balcony', value: 'Outdoor Sunset Deck' },
      { label: 'Bathroom', value: 'Freestanding Soaking Tub' },
      { label: 'Lighting', value: 'Soft warm lighting' },
    ],
    description:
      'A peaceful private bedroom designed for rest. Warm textured walls, sound-insulated glass, and direct access to a private morning garden deck.',
  },
  {
    id: 'outdoor',
    num: '04',
    name: 'The Pool & Garden Patio',
    scriptTag: 'Outdoor living all year round',
    subtitle: 'Swimming pool, outdoor fireplace, and garden lounge',
    image: '/cabinet_frames_600fps/frame_580.jpg',
    specs: [
      { label: 'Swimming Pool', value: '75-Foot Lap Pool' },
      { label: 'Patio Stone', value: 'Non-slip natural granite' },
      { label: 'Fireplace', value: 'Built-in outdoor hearth' },
      { label: 'Landscaping', value: 'Green lawn & olive trees' },
    ],
    description:
      'An expansive outdoor terrace with recessed heating, architectural evening lighting, and natural greenery for relaxing with family and guests.',
  },
];

const DEFAULT_PROCESS_STEPS = [
  {
    id: 'step-01',
    num: '01',
    step: 'Step 1',
    phase: 'Phase 01 · Discovery & Topography',
    title: 'Understanding Your Needs',
    scriptSubtitle: 'Planning the light and views',
    timeline: 'Weeks 1 – 4',
    deliverable: 'Sunlight Study · Property Map · Initial Layout Ideas',
    desc: 'We visit your land, understand your daily lifestyle, and plan how natural sunlight will enter every room.',
  },
  {
    id: 'step-02',
    num: '02',
    step: 'Step 2',
    phase: 'Phase 02 · Concept & 3D Spatial Prototyping',
    title: '3D Design & Floor Plans',
    scriptSubtitle: "See your home before it's built",
    timeline: 'Weeks 5 – 12',
    deliverable: '3D Digital Tour · Physical Material Samples · Floor Plans',
    desc: 'We create realistic 3D models and show you real material samples so you can see and feel your home before building begins.',
  },
  {
    id: 'step-03',
    num: '03',
    step: 'Step 3',
    phase: 'Phase 03 · Quarry Sourcing & Millwork Ateliers',
    title: 'Selecting Real Materials',
    scriptSubtitle: 'Hand-picking stone and wood',
    timeline: 'Weeks 13 – 24',
    deliverable: 'Direct Sourced Stone · Custom Woodwork Specs · Fixture List',
    desc: 'We personally select high-quality stone, timber, and metal fixtures directly from top workshops in Europe and Japan.',
  },
  {
    id: 'step-04',
    num: '04',
    step: 'Step 4',
    phase: 'Phase 04 · Construction Oversight & Turnkey Move-In',
    title: 'Building & Final Move-In',
    scriptSubtitle: 'Turnkey move-in ready',
    timeline: 'Construction & Handover',
    deliverable: 'Full Construction Oversight · Final Inspection · Ready to Move In',
    desc: 'Our team stays on site throughout construction to make sure every detail is built perfectly, right up until the day you receive the keys.',
  },
];

const DEFAULT_STUDIOS = [
  {
    id: 'studio-ny',
    city: 'New York Atelier',
    neighborhood: 'SoHo Historic Cast-Iron District',
    address: '42 Greene Street, 4th Floor',
    postal: 'New York, NY 10013, USA',
    partner: 'Julian Vance, Managing Principal',
    lead: 'Julian Vance, Founding Principal',
    phone: '+1 (212) 555-0192',
    email: 'ny@homedesigners.com',
    hours: 'Mon – Fri: 09:00 – 18:00 EST (By Appointment)',
    image: '/cabinet_frames_600fps/frame_180.jpg',
    desc: 'Our North American flagship occupies a restored 19th-century cast-iron loft in SoHo.',
    highlights: ['Full material library with 200+ quarried stone slabs', 'Private client presentation salon and VR simulation room', 'Central hub for California, Colorado, and East Coast commissions'],
  },
  {
    id: 'studio-zurich',
    city: 'Zurich Atelier',
    neighborhood: 'Enge Lake District',
    address: 'Gotthardstrasse 26',
    postal: '8002 Zürich, Switzerland',
    partner: 'Elena Rostova, Partner',
    lead: 'Elena Rostova, Partner',
    phone: '+41 44 288 91 00',
    email: 'zurich@homedesigners.com',
    hours: 'Mon – Fri: 09:00 – 18:00 CET (By Appointment)',
    image: '/cabinet_frames_600fps/frame_080.jpg',
    desc: 'Situated walking distance from Lake Zurich, this atelier coordinates our European commissions.',
    highlights: ['Direct connection to Swiss and Italian alpine quarry masters', 'Specialized thermal insulation and passive house engineering team', 'Private tasting room and client salon overlooking the lake'],
  },
  {
    id: 'studio-london',
    city: 'London Atelier',
    neighborhood: 'Mayfair Heritage Quarter',
    address: '14 Berkeley Square',
    postal: 'London W1J 6BL, United Kingdom',
    partner: 'Charles Montgomery, Director',
    lead: 'Charles Montgomery, Director',
    phone: '+44 20 7946 0880',
    email: 'london@homedesigners.com',
    hours: 'Mon – Fri: 09:00 – 18:00 GMT (By Appointment)',
    image: '/cabinet_frames_600fps/frame_280.jpg',
    desc: 'Our Mayfair salon serves as the primary liaison for our international clientele and UK estates.',
    highlights: ['Curated gallery of custom bronze hardware and lighting', 'Consulting suite for UK country estates and Mediterranean villas', 'Private boardroom for confidential commission reviews'],
  },
];

const DEFAULT_INQUIRIES = [
  {
    id: 'inq-101',
    name: 'Sample Client A',
    email: 'client.inquiry1@example.com',
    phone: '+1 (555) 019-2831',
    location: 'Bel Air, Los Angeles, CA',
    type: 'Hillside Estate',
    timeline: 'Immediate (Ready to begin)',
    message: 'We have acquired a ridge property in Bel Air and wish to build a modern sanctuary with Roman travertine and floor-to-ceiling glass.',
    status: 'Scheduled Consultation',
    date: '2026-08-28T14:30:00.000Z',
  },
  {
    id: 'inq-102',
    name: 'Sample Client B',
    email: 'client.inquiry2@example.com',
    phone: '+41 44 555 0192',
    location: 'Zurich Lakefront, Switzerland',
    type: 'Lakeside Home',
    timeline: 'Within 3 to 6 Months',
    message: 'Seeking a private lakefront residence integrating Valser quartzite and direct boathouse dock access.',
    status: 'Under Review',
    date: '2026-08-29T10:15:00.000Z',
  },
];

export function StudioDataProvider({ children }) {
  // Load and persist state from localStorage with safe wrappers
  const [heroSettings, setHeroSettings] = useState(() => {
    return safeLocalStorageGet('hd_admin_hero', DEFAULT_HERO_SETTINGS);
  });

  const [manifestoSettings, setManifestoSettings] = useState(() => {
    return safeLocalStorageGet('hd_admin_manifesto', DEFAULT_MANIFESTO_SETTINGS);
  });

  const [materials, setMaterials] = useState(() => {
    return safeLocalStorageGet('hd_admin_materials', DEFAULT_MATERIALS);
  });

  const [testimonialSettings, setTestimonialSettings] = useState(() => {
    return safeLocalStorageGet('hd_admin_testimonial', DEFAULT_TESTIMONIAL_SETTINGS);
  });

  const [pressArticles, setPressArticles] = useState(() => {
    return safeLocalStorageGet('hd_admin_press', DEFAULT_PRESS_ARTICLES);
  });

  const [projects, setProjects] = useState(() => {
    return safeLocalStorageGet('hd_admin_projects', DEFAULT_PROJECTS);
  });

  const [spaces, setSpaces] = useState(() => {
    return safeLocalStorageGet('hd_admin_spaces', DEFAULT_SPACES);
  });

  const [processSteps, setProcessSteps] = useState(() => {
    return safeLocalStorageGet('hd_admin_process', DEFAULT_PROCESS_STEPS);
  });

  const [studios, setStudios] = useState(() => {
    return safeLocalStorageGet('hd_admin_studios', DEFAULT_STUDIOS);
  });

  const [inquiries, setInquiries] = useState(() => {
    return safeLocalStorageGet('hd_admin_inquiries', DEFAULT_INQUIRIES);
  });

  // ─── Instant Safe Non-Blocking Persistence ───
  useEffect(() => {
    safeLocalStorageSet('hd_admin_hero', heroSettings);
  }, [heroSettings]);

  useEffect(() => {
    safeLocalStorageSet('hd_admin_manifesto', manifestoSettings);
  }, [manifestoSettings]);

  useEffect(() => {
    safeLocalStorageSet('hd_admin_materials', materials);
  }, [materials]);

  useEffect(() => {
    safeLocalStorageSet('hd_admin_testimonial', testimonialSettings);
  }, [testimonialSettings]);

  useEffect(() => {
    safeLocalStorageSet('hd_admin_press', pressArticles);
  }, [pressArticles]);

  useEffect(() => {
    safeLocalStorageSet('hd_admin_projects', projects);
  }, [projects]);

  useEffect(() => {
    safeLocalStorageSet('hd_admin_spaces', spaces);
  }, [spaces]);

  useEffect(() => {
    safeLocalStorageSet('hd_admin_process', processSteps);
  }, [processSteps]);

  useEffect(() => {
    safeLocalStorageSet('hd_admin_studios', studios);
  }, [studios]);

  useEffect(() => {
    safeLocalStorageSet('hd_admin_inquiries', inquiries);
  }, [inquiries]);

  // ─── CRUD: Projects ───
  const addProject = (project) => {
    const newProj = {
      ...project,
      id: project.id || `PROJECT · 0${projects.length + 1}`,
      slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      width: project.width || 'lg:col-span-6',
      aspect: project.aspect || 'aspect-[16/10]',
      gallery: project.gallery || [{ src: project.image, caption: project.title }],
      specs: project.specs || [
        { label: 'Total Area', value: project.area || '8,500 sq.ft.' },
        { label: 'Topography', value: project.location || 'Private Estate' },
        { label: 'Key Materials', value: project.materials || 'Travertine & Oak' },
        { label: 'Completed', value: project.year || '2025' },
      ],
      features: project.features || [
        'Custom floor-to-ceiling motorized sliding glass',
        'Direct natural daylight orientation',
        'Solid quarried architectural stone',
      ],
      materialsList: project.materialsList || [
        { name: 'Natural Travertine', origin: 'Tivoli, Italy', use: 'Flooring & Walls' },
        { name: 'Smoked Oak', origin: 'Black Forest, Germany', use: 'Custom Millwork' },
      ],
    };
    setProjects((prev) => [newProj, ...prev]);
    return newProj;
  };

  const updateProject = (id, updatedFields) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // ─── CRUD: Spaces ───
  const addSpace = (space) => {
    const newSpace = {
      ...space,
      id: space.id || `space-${Date.now()}`,
      num: space.num || `0${spaces.length + 1}`,
      specs: space.specs || [],
    };
    setSpaces((prev) => [...prev, newSpace]);
  };

  const updateSpace = (id, updatedFields) => {
    setSpaces((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteSpace = (id) => {
    setSpaces((prev) => prev.filter((s) => s.id !== id));
  };

  // ─── CRUD: Process Steps ───
  const addProcessStep = (step) => {
    const newStep = {
      ...step,
      id: step.id || `step-${Date.now()}`,
      num: step.num || `0${processSteps.length + 1}`,
    };
    setProcessSteps((prev) => [...prev, newStep]);
  };

  const updateProcessStep = (id, updatedFields) => {
    setProcessSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteProcessStep = (id) => {
    setProcessSteps((prev) => prev.filter((s) => s.id !== id));
  };

  // ─── CRUD: Studios ───
  const addStudio = (studio) => {
    const newStudio = {
      ...studio,
      id: studio.id || `studio-${Date.now()}`,
      highlights: studio.highlights || [],
    };
    setStudios((prev) => [...prev, newStudio]);
  };

  const updateStudio = (id, updatedFields) => {
    setStudios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteStudio = (id) => {
    setStudios((prev) => prev.filter((s) => s.id !== id));
  };

  // ─── CRUD: Materials ───
  const updateMaterial = (num, updatedFields) => {
    setMaterials((prev) =>
      prev.map((m) => (m.num === num ? { ...m, ...updatedFields } : m))
    );
  };

  // ─── CRUD: Inquiries ───
  const addInquiry = (inquiry) => {
    const newInq = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'New Inquiry',
      date: new Date().toISOString(),
    };
    setInquiries((prev) => [newInq, ...prev]);
    return newInq;
  };

  const updateInquiryStatus = (id, status) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
  };

  const deleteInquiry = (id) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  // ─── Reset to Factory Defaults ───
  const resetToDefaults = () => {
    setHeroSettings(DEFAULT_HERO_SETTINGS);
    setManifestoSettings(DEFAULT_MANIFESTO_SETTINGS);
    setMaterials(DEFAULT_MATERIALS);
    setTestimonialSettings(DEFAULT_TESTIMONIAL_SETTINGS);
    setPressArticles(DEFAULT_PRESS_ARTICLES);
    setProjects(DEFAULT_PROJECTS);
    setSpaces(DEFAULT_SPACES);
    setProcessSteps(DEFAULT_PROCESS_STEPS);
    setStudios(DEFAULT_STUDIOS);
    setInquiries(DEFAULT_INQUIRIES);

    localStorage.removeItem('hd_admin_hero');
    localStorage.removeItem('hd_admin_manifesto');
    localStorage.removeItem('hd_admin_materials');
    localStorage.removeItem('hd_admin_testimonial');
    localStorage.removeItem('hd_admin_press');
    localStorage.removeItem('hd_admin_projects');
    localStorage.removeItem('hd_admin_spaces');
    localStorage.removeItem('hd_admin_process');
    localStorage.removeItem('hd_admin_studios');
    localStorage.removeItem('hd_admin_inquiries');
  };

  return (
    <StudioDataContext.Provider
      value={{
        heroSettings,
        setHeroSettings,
        manifestoSettings,
        setManifestoSettings,
        materials,
        updateMaterial,
        testimonialSettings,
        setTestimonialSettings,
        pressArticles,
        setPressArticles,
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
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        resetToDefaults,
      }}
    >
      {children}
    </StudioDataContext.Provider>
  );
}

export function useStudioData() {
  const context = useContext(StudioDataContext);
  if (!context) {
    throw new Error('useStudioData must be used within a StudioDataProvider');
  }
  return context;
}
