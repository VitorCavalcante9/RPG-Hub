/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom';
import { Layout } from '../components/Layout';

import styles from '../styles/pages/User.module.css';

import { Button } from '../components/Button';
import { InputLabel } from '../components/InputLabel';
import { ImageModal } from '../components/modals/ImageModal';

interface RpgParams{
  id: string;
}

export function User(){
  const params = useParams<RpgParams>();
  const { handleLogout } = useContext(AuthContext);
  const alert = useAlert();
  const history = useHistory();

  const [name, setName] = useState<string>();
  const [imageURL, setImageURL] = useState<any>();
  const [image, setImage] = useState<any>();
  const [previewImage, setPreviewImage] = useState('');

  const {register, handleSubmit, reset, setValue, errors} = useForm();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    api.get(`users`).then(res => {
      const { username, icon } = res.data;

      setName(username);
      setValue('username', username);
      setPreviewImage(icon);

    }).catch(error => {
      if(!error.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(error.response.data.message);
    })
  }, [params.id]);

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
  }, [openImageModal])

  useEffect(()=> {
    if(errors.name) alert.error("Insira um nome");
    if(errors.password) alert.error("Insira sua senha atual");
    if(errors.newPassword) alert.error("Insira uma senha");
    if(errors.confirmPassword) alert.error("Confirme sua nova senha");
  }, [errors, alert]);

  useEffect(() => {
    setValue('username', name);
  }, [changePassword]);

  function updateUser(){}

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
    const { username } = data;
    const userData = new FormData();

    userData.append('username', username);
    
    if(image) userData.append('icon', image);
    else userData.append('previousIcon', previewImage);

    await api.patch(`users`, userData)
    .then(res => {
      const { username, icon } = res.data;
      
      const user = {
        username, icon
      }
  
      localStorage.setItem('user', JSON.stringify(user));
      
      alert.success(res.data.message);
      setIsEdit(false);
      updateUser();

    }).catch(error => {
      if(!error.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(error.response.data.message);
    })

  }

  const onChangePassword = async(data:any) => {
    const { newPassword, confirmPassword } = data;
    
    if(newPassword === confirmPassword){
      await api.patch(`users/password`, data)
      .then(res => {
        alert.success(res.data.message);
        reset({something: ''});
        setChangePassword(false);
  
      }).catch(error => {
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })

    } else {
      alert.error('As senhas não coincidem!')
    }
  }

  async function deleteAccount(){
    api.delete(`users`)
    .then(res => {
      handleLogout();
      history.push(`/`);
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
        <h2>Deletar Conta</h2>

        <p>Você tem certeza que quer deletar sua conta?</p>

        <div className="buttons">
          <button type='button' onClick={() => setOpenDeleteModal(false)}>Cancelar</button>
          <button type='button' onClick={deleteAccount}>Deletar</button>
        </div>
      </div>
    </div>

    <Layout linkBack='/home' updateUser={updateUser}>
      <div className={styles.accountContainer}>
        <div className={styles.header}>
          <h1 className='title'>{changePassword ? 'Alterar Senha' : 'Dados da Conta'}</h1>
        </div>
        
        <div className={styles.body}>
          {!changePassword ? (
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classnames(styles.previewImage)}>
                  <div className={classnames(styles.image, {[styles.imageNotEdit]: !isEdit})}>
                    <img className="image" src={previewImage} alt="Prévia da Imagem"/>
                  </div>

                  {(() => {
                    if(isEdit){
                      return(
                        <>
                        <label htmlFor="image">Mudar foto</label>
                        <input 
                          onChange={handleSelectedImage} 
                          accept="image/*" 
                          type="file" 
                          id="image"
                        />
                        </>
                      )
                    }
                  })()}
                </div>

                <div className={classnames(styles.inputsContainer, {[styles.inputsContainerEdit]: isEdit})}>
                  <InputLabel
                    name='username' 
                    type='text'
                    label='Nome' 
                    readOnly={isEdit ? false : true}
                    inputRef={register({required: true})}
                  />

                  {(() => {
                    if(isEdit){
                      return(
                        <>
                        <Button 
                          type='button' 
                          className={styles.button} 
                          onClick={() => setChangePassword(true)}
                          text='Alterar Senha'
                        />

                        <Button 
                          type='button' 
                          className={styles.button} 
                          onClick={() => setIsEdit(false)}
                          text='Cancelar'
                        />

                        <Button 
                          type='submit' 
                          className={styles.button} 
                          text='Salvar'
                        />
                        </>
                      )
                    } else {
                      return(
                        <>
                        <Button 
                          type='button' 
                          className={styles.button} 
                          onClick={() => setIsEdit(true)}
                          text='Editar'
                        />

                        <Button 
                          type='button' 
                          className={styles.button} 
                          onClick={() => setOpenDeleteModal(true)}
                          text='Excluir'
                        />
                        </>
                      )
                    }
                  })()}
                </div>
              </form>
            </div>
          ) : (
            <div className={styles.formContainer}>
              <form className={classnames({[styles.formPassword]: changePassword})} onSubmit={handleSubmit(onChangePassword)}>
                <div className={styles.inputsContainer}>
                  <InputLabel
                    name='password' 
                    type='password'
                    label='Senha Atual' 
                    inputRef={register({required: true})}
                  />

                  <InputLabel
                    name='newPassword' 
                    type='password'
                    label='Nova Senha' 
                    inputRef={register({required: true})}
                  />

                  <InputLabel
                    name='confirmPassword' 
                    type='password'
                    label='Confirmar Senha' 
                    inputRef={register({required: true})}
                  />

                  <Button 
                    type='submit' 
                    className={styles.button} 
                    text='Salvar'
                  />

                  <Button 
                    type='button' 
                    className={styles.button} 
                    onClick={() => setChangePassword(false)}
                    text='Cancelar'
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
    </>
  )
}