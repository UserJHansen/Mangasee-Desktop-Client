import axios from 'axios';
import Store from './storage';
import { FindVariable } from '../Global/getJsVar';

// Based on Demo from https://swr.vercel.app/docs/advanced/cache#localstorage-based-persistent-cache
export function storeBackupProvider() {
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(new Store().get('mangaAPI-cache') as []);

  function save() {
    const appCache = Array.from(map.entries());
    new Store().set('mangaAPI-cache', appCache);
  }

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
          return new Store().set(
            'history',
            (<Array<string>>new Store().get('history')).push(
              JSON.parse(value || '')
            )
          );
        default:
          return undefined;
      }
    }
    case query.match(/\/set\/(.*)\/(.*)/g)?.input: {
      const value = /\/set\/(.*)\/(.*)/g.exec(query)?.[2];
      switch (/\/set\/(.*)\/(.*)/g.exec(query)?.[1]) {
        case 'FullPage': {
          return new Store().set('fullPage', value === 'true');
        }
        default:
          return undefined;
      }
    }
    case '/api/History':
      return new Store().get('history') || [];
    case '/prefs/FullPage':
      return new Store().get('fullPage');
    case '/history/Clear':
      return new Store().delete('history');
    // no default
  }

  // Requests that require to be online
  switch (query) {
    case '/api/loggedIn':
      return axios
        .get('https://mangasee123.com/user/subscription.get.php')
        .then((res) => res.data.success);
    case '/api/allManga':
      return fetch('https://mangasee123.com/directory/index.php')
        .then((response) => response.text())
        .then((text) =>
          typeof FindVariable('vm.FullDirectory', text) === 'string'
            ? JSON.parse(<string>FindVariable('vm.FullDirectory', text))
            : FindVariable('vm.FullDirectory', text)
        );
    case '/api/Recommendations':
      return fetch('https://mangasee123.com/index.php')
        .then((response) => response.text())
        .then((text) =>
          typeof FindVariable('vm.RecommendationJSON', text) === 'string'
            ? JSON.parse(<string>FindVariable('vm.RecommendationJSON', text))
            : ''
        );
    case '/api/Hot':
      return fetch('https://mangasee123.com/index.php')
        .then((response) => response.text())
        .then((text) =>
          typeof FindVariable('vm.HotUpdateJSON', text) === 'string'
            ? JSON.parse(<string>FindVariable('vm.HotUpdateJSON', text))
            : FindVariable('vm.HotUpdateJSON', text)
        );
    case '/api/TopTen':
      return fetch('https://mangasee123.com/index.php')
        .then((response) => response.text())
        .then((text) =>
          typeof FindVariable('vm.TopTenJSON', text) === 'string'
            ? JSON.parse(<string>FindVariable('vm.TopTenJSON', text))
            : FindVariable('vm.TopTenJSON', text)
        );
    case '/api/Latest':
      return fetch('https://mangasee123.com/index.php')
        .then((response) => response.text())
        .then((text) =>
          typeof FindVariable('vm.LatestJSON', text) === 'string'
            ? JSON.parse(<string>FindVariable('vm.LatestJSON', text))
            : FindVariable('vm.LatestJSON', text)
        );
    case '/api/SubFeed':
      return fetch('https://mangasee123.com/index.php')
        .then((response) => response.text())
        .then((text) =>
          typeof FindVariable('vm.SubscriptionFeedJSON', text) === 'string'
            ? JSON.parse(<string>FindVariable('vm.SubscriptionFeedJSON', text))
            : FindVariable('vm.SubscriptionFeedJSON', text)
        );
    case '/api/Subbed':
      return axios('https://mangasee123.com/user/subscription.get.php').then(
        (res) => res.data.val
      );
    case '/api/NewSeries':
      return fetch('https://mangasee123.com/index.php')
        .then((response) => response.text())
        .then((text) =>
          typeof FindVariable('vm.NewSeriesJSON', text) === 'string'
            ? JSON.parse(<string>FindVariable('vm.NewSeriesJSON', text))
            : FindVariable('vm.NewSeriesJSON', text)
        );
    case '/api/FullDirectory':
      return fetch('https://mangasee123.com/directory/')
        .then((response) => response.text())
        .then((text) =>
          typeof FindVariable('vm.FullDirectory', text) === 'string'
            ? JSON.parse(<string>FindVariable('vm.FullDirectory', text))
            : FindVariable('vm.FullDirectory', text)
        );
    case '/api/SearchableList':
      return axios
        .get('https://mangasee123.com/_search.php')
        .then((res) => res.data);
    default:
      return undefined;
  }
}
