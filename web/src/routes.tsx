import React, { useContext } from 'react';
import { BrowserRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';

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

function RpgRoute({...props}: RouteProps){
  const {isAdm} = useContext(RpgContext);

  if(isAdm){
    if(props.path === '/rpgs/:id') return <Route component={RpgHome} {...props}/>
    else if(props.path === '/rpgs/:id/session') return <Route component={Session} {...props}/>
    else return <Route {...props} />
  } 
  else {
    if(props.path === '/rpgs/:id') return <Route component={RpgHomeParticipant} {...props}/>
    else if(props.path === '/rpgs/:id/session') return <Route component={SessionParticipant} {...props}/>
    else return <Redirect to='/home'/>
  }
}

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/home' exact component={Home} />
        <Route path='/rpgs/create' exact component={NewRpg} />
        <RpgRoute exact path='/rpgs/:id' />
        <RpgRoute path='/rpgs/:id/sheet' exact component={SheetPattern} />
        <RpgRoute path='/rpgs/:id/scenario' exact component={NewScenario} />
        <RpgRoute path='/rpgs/:id/character' exact component={NewCharacter} />
        <RpgRoute path='/rpgs/:id/session' />
      </Switch>
    </BrowserRouter>
  );
}