import jwt from 'jsonwebtoken';

interface TokenPayLoad{
  id: string;
  iat: number;
  exp: number;
}

class RpgHomeSocket{
  respond(endpoint, socket, user){
    console.log('user connected')
    console.log(user)

    const emitUsers = () => {
      console.log(1,getUsers());
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
      const data = jwt.verify(token, process.env.APP_KEY);
      const { id } = data as TokenPayLoad;
      socket.user = id;      
      console.log('login', id)
      emitUsers();
    })

    socket.on('update_users', () =>{
      console.log('update')
      socket.emit('users', getUsers());
    });

    socket.on('disconnect', () => {
      console.log('user disconnected')
      emitUsers();
    })
  }
}

export default new RpgHomeSocket();