import axios from 'axios';
import Store from './storage';
import { FindVariable } from '../Global/getJsVar';

function checkRegexForSwitch(regex: RegExp, str: string) {
  return str.match(regex)?.input;
}

function checkStringForSwitch(regex: string, str: string) {
  return str.match(new RegExp(`${regex}.*`))?.input;
}

export default function mangaAPIFetcher(query: string) {
  const online = !/.*\/quick\//.test(query) && navigator.onLine;

  // Offline Friendly requests
  switch (query) {
    case checkRegexForSwitch(/\/add\/(.*)\/(.*)/g, query): {
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
    }
    case checkRegexForSwitch(/\/set\/(.*)\/(.*)/g, query): {
      const value = /\/set\/(.*)\/(.*)/g.exec(query)?.[2];
      switch (/\/set\/(.*)\/(.*)/g.exec(query)?.[1]) {
        case 'FullPage': {
          return new Store().set('wasLoggedIn', value === 'true');
        }
        default:
          return undefined;
      }
    }
    case checkStringForSwitch('/api/History', query):
      return new Store().get('History') || [];
    case checkStringForSwitch('/prefs/FullPage', query):
      return new Store().get('wasLoggedIn');
    case checkStringForSwitch('/history/Clear', query):
      return new Store().delete('history');
    // no default
  }

  // Requests that require to be online
  if (online) {
    switch (query) {
      case checkStringForSwitch('/api/loggedIn', query):
        return axios
          .get('https://mangasee123.com/user/subscription.get.php')
          .then((res) => res.data.success);
      case checkStringForSwitch('/api/allManga', query):
        return fetch('https://mangasee123.com/directory/index.php')
          .then((response) => response.text())
          .then((text) =>
            typeof FindVariable('vm.FullDirectory', text) === 'string'
              ? JSON.parse(<string>FindVariable('vm.FullDirectory', text))
              : FindVariable('vm.FullDirectory', text)
          );
      case checkStringForSwitch('/api/Recommendations', query):
        return fetch('https://mangasee123.com/index.php')
          .then((response) => response.text())
          .then((text) =>
            typeof FindVariable('vm.RecommendationJSON', text) === 'string'
              ? JSON.parse(<string>FindVariable('vm.RecommendationJSON', text))
              : ''
          );
      case checkStringForSwitch('/api/Hot', query):
        return fetch('https://mangasee123.com/index.php')
          .then((response) => response.text())
          .then((text) =>
            typeof FindVariable('vm.HotUpdateJSON', text) === 'string'
              ? JSON.parse(<string>FindVariable('vm.HotUpdateJSON', text))
              : FindVariable('vm.HotUpdateJSON', text)
          );
      case checkStringForSwitch('/api/TopTen', query):
        return fetch('https://mangasee123.com/index.php')
          .then((response) => response.text())
          .then((text) =>
            typeof FindVariable('vm.TopTenJSON', text) === 'string'
              ? JSON.parse(<string>FindVariable('vm.TopTenJSON', text))
              : FindVariable('vm.TopTenJSON', text)
          );
      case checkStringForSwitch('/api/Latest', query):
        return fetch('https://mangasee123.com/index.php')
          .then((response) => response.text())
          .then((text) =>
            typeof FindVariable('vm.LatestJSON', text) === 'string'
              ? JSON.parse(<string>FindVariable('vm.LatestJSON', text))
              : FindVariable('vm.LatestJSON', text)
          );
      case checkStringForSwitch('/api/SubFeed', query):
        return fetch('https://mangasee123.com/index.php')
          .then((response) => response.text())
          .then((text) =>
            typeof FindVariable('vm.SubscriptionFeedJSON', text) === 'string'
              ? JSON.parse(
                  <string>FindVariable('vm.SubscriptionFeedJSON', text)
                )
              : FindVariable('vm.SubscriptionFeedJSON', text)
          );
      case checkStringForSwitch('/api/Subbed', query):
        return axios('https://mangasee123.com/user/subscription.get.php').then(
          (res) => res.data.val
        );
      case checkStringForSwitch('/api/NewSeries', query):
        return fetch('https://mangasee123.com/index.php')
          .then((response) => response.text())
          .then((text) =>
            typeof FindVariable('vm.NewSeriesJSON', text) === 'string'
              ? JSON.parse(<string>FindVariable('vm.NewSeriesJSON', text))
              : FindVariable('vm.NewSeriesJSON', text)
          );
      case checkStringForSwitch('/api/FullDirectory', query):
        return fetch('https://mangasee123.com/directory/')
          .then((response) => response.text())
          .then((text) =>
            typeof FindVariable('vm.FullDirectory', text) === 'string'
              ? JSON.parse(<string>FindVariable('vm.FullDirectory', text))
              : FindVariable('vm.FullDirectory', text)
          );
      case checkStringForSwitch('/api/SearchableList', query):
        return axios
          .get('https://mangasee123.com/_search.php')
          .then((res) => res.data);
      default:
        return undefined;
    }
  }
  switch (query) {
    case checkStringForSwitch('/api/loggedIn', query):
      return new Store().get('wasLoggedIn');
    case checkStringForSwitch('/api/allManga', query):
      return new Store().get('mangaList');
    case checkStringForSwitch('/api/Recommendations', query):
      return new Store().get('lastRecommendations');
    case checkStringForSwitch('/api/Hot', query):
      return new Store().get('lastHot');
    case checkStringForSwitch('/api/TopTen', query):
      return new Store().get('lastTopTen');
    case checkStringForSwitch('/api/Latest', query):
      return new Store().get('lastLatest');
    case checkStringForSwitch('/api/Subbed', query):
      return new Store().get('lastSubbed');
    case checkStringForSwitch('/api/SubFeed', query):
      return new Store().get('lastSubFeed');
    case checkStringForSwitch('/api/NewSeries', query):
      return new Store().get('lastNewSeries');
    case checkStringForSwitch('/api/SearchableList', query):
      return new Store().get('lastSearchableList');
    default:
      return undefined;
  }
}
