import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { Landmark } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { useBuildings } from '../../hooks/useBuildings';

/**
 * Renders building markers on the MapLibre map with pixel-perfect centering.
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
      // Skip if coordinates are missing
      if (building.lat == null || building.lng == null) return;

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 1: Create wrapper container
      // ────────────────────────────────────────────────────────────────────────────
      const el = document.createElement('div');
      el.className = 'building-marker-wrapper';

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 2: Create icon container
      // ────────────────────────────────────────────────────────────────────────────
      const iconBox = document.createElement('div');
      iconBox.className = 'building-marker-icon';

      const iconRoot = createRoot(iconBox);
      iconRoot.render(
        <Landmark size={18} color="#FFFFFF" strokeWidth={2.2} />
      );

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 3: Create tooltip
      // ────────────────────────────────────────────────────────────────────────────
      const tooltip = document.createElement('div');
      tooltip.className = 'building-marker-tooltip';
      tooltip.textContent = building.name;

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 4: Assemble and Add Event Listeners
      // ────────────────────────────────────────────────────────────────────────────
      el.appendChild(iconBox);
      el.appendChild(tooltip);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onBuildingSelect?.(building);
      });

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 5: Create MapLibre marker
      // ────────────────────────────────────────────────────────────────────────────
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

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [mapInstance, buildings, isLoading, error, onBuildingSelect]);

  return null;
};

export default BuildingMarkers;
