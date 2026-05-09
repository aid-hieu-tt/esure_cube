import { useRef } from 'react';

/**
 * Giữ lại data cũ khi data mới đang loading.
 * Chỉ update khi có data thật (không null/undefined).
 * → Chart/KPI không bao giờ bị blank khi đang refresh.
 */
export function usePreviousData<T>(current: T | null | undefined): T | null {
  const ref = useRef<T | null>(null);

  if (current !== null && current !== undefined) {
    ref.current = current;
  }

  return ref.current;
}
