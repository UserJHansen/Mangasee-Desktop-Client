import React, { useEffect, useState } from 'react';

import Fuse from 'fuse.js';
import useSWR, { useSWRConfig } from 'swr';

import {
  faFileInvoice,
  faAlignLeft,
  faThumbtack,
  faEraser,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Col,
  Dropdown,
  FormControl,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
  Row,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import ReactTimeago from 'react-timeago';

import { ChapterDisplay, chapterURLEncode } from '../Global/DisplayTools';
import mangaAPIFetcher from '../APIs/mangaAPI';
import BookmarkResult from '../Interfaces/BookmarkResult';
import AdjustedDate from '../Global/AdjustedDate';

import Box from '../Global/Box';
import CSS from './Bookmarks.module.scss';

export type SearchType = 'Relevance' | 'Recent' | 'A-Z' | 'Z-A';

export default function BookmarksPage() {
  const [modalShow, setModalShow] = useState(false);

  const [searchString, setsearchString] = React.useState('');

  const { sort: defaultSortBy, fullDisplay: defaultFullDisplay } =
    window.ElectronStore().subPreferences || {
      sort: 'Relevance',
      fullDisplay: true,
    };

  const [sortBy, setSortBy] = React.useState<SearchType>(
    defaultSortBy === 'New' ? 'Recent' : defaultSortBy
  );
  const [fullDisplay, setFullDisplay] = React.useState(defaultFullDisplay);

  useEffect(() => {
    window.setStoreValue('subPreferences', { sort: sortBy, fullDisplay });
  }, [sortBy, fullDisplay]);

  const Bookmarks = (
    useSWR('/api/set/Bookmarks').data as {
      Bookmarks: BookmarkResult[];
    }
  ).Bookmarks.reverse();
  const { mutate } = useSWRConfig();

  const fuse = React.useMemo(
    () =>
      new Fuse(Bookmarks, {
        keys: ['SeriesName'],
        shouldSort: sortBy === 'Relevance',
        threshold: 0.25,
        ignoreFieldNorm: true,
        ignoreLocation: true,
      }),
    [Bookmarks, sortBy]
  );
  const FuseDirectory = React.useMemo(() => {
    const output: Fuse.FuseResult<BookmarkResult>[] = [];
    Bookmarks.forEach((value) => {
      output.push({ item: value, refIndex: 0 });
    });
    return output;
  }, [Bookmarks]);

  const search = React.useMemo<Fuse.FuseResult<BookmarkResult>[]>(
    () => fuse.search(searchString),
    [fuse, searchString]
  );
  const isUnfiltered = () => searchString === '';

  const result = isUnfiltered() ? FuseDirectory : search;
  const sorted =
    sortBy === 'Relevance'
      ? result
      : result.sort((a, b) => {
          switch (sortBy) {
            case 'Recent':
              return b.item.DateStamp - a.item.DateStamp;
            case 'A-Z':
              return a.item.SeriesName.localeCompare(b.item.SeriesName);
            case 'Z-A':
              return b.item.SeriesName.localeCompare(a.item.SeriesName);
            default:
              throw new Error('Not Implemented');
          }
        });

  return (
    <Box width={12} title={`Bookmarks (${sorted.length})`} icon={faThumbtack}>
      {Bookmarks.length === 0 ? (
        <>You don&apos;t have any Bookmarks yet.</>
      ) : (
        <>
          <InputGroup className="top-5 bottom-5">
            <FormControl
              placeholder="Search Bookmarks..."
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
            </Col>
            <Col xs={7} sm={5} className="text-right">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setModalShow(true)}
              >
                <FontAwesomeIcon icon={faEraser} /> Clear All
              </Button>{' '}
              <Modal show={modalShow} style={{ color: '#000' }}>
                <Modal.Header closeButton>
                  <ModalTitle>Clear All Bookmarks</ModalTitle>
                </Modal.Header>
                <ModalBody>
                  Are you sure you want to clear all Bookmarks? This action
                  cannot be undone
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="secondary"
                    onClick={() => setModalShow(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      (mangaAPIFetcher('/delete/Bookmarks') as Promise<void>)
                        .then(() =>
                          mutate(
                            '/api/set/Bookmarks',
                            {
                              Bookmarks: [],
                            },
                            true
                          )
                        )
                        .catch((e) => {
                          // eslint-disable-next-line no-console
                          console.error(e);
                        });
                      setModalShow(false);
                    }}
                  >
                    Yes, Clear All
                  </Button>
                </ModalFooter>
              </Modal>
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
                    Recent Bookmarks
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

          <Row>
            {sorted.map((manga) => (
              <Col md={6} key={manga.item.IndexName + manga.item.DateStamp}>
                <Row className={CSS.Chapter}>
                  {fullDisplay && (
                    <Col xs={4} className={CSS.Image}>
                      <Link to={`/manga/${manga.item.IndexName}`}>
                        <img
                          src={`https://cover.nep.li/cover/${manga.item.IndexName}.jpg`}
                          alt={`Cover for ${manga.item.SeriesName}`}
                        />
                      </Link>
                    </Col>
                  )}
                  <Col xs={8} className={CSS.Label}>
                    <Link
                      to={`/manga/${manga.item.IndexName}/${chapterURLEncode(
                        manga.item.Chapter
                      )}${
                        manga.item.Page === '0' ? '' : `/${manga.item.Page}`
                      }`}
                      style={{ display: 'block' }}
                    >
                      <div className={CSS.Clipped}>{manga.item.SeriesName}</div>
                      <strong>
                        Chapter {ChapterDisplay(manga.item.Chapter)}{' '}
                        {manga.item.Page === '0'
                          ? ''
                          : ` Page ${manga.item.Page}`}
                      </strong>
                    </Link>
                    {fullDisplay && (
                      <>
                        <div
                          className="top-5 bottom-5"
                          style={{ color: 'gray' }}
                        >
                          <FontAwesomeIcon icon={faClock} />{' '}
                          <ReactTimeago
                            date={new AdjustedDate(manga.item.Date)}
                          />
                        </div>
                        <div>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => {
                              (
                                mangaAPIFetcher(
                                  `/delete/Bookmark/${window.btoa(
                                    JSON.stringify(manga.item)
                                  )}`
                                ) as Promise<void>
                              )
                                .then(() =>
                                  mutate(
                                    '/api/set/Bookmarks',
                                    {
                                      Bookmarks: Bookmarks.filter(
                                        (b) =>
                                          b.IndexName !==
                                            manga.item.IndexName ||
                                          b.Chapter !== manga.item.Chapter ||
                                          b.Page !== manga.item.Page
                                      ),
                                    },
                                    true
                                  )
                                )
                                .catch((e) => {
                                  // eslint-disable-next-line no-console
                                  console.error(e);
                                });
                            }}
                          >
                            <FontAwesomeIcon icon={faTimes} /> Remove
                          </Button>
                        </div>
                      </>
                    )}
                  </Col>
                  {!fullDisplay && (
                    <Col xs={4} className={`${CSS.SimpleNav} text-right`}>
                      <Button
                        size="sm"
                        onClick={() => {
                          (
                            mangaAPIFetcher(
                              `/delete/Bookmark/${window.btoa(
                                JSON.stringify(manga.item)
                              )}`
                            ) as Promise<void>
                          )
                            .then(() =>
                              mutate(
                                '/api/set/Bookmarks',
                                {
                                  Bookmarks: Bookmarks.filter(
                                    (b) =>
                                      b.IndexName !== manga.item.IndexName ||
                                      b.Chapter !== manga.item.Chapter ||
                                      b.Page !== manga.item.Page
                                  ),
                                },
                                true
                              )
                            )
                            .catch((e) => {
                              // eslint-disable-next-line no-console
                              console.error(e);
                            });
                        }}
                        className={CSS['btn-link']}
                        variant="link"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </Col>
                  )}
                </Row>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Box>
  );
}
