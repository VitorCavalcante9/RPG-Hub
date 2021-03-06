/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import api from '../services/api';
import classnames from 'classnames';

import { Layout } from '../components/Layout';

import styles from '../styles/pages/Home.module.css';
import { InputLabel } from '../components/InputLabel';
import { RpgContext } from '../contexts/RpgHomeContext';

interface RPG{
  id: string;
  name: string;
  icon: string;
}

export function Home(){
  const [rpgs, setRpgs] = useState<RPG[]>([]);
  const [rpgsParticipant, setRpgsParticipant] = useState<RPG[]>([]);
  const { cleanRPG } = useContext(RpgContext);

  const {register, handleSubmit, reset, errors} = useForm();
  const history = useHistory();
  const alert = useAlert();
  const [openEnterRPGModal, setOpenEnterRPGModal] = useState(false);

  useEffect(() => {
    api.get('home')
    .then(res => {
      const {rpgs: your_rpgs, participating_rpgs} = res.data;

      const rpg_ids = your_rpgs.map((rpg: RPG) =>{return rpg.id});
      const participant_rpg_ids = participating_rpgs.map((rpg: RPG) =>{return rpg.id});

      const rpgs = {
        rpgs: rpg_ids ? rpg_ids : [],
        participating_rpgs: participant_rpg_ids ? participant_rpg_ids : []
      }

      localStorage.setItem('rpgs', JSON.stringify(rpgs));

      setRpgs(your_rpgs);
      setRpgsParticipant(participating_rpgs);
    })

    cleanRPG();
  }, []);

  useEffect(()=> {
    if(errors.rpg_id) alert.error("Insira o código")
  }, [errors, alert]);

  const enterInRPG = async(data:any) => {
    await api.post('invite', data)
    .then(res => {
      alert.success(res.data.message);
      const { rpg_id } = data;      
      reset({something: ''});
      history.push(`/rpgs/${rpg_id}`)
    }).catch(error => {
      if(!error.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(error.response.data.message);
    })
  }
  
  return(
    <>
    {/* The EnterRPG Modal */}
    <div className="modal" style={{display: openEnterRPGModal ? 'block' : 'none'}}>
      <div className={`${styles.modalContent} modalContent`}>
        <h2>Entrar em um RPG</h2>

        <form onSubmit={handleSubmit(enterInRPG)}>
          <InputLabel 
            name='rpg_id' 
            type='text'
            label='Insira o código do RPG:' 
            inputRef={register({required: true})}
          />

          <button className={styles.buttons} type='submit'>Entrar</button>
        </form>

        <button 
          className={styles.buttons} 
          type='button' 
          onClick={() => {
            setOpenEnterRPGModal(false); 
            reset({something: ''});
          }}
        >Cancelar</button> 
      </div>
    </div>
    
    <Layout withoutBackButton={true}>
      <div className={styles.contentContainer}>
        <div className={styles.text}>
          <h1>Seus RPGs</h1>
          <Link to='/rpgs'><button className='buttonWithoutBG'>+ Criar novo RPG</button></Link>
        </div>
        <div className={styles.elementsList}>          
          {rpgs.map(rpg => {
            return(
              <Link key={rpg.id} to={`/rpgs/${rpg.id}`} className={styles.rpgItem}>
                <div className={styles.icon}>
                  <img className={classnames('image', {'collapsedStyle': !rpg.icon})} src={rpg.icon} alt={rpg.name}/>
                </div>

                <p>{rpg.name}</p>
              </Link>
            )
          })}
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.text}>
          <h1>RPGs que você entrou</h1>
          <button className='buttonWithoutBG' onClick={() => setOpenEnterRPGModal(true)}>+ Entrar em um RPG</button>
        </div>
        <div className={styles.elementsList}>
          {rpgsParticipant.map(rpg => {
            return(
              <Link key={rpg.id} to={`/rpgs/${rpg.id}`} className={styles.rpgItem}>
                <div className={styles.icon}>
                  <img className={classnames('image', {'collapsedStyle': !rpg.icon})} src={rpg.icon} alt={rpg.name}/>
                </div>

                <p>{rpg.name}</p>
              </Link>
            )
          })}
        </div>
      </div>
      
    </Layout>
  
    </>
  );
}