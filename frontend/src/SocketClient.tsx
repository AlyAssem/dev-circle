import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useAppSelector } from './redux-features/hooks';

interface ISocketClientProps {
  socket: Socket;
}

const SocketClient: React.FC<ISocketClientProps> = ({ socket }) => {
  const user = useAppSelector((state) => state.users.userInfo);

  useEffect(() => {
    if (socket?.id && user?.id) {
      socket.emit('userJoined', { userId: user.id });
    }
  }, [socket, user.id]);

  return <></>;
};

export default SocketClient;
