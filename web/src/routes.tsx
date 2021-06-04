import React, { useContext } from 'react';
import { BrowserRouter, Redirect, Route, RouteProps, Switch, useLocation } from 'react-router-dom';
import { Loading } from './components/Loading';
import { AuthContext } from './contexts/AuthContext';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NewCharacter } from './pages/NewCharacter';
import { NewRpg } from './pages/NewRpg';
import { NewScenario } from './pages/NewScenario';
import { RpgHome } from './pages/RpgHome';
import { RpgHomeParticipant } from './pages/RpgHomeParticipant';
import { Session } from './pages/Session';
import { SheetPattern } from './pages/SheetPattern';
import { User } from './pages/User';

function AuthRoute({...props}: RouteProps){
  const { loading, authenticated } = useContext(AuthContext);

  if(loading) return <Loading />
  else if (props.path === '/' && authenticated){
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
  const { loading } = useContext(AuthContext);
  <AuthRoute {...props} />
  
  const location = useLocation();
  const id = location.pathname.split('/');

  const rpgs = localStorage.getItem('rpgs');

  const allRpgs = rpgs ? JSON.parse(rpgs) : null;
  const indexRpg = allRpgs ? allRpgs.rpgs.indexOf(id[2]) : -1;
  const isAdm = (indexRpg !== -1) ? true : false;

  const indexRpgParticipant = allRpgs ? allRpgs.participating_rpgs.indexOf(id[2]) : -1;
  const isParticipant = (indexRpgParticipant !== -1) ? true : false;
  
  if(loading) return <Loading/>
  else if(props.path === '/rpgs/:id/session') return <Route component={Session} {...props}/>
  else if(isAdm){
    if(props.path === '/rpgs/:id') return <Route component={RpgHome} {...props}/>
    else return <Route {...props} />
  } 
  else if(!isAdm && isParticipant) {
    if(props.path === '/rpgs/:id') return <Route component={RpgHomeParticipant} {...props}/>
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