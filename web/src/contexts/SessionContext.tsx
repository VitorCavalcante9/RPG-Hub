/* eslint-disable array-callback-return */
import React, { createContext, ReactNode, useEffect, useState } from 'react';

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
  inventory: Array<string>;
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
  loading: boolean;
  initializeSession: (
    characters: Character[], 
    scenarios: Scenario[], 
    objects: ObjectItem[]
  ) => void;
  updateSession: (
    characters: Character[], 
    fixedCharacters: Character[], 
    scenario: Scenario, 
    object: ObjectItem
  ) => void;
  cleanSession: () => void;
  updateCharacters: (characters: Character[]) => void;
  updateFixedCharacters: (characters: Character[]) => void;
  toggleFixCharacter: (character: Character) => void;
  toggleFixScenario: (scenario: Scenario | null) => void;
  toggleFixObject: (objectItem: ObjectItem | null) => void;
  handleOpenModals: (modal: number) => void;
  handleSelectedCharacter: (character: Character) => void;
  setStatusItemValue: (
    character: Character, position: number, current: number, limit: number
  ) => void;
  setInventoryItemsValue: (
    character: Character, inventory: Array<string>
  ) => void;
}

interface SessionProviderProps{
  children: ReactNode;
}

export const SessionContext = createContext({} as SessionContextData);

export function SessionProvider({children}: SessionProviderProps){
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const [fixedCharacterList, setFixedCharacterList] = useState<Character[]>([]);

  const [scenarioList, setScenarioList] = useState<Scenario[]>([]);
  const [fixedScenario, setFixedScenario] = useState<Scenario | null>(null);

  const [objectList, setObjectList] = useState<ObjectItem[]>([]);
  const [fixedObject, setFixedObject] = useState<ObjectItem | null>(null);

  const [openModals, setOpenModals] = useState<boolean[]>([false, false, false, false]);
  
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characterList[0]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(characterList){
      characterList.map(this_character => {
        if(this_character.id === selectedCharacter.id){
          setSelectedCharacter(this_character);
        }
      });
    }

    const updatedFixedCharacterList = fixedCharacterList.map(fixedCharacter => {
      const indexCharacter = characterList.map((character)=>{return character.id}).indexOf(fixedCharacter.id);

      if(indexCharacter !== -1){
        return characterList[indexCharacter];
      }

      return fixedCharacter;
    })

    setFixedCharacterList(updatedFixedCharacterList);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if(verifyIfExists === -1) setFixedCharacterList([...fixedCharacterList, character]);
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
            return {...statusItems, 'current': current, 'limit': limit};
          }

          return statusItems;
        })

        return {...this_character, 'status': newStatusValue}
      }

      return this_character;
    })

    setCharacterList(updatedStatusItems);
  }

  function setInventoryItemsValue(character: Character, inventory: Array<string>){
    const updatedInventory = characterList.map(this_character => {
      if(this_character.id === character.id){
        return {...this_character, 'inventory': inventory}
      }

      return this_character;
    })

    setCharacterList(updatedInventory);
  }

  async function initializeSession(
    characters: Character[], scenarios: Scenario[], objects: ObjectItem[]
  ){
    try{

      setSelectedCharacter(characters[0])
      setCharacterList(characters);
      setScenarioList(scenarios);
      setObjectList(objects);
      setOpenModals([false, false, false, false]);

    } catch(err) {
      console.error(err);
    }

    setLoading(false);
  }

  function cleanSession(){
    setSelectedCharacter(characterList[0])
    setCharacterList([]);
    setFixedCharacterList([]);
    setScenarioList([]);
    setObjectList([]);
    setFixedObject(null);
    setFixedScenario(null);
    setOpenModals([false, false, false, false]);
    setLoading(true);
  }

  function updateSession(
    characters: Character[], fixedCharacters: Character[], scenario: Scenario, object: ObjectItem
  ){
    setCharacterList(characters);
    setFixedCharacterList(fixedCharacters);
    setFixedScenario(scenario);
    setFixedObject(object);
  }

  function updateCharacters(characters: Character[]){
    setCharacterList(characters);
  }

  function updateFixedCharacters(characters: Character[]){
    setFixedCharacterList(characters);
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
        loading,
        initializeSession,
        cleanSession,
        updateSession,
        updateCharacters,
        updateFixedCharacters,
        toggleFixCharacter,
        toggleFixScenario,
        toggleFixObject,
        handleOpenModals,
        handleSelectedCharacter,
        setStatusItemValue,
        setInventoryItemsValue
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}