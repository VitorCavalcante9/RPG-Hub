import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
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
  online?: boolean;
}

export function AccountListModal(){
  const params = useParams<RpgParams>();
  const { getToken } = useContext(AuthContext);
  const token = getToken();
  const {openModals, handleOpenModals} = useContext(RpgContext);
  const [players, setPlayers] = useState<User[]>([]);

  const socket = manager.socket('/rpgHome');
  socket.open();

  useEffect(() => {
    api.get(`rpgs/${params.id}/participant`, {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then(res => {
      const { participants } = res.data;
      if(participants) setPlayers(participants);
      socket.emit('update_users');
    })     
  }, [params.id]);

  socket.on('users', (users: any) => {
    const updatePlayers = players.map(player => {
      const index = users.indexOf(player.id);
      if(index !== -1){
        return {...player, ['online']: true};
      }

      return {...player, ['online']: false}
    })

    setPlayers(updatePlayers);
  })

  return(
    <Modal open={openModals[3]} title="Todos os jogadores">
      <div className={styles.content}>
        <div className={styles.blockList}>
          {players.map((player) => {
            return(
              <AccountItem key={player.id} name={player.username} status={player.online}/>
            );
          })}
        </div>

        <Button text="Fechar" onClick={() => handleOpenModals(3)} />
      </div>
    </Modal>
  )
}