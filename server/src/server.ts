import { app } from "./app";
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*'
  },
  transports: ['websocket']
});

server.listen(3333, () => console.log('Server is running'));