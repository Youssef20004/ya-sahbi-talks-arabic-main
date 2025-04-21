
import { useState, useEffect } from 'react';

// Hook to automatically clear error messages after a delay
export const useErrorTimeout = (initialError: string = '', timeout: number = 5000) => {
  const [error, setError] = useState(initialError);
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), timeout);
      return () => clearTimeout(timer);
    }
  }, [error, timeout]);
  
  return [error, setError] as const;
};
