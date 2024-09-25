"use client";

import { MapContainer, Popup, TileLayer, CircleMarker } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";

import "@/app/styles/leaflet.css";
import { ViolationType } from "@/types/violation";

type MapProps = {
  violations: ViolationType[] | undefined;
};

export default function Map({ violations }: MapProps) {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 24.8607,
    lng: 46.6176,
  });

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
  }, [violations]);

  const meanCoords = useMemo(() => {
    const lat =
      violations?.reduce((acc, curr) => acc + curr.latitude, 0) ||
      coordinates.lat;
    const lng =
      violations?.reduce((acc, curr) => acc + curr.longitude, 0) ||
      coordinates.lng;

    return {
      lat: lat / (violations?.length || 1),
      lng: lng / (violations?.length || 1),
    };
  }, [violations]);

  return (
    <div className="flex flex-col">
      {coordinates ? (
        <MapContainer
          className="min-h-[500px] min-w-[500px] w-full h-full"
          center={
            meanCoords
              ? [meanCoords.lat, meanCoords.lng]
              : [coordinates.lat, coordinates.lng]
          }
          zoom={12}
          scrollWheelZoom={false}
        >
          {violations?.map((violation, index) => (
            <CircleMarker
              key={violation._id}
              center={[violation.latitude, violation.longitude]}
              pathOptions={{ color: "red" }}
              radius={5}
            >
              <Popup>
                <div className="p-4 bg-white text-gray-800 rounded-md shadow-md">
                  <p className="text-lg font-semibold">
                    A{" "}
                    <span className="text-blue-500">
                      {violation.vehicle_type}
                    </span>{" "}
                    detected
                  </p>
                  <p className="text-sm">
                    Coordinates:{" "}
                    <span className="font-bold text-green-500">
                      {violation.latitude}, {violation.longitude}
                    </span>
                  </p>
                  <p className="text-sm">
                    Violation:{" "}
                    <span className="font-bold text-red-500">
                      {violation.violation_type}
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
