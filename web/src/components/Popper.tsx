import React, { useState, useRef, MutableRefObject, HTMLAttributes, useContext } from "react";
import { usePopper } from "react-popper";
import { RpgContext } from "../contexts/RpgHomeContext";

import styles from '../styles/components/Popper.module.css';

interface PopperProps extends HTMLAttributes<HTMLDivElement> {
  targetRef: MutableRefObject<null>;
  isVisible: string;
  index: number;
};

export function Popper({ targetRef, isVisible, index, children }: PopperProps) {
  const {setStatusItemValue} = useContext(RpgContext);
  
  const popperRef = useRef(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);
  const colorsOptions = ['#CC0000', '#FCBA03', '#CC00CC', '#333180', '#660066', '#006622', '#996633', '#000', '#007399', "#FC7B03"]

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