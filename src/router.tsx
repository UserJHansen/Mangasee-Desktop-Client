import './App.global.css';

import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Authentication from './Authentication';

import Home from './home';
import Login from './login';

const authentication = new Authentication();

interface States {
  routes: unknown[];
}

export default class Router extends React.Component<
  Record<string, unknown>,
  States
> {
  constructor(props: Record<string, unknown>, states: States) {
    super(props, states);
    this.state = { routes: [] };
  }

  async componentDidMount() {
    const loggedIn = await authentication.isLoggedIn();
    this.setState({
      routes: [
        !loggedIn && (
          <Route key="login" path="/">
            <div className="box centred">
              <Login />
            </div>
          </Route>
        ),
        loggedIn && (
          <Route key="home" path="/">
            <Home />
          </Route>
        ),
      ],
    });
  }

  render() {
    return (
      <BrowserRouter>
        {/* eslint-disable-next-line react/destructuring-assignment */}
        <Switch>{this.state.routes}</Switch>
      </BrowserRouter>
    );
  }
}
