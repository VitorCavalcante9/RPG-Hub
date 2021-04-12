import React from 'react';

import styles from '../../styles/components/characterItems/StatusItem.module.css';

interface StatusItemProps{
  name: string;
  color: string;
  current: number;
  limit: number;
}

export function StatusItem({name, color, current, limit}: StatusItemProps){
  const statusPercentCurrent = Math.round(current * 100) / limit;
  
  return(
    <div className={styles.statusContainer}>
      <p>{name}</p>

      <div className={styles.statusBar}>
      <div className={styles.progressBar} style={{backgroundColor: color, width: `${statusPercentCurrent}%`}} />

        <div className={styles.number}>
          <p>{current} / {limit}</p>
        </div>

      </div>
    </div>
  );
}