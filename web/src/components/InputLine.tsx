import React, { InputHTMLAttributes } from 'react';

import styles from '../styles/components/InputLine.module.css';

interface InputLineProps extends InputHTMLAttributes<HTMLInputElement>{}

export function InputLine({className}:InputLineProps){
  return(
    <div className={`${styles.inputContainer} ${className}`}>
      <input type="number" step="1" max="9999" min="0"/>
      <hr/>
    </div>
  );
}