import { Manager } from 'socket.io-client'; 

const manager = new Manager(`${process.env.REACT_APP_API_URL}`, {
  autoConnect: false,
  reconnectionAttempts: 3,
  timeout: 5000,
  transports: ['websocket']
});

export default manager;