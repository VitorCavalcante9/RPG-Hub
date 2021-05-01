import React, { useContext, useState } from 'react';
import classnames from 'classnames';

import { SessionContext } from '../contexts/SessionContext';

import styles from '../styles/pages/SessionParticipant.module.css';

import { Button } from '../components/Button';
import { CharacterItem } from '../components/sessionItems/CharacterItem';
import { ScenarioItem } from '../components/sessionItems/ScenarioItem';
import { ObjectItem } from '../components/sessionItems/ObjectItem';
import { DiceModal } from '../components/sessionItems/DiceModal';
import { NotesModal } from '../components/sessionItems/NotesModal';
import { ChatModal } from '../components/sessionItems/ChatModal';
import { SkillsItems } from '../components/characterItems/SkillsItem';
import { StatusItem } from '../components/characterItems/StatusItem';
import { InventoryItem } from '../components/characterItems/InventoryItem';

export function SessionParticipant(){
  const {characterList, fixedCharacterList, fixedScenario, fixedObject, selectedCharacter, handleOpenModals, handleSelectedCharacter} = useContext(SessionContext);
  const [selectedItem, setSelectedItem] = useState('status');

  const [openObjectModal, setOpenObjectModal] = useState(false);

  handleSelectedCharacter(characterList[0]);

  return(
    <>
      <DiceModal />
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
                className={classnames(styles.buttons, {[styles.selectedItemButton]: selectedItem === 'skills'})} 
                text="Habilidades"
                onClick={() => setSelectedItem('skills')}  
              />
              <Button 
                className={classnames(styles.buttons, {[styles.selectedItemButton]: selectedItem === 'items'})} 
                text="Itens"
                onClick={() => setSelectedItem('items')}  
              />
            </div>
            <div className={styles.itemsArea}>
              <div></div>
            {(() => {
              if(selectedItem === 'status'){
                return(
                  selectedCharacter.status.map((this_status, index) => {
                    return(
                      <StatusItem 
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
              else if(selectedItem === 'items'){
                return(
                  selectedCharacter.items?.map(this_item => {
                    return(
                      <div key={this_item.id}  className={styles.inventoryItem}>
                        <InventoryItem isReadOnly={true} value={this_item.name} />
                      </div>
                    )
                  })
                )
              }      
            })()}
            </div>
          </div>

          <Button className={styles.logoutButton} text="Sair" />
        </div>
      </div>
    </>
  );
}