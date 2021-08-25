import axios from 'axios';
import { FindVariable } from '../Global/getJsVar';

export default function mangaAPIFetcher(query: string) {
  switch (query) {
    case '/api/loggedIn':
      return axios
        .get('https://mangasee123.com/user/subscription.get.php')
        .then((res) => res.data.success)
        .catch((err) => {
          throw new Error(err);
        });
    case '/api/allManga':
      return fetch('https://mangasee123.com/directory/index.php')
        .then((response) => {
          return response.text();
        })
        .then((text) => {
          console.log(FindVariable('vm.FullDirectory', text));
          return '';
        })
        .catch((err) => {
          throw new Error(err);
        });
    default:
      return undefined;
  }
}
