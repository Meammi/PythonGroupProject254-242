import { useState, useEffect } from 'react';
import { fetchFloors } from '../services/facilityService';

/**
 * Custom hook to fetch floors for a building.
 * @param {number|null} buildingId
 * @returns {{ floors: Array<{ id: number, code: string }>, isLoading: boolean, error: string|null }}
 */
export function useFloors(buildingId) {
  const [floors, setFloors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (buildingId == null) {
      setFloors([]);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchFloors(buildingId);
        if (!cancelled) setFloors(result.data ?? []);
      } catch (err) {
        if (!cancelled) {
          console.error('[useFloors]', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [buildingId]);

  return { floors, isLoading, error };
}
