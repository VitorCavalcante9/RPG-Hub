

class SessionSocket{
  respond(endpoint, socket){
    console.log('session user connected')

    //Open, join and leave of the room
    socket.on('open_rooms', () => {
      let allSockets = Array.from(endpoint.adapter.rooms);
      let allRooms = allSockets.filter(r => {
        if(r[0].length !== 20) return r[0]
      })
      let rooms = allRooms.map(r => r[0]);
      
      socket.emit('rooms', rooms);
    });

    socket.on('join_room', room => {
      socket.join(room);
    });

    socket.on('leave_room', ({ room, admin }) => {
      if(admin) socket.to(room).emit('session_closed');
      socket.leave(room);
    });

    //Update fixed characters and characters (status, skills and inventory)
    socket.on('fixed_characters', ({ room, characters}) => {
      socket.to(room).emit('fixed_characters', characters);
    });

    socket.on('update_characters', ({ room, characters}) => {
      socket.to(room).emit('update_characters', characters);
    });

    //Update session participant
    socket.on('req_update_session', room => {
      console.log('pediu')
      socket.to(room).emit('req_update_session');
    });

    socket.on('update_session', ({ 
      room, characters, fixedCharacters, scenario, object
    }) => {
      console.log(scenario, object)
      socket.to(room).emit('update_session', { 
        characters, fixedCharacters, scenario, object 
      });
    });

    //Update Fixed Scenario and Fixed Object
    socket.on('update_scenario', ({ room, scenario}) => {
      socket.to(room).emit('update_scenario', scenario);
    });

    socket.on('update_object', ({ room, object}) => {
      socket.to(room).emit('update_object', object);
    });

    //Chat
    socket.on('message', ({room, message, character}) => {
      let name = '';
      if(character) name = character.name;
      else name = 'Mestre'
      
      console.log(name, message)
      socket.to(room).emit('message', {
        message,
        name
      });
    });

    //Roll Dice
    socket.on('roll_dices', ({room, message}) => {
      console.log('chegou')
      socket.to(room).emit('roll_dices', {
        message
      });
    });
  }
}

export default new SessionSocket();