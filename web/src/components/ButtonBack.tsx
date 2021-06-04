import React, { useEffect, useState } from 'react';

import styles from '../styles/components/ButtonBack.module.css';

import back from '../assets/icons/back.svg';
import arrow from '../assets/icons/arrow.svg';
import { Link } from 'react-router-dom';

interface ButtonBackProps{
  withoutBackButton?: boolean;
  linkBack?: string;
}

export function ButtonBack({withoutBackButton, linkBack}: ButtonBackProps){
  const [icon, setIcon] = useState(window.innerWidth >= 1100 ? back : arrow);

  useEffect(() => {
    const updateWindowDimensions = () => {
      const update_icon = window.innerWidth >= 1100 ? back : arrow;
      setIcon(update_icon);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions) 

  }, []);

  return(
    <Link to={linkBack ? linkBack : '/home'}>
      <div className={styles.buttonContainer} style={{display: withoutBackButton ? 'none' : ''}}>
        <img src={icon} alt="back"/>
      </div>
    </Link>
  );
}