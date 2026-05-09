import { useState, useEffect, useRef } from 'react';

/**
 * Animated counter: khi value thay đổi, đếm mượt từ giá trị cũ → mới.
 * Dùng easeOutCubic cho cảm giác decelerate tự nhiên.
 */
export function useAnimatedNumber(
  target: number,
  duration = 400
): number {
  const [current, setCurrent] = useState(target);
  const startRef = useRef(target);
  const frameRef = useRef<number>();

  useEffect(() => {
    const start = startRef.current;
    const diff = target - start;
    if (diff === 0) return;

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrent(Math.round(start + diff * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        startRef.current = target;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return current;
}
