'use client';

import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of the provided value. The value only updates after
 * the specified delay has elapsed without another change, which prevents rapid
 * network calls while the user types.
 */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
