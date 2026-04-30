import { useState, useEffect } from 'react';
import { fetchBuildingTemperature } from '../services/buildingService';

/**
 * Fetches the temperature reading for a building.
 * Returns null gracefully when no temperature data exists (404).
 *
 * @param {number|null} buildingId
 * @returns {{ temperature: number|null, isLoading: boolean, error: string|null }}
 */
export function useBuildingTemperature(buildingId) {
  const [temperature, setTemperature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (buildingId == null) {
      setTemperature(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchBuildingTemperature(buildingId);
        if (!cancelled) setTemperature(data?.temperature ?? null);
      } catch (err) {
        if (!cancelled) {
          console.error('[useBuildingTemperature]', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [buildingId]);

  return { temperature, isLoading, error };
}
