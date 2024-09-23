"use client";

import { MapContainer, Popup, TileLayer, CircleMarker } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import "@/app/styles/leaflet.css";
import { ViolationType } from "@/types/violation";
import violation from "@/models/violation";
import { useData } from "@/hooks/use-data";

const violationTest = [
  {
    latitude: 24.325,
    longitude: 48.1234,
    _id: "1",
    violation_type: "Overtaking",
    vehicle_type: "Car",
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    _id: "2",
    latitude: 24.1654,
    longitude: 48.1264,
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    _id: "3",
    latitude: 24.325,
    longitude: 48.2364,
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    latitude: 24.325,
    longitude: 48.7532,
    _id: "4",
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    latitude: 24.325,
    longitude: 48.7952,
    _id: "5",
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    latitude: 24.325,
    longitude: 48.7895,
    _id: "6",
  },
  {
    overtake: "Overtaking",
    vehicle_type: "Car",
    latitude: 24.325,
    longitude: 48.3697,
    _id: "7",
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    latitude: 24.325,
    longitude: 48.7632,
    _id: "8",
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    latitude: 24.325,
    longitude: 48.0036,
    _id: "9",
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    latitude: 24.325,
    longitude: 48.1565,
    _id: "10",
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",

    latitude: 24.325,
    longitude: 54.123,
    _id: "11",
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    latitude: 24.325,
    longitude: 54.123,
    _id: "12",
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    latitude: 24.325,
    longitude: 54.123,
    _id: "13",
  },
  {
    violation_type: "Overtaking",
    vehicle_type: "Car",
    latitude: 24.325,
    longitude: 54.123,
    _id: "14",
  },
];

type MapProps = {
  violation: ViolationType[];
};

export default function Map({ violation }: MapProps) {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { data } = useData();

  const violationsData = data === "REAL" ? violation : violationTest;

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
          zoom={12}
          scrollWheelZoom={false}
        >
          {violationsData?.map((violation, index) => (
            <CircleMarker
              key={violation._id}
              center={[violation.latitude, violation.longitude]}
              pathOptions={{ color: "red" }}
              radius={10}
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
