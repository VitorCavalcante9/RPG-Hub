import React, { useContext } from 'react';
import { BrowserRouter, Route, RouteProps, Switch } from 'react-router-dom';

import { RpgContext } from './contexts/RpgHomeContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NewCharacter } from './pages/NewCharacter';
import { NewRpg } from './pages/NewRpg';
import { NewScenario } from './pages/NewScenario';
import { RpgHome } from './pages/RpgHome';
import { RpgHomeParticipant } from './pages/RpgHomeParticipant';
import { Session } from './pages/Session';
import { SheetPattern } from './pages/SheetPattern';

function RpgHomeRoute({...props}: RouteProps){
  const {isAdm} = useContext(RpgContext);

  if(isAdm) return <Route path='/rpgs/:id' component={RpgHome} {...props}/>
  else if(!isAdm) return <Route path='/rpgs/:id' component={RpgHomeParticipant} {...props}/>
  return <Route {...props} />
}

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/home' exact component={Home} />
        <Route path='/rpgs/create' exact component={NewRpg} />
        <RpgHomeRoute exact path='/rpgs/:id' />
        <Route path='/rpgs/:id/sheet' exact component={SheetPattern} />
        <Route path='/rpgs/:id/scenario' exact component={NewScenario} />
        <Route path='/rpgs/:id/character' exact component={NewCharacter} />
        <Route path='/rpgs/:id/session' exact component={Session} />
      </Switch>
    </BrowserRouter>
  );
}