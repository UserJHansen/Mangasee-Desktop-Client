export default interface SubResult {
  Removing: boolean;
  SeriesID: string;
  EmailNotify: '0' | '1';
  ReadStatus: '1' | '2' | '3' | '4' | '5';
  DateSubscribed: string;
  ScanStatus: 'Ongoing' | 'Complete' | 'Hiatus' | 'Cancelled' | 'Discontinued';
  PublishStatus:
    | 'Ongoing'
    | 'Complete'
    | 'Hiatus'
    | 'Cancelled'
    | 'Discontinued';
  DateStamp: number;
  SeriesName: string;
  IndexName: string;
  LatestChapter: { Chapter: string; Date: string };
  DateLatest: string;
}
