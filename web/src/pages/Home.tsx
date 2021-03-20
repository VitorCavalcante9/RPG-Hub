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
          <a href="#">+ Criar novo RPG</a>
        </div>
        <div className={styles.elementsList}>
          {}
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.text}>
          <h1>RPGs que você entrou</h1>
          <a href="#">+ Entrar em um RPG</a>
        </div>
        <div className={styles.elementsList}>
          {}
        </div>
      </div>
      
    </Layout>
  );
}