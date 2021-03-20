import React, { useEffect, useState } from 'react';

import styles from '../styles/components/ButtonBack.module.css';

import back from '../assets/icons/back.svg';
import arrow from '../assets/icons/arrow.svg';

export function ButtonBack(){
  const [icon, setIcon] = useState(window.innerWidth >= 1100 ? back : arrow);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateWindowDimensions = () => {
      const update_icon = window.innerWidth >= 1100 ? back : arrow;
      setIcon(update_icon);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions) 

  }, []);

  return(
    <div className={styles.buttonContainer}>
      <img src={icon} alt="back"/>
    </div>
  );
}