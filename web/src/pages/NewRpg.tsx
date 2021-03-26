import React, { ChangeEvent, useState } from 'react';
import { Button } from '../components/Button';
import { InputLabel } from '../components/InputLabel';
import { Layout } from '../components/Layout';

import styles from '../styles/pages/NewRpg.module.css';

export function NewRpg(){
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();

  function handleSelectedImage(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files){
      return;
    }

    const selectedImages = Array.from(event.target.files);
    setImage(selectedImages[0]);

    const selectImagePreview = URL.createObjectURL(selectedImages[0]);
    setPreviewImage(selectImagePreview);
  }

  return(
    <Layout>
      <div className={styles.newRpgContainer}>
        <h1>Dados do RPG</h1>

        <div className={styles.formContainer}>
          <form>
            <div className={styles.previewImage}>
              <div className={styles.image}>
                <img src={previewImage} alt="Prévia da Imagem"/>
              </div>

              <label htmlFor="image">Mudar foto</label>
              <input onChange={handleSelectedImage} type="file" id="image"/>
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