import React, { useContext, useState } from 'react';
import { Block } from '../components/Block';
import { Button } from '../components/Button';
import { ButtonSession } from '../components/ButtonSession';
import { InventoryItem } from '../components/characterItems/InventoryItem';
import { SkillsItems } from '../components/characterItems/SkillsItem';
import { StatusItem } from '../components/characterItems/StatusItem';
import { IconElement } from '../components/IconElement';
import { Layout } from '../components/Layout';
import { AccountListModal } from '../components/modals/AccountListModal';
import { RpgContext } from '../contexts/RpgHomeContext';

import styles from '../styles/pages/RpgHomeParticipant.module.css';

interface SkillItems{
  name: string;
  current: number;
  limit: number;
}

export function RpgHomeParticipant(){
  const {handleOpenModals} = useContext(RpgContext);

  const [inventoryItems, setInventoryItems] = useState<string[]>([]);
  const [skillsItems, setSkillsItems] = useState<SkillItems[]>([{name: 'Força', current: 0, limit: 100}, {name: 'Destreza', current: 0, limit: 100}]);

  
  function setSkillsItemValue(position: number, field: string, value: string){
    const updatedSkillsItems = skillsItems.map((skillsItems, index) => {
      if(index === position){
        return {...skillsItems, [field]: value};
      }

      return skillsItems;
    })

    setSkillsItems(updatedSkillsItems);
  }

  return(
    <>
    <AccountListModal />

    <Layout linkBack='/home'>
      <div className={styles.rpgHomeContainer}>
        <div className={styles.header}>
          <IconElement
            image='' 
            alt='' 
            row={true} 
            text='RPG: tal tal' 
            imgSize='7rem'
            textSize='2.2rem'
          />

          <div className={styles.options}>
            <button onClick={() => handleOpenModals(3)} className='buttonWithoutBG'>Ver jogadores</button>

            <p>Mestre: Administrador</p>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.column1}>
            <div className={styles.name}>
              <div className={styles.image}>
                <img src='' alt=""/>
              </div>

              <p>Seu Personagem:<br/>Personagem</p>
            </div>

            <Block name="Status" id={styles.status}>
              <StatusItem name="Vida" color="#CC0000" current={100} limit={100}/>
              <StatusItem name="Sanidade" color="#333180" current={100} limit={100}/>
            </Block>

            <Block name="Inventário" id={styles.inventory}>
              {inventoryItems.map((inventoryItem, index) => {
                return(
                  <div key={index}  className={styles.inventoryItem}>
                    <InventoryItem value={inventoryItem} />
                  </div>
                )
              })}
            </Block>
          </div>

          <div className={styles.column2}>
            <form>
              <Block name="Habilidades" id={styles.skills} options={
                <p className={styles.points}>Quantidade de pontos disponíveis: 2000</p>
              }>
                {skillsItems.map((skillsItem, index) => {
                  return(
                    <SkillsItems
                      value={skillsItem.current} 
                      name={skillsItem.name} 
                      limit={skillsItem.limit}
                      onChange={e => setSkillsItemValue(index, 'current', e.target.value)}
                    />
                  );
                })}
              </Block>
              <Button type='submit' className={styles.buttons} text="Salvar informações" />

            </form>
            <ButtonSession text='Entrar na sessão' id={styles.buttonSession}/>
          </div>
        </div>
      </div>
    </Layout>
    </>
  )
}