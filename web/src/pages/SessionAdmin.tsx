import React, { useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import { useHistory, useParams } from 'react-router';
import { useAlert } from 'react-alert';
import manager from '../services/websocket';
import api from '../services/api';

import { SessionContext } from '../contexts/SessionContext';

import styles from '../styles/pages/SessionAdmin.module.css';

import { Button } from '../components/Button';
import { CharacterItem } from '../components/sessionItems/CharacterItem';
import { ScenarioItem } from '../components/sessionItems/ScenarioItem';
import { ObjectItem } from '../components/sessionItems/ObjectItem';
import { DiceModal } from '../components/sessionItems/DiceModal';
import { CharOptionsModal } from '../components/sessionItems/CharOptionsModal';
import { NotesModal } from '../components/sessionItems/NotesModal';
import { ChatModal } from '../components/sessionItems/ChatModal';

interface RpgParams{
  id: string;
}

export function SessionAdmin(){
  const params = useParams<RpgParams>();
  const history = useHistory();
  const alert = useAlert();
  const {
    characterList, 
    fixedCharacterList, 
    scenarioList, 
    fixedScenario, 
    objectList, 
    fixedObject, 
    cleanSession,
    handleOpenModals, 
    handleSelectedCharacter
  } = useContext(SessionContext);
  const [selectedItem, setSelectedItem] = useState('characters');

  const [openObjectModal, setOpenObjectModal] = useState(false);

  const socket = manager.socket('/session');

  useEffect(() => {
    socket.emit('fixed_characters', ({
      room: params.id,
      characters: fixedCharacterList
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedCharacterList]);

  useEffect(() => {
    socket.emit('update_characters', ({
      room: params.id,
      characters: characterList
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterList]);

  useEffect(() => {
    socket.emit('update_scenario', ({
      room: params.id,
      scenario: fixedScenario
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedScenario]);

  useEffect(() => {
    socket.emit('update_object', ({
      room: params.id,
      object: fixedObject
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedObject]);

  socket.on('req_update_session', () => {
    socket.emit('update_session', {
      room: params.id,
      characters: characterList,
      fixedCharacters: fixedCharacterList,
      scenario: fixedScenario,
      object: fixedObject
    })
  });

  function closeSession(){
    api.put(`rpgs/${params.id}/session`, { characters: characterList })
      .then(res => alert.success())
      .catch(err => {
        if(!err.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(err.response.data.message);
      })
    socket.emit('leave_room', { room: params.id, admin: true });
    cleanSession();
    history.push(`/rpgs/${params.id}`);
  }

  return(
    <>
      <DiceModal />
      <CharOptionsModal />
      <NotesModal />
      <ChatModal />

      {/* The Object Modal */}
      <div className={styles.modal} style={{display: openObjectModal ? 'block' : 'none'}}>
        <span className={styles.close} onClick={() => setOpenObjectModal(false)}>&times;</span>
        <img src={fixedObject?.image} alt={fixedObject?.name} className={styles.modalContent} />
      </div>

      <div className={styles.sessionContainer}>
        <div className={styles.column1}>
          <div id={styles.characterContainer} className={styles.blocks}>
            {fixedCharacterList.map((character, index) => {
              return(
                <CharacterItem key={character.id} character={character} isMini={true} />
              );
            })}
          </div>

          <div className={styles.buttonsContainer}>
            <Button className={styles.buttons} text="Notas" onClick={() => {handleOpenModals(2)}}/>
            <Button className={styles.buttons} text="Jogar Dados" onClick={() => {handleOpenModals(0)}}/>
            <Button className={styles.buttons} text="Chat" onClick={() => {handleOpenModals(3)}}/>
          </div>

          <div id={styles.scenarioContainer} className={styles.blocks}>
            <img src={fixedScenario?.image} alt={fixedScenario?.name}/>
            <div className={classnames({[styles.overlay]: fixedObject})}></div>
            <div className={styles.objectItem} style={{display: fixedObject ? '' : 'none'}}>
              <img onClick={() => setOpenObjectModal(true)} src={fixedObject?.image} alt={fixedObject?.name}/>
            </div>
          </div>
        </div>

        <div className={styles.column2}>
          <div id={styles.itemsContainer} className={styles.blocks}>
            <div className={styles.itemsOptions}>
              <Button 
                className={classnames(styles.buttons, {[styles.selectedItemButton]: selectedItem === 'characters'})} 
                text="Personagens"
                onClick={() => setSelectedItem('characters')}  
              />
              <Button 
                className={classnames(styles.buttons, {[styles.selectedItemButton]: selectedItem === 'scenarios'})} 
                text="Cenários"
                onClick={() => setSelectedItem('scenarios')}  
              />
              <Button 
                className={classnames(styles.buttons, {[styles.selectedItemButton]: selectedItem === 'objects'})} 
                text="Itens"
                onClick={() => setSelectedItem('objects')}  
              />
            </div>
            <div className={`${styles.itemsArea} custom-scrollbar`}>
            {(() => {
              if(selectedItem === 'characters'){
                return(
                  characterList.map((character) => {
                    return(
                      <CharacterItem 
                        key={character.id} 
                        className={styles.charItem} 
                        character={character} 
                        fixButton={true}
                        hover={true}
                        onClick={() => {handleSelectedCharacter(character); handleOpenModals(1)}} />
                    );
                  })
                )
              }
              else if(selectedItem === 'scenarios'){
                return(
                  scenarioList.map((scenario, index) => {
                    return(
                      <ScenarioItem key={index} scenario={scenario}/>
                    );
                  })
                )
              }   
              else if(selectedItem === 'objects'){
                return(
                  objectList.map((objectItem, index) => {
                    return(
                      <ObjectItem key={index} object={objectItem} />
                    );
                  })
                )
              }      
            })()}
            </div>
          </div>

          <Button onClick={closeSession} className={styles.logoutButton} text="Sair" />
        </div>
      </div>
    </>
  );
}