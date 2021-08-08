import './App.global.css';

import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Authentication from './Authentication';

import Home from './home';
import Login from './login';

const authentication = new Authentication();

interface States {
  routes: JSX.Element[];
}

export default class Router extends React.Component<
  Record<string, unknown>,
  States
> {
  static async reloadRoutes(thatThis: Router) {
    const loggedIn = await authentication.isLoggedIn();
    thatThis.setState({
      routes: [
        loggedIn ? (
          <Route key="home" path="/">
            <Home />
          </Route>
        ) : (
          <Route key="login" path="/">
            <Login onLogin={[thatThis, Router.reloadRoutes]} />
          </Route>
        ),
      ],
    });
  }

  constructor(props: Record<string, unknown>, states: States) {
    super(props, states);
    this.state = { routes: [] };
  }

  async componentDidMount() {
    const loggedIn = await authentication.isLoggedIn();
    this.setState({
      routes: [
        loggedIn ? (
          <Route key="home" path="/">
            <Home />
          </Route>
        ) : (
          <Route key="login" path="/">
            <Login onLogin={[this, Router.reloadRoutes]} />
          </Route>
        ),
      ],
    });
  }

  render() {
    const { routes } = this.state;

    return (
      <BrowserRouter>
        <Switch>{routes}</Switch>
      </BrowserRouter>
    );
  }
}
