import { useEffect } from 'react';

const PAGE_SEO = {
  home: {
    title: 'Home Designers | Bespoke Luxury Residential Architecture & Design Atelier',
    description:
      'Home Designers is an international haute architecture atelier sculpting bespoke private residential estates in Los Angeles, Zurich, London, Aspen, and Kyoto.',
    keywords:
      'luxury home architecture, custom estate design, modern bespoke residences, residential architects, private villa design, European stone sourcing, architectural atelier',
    canonical: 'https://homedesigners.com/',
  },
  homes: {
    title: 'Selected Residences & Architectural Monograph Portfolio | Home Designers',
    description:
      'Explore our portfolio of private residential estates: Hillside villas in California, lakefront homes in Switzerland, alpine chalets in Aspen, and garden residences in Kyoto.',
    keywords:
      'residential portfolio, custom home floorplans, luxury estate architecture, hillside villa design, architectural monographs, high-end private residences',
    canonical: 'https://homedesigners.com/#/homes',
  },
  process: {
    title: 'Design Process & Methodology | 4-Phase Turnkey Architectural Journey',
    description:
      'Discover our 4-phase architectural methodology: Topography Discovery, 3D Spatial Prototyping, Direct Quarry Sourcing, and Turnkey Handover.',
    keywords:
      'architectural design process, custom home construction stages, bespoke architecture timeline, turnkey residential handover, luxury home methodology',
    canonical: 'https://homedesigners.com/#/process',
  },
  studios: {
    title: 'Global Ateliers & Locations: New York, Zurich, London | Home Designers',
    description:
      'Visit our global design studios in SoHo New York, Seefeld Zurich, and Mayfair London. Schedule a private architectural consultation for your site.',
    keywords:
      'architectural atelier New York, Zurich luxury architects, London residential design studio, private architecture consultation, global residential architects',
    canonical: 'https://homedesigners.com/#/studios',
  },
  contact: {
    title: 'Commission an Architectural Project | Private Consultation & Site Brief',
    description:
      'Begin your bespoke residential commission. Submit your land and project brief for confidential review by our managing architects within 24 hours.',
    keywords:
      'hire residential architect, custom estate inquiry, private home commission, architectural consultation brief, luxury home designers contact',
    canonical: 'https://homedesigners.com/#/contact',
  },
  press: {
    title: 'Press, Monograph Publications & Architectural Awards | Home Designers',
    description:
      'Read editorial features and international architectural awards recognizing Home Designers in Architectural Digest, Dezeen, and AIA Honor Awards.',
    keywords:
      'architectural awards, Architectural Digest feature, luxury residence press, bespoke design monographs, AIA residential design honors',
    canonical: 'https://homedesigners.com/#/press',
  },
  auth: {
    title: 'VIP Client Portal & Atelier Access | Home Designers',
    description:
      'Private client access portal to review 3D estate prototypes, quarry material selections, and active construction milestones.',
    keywords: 'client atelier portal, private client login, architectural dossier access',
    canonical: 'https://homedesigners.com/#/auth',
  },
};

export default function SEOHead({ currentPage }) {
  useEffect(() => {
    const seo = PAGE_SEO[currentPage] || PAGE_SEO.home;

    // Update Title
    document.title = seo.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seo.description;

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = seo.keywords;

    // Update OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = seo.title;

    // Update OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = seo.description;

    // Update OpenGraph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = seo.canonical;

    // Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = seo.canonical;
  }, [currentPage]);

  return null;
}
