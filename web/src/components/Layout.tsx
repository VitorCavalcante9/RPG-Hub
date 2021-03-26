import React, { HTMLAttributes } from 'react';
import { ButtonBack } from '../components/ButtonBack';
import { Sidebar } from '../components/Sidebar';

import styles from '../styles/components/Layout.module.css';

interface LayoutProps extends HTMLAttributes<HTMLDivElement>{}

export function Layout({children}:LayoutProps){
  return(
    <>
      <Sidebar />

      <div className={styles.pageContainer}>

        <ButtonBack />
        
        <div className={styles.mainBlockContainer}>
          {children}
        </div>
      </div>
    </>
    
  );
}