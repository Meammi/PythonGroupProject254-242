import { useState, useEffect } from 'react';
import { fetchBuildingById } from '../services/buildingService';

/**
 * Custom hook to fetch a single building's detail.
 * Re-fetches when buildingId changes. Returns null data when ID is null.
 *
 * @param {number|null} buildingId
 * @returns {{ building: object|null, isLoading: boolean, error: string|null }}
 */
export function useBuildingDetail(buildingId) {
  const [building, setBuilding] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (buildingId == null) {
      setBuilding(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchBuildingById(buildingId);

        if (!cancelled) {
          setBuilding(result);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[useBuildingDetail]', err);
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
  }, [buildingId]);

  return { building, isLoading, error };
}
