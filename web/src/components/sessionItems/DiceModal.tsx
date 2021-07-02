/* eslint-disable array-callback-return */
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
  const charList = useRef(null);
  
  const [skill, setSkill] = useState<Skill | null>();
  const [searchSkill, setSearchSkill] = useState('');
  const [dice, setDice] = useState({quantity: 1, value: 100});
  const [bonus, setBonus] = useState(0);
  const [isChoosingChar, setIsChoosingChar] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [lastMessage, setLastMessage] = useState<any>(null);

  const socket = manager.socket('/session');

  const handleClick = (e: any) => {
    const charListRef: any = charList.current;

    if (charListRef && charListRef.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setIsChoosingChar(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);
  
  useEffect(() => {
    const rpgs = localStorage.getItem('rpgs');
    if(rpgs){
      const allRpgs = JSON.parse(rpgs);
      const indexRpg = allRpgs.rpgs.indexOf(params.id);
      if(indexRpg !== -1) setIsAdm(true);   
    }
    
    socket.on('roll_dices', ({ message }: any) => {
      try{
        if(message.character){
          const { diceValue, results, sumResults, character, resultSkill, skillName, bonus } = message;
          const newMessage = [`${diceValue}: ${results} → ${sumResults}\n`, <b>{character}</b>, ' tirou ', <b>{resultSkill}</b>, ' em ', <b>{skillName}</b>, `${bonus ? ` com ${bonus} de bônus` : ''}`];
          setLastMessage(newMessage);
        }
        else setLastMessage(message);
  
      } catch(err){
        console.log(err)
      }
    })
  }, [params.id]);

  useEffect(() => {
    if(lastMessage){
      setMessages([...messages, lastMessage]);
      setLastMessage(null);
    }
  }, [lastMessage]);

  useEffect(() => {
    if(msgRef.current) {
      msgRef.current.scrollIntoView({ behavior: 'smooth'});
    };
  }, [messages, openModals[0]]);

  function setDiceItemValue(field: string, value: string){
    setDice({...dice, [field]: value});
  }

  function rollDices(){
    let data: DataDice = {
      dice: `${dice.quantity}d${dice.value}`,
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
        const { diceValue, results, sumResults, resultSkill, skillName, bonus } = res.data;

        const newMessage = resultSkill ? 
          [`${diceValue}: ${JSON.stringify(results)} → ${sumResults}\n`, <b>{selectedCharacter.name}</b>, ' tirou ', <b>{resultSkill}</b>, ' em ', <b>{skillName}</b>, `${bonus ? ` com ${bonus} de bônus` : ''}`] :
          `${selectedCharacter.name}: ${diceValue} - ${JSON.stringify(results)} → ${sumResults}`;

        socket.emit('roll_dices', { room: params.id, message: resultSkill ? {
          diceValue,
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
        <div className={styles.background} onClick={() => handleOpenModals(0)}/>
        <div className={styles.container}>
          <header>
            <CharacterItem isMini={true} character={selectedCharacter} />
            <div ref={charList} className={styles.characterList} style={{display: isChoosingChar ? 'block' : ''}}>
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
              <Block id={styles.skills} name="Selecione uma Habilidade" className={styles.blocks} options={
                <div className={styles.searchSkill}>
                  <input 
                    type='search' 
                    placeholder='Pesquisar habilidade'
                    value={searchSkill}
                    onChange={e => setSearchSkill(e.target.value)}  
                  />
                </div>
              }>
                <div 
                  className={styles.skillItem}
                  onClick={() => setSkill(null)}
                  style={{backgroundColor: skill == null ? '#501B1D' : 'transparent' }}>
                  <p>Nenhuma Habilidade</p>
                </div>
                {selectedCharacter.skills.map(this_skill => {
                    if(this_skill.name.toLowerCase().includes(searchSkill.toLowerCase())){
                      return(
                        <div 
                          onClick={() => { setSkill(this_skill); setSearchSkill('') }} 
                          key={this_skill.name} 
                          className={classnames(styles.skillItem, {[styles.skillItemBonus]: this_skill === skill})}
                          style={{backgroundColor: this_skill === skill ? '#501B1D' : 'transparent' }}>
                          <SkillsItems
                            className={classnames({[styles.selectedSkill]: this_skill === skill})}
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
                    }
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

                <InputLine 
                  className={styles.diceInput} 
                  minValue={0}
                  value={dice.quantity}
                  onChange={e => setDiceItemValue('quantity', e.target.value)}
                />
                <span>d</span>
                <InputLine 
                  className={styles.diceInput} 
                  minValue={1}
                  value={dice.value}
                  onChange={e => setDiceItemValue('value', e.target.value)}
                />
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