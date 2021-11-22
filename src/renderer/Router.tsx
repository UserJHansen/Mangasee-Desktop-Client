import './App.css';

import React, { lazy, Suspense } from 'react';
import { HashRouter as ReactRouter, Switch, Route } from 'react-router-dom';
import useSWR from 'swr';

import { Container } from 'react-bootstrap';
import Navbar from './Global/navbar';

import Home from './Home/home';
import Login from './Login/login';
import ScrollToTop from './Global/ScrollToTop';

const Search = lazy(() => import('./Search/search'));
const Directory = lazy(() => import('./Directory/directory'));
const Discussion = lazy(() => import('./Discussion/discussion'));
const Bookmarks = lazy(() => import('./Bookmarks/bookmarks'));
const Settings = lazy(() => import('./Settings/settings'));
const Subscriptions = lazy(() => import('./Subscriptions/subscriptions'));

export default function Router() {
  const { data: isLoggedIn } = useSWR('/api/loggedIn');

  console.log(isLoggedIn, window.location.href);
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
                <Route path="/Search/:overide" component={Search} />
                <Route path="/Search" component={Search} />
                <Route path="/Discussion" component={Discussion} />
                <Route path="/Bookmarks" component={Bookmarks} />
                <Route path="/Settings" component={Settings} />
                <Route path="/Subscriptions" component={Subscriptions} />
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
