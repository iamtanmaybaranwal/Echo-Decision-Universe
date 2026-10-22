import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Hero from '../Hero/Hero.jsx';
import QuestionForm from '../QuestionForm/QuestionForm.jsx';
import ExampleQuestions from '../ExampleQuestions/ExampleQuestions.jsx';
import { exampleQuestions } from '../../data/exampleQuestions';
import { prefersReducedMotion } from '../../lib/motion';
import './LandingPage.css';

const LandingPage = forwardRef(function LandingPage(
  { question, onQuestionChange, onExampleSelect, onExplore, error, errorKey, leaving, onExited },
  inputRef,
) {
  const rootRef = useRef(null);

  // Cinematic entrance.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero__eyebrow', { y: 14, opacity: 0, duration: 0.9 }, 0.2)
        .from('.hero__word', { yPercent: 110, duration: 1.2, ease: 'power4.out', stagger: 0.07 }, 0.3)
        .from('.hero__subtitle', { y: 18, opacity: 0, duration: 1 }, 0.9)
        .from('.question-form', { y: 24, opacity: 0, scale: 0.98, duration: 1.1 }, 1.05)
        .from('.examples__title', { opacity: 0, duration: 0.8 }, 1.3)
        .from('[data-example]', { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, 1.35);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Exit sequence once a question is launched.
  useEffect(() => {
    if (!leaving) return undefined;

    if (prefersReducedMotion()) {
      onExited();
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: onExited })
        .to('[data-example]', { y: 12, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.in' })
        .to('.examples__title, .question-form', { y: 16, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0.1)
        .to('.hero', { y: -30, opacity: 0, filter: 'blur(6px)', duration: 0.6, ease: 'power2.in' }, 0.2);
    }, rootRef);

    return () => ctx.kill();
  }, [leaving, onExited]);

  return (
    <main className="landing" ref={rootRef}>
      <Hero />
      <QuestionForm
        ref={inputRef}
        value={question}
        onChange={onQuestionChange}
        onSubmit={onExplore}
        error={error}
        errorKey={errorKey}
      />
      <ExampleQuestions
        examples={exampleQuestions}
        activeQuestion={question.trim()}
        onSelect={onExampleSelect}
      />
    </main>
  );
});

export default LandingPage;
