"use client";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Container, WASTE_TYPE_LABELS } from "@/lib/types";

interface Props {
  containers: Container[];
  onSelect?: (c: Container) => void;
}

function fillColor(pct: number): string {
  if (pct <= 30) return "#22c55e";
  if (pct <= 60) return "#facc15";
  if (pct <= 85) return "#f97316";
  return "#dc2626";
}

export default function MapView({ containers, onSelect }: Props) {
  return (
    <MapContainer center={[41.015137, 28.979530]} zoom={11} style={{ height: "480px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {containers.map((c) => (
        <CircleMarker
          key={c.id}
          center={[c.latitude, c.longitude]}
          radius={10 + (c.fillPercentage / 100) * 8}
          pathOptions={{ color: fillColor(c.fillPercentage), fillColor: fillColor(c.fillPercentage), fillOpacity: 0.8 }}
          eventHandlers={{ click: () => onSelect?.(c) }}
        >
          <Popup>
            <strong>{c.name}</strong><br />
            {WASTE_TYPE_LABELS[c.wasteType]} · {c.fillPercentage.toFixed(0)}% dolu
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
