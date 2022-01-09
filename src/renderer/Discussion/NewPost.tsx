import { useState } from 'react';
import { useNavigate } from 'react-router';

import { faPenAlt } from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, FormControl } from 'react-bootstrap';

import axios from 'axios';

import Box from '../Global/Box';

const submitPost = async function submitPost(
  title: string,
  content: string,
  type: string
) {
  axios.defaults.baseURL = 'https://mangasee123.com';
  axios.defaults.withCredentials = true;

  return axios.post('/discussion/new.post.php', {
    PostTitle: title,
    PostContent: content,
    PostType: type,
  });
};

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();

  return (
    <Box width={12} icon={faPenAlt} title="New Post">
      Title (max 200 characters)
      <FormControl
        className="bottom-15"
        onChange={(e) => setTitle(e.target.value)}
      />
      Content (max 5,000 characters)
      <FormControl
        as="textarea"
        rows={10}
        className="bottom-15"
        onChange={(e) => setContent(e.target.value)}
      />
      Type
      <FormControl
        as="select"
        className="bottom-15"
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">General</option>
        <option value="Request">Request</option>
        <option value="Question">Question</option>
      </FormControl>
      <div className="text-right bottom-5">
        <Button
          variant="primary"
          onClick={() =>
            submitPost(title, content, type).then((t) =>
              t.data.success
                ? navigate(`/discussion/${t.data.val}`)
                : setError(t.data.val)
            )
          }
        >
          Submit
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
    </Box>
  );
}
