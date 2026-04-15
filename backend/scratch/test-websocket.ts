import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/sbnp', {
  transports: ['websocket'],
});

console.log('Connecting to SBNP WebSocket Gateway...');

socket.on('connect', () => {
  console.log('SUCCESS: Connected to SBNP Real-time Hub!');
  console.log('Waiting for status updates (simulation or manual input)...');
});

socket.on('sbnp_updated', (data) => {
  console.log('-------------------------------------------');
  console.log('REAL-TIME UPDATE RECEIVED:');
  console.log(`Station: ${data.stationName} (${data.stationId})`);
  console.log(`Status: ${data.status.label} (${data.status.raw})`);
  console.log(`Condition: ${data.conditionPercent}%`);
  console.log(`Note: ${data.note}`);
  console.log(`At: ${data.reportedAt}`);
  console.log('-------------------------------------------');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});

socket.on('connect_error', (error) => {
  console.error('Connection Error:', error.message);
});

// Keep process alive for 2 minutes to catch simulation updates
setTimeout(() => {
  console.log('Test finished. Closing connection.');
  socket.disconnect();
  process.exit(0);
}, 120000);
