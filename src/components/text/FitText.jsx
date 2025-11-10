import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";

/**
 * FitText – auto-scales a single-line text to fill the container width (JS version).
 *
 * How it works:
 *  - Render an invisible "measurer" span at 100px to read intrinsic width.
 *  - Target font size = (containerWidth * 100) / measuredWidth.
 *  - Clamp with min/max and apply to visible text.
 *  - ResizeObserver keeps it responsive.
 */

function useResizeObserver(ref, onResize) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => onResize());
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, onResize]);
}

export default function FitText({
  text,
  min = 12,
  max = 256,
  horizontalPadding = 0,
  className = "flex items-center justify-center h-fit",
  textClassName = "orbitron font-black leading-none whitespace-nowrap",
  containerRef,
}) {
  const localContainerRef = useRef(null);
  const setContainerRef = (node) => {
    localContainerRef.current = node;
    if (typeof containerRef === "function") containerRef(node);
    else if (containerRef && typeof containerRef === "object") containerRef.current = node;
  };

  const measureRef = useRef(null);
  const [fontSize, setFontSize] = useState(min);

  const recalc = useCallback(() => {
    const container = localContainerRef.current;
    const measurer = measureRef.current;
    if (!container || !measurer) return;

    const available = Math.max(0, container.clientWidth - horizontalPadding * 2);
    if (available === 0) return;

    measurer.style.fontSize = "100px";
    const measured = measurer.offsetWidth;
    if (measured === 0) return;

    const target = (available * 100) / measured;
    const clamped = Math.max(min, Math.min(max, target));
    setFontSize(clamped);
  }, [horizontalPadding, min, max]);

  useResizeObserver(localContainerRef, recalc);

  useLayoutEffect(() => {
    recalc();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => recalc());
    }
  }, [text, recalc]);

  return (
    <div ref={setContainerRef} className={className}>
      {/* Visible text */}
      <span className={textClassName} style={{ fontSize: `${fontSize}px` }}>
        {text}
      </span>

      {/* Invisible measurer – same styles as visible text so metrics match */}
      <span
        ref={measureRef}
        aria-hidden
        className={`${textClassName} absolute opacity-0 pointer-events-none select-none whitespace-nowrap`}
        style={{ position: "absolute", visibility: "hidden", whiteSpace: "nowrap" }}
      >
        {text}
      </span>
    </div>
  );
}
