// ── API ─────────────────────────────────────────────────────────────────────
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// ── Branding ────────────────────────────────────────────────────────────────
export const APP_BRANDING = {
  tu: { text: "TU", colorClass: "text-tu-red" },
  dot: { text: "•", colorClass: "text-black" },
  long: { text: "Lóng", colorClass: "text-tu-gold" }
};

export const MAP_CONFIG = {
  defaultCenter: [100.6087, 14.0722], // TU Rangsit Campus
  defaultZoom: 15,
  insideBuildingZoom: 18.5,
  minZoom: 10,
  maxZoom: 20,
  maxTileCacheSize: 500, // Caching optimization limit
  flyToDuration: 1200, // Shared animation duration
};
