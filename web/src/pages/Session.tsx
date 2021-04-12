import React, { useContext, useState } from 'react';
import classnames from 'classnames';

import { SessionContext } from '../contexts/SessionContext';

import styles from '../styles/pages/Session.module.css';

import { Button } from '../components/Button';
import { CharacterItem } from '../components/sessionItems/CharacterItem';
import { ScenarioItem } from '../components/sessionItems/ScenarioItem';
import { ObjectItem } from '../components/sessionItems/ObjectItem';
import { DiceModal } from '../components/sessionItems/DiceModal';
import { CharOptionsModal } from '../components/sessionItems/CharOptionsModal';
import { NotesModal } from '../components/sessionItems/NotesModal';
import { ChatModal } from '../components/sessionItems/ChatModal';

export function Session(){
  const {characterList, fixedCharacterList, scenarioList, fixedScenario, objectList, fixedObject, handleOpenModals, handleSelectedCharacter} = useContext(SessionContext);
  const [selectedItem, setSelectedItem] = useState('characters');

  return(
    <>
      <DiceModal />
      <CharOptionsModal />
      <NotesModal />
      <ChatModal />

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
              <img src={fixedObject?.image} alt={fixedObject?.name}/>
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
            <div className={styles.itemsArea}>
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
                        onClick={() => {handleSelectedCharacter(character); handleOpenModals(1)}} />
                    );
                  })
                )
              }
              else if(selectedItem === 'scenarios'){
                return(
                  scenarioList.map((scenario) => {
                    return(
                      <ScenarioItem scenario={scenario}/>
                    );
                  })
                )
              }   
              else if(selectedItem === 'objects'){
                return(
                  objectList.map((objectItem) => {
                    return(
                      <ObjectItem object={objectItem} />
                    );
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