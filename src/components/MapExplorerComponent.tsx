"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { STATE_PINS, type StatePin } from "./MapExplorerSection";

// Fix default icon issues
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const MapIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = MapIcon;

interface MapExplorerComponentProps {
  onSelectState: (state: StatePin) => void;
}

export default function MapExplorerComponent({ onSelectState }: MapExplorerComponentProps) {
  return (
    <MapContainer
      center={[-14.235, -51.925]} // Centered on Brazil
      zoom={4}
      scrollWheelZoom={false}
      className="w-full h-full"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
      />
      {STATE_PINS.map((state) => (
        <Marker
          key={state.code}
          position={[state.lat, state.lng]}
          eventHandlers={{
            click: () => {
              onSelectState(state);
            },
          }}
        />
      ))}
    </MapContainer>
  );
}
