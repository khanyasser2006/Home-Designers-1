import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import Navbar from './components/Navbar';
import HeroSequence from './components/HeroSequence';
import MaterialProvenance from './components/MaterialProvenance';
import StudioSignatureBar from './components/StudioSignatureBar';
import Philosophy from './components/Philosophy';
import FeaturedProjects from './components/FeaturedProjects';
import MaterialsMatrix from './components/MaterialsMatrix';
import Process from './components/Process';
import Testimonial from './components/Testimonial';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectDetailModal from './components/ProjectDetailModal';
import SpaceDetailModal from './components/SpaceDetailModal';
import SEOHead from './components/SEOHead';

// Dedicated Subpages
import HomesPage from './pages/HomesPage';
import ProcessPage from './pages/ProcessPage';
import ContactPage from './pages/ContactPage';
import StudiosPage from './pages/StudiosPage';
import PressPage from './pages/PressPage';
import AuthPage from './pages/AuthPage';
import AdminPanelPage from './pages/AdminPanelPage';

// Central Studio Data Context
import { StudioDataProvider } from './context/StudioDataContext';
import {
  hashPassword,
  sanitizeString,
  safeLocalStorageSet,
  safeLocalStorageGet,
} from './utils/security';

const ADMIN_EMAIL = 'admin@homedesigners.com';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [inquirySubject, setInquirySubject] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const lenisRef = useRef(null);

  // Load auth state and registered users with cryptographic migration
  useEffect(() => {
    async function initUsers() {
      try {
        const storedUsers = safeLocalStorageGet('home_designers_users', null);
        if (storedUsers && Array.isArray(storedUsers)) {
          // Migrate any legacy plaintext passwords to SHA-256 hashes
          const migrated = await Promise.all(
            storedUsers.map(async (u) => {
              if (u.password && !u.passwordHash) {
                const passwordHash = await hashPassword(u.password);
                const { password, ...rest } = u;
                return { ...rest, passwordHash };
              }
              return u;
            })
          );
          setUsers(migrated);
          safeLocalStorageSet('home_designers_users', migrated);
        } else {
          // Initialize default test client with hashed password
          const defaultHash = await hashPassword('luxury123');
          const defaultUsers = [
            {
              name: 'Sarah Jenkins',
              email: 'client@homedesigners.com',
              passwordHash: defaultHash,
              propertyInterest: 'Hillside Estate',
              isAdmin: false,
              registeredAt: new Date().toISOString(),
            },
          ];
          setUsers(defaultUsers);
          safeLocalStorageSet('home_designers_users', defaultUsers);
        }

        // Check active session and expiration (24h timeout)
        const storedActiveUser = safeLocalStorageGet('home_designers_active_user', null);
        if (storedActiveUser) {
          if (storedActiveUser.sessionExpiresAt && Date.now() > storedActiveUser.sessionExpiresAt) {
            localStorage.removeItem('home_designers_active_user');
            setCurrentUser(null);
          } else {
            setCurrentUser(storedActiveUser);
          }
        }
      } catch (e) {
        console.warn('Auth initialization error:', e);
      }
    }
    initUsers();
  }, []);

  // Sync with URL Hash on Mount & Listen to Back/Forward
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const validPages = ['homes', 'process', 'contact', 'studios', 'press', 'auth', 'login', 'register', 'admin'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash === 'login' || hash === 'register' ? 'auth' : hash);
      } else {
        setCurrentPage('home');
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Initialize Lenis Smooth Inertia Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Refresh ScrollTrigger calculations on page change
  useEffect(() => {
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    return () => clearTimeout(t);
  }, [currentPage]);

  // Pause Lenis only when a modal is open, resume when closed
  useEffect(() => {
    if (selectedProject || selectedSpace) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [selectedProject, selectedSpace]);

  const handleNavigate = (pageKey) => {
    const targetKey = pageKey === 'login' || pageKey === 'register' ? 'auth' : pageKey;
    setCurrentPage(targetKey);
    setSelectedProject(null);
    setSelectedSpace(null);
    document.body.style.overflow = 'auto';
    if (targetKey === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = `#/${targetKey}`;
    }
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
    lenisRef.current?.start();
  };

  // Auth: Register Handler (Cryptographic SHA-256 with Input Sanitization)
  const handleRegister = async ({ name, email, password, propertyInterest }) => {
    const cleanEmail = sanitizeString(email).toLowerCase();
    const cleanName = sanitizeString(name);
    const cleanInterest = sanitizeString(propertyInterest);

    if (cleanEmail === ADMIN_EMAIL) {
      return { success: false, error: 'This email is reserved for the Master Studio Admin. Please sign in directly.' };
    }

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in directly.' };
    }

    const passwordHash = await hashPassword(password);

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      propertyInterest: cleanInterest,
      isAdmin: false,
      registeredAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    const sessionUser = {
      name: cleanName,
      email: cleanEmail,
      propertyInterest: cleanInterest,
      isAdmin: false,
      sessionExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    setCurrentUser(sessionUser);

    safeLocalStorageSet('home_designers_users', updatedUsers);
    safeLocalStorageSet('home_designers_active_user', sessionUser);

    return { success: true };
  };

  // Auth: Login Handler (Checks Master Admin or registered client against SHA-256 hash)
  const handleLogin = async ({ email, password }) => {
    const cleanEmail = sanitizeString(email).toLowerCase();
    const inputHash = await hashPassword(password);
    const adminExpectedHash = await hashPassword('admin123');

    // 1. Check Master Admin Credentials
    if (cleanEmail === ADMIN_EMAIL && inputHash === adminExpectedHash) {
      const adminUser = {
        name: 'Master Principal Architect',
        email: ADMIN_EMAIL,
        isAdmin: true,
        sessionExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      setCurrentUser(adminUser);
      safeLocalStorageSet('home_designers_active_user', adminUser);
      return { success: true, isAdmin: true };
    }

    // 2. Check Registered Clients
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return {
        success: false,
        error: 'Account not found. You are not registered yet. Please register your account first, then sign in.',
      };
    }

    const userHash = foundUser.passwordHash || (foundUser.password ? await hashPassword(foundUser.password) : '');
    if (inputHash !== userHash) {
      return { success: false, error: 'Incorrect password. Please verify your credentials and try again.' };
    }

    const sessionUser = {
      name: foundUser.name,
      email: foundUser.email,
      propertyInterest: foundUser.propertyInterest,
      isAdmin: false,
      sessionExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    setCurrentUser(sessionUser);
    safeLocalStorageSet('home_designers_active_user', sessionUser);

    return { success: true, isAdmin: false };
  };

  // Auth: Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('home_designers_active_user');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    handleNavigate('home');
  };

  const handleInquire = (subjectTitle) => {
    setInquirySubject(subjectTitle || '');
    setSelectedProject(null);
    setSelectedSpace(null);
    handleNavigate('contact');
  };

  return (
    <div className="relative bg-latte-cream text-mocha selection:bg-mocha selection:text-latte-warm min-h-screen">
      {/* Dynamic SEO Meta Tags & Head Schema */}
      <SEOHead currentPage={currentPage} />

      {/* Archival Paper / Film Grain Overlay */}
      <div className="grain-overlay" />

      {/* Global Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
      />

      {/* Page Routing with Haute Couture Transition */}
      <main key={currentPage} className="page-transition-enter">
        {currentPage === 'home' && (
          <>
            <HeroSequence />
            <MaterialProvenance onNavigate={handleNavigate} />
            <StudioSignatureBar />
            <Philosophy />
            <FeaturedProjects onSelectProject={(project) => setSelectedProject(project)} />
            <MaterialsMatrix onSelectSpace={(space) => setSelectedSpace(space)} />
            <Process />
            <Testimonial />
            <Contact inquirySubject={inquirySubject} />
          </>
        )}

        {currentPage === 'homes' && (
          <HomesPage
            onNavigate={handleNavigate}
            onSelectProject={(project) => setSelectedProject(project)}
            onInquire={handleInquire}
          />
        )}

        {currentPage === 'process' && (
          <ProcessPage onNavigate={handleNavigate} onInquire={handleInquire} />
        )}

        {currentPage === 'contact' && (
          <ContactPage onNavigate={handleNavigate} inquirySubject={inquirySubject} />
        )}

        {currentPage === 'studios' && (
          <StudiosPage onNavigate={handleNavigate} onInquire={handleInquire} />
        )}

        {currentPage === 'press' && (
          <PressPage onNavigate={handleNavigate} onInquire={handleInquire} />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            currentUser={currentUser}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPanelPage
            onNavigate={handleNavigate}
            onLogoutAdmin={handleLogout}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} currentUser={currentUser} />

      {/* Full-Screen Project Monograph Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSelectProject={(p) => setSelectedProject(p)}
          onInquire={handleInquire}
        />
      )}

      {/* Living Space Detail Modal */}
      {selectedSpace && (
        <SpaceDetailModal
          space={selectedSpace}
          onClose={() => setSelectedSpace(null)}
          onInquire={handleInquire}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StudioDataProvider>
      <AppContent />
    </StudioDataProvider>
  );
}
