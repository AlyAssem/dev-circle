import { Socket } from 'socket.io';

interface IuserSocketObject {
  userId: string;
  socketId: string;
}

let userSocketObjects: Array<IuserSocketObject> = [];

const addUser = (userId: string, socketId: string) => {
  const wasSocketAssignedtToUser = userSocketObjects.some(
    (userSocketObj) => userSocketObj.userId === userId
  );

  if (!wasSocketAssignedtToUser) {
    userSocketObjects.push({
      userId,
      socketId,
    });
  }
};

const getUser = (userId: string) =>
  userSocketObjects.find((user) => user.userId === userId);

const deleteUser = (socketId: string) => {
  userSocketObjects = userSocketObjects.filter(
    (userSocketObj) => userSocketObj.socketId !== socketId
  );
};

const SocketServer = (socket: Socket) => {
  // Connect - Disconnect
  socket.on('userJoined', ({ userId }) => {
    addUser(userId, socket.id);

    console.log(`${socket.id} joined`);
    console.log('USERS', userSocketObjects);
  });

  socket.on(
    'sendNotification',
    ({ postTopic, senderMail, senderId, receiverId, type }) => {
      const receiverUser = getUser(receiverId);

      socket.to(receiverUser?.socketId || '').emit('getNotification', {
        postTopic,
        senderMail,
        senderId,
        type,
      });
    }
  );

  socket.on('disconnect', () => {
    deleteUser(socket.id);

    console.log(`${socket.id} left`);
    console.log('USERS', userSocketObjects);
  });
};

export default SocketServer;
