import { useState, useEffect } from 'react';
import { fetchAllTemperatures } from '../services/buildingService';

/**
 * Fetches all temperature readings from the backend.
 * @returns {{ temperatures: Array, isLoading: boolean, error: string|null }}
 */
export function useAllTemperatures() {
  const [temperatures, setTemperatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchAllTemperatures();
        if (!cancelled) setTemperatures(result ?? []);
      } catch (err) {
        if (!cancelled) {
          console.error('[useAllTemperatures]', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { temperatures, isLoading, error };
}
