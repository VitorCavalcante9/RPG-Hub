/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { SessionContext } from '../../contexts/SessionContext';
import manager from '../../services/websocket';

import styles from '../../styles/components/sessionItems/ChatModal.module.css';

import { Block } from '../Block';
import { Button } from '../Button';

import send from '../../assets/icons/send.svg';
import { TextAreaLabel } from '../TextAreaLabel';
import { Message } from './Message';

interface Messages{
  name: string;
  message: string;
}

interface ChatModalProps{
  selectedCharacter?: any;
}

interface RpgParams{
  id: string;
}

export function ChatModal({ selectedCharacter }: ChatModalProps){
  const params = useParams<RpgParams>();
  const {openModals, handleOpenModals} = useContext(SessionContext);

  const [messages, setMessages] = useState<Messages[]>([]);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');

  const msgRef = useRef<HTMLDivElement>(null);

  const socket = manager.socket('/session');

  useEffect(() => {
    socket.on('message', ({ name, message }: Messages)=> {
      const new_message = {
        name: name,
        message: message
      }
  
      setLastMessage(new_message); 
    })
  }, []);

  useEffect(() => {
    if(lastMessage){
      
      console.log(lastMessage)
      setMessages([...messages, lastMessage]);
      setLastMessage(null);
    }
  }, [lastMessage]);

  useEffect(() => {
    if(msgRef.current) {
      msgRef.current.scrollIntoView({ behavior: 'smooth'});
    };
  }, [messages]);

  function sendMessage(){
    const new_message = {
      name: 'Você',
      message: newMessage
    }

    setMessages([...messages, new_message]); 

    const character = selectedCharacter ? selectedCharacter : null;

    socket.emit('message', {
      message: newMessage, 
      room: params.id,
      character
    });
      
    setNewMessage('');
  }
  
  return(
    <>
    {openModals[3] ? (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <Block name="Chat" id={styles.chat} center={true}>
            {messages.map((message, index) => {
              return(
                <Message key={index} message={`${message.name}: ${message.message}`} msgRef={msgRef} />
              )
            })}
          </Block>

          <div className={styles.newMessageContainer}>
            <TextAreaLabel
              className={styles.inputNote} 
              name="note" 
              label="Escreva uma nova messagem" 
              value={newMessage}
              onChange={e => {setNewMessage(e.target.value)}}
            />
            <button 
              type='button' 
              onClick={sendMessage}
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