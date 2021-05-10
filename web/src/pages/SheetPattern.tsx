import React, { createRef, KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import api from '../services/api';
import { useAlert } from 'react-alert';

import { Block } from '../components/Block';
import { Button } from '../components/Button';
import { InputLine } from '../components/InputLine';
import { Layout } from '../components/Layout';
import { Popper } from '../components/Popper';
import { AuthContext } from '../contexts/AuthContext';
import { RpgContext } from '../contexts/RpgHomeContext';

import styles from '../styles/pages/SheetPattern.module.css';

interface RpgParams{
  id: string;
}

export function SheetPattern(){
  const params = useParams<RpgParams>();
  const alert = useAlert();

  const {statusItems, addNewStatus, defaultStatus, setStatusItemValue, removeStatusItems} = useContext(RpgContext);
  const [isVisible, setVisibility] = useState<string[]>([]);

  const [skillsItems, setSkillsItems] = useState([
    {name: '', current: 0, limit: 100}
  ]);
  const [limitPoints, setLimitPoints] = useState<number>();

  useEffect(() => {
    api.get(`rpgs/${params.id}/sheet`)
    .then(res => {
      const { status, skills, limitOfPoints } = res.data;

      const defaultVisibility = status.map(() => { return 'hidden' });
      setVisibility(defaultVisibility);

      defaultStatus(status);
      if(skills.length > 0) setSkillsItems(skills);
      setLimitPoints(limitOfPoints)
    })    
  }, [params.id])

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
      {name: '', current: 0, limit: 100}
    ])
  }

  function setSkillsItemValue(position: number, field: string, value: string){
    const updatedSkillsItems = skillsItems.map((skillsItems, index) => {
      if(index === position){
        if(field === 'current' || field === 'limit'){ 
          return {...skillsItems, [field]: Number(value)};
        }

        return {...skillsItems, [field]: value};
      }

      return skillsItems;
    })

    setSkillsItems(updatedSkillsItems);
  }

  async function saveSheet(){
    const filteredStatus = statusItems.filter(this_status => this_status.name !== '');
    const filteredSkills = skillsItems.filter(this_skills => this_skills.name !== '');

    if(limitPoints && limitPoints >= 0){
      const data = {
        status: filteredStatus,
        skills: filteredSkills,
        limitOfPoints: limitPoints
      }

      console.log(filteredSkills)
      
      await api.patch(`rpgs/${params.id}/sheet`, data)
      .then(res => {
          alert.success('Ficha atualizada com sucesso')
        }).catch(err => alert.error(err.response.data.message));
    }
    else{
      alert.error('Insira um limite de pontos')
    }
    
  }

  function pressEnter(e: KeyboardEvent<HTMLInputElement>, index: number){
    const key = e.key;
    if(key === 'Enter' && index === (skillsItems.length - 1)){
      addNewSkillsItem();
    }
  }

  function removeRepeatedStatusOrSkills(type: string, position: number, name: string){
    if(type === 'status'){
      const verifyIfExists = (statusItems.map(statusItem => statusItem.name)).indexOf(name);
      if(verifyIfExists !== position) removeStatusItems(position);
    }
    else if(type === 'skills'){
      const verifyIfExists = (skillsItems.map(statusItem => statusItem.name)).indexOf(name);
      
      if(verifyIfExists !== position){
        const updatedSkillsItems = skillsItems.filter((skillItem, index) => {
          return position !== index;
        })
    
        setSkillsItems(updatedSkillsItems);
      }     
    }
  }

  return(
    <Layout linkBack={`/rpgs/${params.id}`}>
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
                      value={statusItem.name}
                      readOnly={statusItem.name === 'Vida' ? true : false}
                      onBlur={() => removeRepeatedStatusOrSkills('status', index, statusItem.name)}
                      onChange={e => setStatusItemValue(index, 'name', e.target.value)}
                    />
                    <button 
                      className={styles.buttonColor}
                      ref={buttonRef.current[index]}
                      style={{backgroundColor: statusItem.color}}
                      onClick={() => {toggleVisibility(index)}}
                    />
                    <Popper 
                      index={index} 
                      targetRef={buttonRef.current[index]} 
                      isVisible={isVisible[index]} 
                    />
                  </div>
                  <div className={styles.pointsContainer}>
                    <InputLine
                      value={statusItem.current}
                      maxValue={statusItem.limit}
                      onChange={e => setStatusItemValue(index, 'current', e.target.value)}
                    />
                    <span> / </span>
                    <InputLine
                      value={statusItem.limit}
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
                      value={skillsItem.name}
                      onKeyUp={e => pressEnter(e, index)}
                      onBlur={() => removeRepeatedStatusOrSkills('skills', index, skillsItem.name)}
                      onChange={e => setSkillsItemValue(index, 'name', e.target.value)}
                    />
                    <div className={styles.pointsContainer}>
                    <InputLine
                      value={skillsItem.current}
                      maxValue={skillsItem.limit}
                      onKeyUp={e => pressEnter(e, index)}
                      onChange={e => setSkillsItemValue(index, 'current', e.target.value)}
                    />
                    <span> / </span>
                    <InputLine
                      value={skillsItem.limit}
                      onKeyUp={e => pressEnter(e, index)}
                      onChange={e => setSkillsItemValue(index, 'limit', e.target.value)}
                    />
                    </div>
                  </div>
                );
              })}
            </Block>

            <div className={styles.points}>
              <p>Limite de pontos:</p>
              <InputLine
                value={limitPoints}
                onChange={e => setLimitPoints(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        <Button 
          type='submit' 
          text="Salvar" 
          className={styles.buttonSave} 
          onClick={saveSheet}
        />
      </div>
    </Layout>
  );
}