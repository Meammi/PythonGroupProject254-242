import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { createRoot } from 'react-dom/client';
import { Toilet, Stethoscope, Coffee } from 'lucide-react';

/**
 * Icon lookup based on facility type name.
 */
const ICON_MAP = {
  'toilet':      Toilet,
  'health-care': Stethoscope,
  'store':       Coffee,
};

/**
 * Renders facility markers on the MapLibre map.
 *
 * Mirrors the BuildingMarkers anti-drift strategy exactly:
 *   - anchor: 'center', viewport alignment, no CSS transform on wrapper.
 *   - Fixed wrapper dimensions (28×28), box-sizing: border-box.
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

    // Cleanup previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Client-side floor filter
    const visible = facilities.filter(
      (f) => selectedFloor === 'All' || f.floor === selectedFloor
    );

    visible.forEach((facility) => {
      if (facility.lat == null || facility.lng == null) return;

      const typeName = facility.type?.name || 'store';
      const IconComponent = ICON_MAP[typeName] || Coffee;

      // ── Marker container ──────────────────────────────────────────
      const el = document.createElement('div');
      el.className = 'facility-marker-wrapper';

      // ── Pin ───────────────────────────────────────────────────────
      const pin = document.createElement('div');
      pin.className = 'facility-marker-pin';

      const iconRoot = createRoot(pin);
      iconRoot.render(<IconComponent size={14} color="#FFFFFF" strokeWidth={2.5} />);

      // ── Tooltip ───────────────────────────────────────────────────
      const tooltip = document.createElement('div');
      tooltip.className = 'facility-marker-tooltip';
      tooltip.textContent = facility.name;

      el.appendChild(pin);
      el.appendChild(tooltip);

      // ── Click handler → open detail card ───────────────────────────
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onFacilitySelect?.(facility);
      });

      // ── Create MapLibre marker (unified with BuildingMarkers) ─────
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
        rotationAlignment: 'viewport',
        pitchAlignment: 'viewport',
      })
        .setLngLat([facility.lng, facility.lat])
        .addTo(mapInstance);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [mapInstance, facilities, selectedFloor, onFacilitySelect]);

  return null;
});

FacilityMarkers.displayName = 'FacilityMarkers';

export default FacilityMarkers;

