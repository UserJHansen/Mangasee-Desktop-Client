import { JSONSchema } from 'json-schema-typed';

const storage: Record<string, JSONSchema> = {
  email: {
    type: 'string',
    format: 'email',
  },
  sessionID: {
    type: 'string',
  },
};

export default storage;
