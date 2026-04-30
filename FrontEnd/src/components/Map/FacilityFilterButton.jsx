import React, { useState, useMemo } from 'react';
import { Filter, Bath, Stethoscope, Store, X } from 'lucide-react';

/**
 * FacilityFilterButton — Modern Filter Component
 * Designed to be placed inline with the SearchBar.
 */
const FacilityFilterButton = ({ facilities, selectedFilter, onFilterChange, isInsideMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Map facility type names to proper lucide icons
  const FILTER_ICONS = {
    'toilet': Bath,
    'health-care': Stethoscope,
    'store': Store,
  };

  const availableFilters = useMemo(() => {
    if (!Array.isArray(facilities)) return [];
    
    const types = new Set();
    facilities.forEach((facility) => {
      const typeName = facility.type?.name || 'store';
      types.add(typeName);
    });
    
    return Array.from(types);
  }, [facilities]);

  if (!isInsideMode || availableFilters.length === 0) {
    return null;
  }

  const filters = [
    { id: 'all', label: 'All', icon: Filter },
    ...availableFilters.map((type) => ({
      id: type,
      label: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
      icon: FILTER_ICONS[type] || Store,
    })),
  ];

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-center h-[46px] w-[46px] rounded-[var(--radius)] transition-smooth shadow-sm outline-none border backdrop-blur-md
          ${
            isExpanded || selectedFilter !== 'all'
              ? 'bg-primary text-surface border-primary'
              : 'bg-surface/90 text-text-muted border-border hover:border-primary hover:text-primary'
          }
        `}
        title="Filter Facilities"
      >
        <Filter size={20} />
      </button>

      {/* Expanded Filter Menu (Drops down from the button) */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 flex flex-col gap-1 p-2 bg-surface border border-border rounded-[var(--radius)] shadow-lg z-50 min-w-[180px]">
          {/* Close Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="self-end p-1 text-text-muted hover:text-text transition-smooth"
            title="Close filters"
          >
            <X size={16} />
          </button>

          {/* Filter Options */}
          <div className="flex flex-col gap-1">
            {filters.map((filter) => {
              const isActive = selectedFilter === filter.id;
              const IconComponent = filter.icon;

              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    onFilterChange(filter.id);
                    setIsExpanded(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-smooth whitespace-nowrap text-sm font-medium outline-none
                    ${
                      isActive
                        ? 'bg-primary text-surface shadow-sm'
                        : 'bg-transparent text-text hover:bg-background'
                    }
                  `}
                >
                  <IconComponent size={18} />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Notification Dot */}
      {!isExpanded && selectedFilter !== 'all' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-tu-orange rounded-full border-2 border-surface shadow-sm"></div>
      )}
    </div>
  );
};

export default FacilityFilterButton;