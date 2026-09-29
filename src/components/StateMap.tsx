"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon issue with Webpack
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Attraction {
  name: string;
  lat: number;
  lng: number;
  short_description: string;
}

interface StateMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  attractions: Attraction[];
}

export default function StateMap({ center, zoom, attractions }: StateMapProps) {
  useEffect(() => {
    // This forces a resize event when the map mounts, fixing grey areas
    window.dispatchEvent(new Event("resize"));
  }, []);

  return (
    <div className="h-[420px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-0 relative shadow-inner">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {attractions.map((poi, i) => (
          <Marker key={i} position={[poi.lat, poi.lng]}>
            <Popup className="rounded-xl overflow-hidden">
              <div className="p-1">
                <strong className="block text-emerald-700 text-sm mb-1">{poi.name}</strong>
                <p className="text-xs text-slate-600 m-0 leading-tight">
                  {poi.short_description}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
