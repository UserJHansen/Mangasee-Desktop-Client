import './Global/App.global.css';

import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import useSWR from 'swr';

import { Container } from 'react-bootstrap';
import Navbar from './Global/navbar';

import Home from './Home/home';
import Login from './Login/login';
import Search from './Search/Search';
import Discussion from './Discussion/Discussion';
import Bookmarks from './Bookmarks/Bookmarks';
import Settings from './Settings/Settings';
import Subscriptions from './Subscriptions/Subscriptions';

export default function Router() {
  const { data } = useSWR('/api/loggedIn', { suspense: true });

  return (
    <HashRouter>
      <Switch>
        {data ? (
          <React.Fragment key="loggedin">
            <Navbar />
            <Container>
              {[
                ['/', Home],
                ['/home', Home],
                ['/Search', Search],
                ['/Discussion', Discussion],
                ['/Bookmarks', Bookmarks],
                ['/Settings', Settings],
                ['/Subscriptions', Subscriptions],
              ].map((route) => {
                const path = (route[0] || '') as string;
                const Render = (route[1] || <></>) as () => React.ReactElement;
                return (
                  <Route key={path} path={path} exact component={Render} />
                );
              })}
              <Redirect path="/login" to="/home" />
            </Container>
          </React.Fragment>
        ) : (
          <React.Fragment key="loggedout">
            <Route path="">
              <Login />
            </Route>
          </React.Fragment>
        )}
      </Switch>
    </HashRouter>
  );
}
