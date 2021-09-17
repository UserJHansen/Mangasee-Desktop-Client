import React from 'react';
import useSWR from 'swr';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

import { decode } from 'he';
import { Alert, Col } from 'react-bootstrap';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Store from '../APIs/storage';
import Box from '../Global/Box';

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
          {Loaded.map((manga: { i: string; st: string; s: string }) => (
            <div key={manga.s} className="top-15">
              <Link to={`/manga/${manga.i}`}>
                {decode(manga.s)}
                <i style={{ color: '#CCC' }}>
                  {manga.st === 'Complete' ? ' Complete' : ''}
                </i>
              </Link>
            </div>
          ))}
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
