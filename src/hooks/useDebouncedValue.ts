import { useEffect, useState } from 'react';

/** 웹 SearchPage의 300ms 디바운스 대응 — 타이핑이 멈춘 뒤에만 검색을 보낸다. */
export const useDebouncedValue = <T>(value: T, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
