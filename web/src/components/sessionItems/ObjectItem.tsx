/* eslint-disable react-hooks/exhaustive-deps */
import React, { HTMLAttributes, useContext, useEffect, useState } from 'react';
import { SessionContext } from '../../contexts/SessionContext';

import styles from '../../styles/components/sessionItems/ObjectItem.module.css';

interface ObjectItemInterface{
  id: string;
  name: string;
  image?: string;
}

interface ObjectItemProps extends HTMLAttributes<HTMLDivElement>{
  object: ObjectItemInterface;
}

export function ObjectItem({object}: ObjectItemProps){
  const {toggleFixObject, fixedObject} = useContext(SessionContext);

  const [textButton, setTextButton] = useState('Fixar');

  useEffect(() => {
    if(fixedObject === object) setTextButton('Desafixar');
  }, [])

  useEffect(() => {
    if(fixedObject !== object) setTextButton('Fixar');
  }, [fixedObject])

  function toggleTextButton(){
    if(textButton === 'Fixar'){
      setTextButton('Desafixar');
      toggleFixObject(object)
    }
    else{
      setTextButton('Fixar');
      toggleFixObject(null)
    }
  }

  return(
    <div className={styles.objectContainer}>
      <div className={styles.image}>
        <img src={object.image} alt={object.name}/>
      </div>

      <div className={styles.name}>
        <p>{object.name}</p>

        <button className='fixButton' onClick={toggleTextButton} type='button'>{textButton}</button>
      </div>
    </div>
  )
}