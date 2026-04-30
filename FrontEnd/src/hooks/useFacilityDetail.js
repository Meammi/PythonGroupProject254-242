import { useState, useEffect } from 'react';
import { fetchFacilityById } from '../services/facilityService';

/**
 * Fetches a single facility's full detail by ID.
 * Resets when facilityId becomes null.
 *
 * @param {number|null} facilityId
 * @returns {{ facility: object|null, isLoading: boolean, error: string|null }}
 */
export function useFacilityDetail(facilityId) {
  const [facility, setFacility] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (facilityId == null) {
      setFacility(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchFacilityById(facilityId);
        if (!cancelled) setFacility(data);
      } catch (err) {
        if (!cancelled) {
          console.error('[useFacilityDetail]', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [facilityId]);

  return { facility, isLoading, error };
}
