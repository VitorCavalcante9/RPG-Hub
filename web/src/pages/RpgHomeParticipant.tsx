/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useAlert } from 'react-alert';
import { RpgContext } from '../contexts/RpgHomeContext';
import classnames from 'classnames';
import api from '../services/api';
import manager from '../services/websocket';

import { Block } from '../components/Block';
import { Button } from '../components/Button';
import { ButtonSession } from '../components/ButtonSession';
import { InventoryItem } from '../components/characterItems/InventoryItem';
import { SkillsItems } from '../components/characterItems/SkillsItem';
import { StatusItem } from '../components/characterItems/StatusItem';
import { IconElement } from '../components/IconElement';
import { Layout } from '../components/Layout';
import { AccountListModal } from '../components/modals/AccountListModal';

import styles from '../styles/pages/RpgHomeParticipant.module.css';

interface StatusItems{
  name: string;
  color: string;
  current: number;
  limit: number;
}

interface SkillItems{
  name: string;
  current: number;
  limit: number;
}

interface Permission{
  id: number;
  user_id: string;
  rpg_id: string;
  character_id: string;
  permission: boolean | null;
}

interface RpgParams{
  id: string;
}

export function RpgHomeParticipant(){
  const params = useParams<RpgParams>();
  const alert = useAlert();
  const history = useHistory();
  const {handleOpenModals} = useContext(RpgContext);

  const [rpg, setRpg] = useState({name: '', icon: '', admin: ''});
  const [character, setCharacter] = useState({id: '', name: '', icon: ''});
  const [inventoryItems, setInventoryItems] = useState<string[]>([]);
  const [statusItems, setStatusItems] = useState<StatusItems[]>([]);
  const [skillsItems, setSkillsItems] = useState<SkillItems[]>([]);
  const [limitPoints, setLimitPoints] = useState<number>();
  const [permission, setPermission] = useState<Permission | null>(null);
  const [currentPoints, setCurrentPoints] = useState(0);


  useEffect(() => {
    api.get(`rpgs/${params.id}/participant`)
    .then(res => {
      const { name, icon, admin, character } = res.data;

      setRpg({ name, icon, admin });
      setCharacter({id: character.id, name: character.name, icon: character.icon})
      setInventoryItems(character.inventory);
      setStatusItems(character.status);
      setLimitPoints(character.limitOfPoints);
      setSkillsItems(character.skills);
      setPermission(character.permission);
    })     
  }, [params.id]);

  useEffect(() => {
    if(skillsItems && skillsItems.length > 0){
      const updatedPoints = skillsItems.reduce((preVal, value) => {
        if(preVal) return preVal - value.current;
      }, limitPoints)

      if(updatedPoints || updatedPoints === 0) setCurrentPoints(updatedPoints);
    }
  }, [skillsItems]);
  
  function setSkillsItemValue(position: number, field: string, value: string){
    const updatedSkillsItems = skillsItems.map((skillsItems, index) => {

      if(index === position){
        if(field === 'current' || field === 'limit') return {...skillsItems, [field]: Number(value)};

        return {...skillsItems, [field]: value};
      }

      return skillsItems;
    })

    setSkillsItems(updatedSkillsItems);
  }

  async function handleSubmit(e: FormEvent){
    e.preventDefault();

    if(permission?.permission){
      if(currentPoints === 0){
        const characterData = {
          skills: skillsItems
        }

        await api.patch(`rpgs/${params.id}/characters/${character.id}`, characterData)
        .then(res => {
          alert.success(res.data.message);

          api.get(`rpgs/${params.id}/participant`)
          .then(res => {
            const { character } = res.data;
            
            setPermission(character.permission);
          })  

        }).catch(error => {
          console.error(error)
          if(!error.response) alert.error("Impossível conectar ao servidor!");
          else if(error.response.data) alert.error(error.response.data);
          else alert.error(error.response)
        }) 

      } else {
        alert.error('Preencha as habilidades até chegar em 0 pontos disponíveis')
      }
    } else {
      
      await api.post(`rpgs/${params.id}/characters/${character.id}/permission`, null)
      .then(res => {
        alert.success(res.data.message);

      }).catch(error => {
        console.error(error)
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      }) 
    }
  }

  function joinSession(){
    const socketSession = manager.socket('/session');
    socketSession.open();
    history.push(`/rpgs/${params.id}/session`);
  }

  return(
    <>
    <AccountListModal />

    <Layout linkBack='/home'>
      <div className={styles.rpgHomeContainer}>
        <div className={styles.header}>
          <IconElement
            image={rpg.icon} 
            alt={rpg.name} 
            row={true} 
            text={rpg.name}             
            imgSize='7rem'
            textSize='2.2rem'
          />

          <div className={styles.options}>
            <button onClick={() => handleOpenModals(3)} className='buttonWithoutBG'>Ver jogadores</button>

            <p>Mestre: {rpg.admin}</p>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.column1}>
            <div className={styles.name}>
              <div className={styles.image}>
                <img className={classnames({'collapsedStyle': !character.icon})} src={character.icon} alt={character.name}/>
              </div>

              <p>Seu Personagem:<br/>{character.name}</p>
            </div>

            <Block name="Status" id={styles.status}>
              {statusItems?.map((status, index) => {
                return(
                  <StatusItem
                    key={index}
                    name={status.name} 
                    color={status.color}  
                    current={status.current}  
                    limit={status.limit} 
                    index={index}
                  />
                )
              })}
            </Block>

            <Block name="Inventário" id={styles.inventory}>
              {inventoryItems?.map((inventoryItem, index) => {
                return(
                  <div key={index}  className={styles.inventoryItem}>
                    <InventoryItem isReadOnly={true} value={inventoryItem} />
                  </div>
                )
              })}
            </Block>
          </div>

          <div className={styles.column2}>
            <form onSubmit={handleSubmit}>
              <Block 
                name="Habilidades" 
                id={styles.skills} 
                options={
                  <p className={styles.points}>Quantidade de pontos disponíveis: {currentPoints}</p>
                }
              >
                {skillsItems?.map((skillsItem, index) => {
                  return(
                    <SkillsItems 
                      key={index}
                      isReadOnly={permission ? false : true}
                      value={skillsItem.current} 
                      name={skillsItem.name} 
                      limit={skillsItem.limit}
                      onChange={e => setSkillsItemValue(index, 'current', e.target.value)}
                    />
                  );
                })}
              </Block>
              <Button 
                type='submit' 
                disabled={character.id ? false : true}
                className={styles.buttons} 
                text={permission?.permission ? 'Salvar informações' : 'Solicitar permissão para alterar'} 
              />

            </form>
            <ButtonSession disabled={character.id ? false : true} onClick={joinSession} text='Entrar na sessão' id={styles.buttonSession}/>
          </div>
        </div>
      </div>
    </Layout>
    </>
  )
}