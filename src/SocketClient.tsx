import React, { useEffect } from 'react';
import { useAppSelector } from './redux-features/hooks';

const SocketClient: React.FC = () => {
  const socket = useAppSelector((state) => state.globals.socket);
  const user = useAppSelector((state) => state.users.userInfo);

  useEffect(() => {
    if (socket?.id && user?.id) {
      socket.emit('userJoined', { userId: user.id });
    }
  }, [socket, user.id]);

  return <></>;
};

export default SocketClient;
