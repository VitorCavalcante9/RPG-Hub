import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import logo from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { ButtonGoogle } from '../components/ButtonGoogle';
import { Input } from '../components/Input';

import styles from '../styles/pages/Login.module.css';

export function Login(){
  const [isRegistered, setIsRegistered] = useState(true);
  const {register, handleSubmit, errors} = useForm();

  const onSubmit = async(data:any) => {
    console.log(data)
  }

  const toggleForm = () =>{
    const new_value = isRegistered ? false : true;
    setIsRegistered(new_value);
  }

  return(
    <div className={styles.pageContainer}>
      <div className={styles.startContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="RPG Hub"/>
          <h2>Crie seu próprio rpg e divirta-se com seus amigos</h2>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.registerContainer}>
          {isRegistered ? (
            <>
              <h1>Login</h1>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  name="email"
                  type="email"
                  placeholder="Insira seu email"
                  maxLength={50}
                  inputRef={register({required: true})}
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Insira sua senha"
                  maxLength={100}
                  inputRef={register({required: true})}
                  style={{marginBottom: '5rem'}}
                />

                <Button type="submit" text="Entrar" />
                
                <hr/>

                <ButtonGoogle text="Logar com o Google" />
                <p onClick={toggleForm}>Não tenho conta. Fazer cadastro</p>

              </form>
            </>
          ): (
            <>
              <h1>Register</h1>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  name="username"
                  type="name"
                  placeholder="Insira seu nome"
                  maxLength={50}
                  inputRef={register({required: true})}
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Insira seu email"
                  maxLength={50}
                  inputRef={register({required: true})}
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Insira sua senha"
                  maxLength={100}
                  inputRef={register({required: true})}
                  style={{marginBottom: '5rem'}}
                />

                <Button type="submit" text="Entrar" />
                
                <hr/>

                <ButtonGoogle text="Registrar com o Google" />
                <p onClick={toggleForm}>Já tenho conta. Fazer login</p>

              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}