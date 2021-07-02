/* eslint-disable react-hooks/exhaustive-deps */
import React, { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { SessionContext } from '../../contexts/SessionContext';
import manager from '../../services/websocket';
import useDetectMobile from '../../utils/isMobile';

import styles from '../../styles/components/sessionItems/ChatModal.module.css';

import { Block } from '../Block';
import { Button } from '../Button';
import { TextAreaLabel } from '../TextAreaLabel';
import { Message } from './Message';

import send from '../../assets/icons/send.svg';

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
  const isMobile = useDetectMobile();

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
      setMessages([...messages, lastMessage]);
      setLastMessage(null);
    }
  }, [lastMessage]);

  useEffect(() => {
    if(msgRef.current) {
      msgRef.current.scrollIntoView({ behavior: 'smooth'});
    };
  }, [messages, openModals[3]]);

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

  function pressEnter(e: KeyboardEvent<HTMLTextAreaElement>){
    const key = e.key;
    if(!isMobile && key === 'Enter' && ! e.shiftKey) sendMessage()
  }
  
  return(
    <>
    {openModals[3] ? (
      <div className={styles.overlay}>
        <div className={styles.background} onClick={() => handleOpenModals(3)}/>
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
              name="message" 
              label="Escreva uma nova messagem" 
              value={newMessage}
              onChange={e => {setNewMessage(e.target.value)}}
              onKeyUp={e => pressEnter(e)}
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