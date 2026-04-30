import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { Landmark } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { useBuildings } from '../../hooks/useBuildings';

/**
 * Renders building markers on the MapLibre map with pixel-perfect centering.
 *
 * CRITICAL Anti-Drift Strategy:
 *   1. anchor: 'center' → MapLibre MUST pin the element's center to the GPS coordinate
 *   2. rotationAlignment + pitchAlignment: 'viewport' → markers stay flat on screen
 *   3. Fixed wrapper dimensions (40×40, box-sizing: border-box)
 *   4. NO transform applied by CSS — MapLibre owns translate() positioning exclusively
 *   5. transform-origin: center center on wrapper AND icon → ensures precise rotation center
 *   6. will-change: transform on both elements → GPU layer promotion for smooth zoom
 *   7. Icon fills the wrapper completely (40×40) → no centering math needed
 *   8. Tooltip uses position: absolute with pointer-events: none → doesn't affect layout
 *
 * Data Precision:
 *   - setLngLat([building.lng, building.lat]) receives raw float values from API
 *   - No rounding or transformation applied
 *   - MapLibre handles sub-pixel positioning internally
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
      // The wrapper is the element that MapLibre will position.
      // Its CENTER will be placed at [building.lng, building.lat] due to anchor:'center'
      const el = document.createElement('div');
      el.className = 'building-marker-wrapper';

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 2: Create icon container (fills the wrapper, centered flex)
      // ────────────────────────────────────────────────────────────────────────────
      const iconBox = document.createElement('div');
      iconBox.className = 'building-marker-icon';

      // Render the Landmark icon into the icon box
      const iconRoot = createRoot(iconBox);
      iconRoot.render(
        <Landmark size={18} color="#FFFFFF" strokeWidth={2.2} />
      );

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 3: Create tooltip (hidden until hover)
      // ────────────────────────────────────────────────────────────────────────────
      const tooltip = document.createElement('div');
      tooltip.className = 'building-marker-tooltip';
      tooltip.textContent = building.name;

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 4: Assemble the DOM tree
      // ────────────────────────────────────────────────────────────────────────────
      el.appendChild(iconBox);
      el.appendChild(tooltip);

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 5: Attach event listener
      // ────────────────────────────────────────────────────────────────────────────
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onBuildingSelect?.(building);
      });

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 6: Create MapLibre marker with UNIFIED anchor strategy
      // ────────────────────────────────────────────────────────────────────────────
      // CRITICAL: anchor: 'center' is non-negotiable for drift-free behavior
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',              // ✅ CRITICAL: Pin the element's center to GPS coordinate
        rotationAlignment: 'viewport', // ✅ Keep marker flat on screen (don't rotate with map)
        pitchAlignment: 'viewport',    // ✅ Keep marker flat when map is tilted
      })
        .setLngLat([building.lng, building.lat]) // ✅ Raw float coordinates, no rounding
        .addTo(mapInstance);

      markersRef.current.push(marker);
    });

    // Cleanup: Remove all markers when component unmounts or dependencies change
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [mapInstance, buildings, isLoading, error, onBuildingSelect]);

  return null; // Markers are rendered via MapLibre DOM, not React
};

export default BuildingMarkers;
