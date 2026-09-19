import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStudioData } from '../context/StudioDataContext';

gsap.registerPlugin(ScrollTrigger);

import frameManifest from './frames.json';

const FRAME_COUNT = frameManifest.length;
const FRAME_DIR = '/cabinet_frames_600fps/';

export default function HeroSequence() {
  const { heroSettings } = useStudioData();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const frameIndexRef = useRef(0);
  const imagesRef = useRef([]);
  const rafIdRef = useRef(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });

    // ─── Resize handler ───
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = imagesRef.current[frameIndexRef.current] || imagesRef.current[0];
      if (img) paintFrame(ctx, canvas, img);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // ─── Instant first frame load for zero-wait visual ───
    const firstImgUrl = `${FRAME_DIR}${frameManifest[0] || 'frame_001.jpg'}`;
    const firstImg = new Image();
    firstImg.src = firstImgUrl;
    firstImg.onload = () => {
      if (!imagesRef.current[0]) {
        imagesRef.current[0] = firstImg;
      }
      paintFrame(ctx, canvas, firstImg);
      setIsLoaded(true);
    };

    // ─── Load remaining frames with GPU off-thread decode ───
    const loadFrames = async () => {
      const images = imagesRef.current.length === FRAME_COUNT ? imagesRef.current : new Array(FRAME_COUNT);
      imagesRef.current = images;
      let loaded = 0;

      const BATCH_SIZE = 30;
      for (let batchStart = 0; batchStart < FRAME_COUNT; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, FRAME_COUNT);
        const batchPromises = [];

        for (let i = batchStart; i < batchEnd; i++) {
          const fileName = frameManifest[i] || `frame_${String(i + 1).padStart(3, '0')}.jpg`;
          const url = `${FRAME_DIR}${fileName}`;

          const promise = fetch(url)
            .then((res) => res.blob())
            .then((blob) => createImageBitmap(blob))
            .then((bitmap) => {
              images[i] = bitmap;
              loaded++;
              setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100));
            })
            .catch(() => {
              loaded++;
              setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100));
            });

          batchPromises.push(promise);
        }

        await Promise.all(batchPromises);
      }

      setIsLoaded(true);
      ScrollTrigger.refresh();

      if (images[0]) {
        paintFrame(ctx, canvas, images[0]);
      }
    };

    // ─── GSAP ScrollTrigger for butter-smooth frame scrub (scrub: 1) ───
    const scrubTween = gsap.to(
      { frame: 0 },
      {
        frame: FRAME_COUNT - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Ultra-smooth inertia damping
        },
        onUpdate: function () {
          frameIndexRef.current = Math.round(this.targets()[0].frame);
        },
      }
    );

    // ─── Sequential Alternating Luxury Phrases ───
    const phrase1 = document.querySelector('.hero-phrase-1');
    const phrase2 = document.querySelector('.hero-phrase-2');
    const phrase3 = document.querySelector('.hero-phrase-3');

    // Phrase 1: Bottom-Left (0% -> 22% scroll)
    if (phrase1) {
      gsap.fromTo(
        phrase1,
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -25,
          ease: 'power1.in',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '22% top',
            scrub: 1,
          },
        }
      );
    }

    // Phrase 2: Top-Right (26% -> 56% scroll)
    if (phrase2) {
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '26% top',
          end: '56% top',
          scrub: 1,
        },
      });
      tl2.fromTo(phrase2, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power1.out', duration: 0.3 })
         .to(phrase2, { opacity: 1, duration: 0.4 })
         .to(phrase2, { opacity: 0, y: -25, ease: 'power1.in', duration: 0.3 });
    }

    // Phrase 3: Bottom-Right (60% -> 90% scroll)
    if (phrase3) {
      const tl3 = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '60% top',
          end: '90% top',
          scrub: 1,
        },
      });
      tl3.fromTo(phrase3, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power1.out', duration: 0.3 })
         .to(phrase3, { opacity: 1, duration: 0.4 })
         .to(phrase3, { opacity: 0, y: -25, ease: 'power1.in', duration: 0.3 });
    }

    // ─── High-Performance Decoupled rAF Render Loop ───
    let lastRenderedImg = null;
    const tick = () => {
      const idx = frameIndexRef.current;
      const img = imagesRef.current[idx] || lastRenderedImg || imagesRef.current[0];
      if (img && img !== lastRenderedImg) {
        lastRenderedImg = img;
        paintFrame(ctx, canvas, img);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);

    loadFrames();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      scrubTween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative hero-scroll-container"
      style={{ height: '500vh' }}
    >
      {/* Sticky Canvas Container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />

        {/* Loading Overlay */}
        {!isLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#3E2723',
              zIndex: 30,
            }}
          >
            <p
              className="font-serif text-3xl sm:text-4xl text-latte-warm mb-6 tracking-wide font-light"
            >
              Home Designers
            </p>
            <div
              style={{
                width: '200px',
                height: '1px',
                backgroundColor: 'rgba(215,204,200,0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: '#D7CCC8',
                  width: `${loadProgress}%`,
                  transition: 'width 200ms ease-out',
                }}
              />
            </div>
            <p
              className="font-body text-latte/70 text-[11px] uppercase tracking-[0.2em] mt-4"
            >
              Preparing Sanctuary Experience · {loadProgress}%
            </p>
          </div>
        )}

        {/* ─── Haute Editorial Phrases with Luxury Cursive Accents ─── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {/* Phrase 1: Bottom-Left */}
          <div
            className="hero-phrase-1 absolute bottom-8 sm:bottom-16 md:bottom-20 left-4 sm:left-12 md:left-16 right-4 sm:right-auto max-w-xl text-left"
            style={{ opacity: 1 }}
          >
            <span
              className="font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] text-latte font-semibold block mb-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            >
              {heroSettings.tagline}
            </span>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-latte-warm font-normal leading-[1.08] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {heroSettings.title}
            </h1>
            <span className="font-script text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-latte block mt-1 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {heroSettings.scriptSubtitle}
            </span>
          </div>

          {/* Phrase 2: Top-Right */}
          <div
            className="hero-phrase-2 absolute top-16 sm:top-24 md:top-28 right-4 sm:right-12 md:right-16 left-4 sm:left-auto max-w-xl text-right"
            style={{ opacity: 0 }}
          >
            <span
              className="font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] text-latte font-semibold block mb-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            >
              {heroSettings.tagline2 || '02 / Natural Materials'}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-latte-warm font-normal leading-[1.08] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {heroSettings.title2 || 'Real wood and stone,'}
            </h2>
            <span className="font-script text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-latte block mt-1 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {heroSettings.scriptSubtitle2 || 'crafted to last.'}
            </span>
          </div>

          {/* Phrase 3: Bottom-Right */}
          <div
            className="hero-phrase-3 absolute bottom-8 sm:bottom-16 md:bottom-20 right-4 sm:right-12 md:right-16 left-4 sm:left-auto max-w-xl text-right"
            style={{ opacity: 0 }}
          >
            <span
              className="font-body text-[10px] sm:text-xs uppercase tracking-[0.2em] text-latte font-semibold block mb-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            >
              {heroSettings.tagline3 || '03 / Timeless Living'}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-latte-warm font-normal leading-[1.08] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {heroSettings.title3 || 'Comfortable spaces,'}
            </h2>
            <span className="font-script text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-latte block mt-1 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {heroSettings.scriptSubtitle3 || 'made for your life.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Paint frame with integer pixel coordinates ───
function paintFrame(ctx, canvas, img) {
  if (!ctx || !canvas || !img) return;
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.width || img.naturalWidth;
  const ih = img.height || img.naturalHeight;
  if (!iw || !ih || !cw || !ch) return;

  const scale = Math.max(cw / iw, ch / ih);
  const sw = (iw * scale) | 0;
  const sh = (ih * scale) | 0;
  const sx = ((cw - sw) / 2) | 0;
  const sy = ((ch - sh) / 2) | 0;

  ctx.drawImage(img, sx, sy, sw, sh);
}
