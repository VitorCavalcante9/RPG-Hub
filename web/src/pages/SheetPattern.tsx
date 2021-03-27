import React, { createRef, useContext, useRef, useState } from 'react';

import { Block } from '../components/Block';
import { Button } from '../components/Button';
import { InputLine } from '../components/InputLine';
import { Layout } from '../components/Layout';
import { Popper } from '../components/Popper';
import { RpgContext } from '../contexts/RpgHomeContext';

import styles from '../styles/pages/SheetPattern.module.css';

export function SheetPattern(){
  const {statusItems, addNewStatus, setStatusItemValue} = useContext(RpgContext);
  const [isVisible, setVisibility] = useState(['hidden']);

  const [skillsItems, setSkillsItems] = useState([
    {name: '', current: 0, limit: 0}
  ]);

  const buttonRef = useRef([]);

  if(buttonRef.current.length !== statusItems.length){
    buttonRef.current = Array(statusItems.length).fill(statusItems.length).map((_, i) => buttonRef.current[i] || createRef());
  }

  const toggleVisibility = (position: number) => {
    const updatedVisibility = isVisible.map((visibleItem, index) => {
      if(index === position){
        return visibleItem === 'hidden' ? 'visible' : 'hidden';
      }
      
      return visibleItem;
    })

    setVisibility(updatedVisibility);
  }

  function addNewStatusItem(){
    addNewStatus();
    setVisibility([
      ...isVisible,
      'hidden'
    ])
  }

  function addNewSkillsItem(){
    setSkillsItems([
      ...skillsItems,
      {name: '', current: 0, limit: 0}
    ])
  }

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
    <Layout linkBack='/rpgs'>
      <div className={styles.sheetContainer}>
        <h1>Padrão de ficha</h1>

        <div className={styles.content}>
          <Block id={styles.status} name="Status" options={
            <button 
              className='buttonWithoutBG'
              onClick={addNewStatusItem}
            >+ Novo</button>
          }>
            {statusItems.map((statusItem, index) => {
              return(
                <div key={index} className={styles.statusElement}>
                  <div className={styles.name}>
                    <input 
                      type="text" 
                      placeholder="Status"
                      onChange={e => setStatusItemValue(index, 'name', e.target.value)}
                    />
                    <button 
                      className={styles.buttonColor}
                      ref={buttonRef.current[index]}
                      style={{backgroundColor: statusItem.color}}
                      onClick={() => {toggleVisibility(index)}}
                      
                    />
                    <Popper index={index} targetRef={buttonRef.current[index]} isVisible={isVisible[index]} />
                  </div>
                  <div className={styles.pointsContainer}>
                    <InputLine
                      onChange={e => setStatusItemValue(index, 'current', e.target.value)}
                    />
                    <span> / </span>
                    <InputLine
                      onChange={e => setStatusItemValue(index, 'limit', e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </Block>

          <div className={styles.skillsContent}>
            <Block id={styles.skills} name="Habilidades" options={
              <button 
                className='buttonWithoutBG'
                onClick={addNewSkillsItem}
              >+ Novo</button>
            }>
              {skillsItems.map((skillsItem, index) => {
                return(
                  <div key={index} className={styles.skillsElement}>
                    <input 
                      type="text" 
                      placeholder="Habilidade"
                      onChange={e => setSkillsItemValue(index, 'name', e.target.value)}
                    />
                    <div className={styles.pointsContainer}>
                    <InputLine
                      onChange={e => setSkillsItemValue(index, 'current', e.target.value)}
                    />
                    <span> / </span>
                    <InputLine
                      onChange={e => setSkillsItemValue(index, 'limit', e.target.value)}
                    />
                    </div>
                  </div>
                );
              })}
            </Block>

            <div className={styles.points}>
              <p>Limite de pontos:</p>
              <InputLine />
            </div>
          </div>
        </div>
        
        <Button text="Salvar" className={styles.buttonSave} />
      </div>
    </Layout>
  );
}