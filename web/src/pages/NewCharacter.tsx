import React, { ChangeEvent, useContext, useState } from 'react';
import { Block } from '../components/Block';
import { Button } from '../components/Button';
import { InputLabel } from '../components/InputLabel';
import { InventoryItem } from '../components/characterItems/InventoryItem';
import { Layout } from '../components/Layout';
import { StatusItem } from '../components/characterItems/StatusItem';

import styles from '../styles/pages/NewCharacter.module.css';

import remove from '../assets/icons/cancel.svg';
import { SkillsItems } from '../components/characterItems/SkillsItem';
import { AccountModal } from '../components/modals/AccountModal';
import { RpgContext } from '../contexts/RpgHomeContext';
import { useParams } from 'react-router';

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
  const {handleOpenAccountModal} = useContext(RpgContext);
  const [image, setImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [inventoryItems, setInventoryItems] = useState<string[]>([]);
  const [skillsItems, setSkillsItems] = useState<SkillItems[]>([{name: 'Força', current: 0, limit: 100}, {name: 'Destreza', current: 0, limit: 100}]);

  function setInventoryItemValue(position: number,  value: string){
    const updatedInventoryItems = inventoryItems.map((inventoryItem, index) => {
      if(index === position)
        return value;
      
      return inventoryItem;
    })

    setInventoryItems(updatedInventoryItems);
  }

  function setSkillsItemValue(position: number, field: string, value: string){
    const updatedSkillsItems = skillsItems.map((skillsItems, index) => {
      if(index === position){
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
    setImage(selectedImages[0]);

    const selectImagePreview = URL.createObjectURL(selectedImages[0]);
    setPreviewImage(selectImagePreview);
  }

  return(
    <>
    <AccountModal />

    <Layout linkBack={`/rpgs/${params.id}`}>
      <div className={styles.header}>
        <h1>Ficha do Personagem</h1>

        <div className={styles.options}>
          <button onClick={handleOpenAccountModal} className="buttonWithoutBG">Vincular com uma conta</button>
        </div>
      </div>

      <div className={styles.body}>
        <form>
          <div className={styles.column1}>
            <div className={styles.name}>
              <div className={styles.previewImage}>
                <div className={styles.image}>
                  <img src={previewImage} alt="Prévia da Imagem"/>
                </div>

                <label htmlFor="image">Mudar foto</label>
                <input onChange={handleSelectedImage} type="file" id="image"/>
              </div>

              <InputLabel className={styles.input} name='name' label='Nome' />
            </div>

            <Block name="Status" id={styles.status}>
              <StatusItem name="Vida" color="#CC0000" current={100} limit={100}/>
              <StatusItem name="Sanidade" color="#333180" current={100} limit={100}/>
            </Block>

            <Block name="Inventário" id={styles.inventory} options={
              <button type='button' onClick={addInventoryItem} className='buttonWithoutBG'>+ Novo Item</button>
            }>
              {inventoryItems.map((inventoryItem, index) => {
                return(
                  <div className={styles.inventoryItem}>
                    <InventoryItem 
                      key={index} 
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
            <Block name="Habilidades" id={styles.skills} options={
              <p className={styles.points}>Quantidade de pontos disponíveis: 2000</p>
            }>
              {skillsItems.map((skillsItem, index) => {
                return(
                  <SkillsItems 
                    value={skillsItem.current} 
                    name={skillsItem.name} 
                    limit={skillsItem.limit}
                    onChange={e => setSkillsItemValue(index, 'current', e.target.value)}
                  />
                );
              })}
            </Block>

            <Button type='submit' className={styles.buttonCreate} text="Criar" />
          </div>
        </form>
      </div>
    </Layout>
    </>
  );
}