import React, { ChangeEvent, useContext, useState } from 'react';
import { Modal } from './Modal';

import styles from '../../styles/components/modals/ItemModal.module.css';

import { RpgContext } from '../../contexts/RpgHomeContext';
import { Button } from '../Button';
import { InputLabel } from '../InputLabel';

export function ItemModal(){
  const {openModals} = useContext(RpgContext);
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
    <Modal open={openModals[1]} title="Novo Item">
      <div className={styles.content}>
        <div className={styles.line}>
          <div className={styles.previewImage}>
            <div className={styles.image}>
              <img src={previewImage} alt="Prévia da Imagem"/>
            </div>

            <label htmlFor="image">Mudar foto</label>
            <input onChange={handleSelectedImage} type="file" id="image"/>
          </div>
          <InputLabel name="name" label="Nome:"/>
        </div>      

        <Button text="Criar" className={styles.buttonCreate} />
      </div>
    </Modal>
  );
}