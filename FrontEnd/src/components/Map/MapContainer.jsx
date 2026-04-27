import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { awsConfig } from '../../config/awsConfig';
import { MAP_CONFIG } from '../../data/constants';

const MapContainer = ({ setMapInstance }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lazy Load Protection: Only initialize once
    if (map.current) return; 

    if (!awsConfig.region || !awsConfig.mapName || !awsConfig.apiKey) {
      console.error("Missing AWS Configuration.");
      setIsLoading(false);
      return;
    }

    const styleUrl = `https://maps.geo.${awsConfig.region}.amazonaws.com/maps/v0/maps/${awsConfig.mapName}/style-descriptor?key=${awsConfig.apiKey}`;

    // Optimization: Only intercept and transform AWS endpoint requests to append the key
    const transformRequest = (url, resourceType) => {
      if (url.includes('amazonaws.com') && !url.includes('key=')) {
        return {
          url: `${url}${url.includes('?') ? '&' : '?'}key=${awsConfig.apiKey}`
        };
      }
      return { url };
    };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: MAP_CONFIG.defaultCenter,
      zoom: MAP_CONFIG.defaultZoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
      attributionControl: false, // Aesthetic UI: disable default attribution
      transformRequest: transformRequest,
      maxTileCacheSize: MAP_CONFIG.maxTileCacheSize, // Cache Optimization
    });

    // Aesthetic UI: We explicitly do NOT add NavigationControl() 
    // This removes the bulky default +/- zoom buttons.
    // Scroll-zoom and pinch-to-zoom remain active natively by default.

    // User Location (The Blue Dot) Configuration
    const geolocateControl = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true,
      showUserLocation: true
    });
    
    map.current.addControl(geolocateControl, 'bottom-right');

    map.current.on('load', () => {
      setIsLoading(false);
      setMapInstance(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [setMapInstance]);

  return (
    <div className="relative w-full h-full">
      {/* Loading State / Skeleton Optimization */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/90 backdrop-blur-md transition-smooth">
          <div className="w-12 h-12 border-4 border-border border-t-tu-gold rounded-full animate-spin mb-4"></div>
          <span className="text-tu-red font-bold animate-pulse text-lg">Loading TU Map...</span>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full bg-background" />
    </div>
  );
};

export default MapContainer;
