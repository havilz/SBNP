import { apiClient } from "../../infrastructure/clients/api.client";
import { Station, StationResponse } from "../../domain/models/station.model";

/**
 * Service to handle data fetching for SBNP Stations.
 * Acts as the Data Layer implementation connecting Infrastructure to Domain.
 */
export const stationService = {
  /**
   * Fetch the latest status for all stations.
   * Target endpoint: /api/report/latest
   */
  async getLatestStations(): Promise<Station[]> {
    try {
      const response = await apiClient.get<StationResponse>("/report/latest");
      
      // The backend structure might return { data: [...] } or just an array
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("[StationService] Failed to fetch latest stations:", error);
      throw error;
    }
  },

  /**
   * Fetch details for a specific station.
   */
  async getStationDetail(id: string): Promise<Station> {
    try {
      const response = await apiClient.get<Station>(`/station/${id}`);
      return response.data;
    } catch (error) {
       console.error(`[StationService] Failed to fetch station ${id}:`, error);
       throw error;
    }
  }
};
