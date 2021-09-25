import axios from 'axios';
import { ScopedMutator } from 'swr/dist/types';

import Store from './storage';

export default class Authentication {
  private store = new Store();

  async attemptLogin(
    email: string,
    password: string,
    mutate: ScopedMutator
  ): Promise<string | true> {
    const { data } = await axios.post(
      'https://mangasee123.com/auth/login.php',
      {
        EmailAddress: email,
        Password: password,
      }
    );

    if (data.success === true) {
      this.store.set('email', email);

      mutate('/api/loggedIn', true);
      return true;
    }
    return data.val;
  }

  static logout(mutate: ScopedMutator) {
    new Store().set('wasLoggedIn', false);
    return axios
      .get('https://mangasee123.com/auth/logout.php')
      .then(() => mutate('/api/loggedIn', false));
  }
}
