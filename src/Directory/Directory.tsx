import React from 'react';

import useSWR from 'swr';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

import { decode } from 'he';
import {
  Alert,
  Button,
  Col,
  Row,
  OverlayTrigger,
  Tooltip,
  ButtonGroup,
} from 'react-bootstrap';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import Box from '../Global/Box';

import MangaReturn from '../Interfaces/MangaReturn';
import fastFilter from '../Global/fastFilter';
import Store from '../APIs/storage';

function mergeGenres(genres: number[], allGenres: string[]) {
  const genreArray = [];
  for (let i = 0; i < genres.length; i += 1) {
    genreArray.push(allGenres[genres[i]]);
  }
  return genreArray.join(', ');
}

export default function Directory() {
  const { data: FullDirectory } = useSWR('/api/FullDirectory');
  const [Loaded, setLoaded] = React.useState<MangaReturn[]>([]);
  const [firstLoad, setfirstLoad] = React.useState(true);
  const [selected, setSelected] = React.useState('All');

  const loadMore = () =>
    setLoaded(
      selected === 'All'
        ? FullDirectory.Directory.slice(0, Loaded.length + 30)
        : fastFilter(
            (manga: MangaReturn) => manga.s.charAt(0) === selected,
            FullDirectory?.Directory
          ).slice(0, Loaded.length + 30)
    );
  const getLength = () =>
    (selected === 'All'
      ? FullDirectory.Directory
      : fastFilter(
          (manga: MangaReturn) => manga.s.charAt(0) === selected,
          FullDirectory?.Directory
        )
    ).length;
  const forceReload = () => {
    if (FullDirectory) {
      setLoaded(
        selected === 'All'
          ? FullDirectory.Directory.slice(0, 30)
          : fastFilter(
              (manga: MangaReturn) => manga.s.charAt(0) === selected,
              FullDirectory.Directory
            ).slice(0, 30)
      );
    }
  };
  React.useEffect(forceReload, [FullDirectory, selected]);

  if (!FullDirectory) return <>Loading...</>;
  if (navigator.onLine) {
    const store = new Store();
    store.set('lastFullDirectory', FullDirectory);
  }

  if (firstLoad) {
    loadMore();
    setfirstLoad(false);
  }

  return (
    <Row>
      <Box width={8} icon={faFolderOpen} title={`Directory (${getLength()})`}>
        A full list of all Manga available on MangaSee
        <ButtonGroup className="top-10" style={{ display: 'block' }} size="sm">
          {['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')].map(
            (character) => (
              <Button
                style={{
                  padding: '0px 5px',
                }}
                key={character}
                variant={selected === character ? 'primary' : 'outline-dark'}
                onClick={() => {
                  setSelected(character);
                }}
              >
                {character}
              </Button>
            )
          )}
        </ButtonGroup>
        <InfiniteScroll
          dataLength={Loaded.length}
          next={loadMore}
          hasMore={Loaded.length < getLength()}
          loader={
            <Alert variant="primary">
              <FontAwesomeIcon icon={faSpinner} spin /> Loading Directory...
            </Alert>
          }
        >
          {Loaded.map((manga: MangaReturn) => (
            <div key={manga.s} className="top-15">
              <OverlayTrigger
                placement="right"
                overlay={(props) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <Tooltip {...props} id={`tooltip${manga.s}`}>
                    <div style={{ textAlign: 'left' }}>
                      <img
                        style={{
                          width: '100%',
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                        className="TooltipImg"
                        alt="Cover"
                        src={`https://cover.nep.li/cover/${manga.i}.jpg`}
                      />
                      <br />
                      <b>Status:</b> {manga.st}
                      <br />
                      <b>Genre:</b>{' '}
                      {mergeGenres(manga.g, FullDirectory.AllGenres)}
                    </div>
                  </Tooltip>
                )}
              >
                <Link to={`/manga/${manga.i}`}>
                  {decode(manga.s)}
                  <i style={{ color: '#CCC' }}>
                    {manga.st === 'Complete' ? ' Complete' : ''}
                  </i>
                </Link>
              </OverlayTrigger>
            </div>
          ))}
        </InfiniteScroll>
      </Box>
      <Col
        md={4}
        style={{
          marginTop: 15,
          marginBottom: 15,
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
    </Row>
  );
}
