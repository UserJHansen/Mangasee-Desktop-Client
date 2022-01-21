import useSWR from 'swr';

import { faRss } from '@fortawesome/free-solid-svg-icons';
import { Row } from 'react-bootstrap';

import FeedType from '../Interfaces/FeedType';

import Box from '../Global/Box';
import { FeedCard } from '../Global/Cards';

export default function Feed() {
  const { Feed: feed } = useSWR<{ Feed: FeedType[] }>('/api/set/feed').data || {
    Feed: [],
  };

  return (
    <Box width={12} title="Subscription Feed" icon={faRss}>
      <Row>
        {feed.map((manga) => (
          <FeedCard manga={manga} key={manga.SeriesID} />
        ))}
      </Row>
    </Box>
  );
}
