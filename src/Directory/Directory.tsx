import React from 'react';
import useSWR from 'swr';
import { Link } from 'react-router-dom';

import { Col } from 'react-bootstrap';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';

import Store from '../APIs/storage';
import Box from '../Global/Box';

export default function Directory() {
  const { data: FullDirectory } = useSWR('/api/FullDirectory');

  const store = new Store();
  if (!FullDirectory) return <>Loading...</>;
  if (navigator.onLine) {
    store.set('lastFullDirectory', FullDirectory);
  }
  return (
    <>
      <Box
        width={8}
        icon={faFolderOpen}
        title={`Directory (${FullDirectory.Directory.length})`}
      >
        A full list of all Manga available on MangaSee
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
