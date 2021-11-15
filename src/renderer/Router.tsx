import './App.css';

import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import useSWR from 'swr';

import { Container } from 'react-bootstrap';
import Navbar from './Global/navbar';

import Home from './Home/home';
import Login from './Login/login';
import ScrollToTop from './Global/ScrollToTop';

const Search = React.lazy(() => import('./Search/search'));
const Directory = React.lazy(() => import('./Directory/directory'));
const Discussion = React.lazy(() => import('./Discussion/discussion'));
const Bookmarks = React.lazy(() => import('./Bookmarks/bookmarks'));
const Settings = React.lazy(() => import('./Settings/settings'));
const Subscriptions = React.lazy(() => import('./Subscriptions/subscriptions'));

export default function Router() {
  const { data: isLoggedIn } = useSWR('/api/loggedIn');

  // Use react router without hashrouter

  return (
    <BrowserRouter>
      <Switch>
        {isLoggedIn ? (
          <React.Fragment key="loggedin">
            <Navbar />
            <ScrollToTop />
            <Container>
              <Route strict path="/Search/:overide" component={Search} />
              {/* List of Routes available when logged in */}
              {[
                ['/', Home],
                ['/home', Home],
                ['/Directory', Directory],
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
    </BrowserRouter>
  );
}
