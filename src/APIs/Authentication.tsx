import axios from 'axios';

import Store from './storage';

export default class Authentication {
  private store = new Store();

  async attemptLogin(email: string, password: string): Promise<string | true> {
    const { data } = await axios.post(
      'https://mangasee123.com/auth/login.php',
      {
        EmailAddress: email,
        Password: password,
      }
    );

    if (data.success === true) {
      this.store.set('email', email);
      return true;
    }
    return data.val;
  }

  static logout() {
    return axios.get('https://mangasee123.com/auth/logout.php');
  }
}
