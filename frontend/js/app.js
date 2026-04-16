// Configuration
const PRODUCTION_URL = "https://sbnp-production.up.railway.app";
const API_URL = `${PRODUCTION_URL}/api`;

// State
let map;
let markers = {};
let stats = { total: 0, normal: 0, off: 0 };

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  loadInitialData();
  initWebSocket();
});

function initMap() {
  // Default center (Maluku region)
  map = L.map("map").setView([-3.65, 128.18], 8);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  }).addTo(map);
}

async function loadInitialData() {
  console.log("Fetching initial data from:", `${API_URL}/report/latest`);
  try {
    const response = await fetch(`${API_URL}/report/latest`);
    const result = await response.json();
    
    // Sesuaikan dengan struktur data NestJS (biasanya data ada di properti 'data' atau langsung array)
    const stations = result.data || result;

    console.log(`Data received: ${stations.length} stations found.`);
    processStations(stations);
  } catch (error) {
    console.error("Failed to load initial data:", error);
  }
}

function processStations(stations) {
  const latLngs = [];

  stations.forEach((station) => {
    updateStats(station.issueStatus, "add");
    addMarker(station);
    if (station.latitude && station.longitude) {
      latLngs.push([station.latitude, station.longitude]);
    }
  });

  // Auto-fit map to markers
  if (latLngs.length > 0) {
    map.fitBounds(latLngs, { padding: [50, 50] });
  }

  refreshStatsUI();
}

function addMarker(data) {
  if (!data.latitude || !data.longitude) return;

  const isOff = data.issueStatus === "PADAM";

  // Create custom icon using divIcon
  const icon = L.divIcon({
    className: "custom-div-icon",
    html: `<div class="${isOff ? "pulsing-marker" : "normal-marker"}" id="marker-${data.stationId}"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  const marker = L.marker([data.latitude, data.longitude], { icon }).addTo(map)
    .bindPopup(`
            <div style="min-width: 150px">
                <h3 style="margin: 0 0 5px 0; font-size: 1rem;">${data.stationName}</h3>
                <div style="font-size: 0.8rem; color: #94a3b8">
                    <p>ID: ${data.stationId}</p>
                    <p>Status: <b style="color: ${isOff ? "#f87171" : "#4ade80"}">${data.status?.label || data.issueStatus}</b></p>
                    <p>Condition: ${data.conditionPercent}%</p>
                    <p style="margin-top: 5px; font-style: italic">"${data.note || "No notes"}"</p>
                </div>
            </div>
        `);

  markers[data.stationId] = marker;
}

function initWebSocket() {
  console.log("Connecting to WebSocket at:", `${PRODUCTION_URL}/sbnp`);
  
  // Hubungkan ke root URL dengan namespace /sbnp
  const socket = io(`${PRODUCTION_URL}/sbnp`, {
    transports: ["websocket"]
  });

  socket.on("connect", () => {
    console.log("✅ WebSocket Connected to Railway!");
  });

  socket.on("connect_error", (err) => {
    console.error("❌ WebSocket Connection Error:", err);
  });

  socket.on("sbnp_updated", (update) => {
    console.log("📢 Realtime Update Received:", update);
    handleRealtimeUpdate(update);
  });
}

function handleRealtimeUpdate(update) {
  // 1. Update stats (deduct old, add new)
  // For simplicity in this mockup, we'll re-scan or just adjust if we tracked previous state
  // Let's find the old marker to see previous status
  const oldMarker = markers[update.stationId];
  if (oldMarker) {
    // This logic is simplified for the mockup
    // We'll just update the marker and UI
  }

  // 2. Update Marker
  if (markers[update.stationId]) {
    const isOff = update.issueStatus === "PADAM";
    const icon = L.divIcon({
      className: "custom-div-icon",
      html: `<div class="${isOff ? "pulsing-marker" : "normal-marker"}"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
    markers[update.stationId].setIcon(icon);
    markers[update.stationId].setPopupContent(`
            <div style="min-width: 150px">
                <h3 style="margin: 0 0 5px 0; font-size: 1rem;">${update.stationName}</h3>
                <div style="font-size: 0.8rem; color: #94a3b8">
                    <p>ID: ${update.stationId}</p>
                    <p>Status: <b style="color: ${isOff ? "#f87171" : "#4ade80"}">${update.status.label}</b></p>
                    <p>Condition: ${update.conditionPercent}%</p>
                    <p style="margin-top: 5px; font-style: italic">"${update.note || "No notes"}"</p>
                </div>
            </div>
        `);
  }

  // 3. Add to Live Feed
  addToLiveFeed(update);

  // 4. Update Stats counters (Refetching is safer for mockup consistency)
  calculateStats();
}

async function calculateStats() {
  try {
    const res = await fetch(`${API_URL}/report/latest`);
    const { data } = await res.json();

    stats = { total: data.length, normal: 0, off: 0 };
    data.forEach((s) => {
      if (s.issueStatus === "NIHIL") stats.normal++;
      else if (s.issueStatus === "PADAM") stats.off++;
    });
    refreshStatsUI();
  } catch (e) {}
}

function addToLiveFeed(update) {
  const feed = document.getElementById("liveFeed");
  const placeholder = feed.querySelector(".feed-placeholder");
  if (placeholder) placeholder.remove();

  const isOff = update.issueStatus === "PADAM";
  const item = document.createElement("div");
  item.className = "feed-item";
  item.innerHTML = `
        <div class="header">
            <span class="station-name">${update.stationName}</span>
            <span class="status-badge ${isOff ? "status-off" : "status-normal"}">${update.status.label}</span>
        </div>
        <div class="meta">
            Condition: ${update.conditionPercent}% <br>
            ${update.note || ""}
        </div>
        <div style="font-size: 0.65rem; color: #64748b; margin-top: 8px;">
            ${new Date().toLocaleTimeString()}
        </div>
    `;

  feed.prepend(item);

  // Keep only last 20 items
  if (feed.children.length > 20) {
    feed.removeChild(feed.lastChild);
  }
}

function updateStats(status, mode) {
  stats.total++;
  if (status === "NIHIL") stats.normal++;
  else if (status === "PADAM") stats.off++;
}

function refreshStatsUI() {
  document.getElementById("statTotal").innerText = stats.total;
  document.getElementById("statNormal").innerText = stats.normal;
  document.getElementById("statOff").innerText = stats.off;
}
