export const APP_BRANDING = {
  tu: { text: "TU", colorClass: "text-tu-red" },
  dot: { text: "•", colorClass: "text-black" },
  long: { text: "Lóng", colorClass: "text-tu-gold" }
};

export const MAP_CONFIG = {
  defaultCenter: [100.6087, 14.0722], // TU Rangsit Campus
  defaultZoom: 15,
  minZoom: 10,
  maxZoom: 20,
  maxTileCacheSize: 500, // Caching optimization limit
};

export const GEO_CONFIG = {
  enableHighAccuracy: false,
  maximumAge: 10000,
  timeout: 5000,
  flyToDuration: 1200
};
