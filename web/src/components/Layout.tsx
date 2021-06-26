import React, { HTMLAttributes } from 'react';
import classnames from 'classnames';

import { ButtonBack } from '../components/ButtonBack';
import { Sidebar } from '../components/Sidebar';

import styles from '../styles/components/Layout.module.css';

interface LayoutProps extends HTMLAttributes<HTMLDivElement>{
  withoutBackButton?: boolean;
  linkBack?: string;
  updateUser?: () => void;
}

export function Layout({children, withoutBackButton, linkBack, updateUser}:LayoutProps){
  return(
    <>
      <Sidebar updateUser={updateUser} />

      <div className={styles.pageContainer}>

        <ButtonBack linkBack={linkBack} withoutBackButton={withoutBackButton} />
        
        <div className={classnames(styles.mainBlockContainer, {[styles.withoutBackButton]: withoutBackButton})}>
          {children}
        </div>
      </div>
    </>
    
  );
}