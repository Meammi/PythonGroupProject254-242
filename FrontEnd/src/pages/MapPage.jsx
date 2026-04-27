import React, { useState } from 'react';
import MapContainer from '../components/Map/MapContainer';
import SearchBar from '../components/Map/SearchBar';
import RefocusButton from '../components/Map/RefocusButton';

const MapPage = ({ isSidebarExpanded }) => {
  const [mapInstance, setMapInstance] = useState(null);

  return (
    <div className="w-full h-full relative overflow-hidden bg-background">
      <MapContainer setMapInstance={setMapInstance} />
      <SearchBar isSidebarExpanded={isSidebarExpanded} />
      <RefocusButton mapInstance={mapInstance} />
    </div>
  );
};

export default MapPage;
