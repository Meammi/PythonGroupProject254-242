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
    if (map.current) return; 

    if (!awsConfig.region || !awsConfig.mapName || !awsConfig.apiKey) {
      console.error("Missing AWS Configuration.");
      setIsLoading(false);
      return;
    }

    const styleUrl = `https://maps.geo.${awsConfig.region}.amazonaws.com/maps/v0/maps/${awsConfig.mapName}/style-descriptor?key=${awsConfig.apiKey}`;

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
      attributionControl: false,
      transformRequest: transformRequest,
      maxTileCacheSize: MAP_CONFIG.maxTileCacheSize,
    });

    map.current.on('load', () => {
      setIsLoading(false);
      setMapInstance(map.current);

      // --- Minimalist Map Cleaning ---
      // Remove POIs, business icons, and cluttering place labels
      const style = map.current.getStyle();
      if (style && style.layers) {
        style.layers.forEach((layer) => {
          if (
            layer.id.includes('poi') ||
            layer.id.includes('place-label') ||
            layer.id.includes('transit-label')
          ) {
            map.current.setLayoutProperty(layer.id, 'visibility', 'none');
          }
        });
      }
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
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/90 backdrop-blur-md transition-smooth">
          <div className="w-12 h-12 border-4 border-border border-t-tu-gold rounded-full animate-spin mb-4"></div>
          <span className="text-tu-red font-bold animate-pulse text-lg font-sans">Loading TU Map...</span>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full bg-background" />
    </div>
  );
};

export default MapContainer;
