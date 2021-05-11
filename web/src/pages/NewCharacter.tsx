import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import classnames from 'classnames';
import { useAlert } from 'react-alert';
import { useHistory, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { RpgContext } from '../contexts/RpgHomeContext';

import { Block } from '../components/Block';
import { Button } from '../components/Button';
import { InputLabel } from '../components/InputLabel';
import { InventoryItem } from '../components/characterItems/InventoryItem';
import { Layout } from '../components/Layout';
import { StatusItem } from '../components/characterItems/StatusItem';
import { SkillsItems } from '../components/characterItems/SkillsItem';
import { AccountModal } from '../components/modals/AccountModal';

import styles from '../styles/pages/NewCharacter.module.css';

import remove from '../assets/icons/cancel.svg';
import { InputLine } from '../components/InputLine';

interface StatusItems{
  name: string;
  color: string;
  current: number;
  limit: number;
}

interface SkillItems{
  name: string;
  current: number;
  limit: number;
}

interface RpgParams{
  id: string;
}

export function NewCharacter(){
  const params = useParams<RpgParams>();
  const search = window.location.search;
  const searchContent = new URLSearchParams(search);
  const charId = searchContent.get('c');
  const history = useHistory();

  const alert = useAlert();
  const {handleOpenAccountModal} = useContext(RpgContext);

  const [name, setName] = useState<string>();
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState('');
  const {register, handleSubmit, reset, errors} = useForm();

  const [inventoryItems, setInventoryItems] = useState<string[]>([]);
  const [statusItems, setStatusItems] = useState<StatusItems[]>([]);
  const [skillsItems, setSkillsItems] = useState<SkillItems[]>([]);
  const [limitPoints, setLimitPoints] = useState<number>();
  const [currentPoints, setCurrentPoints] = useState(0);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    if(charId){
      api.get(`rpgs/${params.id}/characters/${charId}`)
      .then(res => {
        const { name: charName, icon, status, skills, inventory, limitOfPoints } = res.data;

        setName(charName)
        setPreviewImage(icon);
        setInventoryItems(inventory);
        setStatusItems(status);
        setSkillsItems(skills);
        setLimitPoints(limitOfPoints);
      }) 

    } else {
      api.get(`rpgs/${params.id}/sheet`)
      .then(res => {
        if(res.data.status && res.data.skills && res.data.limitOfPoints){
          const { status, skills, limitOfPoints } = res.data;
          
          setLimitPoints(limitOfPoints);
          setStatusItems(status);
          setSkillsItems(skills);
        }
      }) 
    }       
  }, [params.id]);

  useEffect(() => {
    if(skillsItems && skillsItems.length > 0){
      const updatedPoints = skillsItems.reduce((preVal, value) => {
        if(preVal) return preVal - value.current;
      }, limitPoints)

      if(updatedPoints || updatedPoints === 0) setCurrentPoints(updatedPoints);
    }
  }, [skillsItems, limitPoints])

  useEffect(()=> {
    if(errors.name) alert.error("Insira um nome")
  }, [errors, alert])

  async function onSubmit(data:any){
    const { name } = data;
    const characterData = new FormData();

    const filteredInventory = inventoryItems.filter(inventoryItem => inventoryItem !== '');

    if(currentPoints >= 0){
      characterData.append('name', name);
      characterData.append('inventory', JSON.stringify(filteredInventory));
      characterData.append('status', JSON.stringify(statusItems));
      characterData.append('skills', JSON.stringify(skillsItems));
      characterData.append('limitOfPoints', String(limitPoints))

      if(images[0]) characterData.append('icon', images[0]);
      else characterData.append('previousIcon', previewImage);

      if(charId){
        await api.put(`rpgs/${params.id}/characters/${charId}`, characterData)
        .then(res => {
          alert.success(res.data.message);

        }).catch(error => {
          if(!error.response) alert.error("Impossível conectar ao servidor!");
          else alert.error(error.response.data);
        }) 
      } else {
        await api.post(`rpgs/${params.id}/characters`, characterData)
        .then(res => {
          alert.success(res.data.message);
          
          reset({something: ''});
          setPreviewImage('');
          setInventoryItems([]);
          setName('');
  
          api.get(`rpgs/${params.id}/sheet`)
          .then(res => {
            if(res.data.status && res.data.skills && res.data.limitOfPoints){
              const { status, skills, limitOfPoints } = res.data;
              
              setLimitPoints(limitOfPoints);
              setStatusItems(status);
              setSkillsItems(skills);
            }
          }) 
        }).catch(error => {
          console.error(error)
          if(!error.response) alert.error("Impossível conectar ao servidor!");
          else alert.error(error.response.data);
        }) 
      }
    }
    else {
      alert.error('Você ultrapassou o valor mínimo de pontos!')
    }
  }

  function setInventoryItemValue(position: number,  value: string){
    const updatedInventoryItems = inventoryItems.map((inventoryItem, index) => {
      if(index === position)
        return value;
      
      return inventoryItem;
    })

    setInventoryItems(updatedInventoryItems);
  }

  function setStatusItemValue(position: number, field: string, value: string){
    const updatedStatusItems = statusItems.map((statusItems, index) => {
      if(index === position){
        if(field === 'current' || field === 'limit') return {...statusItems, [field]: Number(value)};

        return {...statusItems, [field]: value};
      }

      return statusItems;
    })

    setStatusItems(updatedStatusItems);
  }

  function setSkillsItemValue(position: number, field: string, value: string){
    const updatedSkillsItems = skillsItems.map((skillsItems, index) => {

      if(index === position){
        if(field === 'current' || field === 'limit') return {...skillsItems, [field]: Number(value)};

        return {...skillsItems, [field]: value};
      }

      return skillsItems;
    })

    setSkillsItems(updatedSkillsItems);
  }

  function addInventoryItem(){
    const new_item = '';
    setInventoryItems([...inventoryItems, new_item]);
  }

  function removeInventoryItem(position: number){
    const updatedInventoryItems = inventoryItems.filter((inventoryItems, index) => {
      return position !== index;
    })

    setInventoryItems(updatedInventoryItems);
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

  async function deleteCharacter(){
    api.delete(`rpgs/${params.id}/characters/${charId}`)
    .then(res => {
      history.push(`/rpgs/${params.id}`);
    }).catch(error => {
      if(!error.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(error.response.data.message);
    })
  }

  return(
    <>
    <AccountModal />

    {/* The Delete Modal */}
    <div className="modal" style={{display: openDeleteModal ? 'block' : 'none'}}>
      <div className="modalContent">
        <h2>Deletar Personagem</h2>

        <p>Você tem certeza que quer deletar esta personagem?</p>

        <div className="buttons">
          <button type='button' onClick={() => setOpenDeleteModal(false)}>Cancelar</button>
          <button type='button' onClick={deleteCharacter}>Deletar</button>
        </div>
      </div>
    </div>

    <Layout linkBack={`/rpgs/${params.id}`}>
      <div className={styles.header}>
        <h1 className='title'>Ficha do Personagem</h1>

        {(() => {
          if(charId) {
            return(
              <div className={styles.options}>
                <button onClick={handleOpenAccountModal} className='buttonWithoutBG'>Vincular com uma conta</button>
              </div>
            )
          }
        })()}
      </div>

      <div className={styles.body}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.column1}>
            <div className={styles.name}>
              <div className={styles.previewImage}>
                <div className={styles.image}>
                  <img src={previewImage} alt=''/>
                </div>

                <label htmlFor='image'>Mudar foto</label>
                <input onChange={handleSelectedImage} type='file' id='image'/>
              </div>

              <InputLabel 
                className={styles.input} 
                value={name}
                name='name' 
                label='Nome'
                inputRef={register({required: true})}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <Block name="Status" id={styles.status}>
              {statusItems.map((status, index) => {
                return(
                  <StatusItem
                    key={index}
                    edit={true}
                    name={status.name} 
                    color={status.color}  
                    current={status.current}  
                    limit={status.limit} 
                    index={index}
                    setStatusItemValue={setStatusItemValue}
                  />
                )
              })}
            </Block>

            <Block name="Inventário" id={styles.inventory} options={
              <button type='button' onClick={addInventoryItem} className='buttonWithoutBG'>+ Novo Item</button>
            }>
              {inventoryItems.map((inventoryItem, index) => {
                return(
                  <div key={index} className={styles.inventoryItem}>
                    <InventoryItem 
                      value={inventoryItem} 
                      onChange={e => setInventoryItemValue(index, e.target.value)} 
                      onClick={() => removeInventoryItem(index)}
                    />

                    <button type='button' onClick={() => removeInventoryItem(index)}><img src={remove} alt="Remover"/></button>

                  </div>
                )
              })}
            </Block>
          </div>

          <div className={styles.column2}>
            <Block 
              name="Habilidades" 
              id={styles.skills} 
              className={classnames({[styles.edit]: charId})} 
              options={
                <div className={styles.pointsOptions}>
                  <div className={styles.points}>
                    <p>Limite de pontos:</p>
                    <InputLine
                      value={limitPoints}
                      className={styles.inputPoints}
                      onChange={e => setLimitPoints(Number(e.target.value))}
                    />
                  </div>
                  <p className={styles.points}>Quantidade de pontos disponíveis: {currentPoints}</p>
                </div>
              }
              breakHeader={true}
            >
              {skillsItems.map((skillsItem, index) => {
                return(
                  <SkillsItems 
                    key={index}
                    value={skillsItem.current} 
                    name={skillsItem.name} 
                    limit={skillsItem.limit}
                    onChange={e => setSkillsItemValue(index, 'current', e.target.value)}
                  />
                );
              })}
            </Block>

            {(() => {
              if(charId){
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
              className={styles.buttonCreate} 
              text={charId ? 'Salvar' : 'Criar'} 
            />
          </div>
        </form>
      </div>
    </Layout>
    </>
  );
}