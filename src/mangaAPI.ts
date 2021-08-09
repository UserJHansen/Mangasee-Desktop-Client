import axios from 'axios';

export default class MangaAPI {
  static async checkValidToken() {
    this.logout();
    const { data } = await axios.get(
      'https://mangasee123.com/user/subscription.get.php'
    );
    return data.success;
  }

  static async login(email: string, password: string) {
    const { data } = await axios.post(
      'https://mangasee123.com/auth/login.php',
      {
        EmailAddress: email,
        Password: password,
      }
    );

    return data.success === true ? data.success : data.val;
  }

  static async logout() {
    return axios.get('https://mangasee123.com/auth/logout.php');
  }
}
