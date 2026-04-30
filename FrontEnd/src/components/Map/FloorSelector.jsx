import React from 'react';
import { Layers } from 'lucide-react';

/**
 * Vertical floor selection menu — right side of the map.
 *
 * @param {{ floors: Array<{ id: number, code: string }>, selectedFloor: string, onSelect: (code: string) => void }} props
 */
const FloorSelector = React.memo(({ floors, selectedFloor, onSelect }) => {
  if (!floors || floors.length === 0) return null;

  const options = ['All', ...floors.map((f) => f.code)];

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5">
      {options.map((code) => {
        const isActive = selectedFloor === code;
        return (
          <button
            key={code}
            onClick={() => onSelect(code)}
            className={`
              w-11 h-11 flex items-center justify-center text-xs font-bold
              border backdrop-blur-md transition-smooth
              ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-lg'
                  : 'bg-surface/80 text-text-muted border-border hover:border-primary hover:text-primary'
              }
            `}
            style={{ borderRadius: 'var(--radius)' }}
            title={code === 'All' ? 'All Floors' : code}
          >
            {code === 'All' ? <Layers size={16} /> : code}
          </button>
        );
      })}
    </div>
  );
});

FloorSelector.displayName = 'FloorSelector';

export default FloorSelector;
