"use client";

import { useState, useEffect } from "react";

/** 값 변경 후 일정 시간(delay ms) 동안 추가 변경이 없을 때만 값을 반영하는 훅 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
