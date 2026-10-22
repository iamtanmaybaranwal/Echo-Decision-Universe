import { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import QuestionInput, { MAX_QUESTION_LENGTH } from '../QuestionInput/QuestionInput.jsx';
import ExploreButton from '../ExploreButton/ExploreButton.jsx';
import { prefersReducedMotion } from '../../lib/motion';
import './QuestionForm.css';

const INPUT_ID = 'echo-question';
const HINT_ID = 'echo-question-hint';

/** Glass panel holding the question field and the primary CTA. */
const QuestionForm = forwardRef(function QuestionForm(
  { value, onChange, onSubmit, error, errorKey },
  inputRef,
) {
  const panelRef = useRef(null);

  // Shake the panel each time a new validation error is raised.
  useEffect(() => {
    if (!error || prefersReducedMotion()) return;
    gsap.fromTo(
      panelRef.current,
      { x: 0 },
      { keyframes: { x: [0, -10, 9, -6, 4, 0] }, duration: 0.45, ease: 'power1.out' },
    );
  }, [error, errorKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const remaining = MAX_QUESTION_LENGTH - value.length;

  return (
    <form className="question-form" onSubmit={handleSubmit} noValidate data-intro>
      <div
        ref={panelRef}
        className={`question-form__panel${error ? ' question-form__panel--error' : ''}`}
      >
        <svg className="question-form__orbit" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="3" fill="var(--cyan-soft)" />
          <circle cx="10" cy="10" r="8" fill="none" stroke="var(--line-strong)" strokeDasharray="2 3" />
        </svg>
        <QuestionInput
          ref={inputRef}
          id={INPUT_ID}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          invalid={Boolean(error)}
          describedBy={HINT_ID}
        />
        <ExploreButton />
      </div>

      <div className="question-form__meta" id={HINT_ID} aria-live="polite">
        {error ? (
          <span className="question-form__error">{error}</span>
        ) : (
          <span>
            Press <kbd>Enter</kbd> to explore
          </span>
        )}
        <span className={remaining < 30 ? 'question-form__count--low' : undefined}>
          {value.length}/{MAX_QUESTION_LENGTH}
        </span>
      </div>
    </form>
  );
});

export default QuestionForm;
