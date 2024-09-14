"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map() {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      if (position) {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }
    });
  };

  useEffect(() => {
    getCurrentLocation();

    let map: L.Map;
    if (coordinates) {
      map = L.map("map").setView([coordinates.lat, coordinates.lng], 13);
    }

    return () => {
      map?.remove();
    };
  }, []);

  return (
    <div className="flex flex-col">
      {coordinates ? (
        <MapContainer
          className="min-h-[500px] min-w-[500px] w-full h-full"
          center={[coordinates.lat, coordinates.lng]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-lg font-bold">
            Allow the browser to get your location
          </p>
        </div>
      )}
    </div>
  );
}
