/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, createRef, useContext, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import api from '../services/api';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';

import { Button } from '../components/Button';
import { InputLabel } from '../components/InputLabel';
import { Layout } from '../components/Layout';
import { ImageModal } from '../components/modals/ImageModal';

import styles from '../styles/pages/NewScenario.module.css';

interface RpgParams{
  id: string;
}

export function NewScenario(){
  const params = useParams<RpgParams>();
  const search = window.location.search;
  const searchContent = new URLSearchParams(search);
  const scenId = searchContent.get('s');
  const history = useHistory();

  const alert = useAlert();

  const [name, setName] = useState<string>();
  const [imageURL, setImageURL] = useState<any>();
  const [image, setImage] = useState<any>();
  const [previewImage, setPreviewImage] = useState('');
  const {register, handleSubmit, reset, errors} = useForm();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  useEffect(() => {
    if(scenId){
      api.get(`rpgs/${params.id}/scenarios/${scenId}`)
      .then(res => {
        const { name: scenarioName, image } = res.data;

        setName(scenarioName)
        setPreviewImage(image);
      }) 
    }     
  }, [params.id]);

  useEffect(() => {
    if(imageURL){
      setOpenImageModal(true);
    }
  }, [imageURL]);
  
  useEffect(()=> {
    if(errors.name) alert.error("Insira um nome")
  }, [errors, alert])

  function handleSelectedImage(e: ChangeEvent<HTMLInputElement>){
    if(!e.target.files){
      return;
    }

    let files;
    if(e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.result) setImageURL(reader.result as any);
    };
    if(files && files.length > 0) reader.readAsDataURL(files[0]);

    const selectedImages = Array.from(e.target.files);
    setImage(selectedImages[0]);
  }

  const onSubmit = async(data:any) =>{
    const { name } = data;
    const scenarioData = new FormData();

    scenarioData.append('name', name);

    if(image) scenarioData.append('image', image);
    else scenarioData.append('previousImage', previewImage);

    if(scenId){
      await api.put(`rpgs/${params.id}/scenarios/${scenId}`, scenarioData)
      .then(res => {
        alert.success(res.data.message);
      }).catch(error => {
        console.error(error)
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })
    } else {
      await api.post(`rpgs/${params.id}/scenarios`, scenarioData)
      .then(res => {
        alert.success(res.data.message);
  
        setPreviewImage('');
        reset({something: ''});
      }).catch(error => {
        console.error(error)
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })
    }
  }

  async function deleteScenario(){
    api.delete(`rpgs/${params.id}/scenarios/${scenId}`)
    .then(res => {
      history.push(`/rpgs/${params.id}`);
    }).catch(error => {
      if(!error.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(error.response.data.message);
    })
  }

  function handleOpenImageModal(open: boolean){
    setOpenImageModal(open);
  }


  function getCropDataImage(image: any){
    const fileImage = new File([image], image.name);
    setImage(fileImage)

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

    {/* The Delete Modal */}
    <div className="modal" style={{display: openDeleteModal ? 'block' : 'none'}}>
      <div className="modalContent">
        <h2>Deletar Cenário</h2>

        <p>Você tem certeza que quer deletar este cenário?</p>

        <div className="buttons">
          <button type='button' onClick={() => setOpenDeleteModal(false)}>Cancelar</button>
          <button type='button' onClick={deleteScenario}>Deletar</button>
        </div>
      </div>
    </div>

    <Layout linkBack={`/rpgs/${params.id}`}>
      <div className={styles.newScenarioContainer}>
        <h1 className='title'>{scenId ? 'Editar Cenário' : 'Novo Cenário'}</h1>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
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

            <div className={styles.items}>
              <InputLabel 
                name='name' 
                type='text'
                label='Nome' 
                value={name}
                inputRef={register({required: true})}
                onChange={e => setName(e.target.value)}
              />

              {(() => {
                if(scenId){
                  return(
                    <Button 
                      type='button' 
                      className={styles.buttonCreate} 
                      onClick={() => setOpenDeleteModal(true)}
                      text='Excluir'
                    />
                  )
                }
              })()}

              <Button 
                type='submit' 
                className={classnames(styles.buttonCreate, {[styles.edit]: scenId})} 
                text={scenId ? 'Salvar' : 'Criar'} 
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
    </>
  );
}