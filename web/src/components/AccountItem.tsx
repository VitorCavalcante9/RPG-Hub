import React from 'react';
import classnames from 'classnames';

import styles from '../styles/components/AccountItem.module.css';

interface AccountItemProps{
  name: string;
  icon?: string;
  status?: boolean; 
}

export function AccountItem({name, icon, status}: AccountItemProps){
  const online = status ? 'Online' : 'Offline';

  return(
    <div className={styles.accountItem}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          <img className={classnames({'collapsedStyle': !icon})} src={icon} alt={name} />
        </div>
        <p>{name}</p>
      </div>
      <div className={styles.status}>
        <div className={classnames(styles.circle, {[styles.online]: status})}></div>
        <p>{online}</p>
      </div>
    </div>
  );
}