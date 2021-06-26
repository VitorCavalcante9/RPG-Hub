/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

import styles from '../styles/components/Sidebar.module.css';

import more from '../assets/icons/more.svg';
import home from '../assets/icons/home.svg';
import user from '../assets/icons/user.svg';
import moon from '../assets/icons/moon.svg';

interface SidebarProps{
  updateUser?: () => void;
}

export function Sidebar({ updateUser }: SidebarProps){
  const { handleLogout } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [userData, setUserData] = useState({username: '', icon: ''});

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getUser();
  }, [updateUser]);

  function getUser(){
    const user = localStorage.getItem('user');
    console.log('me chamaram')

    if(user){
      setUserData(JSON.parse(user));
    }
  }

  const toggleCollapsed = () =>{
    const new_value = isCollapsed ? false : true;
    setIsCollapsed(new_value);
  }

  return(
    <div className={classnames(styles.sidebarContainer, {[styles.collapsedSidebarContainer]: isCollapsed})}>
      <div className={styles.headBar}>
        <div className={styles.moreIcon} onClick={toggleCollapsed}>
          <img src={more} alt="Mostrar"/>
        </div>
        <div className={styles.iconAccount}>
          <div className={styles.iconContainer}>
            <img className={classnames({[styles.collapsedStyle]: (userData.icon).includes('/null')})} src={userData.icon} alt={userData.username} />
          </div>
        </div>   
      </div>

      <div className={classnames(styles.menu, {[styles.collapsedMenu]: isCollapsed})}>
        <div>
          <div className={styles.moreIcon} onClick={toggleCollapsed}>
            <img src={more} alt="Mostrar"/>
          </div>
          <div className={styles.iconAccount}>
            <div className={styles.iconContainer}>
              <img className={classnames({[styles.collapsedStyle]: (userData.icon).includes('/null')})} src={userData.icon} alt={userData.username} />
            </div>

            <div className={classnames(styles.account, {[styles.collapsedStyle]: isCollapsed})}>
              <p>{userData.username}</p>
              <a onClick={handleLogout} href="#">Sair</a>
            </div>
          </div>          
        </div>

        <div className={styles.iconsMenu}>
          <div className={styles.icon}>
            <Link to="/home">
              <img className={styles.home} src={home} alt="Home" />
              <p className={classnames({[styles.collapsedStyle]: isCollapsed})}>Home</p>
            </Link>
          </div>
          <div className={styles.icon}>
            <Link to='/account'>
              <img src={user} alt="Conta" />
              <p className={classnames({[styles.collapsedStyle]: isCollapsed})}>Conta</p>
            </Link>
          </div>          
        </div>

        <div className={styles.iconsMenu}>
          <a href="#" className={styles.icon}>
            <img src={moon} alt="Tema" />
            <p className={classnames({[styles.collapsedStyle]: isCollapsed})}>Tema</p>
          </a>
        </div>
      </div>

      <div 
        className={classnames(styles.overlay, {[styles.collapsedStyle]: isCollapsed})} 
        onClick={toggleCollapsed}
      ></div>
      
    </div>
  );
}