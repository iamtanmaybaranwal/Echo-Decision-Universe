import './ExampleQuestions.css';

export default function ExampleQuestions({ examples, activeQuestion, onSelect }) {
  return (
    <section className="examples" aria-labelledby="examples-title" data-intro>
      <h2 id="examples-title" className="examples__title">
        Or begin with someone else’s crossroads
      </h2>
      <ul className="examples__list">
        {examples.map((example, index) => {
          const selected = activeQuestion === example.question;
          return (
            <li key={example.id} className="examples__item" data-example>
              <button
                type="button"
                className={`examples__button${selected ? ' examples__button--selected' : ''}`}
                onClick={() => onSelect(example.question)}
                aria-pressed={selected}
              >
                <span className="examples__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="examples__body">
                  <span className="examples__label">{example.label}</span>
                  <span className="examples__question">{example.question}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
