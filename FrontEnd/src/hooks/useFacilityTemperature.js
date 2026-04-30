import { useState, useEffect } from 'react';
import { fetchFacilityTemperature } from '../services/facilityService';

/**
 * Fetches the temperature reading for a facility.
 * Returns null gracefully when no temperature data exists (404).
 *
 * @param {number|null} facilityId
 * @returns {{ temperature: number|null, isLoading: boolean, error: string|null }}
 */
export function useFacilityTemperature(facilityId) {
  const [temperature, setTemperature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (facilityId == null) {
      setTemperature(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchFacilityTemperature(facilityId);
        if (!cancelled) setTemperature(data?.temperature ?? null);
      } catch (err) {
        if (!cancelled) {
          console.error('[useFacilityTemperature]', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [facilityId]);

  return { temperature, isLoading, error };
}
