import { useCallback, useRef, useState } from 'react';
import Starfield from './components/Starfield/Starfield.jsx';
import BranchingUniverse from './components/BranchingUniverse/BranchingUniverse.jsx';
import Header from './components/Header/Header.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import UniverseExplorer from './components/UniverseExplorer/UniverseExplorer.jsx';
import { useTypewriter } from './hooks/useTypewriter';
import { buildScenario } from './lib/scenarioEngine';
import './App.css';

const MIN_QUESTION_LENGTH = 8;

const BACKDROP_MODE = { landing: 'idle', leaving: 'bloom', exploring: 'hidden' };

/** phase: 'landing' → 'leaving' (exit animation) → 'exploring' */
export default function App() {
  const [question, setQuestion] = useState('');
  const [scenario, setScenario] = useState(null);
  const [error, setError] = useState('');
  const [errorKey, setErrorKey] = useState(0);
  const [phase, setPhase] = useState('landing');
  const inputRef = useRef(null);
  const { type, cancel } = useTypewriter(setQuestion);

  const raiseError = (message) => {
    setError(message);
    setErrorKey((k) => k + 1);
    inputRef.current?.focus();
  };

  const handleQuestionChange = (value) => {
    cancel();
    setQuestion(value);
    if (error) setError('');
  };

  const handleExampleSelect = (example) => {
    setError('');
    inputRef.current?.focus({ preventScroll: true });
    type(example);
  };

  const handleExplore = () => {
    if (phase !== 'landing') return;
    cancel();
    const trimmed = question.trim();

    if (!trimmed) {
      raiseError('Ask a question first, or pick one of the examples below.');
      return;
    }
    if (trimmed.length < MIN_QUESTION_LENGTH) {
      raiseError('Give your question a little more detail so it has room to branch.');
      return;
    }

    setQuestion(trimmed);
    setScenario(buildScenario(trimmed));
    setError('');
    setPhase('leaving');
  };

  const handleExited = useCallback(() => setPhase('exploring'), []);

  const handleBack = () => {
    setPhase('landing');
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  };

  const exploring = phase === 'exploring' && scenario;

  return (
    <div className={`app${exploring ? ' app--exploring' : ''}`}>
      <Starfield />
      <BranchingUniverse mode={BACKDROP_MODE[phase]} />

      <div className="app__content">
        <Header onHome={exploring ? handleBack : undefined} />

        {exploring ? (
          <UniverseExplorer key={scenario.id} scenario={scenario} onBack={handleBack} />
        ) : (
          <LandingPage
            ref={inputRef}
            question={question}
            onQuestionChange={handleQuestionChange}
            onExampleSelect={handleExampleSelect}
            onExplore={handleExplore}
            error={error}
            errorKey={errorKey}
            leaving={phase === 'leaving'}
            onExited={handleExited}
          />
        )}
      </div>
    </div>
  );
}
