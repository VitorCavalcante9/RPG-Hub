import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NewRpg } from './pages/NewRpg';

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/home' exact component={Home} />
        <Route path='/newRpg' exact component={NewRpg} />
      </Switch>
    </BrowserRouter>
  );
}