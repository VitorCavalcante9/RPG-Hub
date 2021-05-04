import { Manager } from 'socket.io-client'; 

const manager = new Manager(`${process.env.REACT_APP_API_URL}`, {
  autoConnect: false,
  reconnectionAttempts: 3,
  timeout: 2000,
  transports: ['websocket'],
  reconnectionDelay: 2000
});

export default manager;