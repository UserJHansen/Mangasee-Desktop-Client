import ElectronStore from 'electron-store';

export default class StorageHandler extends ElectronStore {
  constructor() {
    super({
      schema: {
        email: {
          type: 'string',
          format: 'email',
        },
        sessionID: {
          type: 'string',
        },
      },
    });
  }
}
