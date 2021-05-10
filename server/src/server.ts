import { app } from "./app";
import http from 'http';
import { Server } from 'socket.io';
import RpgHomeSocket from "./controllers/webSocket/RpgHomeSocket";
import SessionSocket from "./controllers/webSocket/SessionSocket";

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*'
  },
  transports: ['websocket']
});

const rpgHome = io.of('/rpgHome').on('connection', socket => {
  RpgHomeSocket.respond(rpgHome, socket, io.user);
})

const session = io.of('/session').on('connection', socket => {
  socket.user = io.user;
  SessionSocket.respond(session, socket);
})

server.listen(process.env.PORT, () => console.log('Server is running'));