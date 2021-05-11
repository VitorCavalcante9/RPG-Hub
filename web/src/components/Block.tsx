import React, { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import classnames from 'classnames';

import styles from '../styles/components/Block.module.css';

interface BlockProps extends HTMLAttributes<HTMLDivElement>{
  name: string;
  options?: ButtonHTMLAttributes<HTMLButtonElement>;
  center?: boolean;
  breakHeader?: boolean;
}

export function Block({className, id, name, options, center, breakHeader, children}: BlockProps){
  return(
    <div id={id} className={`${styles.blockContainer} ${className}`}>
      <div className={classnames(styles.header, {[styles.breakHeader]: breakHeader})} style={{justifyContent: center ? 'center' : ''}}>
        <h3>{name}</h3>
        {options}
        
      </div>

      <div className={`${styles.body} custom-scrollbar`}>
        {children}
      </div>
    </div>
  );
}