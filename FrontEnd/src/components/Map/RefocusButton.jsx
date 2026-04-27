import React from 'react';
import { LocateFixed } from 'lucide-react';
import { MAP_CONFIG } from '../../data/constants';

const RefocusButton = ({ mapInstance }) => {
  
  const handleRefocus = () => {
    if (!mapInstance) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapInstance.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: MAP_CONFIG.defaultZoom,
            essential: true,
            duration: 1200
          });
        },
        (error) => {
          console.warn("Geolocation denied or error:", error);
          // Fallback center if they block geolocation mid-session
          mapInstance.flyTo({
            center: MAP_CONFIG.defaultCenter,
            zoom: MAP_CONFIG.defaultZoom,
            essential: true,
            duration: 1200
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 5000
        }
      );
    } else {
      mapInstance.flyTo({
        center: MAP_CONFIG.defaultCenter,
        zoom: MAP_CONFIG.defaultZoom,
        essential: true,
        duration: 1200
      });
    }
  };

  return (
    <button 
      onClick={handleRefocus}
      className="absolute bottom-10 right-10 z-20 bg-surface/80 backdrop-blur-md p-3 rounded-xl border border-border shadow-sm text-text-muted hover:text-tu-gold hover:border-tu-gold transition-smooth outline-none group"
      title="My Location"
    >
      <LocateFixed size={24} className="group-hover:scale-110 transition-smooth" />
    </button>
  );
};

export default RefocusButton;
