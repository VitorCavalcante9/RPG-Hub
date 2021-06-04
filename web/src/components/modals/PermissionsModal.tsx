/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAlert } from 'react-alert';
import api from '../../services/api';

import styles from '../../styles/components/modals/PermissionsModal.module.css';

import { RpgContext } from '../../contexts/RpgHomeContext';
import { Modal } from './Modal';
import { Button } from '../Button';

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

interface RpgParams{
  id: string;
}

interface PermissionsModalProps{
  newPermissions: (exists: boolean) => void;
}

export function PermissionsModal({newPermissions}: PermissionsModalProps){
  const params = useParams<RpgParams>();

  const {openModals, handleOpenModals} = useContext(RpgContext);
  const alert = useAlert();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    if(openModals[4]) reloadPermissions();
  }, [openModals[4]]);

  useEffect(() => {
    if(permissions.length === 0) newPermissions(false)
    else newPermissions(true);
  }, [permissions]);

  function reloadPermissions(){
    api.get(`rpgs/${params.id}/permissions`)
    .then(res => {
      const permissionsRes = res.data;
      const filteredPermissions = permissionsRes.filter((this_permission: Permission) => !this_permission.permission);
      setPermissions(filteredPermissions)

    }).catch(err => {
      if(!err.response) alert.error("Impossível conectar ao servidor!");
      else if(err.response.status !== 404) alert.error(err.response.data.message);
    });
  }

  async function denyPermission(id: number){
    api.delete(`rpgs/${params.id}/permissions/${id}`)
    .then(res => {
      alert.success(res.data.message);
      reloadPermissions();
    }).catch(err => {
      if(!err.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(err.response.data.message);
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function acceptPermission(id: number){
    api.put(`rpgs/${params.id}/permissions/${id}`, null)
    .then(res => {
      alert.success(res.data.message);
      reloadPermissions();
    }).catch(err => {
      if(!err.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(err.response.data.message);
    });
  }

  return(
    <Modal open={openModals[4]} title="Permissões Solicitadas">
      <div className={styles.content}>
        <div className={styles.blockList}>
          {permissions.map(permission => {
            return(
              <div key={permission.id} className={styles.permissionItem}>
                <p>
                  {permission.user.username} está solicitando permissão para alterar as habilidades da personagem {permission.character.name}.
                  Deseja conceder ou negar?
                </p>

                <div className={styles.buttonsContainer}>
                  <Button onClick={() => denyPermission(permission.id)} className={styles.buttons} text="Negar"/>
                  <Button onClick={() => acceptPermission(permission.id)} className={styles.buttons} id={styles.acceptButton} text="Conceder"/>
                </div>
              </div>
            )
          })}
        </div>

        <Button onClick={() => handleOpenModals(4)} text="Fechar" />
      </div>
    </Modal>
  );
}