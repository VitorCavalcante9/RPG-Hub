import React, { useContext, useState } from 'react';

import styles from '../../styles/components/modals/AccountModal.module.css';

import { RpgContext } from '../../contexts/RpgHomeContext';
import { Modal } from './Modal';
import { Button } from '../Button';

interface Account{
  id: string;
  name: string;
}

export function AccountModal(){
  const {openAccountModal} = useContext(RpgContext);
  const [accounts, setAccounts] = useState<Account[]>([{id:'1', name: 'tchola'}, {id:'2', name: 'bah'}]);
  const [account, setAccount] = useState<Account>();

  function selectAccount(this_account: Account){
    setAccount(this_account);
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
                style={{backgroundColor: this_account == account ? '#501B1D' : 'transparent' }}>
                <p>{this_account.name}</p>
              </div>
            )
          })}
        </div>

        <div className={styles.name}><p>Nome: {account?.name}</p></div>

        <Button text="Salvar" />
      </div>
    </Modal>
  );
}