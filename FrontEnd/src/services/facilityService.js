import { API_BASE_URL } from '../data/constants';

/**
 * Fetches floors for a specific building.
 * @param {number} buildingId
 * @returns {Promise<{ data: Array<{ id: number, code: string }> }>}
 */
export async function fetchFloors(buildingId) {
  const response = await fetch(`${API_BASE_URL}/buildings/${buildingId}/floors`);

  if (!response.ok) {
    throw new Error(`Failed to fetch floors (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetches facilities for a specific building.
 * @param {number} buildingId
 * @returns {Promise<{ data: Array<{ id, name, lat, lng, floor, type }> }>}
 */
export async function fetchFacilities(buildingId) {
  const response = await fetch(`${API_BASE_URL}/buildings/${buildingId}/facilities`);

  if (!response.ok) {
    throw new Error(`Failed to fetch facilities (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetches a single facility's full detail by ID.
 * @param {number} facilityId
 * @returns {Promise<{ id, name, lat, lng, description, is_active, floor, type, building_name, building_code }>}
 */
export async function fetchFacilityById(facilityId) {
  const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch facility ${facilityId} (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetches the temperature reading for a specific facility.
 * @param {number} facilityId
 * @returns {Promise<{ temperature: number, ... } | null>}
 */
export async function fetchFacilityTemperature(facilityId) {
  const response = await fetch(`${API_BASE_URL}/temperatures/facility/${facilityId}`);

  if (response.status === 404) {
    return null; // No temperature data available
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch temperature (HTTP ${response.status})`);
  }

  return response.json();
}

