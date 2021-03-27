import React, {ButtonHTMLAttributes} from 'react';

import styles from '../styles/components/ButtonSession.module.css';

import playIcon from '../assets/icons/play-button.svg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  text?: string;
}

export function ButtonSession({className, text, id, ...rest}: ButtonProps){
  const textButton = text ? text : 'Iniciar Sessão';
  
  return(
    <div id={id} className={`${styles.buttonBlock} ${className}`}>
      <button {...rest}><span>{textButton}</span><img src={playIcon}/></button>
    </div>
  );
}