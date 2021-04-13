import React, { createContext, ReactNode, useEffect, useState } from 'react';

import ed from '../assets/images/ed.jpeg';
import kaneki from '../assets/images/kaneki.jpeg';
import ribai from '../assets/images/ribai.jpeg';
import may from '../assets/images/may.jpeg';
import wlppr from '../assets/images/wlppr.png';
import uau from '../assets/images/140036.jpg';
import teste from '../assets/images/teste.jpeg';

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
  items?: Array<{
    id: string;
    name: string;
  }>;
}

interface Scenario{
  id: string;
  name: string;
  image?: string;
}

interface ObjectItem{
  id: string;
  name: string;
  image?: string;
}

interface SessionContextData{
  characterList: Array<Character>;
  scenarioList: Array<Scenario>;
  objectList: Array<ObjectItem>;
  fixedCharacterList: Array<Character>;
  fixedScenario: Scenario | null;
  fixedObject: ObjectItem | null;
  openModals: Array<boolean>;
  selectedCharacter: Character;
  toggleFixCharacter: (character: Character) => void;
  toggleFixScenario: (scenario: Scenario | null) => void;
  toggleFixObject: (objectItem: ObjectItem | null) => void;
  handleOpenModals: (modal: number) => void;
  handleSelectedCharacter: (character: Character) => void;
  setStatusItemValue: (character: Character, position: number, current: number, limit: number) => void;
}

interface SessionProviderProps{
  children: ReactNode;
}

export const SessionContext = createContext({} as SessionContextData);

export function SessionProvider({children}: SessionProviderProps){
  const [characterList, setCharacterList] = useState<Character[]>([
    {id: '1', name: 'Personagem 1', status:[
      {name: 'vida', color: '#CC0000', current: 100, limit: 100},
      {name: 'sanidade', color: '#192C8A', current: 100, limit: 100}
    ], skills: [
      {name: 'Força', current: 30, limit: 100},
      {name: 'Luta', current: 50, limit: 100}
    ], items: [{id: '1', name: 'Item 1'}, {id: '2', name: 'Item 2'}]}, 
    {id: '2', name: 'Personagem 2', status:[
      {name: 'vida', color: '#CC0000', current: 100, limit: 100},
      {name: 'sanidade', color: '#192C8A', current: 100, limit: 100}
    ], skills: [
      {name: 'Força', current: 30, limit: 100},
      {name: 'Luta', current: 50, limit: 100}
    ]}, 
    {id: '3', name: 'Personagem 3', status:[
      {name: 'vida', color: '#CC0000', current: 100, limit: 100},
      {name: 'sanidade', color: '#192C8A', current: 100, limit: 100}
    ], skills: [
      {name: 'Força', current: 30, limit: 100},
      {name: 'Luta', current: 50, limit: 100}
    ]}, 
    {id: '4', name: 'Personagem 4', status:[
      {name: 'vida', color: '#CC0000', current: 100, limit: 100},
      {name: 'sanidade', color: '#192C8A', current: 100, limit: 100}
    ], skills: [
      {name: 'Força', current: 30, limit: 100},
      {name: 'Luta', current: 50, limit: 100}
    ]}, 
  ]);

  const [fixedCharacterList, setFixedCharacterList] = useState<Character[]>([]);

  const [scenarioList, setScenarioList] = useState<Scenario[]>([{id: '1', image: wlppr, name: 'Cenário 1'}, {id: '2', image:uau, name: 'Cenário 2'}, {id: '3', image:kaneki, name: 'Cenário 3'}, {id: '4', image:teste, name: 'Cenário 3'}]);

  const [fixedScenario, setFixedScenario] = useState<Scenario | null>(null);

  const [objectList, setObjectList] = useState<ObjectItem[]>([{id: '1', name: 'Item 1', image: ed}, {id: '2', name: 'Item 2', image: ribai}, {id: '3', name: 'Mai', image: may}]);

  const [fixedObject, setFixedObject] = useState<ObjectItem | null>(null);

  const [openModals, setOpenModals] = useState<boolean[]>([false, false, false, false]);
  
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characterList[0]);

  useEffect(() => {
    characterList.map(this_character => {
      if(this_character.id === selectedCharacter.id){
        setSelectedCharacter(this_character);
      }
    });

    const updatedFixedCharacterList = fixedCharacterList.map(fixedCharacter => {
      const indexCharacter = characterList.map((character)=>{return character.id}).indexOf(fixedCharacter.id);

      if(indexCharacter !== -1){
        return characterList[indexCharacter];
      }

      return fixedCharacter;
    })

    setFixedCharacterList(updatedFixedCharacterList);
  }, [characterList]);
  
  function handleOpenModals(modal: number){
    const updatedOpenModals = openModals.map((openModal, index) => {
      if(index === modal){
        const open = openModals[modal] ? false : true;
        return open
      }

      return openModal;
    });

    setOpenModals(updatedOpenModals);
  }
  
  function toggleFixCharacter(character: Character){
    const verifyIfExists = fixedCharacterList.indexOf(character);

    if(verifyIfExists == -1) setFixedCharacterList([...fixedCharacterList, character]);
    else{
      const updatedFixedCharacterList = fixedCharacterList.filter(fixedCharacter => {
        return fixedCharacter !== character;
      })
  
      setFixedCharacterList(updatedFixedCharacterList);
    }
  }

  function toggleFixScenario(scenario: Scenario | null){
    setFixedScenario(scenario);
  }

  function toggleFixObject(objectItem: ObjectItem | null){
    setFixedObject(objectItem);
  }

  function handleSelectedCharacter(character: Character){
    setSelectedCharacter(character);
  }

  function setStatusItemValue(character: Character, position: number, current: number, limit: number){
    const updatedStatusItems = characterList.map(this_character => {
      if(this_character.id === character.id){
        const newStatusValue = this_character.status.map((statusItems, index) => {
          if(index === position){
            return {...statusItems, ['current']: current, ['limit']: limit};
          }

          return statusItems;
        })

        return {...this_character, ['status']: newStatusValue}
      }

      return this_character;
    })

    setCharacterList(updatedStatusItems);
  }

  return(
    <SessionContext.Provider
      value={{
        characterList,
        fixedCharacterList,
        scenarioList,
        fixedScenario,
        objectList,
        fixedObject,
        openModals,
        selectedCharacter,
        toggleFixCharacter,
        toggleFixScenario,
        toggleFixObject,
        handleOpenModals,
        handleSelectedCharacter,
        setStatusItemValue
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}