import React, { useContext, useState } from 'react';
import { Modal } from './Modal';

import styles from '../../styles/components/modals/InviteModal.module.css';

import copy from '../../assets/icons/copy.svg'

import { RpgContext } from '../../contexts/RpgHomeContext';
import { useParams } from 'react-router';

interface RpgParams{
  id: string;
}

export function InviteModal(){
  const params = useParams<RpgParams>();
  const {openModals} = useContext(RpgContext);
  const [link, setLink] = useState(`${process.env.REACT_APP_URL}/invite/?r=${params.id}`);

  return(
    <Modal open={openModals[0]} title="Convidar Pessoas">
      <div className={styles.content}>
        <div className={styles.line}>
          <p>Código: </p>
          <div>
            <input readOnly value={`${params.id}`} />
            <button onClick={() => navigator.clipboard.writeText(params.id)}>
              <img src={copy} alt="Copiar"/>
            </button>
          </div>
        </div>

        <div className={styles.line}>
          <p>Link: </p>
          <div>
            <input readOnly value={link} />
            <button onClick={() => navigator.clipboard.writeText(link)}>
              <img src={copy} alt="Copiar"/>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}