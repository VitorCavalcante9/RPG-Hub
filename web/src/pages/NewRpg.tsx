/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useEffect, useState } from 'react';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';
import api from '../services/api';

import { Button } from '../components/Button';
import { InputLabel } from '../components/InputLabel';
import { Layout } from '../components/Layout';
import { TextAreaLabel } from '../components/TextAreaLabel';
import { ImageModal } from '../components/modals/ImageModal';

import styles from '../styles/pages/NewRpg.module.css';

export function NewRpg(){
  const search = window.location.search;
  const searchContent = new URLSearchParams(search);
  const rpgId = searchContent.get('r');

  const [name, setName] = useState<string>();
  const [imageURL, setImageURL] = useState<any>();
  const [image, setImage] = useState<any>();
  const [previewImage, setPreviewImage] = useState('');

  const {register, handleSubmit, errors} = useForm();
  const history = useHistory();
  const alert = useAlert();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

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
  }, [errors, alert]);

  useEffect(() => {
    if(imageURL){
      setOpenImageModal(true);
    }
  }, [imageURL]);

  useEffect(() => {
    if(!openImageModal && !previewImage){
      setImageURL(null);
      setImage(null);
    }
  }, [openImageModal]);

  const onSubmit = async(data:any) => {
    const { name } = data;
    const rpgData = new FormData();

    rpgData.append('name', name);
    
    if(image) rpgData.append('icon', image);
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
          const allRpgs = JSON.parse(rpgs);
          const yourRpgList:Array<string> = allRpgs.rpgs;
          const participatingRpgList:Array<string> = allRpgs.participating_rpgs;

          yourRpgList.push(rpgId);
          
          const rpgList = {
            rpgs: yourRpgList,
            participating_rpgs: participatingRpgList
          }

          localStorage.setItem('rpgs', JSON.stringify(rpgList));
        }
        
        history.push(`/rpgs/${rpgId}`)
      }).catch(error => {
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })
    }
  }

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
      square={true}
      handleOpenImageModal={handleOpenImageModal}
      getCropDataImage={getCropDataImage}
    />

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
        <h1 className='title'>Dados do RPG</h1>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.previewImage}>
              <div className={styles.image}>
                <img className='image' src={previewImage} alt="Prévia da Imagem"/>
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