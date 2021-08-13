import Store from '../APIs/storage';
import MangaAPI from '../APIs/mangaAPI';

export default class Authentication {
  private store = new Store();

  async isLoggedIn() {
    return (
      this.store.get('email') &&
      this.store.get('email') !== '' &&
      MangaAPI.checkValidToken()
    );
  }

  async attemptLogin(email: string, password: string): Promise<string | true> {
    const result = await MangaAPI.login(email, password);

    if (result === true) {
      this.store.set('email', email);
      return true;
    }
    return result;
  }
}
