import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import DecisionTree from '../DecisionTree/DecisionTree.jsx';
import DetailPanel from '../DetailPanel/DetailPanel.jsx';
import { prefersReducedMotion } from '../../lib/motion';
import './UniverseExplorer.css';

/**
 * Full-screen decision universe. Owns the selection state:
 * which branch is selected and, within it, which outcome.
 */
export default function UniverseExplorer({ scenario, onBack }) {
  const rootRef = useRef(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState(null);
  // Mobile bottom sheet starts collapsed so the tree is visible first.
  const [sheetOpen, setSheetOpen] = useState(false);

  const select = useCallback(
    (id) => {
      setSheetOpen(true);
      if (id === 'root') {
        setSelectedBranchId(null);
        setSelectedOutcomeId(null);
        return;
      }
      const branch = scenario.branches.find((b) => b.id === id);
      if (branch) {
        setSelectedBranchId(branch.id);
        setSelectedOutcomeId(null);
        return;
      }
      const parent = scenario.branches.find((b) => b.outcomes.some((o) => o.id === id));
      if (parent) {
        setSelectedBranchId(parent.id);
        setSelectedOutcomeId(id);
      }
    },
    [scenario],
  );

  // Escape steps back up the tree: outcome → path → origin.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (selectedOutcomeId) select(selectedBranchId);
      else if (selectedBranchId) select('root');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [select, selectedBranchId, selectedOutcomeId]);

  // The landing form that held focus is gone; land keyboard/screen-reader users here.
  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.explorer__bar > *', { y: -12, opacity: 0, duration: 0.7, stagger: 0.08 })
        .from('.tree', { opacity: 0, scale: 0.985, duration: 1 }, 0)
        .from('.detail', { x: 30, opacity: 0, duration: 0.9 }, 0.6);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const selection = { branchId: selectedBranchId, outcomeId: selectedOutcomeId };

  return (
    <main className={`explorer${sheetOpen ? ' explorer--sheet-open' : ''}`} ref={rootRef}>
      <div className="explorer__bar">
        <button type="button" className="explorer__back" onClick={onBack} aria-label="New question">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M9 3L5 7l4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="explorer__back-label">New question</span>
        </button>
        <div className="explorer__heading">
          <p className="explorer__eyebrow">
            Decision universe · {scenario.theme.label}
          </p>
          <h1 className="explorer__question" title={scenario.question} ref={headingRef} tabIndex={-1}>
            {scenario.question}
          </h1>
        </div>
        <p className="explorer__legend" aria-hidden="true">
          <span className="explorer__legend-item explorer__legend-item--bright">Flourishing</span>
          <span className="explorer__legend-item explorer__legend-item--mixed">Mixed</span>
          <span className="explorer__legend-item explorer__legend-item--shadow">Hard lesson</span>
        </p>
      </div>

      <div className="explorer__stage">
        <DecisionTree scenario={scenario} selection={selection} onSelect={select} />
        <DetailPanel
          scenario={scenario}
          selection={selection}
          onSelect={select}
          collapsed={!sheetOpen}
          onToggle={() => setSheetOpen((open) => !open)}
        />
      </div>
    </main>
  );
}
