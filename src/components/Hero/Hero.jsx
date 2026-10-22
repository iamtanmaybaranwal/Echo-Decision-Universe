import './Hero.css';

const HEADLINE = ['Every', 'choice', 'creates', 'a', 'new'];

export default function Hero() {
  return (
    <div className="hero">
      <p className="hero__eyebrow" data-intro>
        <span className="hero__eyebrow-line" aria-hidden="true" />
        A decision explorer
      </p>

      <h1 className="hero__title">
        {HEADLINE.map((word) => (
          <span className="hero__word-mask" key={word}>
            <span className="hero__word">{word}</span>
          </span>
        ))}
        <span className="hero__word-mask">
          <span className="hero__word hero__word--accent">verse</span>
        </span>
      </h1>

      <p className="hero__subtitle" data-intro>
        Ask the question you keep circling. Watch it split into the futures it could
        become, and walk each one before you choose.
      </p>
    </div>
  );
}
