/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const initialState: { socket: DefaultEventsMap } = {
  socket: {},
};

const globalsSlice = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    setSocket: (state, { payload }) => {
      state.socket = payload;
    },
    deleteSocket: (state) => {
      state.socket = {};
    },
  },
});

export const { setSocket, deleteSocket } = globalsSlice.actions;

export default globalsSlice.reducer;
