import { createConnection, getConnectionOptions } from 'typeorm';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';
import { Like } from '../entities/Like';
import { Notification } from '../entities/Notification';

export const createTypeormConn = async () => {
  // grab options from ormconfig best on node_env.
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  return createConnection({
    ...connectionOptions,
    name: 'default',
    entities: [User, Post, Comment, Like, Notification],
  });
};
