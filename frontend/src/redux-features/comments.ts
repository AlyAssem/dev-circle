/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { IComment } from '../interfaces';

interface ValidationErrors {
  errorMessage: string;
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
>('comments/getComments', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ comments: Array<IComment> }>(
      `/api/posts/${postId}/comments`
    );

    return response.data.comments;
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const createPostComment = createAsyncThunk<
  // Return type of the payload creator
  IComment,
  //   type of commentData used as  an argument to async function.
  { postId: string; text: string },
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>(
  '/comments/createComment',
  async (commentData, { getState, rejectWithValue }) => {
    const {
      users: { userInfo },
    } = getState() as any;

    try {
      const { postId, text } = commentData;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.post<{ comment: IComment }>(
        '/api/comments',
        {
          postId,
          text,
        },
        config
      );

      return response.data.comment;
    } catch (err: any) {
      const error: AxiosError<ValidationErrors> = err;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const editComment = createAsyncThunk<
  // Return type of the payload creator
  IComment,
  //   type of comment used as an argument to async function.
  { text: string; id: number },
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('/comments/editComment', async (comment, { getState, rejectWithValue }) => {
  const {
    users: { userInfo },
  } = getState() as any;

  try {
    const { id, text } = comment;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const response = await axios.put<{ message: string; comment: IComment }>(
      `/api/comments/${id}`,
      {
        text,
      },
      config
    );

    return response.data.comment;
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const deleteComment = createAsyncThunk<
  // Return type of the payload creator
  IComment,
  // type of data used as an argument to async function.
  { commentId: number; postId: string },
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('/comments/deleteComment', async (data, { getState, rejectWithValue }) => {
  const {
    users: { userInfo },
  } = getState() as any;

  try {
    const { commentId, postId } = data;

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      data: {
        postId,
      },
    };

    const response = await axios.delete<{ message: string; comment: IComment }>(
      `/api/comments/${commentId}`,
      config
    );

    return response.data.comment;
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

    builder.addCase(createPostComment.fulfilled, (state, { payload }) => {
      state.comments = [payload, ...state.comments];
    });
    builder.addCase(createPostComment.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(editComment.fulfilled, (state, { payload }) => {
      const { id, text } = payload;
      state.comments = state.comments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, id, text };
        }
        return comment;
      });
    });

    builder.addCase(editComment.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(deleteComment.fulfilled, (state, { payload }) => {
      const { id } = payload;
      state.comments = state.comments.filter((comment) => comment.id !== id);
    });

    builder.addCase(deleteComment.rejected, (state, action) => {
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
