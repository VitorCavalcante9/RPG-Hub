import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import classnames from 'classnames';
import manager from '../services/websocket';
import api from '../services/api';

import { SessionContext } from '../contexts/SessionContext';

import styles from '../styles/pages/SessionParticipant.module.css';

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

  useEffect(() => {
    api.get(`rpgs/${params.id}/participant`).then(res => {
      const { character } = res.data;
      setCharacterId(character.id);
      
      const index = (characterList.map(c => c.id)).indexOf(character.id);
      handleSelectedCharacter(characterList[index]);
    });

    if(characterId) socket.emit('req_update_session', params.id); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const socket = manager.socket('/session');

  socket.on('session_closed', () => leaveSession());

  socket.on('update_session', ({ 
    characters, fixedCharacters, scenario, object 
  }: any) => {
    console.log(characterId)
    updateSession(characters, fixedCharacters, scenario, object);
    const index = (characterList.map(c => c.id)).indexOf(characterId);
    handleSelectedCharacter(characterList[index]);
  });

  socket.on('update_characters', (characters: Character[]) => {
    updateCharacters(characters);
  })

  socket.on('update_scenario', (scenario: any) => {
    toggleFixScenario(scenario);
  })

  socket.on('update_object', (object: any) => {
    toggleFixObject(object);
  })

  socket.on('fixed_characters', (characters: Character[]) => {
    updateFixedCharacters(characters)
  })

  function leaveSession(){
    socket.emit('leave_room', { room: params.id, admin: false });
    cleanSession();
    history.push(`/rpgs/${params.id}`);
  }

  return(
    <>
      <DiceModal />
      <NotesModal />
      <ChatModal selectedCharacter={selectedCharacter} />

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
            <CharacterItem 
              className={styles.charItem} 
              character={selectedCharacter}
            />
            <div className={styles.itemsOptions}>
              <Button 
                className={classnames(styles.buttons, {[styles.selectedItemButton]: selectedItem === 'status'})} 
                text="Status"
                onClick={() => setSelectedItem('status')}  
              />
              <Button 
                className={classnames(styles.buttons, {[styles.selectedItemButton]: selectedItem === 'inventory'})} 
                text="Inventário"
                onClick={() => setSelectedItem('inventory')}  
              />
              <Button 
                className={classnames(styles.buttons, {[styles.selectedItemButton]: selectedItem === 'skills'})} 
                text="Habilidades"
                onClick={() => setSelectedItem('skills')}  
              />
            </div>
            <div className={`${styles.itemsArea} custom-scrollbar`}>
              <div></div>
            {(() => {
              if(selectedItem === 'status'){
                return(
                  selectedCharacter.status.map((this_status, index) => {
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
                  selectedCharacter.skills.map(this_skill => {
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

          <Button onClick={leaveSession} className={styles.logoutButton} text="Sair" />
        </div>
      </div>
    </>
  );
}