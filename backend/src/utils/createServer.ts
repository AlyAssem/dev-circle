import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from '../routes/userRoutes';
import postRoutes from '../routes/postRoutes';
import commentRoutes from '../routes/commentRoutes';

dotenv.config();

const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
    })
  );

  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/comments', commentRoutes);

  return app;
};

export default createServer;
