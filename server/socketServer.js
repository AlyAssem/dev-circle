let userSocketObjects = [];
const SocketServer = (socket) => {
  // Connect - Disconnect
  socket.on('userJoined', ({ userId }) => {
    const wasSocketAssignedtToUser = userSocketObjects.some(
      (userSocketObj) => userSocketObj.userId === userId
    );

    if (!wasSocketAssignedtToUser) {
      userSocketObjects.push({
        userId,
        socketId: socket.id,
      });
    }

    console.log(`${socket.id} joined`);
    console.log('USERS', userSocketObjects);
  });

  socket.on('disconnect', () => {
    userSocketObjects = userSocketObjects.filter(
      (userSocketObj) => userSocketObj.socketId !== socket.id
    );

    console.log(`${socket.id} left`);
    console.log('USERS', userSocketObjects);
  });

  //   socket.on('joinUser', (user) => {
  //     users.push({
  //       id: user.id,
  //       socketId: socket.id,
  //       followers: user.followers,
  //     });
  //   });

  //   socket.on('disconnect', () => {});
};

module.exports = SocketServer;
