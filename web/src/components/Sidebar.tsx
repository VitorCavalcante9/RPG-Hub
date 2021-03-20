import React, { useState } from 'react';

import styles from '../styles/components/Sidebar.module.css';

import more from '../assets/icons/more.svg';
import home from '../assets/icons/home.svg';
import user from '../assets/icons/user.svg';
import moon from '../assets/icons/moon.svg';

export function Sidebar(){
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapsed = () =>{
    const new_value = isCollapsed ? false : true;
    setIsCollapsed(new_value);
  }

  const collapsedStyle = {
    display: isCollapsed ? 'none' : ''
  }

  return(
    <div className={styles.sidebarContainer} style={{
      width: isCollapsed ? '' : '100vw',
      height: isCollapsed ? '' : '100vh',
    }}>
      <div className={styles.headBar}>
        <div className={styles.moreIcon} onClick={toggleCollapsed}>
          <img src={more} alt="Mostrar"/>
        </div>
        <div className={styles.iconAccount}>
          <img src="" alt="Ícone da conta" />
        </div>   
      </div>

      <div className={styles.collapsedMenu} style={{
        width: isCollapsed ? '7.5rem' : '',
        display: isCollapsed ? '' : 'flex',
        transform: isCollapsed ? '' : 'translateX(0)'
      }}>
        <div>
          <div className={styles.moreIcon} onClick={toggleCollapsed}>
            <img src={more} alt="Mostrar"/>
          </div>
          <div className={styles.iconAccount}>
            <img src="" alt="Ícone da conta" />

            <div className={styles.account} style={collapsedStyle}>
              <p>Nome</p>
              <a href="#">Sair</a>
            </div>
          </div>          
        </div>

        <div className={styles.iconsMenu}>
          <div className={styles.icon}>
            <a href="#">
              <img className={styles.home} src={home} alt="Home" />
              <p style={collapsedStyle}>Home</p>
            </a>
          </div>
          <div className={styles.icon}>
            <a href="#">
              <img src={user} alt="Conta" />
              <p style={collapsedStyle}>Conta</p>
            </a>
          </div>          
        </div>

        <div className={styles.iconsMenu}>
          <a href="#" className={styles.icon}>
            <img src={moon} alt="Tema" />
            <p style={collapsedStyle}>Tema</p>
          </a>
        </div>
      </div>

      <div className={styles.overlay} style={{
        display: isCollapsed ? 'none' : 'block'
      }} onClick={toggleCollapsed}></div>
      
    </div>
  );
}