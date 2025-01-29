// utils/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:8001', {
    transports: ["websocket", "polling"],
    withCredentials: true, // Ensure credentials are sent
});
export default socket;