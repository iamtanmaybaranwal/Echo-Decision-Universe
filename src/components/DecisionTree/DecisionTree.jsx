import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import TreeNode from '../TreeNode/TreeNode.jsx';
import { computeLayout } from '../../lib/treeLayout';
import { useElementSize } from '../../hooks/useElementSize';
import { prefersReducedMotion } from '../../lib/motion';
import './DecisionTree.css';

const EDGE_ORDER = { dimmed: 0, idle: 1, related: 2, active: 3 };

/**
 * Derives a visual state for every node and edge from the current selection.
 * - selected: the clicked node
 * - path: its ancestors (and the edges leading to it are "active")
 * - related: its direct children
 * - dimmed: everything else, unless the overview (root) is selected
 */
function deriveStates(scenario, selection) {
  const { branchId, outcomeId } = selection;
  const selectedId = outcomeId || branchId || 'root';
  const overview = selectedId === 'root';

  const path = new Set();
  const related = new Set();
  if (branchId) path.add('root');
  if (outcomeId) path.add(branchId);

  if (overview) scenario.branches.forEach((b) => related.add(b.id));
  if (branchId && !outcomeId) {
    scenario.branches.find((b) => b.id === branchId)?.outcomes.forEach((o) => related.add(o.id));
  }

  const nodeState = (id) => {
    if (id === selectedId) return 'selected';
    if (path.has(id)) return 'path';
    if (related.has(id)) return 'related';
    return overview ? 'idle' : 'dimmed';
  };

  const edgeState = (from, to) => {
    const lineage = (id) => id === selectedId || path.has(id);
    if (lineage(from) && lineage(to)) return 'active';
    if (from === selectedId && related.has(to)) return 'related';
    return overview ? 'idle' : 'dimmed';
  };

  return { selectedId, nodeState, edgeState };
}

function ariaLabelFor(node, scenario) {
  if (node.kind === 'root') return `Origin: ${scenario.question}`;
  const branch = scenario.branches.find((b) => b.id === node.id || b.outcomes.some((o) => o.id === node.id));
  if (node.kind === 'branch') return `Path ${branch.letter}, ${branch.tag}: ${branch.title}`;
  const outcome = branch.outcomes.find((o) => o.id === node.id);
  return `Outcome of path ${branch.letter}: ${outcome.title}, ${outcome.likelihood}% likely`;
}

export default function DecisionTree({ scenario, selection, onSelect }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const { width, height } = useElementSize(containerRef);

  const layout = useMemo(() => computeLayout(scenario, width, height), [scenario, width, height]);
  const { selectedId, nodeState, edgeState } = deriveStates(scenario, selection);

  // Highlighted edges render last so they sit on top of shared trunks.
  const edges = (layout?.edges ?? [])
    .map((edge) => ({ ...edge, state: edgeState(edge.from, edge.to) }))
    .sort((a, b) => EDGE_ORDER[a.state] - EDGE_ORDER[b.state]);

  const mode = layout?.mode;

  // Grow the universe: root → paths → outcomes. Replays if the layout mode flips.
  useLayoutEffect(() => {
    if (!mode || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.tree-edge__line');
      lines.forEach((line) => {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      });

      const pop = { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2.2)' };
      const fade = { opacity: 0, duration: 0.6, ease: 'power2.out' };
      const draw = { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' };

      gsap
        .timeline({
          delay: 0.15,
          onComplete: () => gsap.set(lines, { clearProps: 'strokeDasharray,strokeDashoffset' }),
        })
        .from('.tree-node[data-depth="0"] .tree-node__pop', { ...pop, duration: 1, ease: 'expo.out' })
        .from('.tree-node[data-depth="0"] .tree-node__label-wrap', fade, 0.4)
        .to('.tree-edge[data-depth="1"] .tree-edge__line', { ...draw, stagger: 0.12 }, 0.45)
        .from('.tree-node[data-depth="1"] .tree-node__pop', { ...pop, stagger: 0.12 }, 1.05)
        .from('.tree-node[data-depth="1"] .tree-node__label-wrap', { ...fade, x: -6, stagger: 0.12 }, 1.15)
        .to('.tree-edge[data-depth="2"] .tree-edge__line', { ...draw, stagger: 0.07 }, 1.35)
        .from('.tree-node[data-depth="2"] .tree-node__pop', { ...pop, stagger: 0.07 }, 1.95)
        .from('.tree-node[data-depth="2"] .tree-node__label-wrap', { ...fade, x: -6, stagger: 0.07 }, 2.05)
        .from('.tree__flows', { opacity: 0, duration: 0.8 }, 2.4);
    }, svgRef);

    return () => ctx.revert();
  }, [scenario.id, mode]);

  // Selection feedback: a ring ripples out of the chosen node.
  const prevSelectedId = useRef(selectedId);
  useEffect(() => {
    if (prevSelectedId.current === selectedId) return;
    prevSelectedId.current = selectedId;

    const nodeEl = svgRef.current?.querySelector(`[data-id="${selectedId}"]`);
    if (!nodeEl) return;

    if (mode === 'list') {
      nodeEl.scrollIntoView?.({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
    if (prefersReducedMotion()) return;

    const pulse = nodeEl.querySelector('.tree-node__pulse');
    const r = Number(pulse.getAttribute('r'));
    gsap.fromTo(
      pulse,
      { attr: { r }, opacity: 0.9 },
      { attr: { r: r + 26 }, opacity: 0, duration: 0.9, ease: 'power2.out' },
    );
  }, [selectedId, mode]);

  return (
    <div className={`tree${mode ? ` tree--${mode}` : ''}`} ref={containerRef}>
      {layout && (
        <svg
          ref={svgRef}
          className="tree__svg"
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          role="group"
          aria-label="Decision universe: one origin, three paths, six possible outcomes"
        >
          <defs>
            <linearGradient id="edge-gradient" x1="0" y1="0" x2={layout.width} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#8b5cf6" />
              <stop offset="0.6" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
            <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="tree__edges">
            {edges.map((edge) => (
              <g key={edge.id} className={`tree-edge tree-edge--${edge.state}`} data-depth={edge.depth}>
                <path className="tree-edge__line" d={edge.d} />
              </g>
            ))}
          </g>

          <g className="tree__flows" filter="url(#edge-glow)">
            {edges.map((edge) => (
              <path key={edge.id} className={`tree-edge__flow tree-edge__flow--${edge.state}`} d={edge.d} />
            ))}
          </g>

          <g className="tree__nodes">
            {layout.nodes.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                state={nodeState(node.id)}
                ariaLabel={ariaLabelFor(node, scenario)}
                onSelect={onSelect}
              />
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}
