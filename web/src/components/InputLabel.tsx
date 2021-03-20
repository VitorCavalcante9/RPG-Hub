import React, { InputHTMLAttributes } from 'react';

import styles from '../styles/components/InputLabel.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  name: string;
  label: string;
  height?: string;
  isTextarea?: boolean;
  width?: string;
}

export function InputLabel({name, label, height, width, isTextarea, ...rest}:InputProps){
  return(
    <div className={styles.inputBlock}>
      <label htmlFor={name}>{label}</label>
      {isTextarea ? (
        <textarea 
          id={name} 
          cols={30} 
          rows={10} 
          style={{
            height, width, 
            resize: 'none'}}></textarea>
      ) : (
        <input type='text' id={name} {...rest} style={{width}} />
      )}
    </div>
  );
}