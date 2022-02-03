let userSocketObjects = [];

const addUser = (userId, socketId) => {
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

const getUser = (userId) =>
  userSocketObjects.find((user) => user.userId === userId);

const deleteUser = (socketId) => {
  userSocketObjects = userSocketObjects.filter(
    (userSocketObj) => userSocketObj.socketId !== socketId
  );
};

const SocketServer = (socket) => {
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

      socket.to(receiverUser.socketId).emit('getNotification', {
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
