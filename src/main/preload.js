const { contextBridge, shell } = require('electron');
const ElectronStore = require('electron-store');

function StorageHandler() {
  return new ElectronStore({
    schema: {
      email: {
        type: 'string',
        format: 'email',
      },
      fullPage: {
        type: 'boolean',
        default: false,
      },
      wasLoggedIn: {
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

contextBridge.exposeInMainWorld('ElectronStore', () => StorageHandler().store);

contextBridge.exposeInMainWorld('setStoreValue', (key, value) =>
  StorageHandler().set(key, value)
);
contextBridge.exposeInMainWorld('openMangasee', () =>
  shell.openExternal('https://mangasee123.com/')
);
