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
