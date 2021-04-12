import React, { TextareaHTMLAttributes } from 'react';

import styles from '../styles/components/TextAreaLabel.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{
  name: string;
  label: string;
}

export function TextAreaLabel({name, className, label, ...rest}: TextareaProps){
  return(
    <div className={`${styles.inputBlock} ${className}`}>
      <label htmlFor={name}>{label}</label>
        <textarea 
          id={name} 
          cols={30} 
          rows={10}
          {...rest}
        ></textarea>
    </div>
  );
}