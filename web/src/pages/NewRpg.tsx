import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';
import api from '../services/api';

import { Button } from '../components/Button';
import { InputLabel } from '../components/InputLabel';
import { Layout } from '../components/Layout';
import { TextAreaLabel } from '../components/TextAreaLabel';

import styles from '../styles/pages/NewRpg.module.css';

export function NewRpg(){
  const search = window.location.search;
  const searchContent = new URLSearchParams(search);
  const rpgId = searchContent.get('r');

  const [name, setName] = useState<string>();
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState('');

  const {register, handleSubmit, errors} = useForm();
  const history = useHistory();
  const alert = useAlert();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    api.get(`rpgs/${rpgId}`)
    .then(res => {
      const { name: rpgName, icon } = res.data;

      setName(rpgName)
      setPreviewImage(icon);
    })      
  }, [rpgId]);

  useEffect(()=> {
    if(errors.name) alert.error("Insira um nome")
  }, [errors, alert])

  const onSubmit = async(data:any) => {
    const { name } = data;
    const rpgData = new FormData();

    rpgData.append('name', name);
    
    if(images[0]) rpgData.append('icon', images[0]);
    else rpgData.append('previousIcon', previewImage);

    if(rpgId){
      await api.patch(`rpgs/${rpgId}`, rpgData)
      .then(res => {
        alert.success(res.data.message);
        
        history.push(`/rpgs/${rpgId}`);
      }).catch(error => {
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })
    } else {
      await api.post('rpgs', rpgData)
      .then(res => {
        const { rpgId } = res.data;
        const rpgs = localStorage.getItem('rpgs');
        if(rpgs){
          const rpgList:Array<string> = JSON.parse(rpgs);
          rpgList.push(rpgId);
          localStorage.setItem('rpgs', JSON.stringify(rpgList));
        }
        else{
          const rpgList = [rpgId]
          localStorage.setItem('rpgs', JSON.stringify(rpgList));
        }
        
        history.push(`/rpgs/${rpgId}`)
      }).catch(error => {
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })
    }
  }

  function handleSelectedImage(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files){
      return;
    }

    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);

    const selectImagePreview = URL.createObjectURL(selectedImages[0]);
    setPreviewImage(selectImagePreview);
  }

  async function deleteRpg(){
    api.delete(`rpgs/${rpgId}`)
    .then(res => {
      alert.success(res.data.message);
      history.push(`/home`);
    }).catch(error => {
      if(!error.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(error.response.data.message);
    })
  }

  return(
    <>
    {/* The Delete Modal */}
    <div className="modal" style={{display: openDeleteModal ? 'block' : 'none'}}>
      <div className="modalContent">
        <h2>Deletar RPG</h2>

        <p>Você tem certeza que quer deletar este RPG?</p>

        <div className="buttons">
          <button type='button' onClick={() => setOpenDeleteModal(false)}>Cancelar</button>
          <button type='button' onClick={deleteRpg}>Deletar</button>
        </div>
      </div>
    </div>

    <Layout linkBack={rpgId ? `/rpgs/${rpgId}` : '/home'}>
      <div className={styles.newRpgContainer}>
        <h1>Dados do RPG</h1>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.previewImage}>
              <div className={styles.image}>
                <img src={previewImage} alt="Prévia da Imagem"/>
              </div>

              <label htmlFor="image">Mudar foto</label>
              <input 
                onChange={handleSelectedImage} 
                accept="image/*" 
                type="file" 
                id="image"
              />
            </div>

            <div className={styles.inputsContainer}>
              <InputLabel 
                name='name' 
                type='text'
                label='Nome' 
                value={name}
                inputRef={register({required: true})}
                onChange={e => setName(e.target.value)}
              />
              <TextAreaLabel 
                name='description'
                label='Descrição' 
                className={styles.textarea}
                inputRef={register({required: false})}
              />

              {(() => {
                if(rpgId){
                  return(
                    <Button 
                      type='button' 
                      className={styles.buttonDelete} 
                      onClick={() => setOpenDeleteModal(true)}
                      text='Excluir'
                    />
                  )
                }
              })()}
              <Button className={classnames({[styles.edit]: rpgId})} text={rpgId ? 'Salvar' : 'Criar'} />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  
    </>
  );
}