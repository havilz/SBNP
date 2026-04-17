/**
 * Enum for Station Issue Status based on Backend constraints.
 */
export type IssueStatus = "NIHIL" | "PADAM" | "RUSAK" | "HILANG" | "PERBAIKAN";

/**
 * Interface representing the detailed status object from backend.
 */
export interface StationStatus {
  id: string;
  label: string;
  color: string;
}

/**
 * Main Station Entity Model.
 * Represents a single SBNP (Sarana Bantu Navigasi Pelayaran) station.
 */
export interface Station {
  stationId: string;
  stationName: string;
  latitude: number;
  longitude: number;
  issueStatus: IssueStatus;
  status: StationStatus;
  conditionPercent: number;
  note: string | null;
  lastUpdate: string;
}

/**
 * Wrapper for API responses containing station data.
 */
export interface StationResponse {
  data: Station[];
  total?: number;
}
