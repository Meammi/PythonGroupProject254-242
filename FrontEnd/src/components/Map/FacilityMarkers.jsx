import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { createRoot } from 'react-dom/client';
import { Bath, Stethoscope, Coffee } from 'lucide-react';

/**
 * Icon lookup based on facility type name.
 * Bath is used for toilet facilities (cleaner icon than unavailable Toilet).
 */
const ICON_MAP = {
  'toilet':      Bath,
  'health-care': Stethoscope,
  'store':       Coffee,
};

/**
 * Renders facility markers on the MapLibre map with pixel-perfect centering.
 * This component MIRRORS BuildingMarkers' anti-drift strategy exactly.
 *
 * CRITICAL Anti-Drift Strategy (IDENTICAL to BuildingMarkers):
 *   1. anchor: 'center' → MapLibre MUST pin the element's center to the GPS coordinate
 *   2. rotationAlignment + pitchAlignment: 'viewport' → markers stay flat on screen
 *   3. Fixed wrapper dimensions (28×28, box-sizing: border-box)
 *   4. NO transform applied by CSS — MapLibre owns translate() positioning exclusively
 *   5. transform-origin: center center on wrapper AND pin → ensures precise rotation center
 *   6. will-change: transform on both elements → GPU layer promotion for smooth zoom
 *   7. Pin fills the wrapper completely (28×28) → no centering math needed
 *   8. Tooltip uses position: absolute with pointer-events: none → doesn't affect layout
 *
 * Differences from BuildingMarkers (SIZE ONLY):
 *   - Wrapper: 28×28 (vs 40×40)
 *   - Pin: 28×28 (vs 40×40)
 *   - Icon size: 14px (vs 18px)
 *   - All anti-drift logic remains identical
 *
 * Data Precision:
 *   - setLngLat([facility.lng, facility.lat]) receives raw float values from API
 *   - No rounding or transformation applied
 *   - MapLibre handles sub-pixel positioning internally
 *
 * @param {{
 *   mapInstance: maplibregl.Map | null,
 *   facilities: Array,
 *   selectedFloor: string,
 *   onFacilitySelect?: (facility) => void,
 * }} props
 */
const FacilityMarkers = React.memo(({ mapInstance, facilities, selectedFloor, onFacilitySelect }) => {
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapInstance) return;

    // Clean up any existing markers before rendering new ones
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Client-side floor filtering
    const visible = facilities.filter(
      (f) => selectedFloor === 'All' || f.floor === selectedFloor
    );

    visible.forEach((facility) => {
      // Skip if coordinates are missing
      if (facility.lat == null || facility.lng == null) return;

      // Resolve the facility type icon
      const typeName = facility.type?.name || 'store';
      const IconComponent = ICON_MAP[typeName] || Coffee;

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 1: Create wrapper container
      // ────────────────────────────────────────────────────────────────────────────
      // The wrapper is the element that MapLibre will position.
      // Its CENTER will be placed at [facility.lng, facility.lat] due to anchor:'center'
      const el = document.createElement('div');
      el.className = 'facility-marker-wrapper';

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 2: Create pin container (fills the wrapper, centered flex)
      // ────────────────────────────────────────────────────────────────────────────
      const pin = document.createElement('div');
      pin.className = 'facility-marker-pin';

      // Render the facility icon into the pin
      const iconRoot = createRoot(pin);
      iconRoot.render(
        <IconComponent size={14} color="#FFFFFF" strokeWidth={2.5} />
      );

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 3: Create tooltip (hidden until hover)
      // ────────────────────────────────────────────────────────────────────────────
      const tooltip = document.createElement('div');
      tooltip.className = 'facility-marker-tooltip';
      tooltip.textContent = facility.name;

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 4: Assemble the DOM tree
      // ────────────────────────────────────────────────────────────────────────────
      el.appendChild(pin);
      el.appendChild(tooltip);

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 5: Attach event listener
      // ────────────────────────────────────────────────────────────────────────────
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onFacilitySelect?.(facility);
      });

      // ────────────────────────────────────────────────────────────────────────────
      // STEP 6: Create MapLibre marker with UNIFIED anchor strategy
      // ────────────────────────────────────────────────────────────────────────────
      // CRITICAL: anchor: 'center' is non-negotiable for drift-free behavior
      // This is IDENTICAL to BuildingMarkers — the only differences are icon and size
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',              // ✅ CRITICAL: Pin the element's center to GPS coordinate
        rotationAlignment: 'viewport', // ✅ Keep marker flat on screen (don't rotate with map)
        pitchAlignment: 'viewport',    // ✅ Keep marker flat when map is tilted
      })
        .setLngLat([facility.lng, facility.lat]) // ✅ Raw float coordinates, no rounding
        .addTo(mapInstance);

      markersRef.current.push(marker);
    });

    // Cleanup: Remove all markers when component unmounts or dependencies change
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [mapInstance, facilities, selectedFloor, onFacilitySelect]);

  return null; // Markers are rendered via MapLibre DOM, not React
});

FacilityMarkers.displayName = 'FacilityMarkers';

export default FacilityMarkers;

