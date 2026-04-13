import { useState, useCallback } from 'react';

export function useTimedError(duration = 4000) {
  const [error, setErrorState] = useState(null);

  const setError = useCallback((msg) => {
    setErrorState(msg);
    if (msg) {
      setTimeout(() => setErrorState(null), duration);
    }
  }, [duration]);

  return [error, setError];
}
