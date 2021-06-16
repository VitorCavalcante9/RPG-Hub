/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { RpgContext } from '../../contexts/RpgHomeContext';
import { Modal } from './Modal';
import api from '../../services/api';

import styles from '../../styles/components/modals/ObjectModal.module.css';

import { Button } from '../Button';
import { InputLabel } from '../InputLabel';
import { ImageModal } from './ImageModal';

interface RpgParams{
  id: string;
}

export function ObjectModal(){
  const params = useParams<RpgParams>();
  const search = window.location.search;
  const searchContent = new URLSearchParams(search);
  const objectId = searchContent.get('o');
  const history = useHistory();

  const {openModals, handleOpenModals} = useContext(RpgContext);
  const [openImageModal, setOpenImageModal] = useState(false);
  const alert = useAlert();

  const [name, setName] = useState<string>();
  const [imageURL, setImageURL] = useState<any>();
  const [image, setImage] = useState<any>();
  const [previewImage, setPreviewImage] = useState('');
  const {register, handleSubmit, errors} = useForm();

  useEffect(() => {
    setName('')
    setPreviewImage('');
  }, [openModals])

  useEffect(() => {
    if(objectId){
      api.get(`rpgs/${params.id}/objects/${objectId}`)
      .then(res => {
        const { name: objectName, image } = res.data;

        setName(objectName)
        setPreviewImage(image);
      }) 
    }     
  }, [objectId, params.id]);

  useEffect(() => {
    if(imageURL){
      setOpenImageModal(true);
    }
  }, [imageURL]);

  useEffect(() => {
    if(!openImageModal && !previewImage){
      setImageURL(null);
      setImage(null);
      console.log(image, imageURL)
    }
  }, [openImageModal])

  useEffect(()=> {
    if(errors.name) alert.error("Insira um nome")
  }, [errors, alert])

  function handleSelectedImage(e: ChangeEvent<HTMLInputElement>){
    if(!e.target.files){
      return;
    }

    let files;
    if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageURL(reader.result as any);
    };
    if(files && files.length > 0) reader.readAsDataURL(files[0]);

    const selectedImages = Array.from(e.target.files);
    setImage(selectedImages[0]);
  }

  const onSubmit = async(data:any) => {
    const { name } = data;
    const objectData = new FormData();

    objectData.append('name', name);

    if(image) objectData.append('image', image);
    else objectData.append('previousImage', previewImage);

    if(objectId){
      await api.put(`rpgs/${params.id}/objects/${objectId}`, objectData)
      .then(res => {
        alert.success(res.data.message);
        history.push(`/rpgs/${params.id}`);
        handleOpenModals(1);
      }).catch(error => {
        console.error(error)
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })
    } else {
      await api.post(`rpgs/${params.id}/objects`, objectData)
      .then(res => {
        alert.success(res.data.message);
        
        setName('')
        setPreviewImage('');
        
      }).catch(error => {
        console.error(error)
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })
    }
  }

  function handleOpenImageModal(open: boolean){
    setOpenImageModal(open);
  }

  function getCropDataImage(imageBlob: Blob){
    const fileImage = new File([imageBlob], image.name, { type: imageBlob.type });
    setImage(fileImage);

    const selectImagePreview = URL.createObjectURL(fileImage);
    setPreviewImage(selectImagePreview);
  }


  return(
    <>
    <ImageModal 
      open={openImageModal}
      image={imageURL}
      handleOpenImageModal={handleOpenImageModal}
      getCropDataImage={getCropDataImage}
    />

    <Modal link={`/rpgs/${params.id}`} open={openModals[1]} title={objectId ? 'Editar Objeto' : 'Novo Objeto'}>
      <div className={styles.content}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.line}>
            <div className={styles.previewImage}>
              <div className={styles.image}>
                <img className='image' src={previewImage} alt=''/>
              </div>

              <label htmlFor="image">Mudar foto</label>
              <input 
                onChange={handleSelectedImage} 
                accept="image/*" 
                type="file" 
                id="image"
              />
            </div>

            <InputLabel 
              name='name' 
              type='text'
              label='Nome' 
              value={name}
              inputRef={register({required: true})}
              onChange={e => setName(e.target.value)}
            />

          </div>      

          <Button text={objectId ? 'Salvar' : 'Criar'} className={styles.buttonCreate} />
        </form>
      </div>
    </Modal>
    </>
  );
}