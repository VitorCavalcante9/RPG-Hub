import React, { TextareaHTMLAttributes } from 'react';

import styles from '../styles/components/TextAreaLabel.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{
  name: string;
  label: string;
  inputRef?: any;
}

export function TextAreaLabel({name, className, label, inputRef, ...rest}: TextareaProps){
  return(
    <div className={`${styles.inputBlock} ${className}`}>
      <label htmlFor={name}>{label}</label>
        <textarea 
          id={name} 
          name={name}
          cols={30} 
          rows={10}
          ref={inputRef}
          {...rest}
        ></textarea>
    </div>
  );
}