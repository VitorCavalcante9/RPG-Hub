import * as SocketIO from 'socket.io';

declare module 'socket.io'{
  interface User{
    id?: string;
  }

  export interface Socket{
    user: Object<User>;
  }

  export interface Server{
    user: Object<User>;
  }
}