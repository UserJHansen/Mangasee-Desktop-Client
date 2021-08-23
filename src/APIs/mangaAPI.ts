import axios from 'axios';

export default function mangaAPIFetcher(query: string) {
  switch (query) {
    case '/api/loggedIn':
      return axios
        .get('https://mangasee123.com/user/subscription.get.php')
        .then((res) => res.data.success)
        .catch((err) => {
          throw new Error(err);
        });
    default:
      return undefined;
  }
}
