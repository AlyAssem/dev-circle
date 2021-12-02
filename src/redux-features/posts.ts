/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface User {
  id: string;
  userName: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  postUserInfo: User;
}

interface PostsState {
  error: string | null | undefined;
  isLoading: boolean | undefined;
  posts: Array<Post> | [];
}
const initialState: PostsState = {
  posts: [],
  error: null,
  isLoading: false,
};

interface ValidationErrors {
  errorMessage: string;
}

export const getPosts = createAsyncThunk<
  // Return type of the payload creator
  Array<Post>,
  undefined,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/getPosts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ posts: Array<Post> }>('/api/posts');

    return response.data.posts;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // The `builder` callback form is used here
    // because it provides correctly typed reducers from the action creators
    builder.addCase(getPosts.fulfilled, (state, { payload }) => {
      state.posts = payload;
      state.isLoading = false;
    });

    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getPosts.rejected, (state, action) => {
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

export default postsSlice.reducer;
