import React, { useEffect } from 'react';

import Fuse from 'fuse.js';
import useSWR, { useSWRConfig } from 'swr';
import { faHandPaper, faThumbsDown } from '@fortawesome/free-regular-svg-icons';

import {
  faRss,
  faCog,
  faFileInvoice,
  faAlignLeft,
  faTimes,
  faThumbsUp,
  faCalendarCheck,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  Button,
  Col,
  Dropdown,
  FormControl,
  InputGroup,
  Modal,
  Row,
  Table,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import mangaAPIFetcher from '../APIs/mangaAPI';
import Box from '../Global/Box';

import CSS from './Subscriptions.module.scss';
import LastReadResult from '../Interfaces/LastReadResult';
import SubResult from '../Interfaces/SubResult';
import { ChapterDisplay, chapterURLEncode } from '../Global/DisplayTools';
import AdjustedDate from '../Global/AdjustedDate';

export type SearchType = 'Relevance' | 'Recent' | 'New' | 'A-Z' | 'Z-A';

function convertReadStatus(status: '1' | '2' | '3' | '4' | '5') {
  switch (status) {
    case '1':
      return 'Reading';
    case '2':
      return 'Finished';
    case '3':
      return 'On-Hold';
    case '4':
      return 'Dropped';
    case '5':
      return 'Plan to Read';
    default:
      return 'Unknown';
  }
}

export default function Subscriptions() {
  const [ModalOpen, setModalOpen] = React.useState(false);

  const [searchString, setsearchString] = React.useState('');
  const [readFilter, setReadFilter] = React.useState<
    '0' | '1' | '2' | '3' | '4' | '5'
  >('0');

  const { sort: defaultSortBy, fullDisplay: defaultFullDisplay } =
    window.ElectronStore().subPreferences || {
      sort: 'Relevance',
      fullDisplay: true,
    };

  const [sortBy, setSortBy] = React.useState<SearchType>(defaultSortBy);
  const [fullDisplay, setFullDisplay] = React.useState(defaultFullDisplay);

  useEffect(() => {
    window.setStoreValue('subPreferences', { sort: sortBy, fullDisplay });
  }, [sortBy, fullDisplay]);

  const { Subbed, LastChapterArr } = useSWR('/api/set/Subscriptions').data as {
    Subbed: SubResult[];
    LastChapterArr: LastReadResult[];
  };
  const { mutate } = useSWRConfig();

  function updateStatus(
    IndexName: string,
    Status: '1' | '2' | '3' | '4' | '5'
  ) {
    (
      mangaAPIFetcher(
        `/update/ReadStatus/${IndexName}/${Status}`
      ) as Promise<void>
    )
      .then(() => {
        return mutate(
          '/api/set/Subscriptions',
          {
            LastChapterArr,
            Subbed: Subbed.map((value) => {
              if (value.IndexName === IndexName) {
                return {
                  ...value,
                  ReadStatus: '1',
                };
              }
              return value;
            }),
          },
          true
        );
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });
  }

  const fuse = React.useMemo(
    () =>
      new Fuse(Subbed, {
        keys: ['SeriesName'],
        shouldSort: sortBy === 'Relevance',
        threshold: 0.5,
        ignoreFieldNorm: true,
        ignoreLocation: true,
      }),
    [Subbed, sortBy]
  );
  const FuseDirectory = React.useMemo(() => {
    const output: Fuse.FuseResult<SubResult>[] = [];
    Subbed.forEach((value) => {
      output.push({ item: value, refIndex: 0 });
    });
    return output;
  }, [Subbed]);

  const search = React.useMemo<Fuse.FuseResult<SubResult>[]>(
    () => fuse.search(searchString),
    [fuse, searchString]
  );
  const isUnfiltered = () => searchString === '';

  const result = isUnfiltered() ? FuseDirectory : search;
  const sorted =
    sortBy === 'Relevance' || sortBy === 'Recent'
      ? result.filter(
          (value) => value.item.ReadStatus === readFilter || readFilter === '0'
        )
      : result
          .filter(
            (value) =>
              value.item.ReadStatus === readFilter || readFilter === '0'
          )
          .sort((a, b) => {
            switch (sortBy) {
              case 'New':
                return b.item.DateLatest.localeCompare(a.item.DateLatest);
              case 'A-Z':
                return a.item.SeriesName.localeCompare(b.item.SeriesName);
              case 'Z-A':
                return b.item.SeriesName.localeCompare(a.item.SeriesName);
              default:
                throw new Error('Not Implemented');
            }
          });

  const currentTime = new Date().getTime();

  return (
    <Box
      width={12}
      title={`Subscriptions (${sorted.length})`}
      icon={faRss}
      rightIcon={faCog}
      LinkElement={Button}
      linkProps={{
        onClick: () => {
          setModalOpen(true);
        },
        className: CSS.BoxLink,
      }}
    >
      <Modal show={ModalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Mass Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table
            className="bottom-5 top-5"
            style={{ border: '1px solid #DEE2E6' }}
          >
            <tbody>
              <tr>
                <td style={{ paddingTop: 13 }}>Purge Subscriptions</td>
                <td />
                <td className="text-right">
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary">
                      Purge All
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropleft dropdown-menu-right">
                      <Dropdown.Item
                        onClick={() => {
                          mangaAPIFetcher('/delete/Subscriptions');
                        }}
                      >
                        Confirm Purge All
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {Subbed.length === 0 ? (
        <>You don&apos;t have any subscription yet.</>
      ) : (
        <>
          <InputGroup className="top-5 bottom-5">
            <FormControl
              placeholder="Search Subscriptions..."
              value={searchString}
              onChange={(e) => setsearchString(e.target.value)}
            />
          </InputGroup>
          <Row className="top-15 bottom-15">
            <Col xs={5} sm={7}>
              <Button
                size="sm"
                variant={`${fullDisplay ? '' : 'outline-'}primary`}
                onClick={() => setFullDisplay(true)}
              >
                <FontAwesomeIcon icon={faFileInvoice} />{' '}
                <span className="d-none d-sm-inline">Full Display</span>
              </Button>{' '}
              <Button
                size="sm"
                variant={`${!fullDisplay ? '' : 'outline-'}primary`}
                onClick={() => setFullDisplay(false)}
              >
                <FontAwesomeIcon icon={faAlignLeft} />{' '}
                <span className="d-none d-sm-inline">Simple Display</span>
              </Button>{' '}
              <Button as={Link} size="sm" variant="outline-primary" to="/Feed">
                <FontAwesomeIcon icon={faRss} />{' '}
                <span className="d-none d-sm-inline">Feed</span>
              </Button>
            </Col>
            <Col xs={7} sm={5} className="text-right">
              <Dropdown style={{ display: 'inline' }}>
                <Dropdown.Toggle
                  size="sm"
                  variant={readFilter === '0' ? 'outline-secondary' : 'primary'}
                >
                  Filter
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: 200 }} align="right">
                  <Dropdown.Item
                    onClick={() => setReadFilter('0')}
                    active={readFilter === '0'}
                  >
                    All{' '}
                    <Badge
                      variant="secondary"
                      className="float-right"
                      style={{ marginTop: 3 }}
                    >
                      {result.length}
                    </Badge>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setReadFilter('1')}
                    active={readFilter === '1'}
                  >
                    Reading{' '}
                    <Badge
                      variant="secondary"
                      className="float-right"
                      style={{ marginTop: 3 }}
                    >
                      {
                        result.filter((value) => value.item.ReadStatus === '1')
                          .length
                      }
                    </Badge>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setReadFilter('2')}
                    active={readFilter === '2'}
                  >
                    Finished{' '}
                    <Badge
                      variant="secondary"
                      className="float-right"
                      style={{ marginTop: 3 }}
                    >
                      {
                        result.filter((value) => value.item.ReadStatus === '2')
                          .length
                      }
                    </Badge>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setReadFilter('3')}
                    active={readFilter === '3'}
                  >
                    On-Hold{' '}
                    <Badge
                      variant="secondary"
                      className="float-right"
                      style={{ marginTop: 3 }}
                    >
                      {
                        result.filter((value) => value.item.ReadStatus === '3')
                          .length
                      }
                    </Badge>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setReadFilter('4')}
                    active={readFilter === '4'}
                  >
                    Dropped{' '}
                    <Badge
                      variant="secondary"
                      className="float-right"
                      style={{ marginTop: 3 }}
                    >
                      {
                        result.filter((value) => value.item.ReadStatus === '4')
                          .length
                      }
                    </Badge>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setReadFilter('5')}
                    active={readFilter === '5'}
                  >
                    Plan to Read{' '}
                    <Badge
                      variant="secondary"
                      className="float-right"
                      style={{ marginTop: 3 }}
                    >
                      {
                        result.filter((value) => value.item.ReadStatus === '5')
                          .length
                      }
                    </Badge>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>{' '}
              <Dropdown style={{ display: 'inline' }}>
                <Dropdown.Toggle size="sm" variant="outline-secondary">
                  Sort
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: 200 }} align="right">
                  <Dropdown.Item
                    onClick={() => setSortBy('Relevance')}
                    active={sortBy === 'Relevance'}
                  >
                    Relevance
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSortBy('Recent')}
                    active={sortBy === 'Recent'}
                  >
                    Recently Subscribed
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSortBy('New')}
                    active={sortBy === 'New'}
                  >
                    New Chapters
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSortBy('A-Z')}
                    active={sortBy === 'A-Z'}
                  >
                    Series Name A-Z
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setSortBy('Z-A')}
                    active={sortBy === 'Z-A'}
                  >
                    Series Name Z-A
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          {sorted.map((manga) => (
            <div
              key={manga.item.IndexName}
              className="bottom-5 top-10"
              style={{ background: '#F2F2F2' }}
            >
              <Row>
                <Col xl={10} lg={9} md={9} className={CSS.SubBox}>
                  <table>
                    <tbody>
                      <tr>
                        {fullDisplay && (
                          <td className={CSS.ImageBox} valign="top">
                            <Link to={`/manga/${manga.item.IndexName}`}>
                              <img
                                className="img-fluid"
                                alt={`${manga.item.SeriesName} cover`}
                                src={`https://cover.nep.li/cover/${manga.item.IndexName}.jpg`}
                              />
                            </Link>
                          </td>
                        )}
                        <td style={{ padding: '10px 15px' }} valign="top">
                          <Link to={`/manga/${manga.item.IndexName}`}>
                            {manga.item.SeriesName}
                          </Link>
                          <div>
                            Latest:{' '}
                            <span className={CSS.TextGray}>
                              {manga.item.LatestChapter.Chapter === 'N/A' ? (
                                'N/A'
                              ) : (
                                <>
                                  <Link
                                    to={`/manga/${
                                      manga.item.IndexName
                                    }/${chapterURLEncode(
                                      manga.item.LatestChapter.Chapter
                                    )}`}
                                  >
                                    Chapter{' '}
                                    {ChapterDisplay(
                                      manga.item.LatestChapter.Chapter
                                    )}
                                  </Link>{' '}
                                  {currentTime -
                                    new AdjustedDate(
                                      manga.item.LatestChapter.Date
                                    ).getTime() <
                                    36e5 && (
                                    <Badge
                                      variant="warning"
                                      style={{ color: 'white' }}
                                    >
                                      NEW
                                    </Badge>
                                  )}
                                  &middot;{' '}
                                  {new Date(
                                    manga.item.LatestChapter.Date
                                  ).toLocaleDateString()}
                                </>
                              )}
                            </span>
                          </div>
                          {fullDisplay && (
                            <>
                              <div>
                                Last Read:
                                <span className={CSS.TextGray}>
                                  {!LastChapterArr.find(
                                    (value) =>
                                      value.SeriesID === manga.item.SeriesID
                                  ) ? (
                                    'N/A'
                                  ) : (
                                    <Link
                                      to={`/manga/${
                                        manga.item.IndexName
                                      }/${chapterURLEncode(
                                        LastChapterArr.find(
                                          (value) =>
                                            value.SeriesID ===
                                            manga.item.SeriesID
                                        )?.Chapter || ''
                                      )}`}
                                    >
                                      {' '}
                                      Chapter{' '}
                                      {ChapterDisplay(
                                        LastChapterArr.find(
                                          (value) =>
                                            value.SeriesID ===
                                            manga.item.SeriesID
                                        )?.Chapter || ''
                                      )}
                                    </Link>
                                  )}
                                </span>
                              </div>
                              <div>
                                Status:
                                <Link
                                  to={`/search/${window.btoa(
                                    JSON.stringify({
                                      'Scan Status': {
                                        open: true,
                                        selection: manga.item.ScanStatus,
                                      },
                                      'Publish Status': {
                                        open: true,
                                        selection: 'Any',
                                      },
                                    })
                                  )}`}
                                >
                                  {manga.item.ScanStatus} (Scan)
                                </Link>
                                ,{' '}
                                <Link
                                  to={`/search/${window.btoa(
                                    JSON.stringify({
                                      'Scan Status': {
                                        open: true,
                                        selection: 'Any',
                                      },
                                      'Publish Status': {
                                        open: true,
                                        selection: manga.item.PublishStatus,
                                      },
                                    })
                                  )}`}
                                >
                                  {manga.item.PublishStatus} (Publish)
                                </Link>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col xl={2} lg={3} md={3}>
                  <div style={{ padding: 5 }}>
                    <Row style={{ margin: 0, padding: 0 }}>
                      <Col md={12} xs={6} style={{ margin: 0, padding: 0 }}>
                        <div style={{ padding: 5 }}>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="outline-secondary"
                              size="sm"
                              style={{ width: '100%' }}
                            >
                              <FontAwesomeIcon icon={faTimes} /> Unsub
                              <span className="d-none d-sm-inline">scribe</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="right">
                              <Dropdown.Item
                                onClick={() => {
                                  (
                                    mangaAPIFetcher(
                                      `/delete/Subscription/${manga.item.IndexName}`
                                    ) as Promise<void>
                                  )
                                    .then(() => {
                                      return mutate(
                                        '/api/set/Subscriptions',
                                        {
                                          LastChapterArr,
                                          Subbed: Subbed.filter(
                                            (value) =>
                                              value.IndexName !==
                                              manga.item.IndexName
                                          ),
                                        },
                                        true
                                      );
                                    })
                                    .catch((e: unknown) => {
                                      // eslint-disable-next-line no-console
                                      console.log(e);
                                    });
                                }}
                              >
                                Confirm Unsubscribe
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </Col>
                      <Col md={12} xs={6} style={{ margin: 0, padding: 0 }}>
                        <div style={{ padding: 5 }}>
                          <Dropdown style={{ display: 'inline' }}>
                            <Dropdown.Toggle
                              variant="outline-secondary"
                              size="sm"
                              style={{ width: '100%' }}
                            >
                              {(() => {
                                switch (manga.item.ReadStatus) {
                                  case '1':
                                    return <FontAwesomeIcon icon={faEye} />;
                                  case '2':
                                    return (
                                      <FontAwesomeIcon icon={faThumbsUp} />
                                    );
                                  case '3':
                                    return (
                                      <FontAwesomeIcon icon={faHandPaper} />
                                    );
                                  case '4':
                                    return (
                                      <FontAwesomeIcon icon={faThumbsDown} />
                                    );
                                  case '5':
                                    return (
                                      <FontAwesomeIcon icon={faCalendarCheck} />
                                    );
                                  default:
                                    return <></>;
                                }
                              })()}{' '}
                              {convertReadStatus(manga.item.ReadStatus)}
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="left">
                              <Dropdown.Item
                                onClick={() => {
                                  updateStatus(manga.item.IndexName, '1');
                                }}
                                active={manga.item.ReadStatus === '1'}
                              >
                                Reading
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  updateStatus(manga.item.IndexName, '2');
                                }}
                                active={manga.item.ReadStatus === '2'}
                              >
                                Finished
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  updateStatus(manga.item.IndexName, '3');
                                }}
                                active={manga.item.ReadStatus === '3'}
                              >
                                On-Hold
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  updateStatus(manga.item.IndexName, '4');
                                }}
                                active={manga.item.ReadStatus === '4'}
                              >
                                Dropped
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  updateStatus(manga.item.IndexName, '5');
                                }}
                                active={manga.item.ReadStatus === '5'}
                              >
                                Plan to Read
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </>
      )}
    </Box>
  );
}
