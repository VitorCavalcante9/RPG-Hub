import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NewCharacter } from './pages/NewCharacter';
import { NewRpg } from './pages/NewRpg';
import { NewScenario } from './pages/NewScenario';
import { RpgHome } from './pages/RpgHome';
import { SheetPattern } from './pages/SheetPattern';

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/home' exact component={Home} />
        <Route path='/rpgs' exact component={RpgHome} />
        <Route path='/rpgs/create' exact component={NewRpg} />
        <Route path='/rpgs/sheet' exact component={SheetPattern} />
        <Route path='/rpgs/scenario' exact component={NewScenario} />
        <Route path='/rpgs/character' exact component={NewCharacter} />
      </Switch>
    </BrowserRouter>
  );
}