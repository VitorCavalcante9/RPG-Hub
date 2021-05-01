import React from 'react';

import styles from '../../styles/components/characterItems/StatusItem.module.css';
import { InputLine } from '../InputLine';

interface StatusItemProps{
  name: string;
  color: string;
  current: number;
  limit: number;

  edit?: boolean;
  index: number;
  setStatusItemValue?: (position: number, field: string, value: string) => void;
}

export function StatusItem({name, color, current, limit, edit, index, setStatusItemValue}: StatusItemProps){
  const statusPercentCurrent = Math.round(current * 100) / limit;

  function changeStatus(position: number, field: string, value: string){
    if(setStatusItemValue){
      setStatusItemValue(position, field, value);
    }
  }
  
  return(
    <div className={styles.statusContainer}>
      <p>{name}</p>

      <div className={styles.statusBar}>
      <div className={styles.progressBar} style={{backgroundColor: color, width: `${statusPercentCurrent}%`}} />

        <div className={styles.number}>
          {(() => {
            if(edit){
              return(
                <div className={styles.inputs}>
                  <InputLine
                    className={styles.input} 
                    value={current}
                    maxValue={limit}
                    onChange={e => changeStatus(index, 'current', e.target.value)}
                  />
                  <span> / </span>
                  <InputLine
                    className={styles.input}
                    value={limit}
                    onChange={e => changeStatus(index, 'limit', e.target.value)}
                  />
                </div>
              )
            } else {
              return(
                <p>{current} / {limit}</p>
              )
            }
          })()}
        </div>

      </div>
    </div>
  );
}