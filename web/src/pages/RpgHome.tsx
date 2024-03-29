/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import api from '../services/api';
import manager from '../services/websocket';
import classnames from 'classnames';

import { RpgContext } from '../contexts/RpgHomeContext';

import { Block } from '../components/Block';
import { Button } from '../components/Button';
import { ButtonSession } from '../components/ButtonSession';
import { IconElement } from '../components/IconElement';
import { Layout } from '../components/Layout';
import { NotesModal } from '../components/modals/NotesModal';
import { InviteModal } from '../components/modals/InviteModal';
import { ObjectModal } from '../components/modals/ObjectModal';
import { PermissionsModal } from '../components/modals/PermissionsModal';

import styles from '../styles/pages/RpgHome.module.css';

import edit from '../assets/icons/edit.svg';
import trash from '../assets/icons/trash.svg';
import { AccountItem } from '../components/AccountItem';

interface RpgParams{
  id: string;
}

interface RPG{
  name: string;
  icon: string;
  characters: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  scenarios: Array<{
    id: number;
    name: string;
    image: string;
  }>;
  objects: Array<{
    id: number;
    name: string;
    image: string;
  }>;
  participants: Array<{
    id: string;
    name: string;
  }>
}

interface User{
  id: string;
  username: string;
  icon?: string;
  online?: boolean;
}

interface Permission{
  id: number;
  permission: boolean | null;
  user: {
    id: string;
    username: string;
  };
  character: {
    id: string;
    name: string;
  }
}

