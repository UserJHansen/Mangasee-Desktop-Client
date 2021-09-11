import {
  faAngleDoubleRight,
  faBook,
  faFireAlt,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

import Box from '../Global/Box';
import { ThinCard, WideCard } from '../Global/Cards';

import { chapterURLEncode, ChapterDisplay } from '../Global/DisplayTools';
import MangaResult from '../Interfaces/MangaResult';

export default function Home() {
  const { data: Recommendations } = useSWR('/api/Recommendations');
  const { data: Hot } = useSWR('/api/Hot');
  const { data: TopTen } = useSWR('/api/TopTen');

  if (!(Recommendations && Hot && TopTen)) return <></>;

  const Recommendation =
    Recommendations[Math.floor(Math.random() * Recommendations.length)];

  return (
    <Row>
      <Box
        width={8}
        icon={faThumbsUp}
        title="Admin Recommendation"
        style={{
          padding: '10px 15px',
        }}
      >
        <table>
          <tbody>
            <tr>
              <td>
                <Link to={`/manga/${Recommendation.IndexName}`}>
                  <div
                    style={{
                      maxHeight: 145,
                      overflow: 'hidden',
                      background: 'gray',
                    }}
                  >
                    <img
                      src={`https://cover.nep.li/cover/${Recommendation.IndexName}.jpg`}
                      alt="Cover"
                      style={{ maxWidth: 100 }}
                    />
                  </div>
                </Link>
              </td>
              <td valign="top" style={{ padding: '5px 15px' }}>
                <Link
                  to={`/manga/${Recommendation.IndexName}`}
                  title={`Read ${Recommendation.SeriesName}`}
                >
                  {Recommendation.SeriesName}
                </Link>
                <div
                  style={{
                    marginTop: 5,
                  }}
                >
                  Year:{' '}
                  <Link to={`/search/?year=${Recommendation.Year}`}>
                    {Recommendation.Year}
                  </Link>
                </div>
                <div
                  style={{
                    marginTop: 5,
                  }}
                >
                  Status:{' '}
                  <Link to={`/search/?status=${Recommendation.ScanStatus}`}>
                    {Recommendation.ScanStatus} (Scan)
                  </Link>
                  {', '}
                  <Link to={`/search/?pstatus=${Recommendation.PublishStatus}`}>
                    {Recommendation.ScanStatus} (Publish)
                  </Link>
                </div>
                <div
                  style={{
                    marginTop: 5,
                  }}
                >
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
      <Col
        lg={4}
        style={{
          marginTop: '15px',
          marginBottom: '15px',
        }}
      >
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
        style={{ padding: 0 }}
      >
        <Row
          style={{
            margin: 0,
            padding: '0 0 10px 0',
          }}
        >
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
        <div
          style={{
            whiteSpace: 'nowrap',
            textAlign: 'center',
            color: 'gray',
            background: '#fff',
            padding: '10px 15px',
            margin: 0,
          }}
          className="no-scroll"
        >
          <Link
            to="/search/?sort=vm&desc=true"
            style={{
              fontWeight: 600,
              display: 'inline-block',
              margin: '0 5px',
            }}
          >
            Hot This Month
          </Link>
          {Hot.slice(0, 6).map((Manga: MangaResult) => (
            <>
              {' / '}
              <Link
                key={Manga.IndexName}
                to={`/manga/${Manga.IndexName}`}
                title={`Read ${Manga.IndexName}`}
                style={{
                  display: 'inline-block',
                  margin: '0 5px',
                }}
              >
                {Manga.SeriesName}
              </Link>
            </>
          ))}
        </div>
      </Col>
      <Box
        width={8}
        title="Latest Chapters"
        icon={faBook}
        style={{ padding: '5px 15px' }}
      >
        <Row>Latest Chapters</Row>
      </Box>
    </Row>
  );
}
