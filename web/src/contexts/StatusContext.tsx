import React, { createContext, ReactNode, useState } from 'react';

interface StatusItem{
  name: string;
  color: string;
  current: number;
  limit: number;
}

interface StatusContextData{
  statusItems: Array<StatusItem>;
  addNewStatus: () => void;
  setStatusItemValue: (position: number, field: string, value: string) => void;
}

interface StatusProviderProps{
  children: ReactNode;
}

export const StatusContext = createContext({} as StatusContextData);

export function StatusProvider({children}: StatusProviderProps){
  const [statusItems, setStatusItems] = useState<StatusItem[]>([
    {name: '', color: '#000', current: 0, limit: 0}
  ])

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
    <StatusContext.Provider
      value={{
        statusItems,
        addNewStatus,
        setStatusItemValue
      }}
    >
      {children}
    </StatusContext.Provider>
  )

}