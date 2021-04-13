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
  isAdm: boolean;
  addNewStatus: () => void;
  setStatusItemValue: (position: number, field: string, value: string) => void;
  handleOpenModals: (modal: number) => void;
  handleOpenAccountModal: () => void;
}

interface RpgProviderProps{
  children: ReactNode;
}

export const RpgContext = createContext({} as RpgContextData);

export function RpgProvider({children}: RpgProviderProps){
  const [statusItems, setStatusItems] = useState<StatusItem[]>([
    {name: '', color: '#000', current: 0, limit: 0}
  ])

  const [openModals, setOpenModals] = useState<boolean[]>([false, false, false, false]);
  const [openAccountModal, setOpenAccountModal] = useState(false);

  const [isAdm, setIsAdm] = useState(true);

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

  function addNewStatus(){
    setStatusItems([
      ...statusItems,
      {name: '', color: '#000', current: 0, limit: 0}
    ])
  }

  function setStatusItemValue(position: number, field: string, value: string){
    const updatedStatusItems = statusItems.map((statusItems, index) => {
      if(index === position){
        return {...statusItems, [field]: value};
      }

      return statusItems;
    })

    setStatusItems(updatedStatusItems);
  }

  return(
    <RpgContext.Provider
      value={{
        statusItems,
        openModals,
        openAccountModal,
        isAdm,
        addNewStatus,
        setStatusItemValue,
        handleOpenModals,
        handleOpenAccountModal
      }}
    >
      {children}
    </RpgContext.Provider>
  )

}