import React, { createContext, ReactNode, useContext, useState } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

interface StatusItem{
  name: string;
  color: string;
  current: number;
  limit: number;
}

interface RpgContextData{
  statusItems: Array<StatusItem>;
  openModals: Array<boolean>;
  openAccountModal: boolean;
  isAdm: boolean;
  loading: boolean;
  verifyIfIsAdm: (rpg_id: string) => boolean;
  defaultStatus: (allStatus: StatusItem[]) => void;
  addNewStatus: (oneStatus?: StatusItem) => void;
  setStatusItemValue: (position: number, field: string, value: string) => void;
  removeStatusItems: (position: number) => void;
  handleOpenModals: (modal: number) => void;
  handleOpenAccountModal: () => void;
}

interface RpgProviderProps{
  children: ReactNode;
}


export const RpgContext = createContext({} as RpgContextData);

export function RpgProvider({children}: RpgProviderProps){
  const [statusItems, setStatusItems] = useState<StatusItem[]>([])

  const [openModals, setOpenModals] = useState<boolean[]>([false, false, false, false, false]);
  const [openAccountModal, setOpenAccountModal] = useState(false);

  const [isAdm, setIsAdm] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyIfIsAdm = (rpg_id: string) => {
    const rpgs = localStorage.getItem('rpgs');

    if(rpgs){
      const indexRpg = rpgs.indexOf(rpg_id);
      if(indexRpg !== -1){
        setIsAdm(true);
        setLoading(false);
        return true;
      }      
    }
      
    setIsAdm(false);
    setLoading(false);
    return false; 
  }

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

  function handleOpenAccountModal(){
    const value = openAccountModal ? false : true;
    setOpenAccountModal(value);
  }

  function defaultStatus(allStatus: StatusItem[]){
    setStatusItems(allStatus);
  }

  function addNewStatus(oneStatus?: StatusItem){
    if(oneStatus){
      setStatusItems([
        ...statusItems,
        {
          name: oneStatus.name, 
          color: oneStatus.color, 
          current: oneStatus.current, 
          limit: oneStatus.limit
        }
      ])
    }
    else {
      setStatusItems([
        ...statusItems,
        {name: '', color: '#888', current: 0, limit: 100}
      ])
    }
  }

  function setStatusItemValue(position: number, field: string, value: string){
    const updatedStatusItems = statusItems.map((statusItems, index) => {
      if(index === position){
        if(field === 'current' || field === 'limit') return {...statusItems, [field]: Number(value)};

        return {...statusItems, [field]: value};
      }
      return statusItems;
    })

    setStatusItems(updatedStatusItems);
  }

  function removeStatusItems(position: number){
    const updatedDiceItems = statusItems.filter((statusItem, index) => {
      return position !== index;
    })

    setStatusItems(updatedDiceItems);
  }

  return(
    <RpgContext.Provider
      value={{
        statusItems,
        openModals,
        openAccountModal,
        isAdm,
        loading,
        verifyIfIsAdm,
        defaultStatus,
        addNewStatus,
        setStatusItemValue,
        removeStatusItems,
        handleOpenModals,
        handleOpenAccountModal
      }}
    >
      {children}
    </RpgContext.Provider>
  )

}