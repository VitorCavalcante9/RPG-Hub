import React, { InputHTMLAttributes } from 'react';

import styles from '../styles/components/InputLabel.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  name: string;
  label: string;
  height?: string;
  isTextarea?: boolean;
}

export function InputLabel({name, className, label, height, isTextarea, ...rest}:InputProps){
  return(
    <div className={`${styles.inputBlock} ${className}`}>
      <label htmlFor={name}>{label}</label>
      {isTextarea ? (
        <textarea 
          id={name} 
          cols={30} 
          rows={10} 
          style={{
            height, 
            resize: 'none'}}></textarea>
      ) : (
        <input type='text' id={name} {...rest}/>
      )}
    </div>
  );
}