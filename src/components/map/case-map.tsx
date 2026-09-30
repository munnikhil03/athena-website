"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Link from "next/link";
import { PIN_ROLE_HEX, PIN_ROLE_LABEL, type PinRole } from "@/lib/map/pin-colors";
import { googleMapsUrl } from "@/lib/map/google-maps";

// Same fix as location-picker.tsx - react-leaflet's default marker icon
// points at image paths that don't survive bundling. Not strictly needed
// here since every marker below uses a custom divIcon, but kept for safety
// in case anything ever falls back to the default icon.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Defaults to Charleston, WV - where the original Athena search happened.
const DEFAULT_CENTER: [number, number] = [38.3498, -81.6326];

export interface CaseMapPin {
  id: string;
  lat: number;
  lng: number;
  role: PinRole;
  title: string;
  meta?: string;
  href?: string;
}

interface CaseMapProps {
  pins: CaseMapPin[];
  height?: number;
  cluster?: boolean;
}

function pinIcon(role: PinRole) {
  const color = PIN_ROLE_HEX[role];
  const html = `
    <svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21s13-11.25 13-21C26 5.82 20.18 0 13 0z" fill="${color}" stroke="#FAF7F0" stroke-width="1.5"/>
      <circle cx="13" cy="13" r="5" fill="#FAF7F0"/>
    </svg>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30],
  });
}

function FitToPins({ pins }: { pins: CaseMapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(pins.map((p): [number, number] => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [pins, map]);
  return null;
}

export default function CaseMap({ pins, height = 420, cluster = true }: CaseMapProps) {
  const markers = pins.map((pin) => (
    <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pinIcon(pin.role)}>
      <Popup>
        <p className="font-display text-sm font-semibold">{pin.title}</p>
        <p className="text-xs text-muted-foreground">{PIN_ROLE_LABEL[pin.role]}</p>
        {pin.meta && <p className="text-xs text-muted-foreground">{pin.meta}</p>}
        <div className="mt-1 flex flex-col gap-0.5">
          {pin.href && (
            <Link href={pin.href} className="text-xs font-semibold text-primary underline">
              View case
            </Link>
          )}
          <a
            href={googleMapsUrl(pin.lat, pin.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary underline"
          >
            Open in Google Maps
          </a>
        </div>
      </Popup>
    </Marker>
  ));

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border" style={{ height }}>
      <MapContainer center={DEFAULT_CENTER} zoom={8} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToPins pins={pins} />
        {cluster ? <MarkerClusterGroup chunkedLoading>{markers}</MarkerClusterGroup> : markers}
      </MapContainer>
    </div>
  );
}
