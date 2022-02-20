/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { IComment, IPost } from '../interfaces';

interface PostsState {
  error: string | null | undefined;
  isPostLoading: boolean | undefined;
  posts: Array<IPost> | [];
  postInfo: Partial<IPost>;
  comments: Array<IComment> | [];
  isCommentLoading: boolean | undefined;
}
const initialState: PostsState = {
  posts: [],
  postInfo: {},
  error: null,
  isPostLoading: false,
  comments: [],
  isCommentLoading: false,
};

interface ValidationErrors {
  errorMessage: string;
}

export const likePost = createAsyncThunk<
  IPost,
  // action function parameter object type
  { postId: string },
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/likePost', async ({ postId }, { getState, rejectWithValue }) => {
  try {
    const {
      users: { userInfo },
    } = getState() as any;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const response = await axios.get<{ post: IPost }>(
      `/api/posts/${postId}/like`,
      config
    );

    return response.data.post;
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const unlikePost = createAsyncThunk<
  IPost,
  // action function parameter object type
  { postId: string },
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/unlikePost', async ({ postId }, { getState, rejectWithValue }) => {
  try {
    const {
      users: { userInfo },
    } = getState() as any;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const response = await axios.get<{ post: IPost }>(
      `/api/posts/${postId}/unlike`,
      config
    );

    return response.data.post;
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const getPosts = createAsyncThunk<
  // Return type of the payload creator
  Array<IPost>,
  undefined,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/getPosts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ posts: Array<IPost> }>('/api/posts');

    return response.data.posts;
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const getPost = createAsyncThunk<
  // Return type of the payload creator
  IPost,
  // action function parameter object type
  { postId: string | undefined },
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/getPost', async ({ postId }, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ post: IPost }>(`/api/posts/${postId}`);

    return response.data.post;
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const createPost = createAsyncThunk<
  // Return type of the payload creator
  IPost,
  // postData object type
  Partial<IPost>, // it won't have the likeCounts and commentCounts
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/createPost', async (postData, { getState, rejectWithValue }) => {
  try {
    const { id, title, content, user } = postData;

    const {
      users: { userInfo },
    } = getState() as any;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const response = await axios.post<{
      post: IPost;
    }>(
      '/api/posts',
      {
        id,
        title,
        content,
        user,
        like_count: 0,
        comment_count: 0,
      },
      config
    );

    return response.data.post;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const editPost = createAsyncThunk<
  // Return type of the payload creator
  IPost,
  // postData object type
  Partial<IPost>, // it won't have the likeCounts and commentCounts
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/editPost', async (postData, { getState, rejectWithValue }) => {
  try {
    const { id, title, content, user } = postData;

    const {
      users: { userInfo },
    } = getState() as any;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const response = await axios.put<{
      post: IPost;
    }>(
      `/api/posts/${id}`,
      {
        id,
        title,
        content,
        user,
      },
      config
    );

    return response.data.post;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const deletePost = createAsyncThunk<
  // Return type of the payload creator
  { message: string; postId: string },
  // postData object type
  string,
  {
    // Optional fields for defining thunkApi field types
    rejectValue: ValidationErrors;
  }
>('posts/deletePost', async (postId, { getState, rejectWithValue }) => {
  try {
    const {
      users: { userInfo },
    } = getState() as any;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const response = await axios.delete(`/api/posts/${postId}`, config);

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

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

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    removePostInfo: (state) => {
      state.postInfo = {};
    },
  },
  extraReducers: (builder) => {
    // The `builder` callback form is used here
    // because it provides correctly typed reducers from the action creators
    builder.addCase(getPosts.fulfilled, (state, { payload }) => {
      state.posts = payload;
      state.isPostLoading = false;
    });

    builder.addCase(getPosts.pending, (state) => {
      state.isPostLoading = true;
    });

    builder.addCase(getPosts.rejected, (state, action) => {
      state.isPostLoading = false;
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(getPost.fulfilled, (state, { payload }) => {
      state.postInfo = payload;
    });
    builder.addCase(getPost.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(createPost.fulfilled, (state, { payload }) => {
      state.posts = [payload, ...state.posts];
    });

    builder.addCase(createPost.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(editPost.fulfilled, (state, { payload }) => {
      const { id } = payload;
      state.posts = state.posts.map((post) => {
        if (post.id === id) {
          return { ...payload };
        }
        return post;
      });
    });

    builder.addCase(editPost.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(deletePost.fulfilled, (state, { payload }) => {
      const { postId } = payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
    });

    builder.addCase(deletePost.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(getPostComments.fulfilled, (state, { payload }) => {
      state.posts = state.posts.map((post) => ({
        ...post,
        comments: payload,
      }));
      state.isCommentLoading = false;
    });
    builder.addCase(getPostComments.pending, (state) => {
      state.isCommentLoading = true;
    });
    builder.addCase(getPostComments.rejected, (state, action) => {
      state.isCommentLoading = false;
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType
        // in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });

    builder.addCase(createPostComment.fulfilled, (state, { payload }) => {
      const { post } = payload;
      state.posts = state.posts.map((p) => {
        if (p.id === post.id) {
          // if the post in redux state is the post in the comment created, then add the comment to post comments.
          return { ...p, comments: [...p.comments, payload] };
        }
        return p;
      });
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
      const { id, text, post } = payload;

      state.posts = state.posts.map((p) => {
        if (p.id === post.id) {
          // The post that contains the comment.
          return {
            ...p,
            comments: p.comments.map((c) => {
              if (c.id === id) {
                // the comment being edited.
                return { ...c, text };
              }
              return c;
            }),
          };
        }
        return p;
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
      const { id, post } = payload;

      state.posts = state.posts.map((p) => {
        if (p.id === post.id) {
          // The post that contains the comment.
          return {
            ...p,
            comments: p.comments.filter((c) => c.id !== id), // delete the comment from the post comments.
          };
        }
        return p;
      });
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

export const { removePostInfo } = postsSlice.actions;

export default postsSlice.reducer;
