import React from 'react';
import useSWR from 'swr';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

import { decode } from 'he';
import { Alert, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Store from '../APIs/storage';
import Box from '../Global/Box';

function mergeGenres(genres: number[], allGenres: string[]) {
  const genreArray = [];
  for (let i = 0; i < genres.length; i += 1) {
    genreArray.push(allGenres[genres[i]]);
  }
  return genreArray.join(', ');
}

export default function Directory() {
  const { data: FullDirectory } = useSWR('/api/FullDirectory');
  const [Loaded, setLoaded] = React.useState([]);
  const [firstLoad, setfirstLoad] = React.useState(true);
  const loadMore = () =>
    setLoaded(FullDirectory.Directory.slice(0, Loaded.length + 20));

  const store = new Store();
  if (!FullDirectory) return <>Loading...</>;
  if (navigator.onLine) {
    store.set('lastFullDirectory', FullDirectory);
  }
  if (firstLoad) {
    loadMore();
    setfirstLoad(false);
  }
  return (
    <>
      <Box
        width={8}
        icon={faFolderOpen}
        title={`Directory (${FullDirectory.Directory.length})`}
      >
        A full list of all Manga available on MangaSee
        <InfiniteScroll
          dataLength={Loaded.length}
          next={loadMore}
          scrollThreshold={0.5}
          hasMore={Loaded.length < FullDirectory.Directory.length}
          loader={
            <Alert variant="primary">
              <FontAwesomeIcon icon={faSpinner} spin /> Loading Directory...
            </Alert>
          }
        >
          {Loaded.map(
            (manga: { i: string; st: string; s: string; g: number[] }) => (
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
            )
          )}
        </InfiniteScroll>
      </Box>
      <Col lg={4}>
        <Link to="/manga/Berserk">
          <img
            className="img-fluid"
            alt="Link to Berserk"
            src="https://i.imgur.com/el0l9Fk.jpg"
          />
        </Link>
      </Col>
    </>
  );
}
