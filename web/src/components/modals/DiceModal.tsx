import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAlert } from 'react-alert';
import api from '../../services/api';
import { Modal } from './Modal';

import styles from '../../styles/components/modals/DiceModal.module.css';

import { RpgContext } from '../../contexts/RpgHomeContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Button } from '../Button';
import { Block } from '../Block';
import { InputLine } from '../InputLine';

import arrow from '../../assets/icons/arrow-item.svg';
import remove from '../../assets/icons/cancel.svg';

interface RpgParams{
  id: string;
}

export function DiceModal(){
  const params = useParams<RpgParams>();
  const alert = useAlert();
  const { getToken } = useContext(AuthContext);
  const token = getToken();

  const {openModals} = useContext(RpgContext);
  const [dices, setDices] = useState<String[]>([]);
  const [dice, setDice] = useState({quantity: '', value: ''});

  useEffect(() => {
    api.get(`rpgs/${params.id}/dices`, {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then(res => {
      if(res.data){
        setDices(res.data);
      }
    })    
  }, [params.id])

  function setDiceItemValue(field: string, value: string){
    setDice({...dice, [field]: value});
  }

  function addDice(){
    const newDice = dice.quantity + ' d ' + dice.value;
    setDices([...dices, newDice]);
    setDice(({quantity: '', value: ''}));
  }

  function removeDice(position: number){
    const updatedDiceItems = dices.filter((diceItems, index) => {
      return position !== index;
    })

    setDices(updatedDiceItems);
  }

  async function saveDices(){
    if(dices.length !== 0){
      const dicesData = {
        dices
      }
      await api.patch(`rpgs/${params.id}/dices`, dicesData, {
        headers: { 'Authorization': `Bearer ${token}`}
      }).then(res => {
        alert.success('Padrão de Dados atualizado com sucesso')
      }).catch(err => alert.error(err.response.data.message));
    } else {
      alert.error('Insira algum tipo de dado')
    }
  }

  return(
    <Modal open={openModals[2]} title="Padrão de Dados">
      <div className={styles.content}>
        <p>Coloque os dados que serão usados no RPG. Por exemplo: 1d100, 1d20</p> 

        <Block className={styles.block} name='Dado:' options={
          <div className={styles.diceOptions}>
            <InputLine minValue={1} value={dice.quantity} onChange={e => setDiceItemValue('quantity', e.target.value)} />
            <span> d </span>
            <InputLine value={dice.value} onChange={e => setDiceItemValue('value', e.target.value)} />

            <button onClick={addDice} type='button'>+</button>
          </div>
        }>
          {dices.map((diceItem, index) => {
            return(
              <div key={index} className={styles.diceItem}>
                <img src={arrow} alt=''/>
                <p>{diceItem}</p>
                <button onClick={() => removeDice(index)}>
                  <img src={remove} alt="Remover"/>
                </button>
              </div>
            )
          })}
        </Block>
        <Button onClick={saveDices} text="Salvar" className={styles.buttonSave} />
      </div>
    </Modal>
  );
}