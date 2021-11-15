import MangaResult from 'renderer/Interfaces/MangaResult';

export default interface StorageType {
  email: string;
  fullPage: boolean;
  wasLoggedIn: boolean;
  history: MangaResult[];
  'mangaAPI-cache': [unknown, unknown][];
}
