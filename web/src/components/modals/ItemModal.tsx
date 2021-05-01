import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import { RpgContext } from '../../contexts/RpgHomeContext';
import { Modal } from './Modal';
import api from '../../services/api';

import styles from '../../styles/components/modals/ItemModal.module.css';

import { Button } from '../Button';
import { InputLabel } from '../InputLabel';

interface RpgParams{
  id: string;
}

export function ItemModal(){
  const params = useParams<RpgParams>();
  const search = window.location.search;
  const searchContent = new URLSearchParams(search);
  const objectId = searchContent.get('o');
  const history = useHistory();

  const {openModals, handleOpenModals} = useContext(RpgContext);
  const alert = useAlert();
  const { getToken } = useContext(AuthContext);
  const token = getToken();

  const [name, setName] = useState<string>();
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState('');
  const {register, handleSubmit, errors} = useForm();
  const [inputRef, setInputRef] = useState<any>();

  useEffect(() => {
    setName('')
    setPreviewImage('');
  }, [openModals])

  useEffect(() => {
    if(objectId){
      api.get(`rpgs/${params.id}/objects/${objectId}`, {
        headers: { 'Authorization': `Bearer ${token}`}
      }).then(res => {
        const { name: objectName, image } = res.data;

        setName(objectName)
        setPreviewImage(image);
      }) 
    }     
  }, [objectId]);

  useEffect(()=> {
    if(errors.name) alert.error("Insira um nome")
  }, [errors, alert])

  function handleSelectedImage(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files){
      return;
    }

    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);

    const selectImagePreview = URL.createObjectURL(selectedImages[0]);
    setPreviewImage(selectImagePreview);
  }

  function setInput(ref: any){
    setInputRef(ref);
  }

  const onSubmit = async(data:any) => {
    const { name } = data;
    const objectData = new FormData();

    objectData.append('name', name);

    if(images[0]) objectData.append('image', images[0]);
    else objectData.append('previousImage', previewImage);

    if(objectId){
      await api.put(`rpgs/${params.id}/objects/${objectId}`, objectData, {
        headers: { 'Authorization': `Bearer ${token}`}
      }).then(res => {
        alert.success(res.data.message);
        history.push(`/rpgs/${params.id}`);
        handleOpenModals(1);
      }).catch(error => {
        console.error(error)
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })
    } else {
      await api.post(`rpgs/${params.id}/objects`, objectData, {
        headers: { 'Authorization': `Bearer ${token}`}
      }).then(res => {
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

  return(
    <Modal link={`/rpgs/${params.id}`} open={openModals[1]} title={objectId ? 'Editar Objeto' : 'Novo Objeto'}>
      <div className={styles.content}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.line}>
            <div className={styles.previewImage}>
              <div className={styles.image}>
                <img src={previewImage} alt=''/>
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
              setInputRef={setInput}
              onChange={e => setName(e.target.value)}
            />

          </div>      

          <Button text={objectId ? 'Salvar' : 'Criar'} className={styles.buttonCreate} />
        </form>
      </div>
    </Modal>
  );
}