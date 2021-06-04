import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAlert } from 'react-alert';
import api from '../services/api';

import { Button } from '../components/Button';
import { ButtonGoogle } from '../components/ButtonGoogle';
import { Input } from '../components/Input';
import { AuthContext } from '../contexts/AuthContext';

import styles from '../styles/pages/Login.module.css';
import { useHistory } from 'react-router';

export function Login(){
  const { handleLogin } = useContext(AuthContext);
  const [isRegistered, setIsRegistered] = useState(true);
  const {register, handleSubmit, reset, errors} = useForm();
  const history = useHistory();
  const alert = useAlert();

  const onRegister = async(data:any) => {
    await api.post('users', data);

    const login = {
      email: data.email,
      password: data.password
    }

    api.post('auth', login).then((response) => {
      const { data: { token } } = response;
      handleLogin(token);
      history.push('/home');
    }).catch(error => {
      if(!error.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(error.response.data.message);
    })
  }

  const onLogin = async(data:any) => {
    api.post('auth', data).then((response) => {
      const { data: { token } } = response;
      handleLogin(token);
      history.push('/home');
    }).catch(error => {
      if(!error.response) alert.error("Impossível conectar ao servidor!");
      else alert.error(error.response.data.message);
    })
  }

  useEffect(()=> {
    if(errors.username) alert.error("Insira um nome")
    else if(errors.email) alert.error("Insira um email")
    else if(errors.password) alert.error("Insira uma senha")
  }, [errors, alert])

  const toggleForm = () =>{
    const new_value = isRegistered ? false : true;
    setIsRegistered(new_value);
    reset({something: ''});
  }

  return(
    <div className={styles.pageContainer}>
      <div className={styles.startContainer}>
        <div className={styles.logoContainer}>
          <h2>Crie seu próprio rpg e divirta-se com seus amigos</h2>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.registerContainer}>
          {isRegistered ? (
            <>
              <h1>Login</h1>

              <form onSubmit={handleSubmit(onLogin)}>
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
                  maxLength={50}
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

              <form onSubmit={handleSubmit(onRegister)}>
                <Input
                  name="username"
                  type="text"
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
                  maxLength={50}
                  inputRef={register({required: true})}
                  style={{marginBottom: '5rem'}}
                />

                <Button type="submit" text="Registrar" />
                
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