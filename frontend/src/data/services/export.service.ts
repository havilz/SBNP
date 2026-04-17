import { apiClient } from "../../infrastructure/clients/api.client";
import { stationService } from "./station.service";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile, writeFile } from "@tauri-apps/plugin-fs";

export const exportService = {
  /**
   * Client-side CSV generation + Native Tauri Save.
   */
  async downloadCsv(): Promise<void> {
    try {
      // 1. Fetch data
      const stations = await stationService.getLatestStations().catch(err => {
        throw new Error(`Gagal mengambil data dari server: ${err.message}`);
      });
      
      if (!stations || stations.length === 0) {
        throw new Error("Data stasiun kosong, tidak ada yang bisa diekspor.");
      }

      // 2. Format CSV
      // ... (logic remains same)
      const headers = "DSI,Name,Position,Status,Condition,Note\n";
      const rows = stations.map(s => {
        return [
          s.stationId,
          s.stationName,
          `"${s.latitude}, ${s.longitude}"`,
          s.status?.label || 'UNKNOWN',
          `${s.conditionPercent || 0}%`,
          `"${s.note || '-'}"`
        ].join(",");
      }).join("\n");

      const csvContent = headers + rows;

      // 3. Open Native Save Dialog
      const path = await save({
        filters: [{ name: 'CSV', extensions: ['csv'] }],
        defaultPath: `sbnp-export-${new Date().getTime()}.csv`
      }).catch(err => {
        throw new Error(`Gagal membuka jendela simpan: ${err.message || err}`);
      });

      if (!path) return;

      // 4. Write File Natively
      await writeTextFile(path, csvContent).catch(err => {
        throw new Error(`Gagal menulis file ke disk: ${err.message}`);
      });

    } catch (error: any) {
      console.error("[ExportService] Error:", error);
      throw error;
    }
  },

  async downloadExcel(): Promise<void> {
    try {
      const token = localStorage.getItem("sbnp_admin_token");
      
      const response = await apiClient.get("/export/excel", {
        responseType: 'arraybuffer',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => {
        throw new Error(`Gagal menghubungi server [Excel]: ${err.message}`);
      });

      const path = await save({
        filters: [{ name: 'Excel', extensions: ['xlsx'] }],
        defaultPath: `sbnp-export-${new Date().getTime()}.xlsx`
      }).catch(err => {
        throw new Error(`Gagal membuka jendela simpan: ${err.message || err}`);
      });

      if (!path) return;

      await writeFile(path, new Uint8Array(response.data)).catch(err => {
        throw new Error(`Gagal menyimpan file Excel ke disk: ${err.message}`);
      });
    } catch (error: any) {
      console.error("[ExportService] Error:", error);
      throw error;
    }
  }
};
