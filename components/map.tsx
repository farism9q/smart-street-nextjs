"use client";

import { MapContainer, Popup, TileLayer, CircleMarker } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import "@/app/styles/leaflet.css";
import { detection } from "@/types/detection";

type MapProps = {
  detections: detection[];
};

export default function Map({ detections }: MapProps) {
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
          {detections.map(detection => (
            <CircleMarker
              key={detection._id}
              center={[detection.latitude, detection.longitude]}
              pathOptions={{ color: "red" }}
              radius={10}
            >
              <Popup>
                <div className="p-4 bg-white text-gray-800 rounded-md shadow-md">
                  <p className="text-lg font-semibold">
                    A{" "}
                    <span className="text-blue-500">
                      {detection.vehicle_type}
                    </span>{" "}
                    detected
                  </p>
                  <p className="text-sm">
                    Coordinates:{" "}
                    <span className="font-bold text-green-500">
                      {detection.latitude}, {detection.longitude}
                    </span>
                  </p>
                  <p className="text-sm">
                    Violation:{" "}
                    <span className="font-bold text-red-500">
                      {detection.violation_type}
                    </span>
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
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
