import React, { HTMLAttributes, useContext, useEffect, useRef, useState } from 'react';

import styles from '../../styles/components/modals/Modal.module.css';

import close from '../../assets/icons/cancel.svg';
import { RpgContext } from '../../contexts/RpgHomeContext';

interface ModalProps extends HTMLAttributes<HTMLDivElement>{
  title: string;
  open: boolean;
  account?: boolean;
}

export function Modal({title, open, account, children}:ModalProps){
  const [isOpen, setIsOpen] = useState(open);
  const {openModals, handleOpenModals, handleOpenAccountModal} = useContext(RpgContext);
  
  useEffect(() => {
    setIsOpen(open);
  }, [open])

  function handleOpenModal(){
    setIsOpen(false);

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