/* eslint-disable react-hooks/exhaustive-deps */
import React, { KeyboardEvent, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAlert } from 'react-alert';
import api from '../../services/api';
import { SessionContext } from '../../contexts/SessionContext';
import useDetectMobile from '../../utils/isMobile';

import styles from '../../styles/components/sessionItems/NotesModal.module.css';

import { Block } from '../Block';
import { Button } from '../Button';
import { TextAreaLabel } from '../TextAreaLabel';

import send from '../../assets/icons/send.svg';
import trash from '../../assets/icons/trash.svg';

interface RpgParams{
  id: string;
}

interface Notes{
  id: number;
  notes: Array<string>;
}

export function NotesModal(){
  const params = useParams<RpgParams>();
  const {openModals, handleOpenModals} = useContext(SessionContext);
  const alert = useAlert();
  const [notes, setNotes] = useState<Notes>({ id: 0, notes: []});
  const [oneNote, setOneNote] = useState('');
  const isMobile = useDetectMobile();

  useEffect(() => {
    api.get(`rpgs/${params.id}/notes`)
    .then(res => {
      if(res.data.notes){
        setNotes(res.data);
      } else {
        setNotes({ id: res.data.id, notes: [] });
      }

    }).catch(err => {
      if(!err.response) alert.error("Impossível conectar ao servidor!");
      else if(err.response.status !== 404) alert.error(err.response.data.message);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  useEffect(() => {
    const data = {
      notes: notes.notes
    }

    api.put(`/rpgs/${params.id}/notes`, data)
      .then()
      .catch(err => {
        if(!err.response) alert.error("Impossível conectar ao servidor!");
        else if(err.response.status !== 404) alert.error(err.response.data.message);
      });
  }, [notes.notes])

  function removeNoteItem(position: number){
    const updatedArrayNotes = notes.notes.filter((note, index) => {
      return position !== index;
    })

    setNotes({...notes, 'notes': updatedArrayNotes});
  }

  function addNoteItem(){
    setNotes({...notes, 'notes': [...notes.notes, oneNote]});
    setOneNote('');
  }

  function pressEnter(e: KeyboardEvent<HTMLTextAreaElement>){
    const key = e.key;
    if(!isMobile && key === 'Enter' && ! e.shiftKey) addNoteItem();
  }
  
  return(
    <>
    {openModals[2] ? (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <Block name="Notas" id={styles.notes} center={true}>
            {notes.notes.map((note, index) => {
              return(
                <div key={index} className={styles.noteItem}>
                  <p>{note}</p> 
                  <button type='button' onClick={() => removeNoteItem(index)}><img src={trash} alt="Remover"/></button>
                </div>
              )
            })}
          </Block>

          <div className={styles.newNoteContainer}>
            <TextAreaLabel
              className={styles.inputNote} 
              name="note" 
              label="Escreva uma nova nota" 
              value={oneNote}
              onChange={e => {setOneNote(e.target.value)}}
              onKeyUp={e => pressEnter(e)}
            />
            <button 
              type='button' 
              onClick={addNoteItem}
            >
              <img src={send} alt="Enviar"/>
            </button>
          </div>
          
          <Button className={styles.closeButton} text="Fechar" onClick={() => {handleOpenModals(2)}}/>
        </div>
      </div>
    ): null}
    </>
  )
}