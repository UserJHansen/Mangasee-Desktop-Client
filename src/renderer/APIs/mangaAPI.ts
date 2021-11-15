import axios from 'axios';
import MangaResult from 'renderer/Interfaces/MangaResult';

import { FindVariable } from '../Global/getJsVar';

// Based on Demo from https://swr.vercel.app/docs/advanced/cache#localstorage-based-persistent-cache
export function storeBackupProvider() {
  // When initializing, we restore the data from `localStorage` into a map.
  const debug = process?.env?.NODE_ENV === 'development';

  const map = debug
    ? new Map()
    : new Map(window.ElectronStore()['mangaAPI-cache']);

  const save = debug
    ? () => {}
    : () => {
        const appCache = Array.from(map.entries());
        window.ElectronStore()['mangaAPI-cache'] = appCache;
      };

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', save);

  // Save every 10 minutes
  setInterval(save, 10 * 60 * 1000);

  // We still use the map for write & read for performance.
  return map;
}

export default function mangaAPIFetcher(query: string) {
  // Offline Friendly requests
  switch (query) {
    case query.match(/\/add\/(.*)\/(.*)/g)?.input: {
      const value = /\/add\/(.*)\/(.*)/g.exec(query)?.[2];
      switch (/\/add\/(.*)\/(.*)/g.exec(query)?.[1]) {
        case 'History':
          window
            .ElectronStore()
            .history.push(JSON.parse(value || '{}') as MangaResult);
          return undefined;
        default:
          return undefined;
      }
    }
    case query.match(/\/set\/(.*)\/(.*)/g)?.input: {
      const value = /\/set\/(.*)\/(.*)/g.exec(query)?.[2];
      switch (/\/set\/(.*)\/(.*)/g.exec(query)?.[1]) {
        case 'FullPage': {
          window.ElectronStore().fullPage = value === 'true';
          return undefined;
        }
        default:
          return undefined;
      }
    }
    case '/api/History':
      return window.ElectronStore().history;
    case '/prefs/FullPage':
      return window.ElectronStore().fullPage;
    case '/history/Clear':
      window.ElectronStore().history = [];
      return undefined;
    // no default
  }

  // Requests that require to be online
  switch (query) {
    case '/api/loggedIn':
      return axios
        .get('https://mangasee123.com/user/subscription.get.php', {
          withCredentials: true,
        })
        .then((res) => res.data.success);
    case '/api/allManga':
      return fetch('https://mangasee123.com/directory/index.php', {
        credentials: 'include',
      })
        .then((response) => response.text())
        .then((text) =>
          JSON.parse(<string>FindVariable('vm.FullDirectory', text))
        );
    case '/api/Subbed':
      return axios('https://mangasee123.com/user/subscription.get.php', {
        withCredentials: true,
      }).then((res) => res.data.val);
    case '/api/FullDirectory':
      return fetch('https://mangasee123.com/directory/', {
        credentials: 'include',
      })
        .then((response) => response.text())
        .then((text) =>
          JSON.parse(<string>FindVariable('vm.FullDirectory', text))
        );
    case '/api/SearchableList':
      return axios
        .get('https://mangasee123.com/_search.php', {
          withCredentials: true,
        })
        .then((res) => res.data);
    case '/api/set/home':
      return Promise.all([
        fetch('https://mangasee123.com/index.php', {
          credentials: 'include',
        }).then((response) => response.text()),
        axios('https://mangasee123.com/user/subscription.get.php', {
          withCredentials: true,
        }).then((res) => res.data.val),
      ]).then((resultArray) => {
        const index = resultArray[0];
        const subscriptions = resultArray[1];

        return {
          Subbed: subscriptions,
          Recommendations: JSON.parse(
            <string>FindVariable('vm.RecommendationJSON', index)
          ),
          Hot: JSON.parse(<string>FindVariable('vm.HotUpdateJSON', index)),
          Latest: JSON.parse(<string>FindVariable('vm.LatestJSON', index)),
          SubFeed: JSON.parse(
            <string>FindVariable('vm.SubscriptionFeedJSON', index)
          ),
          NewSeries: JSON.parse(
            <string>FindVariable('vm.NewSeriesJSON', index)
          ),
          History: window.ElectronStore().history,
        };
      });
    case '/api/set/search':
      return axios('https://mangasee123.com/search/search.php', {
        withCredentials: true,
      }).then((results) => ({
        Directory: results.data,
      }));
    default:
      return undefined;
  }
}
