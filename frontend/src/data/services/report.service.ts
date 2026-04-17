import { apiClient } from "../../infrastructure/clients/api.client";

export const reportService = {
  /**
   * Fetch latest reports for all stations.
   */
  async getLatestReports(): Promise<any[]> {
    try {
      const response = await apiClient.get("/report/latest");
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("[ReportService] Failed to fetch latest reports:", error);
      throw error;
    }
  },

  /**
   * Fetch all reports for a specific station.
   */
  async getReportsByStation(stationId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/report/station/${stationId}`);
      return response.data;
    } catch (error) {
       console.error(`[ReportService] Failed to fetch reports for station ${stationId}:`, error);
       throw error;
    }
  },

  /**
   * Admin: Create a new report.
   */
  async createReport(data: any): Promise<any> {
    try {
      const response = await apiClient.post("/report", data);
      return response.data;
    } catch (error) {
      console.error("[ReportService] Failed to create report:", error);
      throw error;
    }
  },

  /**
   * Admin: Update an existing report.
   */
  async updateReport(id: number, data: any): Promise<any> {
    try {
      const response = await apiClient.put(`/report/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`[ReportService] Failed to update report ${id}:`, error);
      throw error;
    }
  },

  /**
   * Admin: Delete a report.
   */
  async deleteReport(id: number): Promise<any> {
    try {
      const response = await apiClient.delete(`/report/${id}`);
      return response.data;
    } catch (error) {
      console.error(`[ReportService] Failed to delete report ${id}:`, error);
      throw error;
    }
  }
};
