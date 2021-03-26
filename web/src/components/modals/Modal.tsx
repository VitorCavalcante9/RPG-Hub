import React, { HTMLAttributes, useContext, useEffect, useRef, useState } from 'react';

import styles from '../../styles/components/modals/Modal.module.css';

import close from '../../assets/icons/cancel.svg';
import { RpgContext } from '../../contexts/RpgHomeContext';

interface ModalProps extends HTMLAttributes<HTMLDivElement>{
  title: string;
  open: boolean;
}

export function Modal({title, open, children}:ModalProps){
  const [isOpen, setIsOpen] = useState(open);
  const {openModals, handleOpenModals} = useContext(RpgContext);
  
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

  return(
    <>
      {isOpen ? (
        <div className={styles.overlay}>
          <div className={styles.container}>
            <header>{title}</header>
              {children}
            <button onClick={handleOpenModal} type="button">
              <img id={styles.close} src={close} alt="Fechar modal"/>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}