import React, { useContext, useState } from 'react';
import { Modal } from './Modal';

import styles from '../../styles/components/modals/InviteModal.module.css';

import copy from '../../assets/icons/copy.svg'

import { RpgContext } from '../../contexts/RpgHomeContext';

export function InviteModal(){
  const {openModals} = useContext(RpgContext);
  const [link, setLink] = useState('link.com/s?id');

  return(
    <Modal open={openModals[0]} title="Convidar Pessoas">
      <div className={styles.content}>
        <div className={styles.line}>
          <p>Código: </p>
          <input readOnly value='XXXXXXXXXXXX' />
        </div>

        <div className={styles.line}>
          <p>Link: </p>
          <input readOnly value={link} />
          <button onClick={() => navigator.clipboard.writeText(link)}>
            <img src={copy} alt="Copiar"/>
          </button>
        </div>
      </div>
    </Modal>
  );
}