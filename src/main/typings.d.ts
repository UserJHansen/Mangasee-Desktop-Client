import ElectronStore from 'electron-store';
import StorageType from 'renderer/Interfaces/StorageType';

type StorageHandler = ElectronStore<StorageType>;

declare global {
  interface Window {
    ElectronStore: () => StorageType;
    setStoreValue: (
      key: keyof StorageType,
      value: StorageType[keyof StorageType]
    ) => void;
    openMangasee: () => void;
  }
}
