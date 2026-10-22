import { forwardRef, useLayoutEffect, useRef, useImperativeHandle } from 'react';
import './QuestionInput.css';

export const MAX_QUESTION_LENGTH = 220;

/**
 * Auto-growing single-question textarea. Enter submits; Shift+Enter is ignored
 * so the question stays one thought.
 */
const QuestionInput = forwardRef(function QuestionInput(
  { id, value, onChange, onSubmit, invalid, describedBy },
  ref,
) {
  const textareaRef = useRef(null);
  useImperativeHandle(ref, () => textareaRef.current);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!e.shiftKey) onSubmit?.();
    }
  };

  const handleChange = (e) => onChange(e.target.value.replace(/\n/g, ' '));

  return (
    <div className={`question-input${invalid ? ' question-input--invalid' : ''}`}>
      <label htmlFor={id} className="visually-hidden">
        Your question about a decision
      </label>
      <textarea
        id={id}
        ref={textareaRef}
        className="question-input__field"
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        maxLength={MAX_QUESTION_LENGTH}
        placeholder="What if I said yes to…"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        autoComplete="off"
        spellCheck="true"
        enterKeyHint="go"
      />
    </div>
  );
});

export default QuestionInput;
