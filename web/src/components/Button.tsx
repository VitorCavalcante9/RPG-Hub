import React, {ButtonHTMLAttributes} from 'react';

import styles from '../styles/components/Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  text: string;
}

export function Button({
  text,
  ...rest}: ButtonProps){

  return(
    <div className={styles.buttonBlock}>
      <button {...rest}>{text}</button>
    </div>
  );
}