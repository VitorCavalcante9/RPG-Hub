import React, { useContext, useState } from 'react';
import { Modal } from './Modal';

import styles from '../../styles/components/modals/DiceModal.module.css';

import { RpgContext } from '../../contexts/RpgHomeContext';
import { Button } from '../Button';
import { Block } from '../Block';
import { InputLine } from '../InputLine';

import arrow from '../../assets/icons/arrow-item.svg';
import remove from '../../assets/icons/cancel.svg';

export function DiceModal(){
  const {openModals} = useContext(RpgContext);
  const [dices, setDices] = useState<String[]>([]);
  const [dice, setDice] = useState({quantity: '', value: ''});

  function setDiceItemValue(field: string, value: string){
    console.log(dice)
    setDice({...dice, [field]: value});
  }

  function addDice(){
    const newDice = dice.quantity + ' d ' + dice.value;
    setDices([...dices, newDice]);
  }

  function removeDice(position: number){
    const updatedDiceItems = dices.filter((diceItems, index) => {
      return position !== index;
    })

    setDices(updatedDiceItems);
  }

  return(
    <Modal open={openModals[2]} title="Padrão de Dados">
      <div className={styles.content}>
        <p>Coloque os dados que serão usados no RPG. Por exemplo: 1d100, 1d20</p> 

        <Block className={styles.block} name='Dado:' options={
          <div className={styles.diceOptions}>
            <InputLine onChange={e => setDiceItemValue('quantity', e.target.value)} />
            <span> d </span>
            <InputLine onChange={e => setDiceItemValue('value', e.target.value)} />

            <button onClick={addDice} type='button'>+</button>
          </div>
        }>
          {dices.map((diceItem, index) => {
            return(
              <div key={index} className={styles.diceItem}>
                <img src={arrow} />
                <p>{diceItem}</p>
                <button onClick={() => removeDice(index)}>
                  <img src={remove} alt="Remover"/>
                </button>
              </div>
            )
          })}
        </Block>
        <Button text="Salvar" className={styles.buttonSave} />
      </div>
    </Modal>
  );
}