import React, { useState } from 'react';
import Fuse from 'fuse.js';
import useSWR from 'swr';
import update from 'immutability-helper';
import isEqual from 'lodash.isEqual';

import {
  faAlignLeft,
  faCaretUp,
  faCaretDown,
  faFileInvoice,
  faSearch,
  faUndoAlt,
  faCheck,
  faFilter,
  faTimes,
  faSpinner,
  faFireAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Alert,
  Badge,
  Button,
  Col,
  Form,
  ListGroup,
  Row,
} from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useParams } from 'react-router-dom';
import { decode } from 'he';

import CSS from './Search.module.scss';
import Box from '../Global/Box';
import { ChapterDisplay, chapterURLEncode } from '../Global/DisplayTools';

type SelectType = {
  selected: string[];
  selectednot: string[];
};
type FilterControls = {
  'Sort By': { open: boolean; selection: string };
  'Official Translation': { open: boolean; selection: string };
  'Scan Status': { open: boolean; selection: string };
  'Publish Status': { open: boolean; selection: string };
  Type: { open: boolean; selection: string };
  Genre: {
    open: boolean;
    selection: SelectType;
  };
  name: { open: boolean; selection: string };
  a: { open: boolean; selection: string };
  y: { open: boolean; selection: string };
};
type FilterControlsPartial = Partial<FilterControls>;

type MangaSearchList = {
  i: string; // indexable Name
  s: string; // Full Name
  o: string; // is Official?
  ss: string; // Scan Status
  ps: string; // Publish Status
  t: string; // Type of Manga (Manhua)
  v: string; // Popularity of all time
  vm: string; // Popularity of this month
  y: string; // Year of Release
  a: string[]; // Author
  al: string[]; // Alternate names
  l: string; // Latest Chapter Chapter
  lt: number; // Latest Chapter ?
  ls: string; // Latest Chapter Date
  g: string[]; // Genres
  h: boolean; // isPopular
};

