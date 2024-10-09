"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";

import { Prisma } from "@prisma/client";

import {
  MapContainer,
  Popup,
  TileLayer,
  CircleMarker,
  Marker,
  LayersControl,
  FeatureGroup,
} from "react-leaflet";

import L from "leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";
import "@/app/styles/map.css";

const CLASS_COLORS = {
  "car": "red",
  "bus": "orange",
  "truck": "yellow",
};

const customIcon = new L.Icon({
  iconUrl: "/location.svg",
  iconSize: new L.Point(40, 47),
});

const violationSelect = {
  date: true,
  id: true,
  latitude: true,
  longitude: true,
  vehicle_type: true,
  violation_type: true,
  license_plate_number: true,
  street_name: true,
  time: true,
} satisfies Prisma.violationsSelect;

type MapProps = {
  violations:
    | Prisma.violationsGetPayload<{ select: typeof violationSelect }>[]
    | undefined;
};

export default function Map({ violations }: MapProps) {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 24.8607,
    lng: 46.6176,
  });
  const { theme } = useTheme();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  const mapUrl =
    theme === "light"
      ? `https://tile.jawg.io/1e6bb23b-f7a9-4ca7-a41d-1c1c4124ec5c/{z}/{x}/{y}{r}.png?access-token=${process.env.NEXT_PUBLIC_JAWG_API_KEY_LIGHT}`
      : `https://tile.jawg.io/776f2eea-0d03-4db2-8e08-e026e6acfe69/{z}/{x}/{y}{r}.png?access-token=${process.env.NEXT_PUBLIC_JAWG_API_KEY_DARK}`;

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
  }, [violations, coordinates]);

  return (
    <div className="flex flex-col">
      {coordinates ? (
        <MapContainer
          maxZoom={18}
          className="min-h-[500px] w-full h-full"
          center={
            meanCoords
              ? [meanCoords.lat, meanCoords.lng]
              : [coordinates.lat, coordinates.lng]
          }
          zoom={12}
          scrollWheelZoom={false}
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-lg font-bold">Loading...</p>
              </div>
            }
          >
            <LayersControl>
              <LayersControl.Overlay name="Markers" checked>
                <FeatureGroup>
                  {violations?.map(violation => (
                    <CircleMarker
                      key={violation.id}
                      center={[violation.latitude, violation.longitude]}
                      pathOptions={{
                        color:
                          CLASS_COLORS[
                            violation.vehicle_type as keyof typeof CLASS_COLORS
                          ],
                      }}
                      interactive={true}
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
                </FeatureGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Clusters" checked>
                <MarkerClusterGroup chunkedLoading>
                  {violations?.map((violation, index) => (
                    <Marker
                      icon={customIcon}
                      key={violation.id}
                      position={[violation.latitude, violation.longitude]}
                      title={violation.vehicle_type}
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
                    </Marker>
                  ))}
                </MarkerClusterGroup>
              </LayersControl.Overlay>

              <TileLayer
                attribution={`&copy; <a href=\"https://www.jawg.io?utm_medium=map&utm_source=attribution\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors"`}
                url={mapUrl}
              />
            </LayersControl>
          </Suspense>
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
