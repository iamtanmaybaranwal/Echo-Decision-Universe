import { useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { createRng } from '../../lib/random';
import { prefersReducedMotion } from '../../lib/motion';
import './Starfield.css';

const TINTS = ['#ffffff', '#ffffff', '#ffffff', '#c4b5fd', '#a5f3fc'];

function makeStars(count, seed) {
  const rand = createRng(seed);
  return Array.from({ length: count }, (_, id) => {
    const bright = rand() > 0.88;
    return {
      id,
      x: rand() * 100,
      y: rand() * 100,
      r: bright ? 1.1 + rand() * 0.9 : 0.4 + rand() * 0.7,
      opacity: bright ? 0.7 + rand() * 0.3 : 0.18 + rand() * 0.45,
      fill: TINTS[Math.floor(rand() * TINTS.length)],
      bright,
    };
  });
}

/**
 * Full-viewport SVG starfield with GSAP twinkle and gentle pointer parallax.
 * Two layers (far / near) drift by different amounts for depth.
 */
export default function Starfield({ count = 170, seed = 11 }) {
  const rootRef = useRef(null);
  const farRef = useRef(null);
  const nearRef = useRef(null);

  const { far, near } = useMemo(() => {
    const stars = makeStars(count, seed);
    return {
      far: stars.filter((s) => !s.bright),
      near: stars.filter((s) => s.bright),
    };
  }, [count, seed]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.starfield__star', {
        opacity: 0,
        duration: 2.4,
        ease: 'power2.out',
        stagger: { each: 0.006, from: 'random' },
      });

      gsap.utils.toArray('.starfield__star--twinkle').forEach((star) => {
        gsap.to(star, {
          opacity: gsap.utils.random(0.1, 0.45),
          duration: gsap.utils.random(1.4, 3.6),
          delay: gsap.utils.random(2.4, 6),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, rootRef);

    const farX = gsap.quickTo(farRef.current, 'x', { duration: 1.6, ease: 'power3.out' });
    const farY = gsap.quickTo(farRef.current, 'y', { duration: 1.6, ease: 'power3.out' });
    const nearX = gsap.quickTo(nearRef.current, 'x', { duration: 1.2, ease: 'power3.out' });
    const nearY = gsap.quickTo(nearRef.current, 'y', { duration: 1.2, ease: 'power3.out' });

    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      farX(nx * -8);
      farY(ny * -8);
      nearX(nx * -20);
      nearY(ny * -20);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.killTweensOf([farRef.current, nearRef.current]);
      ctx.revert();
    };
  }, [far, near]);

  return (
    <div className="starfield" ref={rootRef} aria-hidden="true">
      <div className="starfield__nebula starfield__nebula--violet" />
      <div className="starfield__nebula starfield__nebula--cyan" />
      <svg className="starfield__svg" width="100%" height="100%">
        <g ref={farRef}>
          {far.map((s) => (
            <circle
              key={s.id}
              className={`starfield__star${s.id % 3 === 0 ? ' starfield__star--twinkle' : ''}`}
              cx={`${s.x}%`}
              cy={`${s.y}%`}
              r={s.r}
              fill={s.fill}
              opacity={s.opacity}
            />
          ))}
        </g>
        <g ref={nearRef}>
          {near.map((s) => (
            <circle
              key={s.id}
              className="starfield__star starfield__star--twinkle starfield__star--bright"
              cx={`${s.x}%`}
              cy={`${s.y}%`}
              r={s.r}
              fill={s.fill}
              opacity={s.opacity}
            />
          ))}
        </g>
      </svg>
      <div className="starfield__vignette" />
    </div>
  );
}
