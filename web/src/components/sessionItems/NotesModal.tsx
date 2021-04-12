import React, { useContext, useState } from 'react';
import { SessionContext } from '../../contexts/SessionContext';

import styles from '../../styles/components/sessionItems/NotesModal.module.css';
import { Block } from '../Block';
import { Button } from '../Button';
import { TextAreaLabel } from '../TextAreaLabel';

import send from '../../assets/icons/send.svg';
import trash from '../../assets/icons/trash.svg';

export function NotesModal(){
  const {openModals, handleOpenModals} = useContext(SessionContext);
  const [notes, setNotes] = useState<string[]>([]);
  const [oneNote, setOneNote] = useState('');

  function removeNoteItem(position: number){
    const updatedNotes = notes.filter((note, index) => {
      return position !== index;
    })

    setNotes(updatedNotes);
  }

  return(
    <>
    {openModals[2] ? (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <Block name="Notas" id={styles.notes} center={true}>
            {notes.map((note, index) => {
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
            />
            <button 
              type='button' 
              onClick={() => { setNotes([...notes, oneNote])}}
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