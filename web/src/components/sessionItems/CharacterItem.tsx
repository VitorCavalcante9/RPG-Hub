import React, { HTMLAttributes, useContext, useEffect, useState } from 'react';
import classnames from 'classnames';

import styles from '../../styles/components/sessionItems/CharacterItem.module.css';
import { SessionContext } from '../../contexts/SessionContext';

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
}

interface CharacterItemProps extends HTMLAttributes<HTMLDivElement>{
  isMini?: boolean;
  fixButton?: boolean;
  character: Character;
}

export function CharacterItem({isMini, fixButton, character, className, onClick}: CharacterItemProps){
  const {toggleFixCharacter, fixedCharacterList, characterList} = useContext(SessionContext);

  const [textButton, setTextButton] = useState('Fixar');

  useEffect(() => {
    const verifyIfExists = fixedCharacterList.indexOf(character);
    if(verifyIfExists != -1) setTextButton('Desafixar');
  }, [])

  useEffect(() => {
    characterList.map(this_character => {
      if(this_character === character){
        character = this_character;
      }
    })
  }, [characterList])

  function toggleTextButton(){
    if(textButton === 'Fixar') setTextButton('Desafixar')
    else setTextButton('Fixar')
  }
  
  return(
    <div className={classnames(className, styles.characterContainer, {[styles.miniContainer]: isMini})}>
      <div className={styles.iconContainer} onClick={onClick}>
        <div className={styles.icon}>
          <img src="" alt=""/>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.name}>
          <p onClick={onClick}>{character.name}</p>

          {(() => {
            if(fixButton) return <button onClick={() => {toggleTextButton(); toggleFixCharacter(character)}} type='button'>{textButton}</button>            
          })()}
        </div>

        <div className={styles.status} onClick={onClick}>
          {character.status.map((status, index) => {
            const statusPercentCurrent = Math.round(status.current * 100) / status.limit;

            if(index < 2){
              return(
                <div key={index} className={styles.statusItem}>
                  <div className={styles.statusBar}>
                  <div className={styles.progressBar} style={{backgroundColor: status.color, width: `${statusPercentCurrent}%`}} />
  
                    <div className={styles.number}>
                      <p>{status.current} / {status.limit}</p>
                    </div>
  
                  </div>
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  );
}