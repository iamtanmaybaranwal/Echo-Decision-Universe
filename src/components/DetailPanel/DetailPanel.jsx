import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { TONES } from '../../data/scenarioLibrary';
import { prefersReducedMotion } from '../../lib/motion';
import './DetailPanel.css';

function OutcomeLink({ outcome, onSelect }) {
  return (
    <button type="button" className={`detail__link detail__link--${outcome.tone}`} onClick={() => onSelect(outcome.id)}>
      <span className="detail__link-dot" aria-hidden="true" />
      <span className="detail__link-body">
        <span className="detail__link-title">{outcome.title}</span>
        <span className="detail__link-meta">
          {outcome.likelihood}% · {TONES[outcome.tone].label} · {outcome.timeframe}
        </span>
      </span>
      <span className="detail__link-arrow" aria-hidden="true">→</span>
    </button>
  );
}

function RootDetail({ scenario, onSelect }) {
  return (
    <>
      <p className="detail__eyebrow" data-animate>
        Origin · {scenario.theme.label}
      </p>
      <h2 className="detail__title detail__title--question" data-animate>
        “{scenario.question}”
      </h2>
      <p className="detail__description" data-animate>
        Every path below starts from this moment. Choose one to see how it could unfold, then
        follow it to the futures waiting at its end.
      </p>
      <section className="detail__section" data-animate>
        <h3 className="detail__section-title">Three paths</h3>
        <div className="detail__links">
          {scenario.branches.map((branch) => (
            <button key={branch.id} type="button" className="detail__link" onClick={() => onSelect(branch.id)}>
              <span className="detail__letter" aria-hidden="true">{branch.letter}</span>
              <span className="detail__link-body">
                <span className="detail__link-title">{branch.title}</span>
                <span className="detail__link-meta">{branch.tag} path · 2 outcomes</span>
              </span>
              <span className="detail__link-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function BranchDetail({ branch, onSelect }) {
  return (
    <>
      <p className="detail__eyebrow" data-animate>
        Path {branch.letter} · {branch.tag}
      </p>
      <h2 className="detail__title" data-animate>
        {branch.title}
      </h2>
      <p className="detail__description" data-animate>
        {branch.description}
      </p>
      <section className="detail__section" data-animate>
        <h3 className="detail__section-title">First steps</h3>
        <ol className="detail__steps">
          {branch.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <section className="detail__section" data-animate>
        <h3 className="detail__section-title">Where it can lead</h3>
        <div className="detail__links">
          {branch.outcomes.map((outcome) => (
            <OutcomeLink key={outcome.id} outcome={outcome} onSelect={onSelect} />
          ))}
        </div>
      </section>
      <button type="button" className="detail__back" onClick={() => onSelect('root')} data-animate>
        ← Back to origin
      </button>
    </>
  );
}

function OutcomeDetail({ branch, outcome, onSelect }) {
  const sibling = branch.outcomes.find((o) => o.id !== outcome.id);

  return (
    <>
      <p className="detail__eyebrow" data-animate>
        Outcome · Path {branch.letter}
      </p>
      <h2 className="detail__title" data-animate>
        {outcome.title}
      </h2>
      <p className="detail__description" data-animate>
        {outcome.description}
      </p>

      <dl className="detail__stats" data-animate>
        <div className={`detail__stat detail__stat--wide detail__stat--${outcome.tone}`}>
          <dt>Likelihood on this path</dt>
          <dd>
            <span className="detail__stat-value">{outcome.likelihood}%</span>
            <span className="detail__meter" aria-hidden="true">
              <span className="detail__meter-fill" style={{ width: `${outcome.likelihood}%` }} />
            </span>
          </dd>
        </div>
        <div className="detail__stat">
          <dt>Timeframe</dt>
          <dd>{outcome.timeframe}</dd>
        </div>
        <div className={`detail__stat detail__stat--${outcome.tone}`}>
          <dt>Tone</dt>
          <dd>{TONES[outcome.tone].label}</dd>
        </div>
      </dl>

      <section className="detail__section" data-animate>
        <h3 className="detail__section-title">Signs you are on this path</h3>
        <ul className="detail__signals">
          {outcome.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </section>

      <section className="detail__section" data-animate>
        <h3 className="detail__section-title">The other way this path can go</h3>
        <div className="detail__links">
          <OutcomeLink outcome={sibling} onSelect={onSelect} />
        </div>
      </section>

      <button type="button" className="detail__back" onClick={() => onSelect(branch.id)} data-animate>
        ← Back to path {branch.letter}: {branch.title}
      </button>
    </>
  );
}

/**
 * Side panel (desktop) / bottom sheet (mobile) describing the selected node.
 * `collapsed` and the handle only take effect in the mobile bottom-sheet layout.
 */
export default function DetailPanel({ scenario, selection, onSelect, collapsed, onToggle }) {
  const rootRef = useRef(null);
  const branch = scenario.branches.find((b) => b.id === selection.branchId);
  const outcome = branch?.outcomes.find((o) => o.id === selection.outcomeId);
  const key = outcome?.id || branch?.id || 'root';

  useLayoutEffect(() => {
    rootRef.current.scrollTop = 0;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('[data-animate]', { y: 12, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
      gsap.from('.detail__meter-fill', { width: 0, duration: 0.9, delay: 0.2, ease: 'power3.out' });
    }, rootRef);
    return () => ctx.revert();
  }, [key]);

  let content;
  if (outcome) content = <OutcomeDetail branch={branch} outcome={outcome} onSelect={onSelect} />;
  else if (branch) content = <BranchDetail branch={branch} onSelect={onSelect} />;
  else content = <RootDetail scenario={scenario} onSelect={onSelect} />;

  return (
    <aside
      className={`detail${collapsed ? ' detail--collapsed' : ''}`}
      ref={rootRef}
      aria-label="Selected node details"
      aria-live="polite"
    >
      <button
        type="button"
        className="detail__handle"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-controls="detail-body"
      >
        <span className="detail__handle-bar" aria-hidden="true" />
        <span className="detail__handle-label">{collapsed ? 'Show details' : 'Hide details'}</span>
      </button>
      <div id="detail-body" className="detail__body">
        {content}
      </div>
    </aside>
  );
}
