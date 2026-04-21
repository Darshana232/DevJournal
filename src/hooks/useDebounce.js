import { useState, useEffect, useRef } from 'react';

/**
 * Debounce a value — returns the debounced value after `delay` ms of no changes.
 * @param {any} value
 * @param {number} delay - milliseconds
 * @returns {any} debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timer whenever value or delay changes
    clearTimeout(timeoutRef.current);
    // Set a new timer — only updates debouncedValue after the delay
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer on unmount or before next effect run
    return () => clearTimeout(timeoutRef.current);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Returns a debounced version of `fn` that fires after `delay` ms.
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function} debounced function
 */
export function useDebounceCallback(fn, delay = 500) {
  const timeoutRef = useRef(null);
  const fnRef      = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return (...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fnRef.current(...args);
    }, delay);
  };
}
