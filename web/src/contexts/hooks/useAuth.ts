/* eslint-disable react-hooks/exhaustive-deps */
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
  }, []);

  function handleLogin(token: JSON, username: string, icon: string){
    localStorage.setItem('token', JSON.stringify(token));

    const user = {
      username, icon
    }

    localStorage.setItem('user', JSON.stringify(user));

    api.defaults.headers.Authorization = `Bearer ${token}`;
    socket.open();
    socket.emit('login', token);

    api.get('home', {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then(res => {
      const {rpgs: your_rpgs, participating_rpgs} = res.data;

      const rpg_ids = your_rpgs.map((rpg: RPG) =>{return rpg.id});
      const participant_rpg_ids = participating_rpgs.map((rpg: RPG) =>{return rpg.id});

      const rpgs = {
        rpgs: rpg_ids ? rpg_ids : [],
        participating_rpgs: participant_rpg_ids ? participant_rpg_ids : []
      }

      localStorage.setItem('rpgs', JSON.stringify(rpgs));

    }).catch(error => {
      if(!error.response) console.error("Impossível conectar ao servidor!");
      else console.error(error.response.data);
    });
    
    setAuthenticated(true);
  }

  function handleLogout(){
    socket.close();
    setAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rpgs');
    api.defaults.headers.Authorization = undefined;
    window.location.href = "/";
  }

  return {authenticated, loading, handleLogin, handleLogout}

}