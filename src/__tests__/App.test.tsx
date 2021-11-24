import '@testing-library/jest-dom';
// import { Suspense } from 'react';
import { render } from '@testing-library/react';
import RealElectronStore from 'electron-store';
import {
  MemoryRouter,
  // Router
} from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { SWRConfig } from 'swr';

import StorageType from '../renderer/Interfaces/StorageType';

import App from '../renderer/App';
import Navbar from '../renderer/Global/navbar';
import ScrollToTop from '../renderer/Global/ScrollToTop';
import Home from '../renderer/Home/home';
import Directory from '../renderer/Directory/directory';
import Search from '../renderer/Search/search';
import Discussion from '../renderer/Discussion/discussion';
import Bookmarks from '../renderer/Bookmarks/bookmarks';
import Settings from '../renderer/Settings/settings';
import Subscriptions from '../renderer/Subscriptions/subscriptions';
import Login from '../renderer/Login/login';
import mangaAPIFetcher from '../renderer/APIs/mangaAPI';

type GlobalType = {
  ElectronStore: () => StorageType;
  setStoreValue: (
    key: keyof StorageType,
    value: StorageType[keyof StorageType]
  ) => void;
  openMangasee: () => void;
};
declare const global: GlobalType;

function StorageHandler() {
  return new RealElectronStore<StorageType>({
    schema: {
      email: {
        type: 'string',
        format: 'email',
      },
      fullPage: {
        type: 'boolean',
        default: false,
      },
      wasLoggedIn: {
        type: 'boolean',
        default: false,
      },
      history: { type: 'array', default: [] },
      'mangaAPI-cache': {
        type: 'array',
        default: [],
      },
    },
  });
}

describe('App', () => {
  describe('should render', () => {
    global.ElectronStore = () => StorageHandler().store;
    global.setStoreValue = StorageHandler().set;
    global.openMangasee = () =>
      // eslint-disable-next-line no-console
      console.log('Tried to open external: https://mangasee123.com/');

    it('without errors', () => {
      expect(render(<App />)).toBeTruthy();
    });

    it('the navbar', () => {
      expect(
        render(
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        )
      ).toBeTruthy();
    });
    it('the top scroller', () => {
      expect(render(<ScrollToTop />)).toBeTruthy();
    });
    /* eslint-disable jest/no-commented-out-tests */
    // Once all pages are implemented a test swr get
    // function will need to be created and this needs
    // to be troubleshooted

    // it('home', () => {
    //   expect(
    //     render(
    //       <SWRConfig
    //         value={{
    //           fetcher: mangaAPIFetcher,
    //         }}
    //       >
    //         <Home />
    //       </SWRConfig>
    //     )
    //   ).toBeTruthy();
    // });
    // it('directory', () => {
    //   expect(
    //     render(
    //       <SWRConfig
    //         value={{
    //           fetcher: mangaAPIFetcher,
    //         }}
    //       >
    //         <Directory />
    //       </SWRConfig>
    //     )
    //   ).toBeTruthy();
    // });
    // it('search', () => {
    //   const history = createMemoryHistory();
    //   const route = '/search?overide=e30%3D';
    //   history.push(route);

    //   expect(
    //     render(
    //       // <Router history={history}>
    //       <SWRConfig
    //         value={{
    //           fetcher: mangaAPIFetcher,
    //         }}
    //       >
    //         <Search />
    //       </SWRConfig>
    //       // </Router>
    //     )
    //   ).toBeTruthy();
    // });
    // it('discussion', () => {
    //   expect(render(<Discussion />)).toBeTruthy();
    // });
    // it('bookmarks', () => {
    //   expect(render(<Bookmarks />)).toBeTruthy();
    // });
    // it('settings', () => {
    //   expect(render(<Settings />)).toBeTruthy();
    // });
    // it('subscriptions', () => {
    //   expect(render(<Subscriptions />)).toBeTruthy();
    // });
    // it('the login screen', () => {
    //   expect(render(<Login />)).toBeTruthy();
    // });
  });
});
