import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAlert } from 'react-alert';
import classnames from 'classnames';
import api from '../../services/api';

import styles from '../../styles/components/modals/PermissionsModal.module.css';

import { RpgContext } from '../../contexts/RpgHomeContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Modal } from './Modal';
import { Button } from '../Button';

import trash from '../../assets/icons/trash.svg';

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
  const { getToken } = useContext(AuthContext);
  const token = getToken();
  const alert = useAlert();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    api.get(`rpgs/${params.id}/permissions`, {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then(res => {
      const permissionsRes = res.data;
      const filteredPermissions = permissionsRes.filter((this_permission: Permission) => !this_permission.permission);
      setPermissions(filteredPermissions)

    }).catch(err => {
      if(!err.response) alert.error("Impossível conectar ao servidor!");
      else if(err.response.status !== 404) alert.error(err.response.data.message);
    })

    if(permissions.length > 0) newPermissions(true);
  }, [params.id, acceptPermission]);

  useEffect(() => {
    newPermissions(false);
  }, [openModals[4]])

  async function denyPermission(id: number){
    api.delete(`rpgs/${params.id}/permissions/${id}`, {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then(res => {
      alert.success(res.data.message)
    }).catch(err => {
      if(!err.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(err.response.data.message);
    })
  }

  async function acceptPermission(id: number){
    api.put(`rpgs/${params.id}/permissions/${id}`, null, {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then(res => {
      alert.success(res.data.message)
    }).catch(err => {
      if(!err.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(err.response.data.message);
    })
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