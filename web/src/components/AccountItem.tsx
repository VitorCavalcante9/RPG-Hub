import React from 'react';
import classnames from 'classnames';

import styles from '../styles/components/AccountItem.module.css';

interface AccountItemProps{
  name: string;
  status?: boolean; 
}

export function AccountItem({name, status}: AccountItemProps){
  const online = status ? 'Online' : 'Offline';

  return(
    <div className={styles.accountItem}>
      <p>{name}</p>
      <div className={styles.status}>
        <div className={classnames(styles.circle, {[styles.online]: status})}></div>
        <p>{online}</p>
      </div>
    </div>
  );
}