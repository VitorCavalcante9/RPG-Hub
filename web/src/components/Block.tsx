import React, { ButtonHTMLAttributes, HTMLAttributes } from 'react';

import styles from '../styles/components/Block.module.css';

interface BlockProps extends HTMLAttributes<HTMLDivElement>{
  name: string;
  options?: ButtonHTMLAttributes<HTMLButtonElement>;
  center?: boolean;
}

export function Block({className, id, name, options, center, children}: BlockProps){
  return(
    <div id={id} className={`${styles.blockContainer} ${className}`}>
      <div className={styles.header} style={{justifyContent: center ? 'center' : ''}}>
        <h3>{name}</h3>
        {options}
        
      </div>

      <div className={`${styles.body} custom-scrollbar`}>
        {children}
      </div>
    </div>
  );
}