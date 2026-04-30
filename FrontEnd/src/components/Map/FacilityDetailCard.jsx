import React from 'react';
import {
  X,
  Bookmark,
  Bath,
  Stethoscope,
  Coffee,
  MessageCircle,
} from 'lucide-react';
import { useFacilityDetail } from '../../hooks/useFacilityDetail';

// Import facility images
import yellowStoneImg from '../../assets/images/Yellow_Stone.jpg';
import freshMeImg from '../../assets/images/Fresh_Me.jpg';
import frostyBoxImg from '../../assets/images/Frosty_box.jpg';
import wellBeingImg from '../../assets/images/Well_being.jpg';

/**
 * Mapping of facility names to their respective images.
 */
const FACILITY_IMAGE_MAP = {
  'Friend Coffee (Yellow Store)': yellowStoneImg,
  'Fresh Me': freshMeImg,
  'Frosty Box': frostyBoxImg,
  'Well Being': wellBeingImg,
};

/**
 * Icon lookup for facility type header.
 */
const TYPE_ICON_MAP = {
  'toilet':      { Icon: Bath,      label: 'Restroom' },
  'health-care': { Icon: Stethoscope, label: 'Health Care' },
  'store':       { Icon: Coffee,      label: 'Store' },
};

/**
 * FacilityDetailCard — A centered card showing facility information.
 *
 * @param {{ facilityId: number|null, onClose: () => void }} props
 */
const FacilityDetailCard = ({ facilityId, onClose }) => {
  const { facility, isLoading, error } = useFacilityDetail(facilityId);
  const isVisible = facilityId != null;

  // Resolve the image, type icon, and label
  const facilityImage = facility ? FACILITY_IMAGE_MAP[facility.name] : null;
  const typeInfo = facility
    ? TYPE_ICON_MAP[facility.type?.name] || TYPE_ICON_MAP['store']
    : null;

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
              {/* Header — Image or Gradient */}
              <div
                className="relative h-44 overflow-hidden"
                style={{
                  background: !facilityImage ? 'linear-gradient(135deg, var(--color-tu-red) 0%, #c4324f 100%)' : 'none',
                }}
              >
                {facilityImage && (
                  <>
                    <img
                      src={facilityImage}
                      alt={facility.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay for text readability when image is present */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </>
                )}

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/90 hover:bg-black/50 transition-smooth"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>

                {/* Content Overlay */}
                <div className="absolute bottom-4 left-5 right-5">
                  {/* Icon + Badge */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center"
                    >
                      {typeInfo && <typeInfo.Icon size={16} className="text-white" />}
                    </div>
                    <span className="inline-block px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/30 backdrop-blur-md text-white">
                      {typeInfo?.label || 'Facility'}
                    </span>
                  </div>

                  {/* Facility name */}
                  <h2 className="text-white text-xl font-bold leading-tight drop-shadow-md">
                    {facility.name || 'Unknown Facility'}
                  </h2>

                  {/* Building context */}
                  <p className="text-white/80 text-[11px] mt-1 font-medium">
                    {facility.building_name} • Floor {facility.floor}
                  </p>
                </div>
              </div>

              {/* Body Content */}
              <div className="px-5 py-4 space-y-3">

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
                  {facility?.description && facility.description.trim() !== '' && facility.description !== 'No description' ? (
                    <p className="text-sm leading-relaxed text-text/80 italic pl-2">
                      "{facility.description}"
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed text-text-muted/60 italic pl-2">
                      No des
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

