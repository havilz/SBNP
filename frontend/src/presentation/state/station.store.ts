import { create } from "zustand";
import { Station } from "../../domain/models/station.model";
import { stationService } from "../../data/services/station.service";

interface StationState {
  stations: Station[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStations: () => Promise<void>;
  updateStation: (updatedStation: Station) => void;
  setStations: (stations: Station[]) => void;
}

/**
 * Global store for Station data using Zustand.
 * Manages the list of stations and provides actions for updates.
 */
export const useStationStore = create<StationState>((set) => ({
  stations: [],
  isLoading: false,
  error: null,

  fetchStations: async () => {
    set({ isLoading: true, error: null });
    try {
      const stations = await stationService.getLatestStations();
      set({ stations, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to load stations", isLoading: false });
    }
  },

  updateStation: (updatedStation: Station) => {
    set((state) => ({
      stations: state.stations.map((s) =>
        s.stationId === updatedStation.stationId ? { ...s, ...updatedStation } : s
      ),
    }));
  },

  setStations: (stations: Station[]) => {
    set({ stations });
  },
}));
