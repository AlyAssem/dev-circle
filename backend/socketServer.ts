import { Socket } from 'socket.io';
import { Notification } from './entities/Notification';

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
    async ({ postId, senderId, recipientId, type }) => {
      console.log('SENDNOTIFICATION RECEIVED FROM SERVER');
      const isNotificationStored = (await Notification.findOne({
        sender: senderId,
        recipient: recipientId,
        post: postId,
      })) as Notification;

      if (!isNotificationStored) {
        const notification = Notification.create({
          sender: senderId,
          recipient: recipientId,
          post: postId,
          type,
        });

        await notification.save();
      }

      const recipientUser = getUser(recipientId);
      const storedNotification = await Notification.findOne(
        { sender: senderId, post: postId },
        { relations: ['sender', 'post'] }
      );

      socket.to(recipientUser?.socketId || '').emit('getNotification', {
        id: storedNotification?.id,
        read: storedNotification?.read,
        post: storedNotification?.post,
        sender: storedNotification?.sender,
        recipientId,
        type,
        created_at: storedNotification?.created_at,
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
