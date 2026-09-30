// Deep-links to Google Maps for a raw coordinate. Using the "search" intent
// (rather than "dir", which requires an origin) opens the pin and lets the
// visitor tap "Directions" themselves from whatever their current location
// is, which is what most people expect from a "view on Google Maps" link.
export function googleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
