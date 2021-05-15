/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import classnames from 'classnames';
import manager from '../services/websocket';
import api from '../services/api';

import { SessionContext } from '../contexts/SessionContext';

import styles from '../styles/pages/SessionParticipant.module.css';
import stylesSession from '../styles/pages/Session.module.css';

import { Button } from '../components/Button';
import { CharacterItem } from '../components/sessionItems/CharacterItem';
import { DiceModal } from '../components/sessionItems/DiceModal';
import { NotesModal } from '../components/sessionItems/NotesModal';
import { ChatModal } from '../components/sessionItems/ChatModal';
import { SkillsItems } from '../components/characterItems/SkillsItem';
import { StatusItem } from '../components/characterItems/StatusItem';
import { InventoryItem } from '../components/characterItems/InventoryItem';

interface RpgParams{
  id: string;
}

interface Character{
  id: string;
  name: string;
  icon?: string;
  status: Array<{
    name: string;
    color: string;
    current: number;
    limit: number;
  }>;
  skills: Array<{
    name: string;
    current: number;
    limit: number;
  }>;
  inventory: Array<string>;
}

export function SessionParticipant(){
  const params = useParams<RpgParams>();
  const history = useHistory();
  const {
    characterList, 
    fixedCharacterList, 
    fixedScenario, 
    fixedObject, 
    selectedCharacter, 
    updateFixedCharacters,
    updateSession, 
    cleanSession,
    updateCharacters,
    toggleFixScenario,
    toggleFixObject,
    handleOpenModals, 
    handleSelectedCharacter
  } = useContext(SessionContext);

  const [characterId, setCharacterId] = useState('');
  const [selectedItem, setSelectedItem] = useState('status');

  const [openObjectModal, setOpenObjectModal] = useState(false);

  const socket = manager.socket('/session');

  useEffect(() => {
    api.get(`rpgs/${params.id}/participant`).then(res => {
      const { character } = res.data;
      setCharacterId(character.id);
      
      const index = (characterList.map(c => c.id)).indexOf(character.id);
      handleSelectedCharacter(characterList[index]);
    });

    socket.on('update_session', ({ 
      characters, fixedCharacters, scenario, object 
    }: any) => {
      //updateSession(characters, fixedCharacters, scenario, object);
      updateCharacters(characters);
      toggleFixScenario(scenario);
      toggleFixObject(object);
      updateFixedCharacters(fixedCharacters);
    });

    socket.on('update_characters', (characters: Character[]) => {
      updateCharacters(characters);
    });

    socket.on('update_scenario', (scenario: any) => {
      toggleFixScenario(scenario);
    });

    socket.on('update_object', (object: any) => {
      toggleFixObject(object);
    });

    socket.on('fixed_characters', (characters: Character[]) => {
      updateFixedCharacters(characters);
    });
  }, []);

  useEffect(() => {
    if(characterId) socket.emit('req_update_session', params.id);

  }, [characterId])

  useEffect(() => {
    if(characterId){
      const index = (characterList.map(c => c.id)).indexOf(characterId);
      handleSelectedCharacter(characterList[index]);
    }
  }, [updateSession])

  socket.on('session_closed', () => leaveSession());

  function leaveSession(){
    socket.emit('leave_room', { room: params.id, admin: false });
    history.push(`/rpgs/${params.id}`);
    cleanSession();
  }

  return(
    <>
      <DiceModal />
      <NotesModal />
      <ChatModal selectedCharacter={selectedCharacter} />

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
            <CharacterItem 
              className={styles.charItem} 
              character={selectedCharacter}
            />
            <div className={stylesSession.itemsOptions}>
              <Button 
                className={classnames(stylesSession.buttons, {[stylesSession.selectedItemButton]: selectedItem === 'status'})} 
                text="Status"
                onClick={() => setSelectedItem('status')}  
              />
              <Button 
                className={classnames(stylesSession.buttons, {[stylesSession.selectedItemButton]: selectedItem === 'inventory'})} 
                text="Inventário"
                onClick={() => setSelectedItem('inventory')}  
              />
              <Button 
                className={classnames(stylesSession.buttons, {[stylesSession.selectedItemButton]: selectedItem === 'skills'})} 
                text="Habilidades"
                onClick={() => setSelectedItem('skills')}  
              />
            </div>
            <div className={`${stylesSession.itemsArea} ${styles.itemsArea} custom-scrollbar`}>
              <div></div>
            {(() => {
              if(selectedItem === 'status'){
                return(
                  selectedCharacter.status?.map((this_status, index) => {
                    return(
                      <StatusItem 
                        key={this_status.name}
                        index={index}
                        name={this_status.name} 
                        color={this_status.color} 
                        current={this_status.current} 
                        limit={this_status.limit} 
                      />
                    )
                  })
                )
              }
              else if(selectedItem === 'skills'){
                return(
                  selectedCharacter.skills?.map(this_skill => {
                    return(
                      <SkillsItems
                        key={this_skill.name}
                        className={styles.skillItem}
                        value={this_skill.current} 
                        name={this_skill.name} 
                        limit={this_skill.limit}
                        isReadOnly={true}
                      />
                    )
                  })
                )
              }   
              else if(selectedItem === 'inventory'){
                return(
                  selectedCharacter.inventory?.map((this_item, index) => {
                    return(
                      <div key={index}  className={styles.inventoryItem}>
                        <InventoryItem isReadOnly={true} value={this_item} />
                      </div>
                    )
                  })
                )
              }      
            })()}
            </div>
          </div>

          <Button onClick={leaveSession} className={stylesSession.logoutButton} text="Sair" />
        </div>
      </div>
    </>
  );
}