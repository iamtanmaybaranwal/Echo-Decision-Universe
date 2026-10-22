import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/motion';

/**
 * Types `text` into a controlled value by calling `setValue` progressively.
 * Returns { type, cancel }. Starting a new run cancels the previous one.
 */
export function useTypewriter(setValue) {
  const tweenRef = useRef(null);

  const cancel = useCallback(() => {
    tweenRef.current?.kill();
    tweenRef.current = null;
  }, []);

  const type = useCallback(
    (text, { onComplete } = {}) => {
      cancel();

      if (prefersReducedMotion()) {
        setValue(text);
        onComplete?.();
        return;
      }

      const proxy = { n: 0 };
      tweenRef.current = gsap.to(proxy, {
        n: text.length,
        duration: Math.min(1.1, 0.18 + text.length * 0.018),
        ease: 'none',
        onUpdate: () => setValue(text.slice(0, Math.round(proxy.n))),
        onComplete: () => {
          setValue(text);
          tweenRef.current = null;
          onComplete?.();
        },
      });
    },
    [cancel, setValue],
  );

  useEffect(() => cancel, [cancel]);

  return { type, cancel };
}
