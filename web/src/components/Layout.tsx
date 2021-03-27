import React, { HTMLAttributes } from 'react';
import { ButtonBack } from '../components/ButtonBack';
import { Sidebar } from '../components/Sidebar';

import styles from '../styles/components/Layout.module.css';

interface LayoutProps extends HTMLAttributes<HTMLDivElement>{
  withoutBackButton?: boolean;
  linkBack?: string;
}

export function Layout({children, withoutBackButton, linkBack}:LayoutProps){
  return(
    <>
      <Sidebar />

      <div className={styles.pageContainer}>

        <ButtonBack linkBack={linkBack} withoutBackButton={withoutBackButton} />
        
        <div className={styles.mainBlockContainer} style={{marginLeft: withoutBackButton ? '18.4rem' : ''}}>
          {children}
        </div>
      </div>
    </>
    
  );
}