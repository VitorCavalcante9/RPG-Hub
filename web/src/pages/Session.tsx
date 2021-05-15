/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useLoading, Oval } from '@agney/react-loading';
import manager from '../services/websocket';
import api from '../services/api';

import { RpgContext } from '../contexts/RpgHomeContext';
import { SessionContext } from '../contexts/SessionContext';
import { SessionAdmin } from './SessionAdmin';
import { SessionParticipant } from './SessionParticipant';

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

interface Scenario{
  id: string;
  name: string;
  image?: string;
}

interface ObjectItem{
  id: string;
  name: string;
  image?: string;
}

export function Session(){
  const params = useParams<RpgParams>();
  const history = useHistory();
  const { isAdm } = useContext(RpgContext);
  const { loading, initializeSession, cleanSession } = useContext(SessionContext);

  const [roomIsOpen, setRoomIsOpen] = useState(false);
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const [scenarioList, setScenarioList] = useState<Scenario[]>([]);
  const [objectList, setObjectList] = useState<ObjectItem[]>([]);

  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Oval />
  });

  const socket = manager.socket('/session');
  
  useEffect(() => {
    api.get(`rpgs/${params.id}/scenarios`)
    .then(res => {
      if(res.data){
        console.log(res.data)
        setScenarioList(res.data);
      }
    }) 

    api.get(`rpgs/${params.id}/objects`)
    .then(res => {
      if(res.data){
        setObjectList(res.data);
      }
    })

    api.get(`rpgs/${params.id}/characters`)
    .then(res => {
      if(res.data){
        setCharacterList(res.data);
      }
    }) 
  }, [params.id])

  useEffect(() => {
    if(characterList.length > 0 && (scenarioList.length > 0 || objectList.length > 0)){
      initializeSession(characterList, scenarioList, objectList);
      socket.emit('open_rooms');
    }
  }, [characterList])

  socket.on('rooms', (rooms: Array<string>) => {
    const indexRoom = rooms.indexOf(params.id);
    if(indexRoom !== -1){
      setRoomIsOpen(true);
    } else {
      cleanSession();
      history.push(`/rpgs/${params.id}`);
    }
  });

  if(roomIsOpen){
    if(loading) return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div {...containerProps} style={{ 
          width: '100px'
        }}>
          {indicatorEl}
        </div>
      </div>
    )
    else if(isAdm && characterList.length > 0) return <SessionAdmin />
    else if (characterList.length > 0) {
      socket.emit('join_room', params.id);
      return <SessionParticipant />
    }
  }

  return(
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div {...containerProps} style={{ 
        width: '100px'
      }}>
        {indicatorEl}
      </div>
    </div>
  )
}