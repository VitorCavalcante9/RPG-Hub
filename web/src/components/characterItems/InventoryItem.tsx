import React, { InputHTMLAttributes } from 'react';
import classnames from 'classnames';

import styles from '../../styles/components/characterItems/InventoryItem.module.css';

interface InventoryItemInput extends InputHTMLAttributes<HTMLInputElement>{
  isReadOnly?: boolean;
}

export function InventoryItem({isReadOnly, value, onChange}: InventoryItemInput){  
  return(
    <div className={styles.inventoryItem}>
      <span>-</span>
      <div className={styles.inputLine}>
        <input 
          className={classnames({[styles.readOnly]: isReadOnly})}
          readOnly={isReadOnly} 
          value={value} 
          onChange={onChange} 
          placeholder="Item" 
          type="text" 
        />
      </div>
    </div>
  )
}