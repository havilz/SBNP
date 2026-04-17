import { useEffect } from "react";
import { socketClient } from "../../infrastructure/clients/socket.client";
import { useStationStore } from "../state/station.store";
import { Station } from "../../domain/models/station.model";
import { notificationService } from "../../data/services/notification.service";

/**
 * Custom hook to handle WebSocket connection and synchronization
 * between the backend stream and the global station store.
 */
export const useSocketSync = () => {
  const { updateStation } = useStationStore();

  useEffect(() => {
    // Ensure notification permission is requested once on mount
    notificationService.ensurePermission();

    // 1. Establish connection to Railway WebSocket
    socketClient.connect();

    // 2. Clear old listeners and register new ones
    socketClient.socket.off("sbnp_updated");
    
    socketClient.socket.on("sbnp_updated", (update: Station) => {
      console.log("[WebSocket] Update synchronization received for:", update.stationName);
      
      // Trigger notification if status is critical (PADAM)
      if (update.issueStatus === "PADAM") {
        notificationService.notifyStationIssue(update.stationName, update.status?.label || "PADAM");
      }

      // Update the global store directly
      updateStation(update);
    });

    // Cleanup on unmount
    return () => {
      console.log("[WebSocket] Cleaning up listeners...");
      socketClient.socket.off("sbnp_updated");
      // We don't necessarily disconnect here to keep connection alive 
      // if navigating between pages, but for a single-page dashboard 
      // it's fine.
    };
  }, [updateStation]);

  return {
    socket: socketClient.socket,
    isConnected: socketClient.socket.connected,
  };
};
