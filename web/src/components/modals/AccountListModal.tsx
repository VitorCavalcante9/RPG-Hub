import React, { useContext, useState } from 'react';
import { RpgContext } from '../../contexts/RpgHomeContext';

import styles from '../../styles/components/modals/AccountListModal.module.css';
import { Button } from '../Button';
import { Modal } from './Modal';

export function AccountListModal(){
  const {openModals, handleOpenModals} = useContext(RpgContext);
  const [players, setPlayers] = useState<string[]>(['Usuário 1', 'Usuário 2'])

  return(
    <Modal open={openModals[3]} title="Todos os jogadores">
      <div className={styles.content}>
        <div className={styles.blockList}>
          {players.map((player, index) => {
            return(
              <div className={styles.playerItem}>
                <p>{player}</p>
                <div className={styles.status}>
                  <div className={styles.circle}></div>
                  <p>Online</p>
                </div>
              </div>
            );
          })}
        </div>

        <Button text="Fechar" onClick={() => handleOpenModals(3)} />
      </div>
    </Modal>
  )
}