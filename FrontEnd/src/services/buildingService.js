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

/**
 * Fetches the temperature reading for a specific building.
 * @param {number} buildingId
 * @returns {Promise<{ id: number, building_id: number, temperature: number, created_at: string } | null>}
 */
export async function fetchBuildingTemperature(buildingId) {
  const response = await fetch(`${API_BASE_URL}/temperatures/building/${buildingId}`);

  if (response.status === 404) {
    return null; // No temperature data available
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch building temperature (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetches all temperature readings.
 * @returns {Promise<Array<{ id: number, building_id: number, temperature: number, created_at: string }>>}
 */
export async function fetchAllTemperatures() {
  const response = await fetch(`${API_BASE_URL}/temperatures/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch all temperatures (HTTP ${response.status})`);
  }

  return response.json();
}
