import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

import styles from '../styles/components/InputLabel.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  name: string;
  label: string;
}

export function InputLabel({name, className, label, height, ...rest}:InputProps){
  return(
    <div className={`${styles.inputBlock} ${className}`}>
      <label htmlFor={name}>{label}</label>
        <input type='text' id={name} {...rest}/>
    </div>
  );
}