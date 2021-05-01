import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAlert } from 'react-alert';
import classnames from 'classnames';
import api from '../../services/api';

import styles from '../../styles/components/modals/AccountModal.module.css';

import { RpgContext } from '../../contexts/RpgHomeContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Modal } from './Modal';
import { Button } from '../Button';

import trash from '../../assets/icons/trash.svg';

interface Account{
  id: string;
  username: string;
}

interface RpgParams{
  id: string;
}

export function AccountModal(){
  const params = useParams<RpgParams>();
  const search = window.location.search;
  const searchContent = new URLSearchParams(search);
  const charId = searchContent.get('c');

  const {openAccountModal} = useContext(RpgContext);
  const { getToken } = useContext(AuthContext);
  const token = getToken();
  const alert = useAlert();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [previousAccount, setPreviousAccount] = useState<Account>();
  const [account, setAccount] = useState<Account>();

  useEffect(() => {
    api.get(`rpgs/${params.id}/characters/${charId}`, {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then(res => {
      const {user} = res.data;
      if(user.id){
        setPreviousAccount(user);
        setAccount(user);
      } else {
        setPreviousAccount({id: '', username: ''});
        setAccount({id: '', username: ''});
      }
    })

    api.get(`rpgs/${params.id}`, {
      headers: { 'Authorization': `Bearer ${token}`}
    }).then(res => {
      const {participants} = res.data;
      setAccounts(participants);
    })
  }, [openAccountModal]);

  function selectAccount(this_account: Account){
    setAccount(this_account);
  }

  async function saveAccount(){
    if(account){
      const data = {
        user_id: account.id
      }
      
      api.patch(`/rpgs/${params.id}/characters/${charId}/link_account`, data, {
        headers: { 'Authorization': `Bearer ${token}`}
      }).then(res => {
        alert.success(res.data.message);
        
        setPreviousAccount(account);
      }).catch(error => {
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })
    } else {
      alert.error('Selecione uma conta')
    }
  }

  async function unlinkAccount(){
    if(previousAccount){
      const data = {
        user_id: previousAccount.id
      }
      
      api.patch(`/rpgs/${params.id}/characters/${charId}/unlink_account`, data, {
        headers: { 'Authorization': `Bearer ${token}`}
      }).then(res => {
        alert.success(res.data.message);
        
        setPreviousAccount({id: '', username: ''});
        setAccount({id: '', username: ''});
      }).catch(error => {
        if(!error.response) alert.error("Impossível conectar ao servidor!");
        else alert.error(error.response.data.message);
      })
    } else {
      alert.error('Selecione uma conta')
    }
  }

  return(
    <Modal account={true} open={openAccountModal} title="Vincular com uma conta">
      <div className={styles.content}>
        <div className={styles.blockList}>
          {accounts.map(this_account => {
            return(
              <div 
                onClick={() => selectAccount(this_account)} 
                key={this_account.id} 
                className={styles.accountItem}
              >
                <p className={classnames({[styles.selectedAccount]: this_account.id === account?.id})}>{this_account.username}</p>
              </div>
            )
          })}
        </div>

        <div className={styles.name}>
          <p>Nome: {account?.username}</p>
          {(() => {
            if(previousAccount?.id !== '' && previousAccount === account){
              return(
                <button className={styles.delete} type='button' onClick={unlinkAccount}>
                  <img src={trash} alt="Excluir Item"/>
                </button>
              )
            }
          })()}
        </div>

        <Button onClick={saveAccount} text="Salvar" />
      </div>
    </Modal>
  );
}