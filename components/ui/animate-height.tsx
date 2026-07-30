"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/src/lib/cn";

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
  } else {
    ref.current = value;
  }
}

export function AnimateHeight({
  children,
  className,
  contentClassName,
  style,
  durationMs = 300,
  ref,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  durationMs?: number;
  ref?: Ref<HTMLDivElement | null>;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>();
  const [canTransition, setCanTransition] = useState(false);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const outer = outerRef.current;
    if (!content || !outer) return;

    const measure = () => {
      let next = content.scrollHeight;
      const maxHeight = parseFloat(getComputedStyle(outer).maxHeight);
      if (Number.isFinite(maxHeight) && maxHeight > 0) {
        next = Math.min(next, maxHeight);
      }
      setHeight(next);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [children]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCanTransition(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={(node) => {
        outerRef.current = node;
        assignRef(ref, node);
      }}
      className={cn(
        "overflow-hidden",
        canTransition &&
          "transition-[height] ease-in-out motion-reduce:transition-none",
        className,
      )}
      style={{
        ...style,
        height: height !== undefined ? `${height}px` : undefined,
        transitionDuration: canTransition ? `${durationMs}ms` : undefined,
      }}
    >
      <div ref={contentRef} className={contentClassName}>
        {children}
      </div>
    </div>
  );
}
