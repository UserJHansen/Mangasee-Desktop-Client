import axios from 'axios';
import Store from './storage';
import { FindVariable } from '../Global/getJsVar';

export default function mangaAPIFetcher(query: string) {
  // Offline Friendly requests
  switch (query) {
    case query.match(/\/add\/(.*)\/(.*)/g)?.input: {
      const value = /\/add\/(.*)\/(.*)/g.exec(query)?.[2];
      switch (/\/add\/(.*)\/(.*)/g.exec(query)?.[1]) {
        case 'History':
          return new Store().set(
            'wasLoggedIn',
            (<Array<string>>new Store().get('History')).push(
              JSON.parse(value || '')
            )
          );
        default:
          return undefined;
      }
      break;
    }
    case query.match(/\/set\/(.*)\/(.*)/g)?.input: {
      const value = /\/set\/(.*)\/(.*)/g.exec(query)?.[2];
      switch (/\/set\/(.*)\/(.*)/g.exec(query)?.[1]) {
        case 'FullPage': {
          return new Store().set('wasLoggedIn', value === 'true');
        }
        default:
          return undefined;
      }
      break;
    }
    case '/api/History':
      return new Store().get('History') || [];
    case '/prefs/FullPage':
      return new Store().get('wasLoggedIn');
    case '/history/Clear':
      return new Store().delete('history');
    // no default
  }

  // Requests that require to be online
  if (navigator.onLine) {
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
              ? JSON.parse(
                  <string>FindVariable('vm.SubscriptionFeedJSON', text)
                )
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
      default:
        return undefined;
    }
  }
  switch (query) {
    case '/api/loggedIn':
      return new Store().get('wasLoggedIn');
    case '/api/allManga':
      return new Store().get('mangaList');
    case '/api/Recommendations':
      return new Store().get('lastRecommendations');
    case '/api/Hot':
      return new Store().get('lastHot');
    case '/api/TopTen':
      return new Store().get('lastTopTen');
    case '/api/Latest':
      return new Store().get('lastLatest');
    case '/api/Subbed':
      return new Store().get('lastSubbed');
    case '/api/SubFeed':
      return new Store().get('lastSubFeed');
    case '/api/NewSeries':
      return new Store().get('lastNewSeries');
    default:
      return undefined;
  }
}
