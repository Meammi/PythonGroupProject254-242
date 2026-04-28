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
