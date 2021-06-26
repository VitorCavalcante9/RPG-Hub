/* eslint-disable array-callback-return */
import React, { HTMLAttributes, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { RpgContext } from '../../contexts/RpgHomeContext';

import styles from '../../styles/components/modals/Modal.module.css';

import close from '../../assets/icons/cancel.svg';

interface ModalProps extends HTMLAttributes<HTMLDivElement>{
  title: string;
  open: boolean;
  account?: boolean;
  link?: string;
}

export function Modal({title, open, account, link, children}:ModalProps){
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(open);
  const {openModals, handleOpenModals, handleOpenAccountModal} = useContext(RpgContext);
  
  useEffect(() => {
    setIsOpen(open);
  }, [open])

  function handleOpenModal(){
    setIsOpen(false);
    if(link) history.push(link);

    openModals.map((openModal, index) => {
      if(openModal){
        handleOpenModals(index);
      }
    })
  }

  function handleAccountModal(){
    if(account) handleOpenAccountModal();
  }

  return(
    <>
      {isOpen ? (
        <div className={styles.overlay}>
          <div className={styles.background} onClick={handleOpenModal}></div>
          <div className={styles.container}>
            <header>{title}</header>
              {children}
            <button onClick={() => {handleOpenModal(); handleAccountModal();}} type="button">
              <img id={styles.close} src={close} alt="Fechar modal"/>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}