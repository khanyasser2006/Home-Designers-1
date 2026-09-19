import { useEffect } from 'react';

/**
 * Custom hook to trigger luxury viewport reveals smoothly across any page or component.
 * Uses IntersectionObserver for 100% reliable, non-blocking 60fps animations.
 */
export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-init, .reveal-left, .reveal-scale').forEach((el) => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal-init, .reveal-left, .reveal-scale');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // If already in viewport on load, reveal with smooth micro-delay
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => {
          el.classList.add('revealed');
        }, 60);
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, dependencies);
}
