import React from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

import {
  faAngleDoubleRight,
  faBook,
  faEraser,
  faFireAlt,
  faHistory,
  faPlus,
  faRss,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '../Global/Box';
import { ThinCard, WideCard } from '../Global/Cards';
import CSS from './home.module.scss';

import { chapterURLEncode, ChapterDisplay } from '../Global/DisplayTools';
import MangaResult from '../Interfaces/MangaResult';

import Store from '../APIs/storage';

export default function Home() {
  const { data: RecommendationsQuick } = useSWR('/api/Recommendations/quick');
  const { data: HotQuick } = useSWR('/api/Hot/quick');
  const { data: TopTenQuick } = useSWR('/api/TopTen/quick');
  const { data: LatestQuick } = useSWR('/api/Latest/quick');
  const { data: SubbedQuick } = useSWR('/api/Subbed/quick');
  const { data: SubFeedQuick } = useSWR('/api/SubFeed/quick');
  const { data: HistoryQuick } = useSWR('/api/History/quick');
  const { data: NewSeriesQuick } = useSWR('/api/NewSeries/quick');
  let { data: Recommendations } = useSWR('/api/Recommendations');
  let { data: Hot } = useSWR('/api/Hot');
  let { data: TopTen } = useSWR('/api/TopTen');
  let { data: Latest } = useSWR('/api/Latest');
  let { data: Subbed } = useSWR('/api/Subbed');
  let { data: SubFeed } = useSWR('/api/SubFeed');
  let { data: History } = useSWR('/api/History');
  let { data: NewSeries } = useSWR('/api/NewSeries');

  const loaded = [
    Recommendations,
    Hot,
    TopTen,
    Latest,
    Subbed,
    SubFeed,
    History,
    NewSeries,
  ].every((value) => {
    return typeof value !== 'undefined';
  });

  const cacheLoaded = [
    Recommendations,
    Hot,
    TopTen,
    Latest,
    Subbed,
    SubFeed,
    History,
    NewSeries,
  ].every((value) => {
    return typeof value !== 'undefined';
  });

  const store = new Store();
  if (navigator.onLine && loaded) {
    store.set('lastRecommendations', Recommendations);
    store.set('lastHot', Hot);
    store.set('lastTopTen', TopTen);
    store.set('lastLatest', Latest);
    store.set('lastSubbed', Subbed);
    store.set('lastSubFeed', SubFeed);
    store.set('lastNewSeries', NewSeries);
  }

  if (!loaded && cacheLoaded) {
    Recommendations = RecommendationsQuick;
    Hot = HotQuick;
    TopTen = TopTenQuick;
    Latest = LatestQuick;
    Subbed = SubbedQuick;
    SubFeed = SubFeedQuick;
    History = HistoryQuick;
    NewSeries = NewSeriesQuick;
  } else if (!loaded && !cacheLoaded) {
    Recommendations = [];
    Hot = [];
    TopTen = [];
    Latest = [];
    Subbed = [];
    SubFeed = [];
    History = [];
    NewSeries = [];
  }

  const Recommendation =
    Recommendations[Math.floor(Math.random() * Recommendations.length)];

  return (
    <Row>
      {Recommendation !== undefined ? (
        <Box width={8} icon={faThumbsUp} title="Admin Recommendation">
          <table>
            <tbody>
              <tr>
                <td>
                  <Link to={`/manga/${Recommendation.IndexName}`}>
                    <div className={CSS.image}>
                      <img
                        src={`https://cover.nep.li/cover/${Recommendation.IndexName}.jpg`}
                        alt="Cover"
                        style={{ maxWidth: 100 }}
                      />
                    </div>
                  </Link>
                </td>
                <td valign="top" className={CSS.admininfo}>
                  <Link
                    to={`/manga/${Recommendation.IndexName}`}
                    title={`Read ${Recommendation.SeriesName}`}
                    className={CSS.adminname}
                  >
                    {Recommendation.SeriesName}
                  </Link>
                  <div className="top-5">
                    Year:{' '}
                    <Link to={`/search/?year=${Recommendation.Year}`}>
                      {Recommendation.Year}
                    </Link>
                  </div>
                  <div className="top-5">
                    Status:{' '}
                    <Link to={`/search/?status=${Recommendation.ScanStatus}`}>
                      {Recommendation.ScanStatus} (Scan)
                    </Link>
                    {', '}
                    <Link
                      to={`/search/?pstatus=${Recommendation.PublishStatus}`}
                    >
                      {Recommendation.ScanStatus} (Publish)
                    </Link>
                  </div>
                  <div className="top-5">
                    Genres:{' '}
                    {Recommendation.Genres.map((Genre: string) => {
                      return (
                        <Link key={Genre} to={`/search/?genre=${Genre}`}>
                          {Genre}
                        </Link>
                      );
                    }).reduce((prev: JSX.Element, curr: JSX.Element) => [
                      prev,
                      ', ',
                      curr,
                    ])}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      ) : (
        <></>
      )}
      <Col lg={4} className={CSS.berserkimage}>
        <Link to="/manga/Berserk">
          <img
            className="img-fluid"
            alt="Link to Berserk"
            src="https://i.imgur.com/el0l9Fk.jpg"
          />
        </Link>
      </Col>
      <Box
        width={12}
        icon={faFireAlt}
        title="Hot Update"
        rightIcon={faAngleDoubleRight}
        rightText="More"
        LinkElement={Link}
        linkProps={{ to: '/hot' }}
        className={CSS.hot}
      >
        <Row className={CSS.hotcontent}>
          {Hot.slice(0, 12).map((Manga: MangaResult) => (
            <ThinCard
              link={`/read/${Manga.IndexName}${chapterURLEncode(
                Manga.Chapter
              )}`}
              src={`https://cover.nep.li/cover/${Manga.IndexName}.jpg`}
              title={`${Manga.SeriesName} Chapter ${ChapterDisplay(
                Manga.Chapter
              )}`}
              key={Manga.IndexName}
            >
              {Manga.SeriesName} {ChapterDisplay(Manga.Chapter)}
            </ThinCard>
          ))}
        </Row>
      </Box>
      <Col lg={12}>
        <div className={`no-scroll ${CSS.hotlist}`}>
          <Link to="/search/?sort=vm&desc=true" className={CSS.hottext}>
            Hot This Month
          </Link>
          {Hot.slice(0, 6).map((Manga: MangaResult) => (
            <React.Fragment key={Manga.IndexName}>
              {' / '}
              <Link
                to={`/manga/${Manga.IndexName}`}
                title={`Read ${Manga.IndexName}`}
                className={CSS.hotcontent}
              >
                {Manga.SeriesName}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </Col>
      <Box width={8} title="Latest Chapters" icon={faBook}>
        <Row>
          {Latest.slice(0, 40).map((Manga: MangaResult) => (
            <WideCard
              key={Manga.IndexName}
              subArr={Subbed.map((sub: MangaResult) => sub.SeriesID)}
              hotArr={Hot.map((hot: MangaResult) => hot.SeriesID)}
              manga={Manga}
            />
          ))}
        </Row>
        <Link className={`${CSS.viewmore}`} to="/search/?sort=lt&desc=true">
          View More
        </Link>
      </Box>
      <Col lg={4}>
        <Box
          width={0}
          icon={faRss}
          title="Subscription Feed"
          className="bottom-10"
          style={{ padding: 0 }}
        >
          <ListGroup variant="flush">
            {Subbed.length === 0 ? (
              <ListGroupItem as={Link} className="bottom-10" to="/search">
                You don&apos;t have any subscriptions yet.
              </ListGroupItem>
            ) : (
              <>
                {SubFeed.map((manga: MangaResult) => (
                  <ListGroupItem
                    key={manga.IndexName + manga.Chapter}
                    as={Link}
                    to={`/read/${manga.IndexName}${chapterURLEncode(
                      manga.Chapter
                    )}`}
                  >
                    <span className={CSS.subfeedtitle}>{manga.SeriesName}</span>{' '}
                    Chapter {ChapterDisplay(manga.Chapter)}
                  </ListGroupItem>
                ))}
                <ListGroupItem as={Link} to="/feed">
                  {' '}
                  View More...{' '}
                </ListGroupItem>
              </>
            )}
          </ListGroup>
        </Box>
        <Box width={0} title="History" icon={faHistory} style={{ padding: 0 }}>
          <ListGroup variant="flush">
            {History.length === 0 ? (
              <ListGroupItem className="bottom-10">
                No history entries found.
              </ListGroupItem>
            ) : (
              <>
                {History.slice(0, 10).map((manga: MangaResult) => (
                  <ListGroupItem
                    key={manga.IndexName + manga.Chapter}
                    as={Link}
                    to={`/read/${manga.IndexName}${chapterURLEncode(
                      manga.Chapter
                    )}`}
                  >
                    <span className={CSS.subfeedtitle}>{manga.SeriesName}</span>{' '}
                    Chapter {ChapterDisplay(manga.Chapter)}
                  </ListGroupItem>
                ))}
                <ListGroupItem action onClick={() => mutate('/history/Clear')}>
                  <FontAwesomeIcon icon={faEraser} /> Clear History
                </ListGroupItem>
              </>
            )}
          </ListGroup>
        </Box>
        <Box
          width={0}
          title="Recently Added"
          icon={faPlus}
          style={{ padding: 0 }}
        >
          <ListGroup variant="flush">
            {NewSeries.slice(0, 10).map((manga: MangaResult) => (
              <ListGroupItem
                key={manga.IndexName + manga.Chapter}
                as={Link}
                to={`/manga/${manga.IndexName}`}
              >
                {manga.SeriesName}
              </ListGroupItem>
            ))}
            <ListGroupItem as={Link} to="/feed">
              {' '}
              View More...{' '}
            </ListGroupItem>
          </ListGroup>
        </Box>
      </Col>
    </Row>
  );
}
