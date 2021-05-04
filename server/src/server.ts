import { app } from "./app";
import http from 'http';
import { Server } from 'socket.io';
import RpgHomeSocket from "./controllers/webSocket/RpgHomeSocket";
import authMiddleware from "./middleware/authMiddleware";

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*'
  },
  transports: ['websocket']
});


const rpgHome = io.of('/rpgHome').on('connection', socket => {
  socket.user = io.user;
  RpgHomeSocket.respond(rpgHome, socket);
})

server.listen(process.env.PORT, () => console.log('Server is running'));