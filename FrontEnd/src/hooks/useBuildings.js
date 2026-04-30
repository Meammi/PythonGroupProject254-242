import { useState, useEffect } from 'react';
import { fetchBuildings } from '../services/buildingService';

/**
 * Custom hook to fetch and manage building data.
 * Handles loading state, errors, and caching the result.
 *
 * @returns {{ buildings: Array, isLoading: boolean, error: string|null }}
 */
export function useBuildings() {
  const [buildings, setBuildings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchBuildings();

        if (!cancelled) {
          setBuildings(result.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[useBuildings]', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { buildings, isLoading, error };
}
