import MangaResult from './MangaResult';
import { SearchType } from '../Subscriptions/Subscriptions';

export default interface StorageType {
  email: string;
  UserId: number;
  Username: string;
  fullPage: boolean;
  wasLoggedIn: boolean;
  history: MangaResult[];
  subPreferences: {
    sort: SearchType;
    fullDisplay: boolean;
  };
  'mangaAPI-cache': [unknown, unknown][];
}
