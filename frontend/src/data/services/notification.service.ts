import { 
  isPermissionGranted, 
  requestPermission, 
  sendNotification 
} from "@tauri-apps/plugin-notification";

/**
 * Service to manage OS-level notifications for the SBNP Monitor.
 */
export const notificationService = {
  /**
   * Check and request permission from the User.
   */
  async ensurePermission(): Promise<boolean> {
    try {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
      return permissionGranted;
    } catch (error) {
      console.warn("Notification permission check failed (might not be supported in this environment):", error);
      return false;
    }
  },

  /**
   * Send a desktop notification alert.
   */
  async notifyStationIssue(stationName: string, status: string) {
    const hasPermission = await this.ensurePermission();
    
    if (hasPermission) {
      sendNotification({
        title: "🚨 SBNP PERINGATAN",
        body: `Stasiun ${stationName} terdeteksi berstatus: ${status}`,
        // Note: Icon can be added here if available in the app bundle
      });
    }
  }
};
