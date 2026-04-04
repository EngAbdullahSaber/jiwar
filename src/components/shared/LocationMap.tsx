import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
  latitude: number | string;
  longitude: number | string;
  onChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

function LocationMarker({ position, onChange, readOnly }: any) {
  useMapEvents({
    click(e) {
      if (!readOnly && onChange) {
        onChange(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export function LocationMap({ latitude, longitude, onChange, readOnly = false }: LocationMapProps) {
  const defaultPosition: [number, number] = [24.7136, 46.6753]; // Default to Riyadh
  const [position, setPosition] = useState<[number, number]>(defaultPosition);

  useEffect(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    }
  }, [latitude, longitude]);

  return (
    <div className="w-full h-full min-h-[300px] z-0 relative isolate rounded-md overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%', minHeight: '300px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onChange={onChange} readOnly={readOnly} />
      </MapContainer>
    </div>
  );
}
