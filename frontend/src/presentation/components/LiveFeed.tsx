import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useStationStore } from "../state/station.store";

const LiveFeed: React.FC = () => {
  const { stations = [] } = useStationStore();

  // Sort stations to show those with issues first or based on latest update if available
  // For this view, we'll filters for those who are NOT NIHIL or just the latest reports
  const activeIssues = stations
    .filter((s) => s.issueStatus !== "NIHIL");

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-maritime-dark">
        {activeIssues.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-maritime-gray space-y-2 opacity-50">
            <CheckCircle size={32} />
            <span className="text-xs italic">
              All stations operating normally
            </span>
          </div>
        ) : (
          activeIssues.map((station) => (
            <div
              key={station.stationId}
              className="group p-3 rounded-lg bg-maritime-blue border border-maritime-light hover:border-maritime-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-maritime-accent transition-colors">
                  {station.stationName}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    station.issueStatus === "PADAM"
                      ? "bg-status-off/20 text-status-off border border-status-off/30"
                      : "bg-status-warning/20 text-status-warning border border-status-warning/30"
                  }`}
                >
                  {station.issueStatus}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-maritime-gray mb-2">
                <AlertTriangle size={12} className="text-status-warning" />
                <span>Condition: {station.conditionPercent}%</span>
              </div>

              {station.note && (
                <p className="text-[11px] text-maritime-gray italic line-clamp-2 bg-maritime-dark p-2 rounded border border-maritime-light/50">
                  "{station.note}"
                </p>
              )}

              <div className="mt-3 flex justify-between items-center text-[9px] text-maritime-gray/60 uppercase font-bold">
                <span>ID: {station.stationId}</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
    </div>
  );
};

export default LiveFeed;
