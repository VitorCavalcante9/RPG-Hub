import React, {ButtonHTMLAttributes} from 'react';

import styles from '../styles/components/ButtonGoogle.module.css';

import googleIcon from '../assets/icons/google.svg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  text: string;
}

export function ButtonGoogle({
  text,
  ...rest}: ButtonProps){

  return(
    <div className={styles.buttonBlock}>
      <button {...rest}><span>{text}</span><img src={googleIcon} alt='Login com Google'/></button>
    </div>
  );
}