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
axios.defaults.baseURL = 'https://mangasee123.com';
axios.defaults.withCredentials = true;

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
      return axios('/user/subscription.get.php').then(
        (res) => res.data.success
      );
    case '/api/allManga':
      return axios('/directory/index.php').then(({ data: text }) =>
        JSON.parse(<string>FindVariable('vm.FullDirectory', text))
      );
    case '/api/Subbed':
      return axios('/user/subscription.get.php').then((res) => res.data.val);
    case '/api/FullDirectory':
      return axios('/directory/').then(({ data: text }) =>
        JSON.parse(<string>FindVariable('vm.FullDirectory', text))
      );
    case '/api/SearchableList':
      return axios('/_search.php').then((res) => res.data);
    case '/api/set/home':
      return Promise.all([
        axios('/index.php'),
        axios('/user/subscription.get.php'),
      ]).then((resultArray) => {
        const { data: index } = resultArray[0];
        const { val: subscriptions } = resultArray[1].data;

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
      return axios('/search/search.php').then((results) => ({
        Directory: results.data,
      }));
    default:
      return undefined;
  }
}
