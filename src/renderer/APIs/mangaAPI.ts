import axios from 'axios';
import ReCAPTCHA from '../Global/reCaptcha';
import MangaResult from '../Interfaces/MangaResult';

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
    case query.match(/\/add\/(.*)\/(.*)/)?.input: {
      const value = /\/add\/(.*)\/(.*)/.exec(query)?.[2];
      switch (/\/add\/(.*)\/(.*)/.exec(query)?.[1]) {
        case 'History':
          window
            .ElectronStore()
            .history.push(JSON.parse(value || '{}') as MangaResult);
          return undefined;
        // no default
      }
      break;
    }
    case query.match(/\/set\/(.*)\/(.*)/)?.input: {
      const value = /\/set\/(.*)\/(.*)/.exec(query)?.[2];
      switch (/\/set\/(.*)\/(.*)/.exec(query)?.[1]) {
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
    case '/api/set/Discussion':
      return axios('/discussion/index.get.php').then((results) => ({
        Discussions: results.data.val,
      }));
    case query.match(/\/api\/Post\/(.*)/)?.input:
      return axios
        .post('/discussion/post.get.php', {
          id: /\/api\/Post\/(.*)/.exec(query)?.[1],
        })
        .then((results) =>
          results.data.success ? results.data.val : 'No Post'
        );
    case query.match(/\/add\/(.*)\/(.*)\/(.*)/)?.input: {
      const args = /\/add\/((?:(?:.*)){3,})/.exec(query)?.[1].split('/');
      if (typeof args === 'undefined' || args.length < 3) return undefined;
      const selector = args[0];
      switch (selector) {
        case 'Reply': {
          const postID = args[1];
          const post = window.decodeURIComponent(args[2]);

          const recaptcha = new ReCAPTCHA(
            '6Ld2-aMZAAAAAD9ESUQP8ijtHxtoWAwv2DOsJJ0n',
            'homepage'
          );

          return recaptcha.getToken().then((token) =>
            axios.post('/discussion/post.comment.php', {
              Captcha: token,
              PostID: postID,
              CommentContent: post,
            })
          );
        }
        case 'ReplyComment': {
          const postID = args[1];
          const post = window.decodeURIComponent(args[2]);

          const recaptcha = new ReCAPTCHA(
            '6Ld2-aMZAAAAAD9ESUQP8ijtHxtoWAwv2DOsJJ0n',
            'homepage'
          );

          return recaptcha.getToken().then((token) =>
            axios.post('/discussion/post.comment.reply.php', {
              Captcha: token,
              TargetID: postID,
              ReplyMessage: post,
            })
          );
        }
        default:
          return undefined;
      }
    }
    case query.match(/\/like\/(.*)\/(.*)\/(.*)/)?.input: {
      const args = /\/like\/((?:(?:.*)){3,})/.exec(query)?.[1].split('/');
      if (typeof args === 'undefined' || args.length < 2) return undefined;
      const selector = args[0];
      switch (selector) {
        case 'Comment':
          return axios.post('/discussion/post.comment.like.php', {
            CommentID: args[1],
            Liked: args[2] === 'true',
          });

        // no default
      }
      return undefined;
    }
    case query.match(/\/delete\/(.*)\/(.*)/)?.input: {
      const args = /\/delete\/((?:(?:.*)){2,})/.exec(query)?.[1].split('/');
      if (typeof args === 'undefined' || args.length < 2) return undefined;
      const selector = args[0];
      switch (selector) {
        case 'Post':
          return axios
            .post('/discussion/post.delete.php', {
              id: args[1],
            })
            .then((results) => results.data.val);
        case 'PostComment':
          if (args.length < 3) return undefined;
          return axios
            .post('/discussion/post.comment.delete.php', {
              id: args[1],
              CommentID: args[2],
            })
            .then((results) => results.data.val);
        case 'CommentReply':
          return axios
            .post('/discussion/post.comment.delete.php', {
              TargetID: args[1],
              CommentID: args[2],
            })
            .then((results) => results.data.val);
        // no default
      }
      return undefined;
    }
    default:
      return undefined;
  }
}
