import jwt from 'jsonwebtoken';
import { AppError } from '../../models/AppError';

interface TokenPayLoad{
  id: string;
  iat: number;
  exp: number;
}

class RpgHomeSocket{
  respond(endpoint, socket, user){

    const emitUsers = () => {
      endpoint.emit('users', getUsers());
    }

    const getUsers = () => {
      let clients = endpoint.sockets;
      let users = [];
      clients.forEach((c) => {
        if(c.user != undefined) 
          users.push(c.user)
      })
      
      return users;
    }
    
    socket.on('login', token => {
      try{
        const data = jwt.verify(token, process.env.APP_KEY);
        const { id } = data as TokenPayLoad;
        socket.user = id;      
        emitUsers();
      } catch {}
    })

    socket.on('update_users', () =>{
      socket.emit('users', getUsers());
    });

    socket.on('disconnect', () => {
      emitUsers();
    })
  }
}

export default new RpgHomeSocket();