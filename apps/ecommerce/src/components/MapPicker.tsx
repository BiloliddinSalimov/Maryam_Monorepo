import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  // Keep latest callback in a ref so the map click handler never goes stale
  const onLocationSelectRef = useRef(onLocationSelect);
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([41.2995, 69.2401], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelectRef.current({ lat, lng });

      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng, { icon: DefaultIcon }).addTo(map);
      }

      map.flyTo(e.latlng, map.getZoom());
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // Empty deps: map initializes once, callback always read via ref
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full z-0"
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapPicker;
