import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { createRng } from '../../lib/random';
import { prefersReducedMotion } from '../../lib/motion';
import './BranchingUniverse.css';

const VIEW = 1000;
const MAX_DEPTH = 4;
// idle: dim behind the landing copy · bloom: launch transition · hidden: explorer is open.
const MODES = {
  idle: { opacity: 0.34, scale: 1 },
  bloom: { opacity: 0.9, scale: 1.06 },
  hidden: { opacity: 0, scale: 1.12 },
};

const fmt = (n) => n.toFixed(1);

/**
 * Procedurally grows a tree of futures from a single root point.
 * Each branch is a smooth cubic curve; endpoints become glowing "worlds".
 */
function growUniverse(seed) {
  const rand = createRng(seed);
  const branches = [];
  const nodes = [];

  function grow(x, y, angle, length, depth) {
    if (depth > MAX_DEPTH) {
      nodes.push({ x, y, depth, leaf: true });
      return;
    }
    if (depth > 0) nodes.push({ x, y, depth, leaf: false });

    const count = depth === 0 ? 3 : rand() < 0.3 ? 3 : 2;
    const spread = depth === 0 ? 1.5 : 1.05 - depth * 0.1;

    for (let i = 0; i < count; i += 1) {
      const t = i / (count - 1) - 0.5;
      const a = angle + t * spread + (rand() - 0.5) * 0.22;
      const len = length * (0.7 + rand() * 0.18);
      const nx = x + Math.sin(a) * len;
      const ny = y - Math.cos(a) * len;
      const bend = len * 0.55;
      branches.push({
        d: `M${fmt(x)} ${fmt(y)} C${fmt(x)} ${fmt(y - bend)} ${fmt(nx)} ${fmt(ny + bend * 0.6)} ${fmt(nx)} ${fmt(ny)}`,
        depth,
      });
      grow(nx, ny, a * 0.85, len, depth + 1);
    }
  }

  grow(VIEW / 2, VIEW + 20, 0, 260, 0);
  return { branches, nodes };
}

export default function BranchingUniverse({ seed = 42, mode = 'idle' }) {
  const rootRef = useRef(null);
  const { branches, nodes } = useMemo(() => growUniverse(seed), [seed]);

  // Draw-in animation on mount, then ambient pulse of the leaf worlds.
  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.universe__branch').forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: reduced ? 0 : len });
      });

      if (reduced) return;

      const tl = gsap.timeline({ delay: 0.6 });
      for (let depth = 0; depth <= MAX_DEPTH; depth += 1) {
        tl.to(
          `.universe__branch[data-depth="${depth}"]`,
          {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: 'power2.inOut',
            stagger: { each: 0.02, from: 'random' },
          },
          depth === 0 ? 0 : '-=0.75',
        );
        tl.from(
          `.universe__node[data-depth="${depth + 1}"]`,
          {
            scale: 0,
            opacity: 0,
            transformOrigin: '50% 50%',
            duration: 0.6,
            ease: 'back.out(3)',
            stagger: 0.01,
          },
          '-=0.35',
        );
      }

      // Created here (not in a timeline callback) so ctx.revert() cleans them up.
      const settled = tl.delay() + tl.duration();
      gsap.utils.toArray('.universe__node--leaf').forEach((node) => {
        gsap.to(node, {
          opacity: gsap.utils.random(0.35, 0.7),
          duration: gsap.utils.random(1.6, 3.2),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: settled + gsap.utils.random(0, 2),
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [branches]);

  useEffect(() => {
    const tween = gsap.to(rootRef.current, {
      ...MODES[mode],
      duration: prefersReducedMotion() ? 0 : 1.4,
      ease: 'power3.inOut',
    });
    return () => tween.kill();
  }, [mode]);

  return (
    <div className="universe" ref={rootRef} aria-hidden="true">
      <svg
        className="universe__svg"
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient
            id="universe-stroke"
            x1="0"
            y1={VIEW}
            x2="0"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="0.55" stopColor="#a78bfa" stopOpacity="0.7" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0.9" />
          </linearGradient>
          <filter id="universe-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#universe-glow)">
          {branches.map((b, i) => (
            <path
              key={i}
              className="universe__branch"
              data-depth={b.depth}
              d={b.d}
              stroke="url(#universe-stroke)"
              strokeWidth={Math.max(0.8, 3.2 - b.depth * 0.6)}
            />
          ))}
          {nodes.map((n, i) => (
            <circle
              key={i}
              className={`universe__node${n.leaf ? ' universe__node--leaf' : ''}`}
              data-depth={n.depth}
              cx={n.x}
              cy={n.y}
              r={n.leaf ? 4.2 : 2.6}
              fill={n.leaf ? '#a5f3fc' : '#c4b5fd'}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
