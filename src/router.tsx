import './Global/App.global.css';

import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Authentication from './APIs/Authentication';

import Navbar from './Global/navbar';

import Home from './Home/home';
import Login from './Login/login';
import Directory from './Directory/Directory';
import Search from './Search/Search';
import Discussion from './Discussion/Discussion';
import Bookmarks from './Bookmarks/Bookmarks';
import Settings from './Settings/Settings';
import Subscriptions from './Subscriptions/Subscriptions';

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
            <Navbar />
            {[
              ['/', Home],
              ['/home', Home],
              ['/directory', Directory],
              ['/Search', Search],
              ['/Discussion', Discussion],
              ['/Bookmarks', Bookmarks],
              ['/Settings', Settings],
              ['/Subscriptions', Subscriptions],
            ].map((route) => {
              const path = (route[0] || '') as string;
              const Render = (route[1] || <></>) as () => React.ReactElement;
              return <Route key={path} path={path} exact component={Render} />;
            })}
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
