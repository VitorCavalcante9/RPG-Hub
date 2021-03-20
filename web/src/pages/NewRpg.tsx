import React from 'react';
import { Button } from '../components/Button';
import { InputLabel } from '../components/InputLabel';
import { Layout } from '../components/Layout';

import styles from '../styles/pages/NewRpg.module.css';

export function NewRpg(){
  return(
    <Layout>
      <div className={styles.newRpgContainer}>
        <h1>Dados do RPG</h1>

        <div className={styles.formContainer}>
          <form>
            <div className={styles.previewImage}>
              <div className={styles.image}>
                <img src="" alt="Prévia da Imagem"/>
              </div>

              <p>Mudar foto</p>
            </div>

            <div>
              <InputLabel name='name' label='Nome' />
              <InputLabel 
                name='description' 
                label='Descrição' 
                height='15rem' 
                isTextarea={true}/>

              <Button text='Criar' />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}