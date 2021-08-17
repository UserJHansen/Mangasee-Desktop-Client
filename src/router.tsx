import './Global/App.global.css';

import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Authentication from './Login/Authentication';

import Home from './Home/home';
import Login from './Login/login';

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
          <React.Fragment key="loggedin">
            <Route exact path="">
              <Home />
            </Route>
            <Route path="home">
              <Home />
            </Route>
            <Redirect path="login" to="home" />
          </React.Fragment>
        ) : (
          <React.Fragment key="loggedout">
            <Route exact path="">
              <Login onLogin={[thatThis, Router.reloadRoutes]} />
            </Route>
            <Route path="login">
              <Login onLogin={[thatThis, Router.reloadRoutes]} />
            </Route>
            <Redirect path="home" to="login" />
          </React.Fragment>
        ),
      ],
    });
  }

  constructor(props: Record<string, unknown>, states: States) {
    super(props, states);
    this.state = { routes: [] };
  }

  async componentDidMount() {
    Router.reloadRoutes(this);
  }

  render() {
    const { routes } = this.state;

    return (
      <HashRouter>
        <Switch>{routes}</Switch>
      </HashRouter>
    );
  }
}
