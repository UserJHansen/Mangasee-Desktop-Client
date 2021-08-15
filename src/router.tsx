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
          <>
            <Route key="indexhome" exact path="">
              <Home />
            </Route>
            <Route key="home" path="home">
              <Home />
            </Route>
            <Redirect key="loginredirect" path="login" to="home" />
          </>
        ) : (
          <>
            <Route key="indexlogin" exact path="">
              <Login onLogin={[thatThis, Router.reloadRoutes]} />
            </Route>
            <Route key="login" path="login">
              <Login onLogin={[thatThis, Router.reloadRoutes]} />
            </Route>
            <Redirect key="homeredirect" path="home" to="login" />
          </>
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
