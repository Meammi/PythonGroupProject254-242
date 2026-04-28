import { useState, useEffect } from 'react';
import { fetchFacilities } from '../services/facilityService';

/**
 * Custom hook to fetch facilities for a building.
 * @param {number|null} buildingId
 * @returns {{ facilities: Array, isLoading: boolean, error: string|null }}
 */
export function useFacilities(buildingId) {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (buildingId == null) {
      setFacilities([]);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchFacilities(buildingId);
        if (!cancelled) setFacilities(result.data ?? []);
      } catch (err) {
        if (!cancelled) {
          console.error('[useFacilities]', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [buildingId]);

  return { facilities, isLoading, error };
}
