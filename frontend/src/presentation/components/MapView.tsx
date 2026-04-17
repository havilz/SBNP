import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useStationStore } from "../state/station.store";
import { Station } from "../../domain/models/station.model";

/**
 * Custom function to create Leaflet icons dynamically based on station status.
 */
const createStationIcon = (status: string) => {
  const isOff = status === "PADAM";
  
  return L.divIcon({
    className: "custom-station-icon",
    html: `
      <div class="relative flex items-center justify-center">
        ${isOff ? `
          <div class="absolute w-6 h-6 bg-status-off rounded-full animate-ping opacity-75"></div>
          <div class="relative w-3 h-3 bg-status-off rounded-full border border-white shadow-[0_0_10px_rgba(248,113,113,1)]"></div>
        ` : `
          <div class="w-3 h-3 bg-status-normal rounded-full border border-white shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
        `}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const MapView: React.FC = () => {
  const { stations = [] } = useStationStore();

  // Center of Maluku as default view
  const defaultCenter: [number, number] = [-3.65, 128.18];

  return (
    <div className="w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={8}
        className="w-full h-full bg-maritime-dark"
        zoomControl={false} // Custom zoom control or hidden for clean look
      >
        {/* Dark Matter Tiles from CartoDB */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {stations
          .filter((station: Station) => station.latitude != null && station.longitude != null)
          .map((station: Station) => (
          <Marker
            key={station.stationId}
            position={[station.latitude, station.longitude]}
            icon={createStationIcon(station.issueStatus)}
          >
            <Popup className="station-popup">
              <div className="p-1 min-w-[180px] bg-maritime-blue text-white rounded-lg">
                <h3 className="font-bold text-maritime-accent border-b border-maritime-light pb-2 mb-2">
                  {station.stationName}
                </h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-maritime-gray">ID:</span>
                    <span>{station.stationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maritime-gray">Status:</span>
                    <span className={station.issueStatus === "NIHIL" ? "text-status-normal" : "text-status-off"}>
                      {station.status?.label || station.issueStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maritime-gray">Condition:</span>
                    <span>{station.conditionPercent}%</span>
                  </div>
                  {station.note && (
                    <div className="mt-2 pt-2 border-t border-maritime-light italic text-maritime-gray">
                      "{station.note}"
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