export function RpgHome(){
  const params = useParams<RpgParams>();
  const alert = useAlert();
  const history = useHistory();
  const { handleOpenModals } = useContext(RpgContext);
  const [rpg, setRpg] = useState<RPG>({name: '', icon: '', characters: [], scenarios: [], objects: [], participants: []});
  const [newPermissions, setNewPermissions] = useState(false);
  const [participantsStatus, setParticipantsStatus] = useState<User[]>([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const socket = manager.socket('/rpgHome');

  useEffect(() => {
    reloadPermissions();
  }, []);

  useEffect(() => {
    reloadRpgData(true);
  }, [params.id, handleOpenModals]);

  useEffect(() => {
    if(rpg.participants.length > 0){
      socket.on('users', (users: any) => {
        const updateParticipants = participantsStatus.map(participant => {
          const index = users.indexOf(participant.id);
          if(index !== -1){
            return {...participant, 'online': true};
          }

          return {...participant, 'online': false}
        })

        setParticipantsStatus(updateParticipants);
      })
    }
    
  }, [rpg.participants]);

  async function reloadRpgData(load: boolean){
    api.get(`rpgs/${params.id}`)
    .then(res => {
      if(res.data.participants) {
        setParticipantsStatus(res.data.participants);
      }
      setRpg(res.data);
      if(load) socket.emit('update_users');
    });   
  }

  async function deleteObject(){
    const search = window.location.search;
    const searchContent = new URLSearchParams(search);
    const objectId = searchContent.get('o');
    api.delete(`rpgs/${params.id}/objects/${objectId}`)
    .then(res =>  { 
      history.push(`/rpgs/${params.id}`);
      reloadRpgData(false);
    }).catch(error => {
      if(!error.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(error.response.data.message);
    })
  }

  function existsNewPermissions(exists: boolean){
    if(exists) setNewPermissions(true);
    else setNewPermissions(false);
  }

  async function reloadPermissions(){
    api.get(`rpgs/${params.id}/permissions`)
    .then(res => {
      const permissionsRes = res.data;
      const filteredPermissions = permissionsRes.filter((this_permission: Permission) => !this_permission.permission);
      if(filteredPermissions.length > 0) setNewPermissions(true)
      else setNewPermissions(false);

    }).catch(err => {
      if(!err.response) alert.error("Impossível conectar ao servidor!");
      else if(err.response.status !== 404) alert.error(err.response.data.message);
    });
  }

  function openSession(){
    const socketSession = manager.socket('/session');
    socketSession.open();

    socketSession.emit('join_room', { room: params.id });
    history.push(`/rpgs/${params.id}/session`);
  }

  return(
    <>
      <InviteModal />
      <ObjectModal />
      <NotesModal />
      <PermissionsModal newPermissions={existsNewPermissions} />

      {/* The Delete Modal */}
      <div className="modal" style={{display: openDeleteModal ? 'block' : 'none'}}>
        <div className="modalContent">
          <h2>Deletar Objeto</h2>

          <p>Você tem certeza que quer deletar este objeto?</p>

          <div className="buttons">
            <button type='button' onClick={() => {setOpenDeleteModal(false); history.push(`/rpgs/${params.id}`)}}>Cancelar</button>
            <button type='button' onClick={() => {deleteObject(); setOpenDeleteModal(false)}}>Deletar</button>
          </div>
        </div>
      </div>

      <Layout linkBack='/home'>
        <div className={styles.rpgHomeContainer}>
          <div className={styles.header}>
            <IconElement 
              image={rpg.icon} 
              alt={rpg.name}
              row={true} 
              text={rpg.name}
              imgSize='7rem'
              textSize='2.2rem'
            />

            <div className={styles.options}>
              <div className={styles.permission}>
                <button onClick={() => handleOpenModals(4)} className='buttonWithoutBG'>Ver Permissões</button>
                <div className={classnames(styles.newPermission, {[styles.displayNone]: !newPermissions})}></div>
              </div>

              <button onClick={() => handleOpenModals(0)} className='buttonWithoutBG'>Convidar Pessoas</button>

              <button className='buttonWithoutBG'><Link to={`/rpgs/?r=${params.id}`}>Editar</Link></button>
            </div>
          </div>

          <div className={styles.body}>
            <Block id={styles.char} className={`${styles.grid1} ${styles.blocks}`} name='Personagens' options={
              <Link to={`/rpgs/${params.id}/character`}><button className='buttonWithoutBG'>+ Novo</button></Link>
            }>
              {rpg.characters.map(character => {
                return(
                  <div key={character.id} className={styles.characterItem}>
                    <div className={styles.iconContainer}>
                      <div className={styles.image}>
                        <img className={classnames({'collapsedStyle': !character.icon})} src={character.icon} alt={character.name} />
                      </div>
                      <p>{character.name}</p>
                    </div>
                    
                    <button type='button'>
                      <Link to={`/rpgs/${params.id}/character/?c=${character.id}`}>
                        <img src={edit} alt="Editar Personagem"/>
                      </Link>
                    </button>
                  </div>
                )
              })}
            </Block>

            <Block id={styles.scenario} className={`${styles.grid2} ${styles.blocks}`} name='Cenários' options={
              <Link to={`/rpgs/${params.id}/scenario`}><button className='buttonWithoutBG'>+ Novo</button></Link>
            }>
              {rpg.scenarios.map(scenario => {
                return(
                  <div key={scenario.id} className={styles.scenarioItem}>
                    <div className={styles.image}>
                      <img className={classnames({'collapsedStyle': !scenario.image})} src={scenario.image} alt={scenario.name}/>
                    </div>
                    <div className={styles.name}>
                      <p>{scenario.name}</p>
                      <button type='button'>
                        <Link to={`/rpgs/${params.id}/scenario/?s=${scenario.id}`}>
                          <img src={edit} alt="Editar Cenário"/>
                        </Link>
                      </button>
                    </div>
                  </div>
                )
              })}
            </Block>

            <Block id={styles.object} className={`${styles.grid2} ${styles.blocks}`} name='Objetos' options={
              <button onClick={() => handleOpenModals(1)} className='buttonWithoutBG'>+ Novo</button>
            }>
              {rpg.objects.map(object => {
                return(
                  <div key={object.id} className={styles.objectItem}>
                    <div className={styles.iconContainer}>
                      <div className={styles.image}>
                        <img className={classnames({'collapsedStyle': !object.image })} src={object.image} alt={object.name} />
                      </div>
                      <p>{object.name}</p>
                    </div>
                    
                    <button type='button' onClick={() => handleOpenModals(1)}>
                      <Link to={`/rpgs/${params.id}/?o=${object.id}`}>
                        <img src={edit} alt="Editar Item"/>
                      </Link>
                    </button>

                    <button type='button' onClick={() => setOpenDeleteModal(true)}>
                      <Link to={`/rpgs/${params.id}/?o=${object.id}`}>
                        <img src={trash} alt="Excluir Item"/>
                      </Link>
                    </button>
                  </div>
                )
              })}
            </Block>

            <Block id={styles.account} className={`${styles.grid3} ${styles.blocks}`} name='Contas' center={true}>
              {participantsStatus.map(participant => {
                if(participant.online){
                  return(
                    <AccountItem key={participant.id} name={participant.username} status={participant.online} icon={participant.icon} />
                  )
                }
              })
              }
              {participantsStatus.map(participant => {
                if(!participant.online){
                  return(
                    <AccountItem key={participant.id} name={participant.username} status={participant.online} icon={participant.icon} />
                  )
                }
              })}
            </Block>

            <Link to={`/rpgs/${params.id}/sheet`}><Button className={`${styles.grid1} ${styles.buttons}`} text='Padrão de ficha' /></Link>
            <Button className={`${styles.grid2} ${styles.buttons}`} onClick={() => handleOpenModals(2)} text='Ver notas' />

            <ButtonSession onClick={openSession} id={styles.session} className={`${styles.grid3} ${styles.buttons}`} />
          </div>
        </div>
      </Layout>
    </>
  );
}