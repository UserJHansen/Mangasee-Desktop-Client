import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import DiscussionResult from 'renderer/Interfaces/DiscussionResult';
import useSWR from 'swr';
import InfiniteScroll from 'react-infinite-scroll-component';
import TimeAgo from 'react-timeago';

import {
  faComments,
  faFileAlt,
  faLightbulb,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBullhorn,
  faPenAlt,
  faQuestion,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, FormControl, Row } from 'react-bootstrap';

import CSS from './Discussion.module.scss';
import AdjustedDate from '../Global/AdjustedDate';
import Box from '../Global/Box';

export default function Discussion() {
  const navigate = useNavigate();
  function handleClick(path: string) {
    navigate(path);
  }

  const { Discussions } = useSWR('/api/set/Discussion').data as {
    Discussions: DiscussionResult[];
  };

  const [search, setSearch] = React.useState('');
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [rendered, setRendered] = React.useState<DiscussionResult[]>([]);

  const results = Discussions.filter(
    (post) =>
      post.PostTitle.toLowerCase().includes(search.toLowerCase()) ||
      post.PostType.toLowerCase().includes(search.toLowerCase())
  );

  const loadMore = () => {
    setRendered(results.slice(0, rendered.length + 30));
  };

  if (firstLoad) {
    loadMore();
    setFirstLoad(false);
  }

  return (
    <Box title="Discussion" icon={faComments} width={12}>
      <Row className="top-5 bottom-15">
        <Col lg={9} xs={8}>
          <FormControl
            placeholder="Search Discussion..."
            onChange={(e) => {
              setSearch(e.target.value);
              setFirstLoad(true);
            }}
          />
        </Col>
        <Col lg={3} xs={4}>
          <Button
            onClick={() => handleClick('/Discussion/Create')}
            variant="primary"
            style={{ width: '100%' }}
          >
            <FontAwesomeIcon icon={faPenAlt} /> New Post
          </Button>
        </Col>
      </Row>
      <InfiniteScroll
        dataLength={rendered.length}
        next={loadMore}
        hasMore={rendered.length < results.length}
        loader={
          <div className="bottom-5">
            <FontAwesomeIcon icon={faSpinner} spin />
            Loading Discussion...
          </div>
        }
        className="d-flex"
        style={{ flexDirection: 'column' }}
      >
        {rendered.map((post) => (
          <div
            key={post.PostID}
            className={`top-5 bottom-5 ${CSS.Post} ${
              post.PostType === 'Announcement' ? CSS.PostAnnouncement : ''
            } ${post.TimeOrder ? 'order-0' : 'order-12'}`}
          >
            <div className={CSS.PostTitle}>
              <Link to={`/Discussion/${post.PostID}`}>{post.PostTitle}</Link>
            </div>
            <div className={`${CSS.PostDesc} top-5`}>
              {post.PostType === '' && (
                <span className={`${CSS.PostType} ${CSS.General}`}>
                  <FontAwesomeIcon icon={faFileAlt} />
                </span>
              )}
              {post.PostType === 'Request' && (
                <span className={`${CSS.PostType} ${CSS.Request}`}>
                  <FontAwesomeIcon icon={faLightbulb} />
                </span>
              )}
              {post.PostType === 'Question' && (
                <span className={`${CSS.PostType} ${CSS.Question}`}>
                  <FontAwesomeIcon icon={faQuestion} />
                </span>
              )}
              {post.PostType === 'Announcement' && (
                <span className={`${CSS.PostType} ${CSS.Announcement}`}>
                  <FontAwesomeIcon icon={faBullhorn} />
                </span>
              )}
              <span className={CSS.Comments}>
                <FontAwesomeIcon icon={faComments} /> {post.CountComment}
              </span>{' '}
              by <span className={CSS.Author}>{post.Username}</span> &middot;{' '}
              <TimeAgo date={new AdjustedDate(post.TimePosted)} /> &middot;
              {` ${new AdjustedDate(post.TimePosted).toLocaleDateString()}`}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </Box>
  );
}
