import { io, Socket } from "socket.io-client";
import { config } from "../config/config";

/**
 * Singletone WebSocket Client for SBNP Realtime Data.
 * Connected to the '/sbnp' namespace as defined in the backend.
 */
class SocketClient {
  private static instance: SocketClient;
  public socket: Socket;

  private constructor() {
    this.socket = io(config.websocket.url, {
      transports: ["websocket"],
      autoConnect: false, // Explicit connect for better performance control
    });

    this.initializeHandlers();
  }

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  private initializeHandlers() {
    this.socket.on("connect", () => {
      console.log("[WebSocket] Connected to SBNP Stream");
    });

    this.socket.on("disconnect", () => {
      console.log("[WebSocket] Disconnected from SBNP Stream");
    });

    this.socket.on("connect_error", (error) => {
      console.error("[WebSocket] Connection Error:", error);
    });
  }

  public connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  public disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }
}

export const socketClient = SocketClient.getInstance();
