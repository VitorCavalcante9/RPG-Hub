/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, ReactNode, useState } from 'react';

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
  loading: boolean;
  setStatusItems: Function;
  defaultStatus: (allStatus: StatusItem[]) => void;
  addNewStatus: (oneStatus?: StatusItem) => void;
  setStatusItemValue: (position: number, field: string, value: string) => void;
  removeStatusItems: (position: number) => void;
  handleOpenModals: (modal: number) => void;
  handleOpenAccountModal: () => void;
  cleanRPG: () => void;
}

interface RpgProviderProps{
  children: ReactNode;
}

export const RpgContext = createContext({} as RpgContextData);

export function RpgProvider({children}: RpgProviderProps){
  const [statusItems, setStatusItems] = useState<StatusItem[]>([])

  const [openModals, setOpenModals] = useState<boolean[]>([false, false, false, false, false]);
  const [openAccountModal, setOpenAccountModal] = useState(false);

  const [loading, setLoading] = useState(true);

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

  function cleanRPG(){
    setOpenModals([false, false, false, false, false]);
    setOpenAccountModal(false);
    setLoading(true);
  }

  return(
    <RpgContext.Provider
      value={{
        statusItems,
        openModals,
        openAccountModal,
        loading,
        setStatusItems,
        defaultStatus,
        addNewStatus,
        setStatusItemValue,
        removeStatusItems,
        handleOpenModals,
        handleOpenAccountModal,
        cleanRPG
      }}
    >
      {children}
    </RpgContext.Provider>
  )

}