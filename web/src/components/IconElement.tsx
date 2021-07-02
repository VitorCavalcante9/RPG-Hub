import React, {} from 'react';
import classnames from 'classnames';

import styles from '../styles/components/IconElement.module.css';

interface IconElementProps{
  image: string;
  imgSize?: string;
  alt: string;
  text: string;
  textSize?: string;
  row: boolean;
}

export function IconElement(props: IconElementProps){
  
  return(
    <div className={styles.iconContainer} style={{
      flexDirection: props.row ? 'row' : 'column'
    }}>
      <div className={styles.image} style={{
        width: props.imgSize,
        height: props.imgSize
      }}>
        <img 
          className={classnames({'collapsedStyle': !props.image })} 
          src={props.image} 
          alt={props.alt} 
        />
      </div>

      <p style={{ fontSize: props.textSize }}>{props.text}</p>
    </div>
  );
}