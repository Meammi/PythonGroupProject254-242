import { API_BASE_URL } from '../data/constants';

/**
 * Fetches all buildings from the backend API.
 * @returns {Promise<{ data: Array<{ id: number, code: string, name: string, lat: number, lng: number }> }>}
 */
export async function fetchBuildings() {
  const response = await fetch(`${API_BASE_URL}/buildings`);

  if (!response.ok) {
    throw new Error(`Failed to fetch buildings (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetches a single building's detail by ID.
 * @param {number} buildingId
 * @returns {Promise<{ id: number, name: string, lat: number, lng: number, description: string|null }>}
 */
export async function fetchBuildingById(buildingId) {
  const response = await fetch(`${API_BASE_URL}/buildings/${buildingId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch building ${buildingId} (HTTP ${response.status})`);
  }

  return response.json();
}
