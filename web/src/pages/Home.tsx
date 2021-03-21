import React from 'react';
import { IconElement } from '../components/IconElement';
import { Layout } from '../components/Layout';

import styles from '../styles/pages/Home.module.css';

export function Home(){
  return(
    <Layout>
      <div className={styles.contentContainer}>
        <div className={styles.text}>
          <h1>Seus RPGs</h1>
          <button className='buttonWithoutBG'>+ Criar novo RPG</button>
        </div>
        <div className={styles.elementsList}>
          {}
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.text}>
          <h1>RPGs que você entrou</h1>
          <button className='buttonWithoutBG'>+ Entrar em um RPG</button>
        </div>
        <div className={styles.elementsList}>
          {}
        </div>
      </div>
      
    </Layout>
  );
}