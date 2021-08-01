import Store from 'electron-store';

export default class MangaAPI {
  static async checkValidToken(store: Store) {
    const response = await fetch(
      'https://mangasee123.com/user/subscription.get.php',
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          cookie:
            typeof store.get('cookies', '') === 'string'
              ? <string>store.get('cookies', '')
              : '',
        },
      }
    );
    const result = await response.json();
    return result.success;
  }
}
