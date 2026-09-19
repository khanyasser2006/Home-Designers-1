import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop devices with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target.closest('[data-cursor], a, button');
      if (target) {
        setIsHovered(true);
        setCursorText(target.getAttribute('data-cursor') || '');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Small Precision Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full bg-latte-warm transition-transform duration-75"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isHovered ? 0 : 1})`,
          width: '6px',
          height: '6px',
        }}
      />

      {/* Smooth Expanding Ring / Badge */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 ease-out backdrop-blur-[2px]"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          width: isHovered ? (cursorText ? '84px' : '44px') : '32px',
          height: isHovered ? (cursorText ? '84px' : '44px') : '32px',
          backgroundColor: isHovered ? 'rgba(78, 52, 46, 0.85)' : 'transparent',
          border: '1px solid rgba(215, 204, 200, 0.5)',
        }}
      >
        {cursorText && (
          <span className="font-body text-[9px] uppercase tracking-[0.2em] text-latte-warm font-semibold">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
