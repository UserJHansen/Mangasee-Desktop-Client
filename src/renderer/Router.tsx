import './App.css';

import { Suspense } from 'react';
import {
  HashRouter as ReactRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import useSWR from 'swr';

import { Container } from 'react-bootstrap';
import Navbar from './Global/navbar';

import Home from './Home/home';
import Login from './Login/login';
import ScrollToTop from './Global/ScrollToTop';
import Footer from './Global/footer';
import NewPost from './Discussion/NewPost';
import DisplayPost from './Discussion/Display';
import Bookmarks from './Bookmarks/Bookmarks';
import Directory from './Directory/Directory';
import Discussion from './Discussion/Discussion';
import Search from './Search/Search';
import Settings from './Settings/Settings';
import Subscriptions from './Subscriptions/Subscriptions';
import Feed from './Feed/Feed';

export default function Router() {
  const { data: isLoggedIn } = useSWR('/api/loggedIn');

  try {
    return (
      <ReactRouter>
        <Suspense fallback="Loading Route...">
          {isLoggedIn ? (
            <>
              <Navbar />
              <ScrollToTop />
              <Container>
                <Routes>
                  {/* List of Routes available when logged in */}
                  <Route path="/Home" element={<Home />} />
                  <Route path="/Directory" element={<Directory />} />
                  <Route path="/Search/:overide" element={<Search />} />
                  <Route
                    path="/Search"
                    element={<Navigate to="/Search/e30=" />}
                  />
                  <Route path="/Discussion/Create" element={<NewPost />} />
                  <Route path="/Discussion/:postId" element={<DisplayPost />} />
                  <Route path="/Discussion" element={<Discussion />} />
                  <Route path="/Bookmarks" element={<Bookmarks />} />
                  <Route path="/Settings" element={<Settings />} />
                  <Route path="/Subscriptions" element={<Subscriptions />} />
                  <Route path="/Feed" element={<Feed />} />
                  <Route path="/" element={<Navigate to="/Home" />} />
                </Routes>
              </Container>
              <Footer />
            </>
          ) : (
            <Login />
          )}
        </Suspense>
      </ReactRouter>
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return <>{e}</>;
  }
}
