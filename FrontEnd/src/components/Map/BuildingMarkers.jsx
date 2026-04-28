import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { Landmark } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { useBuildings } from '../../hooks/useBuildings';

/**
 * Renders building markers on the MapLibre map.
 *
 * Each marker is a branded rounded-square with a Landmark icon,
 * and displays a tooltip with the building name on hover.
 *
 * This component renders nothing in the React tree —
 * it injects DOM elements into the MapLibre canvas via markers.
 *
 * @param {{ mapInstance: maplibregl.Map | null }} props
 */
const BuildingMarkers = ({ mapInstance }) => {
  const markersRef = useRef([]);
  const { buildings, isLoading, error } = useBuildings();

  useEffect(() => {
    if (!mapInstance || isLoading || error) return;

    // Clean up any existing markers before rendering new ones
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    buildings.forEach((building) => {
      if (building.lat == null || building.lng == null) return;

      // ── Marker container ────────────────────────────────────────────
      const el = document.createElement('div');
      el.className = 'building-marker-wrapper';

      // ── Icon element (rounded square with Landmark icon) ────────────
      const iconBox = document.createElement('div');
      iconBox.className = 'building-marker-icon';

      // Render Lucide icon into the iconBox using React
      const iconRoot = createRoot(iconBox);
      iconRoot.render(<Landmark size={18} color="#FFFFFF" strokeWidth={2.2} />);

      // ── Tooltip ─────────────────────────────────────────────────────
      const tooltip = document.createElement('div');
      tooltip.className = 'building-marker-tooltip';
      tooltip.textContent = building.name;

      el.appendChild(iconBox);
      el.appendChild(tooltip);

      // ── Create MapLibre marker ──────────────────────────────────────
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat([building.lng, building.lat])
        .addTo(mapInstance);

      markersRef.current.push(marker);
    });

    // Cleanup on unmount or dependency change
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [mapInstance, buildings, isLoading, error]);

  // This component handles DOM injection into MapLibre — renders nothing in React tree
  return null;
};

export default BuildingMarkers;
