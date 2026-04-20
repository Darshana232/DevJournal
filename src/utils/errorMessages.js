/**
 * Generic error message helper (simplified after removing Firebase).
 */
export function getErrorMessage(error) {
  if (!error) return 'An unexpected error occurred.';

  if (typeof error === 'string') return error;

  return error?.message || 'An unexpected error occurred.';
}
