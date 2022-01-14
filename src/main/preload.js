const { contextBridge, shell } = require('electron');
const ElectronStore = require('electron-store');

function StorageHandler() {
  return new ElectronStore({
    schema: {
      email: {
        type: 'string',
        format: 'email',
      },
      Username: { type: 'string' },
      UserId: { type: 'number', default: 0 },
      fullPage: {
        type: 'boolean',
        default: false,
      },
      wasLoggedIn: {
        type: 'boolean',
        default: false,
      },
      subPreferences: {
        type: 'object',
        properties: {
          sort: {
            type: 'string',
            default: 'Relevance',
          },
          fullDisplay: {
            type: 'boolean',
            default: true,
          },
        },
      },
      history: { type: 'array', default: [] },
      'mangaAPI-cache': {
        type: 'array',
        default: [],
      },
    },
  });
}

contextBridge.exposeInMainWorld('ElectronStore', () => StorageHandler().store);

contextBridge.exposeInMainWorld('setStoreValue', (key, value) =>
  StorageHandler().set(key, value)
);
contextBridge.exposeInMainWorld('openMangasee', () =>
  shell.openExternal('https://mangasee123.com/')
);
contextBridge.exposeInMainWorld('openContact', () =>
  shell.openExternal('https://mangasee123.com/contact/')
);
contextBridge.exposeInMainWorld('openPrivacy', () =>
  shell.openExternal('https://mangasee123.com/privacy/')
);
