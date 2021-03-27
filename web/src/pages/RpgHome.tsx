import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { Block } from '../components/Block';
import { Button } from '../components/Button';
import { ButtonSession } from '../components/ButtonSession';
import { IconElement } from '../components/IconElement';
import { Layout } from '../components/Layout';
import { DiceModal } from '../components/modals/DiceModal';
import { InviteModal } from '../components/modals/InviteModal';
import { ItemModal } from '../components/modals/ItemModal';
import { RpgContext } from '../contexts/RpgHomeContext';

import styles from '../styles/pages/RpgHome.module.css';


export function RpgHome(){
  const {handleOpenModals} = useContext(RpgContext);

  return(
    <>
      <InviteModal />
      <ItemModal />
      <DiceModal />

      <Layout linkBack='/home'>
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
              <button onClick={() => handleOpenModals(0)} className='buttonWithoutBG'>Convidar Pessoas</button>

              <button className='buttonWithoutBG'>Editar</button>
            </div>
          </div>

          <div className={styles.body}>
            <Block id={styles.char} className={`${styles.grid1} ${styles.blocks}`} name='Personagens' options={
              <Link to='/rpgs/character'><button className='buttonWithoutBG'>+ Novo</button></Link>
            }></Block>

            <Block id={styles.scenario} className={`${styles.grid2} ${styles.blocks}`} name='Cenários' options={
              <Link to='/rpgs/scenario'><button className='buttonWithoutBG'>+ Novo</button></Link>
            } />

            <Block id={styles.object} className={`${styles.grid2} ${styles.blocks}`} name='Itens' options={
              <button onClick={() => handleOpenModals(1)} className='buttonWithoutBG'>+ Novo</button>
            } />

            <Block id={styles.account} className={`${styles.grid3} ${styles.blocks}`} name='Contas' center={true} />

            <Link to='/rpgs/sheet'><Button className={`${styles.grid1} ${styles.buttons}`} text='Padrão de ficha' /></Link>
            <Button className={`${styles.grid2} ${styles.buttons}`} onClick={() => handleOpenModals(2)} text='Configurar Dados' />

            <ButtonSession id={styles.session} className={`${styles.grid3} ${styles.buttons}`} />
          </div>
        </div>
      </Layout>
    </>
  );
}