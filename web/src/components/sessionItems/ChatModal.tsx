import React, { useContext, useState } from 'react';
import { SessionContext } from '../../contexts/SessionContext';

import styles from '../../styles/components/sessionItems/ChatModal.module.css';
import { Block } from '../Block';
import { Button } from '../Button';
import { InputLabel } from '../InputLabel';

import send from '../../assets/icons/send.svg';

export function ChatModal(){
  const {openModals, handleOpenModals} = useContext(SessionContext);
  const [messages, setMessages] = useState<string[]>([]);
  const [oneMessage, setOneMessage] = useState('');

  return(
    <>
    {openModals[3] ? (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <Block name="Chat" id={styles.chat} center={true}>
            {messages.map((message, index) => {
              return(
                <div key={index} className={styles.messageItem}>
                  <p>{message}</p> 
                </div>
              )
            })}
          </Block>

          <div className={styles.newMessageContainer}>
            <InputLabel
              className={styles.inputNote} 
              name="note" 
              label="Escreva uma nova messagem" 
              value={oneMessage}
              onChange={e => {setOneMessage(e.target.value)}}
            />
            <button 
              type='button' 
              onClick={() => { setMessages([...messages, oneMessage])}}
            >
              <img src={send} alt="Enviar"/>
            </button>
          </div>
          
          <Button className={styles.closeButton} text="Fechar" onClick={() => {handleOpenModals(3)}}/>
        </div>
      </div>
    ): null}
    </>
  )
}