import axios from 'axios';
import Store from './storage';
import { FindVariable } from '../Global/getJsVar';

export default function mangaAPIFetcher(query: string) {
  if (/\/set\/(.*)\/(.*)/g.test(query)) {
    const value = /\/set\/(.*)\/(.*)/g.exec(query)?.[2];
    switch (/\/set\/(.*)\/(.*)/g.exec(query)?.[1]) {
      case 'FullPage':
        return new Store().set('wasLoggedIn', value === 'true');
      default:
        return undefined;
    }
  } else
    switch (query) {
      case '/api/loggedIn':
        if (navigator.onLine) {
          return axios
            .get('https://mangasee123.com/user/subscription.get.php')
            .then((res) => res.data.success)
            .catch((err) => {
              throw new Error(err);
            });
        }
        return new Store().get('wasLoggedIn');
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
      case '/prefs/FullPage':
        return new Store().get('wasLoggedIn');
      default:
        return undefined;
    }
}
