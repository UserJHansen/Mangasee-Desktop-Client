import { ipcRenderer } from 'electron';
import Store from 'electron-store';
import storageSchema from './storage';
import MangaAPI from './mangaAPI';

export default class Authentication {
  private store = new Store();

  // private mangaAPI = new MangaAPI();

  constructor() {
    const appData = ipcRenderer.sendSync('electron-store-get-data');

    this.store = new Store({
      schema: storageSchema,
      encryptionKey: appData.defaultCwd,
    });
  }

  async isLoggedIn() {
    return (
      this.store.get('email') !== '' && MangaAPI.checkValidToken(this.store)
    );
  }
}
