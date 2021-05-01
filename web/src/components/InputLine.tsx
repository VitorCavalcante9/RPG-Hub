import React, { createRef, InputHTMLAttributes, useRef, useState } from 'react';
import { useAlert } from 'react-alert';

import styles from '../styles/components/InputLine.module.css';

interface InputLineProps extends InputHTMLAttributes<HTMLInputElement>{
  maxValue?: number;
  minValue?: number;
}

export function InputLine({className, maxValue, minValue, onChange, ...rest}:InputLineProps){
  const [inputRef, setInputRef] = useState<HTMLDivElement | null>(null);
  const alert = useAlert();

  function isValid(value: number, min: number, max: number){    
    if(value < min || value > max){
      alert.error('Insira um valor válido');
      inputRef?.focus();
    };
  }

  return(
    <div className={`${styles.inputContainer} ${className}`}>
      <input 
        ref={setInputRef}
        onBlur={e => isValid(Number(e.target.value), Number(e.target.min), Number(e.target.max))} 
        onChange={onChange} 
        type="number" 
        step="1" 
        max={maxValue ? maxValue : 9999} 
        min={minValue ? minValue : 0} 
        {...rest}
      />
      <hr/>
    </div>
  );
}