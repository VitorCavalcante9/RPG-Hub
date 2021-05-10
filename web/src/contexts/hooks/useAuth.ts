import { useEffect, useState } from 'react';

import api from '../../services/api';
import manager from '../../services/websocket';

interface RPG{
  id: string;
  name: string;
  icon: string;
}

export default function useAuth(){
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const socket = manager.socket('/rpgHome');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token){
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
      
      socket.open();
      socket.emit('login', JSON.parse(token));
    }

    setLoading(false);
  }, [socket]);

  function handleLogin(token: JSON){
    localStorage.setItem('token', JSON.stringify(token));
    
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setAuthenticated(true);

    api.get('home', {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then(res => {
      const {rpgs} = res.data;
      const rpg_ids = rpgs.map((rpg: RPG) =>{return rpg.id});

      localStorage.setItem('rpgs', JSON.stringify(rpg_ids));

    }).catch(error => {
      if(!error.response) console.error("Impossível conectar ao servidor!");
      else console.error(error.response.data);
    });
  }

  function handleLogout(){
    socket.close();
    setAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('rpgs');
    api.defaults.headers.Authorization = undefined;
    window.location.href = "/";
  }

  return {authenticated, loading, handleLogin, handleLogout}

}