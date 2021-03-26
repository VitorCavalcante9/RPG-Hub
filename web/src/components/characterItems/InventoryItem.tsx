import React, { InputHTMLAttributes } from 'react';

import styles from '../../styles/components/characterItems/InventoryItem.module.css';

interface InventoryItemInput extends InputHTMLAttributes<HTMLInputElement>{}

export function InventoryItem({value, onChange}: InventoryItemInput){  
  return(
    <div className={styles.inventoryItem}>
      <span>-</span>
      <div className={styles.inputLine}>
        <input value={value} onChange={onChange} placeholder="Item" type="text" />
      </div>
    </div>
  )
}