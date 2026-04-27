import React from 'react';

const MapPage = () => {
  return (
    <div className="w-full h-full bg-surface rounded-[16px] border border-border shadow-sm flex flex-col items-center justify-center overflow-hidden relative group">
      {/* Immersive Map Placeholder Background using custom variables */}
      <div 
        className="absolute inset-0 opacity-10 transition-smooth group-hover:opacity-20" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px' 
        }}
      ></div>
      
      <div className="z-10 flex flex-col items-center p-8 bg-surface/80 backdrop-blur-md rounded-[16px] border border-border shadow-sm">
        <h2 className="text-3xl font-bold text-primary mb-2 text-center">Interactive Campus Map</h2>
        <p className="text-text-muted text-center max-w-md">
          This immersive full-screen container is ready for your Google Maps integration.
        </p>
      </div>
    </div>
  );
};

export default MapPage;
