import React, { useState, useMemo } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import FacilityFilterButton from './FacilityFilterButton'; 

/**
 * SearchBar — Dual-Mode Search Component
 */
const SearchBar = ({
  isSidebarExpanded,
  buildings = [],
  facilities = [],
  selectedBuildingId,
  isInsideMode,
  facilityFilter,
  onFilterChange,
  onFacilitySelect,
  onBuildingSelect,
  mapInstance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ── Dual-Mode Search Logic (Fixed Bug) ──────────────────────────────────
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();

    if (isInsideMode && facilities.length > 0) {
      // Mode B: Search facilities
      return facilities
        .filter((facility) => {
          const name = facility.name?.toLowerCase() || '';
          const type = facility.type?.name?.toLowerCase() || '';
          return name.includes(term) || type.includes(term);
        })
        .map((facility) => ({
          ...facility,
          type: 'facility',
          displayName: facility.name,
          searchType: facility.type?.name || 'store',
        }));
    } else if (!isInsideMode && buildings.length > 0) {
      // Mode A: Search buildings (Fixed: building.code)
      return buildings
        .filter((building) => {
          const name = building.name?.toLowerCase() || '';
          const code = building.code?.toLowerCase() || '';
          return name.includes(term) || code.includes(term);
        })
        .map((building) => ({
          ...building,
          type: 'building',
          displayName: building.name,
          searchType: building.code || 'Unknown', //แก้จุดที่ทำให้หน้าขาวแล้ว
        }));
    }

    return [];
  }, [searchTerm, buildings, facilities, isInsideMode]);

  const handleResultClick = (result) => {
    setSearchTerm('');
    setIsDropdownOpen(false);

    if (result.type === 'facility') {
      onFacilitySelect?.(result);
      if (mapInstance && result.lat && result.lng) {
        mapInstance.flyTo({
          center: [result.lng, result.lat],
          zoom: 19,
          essential: true,
          duration: 800,
        });
      }
    } else if (result.type === 'building') {
      onBuildingSelect?.(result);
    }
  };

  const sidebarOffset = isSidebarExpanded ? 'left-[276px]' : 'left-[100px]';

  return (
    <div className={`absolute top-5 z-40 transition-smooth ${sidebarOffset}`}>
      {/* Flex Container มัดรวม Search กับ Filter ให้อยู่บรรทัดเดียวกัน */}
      <div className="flex items-center gap-2">
        
        {/* Search Input Box */}
        <div className="relative">
          <div className="flex items-center bg-surface/90 backdrop-blur-md rounded-[var(--radius)] border border-border shadow-sm px-4 h-[46px] w-80 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-smooth">
            <Search className="text-text-muted mr-3 flex-shrink-0" size={20} />
            <input
              type="text"
              placeholder={isInsideMode ? 'Search facilities...' : 'Search campus...'}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(e.target.value.length > 0);
              }}
              onFocus={() => searchTerm.length > 0 && setIsDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              className="bg-transparent border-none outline-none w-full text-text placeholder-text-muted font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIsDropdownOpen(false);
                }}
                className="text-text-muted hover:text-text transition-smooth ml-2 flex-shrink-0"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isDropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-[var(--radius)] shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <button
                  key={`${result.type}-${result.id}-${idx}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left px-4 py-3 hover:bg-background border-b border-border last:border-b-0 transition-smooth flex items-center gap-3 group"
                >
                  <MapPin size={16} className="text-text-muted group-hover:text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text truncate group-hover:text-primary">
                      {result.displayName}
                    </p>
                    <p className="text-xs text-text-muted">
                      {result.type === 'building'
                        ? `Building • ${result.searchType}`
                        : `${result.searchType.charAt(0).toUpperCase() + result.searchType.slice(1).replace('-', ' ')} • Facility`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/*  เรียกใช้ Component แยกมาวางตรงนี้ */}
        <FacilityFilterButton
          facilities={facilities}
          selectedFilter={facilityFilter}
          onFilterChange={onFilterChange}
          isInsideMode={isInsideMode}
        />
        
      </div>
    </div>
  );
};

export default SearchBar;