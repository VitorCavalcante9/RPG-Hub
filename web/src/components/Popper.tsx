import React, { useState, useRef, MutableRefObject, HTMLAttributes, useContext, useEffect } from "react";
import { usePopper } from "react-popper";
import { RpgContext } from "../contexts/RpgHomeContext";

import styles from '../styles/components/Popper.module.css';

interface PopperProps extends HTMLAttributes<HTMLDivElement> {
  targetRef: MutableRefObject<null>;
  isVisible: string;
  index: number;
};

export function Popper({ targetRef, isVisible, index }: PopperProps) {
  const {setStatusItemValue} = useContext(RpgContext);
  
  const popperRef = useRef(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);
  const colorsOptions = ['#CC0000', "#FC7B03", '#996633', '#FCBA03', '#006622', '#007399', '#192C8A', '#660066', '#CC00CC', '#888']

  const {styles: stylesPopper, attributes} = usePopper(
    targetRef.current,
    popperRef.current,
    {
      placement: 'right',
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 10]
          }
        },
        {
          name: "arrow",
          options:{
            element: arrowRef
          }
        }
      ]
    }
  )

  return (
    <div className={styles.popper} style={Object.assign({visibility: isVisible}, stylesPopper.popper)}
      ref={popperRef}
      {...attributes.popper}
    >
      <div ref={setArrowRef} className={styles.arrow} data-popper-arrow></div>
      <div className={styles.colors}>
        {colorsOptions.map(color => {
          return(
            <button 
              key={color} 
              style={{backgroundColor: color}}
              onClick={() => setStatusItemValue(index, 'color', color)} 
            />
          )
        })}
      </div>      
    </div>
  );
};