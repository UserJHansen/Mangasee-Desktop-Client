/* eslint-disable no-console */
import {
  faClock,
  faCommentDots,
  faLightbulb,
  faUser,
  faComments,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBullhorn,
  faQuestion,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Dropdown, FormControl, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import ReactTimeago from 'react-timeago';
import useSWR, { useSWRConfig } from 'swr';

import mangaAPIFetcher from '../APIs/mangaAPI';
import AdjustedDate from '../Global/AdjustedDate';
import Box from '../Global/Box';
import PostResult from '../Interfaces/PostResult';
import CSS from './Display.module.scss';

export default function DisplayPost() {
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();

  const { postId } = useParams<{ postId: string }>();
  const { data: post } = useSWR<PostResult | string>(`/api/Post/${postId}`);

  const [draftReply, setDraftReply] = React.useState('');

  const [showDelete, setShowDelete] = React.useState(false);

  const [replyingTo, setReplyingTo] = React.useState<string>('0');
  const [replyMessage, setReplyMessage] = React.useState<string>('');

  if (!post) return <></>;
  if (typeof post === 'string') {
    navigate('/Discussion');
    return <></>;
  }

  const handleDelete = () => setShowDelete(true);
  const handleDeleteClose = () => setShowDelete(false);
  const handleDeletePost = () => {
    mangaAPIFetcher(`/delete/Post/${postId}`);
    mutate(`/api/Post/${postId}`, 'No Post');
    handleDeleteClose();
  };

  const submitReply = () => {
    if (draftReply.length < 1) return;

    setDraftReply('');
    (
      mangaAPIFetcher(
        `/add/Reply/${post.PostID}/${window.encodeURIComponent(draftReply)}`
      ) as Promise<void>
    )
      .then(() =>
        mutate(
          `/api/Post/${postId}`,
          {
            ...post,
            Comments: [
              {
                CommentID: '-1',
                UserID: window.ElectronStore().UserId,
                Username: window.ElectronStore().Username,
                CommentContent: draftReply,
                TimeCommented: `${new Date(Date.now() - 9 * 60 * 60 * 1000)}`,
                ReplyCount: '0',
                LikeCount: '0',
                Liked: false,
                ShowReply: false,
                Replying: false,
                ReplyLimit: 1,
                ReplyMessage: '',
                Replies: [],
              },
              ...post.Comments,
            ],
          },
          true
        )
      )
      .catch(console.error);
  };

  const replyCount = post.Comments.reduce(
    (prev, curr) => prev + curr.Replies.length,
    0
  );

  const iconRef = React.forwardRef((props: FontAwesomeIconProps, ref) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FontAwesomeIcon {...props} forwardedRef={ref} />
  ));

  return (
    <Box
      width={12}
      title={post.PostType === '' ? 'General' : post.PostType}
      icon={
        // eslint-disable-next-line no-nested-ternary
        post.PostType === ''
          ? faCommentDots
          : // eslint-disable-next-line no-nested-ternary
          post.PostType === 'Request'
          ? faLightbulb
          : // eslint-disable-next-line no-nested-ternary
          post.PostType === 'Question'
          ? faQuestion
          : faBullhorn
      }
    >
      <h1>{post.PostTitle}</h1>
      <div className={`top-15 ${CSS.Description}`}>
        <span>
          <FontAwesomeIcon icon={faUser} /> {post.Username}
        </span>
        <FontAwesomeIcon icon={faClock} />
        {` ${new Date(post.TimePosted).toLocaleDateString()}`}
      </div>
      <div className={`top-15 ${CSS.Content}`}>{post.PostContent}</div>
      {window.ElectronStore().UserId === parseInt(post.UserID, 10) && (
        <div className="top-15" style={{ display: 'inline-block' }}>
          <Button size="sm" variant="outline-secondary" onClick={handleDelete}>
            Delete Post
          </Button>
          <Modal
            show={showDelete}
            onHide={handleDeleteClose}
            style={{ color: 'black' }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleDeleteClose}>
                Close
              </Button>
              <Button variant="danger" onClick={handleDeletePost}>
                Confirm Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
      <div className={`top-20 bottom-5 ${CSS.CommentArea}`}>
        <h2>
          <FontAwesomeIcon icon={faComments} />{' '}
          {post.Comments.length + replyCount}{' '}
          {post.Comments.length + replyCount === 1 ? 'Comment' : 'Comments'}
        </h2>
        <div className={`top-15 ${CSS.CommentForm}`}>
          <FormControl
            as="textarea"
            placeholder="Write Comment Here..."
            value={draftReply}
            onChange={(event) => setDraftReply(event.target.value)}
          />
          <div className="top-10 text-right">
            <Button variant="primary" onClick={submitReply}>
              Submit
            </Button>
          </div>
        </div>
        <div className={CSS.Comments}>
          {post.Comments.map((comment) => (
            <div className={`top-10 ${CSS.Comment}`} key={comment.CommentID}>
              <div className={CSS.CommentTop}>
                <strong>{comment.Username}</strong> &middot;{' '}
                <ReactTimeago date={new AdjustedDate(comment.TimeCommented)} />
                {window.ElectronStore().UserId ===
                  parseInt(comment.UserID, 10) && (
                  <div className="float-right">
                    <Dropdown>
                      <Dropdown.Toggle
                        as={iconRef}
                        role="button"
                        icon={faTimes}
                      />

                      <Dropdown.Menu className="dropleft dropdown-menu-right">
                        <Dropdown.Item
                          onClick={() => {
                            (
                              mangaAPIFetcher(
                                `/delete/PostComment/${post.PostID}/${comment.CommentID}`
                              ) as Promise<void>
                            )
                              .then(() =>
                                mutate(
                                  `/api/Post/${postId}`,
                                  {
                                    ...post,
                                    Comments: [
                                      ...post.Comments.filter(
                                        (c) => c.CommentID !== comment.CommentID
                                      ),
                                    ],
                                  },
                                  true
                                )
                              )
                              .catch(console.error);
                          }}
                        >
                          Confirm Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}
              </div>
              <div className={`top-10 ${CSS.Content}`}>
                {comment.CommentContent}
              </div>
              <div className={`top-10 ${CSS.ReplyNav}`}>
                +{comment.LikeCount} ·{' '}
                <Button
                  style={{
                    color: 'gray',
                    marginRight: 5,
                    backgroundColor: '#fff',
                    padding: 0,
                    border: 0,
                  }}
                  onClick={() => {
                    (
                      mangaAPIFetcher(
                        `/like/Comment/${comment.CommentID}/${!comment.Liked}`
                      ) as Promise<void>
                    )
                      .then(() =>
                        mutate(
                          `/api/Post/${postId}`,
                          {
                            ...post,
                            Comments: [
                              ...post.Comments.map((c) => ({
                                ...c,
                                LikeCount: (
                                  parseInt(c.LikeCount, 10) +
                                  // eslint-disable-next-line no-nested-ternary
                                  (c.CommentID === comment.CommentID
                                    ? comment.Liked
                                      ? -1
                                      : 1
                                    : 0)
                                ).toString(),
                                Liked:
                                  c.CommentID === comment.CommentID
                                    ? !c.Liked
                                    : c.Liked,
                              })),
                            ],
                          },
                          true
                        )
                      )
                      .catch(console.error);
                  }}
                >
                  like
                </Button>
                ·{' '}
                <Button
                  style={{
                    color: 'gray',
                    marginRight: 5,
                    backgroundColor: '#fff',
                    padding: 0,
                    border: 0,
                  }}
                  onClick={() => {
                    setReplyingTo(comment.CommentID);
                  }}
                >
                  reply
                </Button>
              </div>
              {comment.Replies.map((reply) => (
                <div className={`top-10 ${CSS.Reply}`} key={reply.CommentID}>
                  <div className={`top-10 ${CSS.CommentTop}`}>
                    <strong>{reply.Username}</strong> &middot;{' '}
                    <ReactTimeago
                      date={new AdjustedDate(reply.TimeCommented)}
                    />
                    {window.ElectronStore().UserId ===
                      parseInt(reply.UserID, 10) && (
                      <div className="float-right">
                        <Dropdown>
                          <Dropdown.Toggle
                            as={iconRef}
                            role="button"
                            icon={faTimes}
                          />

                          <Dropdown.Menu className="dropleft dropdown-menu-right">
                            <Dropdown.Item
                              onClick={() => {
                                (
                                  mangaAPIFetcher(
                                    `/delete/CommentReply/${comment.CommentID}/${reply.CommentID}`
                                  ) as Promise<void>
                                )
                                  .then(() =>
                                    mutate(
                                      `/api/Post/${postId}`,
                                      {
                                        ...post,
                                        Comments: [
                                          ...post.Comments.map((c) =>
                                            c.CommentID !== comment.CommentID
                                              ? c
                                              : {
                                                  ...c,
                                                  Replies: c.Replies.filter(
                                                    (r) =>
                                                      r.CommentID !==
                                                      reply.CommentID
                                                  ),
                                                  ReplyCount: (
                                                    parseInt(c.ReplyCount, 10) -
                                                    1
                                                  ).toString(),
                                                }
                                          ),
                                        ],
                                      },
                                      true
                                    )
                                  )
                                  .catch(console.error);
                              }}
                            >
                              Confirm Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    )}
                  </div>
                  <div className={`top-10 ${CSS.Content}`}>
                    {reply.CommentContent}
                  </div>
                </div>
              )).reverse()}
              {replyingTo === comment.CommentID && (
                <div className={CSS.ReplyMessage}>
                  <textarea
                    className="form-control top-10"
                    placeholder="Write Reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                  <div className="text-right top-10">
                    <Button
                      size="sm"
                      onClick={() => {
                        setReplyMessage('');

                        (
                          mangaAPIFetcher(
                            `/add/ReplyComment/${
                              comment.CommentID
                            }/${window.encodeURIComponent(replyMessage)}`
                          ) as Promise<void>
                        )
                          .then(() =>
                            mutate(
                              `/api/Post/${postId}`,
                              {
                                ...post,
                                Comments: [
                                  ...post.Comments.map((c) =>
                                    c.CommentID !== comment.CommentID
                                      ? c
                                      : {
                                          ...c,
                                          Replies: [
                                            {
                                              CommentID: '',
                                              UserID: '',
                                              Username:
                                                window.ElectronStore().Username,
                                              CommentContent: replyMessage,
                                              TimeCommented: `${new Date(
                                                Date.now() - 9 * 60 * 60 * 1000
                                              )}`,
                                            },
                                            ...c.Replies,
                                          ],
                                          ReplyCount: (
                                            parseInt(c.ReplyCount, 10) + 1
                                          ).toString(),
                                        }
                                  ),
                                ],
                              },
                              true
                            )
                          )
                          .catch(console.error);
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}
