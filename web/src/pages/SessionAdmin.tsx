/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import { useHistory, useParams } from 'react-router';
import { useAlert } from 'react-alert';
import manager from '../services/websocket';
import api from '../services/api';

import { SessionContext } from '../contexts/SessionContext';

import styles from '../styles/pages/SessionAdmin.module.css';
import stylesSession from '../styles/pages/Session.module.css';

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

  let interval: NodeJS.Timeout;

  useEffect(() => {
    if(characterList){
      socket.on('req_update_session', () => {
        socket.emit('update_session', {
          room: params.id,
          characters: characterList,
          fixedCharacters: fixedCharacterList,
          scenario: fixedScenario,
          object: fixedObject
        })
      });
    }
  }, [characterList, fixedCharacterList, fixedScenario, fixedObject]);

  useEffect(() => {
    socket.emit('fixed_characters', ({
      room: params.id,
      characters: fixedCharacterList
    }))
  }, [fixedCharacterList]);

  useEffect(() => {
    socket.emit('update_characters', ({
      room: params.id,
      characters: characterList
    }));

    if(characterList.length > 0){
      interval = setInterval(() => {
        api.put(`rpgs/${params.id}/session`, { characters: characterList })
          .then()
          .catch(err => {
            if(!err.response) alert.error("Impossível conectar ao servidor!");
            else alert.error(err.response.data.message);
          })
      }, 60000)
    }
  }, [characterList]);

  useEffect(() => {
    socket.emit('update_scenario', ({
      room: params.id,
      scenario: fixedScenario
    }))
  }, [fixedScenario]);

  useEffect(() => {
    socket.emit('update_object', ({
      room: params.id,
      object: fixedObject
    }))
  }, [fixedObject]);

  function closeSession(){
    api.put(`rpgs/${params.id}/session`, { characters: characterList })
      .then(res => alert.success(res.data.message))
      .catch(err => {
        if(!err.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(err.response.data.message);
      })
    socket.emit('leave_room', { room: params.id, admin: true });
    clearInterval(interval);
    cleanSession();
    history.push(`/rpgs/${params.id}`);
    socket.close();
  }

  return(
    <>
      <DiceModal />
      <CharOptionsModal />
      <NotesModal />
      <ChatModal />

      {/* The Object Modal */}
      <div className={stylesSession.modal} style={{display: openObjectModal ? 'block' : 'none'}}>
        <span className={stylesSession.close} onClick={() => setOpenObjectModal(false)}>&times;</span>
        <img src={fixedObject?.image} alt={fixedObject?.name} className={stylesSession.modalContent} />
      </div>

      <div className={stylesSession.sessionContainer}>
        <div className={stylesSession.column1}>
          <div id={stylesSession.characterContainer} className={stylesSession.blocks}>
            {fixedCharacterList.map((character, index) => {
              return(
                <CharacterItem key={character.id} character={character} isMini={true} />
              );
            })}
          </div>

          <div className={stylesSession.buttonsContainer}>
            <Button className={stylesSession.buttons} text="Notas" onClick={() => {handleOpenModals(2)}}/>
            <Button className={stylesSession.buttons} text="Jogar Dados" onClick={() => {handleOpenModals(0)}}/>
            <Button className={stylesSession.buttons} text="Chat" onClick={() => {handleOpenModals(3)}}/>
          </div>

          <div id={stylesSession.scenarioContainer} className={stylesSession.blocks}>
            <img src={fixedScenario?.image} alt={fixedScenario?.name}/>
            <div className={classnames({[stylesSession.overlay]: fixedObject})}></div>
            <div className={stylesSession.objectItem} style={{display: fixedObject ? '' : 'none'}}>
              <img onClick={() => setOpenObjectModal(true)} src={fixedObject?.image} alt={fixedObject?.name}/>
            </div>
          </div>
        </div>

        <div className={stylesSession.column2}>
          <div id={stylesSession.itemsContainer} className={stylesSession.blocks}>
            <div className={stylesSession.itemsOptions}>
              <Button 
                className={classnames(stylesSession.buttons, {[stylesSession.selectedItemButton]: selectedItem === 'characters'})} 
                text="Personagens"
                onClick={() => setSelectedItem('characters')}  
              />
              <Button 
                className={classnames(stylesSession.buttons, {[stylesSession.selectedItemButton]: selectedItem === 'scenarios'})} 
                text="Cenários"
                onClick={() => setSelectedItem('scenarios')}  
              />
              <Button 
                className={classnames(stylesSession.buttons, {[stylesSession.selectedItemButton]: selectedItem === 'objects'})} 
                text="Itens"
                onClick={() => setSelectedItem('objects')}  
              />
            </div>
            <div className={`${stylesSession.itemsArea} ${styles.itemsArea}`}>
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

          <Button onClick={closeSession} className={stylesSession.logoutButton} text="Sair" />
        </div>
      </div>
    </>
  );
}