export default function Search() {
  const { overide } = useParams<{ overide?: string }>();
  const overides: FilterControlsPartial = JSON.parse(
    window.atob(overide || 'e30=')
  );
  const defaultState: FilterControls = {
    'Sort By': { open: true, selection: 'Score' },
    'Official Translation': { open: false, selection: 'Any' },
    'Scan Status': { open: false, selection: 'Any' },
    'Publish Status': { open: false, selection: 'Any' },
    Type: { open: false, selection: 'Any' },
    Genre: {
      open: false,
      selection: { selected: [], selectednot: [] },
    },
    name: { open: true, selection: '' },
    a: { open: true, selection: '' },
    y: { open: true, selection: '' },
  };
  const {
    data: { Directory },
  } = useSWR('/api/set/search');
  const [firstLoad, setfirstLoad] = React.useState(true);
  const [isFull, setIsFull] = useState(true);
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const [rendered, setRendered] = useState<Fuse.FuseResult<MangaSearchList>[]>(
    []
  );
  const [showControl, setShowControl] = useState<FilterControls>({
    ...defaultState,
    ...overides,
  });

  console.log(window.location.href);
  if (showControl !== overides) {
    window.history.pushState(
      {},
      '',
      `/search?overide=${window.btoa(JSON.stringify(showControl))}`
    );
  }
  // https://github.com/microsoft/TypeScript/issues/23724#issuecomment-384807714
  function isKey<E>(str: string): str is Extract<keyof E, string> {
    return typeof str === 'string';
  }
  const isDefault = () =>
    Object.keys(showControl).every(
      (uKey: string) =>
        isKey(uKey) &&
        ((key: keyof FilterControls) =>
          isEqual(showControl[key].selection, defaultState[key].selection))(
          uKey
        )
    );

  const sortByScore = showControl['Sort By'].selection === 'Score';
  const fuse = React.useMemo(
    () =>
      new Fuse(Directory || [], {
        keys: ['i', 's', 'al', 'o', 'ss', 'ps', 't', 'y', 'a', 'g'],
        shouldSort: sortByScore,
        threshold: 0.5,
        includeScore: true,
        ignoreFieldNorm: true,
        ignoreLocation: true,
      }),
    [Directory, sortByScore]
  );
  const FuseDirectory = React.useMemo(() => {
    const output: Fuse.FuseResult<MangaSearchList>[] = [];
    Directory.forEach((value: MangaSearchList) => {
      output.push({ item: value, refIndex: 0 });
    });
    return output;
  }, [Directory]);

  // filter object for empty objects, strings and nulls using https://stackoverflow.com/a/38340730/8298314
  const filteredArgs = Object.fromEntries(
    Object.entries({
      $or:
        showControl.name.selection !== ''
          ? [
              {
                i: showControl.name.selection,
                s: showControl.name.selection,
                al: showControl.name.selection,
              },
            ]
          : null,
      o:
        showControl['Official Translation'].selection === 'Any' ? null : '=yes',
      ss:
        showControl['Scan Status'].selection === 'Any'
          ? null
          : `=${showControl['Scan Status'].selection}`,
      ps:
        showControl['Publish Status'].selection === 'Any'
          ? null
          : `=${showControl['Publish Status'].selection}`,
      t:
        showControl.Type.selection === 'Any'
          ? null
          : `=${showControl.Type.selection}`,
      a: showControl.a.selection,
      y: showControl.y.selection,
    }).filter(([, value]) =>
      Array.isArray(value) ? true : value !== null && value !== ''
    )
  );

  const search = React.useMemo<Fuse.FuseResult<MangaSearchList>[]>(
    () => fuse.search(filteredArgs),
    [fuse, filteredArgs]
  );
  const isUnfiltered = () => Object.keys(filteredArgs).length === 0;

  const result = isUnfiltered() ? FuseDirectory : search;
  const sorted = sortByScore
    ? result.filter(
        (value: Fuse.FuseResult<MangaSearchList>) =>
          showControl.Genre.selection.selected.every((genre) =>
            value.item.g.includes(genre)
          ) &&
          showControl.Genre.selection.selectednot.every(
            (genre) => !value.item.g.includes(genre)
          )
      )
    : result
        .filter(
          (value: Fuse.FuseResult<MangaSearchList>) =>
            showControl.Genre.selection.selected.every((genre) =>
              value.item.g.includes(genre)
            ) &&
            showControl.Genre.selection.selectednot.every(
              (genre) => !value.item.g.includes(genre)
            )
        )
        .sort((a, b) => {
          const possibleValues = [
            'Score',
            'Alphabetical A-Z',
            'Alphabetical Z-A',
            'Recently Released Chapter',
            'Year Released - Newest',
            'Year Released - Oldest',
            'Most Popular (All Time)',
            'Most Popular (Monthly)',
            'Least Popular',
          ];
          switch (showControl['Sort By'].selection) {
            case possibleValues[1]:
              return a.item.s.localeCompare(b.item.s);
            case possibleValues[2]:
              return -a.item.s.localeCompare(b.item.s);
            case possibleValues[3]:
              return a.item.lt < b.item.lt ? 1 : -1;
            case possibleValues[4]:
              return a.item.y < b.item.y ? 1 : -1;
            case possibleValues[5]:
              return a.item.y > b.item.y ? 1 : -1;
            case possibleValues[6]:
              return a.item.v < b.item.v ? 1 : -1;
            case possibleValues[7]:
              return a.item.vm < b.item.vm ? 1 : -1;
            case possibleValues[8]:
              return a.item.v > b.item.v ? 1 : -1;
            default:
              throw new Error('Not Implemented');
          }
        });

  const loadMore = () => {
    setRendered(sorted.slice(0, rendered.length + 30));
  };

  if (firstLoad) {
    loadMore();
    setfirstLoad(false);
  }

  function updateResult(name: keyof FilterControls, value: string) {
    setShowControl(
      update(showControl, {
        [name]: { selection: { $set: value } },
      })
    );
    setfirstLoad(true);
  }

  return (
    <Box width={0} icon={faSearch} title={`Search Manga `}>
      <Row>
        <Col md={4}>
          Series Name:{' '}
          <Form.Control
            onChange={(updateHandler) =>
              updateResult('name', updateHandler.target.value)
            }
            className="bottom-10"
          />
        </Col>
        <Col md={4} xs={8}>
          Author:{' '}
          <Form.Control
            onChange={(updateHandler) =>
              updateResult('a', updateHandler.target.value)
            }
            value={showControl.a.selection}
            className="bottom-10"
          />
        </Col>
        <Col md={4} xs={4}>
          Year:{' '}
          <Form.Control
            onChange={(updateHandler) =>
              updateResult('y', updateHandler.target.value)
            }
            value={showControl.y.selection}
            className="bottom-10"
          />
        </Col>
      </Row>
      <div className={CSS.SearchFilterNav}>
        <Button
          size="sm"
          variant={isFull ? 'primary' : 'outline-primary'}
          onClick={() => {
            setIsFull(true);
          }}
        >
          <FontAwesomeIcon icon={faFileInvoice} />
          {' Full Display'}
        </Button>{' '}
        <Button
          size="sm"
          variant={!isFull ? 'primary' : 'outline-primary'}
          onClick={() => {
            setIsFull(false);
          }}
        >
          <FontAwesomeIcon icon={faAlignLeft} />
          {' Simple Display'}
        </Button>
        {!isDefault() && (
          <Button
            className="float-right"
            size="sm"
            variant="outline-danger"
            onClick={() => setShowControl(defaultState)}
          >
            <FontAwesomeIcon icon={faUndoAlt} />
            {' Reset'}
          </Button>
        )}{' '}
        <Button
          size="sm"
          className="d-md-none float-right"
          variant={showFilterMobile ? 'primary' : 'outline-primary'}
          onClick={() => setShowFilterMobile(!showFilterMobile)}
        >
          <FontAwesomeIcon icon={faFilter} />
          {showFilterMobile ? ' Hide' : ' Show'}
        </Button>
      </div>
      <Row>
        <Col md={8} className="order-md-1 order-12">
          <InfiniteScroll
            dataLength={rendered.length}
            next={loadMore}
            hasMore={rendered.length < sorted.length}
            loader={
              <Alert variant="primary">
                <FontAwesomeIcon icon={faSpinner} spin /> Loading Results...
              </Alert>
            }
          >
            {rendered.map(({ item: manga }) => (
              <div className="top-15" key={manga.i}>
                <Row style={{ margin: 0 }}>
                  {isFull && (
                    <Col md={2} xs={4} style={{ paddingRight: 0 }}>
                      <Link to={`/manga/${manga.i}`} className={CSS.SeriesName}>
                        <img
                          className="img-fluid"
                          src={`https://cover.nep.li/cover/${manga.i}.jpg`}
                          alt="Cover"
                        />
                      </Link>
                    </Col>
                  )}
                  <Col md={isFull ? 10 : 0} xs={isFull ? 8 : 12}>
                    <Link to={`/manga/${manga.i}`} className={CSS.SeriesName}>
                      {decode(manga.s)}
                    </Link>
                    {manga.h && (
                      <FontAwesomeIcon title="Popular Manga" icon={faFireAlt} />
                    )}
                    {isFull && (
                      <div>
                        <div>
                          Author:{' '}
                          {manga.a.map((author, i) => (
                            <React.Fragment key={manga.i + author}>
                              <a
                                href="#"
                                onClick={(event) => {
                                  event.preventDefault();

                                  updateResult('a', author);
                                }}
                                onKeyPress={(event) => {
                                  event.preventDefault();

                                  if (event.key === 'Enter') {
                                    updateResult('a', author);
                                  }
                                }}
                              >
                                {author}
                              </a>
                              {i < manga.a.length - 1 ? ', ' : ''}
                            </React.Fragment>
                          ))}{' '}
                          &middot; Year:{' '}
                          <a
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();

                              updateResult('y', manga.y);
                            }}
                            onKeyPress={(event) => {
                              event.preventDefault();

                              if (event.key === 'Enter') {
                                updateResult('y', manga.y);
                              }
                            }}
                          >
                            {manga.y}
                          </a>
                        </div>
                        <div>
                          Status:{' '}
                          <a
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();

                              updateResult('Scan Status', manga.ss);
                            }}
                            onKeyPress={(event) => {
                              event.preventDefault();

                              if (event.key === 'Enter') {
                                updateResult('Scan Status', manga.ss);
                              }
                            }}
                          >
                            {manga.ss} (Scan)
                          </a>
                          ,
                          <a
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();

                              updateResult('Publish Status', manga.ps);
                            }}
                            onKeyPress={(event) => {
                              event.preventDefault();

                              if (event.key === 'Enter') {
                                updateResult('Publish Status', manga.ps);
                              }
                            }}
                          >
                            {manga.ps} (Publish)
                          </a>
                        </div>
                        <div>
                          Latest:{' '}
                          {manga.l === 'N/A' ? (
                            <i className={CSS.GrayLabel}>N/A</i>
                          ) : (
                            <Link
                              to={`/read/${manga.i}/${chapterURLEncode(
                                manga.l
                              )}`}
                            >
                              Chapter {ChapterDisplay(manga.l)}
                            </Link>
                          )}
                          {manga.lt > 0 && (
                            <span className={CSS.GrayLabel}>
                              &middot;
                              {new Date(manga.ls).toLocaleDateString(
                                undefined,
                                {
                                  day: 'numeric',
                                  month: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      Genres:{' '}
                      {manga.g.map((genre, i) => (
                        <React.Fragment key={manga.i + genre}>
                          <a
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();

                              setfirstLoad(true);
                              if (
                                !(
                                  showControl.Genre.selection as SelectType
                                ).selected.includes(genre) &&
                                !(
                                  showControl.Genre.selection as SelectType
                                ).selectednot.includes(genre)
                              )
                                setShowControl(
                                  update(showControl, {
                                    Genre: {
                                      selection: {
                                        selected: { $push: [genre] },
                                      },
                                    },
                                  })
                                );
                              else if (
                                (
                                  showControl.Genre.selection as SelectType
                                ).selected.includes(genre)
                              )
                                setShowControl(
                                  update(showControl, {
                                    Genre: {
                                      selection: {
                                        selected: {
                                          $splice: [
                                            [
                                              (
                                                showControl.Genre
                                                  .selection as SelectType
                                              ).selected.indexOf(genre),
                                              1,
                                            ],
                                          ],
                                        },
                                      },
                                    },
                                  })
                                );
                              else if (
                                (
                                  showControl.Genre.selection as SelectType
                                ).selectednot.includes(genre)
                              )
                                setShowControl(
                                  update(showControl, {
                                    Genre: {
                                      selection: {
                                        selected: { $push: [genre] },
                                        selectednot: {
                                          $splice: [
                                            [
                                              (
                                                showControl.Genre
                                                  .selection as SelectType
                                              ).selectednot.indexOf(genre),
                                              1,
                                            ],
                                          ],
                                        },
                                      },
                                    },
                                  })
                                );
                            }}
                          >
                            {genre}
                          </a>
                          {i < manga.g.length - 1 ? ', ' : ''}
                        </React.Fragment>
                      ))}
                    </div>
                    {isFull && manga.o === 'yes' && (
                      <div>
                        <Badge
                          variant="info"
                          onClick={(
                            event: React.MouseEvent<HTMLSpanElement>
                          ) => {
                            event.preventDefault();

                            updateResult('Official Translation', 'yes');
                          }}
                        >
                          Official Translation
                        </Badge>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            ))}
          </InfiniteScroll>
        </Col>
        <Col
          md={4}
          className={`order-md-12 order-1 ${
            showFilterMobile ? '' : 'd-none d-md-block'
          } ${CSS.FilterOptions}`}
        >
          {(() => {
            const sortables = {
              'Sort By': [
                'Score',
                'Alphabetical A-Z',
                'Alphabetical Z-A',
                'Recently Released Chapter',
                'Year Released - Newest',
                'Year Released - Oldest',
                'Most Popular (All Time)',
                'Most Popular (Monthly)',
                'Least Popular',
              ],
              'Official Translation': ['Any', 'Official Translation Only'],
              'Scan Status': [
                'Any',
                'Cancelled',
                'Complete',
                'Discontinued',
                'Hiatus',
                'Ongoing',
              ],
              'Publish Status': [
                'Any',
                'Cancelled',
                'Complete',
                'Discontinued',
                'Hiatus',
                'Ongoing',
              ],
              Type: [
                'Any',
                'Doujinshi',
                'Manga',
                'Manhua',
                'Manhwa',
                'OEL',
                'One-shot',
              ],
              Genre: [
                'Any',
                'Action',
                'Adult',
                'Adventure',
                'Comedy',
                'Doujinshi',
                'Drama',
                'Ecchi',
                'Fantasy',
                'Gender Bender',
                'Harem',
                'Hentai',
                'Historical',
                'Horror',
                'Isekai',
                'Josei',
                'Lolicon',
                'Martial Arts',
                'Mature',
                'Mecha',
                'Mystery',
                'Psychological',
                'Romance',
                'School Life',
                'Sci-fi',
                'Seinen',
                'Shotacon',
                'Shoujo',
                'Shoujo Ai',
                'Shounen',
                'Shounen Ai',
                'Slice of Life',
                'Smut',
                'Sports',
                'Supernatural',
                'Tragedy',
                'Yaoi',
                'Yuri',
              ],
            };

            return (Object.keys(sortables) as (keyof typeof sortables)[]).map(
              (key: keyof typeof sortables) => (
                <ListGroup key={key} className="top-15">
                  <ListGroup.Item
                    className={`${CSS.HeaderItem} ${CSS['list-group-item']}`}
                    onClick={() => {
                      setShowControl(
                        update(showControl, {
                          [key]: { $toggle: ['open'] },
                        })
                      );
                      setfirstLoad(true);
                    }}
                  >
                    {key}
                    <FontAwesomeIcon
                      className="float-right"
                      icon={showControl[key].open ? faCaretDown : faCaretUp}
                    />
                  </ListGroup.Item>
                  {showControl[key].open &&
                    (sortables[key] as string[]).map((sort) => (
                      <ListGroup.Item
                        action
                        className={CSS['list-group-item']}
                        key={sort}
                        onClick={() => {
                          setfirstLoad(true);
                          if (typeof showControl[key].selection === 'string')
                            setShowControl(
                              update(showControl, {
                                [key]: { selection: { $set: sort } },
                              })
                            );
                          else if (sort === 'Any')
                            setShowControl(
                              update(showControl, {
                                [key]: {
                                  selection: {
                                    selected: {
                                      $splice: [
                                        [
                                          0,
                                          (
                                            showControl[key]
                                              .selection as SelectType
                                          ).selected.length,
                                        ],
                                      ],
                                    },
                                    selectednot: {
                                      $splice: [
                                        [
                                          0,
                                          (
                                            showControl[key]
                                              .selection as SelectType
                                          ).selectednot.length,
                                        ],
                                      ],
                                    },
                                  },
                                },
                              })
                            );
                          else if (
                            !(
                              showControl[key].selection as SelectType
                            ).selected.includes(sort) &&
                            !(
                              showControl[key].selection as SelectType
                            ).selectednot.includes(sort)
                          )
                            setShowControl(
                              update(showControl, {
                                [key]: {
                                  selection: { selected: { $push: [sort] } },
                                },
                              })
                            );
                          else if (
                            (
                              showControl[key].selection as SelectType
                            ).selected.includes(sort)
                          )
                            setShowControl(
                              update(showControl, {
                                [key]: {
                                  selection: {
                                    selected: {
                                      $splice: [
                                        [
                                          (
                                            showControl[key]
                                              .selection as SelectType
                                          ).selected.indexOf(sort),
                                          1,
                                        ],
                                      ],
                                    },
                                    selectednot: {
                                      $push: [sort],
                                    },
                                  },
                                },
                              })
                            );
                          else if (
                            (
                              showControl[key].selection as SelectType
                            ).selectednot.includes(sort)
                          )
                            setShowControl(
                              update(showControl, {
                                [key]: {
                                  selection: {
                                    selectednot: {
                                      $splice: [
                                        [
                                          (
                                            showControl[key]
                                              .selection as SelectType
                                          ).selectednot.indexOf(sort),
                                          1,
                                        ],
                                      ],
                                    },
                                  },
                                },
                              })
                            );
                        }}
                      >
                        {sort}
                        {((typeof showControl[key].selection === 'string' &&
                          showControl[key].selection === sort) ||
                          (typeof showControl[key].selection === 'object' &&
                            (
                              showControl[key].selection as SelectType
                            ).selected.includes(sort)) ||
                          (typeof showControl[key].selection === 'object' &&
                            sort === 'Any' &&
                            (showControl[key].selection as SelectType).selected
                              .length === 0 &&
                            (showControl[key].selection as SelectType)
                              .selectednot.length === 0)) && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="float-right"
                            style={{ color: 'green' }}
                          />
                        )}
                        {typeof showControl[key].selection === 'object' &&
                          (
                            showControl[key].selection as SelectType
                          ).selectednot.includes(sort) && (
                            <FontAwesomeIcon
                              icon={faTimes}
                              className="float-right"
                              style={{ color: 'red' }}
                            />
                          )}
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              )
            );
          })()}
        </Col>
      </Row>
    </Box>
  );
}
