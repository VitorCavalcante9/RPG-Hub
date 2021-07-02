/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { RpgContext } from '../../contexts/RpgHomeContext';
import api from '../../services/api';
import manager from '../../services/websocket';

import styles from '../../styles/components/modals/AccountListModal.module.css';

import { AccountItem } from '../AccountItem';
import { Button } from '../Button';
import { Modal } from './Modal';

interface RpgParams{
  id: string;
}

interface User{
  id: string;
  username: string;
  icon?: string;
  online?: boolean;
}

export function AccountListModal(){
  const params = useParams<RpgParams>();
  const {openModals, handleOpenModals} = useContext(RpgContext);
  const [players, setPlayers] = useState<User[]>([]);
  const [playersStatus, setPlayersStatus] = useState<User[]>([]);

  const socket = manager.socket('/rpgHome');

  useEffect(() => {
    if(players.length > 0){
      socket.on('users', (users: any) => {        
        const updatePlayers = playersStatus.map(player => {
          const index = users.indexOf(player.id);
          if(index !== -1){
            return {...player, 'online': true};
          }
    
          return {...player, 'online': false}
        })
    
        setPlayersStatus(updatePlayers);
      }) 
    }
  }, [players])

  useEffect(() => {
    api.get(`rpgs/${params.id}/participant`)
    .then(res => {
      const { participants } = res.data;
      if(participants){
        setPlayersStatus(participants);
        setPlayers(participants);
      };
      socket.emit('update_users');
    })     
  }, [params.id]); 

  return(
    <Modal open={openModals[3]} title="Todos os jogadores">
      <div className={styles.content}>
        <div className={styles.blockList}>
          {playersStatus.map(player => {
            if(player.online){
              return(
                <AccountItem key={player.id} name={player.username} status={player.online} icon={player.icon} />
              )
            }
          })
          }
          {playersStatus.map(player => {
            if(!player.online){
              return(
                <AccountItem key={player.id} name={player.username} status={player.online} icon={player.icon} />
              )
            }
          })}
        </div>

        <Button text="Fechar" onClick={() => handleOpenModals(3)} />
      </div>
    </Modal>
  )
}