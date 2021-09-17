import ElectronStore from 'electron-store';

export default class StorageHandler extends ElectronStore {
  constructor() {
    super({
      schema: {
        email: {
          type: 'string',
          format: 'email',
        },
        wasLoggedIn: {
          type: 'boolean',
          default: false,
        },
        FullPage: {
          type: 'boolean',
          default: false,
        },
        mangaList: { type: 'array' },
        lastRecommendations: { type: 'array' },
        lastHot: { type: 'array' },
        lastTopTen: { type: 'array' },
        lastLatest: { type: 'array' },
        lastSubbed: { type: 'array' },
        lastSubFeed: { type: 'array' },
        history: { type: 'array' },
      },
    });
  }
}
