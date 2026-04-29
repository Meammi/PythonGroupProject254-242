import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { Landmark } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { useBuildings } from '../../hooks/useBuildings';

/**
 * Renders building markers on the MapLibre map.
 *
 * Anti-drift strategy:
 *   - anchor: 'center' → MapLibre pins the element's center to the GPS point.
 *   - No CSS transform on the wrapper — let MapLibre own the positioning.
 *   - Fixed wrapper dimensions (40×40) so MapLibre can calculate the center offset.
 *   - rotationAlignment + pitchAlignment = 'viewport' → flat on screen at all angles.
 *   - will-change: transform in CSS → GPU compositing for smooth zoom transitions.
 *
 * @param {{ mapInstance: maplibregl.Map | null, onBuildingSelect?: (building) => void }} props
 */
const BuildingMarkers = ({ mapInstance, onBuildingSelect }) => {
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

      const iconRoot = createRoot(iconBox);
      iconRoot.render(<Landmark size={18} color="#FFFFFF" strokeWidth={2.2} />);

      // ── Tooltip ─────────────────────────────────────────────────────
      const tooltip = document.createElement('div');
      tooltip.className = 'building-marker-tooltip';
      tooltip.textContent = building.name;

      el.appendChild(iconBox);
      el.appendChild(tooltip);

      // ── Click handler → open detail card ─────────────────────────────
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onBuildingSelect?.(building);
      });

      // ── Create MapLibre marker (unified anchor system) ──────────────
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
        rotationAlignment: 'viewport',
        pitchAlignment: 'viewport',
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
  }, [mapInstance, buildings, isLoading, error, onBuildingSelect]);

  return null;
};

export default BuildingMarkers;
