// utils/socket.ts
import { io } from 'socket.io-client';

// 'http://localhost:8001'
const socket = io('https://api.learngrow.live', {
    transports: ["websocket", "polling"],
    withCredentials: true, // Ensure credentials are sent
});
export default socket;