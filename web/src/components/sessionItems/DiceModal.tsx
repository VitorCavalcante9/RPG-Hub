import React, { useContext, useState } from 'react';
import { SessionContext } from '../../contexts/SessionContext';

import styles from '../../styles/components/sessionItems/DiceModal.module.css';

import { Block } from '../Block';
import { CharacterItem } from './CharacterItem';
import { SkillsItems } from '../characterItems/SkillsItem';
import { Button } from '../Button';
import { RpgContext } from '../../contexts/RpgHomeContext';

interface Skill{
  name: string;
  current: number;
  limit: number;
}

export function DiceModal(){
  const {isAdm} = useContext(RpgContext);
  const {characterList, openModals, selectedCharacter, handleOpenModals, handleSelectedCharacter} = useContext(SessionContext);
  const [skill, setSkill] = useState<Skill | null>();
  const [isChoosingChar, setIsChoosingChar] = useState(false);

  function selectSkill(this_skill: Skill){
    setSkill(this_skill);
  }

  return(
    <>
    {openModals[0] ? (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <header>
            <CharacterItem character={selectedCharacter} />
            <div className={styles.characterList} style={{display: isChoosingChar ? 'block' : ''}}>
              {characterList.map(character => {
                return(
                  <div 
                    className={styles.characterItem}
                    onClick={() => {handleSelectedCharacter(character); setIsChoosingChar(false)}}>
                    <CharacterItem 
                      key={character.id} 
                      className={styles.item} 
                      character={character} 
                    />
                  </div>
                )
              })}
            </div>
            {(() => {
              if(isAdm) return <button onClick={() => {setIsChoosingChar(true)}} type='button'>Trocar</button>          
            })()}
          </header>

          <div className={styles.content}>
            <div className={styles.grid2}>
              <Block name="Habilidades" className={styles.blocks}>
                <div 
                  className={styles.skillItem}
                  onClick={() => setSkill(null)}
                  style={{backgroundColor: skill == null ? '#501B1D' : 'transparent' }}>
                  <p>Nenhuma Habilidade</p>
                </div>
                {selectedCharacter.skills.map(this_skill => {
                    return(
                      <div 
                        onClick={() => setSkill(this_skill)} 
                        key={this_skill.name} 
                        className={styles.skillItem}
                        style={{backgroundColor: this_skill == skill ? '#501B1D' : 'transparent' }}>
                        <SkillsItems
                          value={this_skill.current} 
                          name={this_skill.name} 
                          limit={this_skill.limit}
                        />
                      </div>
                    )
                  })}
              </Block>

              <div className={styles.skill}><p>Habilidade Selecionada: <br/> {skill?.name}</p></div>
            </div>

            <div className={styles.grid1}>
              <Block name="Chat" className={styles.blocks}></Block>

              <div className={styles.dice}>
                <p>Dado:</p>

                <select value="" id="dice">
                  <option value="1d100">1 d 100</option>
                </select>
              </div>
            </div>

            <Button text="Rolar Dados" className={styles.grid1} />
            <Button text="Fechar" className={styles.grid2} onClick={() => {handleOpenModals(0)}}/>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}