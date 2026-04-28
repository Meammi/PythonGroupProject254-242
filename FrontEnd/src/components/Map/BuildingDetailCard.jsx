import React from 'react';
import {
  X,
  Bookmark,
  Building2,
  MessageCircle,
} from 'lucide-react';
import { useBuildingDetail } from '../../hooks/useBuildingDetail';
import buildingFallback from '../../assets/images/SC1.webp';

/**
 * BuildingDetailCard — A slide-up card showing building information.
 *
 * @param {{ buildingId: number|null, onClose: () => void }} props
 */
const BuildingDetailCard = ({ buildingId, onClose }) => {
  const { building, isLoading, error } = useBuildingDetail(buildingId);
  const isVisible = buildingId != null;

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
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-3 border-border border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* ── Error State ────────────────────────────────────────────── */}
          {error && !isLoading && (
            <div className="p-6 text-center">
              <p className="text-text-muted text-sm">Failed to load building data.</p>
              <button onClick={onClose} className="mt-3 text-primary font-semibold text-sm">
                Close
              </button>
            </div>
          )}

          {/* ── Content ────────────────────────────────────────────────── */}
          {building && !isLoading && !error && (
            <>
              {/* Header Image Section */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={buildingFallback}
                  alt={building.name || 'Building'}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/90 hover:bg-black/60 transition-smooth"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>

                {/* Category badge + Building name */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span
                    className="inline-block px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full mb-2"
                    style={{
                      backgroundColor: 'var(--color-tu-red)',
                      color: 'var(--color-surface)',
                    }}
                  >
                    Academic
                  </span>
                  <h2 className="text-white text-xl font-bold leading-tight drop-shadow-md">
                    {building.name || 'Unknown Building'}
                  </h2>
                </div>
              </div>

              {/* Body Content */}
              <div className="px-5 py-4 space-y-4">
                {/* Description */}
                {building.description && (
                  <div
                    className="relative p-4"
                    style={{
                      backgroundColor: 'rgba(158, 27, 50, 0.05)',
                      borderRadius: 'var(--radius)',
                      borderLeft: '3px solid var(--color-tu-red)',
                    }}
                  >
                    {/* Quote pin */}
                    <div
                      className="absolute -top-2 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: 'var(--color-tu-gold)',
                      }}
                    >
                      <MessageCircle size={11} className="text-white" />
                    </div>
                    <p className="text-sm leading-relaxed text-text/80 italic pl-2">
                      "{building.description}"
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 pb-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 font-semibold text-white text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-smooth"
                    style={{
                      backgroundColor: 'var(--color-tu-red)',
                      borderRadius: 'var(--radius)',
                    }}
                    onClick={() => {}}
                  >
                    <Building2 size={16} />
                    Inside the Building
                  </button>
                  <button
                    className="flex items-center justify-center w-[52px] h-[52px] border border-border text-text-muted hover:text-primary hover:border-primary transition-smooth"
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    <Bookmark size={20} />
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

export default BuildingDetailCard;
