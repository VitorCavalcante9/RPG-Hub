import { Request } from 'express';

interface User{
  id: string;
}

class RpgHomeSocket{
  respond(endpoint, socket){
    console.log('user connected')

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
    
    socket.on('login', () => {
      emitUsers();
    })

    socket.on('update_users', () =>{
      emitUsers();
    });

    socket.on('disconnect', () => {
      console.log('user disconnected')
      emitUsers();
    })
  }
}

export default new RpgHomeSocket();