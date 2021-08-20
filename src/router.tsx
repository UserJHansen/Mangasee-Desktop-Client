import './Global/App.global.css';

import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Authentication from './Login/Authentication';

import Navbar from './Global/navbar';

import Home from './Home/home';
import Login from './Login/login';
import Directory from './Directory/Directory';
import Search from './Search/Search';
import Discussion from './Discussion/Discussion';

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
            <Route exact path="/">
              <Navbar />
              <Home />
            </Route>
            <Route path="/home">
              <Navbar />
              <Home />
            </Route>
            <Route path="/directory">
              <Navbar />
              <Directory />
            </Route>
            <Route path="/Search">
              <Navbar />
              <Search />
            </Route>
            <Route path="/Discussion">
              <Navbar />
              <Discussion />
            </Route>
            <Redirect path="/login" to="/home" />
          </React.Fragment>
        ) : (
          <React.Fragment key="loggedout">
            <Route path="">
              <Login onLogin={[thatThis, Router.reloadRoutes]} />
            </Route>
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
