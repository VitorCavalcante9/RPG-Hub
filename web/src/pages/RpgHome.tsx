import React, {} from 'react';
import { Block } from '../components/Block';
import { Button } from '../components/Button';
import { ButtonSession } from '../components/ButtonSession';
import { IconElement } from '../components/IconElement';
import { Layout } from '../components/Layout';

import styles from '../styles/pages/RpgHome.module.css';


export function RpgHome(){
  return(
    <Layout>
      <div className={styles.rpgHomeContainer}>
        <div className={styles.header}>
          <IconElement 
            image='' 
            alt='' 
            row={true} 
            text='RPG: tal tal' 
            imgSize='7rem'
            textSize='2.2rem'
          />

          <div className={styles.options}>
            <button className='buttonWithoutBG'>Convidar Pessoas</button>

            <button className='buttonWithoutBG'>Editar</button>
          </div>
        </div>

        <div className={styles.body}>
          <Block id={styles.char} className={`${styles.grid1} ${styles.blocks}`} name='Personagens' options={
            <button className='buttonWithoutBG'>+ Novo</button>
          }>oi</Block>

          <Block id={styles.scenario} className={`${styles.grid2} ${styles.blocks}`} name='Cenários' options={
            <button className='buttonWithoutBG'>+ Novo</button>
          } />

          <Block id={styles.object} className={`${styles.grid2} ${styles.blocks}`} name='Itens' options={
            <button className='buttonWithoutBG'>+ Novo</button>
          } />

          <Block id={styles.account} className={`${styles.grid3} ${styles.blocks}`} name='Contas' center={true} />

          <Button className={`${styles.grid1} ${styles.buttons}`} text='Padrão de ficha' />
          <Button className={`${styles.grid2} ${styles.buttons}`} text='Configurar Dados' />

          <ButtonSession id={styles.session} className={`${styles.grid3} ${styles.buttons}`} />
        </div>
      </div>
    </Layout>
  );
}