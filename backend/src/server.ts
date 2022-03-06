import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import SocketServer from './socketServer';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

const app = express();

dotenv.config();
connectDB();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// socket configs.
const httpServer = createServer(app);
// eslint-disable-next-line import/order
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  SocketServer(socket);
});

app.get('/', (_, res) => {
  res.send('API IS RUNNING...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running in ${process.env.PORT} mode on port ${PORT}`);
});
