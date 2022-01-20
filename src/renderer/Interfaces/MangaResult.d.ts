import FeedType from './FeedType';

export default interface MangaResult extends FeedType {
  Chapter: string;
  Date: string;
  IndexName: string;
  IsEdd: boolean;
  SeriesID: string;
  SeriesName: string;
  ScanStatus?: string;
  LatestChapter: { Chapter: string; Date: string };
}
