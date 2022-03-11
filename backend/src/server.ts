import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer as httpCreateServer } from 'http';

import createServer from './utils/createServer';
import SocketServer from './socketServer';
import { connectDB } from './config/db';
import { notFound, errorHandler } from './middleware/errorMiddleware';

const app = createServer();

dotenv.config();
connectDB();

// socket configs.
const httpServer = httpCreateServer(app);
// eslint-disable-next-line import/order
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
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
