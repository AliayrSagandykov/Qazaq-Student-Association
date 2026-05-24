"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
}

function dotIcon(active: boolean) {
  const size = active ? 18 : 14;
  const color = active ? "#3b82f6" : "#23c4a0";
  const ring = active ? "box-shadow:0 0 0 4px rgba(59,130,246,0.3);" : "";
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid #fff;${ring}"></div>`,
  });
}

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function EventsMap({
  markers,
  selectedId,
  onSelect,
  onMapClick,
  picked,
  center = [39.5, -98.35],
  zoom = 4,
}: {
  markers: MapMarker[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  picked?: [number, number] | null;
  center?: [number, number];
  zoom?: number;
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={dotIcon(m.id === selectedId)}
          eventHandlers={{ click: () => onSelect?.(m.id) }}
        />
      ))}
      {onMapClick && <ClickHandler onClick={onMapClick} />}
      {picked && <Marker position={picked} icon={dotIcon(true)} />}
    </MapContainer>
  );
}
