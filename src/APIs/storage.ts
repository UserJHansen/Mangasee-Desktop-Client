import ElectronStore from 'electron-store';

export default class StorageHandler extends ElectronStore {
  constructor() {
    super({
      schema: {
        email: {
          type: 'string',
          format: 'email',
        },
        fullPage: {
          type: 'boolean',
          default: false,
        },
        history: { type: 'array', default: [] },
        'mangaAPI-cache': {
          type: 'array',
          default: [],
        },
      },
    });
  }
}
