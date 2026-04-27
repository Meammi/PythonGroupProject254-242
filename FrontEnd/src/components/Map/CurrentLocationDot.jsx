import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { MAP_CONFIG, GEO_CONFIG } from '../../data/constants';

const CurrentLocationDot = ({ mapInstance }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapInstance) return;
    if (!('geolocation' in navigator)) {
      console.warn("Geolocation is not supported by your browser");
      return;
    }

    // Container for the dot to allow positioning of the glow
    const el = document.createElement('div');
    el.className = 'relative flex items-center justify-center w-6 h-6';

    // The solid, 100% opaque core with linear gradient from TU Gold to TU Red
    const dot = document.createElement('div');
    dot.style.background = 'linear-gradient(to bottom right, var(--color-tu-gold), var(--color-tu-red))';
    
    // Add the diffuse glow using box-shadow (using a light red/gold mixture)
    // The dot itself remains completely solid and opaque
    dot.className = 'w-4 h-4 rounded-full border border-surface shadow-[0_0_12px_rgba(158,27,50,0.7)] z-10';

    el.appendChild(dot);

    // Initialize marker
    markerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat(MAP_CONFIG.defaultCenter)
      .addTo(mapInstance);

    let isFirstFetch = true;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        const userCoords = [longitude, latitude];

        if (markerRef.current) {
          markerRef.current.setLngLat(userCoords);
        }

        if (isFirstFetch) {
          mapInstance.flyTo({
            center: userCoords,
            zoom: MAP_CONFIG.defaultZoom,
            essential: true,
            duration: GEO_CONFIG.flyToDuration
          });
          isFirstFetch = false;
        }
      },
      (error) => {
        console.warn("Geolocation denied or error:", error);
      },
      {
        enableHighAccuracy: GEO_CONFIG.enableHighAccuracy,
        maximumAge: GEO_CONFIG.maximumAge,
        timeout: GEO_CONFIG.timeout
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [mapInstance]);

  // This component handles DOM injection into MapLibre, so it renders nothing in the React tree
  return null;
};

export default CurrentLocationDot;
