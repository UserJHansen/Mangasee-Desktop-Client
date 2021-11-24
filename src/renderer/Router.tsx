import './App.css';

import React, { lazy, Suspense } from 'react';
import {
  HashRouter as ReactRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import useSWR from 'swr';

import { Container } from 'react-bootstrap';
import Navbar from './Global/navbar';

import Home from './Home/home';
import Login from './Login/login';
import ScrollToTop from './Global/ScrollToTop';

const Search = lazy(() => import('./Search/Search'));
const Directory = lazy(() => import('./Directory/Directory'));
const Discussion = lazy(() => import('./Discussion/Discussion'));
const Bookmarks = lazy(() => import('./Bookmarks/Bookmarks'));
const Settings = lazy(() => import('./Settings/Settings'));
const Subscriptions = lazy(() => import('./Subscriptions/Subscriptions'));

export default function Router() {
  const { data: isLoggedIn } = useSWR('/api/loggedIn');

  return (
    <ReactRouter>
      <Suspense fallback="Loading Route...">
        <Switch>
          {isLoggedIn ? (
            <React.Fragment key="loggedin">
              <Navbar />
              <ScrollToTop />
              <Container>
                {/* List of Routes available when logged in */}
                <Route path="/Home" component={Home} />
                <Route path="/Directory" component={Directory} />
                <Route path="/SearchDirect/:overide" component={Search} />
                <Route
                  path="/Search"
                  component={() => (
                    <Redirect from="*" to="/SearchDirect/e30=" />
                  )}
                />
                <Route path="/Discussion" component={Discussion} />
                <Route path="/Bookmarks" component={Bookmarks} />
                <Route path="/Settings" component={Settings} />
                <Route path="/Subscriptions" component={Subscriptions} />
                <Route
                  path="/"
                  strict
                  exact
                  component={() => <Redirect from="*" to="/Home" />}
                />
              </Container>
            </React.Fragment>
          ) : (
            <Login key="loggedout" />
          )}
        </Switch>
      </Suspense>
    </ReactRouter>
  );
}
