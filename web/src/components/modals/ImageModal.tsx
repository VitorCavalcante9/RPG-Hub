/* eslint-disable array-callback-return */
import React, { FormEvent, HTMLAttributes, useState } from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import styles from '../../styles/components/modals/ImageModal.module.css';

import close from '../../assets/icons/cancel.svg';
import { Button } from '../Button';
import { getCroppedImg } from '../../utils/cropImage';

interface ImageModalProps extends HTMLAttributes<HTMLDivElement>{
  open: boolean;
  image: any;
  square?: boolean;
  handleOpenImageModal: (open: boolean) => void;
  getCropDataImage: (image: any) => void;
}

export function ImageModal({ open, image, square, handleOpenImageModal, getCropDataImage }:ImageModalProps){
  const [cropData, setCropData] = useState<any>();

  function closeModal(){
    handleOpenImageModal(false);
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if(cropData){
      const croppedImage = await getCroppedImg(
        image,
        cropData
      );
      getCropDataImage(croppedImage);
      
      handleOpenImageModal(false);
    }
  }

  return(
    <>
      {open ? (
        <div className={styles.overlay}>
          <div className={styles.container}>
              <form onSubmit={onSubmit}>
                <div className={styles.imageContainer}>
                  <Cropper
                    style={{ height: "100%", width: "100%" }}
                    zoomTo={0}
                    initialAspectRatio={square ? 1 : 16/9}
                    preview=".img-preview"
                    src={image}
                    viewMode={1}
                    guides={true}
                    minCropBoxHeight={100}
                    minCropBoxWidth={100}
                    cropBoxResizable={square ? false : true}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    center={true}
                    checkOrientation={false}
                    crop={(e) => setCropData(e.detail)}
                  />
                </div>
                <Button type='submit' className={styles.saveButton} text='Salvar' />
              </form>
            <button onClick={closeModal} type="button">
              <img id={styles.close} src={close} alt="Fechar modal"/>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}