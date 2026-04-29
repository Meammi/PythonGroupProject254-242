import React, { useState, useCallback } from 'react';
import MapContainer from '../components/Map/MapContainer';
import SearchBar from '../components/Map/SearchBar';
import BuildingMarkers from '../components/Map/BuildingMarkers';
import BuildingDetailCard from '../components/Map/BuildingDetailCard';
import FacilityDetailCard from '../components/Map/FacilityDetailCard';
import FacilityMarkers from '../components/Map/FacilityMarkers';
import FloorSelector from '../components/Map/FloorSelector';
import { useFloors } from '../hooks/useFloors';
import { useFacilities } from '../hooks/useFacilities';
import { MAP_CONFIG } from '../data/constants';

/**
 * MapPage — The main map view.
 *
 * Manages two modes:
 *   1. "Campus" mode: shows building markers.
 *   2. "Inside Building" mode: shows facility markers + floor selector.
 */
const MapPage = ({ isSidebarExpanded }) => {
  const [mapInstance, setMapInstance] = useState(null);

  // ── Building selection (card popup) ─────────────────────────────────────
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  // ── Inside Building mode ────────────────────────────────────────────────
  const [insideBuildingId, setInsideBuildingId] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('All');

  // ── Facility selection (detail card popup) ──────────────────────────────
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);

  const { floors } = useFloors(insideBuildingId);
  const { facilities } = useFacilities(insideBuildingId);

  const isInsideMode = insideBuildingId != null;

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleBuildingSelect = useCallback((building) => {
    setSelectedBuildingId(building.id);
  }, []);

  const handleCardClose = useCallback(() => {
    setSelectedBuildingId(null);
  }, []);

  const handleFacilitySelect = useCallback((facility) => {
    setSelectedFacilityId(facility.id);
  }, []);

  const handleFacilityCardClose = useCallback(() => {
    setSelectedFacilityId(null);
  }, []);

  const handleEnterBuilding = useCallback(
    (building) => {
      setInsideBuildingId(building.id);
      setSelectedFloor('All');

      // Fly to the building at high zoom
      if (mapInstance && building.lat && building.lng) {
        mapInstance.flyTo({
          center: [building.lng, building.lat],
          zoom: MAP_CONFIG.insideBuildingZoom,
          essential: true,
          duration: MAP_CONFIG.flyToDuration,
        });
      }
    },
    [mapInstance]
  );

  const handleExitBuilding = useCallback(() => {
    setInsideBuildingId(null);
    setSelectedFloor('All');

    // Zoom back out to campus level
    if (mapInstance) {
      mapInstance.flyTo({
        center: MAP_CONFIG.defaultCenter,
        zoom: MAP_CONFIG.defaultZoom,
        essential: true,
        duration: MAP_CONFIG.flyToDuration,
      });
    }
  }, [mapInstance]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-background">
      <MapContainer setMapInstance={setMapInstance} />
      <SearchBar isSidebarExpanded={isSidebarExpanded} />

      {/* Building markers (hidden when inside a building) */}
      {!isInsideMode && (
        <BuildingMarkers
          mapInstance={mapInstance}
          onBuildingSelect={handleBuildingSelect}
        />
      )}

      {/* Building detail card popup */}
      <BuildingDetailCard
        buildingId={selectedBuildingId}
        onClose={handleCardClose}
        onEnterBuilding={handleEnterBuilding}
      />

      {/* ── Inside Building Mode ─────────────────────────────────────── */}
      {isInsideMode && (
        <>
          <FacilityMarkers
            mapInstance={mapInstance}
            facilities={facilities}
            selectedFloor={selectedFloor}
            onFacilitySelect={handleFacilitySelect}
          />
          <FloorSelector
            floors={floors}
            selectedFloor={selectedFloor}
            onSelect={setSelectedFloor}
          />

          {/* Back button - Repositioned to Top-Right */}
          <button
            onClick={handleExitBuilding}
            className="fixed top-5 right-5 z-30 flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-surface/90 backdrop-blur-md border border-border shadow-md hover:border-primary hover:text-primary transition-smooth"
            style={{ borderRadius: 'var(--radius)' }}
          >
            ← Back to Campus
          </button>
        </>
      )}

      {/* Facility detail card popup (inside building mode) */}
      <FacilityDetailCard
        facilityId={selectedFacilityId}
        onClose={handleFacilityCardClose}
      />
    </div>
  );
};

export default MapPage;
