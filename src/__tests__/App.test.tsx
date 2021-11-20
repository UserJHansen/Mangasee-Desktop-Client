import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import RealElectronStore from 'electron-store';
import StorageType from '../renderer/Interfaces/StorageType';
import App from '../renderer/App';

type GlobalType = {
  ElectronStore: () => StorageType;
  setStoreValue: (
    key: keyof StorageType,
    value: StorageType[keyof StorageType]
  ) => void;
  openMangasee: () => void;
};
declare const global: GlobalType;

function StorageHandler() {
  return new RealElectronStore<StorageType>({
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

beforeAll(() => {
  global.ElectronStore = () => StorageHandler().store;
  global.setStoreValue = StorageHandler().set;
  global.openMangasee = () =>
    // eslint-disable-next-line no-console
    console.warn('Tried to open external: https://mangasee123.com/');
});

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
