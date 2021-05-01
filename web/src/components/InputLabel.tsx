import React, { InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react';

import styles from '../styles/components/InputLabel.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  name: string;
  label: string;
  inputRef?: any;
  setInputRef: (ref: HTMLDivElement | null) => void;
}

export function InputLabel({name, className, label, inputRef, setInputRef, ...rest}:InputProps){
  const [thisRef, setThisRef] = useState<HTMLDivElement | null>(null);

  function setInput(){
    setInputRef(thisRef)
  }
  
  return(
    <div className={`${styles.inputBlock} ${className}`}>
      <label htmlFor={name}>{label}</label>
      <input onFocus={setInput} id={name} name={name} {...rest} ref={(input) => {inputRef(input); setThisRef(input)}}/>
    </div>
  );
}