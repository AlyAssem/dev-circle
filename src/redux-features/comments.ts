/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { User } from './users';

interface ValidationErrors {
  errorMessage: string;
}

export interface IComment {
  id: string;
  userId: string;
  postId: string;
  text: string;
  createdAt: string;
  userInfo: User;
}

interface commentsState {
  error: string | null | undefined;
  isLoading: boolean | undefined;
  comments: Array<IComment> | [];
}

const initialState: commentsState = {
  comments: [],
  error: null,
  isLoading: false,
};

export const getPostComments = createAsyncThunk<
  // Return type of the payload creator
  Array<IComment>,
  //   type of postId used as  an argument to async function.
  string,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/:postId/getComments', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ comments: Array<IComment> }>(
      `/api/posts/${postId}/comments`
    );

    return response.data.comments;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // The `builder` callback form is used here
    // because it provides correctly typed reducers from the action creators
    builder.addCase(getPostComments.fulfilled, (state, { payload }) => {
      state.comments = payload;
      state.isLoading = false;
    });

    builder.addCase(getPostComments.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getPostComments.rejected, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });
  },
});

export default commentsSlice.reducer;
