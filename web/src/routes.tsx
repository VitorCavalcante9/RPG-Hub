import React, { useContext } from 'react';
import { BrowserRouter, Redirect, Route, RouteProps, Switch, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import api from './services/api';

import { RpgContext } from './contexts/RpgHomeContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NewCharacter } from './pages/NewCharacter';
import { NewRpg } from './pages/NewRpg';
import { NewScenario } from './pages/NewScenario';
import { RpgHome } from './pages/RpgHome';
import { RpgHomeParticipant } from './pages/RpgHomeParticipant';
import { Session } from './pages/Session';
import { SessionParticipant } from './pages/SessionParticipant';
import { SheetPattern } from './pages/SheetPattern';
import { User } from './pages/User';

function AuthRoute({...props}: RouteProps){
  const { loading, authenticated } = useContext(AuthContext);

  if(loading) return <h1>Loading...</h1>
  if (props.path === '/' && authenticated){
    return <Redirect to='/home' />
  }    
  else if(!authenticated && props.path !== '/'){
    return <Redirect to='/' />
  }
  else if(props.path !== '/' && props.path !== '/home' && props.path !== '/rpgs' && props.path !== '/account'){
    return null
  }
  
  return <Route {...props} />
}

function RpgRoute({...props}: RouteProps){
  const { loading, isAdm, verifyIfIsAdm } = useContext(RpgContext);

  <AuthRoute {...props} />
  
  const location = useLocation();
  const id = location.pathname.split('/');
  verifyIfIsAdm(id[2]);

  if(loading) return <h1>Loading...</h1>
  if(isAdm){
    if(props.path === '/rpgs/:id') return <Route component={RpgHome} {...props}/>
    else if(props.path === '/rpgs/:id/session') return <Route component={Session} {...props}/>
    else return <Route {...props} />
  } 
  else if(!isAdm && isAdm !== null) {
    if(props.path === '/rpgs/:id') return <Route component={RpgHomeParticipant} {...props}/>
    else if(props.path === '/rpgs/:id/session') return <Route component={SessionParticipant} {...props}/>
    else return <Redirect to='/home'/>
  }
  else return <Redirect to='/home'/>
}

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch>
        <AuthRoute path='/' exact component={Login} />
        <AuthRoute path='/home' exact component={Home} />
        <AuthRoute path='/rpgs' exact component={NewRpg} />
        <AuthRoute path='/account' exact component={User} />
        <RpgRoute exact path='/rpgs/:id' />
        <RpgRoute path='/rpgs/:id/sheet' exact component={SheetPattern} />
        <RpgRoute path='/rpgs/:id/scenario' exact component={NewScenario} />
        <RpgRoute path='/rpgs/:id/character' exact component={NewCharacter} />
        <RpgRoute path='/rpgs/:id/session' />
      </Switch>
    </BrowserRouter>
  );
}