import axios from 'axios';
import { ScopedMutator } from 'swr/dist/types';

export default class Authentication {
  static async attemptLogin(
    email: string,
    password: string,
    mutate: ScopedMutator
  ): Promise<string | true> {
    const { data } = await axios.post(
      'https://mangasee123.com/auth/login.php',
      {
        EmailAddress: email,
        Password: password,
      },
      { withCredentials: true }
    );

    if (data.success === true) {
      window.setStoreValue('email', email);

      mutate('/api/loggedIn', true);
      return true;
    }
    return data.val;
  }

  static logout(mutate: ScopedMutator) {
    window.ElectronStore().wasLoggedIn = false;
    return axios
      .get('https://mangasee123.com/auth/logout.php', { withCredentials: true })
      .then(() => mutate('/api/loggedIn', false));
  }
}
