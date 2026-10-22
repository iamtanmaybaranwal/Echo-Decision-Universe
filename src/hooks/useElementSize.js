import { useLayoutEffect, useState } from 'react';

/** Tracks an element's content-box size via ResizeObserver. */
export function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const update = (width, height) =>
      setSize((prev) =>
        prev.width === Math.round(width) && prev.height === Math.round(height)
          ? prev
          : { width: Math.round(width), height: Math.round(height) },
      );

    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    update(
      rect.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
      rect.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
    );

    const observer = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
