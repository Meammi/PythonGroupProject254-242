import React from 'react';
import {
  X,
  Bookmark,
  Thermometer,
  Toilet,
  Stethoscope,
  Coffee,
  MessageCircle,
} from 'lucide-react';
import { useFacilityDetail } from '../../hooks/useFacilityDetail';
import { useFacilityTemperature } from '../../hooks/useFacilityTemperature';

/**
 * Icon lookup for facility type header.
 */
const TYPE_ICON_MAP = {
  'toilet':      { Icon: Toilet,      label: 'Restroom' },
  'health-care': { Icon: Stethoscope, label: 'Health Care' },
  'store':       { Icon: Coffee,      label: 'Store' },
};

/**
 * Returns a temperature color based on the value.
 *   ≤ 20°C → cool (teal)
 *   21-28°C → comfortable (gold)
 *   > 28°C → hot (red)
 */
function getTempStyle(temp) {
  if (temp <= 20) return { color: 'var(--color-tu-teal)', label: 'Cool' };
  if (temp <= 28) return { color: 'var(--color-tu-gold)', label: 'Comfortable' };
  return { color: 'var(--color-tu-red)', label: 'Warm' };
}

/**
 * FacilityDetailCard — A centered card showing facility information + temperature.
 *
 * @param {{ facilityId: number|null, onClose: () => void }} props
 */
const FacilityDetailCard = ({ facilityId, onClose }) => {
  const { facility, isLoading, error } = useFacilityDetail(facilityId);
  const { temperature, isLoading: tempLoading } = useFacilityTemperature(facilityId);
  const isVisible = facilityId != null;

  // Resolve the type icon and label
  const typeInfo = facility
    ? TYPE_ICON_MAP[facility.type?.name] || TYPE_ICON_MAP['store']
    : null;

  const hasDescription = facility?.description && facility.description.trim() !== '' && facility.description !== 'No description';

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className={`fixed top-1/2 left-1/2 z-50 w-full max-w-[380px] transition-all duration-500 ease-out ${
          isVisible
            ? '-translate-x-1/2 -translate-y-1/2 opacity-100 scale-100'
            : '-translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ borderRadius: 'var(--radius)' }}
      >
        <div
          className="bg-surface overflow-hidden shadow-2xl"
          style={{ borderRadius: 'var(--radius)' }}
        >
          {/* ── Loading State ──────────────────────────────────────────── */}
          {isLoading && (
            <div className="flex items-center justify-center h-52">
              <div className="w-8 h-8 border-3 border-border border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* ── Error State ────────────────────────────────────────────── */}
          {error && !isLoading && (
            <div className="p-6 text-center">
              <p className="text-text-muted text-sm">Failed to load facility data.</p>
              <button onClick={onClose} className="mt-3 text-primary font-semibold text-sm">
                Close
              </button>
            </div>
          )}

          {/* ── Content ────────────────────────────────────────────────── */}
          {facility && !isLoading && !error && (
            <>
              {/* Header — Icon + Category Badge + Name */}
              <div
                className="relative px-5 pt-5 pb-4"
                style={{
                  background: 'linear-gradient(135deg, var(--color-tu-red) 0%, #c4324f 100%)',
                }}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white/90 hover:bg-white/30 transition-smooth"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>

                {/* Icon + Badge */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    {typeInfo && <typeInfo.Icon size={20} className="text-white" />}
                  </div>
                  <span className="inline-block px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-white/20 text-white">
                    {typeInfo?.label || 'Facility'}
                  </span>
                </div>

                {/* Facility name */}
                <h2 className="text-white text-xl font-bold leading-tight drop-shadow-md">
                  {facility.name || 'Unknown Facility'}
                </h2>

                {/* Building context */}
                <p className="text-white/70 text-xs mt-1 font-medium">
                  {facility.building_name} • Floor {facility.floor}
                </p>
              </div>

              {/* Body Content */}
              <div className="px-5 py-4 space-y-3">

                {/* ── Temperature Section ──────────────────────────────── */}
                <div
                  className="flex items-center gap-3 p-3.5"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: temperature != null
                        ? `${getTempStyle(temperature).color}15`
                        : 'var(--color-border)',
                    }}
                  >
                    <Thermometer
                      size={18}
                      style={{
                        color: temperature != null
                          ? getTempStyle(temperature).color
                          : 'var(--color-text-muted)',
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-text-muted mb-0.5">
                      Temperature
                    </p>
                    {tempLoading ? (
                      <div className="w-16 h-5 bg-border rounded animate-pulse" />
                    ) : temperature != null ? (
                      <p
                        className="text-lg font-bold leading-tight"
                        style={{ color: getTempStyle(temperature).color }}
                      >
                        {temperature.toFixed(1)}°C
                        <span className="text-xs font-medium ml-1.5 opacity-70">
                          {getTempStyle(temperature).label}
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm text-text-muted italic">N/A</p>
                    )}
                  </div>
                </div>

                {/* ── Description ──────────────────────────────────────── */}
                <div
                  className="relative p-4"
                  style={{
                    backgroundColor: 'rgba(158, 27, 50, 0.05)',
                    borderRadius: 'var(--radius)',
                    borderLeft: '3px solid var(--color-tu-red)',
                  }}
                >
                  <div
                    className="absolute -top-2 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: 'var(--color-tu-gold)' }}
                  >
                    <MessageCircle size={11} className="text-white" />
                  </div>
                  {hasDescription ? (
                    <p className="text-sm leading-relaxed text-text/80 italic pl-2">
                      "{facility.description}"
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed text-text-muted/60 italic pl-2">
                      No Description
                    </p>
                  )}
                </div>

                {/* ── Action Buttons ───────────────────────────────────── */}
                <div className="flex items-center gap-2.5 pb-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 font-semibold text-text-muted border border-border hover:text-primary hover:border-primary transition-smooth"
                    style={{
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <Bookmark size={20} className="mr-1" />
                    Save Facility
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FacilityDetailCard;

