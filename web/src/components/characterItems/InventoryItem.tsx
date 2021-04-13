import React, { InputHTMLAttributes } from 'react';

import styles from '../../styles/components/characterItems/InventoryItem.module.css';

interface InventoryItemInput extends InputHTMLAttributes<HTMLInputElement>{
  isReadOnly?: boolean;
}

export function InventoryItem({isReadOnly, value, onChange}: InventoryItemInput){  
  return(
    <div className={styles.inventoryItem}>
      <span>-</span>
      <div className={styles.inputLine}>
        <input readOnly={isReadOnly} value={value} onChange={onChange} placeholder="Item" type="text" />
      </div>
    </div>
  )
}