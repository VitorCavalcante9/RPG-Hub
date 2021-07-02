import React, { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import classnames from 'classnames';

import styles from '../styles/components/Block.module.css';

interface BlockProps extends HTMLAttributes<HTMLDivElement>{
  name: string;
  options?: ButtonHTMLAttributes<HTMLButtonElement>;
  center?: boolean;
  breakHeader?: boolean;
  blockRef?: any;
}

export function Block({className, id, name, options, center, breakHeader, children, blockRef, ...rest}: BlockProps){
  return(
    <div id={id} className={`${styles.blockContainer} ${className}`} {...rest}>
      <div className={classnames(styles.header, {[styles.breakHeader]: breakHeader})} style={{justifyContent: center ? 'center' : ''}}>
        <h3>{name}</h3>
        {options}
        
      </div>

      <div className={styles.body} ref={blockRef}>
        {children}
      </div>
    </div>
  );
}