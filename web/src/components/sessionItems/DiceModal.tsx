/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { useParams } from 'react-router';
import api from '../../services/api';
import manager from '../../services/websocket';
import { SessionContext } from '../../contexts/SessionContext';

import styles from '../../styles/components/sessionItems/DiceModal.module.css';

import { Block } from '../Block';
import { CharacterItem } from './CharacterItem';
import { SkillsItems } from '../characterItems/SkillsItem';
import { Button } from '../Button';
import { useAlert } from 'react-alert';
import { Message } from './Message';
import { InputLine } from '../InputLine';

interface Skill{
  name: string;
  current: number;
  limit: number;
}

interface RpgParams{
  id: string;
}

interface DataDice{
  dice: string;
  skill: {
    name: string;
    value: number;
  } | null;
  bonus: number | null;
}

export function DiceModal(){
  const params = useParams<RpgParams>();
  const alert = useAlert();
  const {characterList, openModals, selectedCharacter, handleOpenModals, handleSelectedCharacter} = useContext(SessionContext);
  const [isAdm, setIsAdm] = useState(false);

  const msgRef = useRef<HTMLDivElement>(null);
  
  const [skill, setSkill] = useState<Skill | null>();
  const [dices, setDices] = useState<string[]>([]);
  const [dice, setDice] = useState('');
  const [bonus, setBonus] = useState(0);
  const [isChoosingChar, setIsChoosingChar] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [lastMessage, setLastMessage] = useState<any>(null);

  const socket = manager.socket('/session');
  
  useEffect(() => {
    const rpgs = localStorage.getItem('rpgs');
    if(rpgs){
      const allRpgs = JSON.parse(rpgs);
      const indexRpg = allRpgs.rpgs.indexOf(params.id);
      if(indexRpg !== -1) setIsAdm(true);   
    }

    api.get(`rpgs/${params.id}/dices`)
    .then(res => {
      if(res.data){
        setDices(res.data);
      }
    })   
    
    socket.on('roll_dices', ({ message }: any) => {
      try{
        if(message.character){
          const { results, sumResults, character, resultSkill, skillName, bonus } = message;
          const newMessage = [`${results} → ${sumResults}\n`, <b>{character}</b>, ' tirou ', <b>{resultSkill}</b>, ' em ', <b>{skillName}</b>, `${bonus ? ` com ${bonus} de bônus` : ''}`];
          setLastMessage(newMessage);
        }
        else setLastMessage(message);
  
      } catch(err){
        console.log(err)
      }
    })
  }, [params.id]);

  useEffect(() => {
    if(dices.length > 0) setDice(dices[0])
  }, [dices])

  useEffect(() => {
    if(lastMessage){
      setMessages([...messages, lastMessage]);
      setLastMessage(null);
    }
  }, [lastMessage])

  useEffect(() => {
    if(msgRef.current) {
      msgRef.current.scrollIntoView({ behavior: 'smooth'});
    };
  }, [messages])

  function rollDices(){
    let data: DataDice = {
      dice,
      skill: null,
      bonus: null
    }
    
    if(skill){
      const skillData = {
        name: skill.name,
        value: skill.current
      }

      data.skill = skillData;  
      
      if(bonus) data.bonus = bonus;
    }

    api.post(`rpgs/${params.id}/roll_dices`, data)
      .then(res => {
        const { results, sumResults, resultSkill, skillName, bonus } = res.data;

        const newMessage = resultSkill ? 
          [`${JSON.stringify(results)} → ${sumResults}\n`, <b>{selectedCharacter.name}</b>, ' tirou ', <b>{resultSkill}</b>, ' em ', <b>{skillName}</b>, `${bonus ? ` com ${bonus} de bônus` : ''}`] :
          `${selectedCharacter.name}: ${JSON.stringify(results)} → ${sumResults}`;

        socket.emit('roll_dices', { room: params.id, message: resultSkill ? {
          results: JSON.stringify(results),
          sumResults,
          character: selectedCharacter.name,
          resultSkill,
          skillName,
          bonus
        } : newMessage});
        setMessages([...messages, newMessage]);

        setBonus(0)

      }).catch(err => {
        if(!err.response) alert.error("Impossível conectar ao servidor!");
        else if(err.response.status !== 404) alert.error(err.response.data.message);
      })
  }

  return(
    <>
    {openModals[0] ? (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <header>
            <CharacterItem isMini={true} character={selectedCharacter} />
            <div className={styles.characterList} style={{display: isChoosingChar ? 'block' : ''}}>
              {characterList.map(character => {
                return(
                  <div 
                    className={styles.characterItem}
                    onClick={() => {handleSelectedCharacter(character); setIsChoosingChar(false)}}>
                    <CharacterItem 
                      isMini={true}
                      key={character.id} 
                      className={styles.item} 
                      character={character} 
                    />
                  </div>
                )
              })}
            </div>
            {(() => {
              if(isAdm) return <button onClick={() => {setIsChoosingChar(isChoosingChar ? false : true)}} type='button'>Trocar</button>          
            })()}
          </header>

          <div className={styles.content}>
            <div className={styles.grid2}>
              <Block id={styles.skills} name="Habilidades" className={styles.blocks}>
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
                        className={classnames(styles.skillItem, {[styles.skillItemBonus]: this_skill === skill})}
                        style={{backgroundColor: this_skill === skill ? '#501B1D' : 'transparent' }}>
                        <SkillsItems
                          value={this_skill.current} 
                          name={this_skill.name} 
                          limit={this_skill.limit}
                          isReadOnly={true}
                        />
                        {(() => {
                          if(this_skill === skill) return (
                            <div className={styles.bonus}>
                              <p>Bônus: </p>
                              <InputLine
                                value={bonus}
                                maxValue={100 - this_skill.current}
                                onChange={e => setBonus(Number(e.target.value))}
                              />
                            </div>
                          )
                        })()}
                      </div>
                    )
                  })}
              </Block>

              <div className={styles.skill}><p>Habilidade Selecionada: <br/> {skill?.name}</p></div>
            </div>

            <div className={styles.grid1}>
              <Block id={styles.chat} name="Chat" className={styles.blocks} >
                {messages.map((message, index) => {
                  return(
                    <Message key={index} message={message} msgRef={msgRef} />
                  )
                })}
              </Block>

              <div className={styles.dice}>
                <p>Dado:</p>

                <select 
                  value={dice} 
                  id="dice"
                  onChange={(e) => {setDice(e.target.value)}} 
                >
                  {dices.map((dice, index) => {
                    return <option key={index} value={dice}>{dice}</option>
                  })}
                </select>
              </div>
            </div>

            <Button onClick={rollDices} text="Rolar Dados" className={styles.grid1} />
            <Button text="Fechar" className={styles.grid2} onClick={() => {handleOpenModals(0)}}/>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}