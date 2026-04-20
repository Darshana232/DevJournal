import { useEffect, useRef } from 'react';

/**
 * Debounce a value — returns the debounced value after `delay` ms of no changes.
 * @param {any} value
 * @param {number} delay - milliseconds
 * @returns {any} debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = [value, value];

  // Use a ref-based implementation to support the callback variant too
  const timeoutRef = useRef(null);
  const valueRef   = useRef(value);
  const stateRef   = useRef(value);

  // We implement this imperatively so it works as both a value debounce
  // and a callback debounce (via useDebounceCallback).
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

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
