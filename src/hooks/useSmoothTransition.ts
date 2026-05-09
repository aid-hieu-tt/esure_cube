import { useState, useEffect, useRef } from 'react';

/**
 * Delay cập nhật data mới để tạo hiệu ứng transition mượt.
 * - Khi data thay đổi: set transitioning=true → delay → update → transitioning=false
 * - Component dùng `transitioning` để fade opacity
 */
export function useSmoothTransition<T>(
  newData: T | null,
  delay = 150
): { data: T | null; transitioning: boolean } {
  const [displayed, setDisplayed] = useState<T | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const prevRef = useRef<string>('');

  useEffect(() => {
    if (newData === null) return;

    const serialized = JSON.stringify(newData);
    if (serialized === prevRef.current) return; // No actual change
    prevRef.current = serialized;

    setTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayed(newData);
      setTransitioning(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [newData, delay]);

  return { data: displayed, transitioning };
}
