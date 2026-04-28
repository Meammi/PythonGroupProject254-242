import React, { useState, useCallback } from 'react';
import MapContainer from '../components/Map/MapContainer';
import SearchBar from '../components/Map/SearchBar';
import RefocusButton from '../components/Map/RefocusButton';
import CurrentLocationDot from '../components/Map/CurrentLocationDot';
import BuildingMarkers from '../components/Map/BuildingMarkers';
import BuildingDetailCard from '../components/Map/BuildingDetailCard';

const MapPage = ({ isSidebarExpanded }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  const handleBuildingSelect = useCallback((building) => {
    setSelectedBuildingId(building.id);
  }, []);

  const handleCardClose = useCallback(() => {
    setSelectedBuildingId(null);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-background">
      <MapContainer setMapInstance={setMapInstance} />
      <SearchBar isSidebarExpanded={isSidebarExpanded} />
      <RefocusButton mapInstance={mapInstance} />
      <CurrentLocationDot mapInstance={mapInstance} />
      <BuildingMarkers
        mapInstance={mapInstance}
        onBuildingSelect={handleBuildingSelect}
      />
      <BuildingDetailCard
        buildingId={selectedBuildingId}
        onClose={handleCardClose}
      />
    </div>
  );
};

export default MapPage;
