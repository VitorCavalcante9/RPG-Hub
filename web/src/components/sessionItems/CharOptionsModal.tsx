import React, { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../../contexts/SessionContext';

import styles from '../../styles/components/sessionItems/CharOptionsModal.module.css';

import remove from '../../assets/icons/cancel.svg';

import { Block } from '../Block';
import { Button } from '../Button';
import { InventoryItem } from '../characterItems/InventoryItem';
import { SkillsItems } from '../characterItems/SkillsItem';
import { InputLine } from '../InputLine';
import { CharacterItem } from './CharacterItem';

export function CharOptionsModal(){
  const {selectedCharacter, openModals, handleOpenModals, setStatusItemValue} = useContext(SessionContext);
  const [inventoryItems, setInventoryItems] = useState<string[]>([]);
  const [statusItems, setStatusItems] = useState(selectedCharacter.status);

  function setInventoryItemValue(position: number,  value: string){
    const updatedInventoryItems = inventoryItems.map((inventoryItem, index) => {
      if(index === position)
        return value;
      
      return inventoryItem;
    })

    setInventoryItems(updatedInventoryItems);
  }

  function addInventoryItem(){
    const new_item = '';
    setInventoryItems([...inventoryItems, new_item]);
  }

  function removeInventoryItem(position: number){
    const updatedInventoryItems = inventoryItems.filter((inventoryItems, index) => {
      return position !== index;
    })

    setInventoryItems(updatedInventoryItems);
  }

  function setStatusItemValueInput(position: number, field: string, value: number){
    const updatedStatusItems = statusItems.map((statusItems, index) => {
      if(index === position){
        return {...statusItems, [field]: value};
      }

      return statusItems;
    })

    setStatusItems(updatedStatusItems);
  }

  return(
    <>
    {openModals[1] ? (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <header>
            <CharacterItem character={selectedCharacter} />
          </header>

          <div className={styles.content}>
            <div className={styles.column1}>
              <Block name="Status" id={styles.status}>
                {selectedCharacter.status.map((status, index) => {
                  const statusPercentCurrent = Math.round(statusItems[index].current * 100) / statusItems[index].limit;

                  return(
                    <div className={styles.statusContainer}>
                      <div className={styles.statusItem}>
                        <p>{status.name}</p>

                        <div className={styles.statusBar}>
                        <div className={styles.progressBar} style={{backgroundColor: status.color, width: `${statusPercentCurrent}%`}} />

                          <div className={styles.number}>
                            <InputLine 
                              className={styles.input} 
                              value={statusItems[index].current} 
                              onChange={e => {setStatusItemValueInput(index, 'current', Number(e.target.value))}} 
                            />
                            <span> / </span>
                            <InputLine
                              className={styles.input} 
                              value={statusItems[index].limit} 
                              onChange={e => {setStatusItemValueInput(index, 'limit', Number(e.target.value))}} 
                            />
                          </div>

                        </div>
                      </div>

                      <button onClick={() => {setStatusItemValue(selectedCharacter, index, statusItems[index].current, statusItems[index].limit)}} type='button'>Salvar</button>
                    </div>
                  );
                })}
              </Block>

              <Block name="Inventário" id={styles.inventory} options={
                <button type='button' onClick={addInventoryItem} className='buttonWithoutBG'>+ Novo Item</button>
              }>
                {inventoryItems.map((inventoryItem, index) => {
                  return(
                    <div className={styles.inventoryItem}>
                      <InventoryItem 
                        key={index} 
                        value={inventoryItem} 
                        onChange={e => setInventoryItemValue(index, e.target.value)} 
                        onClick={() => removeInventoryItem(index)}
                      />

                      <button type='button' onClick={() => removeInventoryItem(index)}><img src={remove} alt="Remover"/></button>

                    </div>
                  )
                })}
              </Block>
            </div>

            <div className={styles.column2}>
              <Block name="Habilidades" id={styles.skills}>
                {selectedCharacter.skills.map(this_skill => {
                    return(
                      <SkillsItems
                        className={styles.skillItem}
                        value={this_skill.current} 
                        name={this_skill.name} 
                        limit={this_skill.limit}
                      />
                    )
                  })}
              </Block>

              <Button text="Fechar" onClick={() => {handleOpenModals(1)}}/>
            </div>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}