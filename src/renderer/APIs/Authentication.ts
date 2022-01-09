import axios from 'axios';
import DiscussionResult from 'renderer/Interfaces/DiscussionResult';
import { ScopedMutator } from 'swr/dist/types';

export default class Authentication {
  static async attemptLogin(
    email: string,
    password: string,
    mutate: ScopedMutator
  ): Promise<string | true> {
    axios.defaults.baseURL = 'https://mangasee123.com';
    axios.defaults.withCredentials = true;

    const { data } = await axios.post('/auth/login.php', {
      EmailAddress: email,
      Password: password,
    });

    if (data.success === true) {
      window.setStoreValue('email', email);

      const { val: discussionList } = (await axios('/discussion/index.get.php'))
        .data as { val: DiscussionResult[] };

      // Get the first post available
      const postId = discussionList[0].PostID;
      const { data: postPage } = await axios(
        `/discussion/post.php?id=${postId}`
      );
      const {
        data: {
          val: { Username },
        },
      } = await axios.post('/user/settings.get.info.php');

      const UserId = /UserID *=+ *'([0-9]+)'/.exec(postPage)?.[1];

      if (UserId) {
        window.setStoreValue('UserId', parseInt(UserId, 10));
        window.setStoreValue('Username', Username);
      }

      mutate('/api/loggedIn', true);
      return true;
    }
    return data.val;
  }

  static logout(mutate: ScopedMutator) {
    window.setStoreValue('wasLoggedIn', false);
    return axios
      .get('https://mangasee123.com/auth/logout.php', { withCredentials: true })
      .then(() => mutate('/api/loggedIn', false));
  }
}
