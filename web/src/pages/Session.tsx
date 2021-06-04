/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import manager from '../services/websocket';
import api from '../services/api';

import { SessionContext } from '../contexts/SessionContext';
import { SessionAdmin } from './SessionAdmin';
import { SessionParticipant } from './SessionParticipant';
import { Loading } from '../components/Loading';

interface RpgParams{
  id: string;
}

interface Character{
  id: string;
  name: string;
  icon?: string;
  status: Array<{
    name: string;
    color: string;
    current: number;
    limit: number;
  }>;
  skills: Array<{
    name: string;
    current: number;
    limit: number;
  }>;
  inventory: Array<string>;
}

export function Session(){
  const params = useParams<RpgParams>();
  const history = useHistory();
  const { loading, initializeSession, cleanSession } = useContext(SessionContext);

  const [roomIsOpen, setRoomIsOpen] = useState(false);
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const [isAdm, setIsAdm] = useState(false);

  const socket = manager.socket('/session');
  
  useEffect(() => {
    if(params.id){

      const rpgs = localStorage.getItem('rpgs');
      if(rpgs){
        const allRpgs = JSON.parse(rpgs);
        const indexRpg = allRpgs.rpgs.indexOf(params.id);
        if(indexRpg !== -1) setIsAdm(true);   
      }

      api.get(`rpgs/${params.id}/session`)
      .then(res => {
        if(res.data){
          const { characters, scenarios, objects } = res.data;
          setCharacterList(characters);

          initializeSession(characters, scenarios, objects);

          if(socket.disconnected){
            socket.open();
          }
          socket.emit('open_rooms');
        }
      });

      socket.on('rooms', (rooms: Array<string>) => {
        const indexRoom = rooms.indexOf(params.id);
        if(indexRoom !== -1){
          setRoomIsOpen(true);
        } else {
          cleanSession();
          history.push(`/rpgs/${params.id}`);
          socket.close();
        }
      });
    }

  }, [window.location]);

  if(roomIsOpen){
    if(loading) return <Loading />
    else if(isAdm && characterList.length > 0) return <SessionAdmin />
    else if(!isAdm && characterList.length > 0) {
      socket.emit('join_room', params.id);
      return <SessionParticipant />
    }
  }

  return(
    <Loading />
  )
}