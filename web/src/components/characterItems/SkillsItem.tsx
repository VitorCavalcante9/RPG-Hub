import React, { InputHTMLAttributes } from 'react';

import styles from '../../styles/components/characterItems/SkillsItem.module.css';
import { InputLine } from '../InputLine';

interface SkillsItemsProps extends InputHTMLAttributes<HTMLInputElement>{
  name: string;
  limit: number;
}

export function SkillsItems({name, limit, onChange, value, className}: SkillsItemsProps){
  return(
    <div className={`${styles.skillItem} ${className}`}>
      <p className={styles.name}> - {name}: </p>
      <div className={styles.numbers}>
        <InputLine className={styles.input} value={value} onChange={onChange}/>
        <p> / {limit}</p>
      </div>
    </div>
  )
}