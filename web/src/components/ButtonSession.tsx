import React, {ButtonHTMLAttributes} from 'react';

import styles from '../styles/components/ButtonSession.module.css';

import playIcon from '../assets/icons/play-button.svg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}

export function ButtonSession({className, id, ...rest}: ButtonProps){
  return(
    <div id={id} className={`${styles.buttonBlock} ${className}`}>
      <button {...rest}><span>Iniciar Sessão</span><img src={playIcon}/></button>
    </div>
  );
}